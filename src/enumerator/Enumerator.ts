import { KeyValuePair } from "../dictionary/KeyValuePair";
import { Enumerable } from "./Enumerable";
import { Group } from "./Group";
import { CircularLinkedList } from "../list/CircularLinkedList";
import { CircularQueue } from "../queue/CircularQueue";
import { Dictionary } from "../dictionary/Dictionary";
import { EnumerableSet } from "../set/EnumerableSet";
import { ImmutableCircularQueue } from "../queue/ImmutableCircularQueue";
import { ImmutableDictionary } from "../dictionary/ImmutableDictionary";
import { ImmutableList } from "../list/ImmutableList";
import { ImmutablePriorityQueue } from "../queue/ImmutablePriorityQueue";
import { ImmutableQueue } from "../queue/ImmutableQueue";
import { ImmutableSet } from "../set/ImmutableSet";
import { ImmutableSortedDictionary } from "../dictionary/ImmutableSortedDictionary";
import { ImmutableSortedSet } from "../set/ImmutableSortedSet";
import { ImmutableStack } from "../stack/ImmutableStack";
import { LinkedList } from "../list/LinkedList";
import { List } from "../list/List";
import { PriorityQueue } from "../queue/PriorityQueue";
import { Queue } from "../queue/Queue";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import { SortedSet } from "../set/SortedSet";
import { Stack } from "../stack/Stack";

import type { ILookup } from "../lookup/ILookup";
import { Lookup } from "../lookup/Lookup";
import { Accumulator } from "../shared/Accumulator";
import { Comparators } from "../shared/Comparators";
import { DimensionMismatchException } from "../shared/DimensionMismatchException";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate, IndexedTypePredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { IndexOutOfBoundsException } from "../shared/IndexOutOfBoundsException";
import { InferredType } from "../shared/InferredType";
import { InsufficientElementException } from "../shared/InsufficientElementException";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { JoinSelector } from "../shared/JoinSelector";
import { MedianTieStrategy } from "../shared/MedianTieStrategy";
import { MoreThanOneElementException } from "../shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../shared/NoElementsException";
import { NoMatchingElementException } from "../shared/NoMatchingElementException";
import { ClassType, ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { PercentileStrategy } from "../shared/PercentileStrategy";
import { PipeOperator } from "../shared/PipeOperator";
import { Predicate, TypePredicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { UnpackIterableTuple } from "../shared/UnpackIterableTuple";
import { ZipManyZipper, Zipper } from "../shared/Zipper";
import { asSized } from "../shared/internal/collectionAccess";
import { identityKey, isDefaultEquality } from "../shared/internal/membership";
import { shuffleInPlace } from "../utils/shuffleInPlace";
import { buildGroupsSync, JoinGroups, processOuterElement } from "./helpers/joinHelpers";
import { KeySet, type SortedKeysFactory } from "./helpers/keySetHelpers";
import { findMedian } from "./helpers/medianHelpers";
import { findPercentile } from "./helpers/percentileHelpers";
import { permutationsGenerator } from "./helpers/permutationsGenerator";
import {
    accumulatePairStatsFromIterables,
    accumulatePairStatsFromSingleIterable,
    accumulateSingleStats,
    findCorrelation,
    resolveNumberSelector
} from "./helpers/statisticsHelpers";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

// A persistent list of the parts that append, concat and prepend added around a base sequence.
type ChainPart<TElement> = { readonly next: ChainPart<TElement> | null; readonly part: Iterable<TElement> } | null;

type Chain<TElement> = {
    readonly back: ChainPart<TElement>;
    readonly base: Iterable<TElement>;
    readonly front: ChainPart<TElement>;
};

export class Enumerator<TElement> implements IOrderedEnumerable<TElement> {
    // Set when this enumerator only joins parts around a base, so further joins extend the same chain.
    #chain: Chain<TElement> | undefined;
    private static readonly DIMENSION_MISMATCH_EXCEPTION = new DimensionMismatchException();
    private static readonly MORE_THAN_ONE_ELEMENT_EXCEPTION = new MoreThanOneElementException();
    private static readonly MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION = new MoreThanOneMatchingElementException();
    private static readonly NO_ELEMENTS_EXCEPTION = new NoElementsException();
    private static readonly NO_MATCHING_ELEMENT_EXCEPTION = new NoMatchingElementException();

    public constructor(private readonly iterable: () => Iterable<TElement>) {
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.iterable()[Symbol.iterator]();
    }

    public aggregate(accumulator: Accumulator<TElement, TElement>): TElement;
    public aggregate<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed: TAccumulate): TAccumulate;
    public aggregate<TAccumulate, TResult>(accumulator: Accumulator<TElement, TAccumulate>, seed: TAccumulate, resultSelector: Selector<TAccumulate, TResult>): TResult;
    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            const iterator = this[Symbol.iterator]();
            const first = iterator.next();
            if (first.done) {
                throw Enumerator.NO_ELEMENTS_EXCEPTION;
            }
            accumulatedValue = first.value as unknown as TAccumulate;
            let next = iterator.next();
            while (!next.done) {
                accumulatedValue = accumulator(accumulatedValue, next.value);
                next = iterator.next();
            }
        } else {
            accumulatedValue = seed;
            for (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        }
        if (resultSelector) {
            return resultSelector(accumulatedValue);
        } else {
            return accumulatedValue;
        }
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>> {
        keyComparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, keyComparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.aggregate(accumulator, seedSelector instanceof Function ? seedSelector(g.key) : seedSelector)));
    }

    public all(predicate: Predicate<TElement>): boolean {
        for (const d of this) {
            if (!predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public any(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !this[Symbol.iterator]().next().done;
        }
        for (const element of this) {
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }

    public append(element: TElement): IEnumerable<TElement> {
        const chain = this.#chainOrSelf();
        return Enumerator.#chained({ ...chain, back: { next: chain.back, part: [element] } });
    }

    public atLeast(count: number, predicate?: Predicate<TElement>): boolean {
        if (count < 0) {
            throw new InvalidArgumentException("Count must be greater than or equal to 0.", "count");
        }

        let actualCount = 0;
        for (const item of this) {
            if (predicate == null || predicate(item)) {
                actualCount++;
            }
            if (actualCount >= count) {
                return true;
            }
        }
        return actualCount >= count;
    }

    public atMost(count: number, predicate?: Predicate<TElement>): boolean {
        if (count < 0) {
            throw new InvalidArgumentException("Count must be greater than or equal to 0.", "count");
        }

        let actualCount = 0;
        for (const item of this) {
            if (predicate == null || predicate(item)) {
                actualCount++;
            }
            if (actualCount > count) {
                return false;
            }
        }
        return true;
    }

    public average(this: Iterable<number>): number;
    public average(selector: Selector<TElement, number>): number;
    public average(selector?: Selector<TElement, number>): number {
        let total: number = 0;
        let count: number = 0;
        for (const d of this) {
            total += selector?.(d) ?? d as unknown as number;
            count++;
        }
        if (count === 0) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        return total / count;
    }

    public cartesian<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]> {
        return new Enumerator(() => this.cartesianGenerator(iterable));
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return new Enumerator<TResult>(() => this.castGenerator());
    }

    #chainOrSelf(): Chain<TElement> {
        return this.#chain ?? { back: null, base: this, front: null };
    }

    public chunk(size: number): IEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new Enumerator(() => this.chunkGenerator(size));
    }

    public combinations(size?: number): IEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 0) {
            throw new InvalidArgumentException("Size must be greater than or equal to 0.", "size");
        }
        return new Enumerator(() => this.combinationsGenerator(size));
    }

    public compact(): IEnumerable<NonNullable<TElement>> {
        return new Enumerator(() => this.compactGenerator());
    }

    public concat(iterable: Iterable<TElement>): IEnumerable<TElement> {
        const chain = this.#chainOrSelf();
        return Enumerator.#chained({ ...chain, back: { next: chain.back, part: iterable } });
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        for (const e of this) {
            if (comparator(e, element)) {
                return true;
            }
        }
        return false;
    }

    public correlation<TSecond>(iterable: Iterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>): number {
        const leftSelector = resolveNumberSelector(selector);
        const rightSelector = resolveNumberSelector(otherSelector);
        const stats = accumulatePairStatsFromIterables(
            this,
            iterable,
            leftSelector,
            rightSelector,
            Enumerator.DIMENSION_MISMATCH_EXCEPTION
        );
        return findCorrelation(stats);
    }

    public correlationBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>): number {
        const stats = accumulatePairStatsFromSingleIterable(this, leftSelector, rightSelector);
        return findCorrelation(stats);
    }

    public count(predicate?: Predicate<TElement>): number {
        let count: number = 0;
        if (!predicate) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const _ of this) {
                ++count;
            }
            return count;
        }
        for (const item of this) {
            if (predicate(item)) {
                ++count;
            }
        }
        return count;
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>> {
        comparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, comparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.count()));
    }

    public covariance<TSecond>(iterable: Iterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>, sample: boolean = true): number {
        const leftSelector = resolveNumberSelector(selector);
        const rightSelector = resolveNumberSelector(otherSelector);
        const stats = accumulatePairStatsFromIterables(
            this,
            iterable,
            leftSelector,
            rightSelector,
            Enumerator.DIMENSION_MISMATCH_EXCEPTION
        );

        if (stats.count < 2) {
            throw new InsufficientElementException("Covariance requires at least two pairs of elements.");
        }

        return sample
            ? stats.sumSqXY / (stats.count - 1)
            : stats.sumSqXY / stats.count;
    }

    public covarianceBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>, sample: boolean = true): number {
        const stats = accumulatePairStatsFromSingleIterable(this, leftSelector, rightSelector);

        if (stats.count < 2) {
            throw new InsufficientElementException("Covariance requires at least two pairs of elements.");
        }

        return sample
            ? stats.sumSqXY / (stats.count - 1)
            : stats.sumSqXY / stats.count;
    }

    public cycle(count?: number): IEnumerable<TElement> {
        return new Enumerator(() => this.cycleGenerator(count));
    }

    public defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null> {
        return new Enumerator(() => this.defaultIfEmptyGenerator(value));
    }

    public disjoint<TSecond>(iterable: Iterable<TSecond>, comparator?: EqualityComparator<TElement | TSecond>): boolean {
        comparator ??= Comparators.equalityComparator as EqualityComparator<TElement | TSecond>;
        if (isDefaultEquality(comparator)) {
            const set = new Set<TElement | TSecond>(this);
            if (set.size === 0) {
                return true;
            }
            for (const element of iterable) {
                if (set.has(element)) {
                    return false;
                }
            }
            return true;
        }

        const leftArray = Array.from(this);
        if (leftArray.length === 0) {
            return true;
        }

        for (const rightElement of iterable) {
            for (const leftElement of leftArray) {
                if (comparator(leftElement, rightElement)) {
                    return false;
                }
            }
        }
        return true;
    }

    public disjointBy<TSecond, TKey, TSecondKey>(iterable: Iterable<TSecond>, keySelector: Selector<TElement, TKey>, otherKeySelector: Selector<TSecond, TSecondKey>, keyComparator?: EqualityComparator<TKey | TSecondKey>): boolean {
        const keyComparer = keyComparator ?? Comparators.equalityComparator as EqualityComparator<TKey | TSecondKey, TSecondKey | TKey>;
        if (isDefaultEquality(keyComparer)) {
            const leftKeys = new Set<TKey | TSecondKey>();
            for (const element of this) {
                leftKeys.add(keySelector(element));
            }
            if (leftKeys.size === 0) {
                return true;
            }
            const rightKeys = Enumerable.from(iterable).select(otherKeySelector);
            for (const key of rightKeys) {
                if (leftKeys.has(key)) {
                    return false;
                }
            }
            return true;
        }

        const leftArray = Enumerable.from(this).select(keySelector).toArray();
        const rightArray = Enumerable.from(iterable).select(otherKeySelector).toArray();
        const [small, large] = leftArray.length < rightArray.length ? [leftArray, rightArray] : [rightArray, leftArray];

        for (const key of small) {
            for (const otherKey of large) {
                if (keyComparer(key, otherKey)) {
                    return false;
                }
            }
        }
        return true;
    }

    public distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator as EqualityComparator<TElement>;
        return new Enumerator(() => this.unionGenerator(Enumerable.empty(), keyCompare));
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator as EqualityComparator<TKey>;
        return new Enumerator(() => this.unionByGenerator(Enumerable.empty(), keySelector, keyCompare));
    }

    public distinctUntilChanged(comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        const comparer = comparator ?? Comparators.equalityComparator;
        return new Enumerator(() => this.distinctUntilChangedGenerator(k => k, comparer));
    }

    public distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        const comparer = keyComparator ?? Comparators.equalityComparator;
        return new Enumerator(() => this.distinctUntilChangedGenerator(keySelector, comparer));
    }

    public elementAt(index: number): TElement {
        if (index < 0) {
            throw new IndexOutOfBoundsException(index);
        }
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        throw new IndexOutOfBoundsException(index);
    }

    public elementAtOrDefault(index: number): TElement | null {
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        return null;
    }

    public exactly(count: number, predicate?: Predicate<TElement>): boolean {
        if (count < 0) {
            throw new InvalidArgumentException("Count must be greater than or equal to 0.", "count");
        }

        let actualCount = 0;
        for (const item of this) {
            if (predicate == null || predicate(item)) {
                actualCount++;
            }
            if (actualCount > count) {
                return false;
            }
        }
        return actualCount === count;
    }

    public except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.exceptGenerator(iterable, comparator));
    }

    public exceptBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.exceptByGenerator(iterable, keySelector, keyComparator));
    }

    public first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public first(predicate?: Predicate<TElement>): TElement;
    public first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        for (const item of this) {
            if (!predicate || predicate(item)) {
                return item;
            }
        }
        throw predicate ? Enumerator.NO_MATCHING_ELEMENT_EXCEPTION : Enumerator.NO_ELEMENTS_EXCEPTION;
    }

    public firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public firstOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        for (const item of this) {
            if (!predicate || predicate(item)) {
                return item;
            }
        }
        return null;
    }

    public forEach(action: IndexedAction<TElement>): void {
        let index = 0;
        for (const item of this) {
            action(item, index++);
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>, hashSelector?: Selector<TElement, PropertyKey>): IEnumerable<IGroup<TKey, TElement>> {
        return new Enumerator(() => this.groupByGenerator(keySelector, keyComparator, hashSelector));
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.groupJoinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator));
    }

    public index(): IEnumerable<[number, TElement]> {
        return new Enumerator<[number, TElement]>(() => this.indexGenerator());
    }

    public interleave<TSecond>(iterable: Iterable<TSecond>): IEnumerable<TElement | TSecond> {
        return new Enumerator(() => this.interleaveGenerator(iterable));
    }

    public intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.intersectGenerator(iterable, comparator));
    }

    public intersectBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.intersectByGenerator(iterable, keySelector, keyComparator));
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator> {
        return new Enumerator(() => this.intersperseGenerator(separator));
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.joinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, false));
    }

    public last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public last(predicate?: Predicate<TElement>): TElement;
    public last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        let found = false;
        let result: TElement | null = null;

        for (const item of this) {
            if (!predicate || predicate(item)) {
                result = item;
                found = true;
            }
        }

        if (!found) {
            throw predicate
                ? Enumerator.NO_MATCHING_ELEMENT_EXCEPTION
                : Enumerator.NO_ELEMENTS_EXCEPTION;
        }

        return result as TElement;
    }

    public lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public lastOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        let result: TElement | null = null;
        for (const item of this) {
            if (!predicate || predicate(item)) {
                result = item;
            }
        }
        return result;
    }

    public leftJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.joinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, true));
    }

    public max(this: Iterable<number>): number;
    public max(selector: Selector<TElement, number>): number;
    public max(selector?: Selector<TElement, number>): number {
        let max: number | null = null;
        if (!selector) {
            for (const item of this) {
                max = Math.max(max ?? Number.NEGATIVE_INFINITY, item as unknown as number);
            }
            if (max == null) {
                throw Enumerator.NO_ELEMENTS_EXCEPTION;
            }
            return max;
        } else {
            for (const item of this) {
                max = Math.max(max ?? Number.NEGATIVE_INFINITY, selector(item));
            }
            if (max == null) {
                throw Enumerator.NO_ELEMENTS_EXCEPTION;
            }
            return max;
        }
    }

    public maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        let max: TElement | null = null;
        let maxKey: TKey | null = null;
        for (const item of this) {
            const key = keySelector(item);
            if (maxKey == null || (comparator ?? Comparators.orderComparator)(key, maxKey) > 0) {
                max = item;
                maxKey = key;
            }
        }
        if (max == null) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        return max;
    }

    public median(selector?: Selector<TElement, number>, tie?: MedianTieStrategy): number {
        const numberSelector = selector ?? ((item: TElement): number => item as unknown as number);
        const numericData = this.select(numberSelector).toArray();
        return findMedian(numericData, tie);
    }

    public min(this: Iterable<number>): number;
    public min(selector: Selector<TElement, number>): number;
    public min(selector?: Selector<TElement, number>): number {
        let min: number | null = null;
        if (!selector) {
            for (const item of this) {
                min = Math.min(min ?? Number.POSITIVE_INFINITY, item as unknown as number);
            }
            if (min == null) {
                throw Enumerator.NO_ELEMENTS_EXCEPTION;
            }
            return min;
        } else {
            for (const item of this) {
                min = Math.min(min ?? Number.POSITIVE_INFINITY, selector(item));
            }
            if (min == null) {
                throw Enumerator.NO_ELEMENTS_EXCEPTION;
            }
            return min;
        }
    }

    public minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        let min: TElement | null = null;
        let minKey: TKey | null = null;
        for (const item of this) {
            const key = keySelector(item);
            if (minKey == null || (comparator ?? Comparators.orderComparator)(key, minKey) < 0) {
                min = item;
                minKey = key;
            }
        }
        if (min == null) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        return min;
    }

    public mode<TKey>(keySelector?: Selector<TElement, TKey>): TElement {
        const modes = this.multimode(keySelector);
        if (modes.none()) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        return modes.first();
    }

    public modeOrDefault<TKey>(keySelector?: Selector<TElement, TKey>): TElement | null {
        const modes = this.multimode(keySelector);
        return modes.firstOrDefault();
    }

    public multimode<TKey>(keySelector?: Selector<TElement, TKey>): IEnumerable<TElement> {
        const selector = keySelector ?? ((item: TElement): TKey => item as unknown as TKey);
        return new Enumerator(() => this.multimodeGenerator(selector));
    }

    public none(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !!this[Symbol.iterator]().next().done;
        }
        for (const d of this) {
            if (predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return new Enumerator<InferredType<TResult>>(() => this.ofTypeGenerator(type));
    }

    public order(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, k => k, true, false, comparator);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, true, false, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, false, false, comparator);
    }

    public orderDescending(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, k => k, false, false, comparator);
    }

    public pairwise(resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return new Enumerator(() => this.pairwiseGenerator(resultSelector ??= (first, second) => [first, second]));
    }

    public partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];
    public partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];
    public partition<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): [IEnumerable<TElement>, IEnumerable<TElement>] | [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] {
        const trueItems = new List<TElement>();
        const falseItems = new List<TElement>();
        for (const item of this) {
            if (predicate(item)) {
                trueItems.add(item);
            } else {
                falseItems.add(item);
            }
        }
        return [new Enumerable(trueItems), new Enumerable(falseItems)] as [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public percentile(this: Iterable<number>, percent: number, strategy?: PercentileStrategy): number;
    public percentile(percent: number, selector: Selector<TElement, number>, strategy?: PercentileStrategy): number;
    public percentile(percent: number, selectorOrStrategy?: Selector<TElement, number> | PercentileStrategy, strategy?: PercentileStrategy): number {
        const selector = typeof selectorOrStrategy === "function" ? selectorOrStrategy : undefined;
        const actualStrategy = typeof selectorOrStrategy === "function" ? strategy : selectorOrStrategy ?? strategy;
        const numberSelector = selector ?? ((item: TElement): number => item as unknown as number);
        const numericData = this.select(numberSelector).toArray();
        return findPercentile(numericData, percent, actualStrategy);
    }

    public permutations(size?: number): IEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new Enumerator(() => this.permutationsGenerator(size));
    }

    public pipe<TResult>(operator: PipeOperator<TElement, TResult>): TResult {
        return operator(this);
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        const chain = this.#chainOrSelf();
        return Enumerator.#chained({ ...chain, front: { next: chain.front, part: [element] } });
    }

    public product(this: Iterable<number>): number;
    public product(selector: Selector<TElement, number>): number;
    public product(selector?: Selector<TElement, number>): number {
        let total: number = 1;
        let hasElements = false;
        for (const d of this) {
            total *= selector?.(d) ?? d as unknown as number;
            hasElements = true;
        }
        if (!hasElements) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        return total;
    }

    public reverse(): IEnumerable<TElement> {
        return new Enumerator(() => this.reverseGenerator());
    }

    public rightJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement | null, TInner, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.rightJoinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator));
    }

    public rotate(shift: number): IEnumerable<TElement> {
        return new Enumerator(() => this.rotateIterable(shift));
    }

    public scan(accumulator: Accumulator<TElement, TElement>): IEnumerable<TElement>;
    public scan<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed: TAccumulate): IEnumerable<TAccumulate>;
    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return new Enumerator(() => this.scanGenerator(accumulator, seed));
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult> {
        return new Enumerator<TResult>(() => this.selectGenerator(selector));
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return new Enumerator(() => this.selectManyGenerator(selector));
    }

    public sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        const iterator = this[Symbol.iterator]();
        const otherIterator = iterable[Symbol.iterator]();
        let first = iterator.next();
        let second = otherIterator.next();
        if (first.done && second.done) {
            return true;
        }
        while (!first.done && !second.done) {
            if (!comparator(first.value, second.value)) {
                return false;
            }
            first = iterator.next();
            second = otherIterator.next();
            if (first.done && second.done) {
                return true;
            }
        }
        return false;
    }

    public shuffle(): IEnumerable<TElement> {
        return new Enumerator(() => this.shuffleGenerator());
    }

    public single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public single(predicate?: Predicate<TElement>): TElement;
    public single<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        let result: TElement | null = null;
        let found = false;
        let hasAnyElements = false;

        for (const item of this) {
            hasAnyElements = true;
            if (!predicate || predicate(item)) {
                if (found) {
                    throw predicate
                        ? Enumerator.MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION
                        : Enumerator.MORE_THAN_ONE_ELEMENT_EXCEPTION;
                }
                result = item;
                found = true;
            }
        }

        if (!found) {
            throw !hasAnyElements
                ? Enumerator.NO_ELEMENTS_EXCEPTION
                : Enumerator.NO_MATCHING_ELEMENT_EXCEPTION;
        }

        return result as TElement;
    }

    public singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public singleOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public singleOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        let result: TElement | null = null;
        let found = false;

        for (const item of this) {
            if (!predicate || predicate(item)) {
                if (found) {
                    throw predicate
                        ? Enumerator.MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION
                        : Enumerator.MORE_THAN_ONE_ELEMENT_EXCEPTION;
                }
                result = item;
                found = true;
            }
        }
        return result;
    }

    public skip(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.skipGenerator(count));
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.skipLastGenerator(count));
    }

    public skipUntil<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public skipUntil(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public skipUntil<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return new Enumerator(() => this.skipUntilGenerator(predicate));
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerator(() => this.skipWhileGenerator(predicate));
    }

    public span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>];
    public span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];
    public span<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
        const span = new List<TElement>();
        const rest = new List<TElement>();
        let found = false;
        for (const item of this) {
            if (found) {
                rest.add(item);
            } else if (predicate(item)) {
                span.add(item);
            } else {
                found = true;
                rest.add(item);
            }
        }
        return [new Enumerable(span), new Enumerable(rest)] as [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public standardDeviation(selector?: Selector<TElement, number>, sample?: boolean): number {
        const variance = this.variance(selector, sample);
        return Number.isNaN(variance) ? variance : Math.sqrt(variance);
    }

    public step(step: number): IEnumerable<TElement> {
        if (step < 1) {
            throw new InvalidArgumentException("Step must be greater than 0.", "step");
        }
        return new Enumerator(() => this.stepGenerator(step));
    }

    public sum(this: Iterable<number>): number;
    public sum(selector: Selector<TElement, number>): number;
    public sum(selector?: Selector<TElement, number>): number {
        let total: number = 0;
        let hasElements = false;
        for (const d of this) {
            total += selector?.(d) ?? d as unknown as number;
            hasElements = true;
        }
        if (!hasElements) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        return total;
    }

    public take(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.takeGenerator(count));
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.takeLastGenerator(count));
    }

    public takeUntil<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public takeUntil(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public takeUntil<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return new Enumerator(() => this.takeUntilGenerator(predicate));
    }

    public takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public takeWhile<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return new Enumerator(() => this.takeWhileGenerator(predicate as IndexedPredicate<TElement>));
    }

    public tap(action: IndexedAction<TElement>): IEnumerable<TElement> {
        return new Enumerator(() => this.tapGenerator(action));
    }

    public thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, true, true, comparator);
    }

    public thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, false, true, comparator);
    }

    public toArray(): TElement[] {
        // Array.from copies an array without the iterator protocol.
        return Array.from(this.iterable());
    }

    public toCircularLinkedList(comparator?: EqualityComparator<TElement, TElement>): CircularLinkedList<TElement> {
        return new CircularLinkedList(this, comparator);
    }

    public toCircularQueue(comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;
    public toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;
    public toCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): CircularQueue<TElement> {
        if (typeof capacityOrComparator === "number") {
            const queue = new CircularQueue<TElement>(capacityOrComparator, comparator);
            queue.addAll(this);
            return queue;
        }
        const queue = new CircularQueue<TElement>(undefined, capacityOrComparator);
        queue.addAll(this);
        return queue;
    }

    public toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        const dictionary = new Dictionary<TKey, TValue>(Enumerable.empty(), valueComparator);
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            dictionary.add(key, value);
        }
        return dictionary;
    }

    public toEnumerableSet(): EnumerableSet<TElement> {
        return new EnumerableSet(this);
    }

    public toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public toImmutableCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): ImmutableCircularQueue<TElement> {
        if (typeof capacityOrComparator === "number") {
            return ImmutableCircularQueue.create(capacityOrComparator, this, comparator);
        }
        return ImmutableCircularQueue.create(this, capacityOrComparator);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        // Builds the dictionary straight from the pairs instead of going through a Dictionary first.
        const pairs = this.select(item => {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            return [key, value] as [TKey, TValue];
        });
        return ImmutableDictionary.create<TKey, TValue>(pairs, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return ImmutableList.create(this, comparator);
    }

    public toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement> {
        return ImmutablePriorityQueue.create(this, comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return ImmutableQueue.create(this, comparator);
    }

    public toImmutableSet(): ImmutableSet<TElement> {
        return ImmutableSet.create(this);
    }

    public toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue> {
        const dictionary = this.toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
        return ImmutableSortedDictionary.create(dictionary, dictionary.keyComparator, dictionary.valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return ImmutableSortedSet.create(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return ImmutableStack.create(this, comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        return new LinkedList(this, comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        return new List(this, comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return Lookup.create(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue> {
        const map = new Map<TKey, TValue>();
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            map.set(key, value);
        }
        return map;
    }

    public toObject<TKey extends PropertyKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue> {
        const obj: Record<TKey, TValue> = {} as Record<TKey, TValue>;
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            obj[key] = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
        }
        return obj;
    }

    public toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement> {
        return new PriorityQueue(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement> {
        return new Queue(this, comparator);
    }

    public toSet(): Set<TElement> {
        return new Set(this);
    }

    public toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        const dictionary = new SortedDictionary<TKey, TValue>([], keyComparator, valueComparator);
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            dictionary.add(key, value);
        }
        return dictionary;
    }

    public toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return new SortedSet(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Stack<TElement> {
        return new Stack(this, comparator);
    }

    public union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionGenerator(iterable, comparator));
    }

    public unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionByGenerator(iterable, keySelector, comparator));
    }

    public variance(selector?: Selector<TElement, number>, sample: boolean = true): number {
        const numberSelector = resolveNumberSelector(selector);
        const stats = accumulateSingleStats(this, numberSelector);

        if (stats.count === 0 || (sample && stats.count < 2)) {
            return Number.NaN;
        }

        return sample ? stats.sumSq / (stats.count - 1) : stats.sumSq / stats.count;
    }

    public where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public where<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return new Enumerator<TElement>(() => this.whereGenerator(predicate as IndexedPredicate<TElement>));
    }

    public windows(size: number): IEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new Enumerator<IEnumerable<TElement>>(() => this.windowsGenerator(size));
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return new Enumerator(() => this.zipGenerator(iterable, zipper));
    }

    public zipMany<TIterable extends readonly Iterable<unknown>[]>(
        ...iterables: [...TIterable]
    ): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>;
    public zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<TResult>;
    public zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable] | [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]> | IEnumerable<TResult> {
        const lastArg = iterablesAndZipper[iterablesAndZipper.length - 1];
        const hasZipper = iterablesAndZipper.length > 0 && typeof lastArg === "function";
        if (hasZipper) {
            const iterables = iterablesAndZipper.slice(0, -1) as [...TIterable];
            const zipper = lastArg as ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>;
            return new Enumerator<TResult>(() => this.zipManyWithZipperGenerator(iterables, zipper));
        }
        const iterables = iterablesAndZipper as [...TIterable];
        return new Enumerator<[TElement, ...UnpackIterableTuple<TIterable>]>(() => this.zipManyWithoutZipperGenerator(iterables));
    }

    static* #chainGenerator<TElement>(chain: Chain<TElement>): IterableIterator<TElement> {
        for (let front = chain.front; front !== null; front = front.next) {
            yield* front.part;
        }
        yield* chain.base;
        const back: Array<Iterable<TElement>> = [];
        for (let part = chain.back; part !== null; part = part.next) {
            back.push(part.part);
        }
        for (let index = back.length - 1; index >= 0; --index) {
            yield* back[index];
        }
    }

    // Joining parts one generator at a time nests a frame per call, which overflows the stack for
    // long chains; keeping the parts in one chain visits each element through a single generator.
    static #chained<TElement>(chain: Chain<TElement>): Enumerator<TElement> {
        const enumerator = new Enumerator<TElement>(() => Enumerator.#chainGenerator(chain));
        enumerator.#chain = chain;
        return enumerator;
    }

    private* cartesianGenerator<TSecond>(iterable: Iterable<TSecond>): IterableIterator<[TElement, TSecond]> {
        const cache = Array.isArray(iterable) ? iterable as TSecond[] : [...iterable];
        if (cache.length === 0) {
            return;
        }
        for (const element of this) {
            for (let cx = 0; cx < cache.length; cx++) {
                yield [element, cache[cx]];
            }
        }
    }

    private* castGenerator<TResult>(): IterableIterator<TResult> {
        for (const item of this) {
            yield item as unknown as TResult;
        }
    }

    private* chunkGenerator(size: number): IterableIterator<IEnumerable<TElement>> {
        const iterator = this[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done) {
            const chunk = new List<TElement>();
            for (let index = 0; index < size; ++index) {
                if (next.done) {
                    break;
                }
                chunk.add(next.value);
                next = iterator.next();
            }
            yield chunk;
        }
    }

    private* combinationsGenerator(size?: number): IterableIterator<IEnumerable<TElement>> {
        const iterator = this[Symbol.iterator]();

        let next = iterator.next();
        if (next.done) {
            return yield* [];
        }

        const items = new List<TElement>();
        while (!next.done) {
            items.add(next.value);
            next = iterator.next();
        }

        const combinationCount = 1 << items.length;
        const seen = new Set<string>();

        for (let cx = 0; cx < combinationCount; ++cx) {
            const combination = new List<TElement>();
            for (let vx = 0; vx < items.length; ++vx) {
                if ((cx & (1 << vx)) !== 0) {
                    combination.add(items.elementAt(vx));
                }
            }
            if (size == null || combination.length === size) {
                const key = combination.aggregate((acc, cur) => acc + cur, ",");
                if (!seen.has(key)) {
                    seen.add(key);
                    yield combination;
                }
            }
        }
    }

    private* compactGenerator(): IterableIterator<NonNullable<TElement>> {
        for (const item of this) {
            if (item != null) {
                yield item;
            }
        }
    }

    private* cycleGenerator(count?: number): IterableIterator<TElement> {
        if (this.none()) {
            throw Enumerator.NO_ELEMENTS_EXCEPTION;
        }
        if (count == null) {
            while (true) {
                yield* this;
            }
        } else {
            for (let i = 0; i < count; ++i) {
                yield* this;
            }
        }
    }

    private* defaultIfEmptyGenerator(value?: TElement | null): IterableIterator<TElement | null> {
        const iterator = this[Symbol.iterator]();
        const first = iterator.next();
        if (!first.done) {
            yield first.value;
            yield* iterator as IterableIterator<TElement>;
        } else {
            yield value ?? null;
        }
    }

    private* distinctUntilChangedGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey>): IterableIterator<TElement> {
        const iterator = this[Symbol.iterator]();
        let next = iterator.next();
        if (next.done) {
            return yield* [];
        }
        let previousValue = next.value;
        yield previousValue;
        while (!next.done) {
            next = iterator.next();
            if (next.done) {
                return;
            }
            const prevKey = keySelector(previousValue);
            const nextKey = keySelector(next.value);
            if (!keyComparator(prevKey, nextKey)) {
                yield next.value;
                previousValue = next.value;
            }
        }
    }

    private* exceptByGenerator<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey> | OrderComparator<TKey>): IterableIterator<TElement> {
        const keys = new KeySet<TKey>(keyComparator, createSortedKeys);
        for (const item of iterable) {
            keys.add(keySelector(item));
        }
        for (const item of this) {
            if (keys.add(keySelector(item))) {
                yield item;
            }
        }
    }

    private* exceptGenerator(iterable: Iterable<TElement>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): IterableIterator<TElement> {
        return yield* this.exceptByGenerator(iterable, x => x, comparator);
    }

    private* groupByGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>, hashSelector?: Selector<TElement, PropertyKey>): IterableIterator<IGroup<TKey, TElement>> {
        if (!keyComparator) {
            const groupMap = new Map<TKey, IGroup<TKey, TElement>>();
            for (const item of this) {
                const key = keySelector(item);
                const group = groupMap.get(key);
                if (group) {
                    (group.source as List<TElement>).add(item);
                } else {
                    const newList = new List<TElement>([item]);
                    const newGroup = new Group(key, newList);
                    groupMap.set(key, newGroup);
                }
            }
            yield* groupMap.values();
        } else if (hashSelector) {
            type BucketEntry = { canonicalKey: TKey; group: IGroup<TKey, TElement> };
            const bucketMap = new Map<PropertyKey, BucketEntry[]>();
            const orderedGroups: IGroup<TKey, TElement>[] = [];
            for (const item of this) {
                const key = keySelector(item);
                const hash = hashSelector(item);
                let bucket = bucketMap.get(hash);
                let found: BucketEntry | undefined;
                if (bucket) {
                    found = bucket.find(entry => keyComparator(entry.canonicalKey, key));
                } else {
                    bucket = [];
                    bucketMap.set(hash, bucket);
                }
                if (found) {
                    (found.group.source as List<TElement>).add(item);
                } else {
                    const newList = new List<TElement>([item]);
                    const newGroup = new Group(key, newList);
                    bucket.push({ canonicalKey: key, group: newGroup });
                    orderedGroups.push(newGroup);
                }
            }
            yield* orderedGroups;
        } else if (isDefaultEquality(keyComparator)) {
            // The default comparator is Object.is, which a Map can index once -0 has its own key.
            const groupMap = new Map<unknown, IGroup<TKey, TElement>>();
            for (const item of this) {
                const key = keySelector(item);
                const hash = identityKey(key);
                const group = groupMap.get(hash);
                if (group) {
                    (group.source as List<TElement>).add(item);
                } else {
                    const newList = new List<TElement>([item]);
                    const newGroup = new Group(key, newList);
                    groupMap.set(hash, newGroup);
                }
            }
            yield* groupMap.values();
        } else {
            const groupMap = new Map<TKey, IGroup<TKey, TElement>>();
            const findExistingKey = (targetKey: TKey): TKey | undefined => {
                for (const existingKey of groupMap.keys()) {
                    if (keyComparator(existingKey, targetKey)) {
                        return existingKey;
                    }
                }
                return undefined;
            };
            for (const item of this) {
                const key = keySelector(item);
                const existingKey = findExistingKey(key);
                if (existingKey !== undefined) {
                    const group = groupMap.get(existingKey)!;
                    (group.source as List<TElement>).add(item);
                } else {
                    const newList = new List<TElement>([item]);
                    const newGroup = new Group(key, newList);
                    groupMap.set(key, newGroup);
                }
            }
            yield* groupMap.values();
        }
    }

    private* groupJoinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        // Group keys are compared as keyCompare(groupKey, key), so a custom comparator gets its arguments flipped.
        const lookupStore = new JoinGroups<TKey, TInner>(isDefaultEquality(keyCompare)
            ? keyCompare
            : (key: TKey, groupKey: TKey) => keyCompare(groupKey, key));

        for (const innerElement of innerEnumerable) {
            lookupStore.add(innerKeySelector(innerElement), innerElement);
        }

        for (const element of this) {
            const joinedEntries = lookupStore.find(outerKeySelector(element));
            yield resultSelector(element, Enumerable.from(joinedEntries?.elements ?? []));
        }
    }

    private* indexGenerator(): IterableIterator<[number, TElement]> {
        let index = 0;
        for (const item of this) {
            yield [index++, item];
        }
    }

    private* interleaveGenerator<TSecond>(other: Iterable<TSecond>): IterableIterator<TElement | TSecond> {
        const sourceIterator = this[Symbol.iterator]();
        const otherIterator = other[Symbol.iterator]();
        let e1 = sourceIterator.next();
        let e2 = otherIterator.next();
        while (!e1.done || !e2.done) {
            if (!e1.done) {
                yield e1.value;
                e1 = sourceIterator.next();
            }
            if (!e2.done) {
                yield e2.value;
                e2 = otherIterator.next();
            }
        }
    }

    private* intersectByGenerator<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey> | OrderComparator<TKey>): IterableIterator<TElement> {
        const keys = new KeySet<TKey>(keyComparator, createSortedKeys);
        for (const item of iterable) {
            keys.add(keySelector(item));
        }
        if (keys.size === 0) {
            return;
        }
        for (const item of this) {
            if (keys.delete(keySelector(item))) {
                yield item;
            }
        }
    }

    private* intersectGenerator(iterable: Iterable<TElement>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): IterableIterator<TElement> {
        return yield* this.intersectByGenerator(iterable, x => x, comparator);
    }

    private* intersperseGenerator<TSeparator = TElement>(separator: TSeparator): IterableIterator<TElement | TSeparator> {
        let index = 0;
        for (const item of this) {
            if (index !== 0) {
                yield separator;
            }
            yield item;
            ++index;
        }
    }

    private* joinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator: EqualityComparator<TKey>, leftJoin: boolean): IterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const effectiveLeftJoin = leftJoin ?? false;
        const groups = buildGroupsSync(innerEnumerable, innerKeySelector, keyCompare);

        for (const outerElement of this) {
            const outerKey = outerKeySelector(outerElement);
            yield* processOuterElement(
                outerElement,
                outerKey,
                groups,
                resultSelector,
                effectiveLeftJoin
            );
        }
    }

    private* multimodeGenerator<TKey>(keySelector: Selector<TElement, TKey>): IterableIterator<TElement> {
        const counts = new Map<TKey, number>();
        const representatives = new Map<TKey, TElement>();
        let max = 0;

        for (const item of this) {
            const key = keySelector(item);
            if (!representatives.has(key)) {
                representatives.set(key, item);
            }
            const next = (counts.get(key) ?? 0) + 1;
            counts.set(key, next);
            if (next > max) {
                max = next;
            }
        }
        if (max === 0) {
            return;
        }
        for (const [key, count] of counts) {
            if (count === max) {
                yield representatives.get(key) as TElement;
            }
        }
    }

    private* ofTypeGenerator<TResult extends ObjectType>(type: TResult): IterableIterator<InferredType<TResult>> {
        const isOfType = typeof type === "string"
            ? ((item: unknown): boolean => typeof item === type) as (item: unknown) => item is InferredType<TResult>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
            : (item: unknown): item is InferredType<TResult> => item instanceof (ClassType(type) as Function);
        for (const item of this) {
            if (isOfType(item)) {
                yield item;
            }
        }
    }

    private* pairwiseGenerator(resultSelector: PairwiseSelector<TElement, TElement>): IterableIterator<[TElement, TElement]> {
        const iterator = this[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done) {
            const previous = next;
            next = iterator.next();
            if (!next.done) {
                yield resultSelector(previous.value, next.value);
            }
        }
    }

    private* permutationsGenerator(size?: number): IterableIterator<IEnumerable<TElement>> {
        const distinctElements = Array.from(this.distinct());
        yield* permutationsGenerator(distinctElements, size);
    }

    private* reverseGenerator(): IterableIterator<TElement> {
        yield* Array.from(this).reverse();
    }

    private* rightJoinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement | null, TInner, TResult>, keyComparator: EqualityComparator<TKey>): IterableIterator<TResult> {
        const groups = buildGroupsSync(this, outerKeySelector, keyComparator);

        for (const innerElement of innerEnumerable) {
            const innerKey = innerKeySelector(innerElement);
            let foundMatch = false;
            for (const group of groups.matching(innerKey)) {
                for (const outerElement of group.elements) {
                    yield resultSelector(outerElement, innerElement);
                    foundMatch = true;
                }
            }
            if (!foundMatch) {
                yield resultSelector(null, innerElement);
            }
        }
    }

    private* rotateGenerator(shift: number): IterableIterator<TElement> {
        if (shift === 0) {
            return yield* this;
        }
        if (shift > 0) {
            return yield* this.rotateLeftGenerator(shift);
        }
        return yield* this.rotateRightGenerator(shift);
    }

    // Rotates a finite source with slices: any source for a right rotation, which buffers everything
    // anyway, and an array or library collection for a left one. Other left rotations stream.
    private rotateIterable(shift: number): Iterable<TElement> {
        if (!Number.isInteger(shift) || shift === 0) {
            return this.rotateGenerator(shift);
        }
        const source = this.iterable();
        if (shift > 0 && !Array.isArray(source) && asSized(source) == null) {
            return this.rotateLeftGenerator(shift);
        }
        const elements = Array.isArray(source) ? source as TElement[] : Array.from(source);
        if (elements.length === 0) {
            return elements;
        }
        const offset = ((shift % elements.length) + elements.length) % elements.length;
        return elements.slice(offset).concat(elements.slice(0, offset));
    }

    private* rotateLeftGenerator(shift: number): IterableIterator<TElement> {
        const iterator = this[Symbol.iterator]() as IterableIterator<TElement, TElement, TElement>;
        const head: TElement[] = [];
        let taken = 0;
        while (taken < shift) {
            const next = iterator.next();
            if (next.done) {
                if (head.length === 0) {
                    return;
                }
                const k = shift % head.length;
                for (let i = k; i < head.length; ++i) {
                    yield head[i];
                }
                for (let i = 0; i < k; ++i) {
                    yield head[i];
                }
                return;
            }
            head.push(next.value);
            taken++;
        }

        for (let next = iterator.next(); !next.done; next = iterator.next()) {
            yield next.value;
        }
        return yield* head;
    }

    private* rotateRightGenerator(shift: number): IterableIterator<TElement> {
        const buffer: TElement[] = [];
        for (const item of this) {
            buffer.push(item);
        }
        if (buffer.length === 0) {
            return;
        }
        const r = (-shift) % buffer.length;
        const k = (buffer.length - r) % buffer.length;
        for (let i = 0; i < buffer.length; ++i) {
            yield buffer[(i + k) % buffer.length];
        }
    }

    private* scanGenerator<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IterableIterator<TAccumulate> {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            const iterator = this[Symbol.iterator]();
            const first = iterator.next();
            if (first.done) {
                throw Enumerator.NO_ELEMENTS_EXCEPTION;
            }
            accumulatedValue = first.value as unknown as TAccumulate;
            yield accumulatedValue;
            let next = iterator.next();
            while (!next.done) {
                accumulatedValue = accumulator(accumulatedValue, next.value);
                yield accumulatedValue;
                next = iterator.next();
            }
        } else {
            accumulatedValue = seed;
            for (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
                yield accumulatedValue;
            }
        }
    }

    private* selectGenerator<TResult>(selector: IndexedSelector<TElement, TResult>): IterableIterator<TResult> {
        let index = 0;
        for (const d of this) {
            yield selector(d, index++);
        }
    }

    private* selectManyGenerator<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IterableIterator<TResult> {
        let index = 0;
        for (const item of this) {
            yield* selector(item, index);
            ++index;
        }
    }

    private* shuffleGenerator(): IterableIterator<TElement> {
        const array = Array.from(this);
        shuffleInPlace(array);
        yield* array;
    }

    private* skipGenerator(count: number): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            if (index >= count) {
                yield item;
            }
            ++index;
        }
    }

    private* skipLastGenerator(count: number): IterableIterator<TElement> {
        if (count <= 0) {
            yield* this;
            return;
        }

        const buffer: TElement[] = new Array(count);
        let bufferSize = 0;
        let index = 0;

        for (const item of this) {
            if (bufferSize === count) {
                yield buffer[index];
            }
            buffer[index] = item;
            index = (index + 1) % count;
            if (bufferSize < count) {
                bufferSize++;
            }
        }
    }

    private *skipUntilGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        let skipping = true;

        for (const item of this) {
            if (skipping && predicate(item, index)) {
                skipping = false;
            }
            if (!skipping) {
                yield item;
            }
            index++;
        }
    }

    private* skipWhileGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        let skipEnded = false;
        for (const item of this) {
            if (skipEnded) {
                yield item;
            } else if (predicate(item, index)) {
                index++;
            } else {
                skipEnded = true;
                yield item;
            }
        }
    }

    private* stepGenerator(step: number): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            if (index % step === 0) {
                yield item;
            }
            ++index;
        }
    }

    private* takeGenerator(count: number): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            if (index < count) {
                yield item;
                index++;
            } else {
                break;
            }
        }
    }

    private* takeLastGenerator(count: number): IterableIterator<TElement> {
        if (count <= 0) {
            return;
        }

        const buffer = new Array<TElement>(count);
        let bufferSize = 0;
        let startIndex = 0;

        for (const item of this) {
            const nextIndex = (startIndex + bufferSize) % count;
            buffer[nextIndex] = item;

            if (bufferSize < count) {
                bufferSize++;
            } else {
                startIndex = (startIndex + 1) % count;
            }
        }

        for (let i = 0; i < bufferSize; i++) {
            const readIndex = (startIndex + i) % count;
            yield buffer[readIndex];
        }
    }

    private* takeUntilGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            if (predicate(item, index)) {
                break;
            }
            yield item;
            index++;
        }
    }

    private* takeWhileGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        let takeEnded = false;
        for (const item of this) {
            if (!takeEnded) {
                if (predicate(item, index)) {
                    yield item;
                    ++index;
                } else {
                    takeEnded = true;
                }
            } else {
                break;
            }
        }
    }

    private* tapGenerator(action: IndexedAction<TElement>): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            action(item, index++);
            yield item;
        }
    }

    private* unionByGenerator<TKey>(enumerable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey>): IterableIterator<TElement> {
        const keys = new KeySet<TKey>(comparator, createSortedKeys);
        for (const source of [this, enumerable]) {
            for (const item of source) {
                if (keys.add(keySelector(item))) {
                    yield item;
                }
            }
        }
    }

    private* unionGenerator(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IterableIterator<TElement> {
        return yield* this.unionByGenerator(iterable, x => x, comparator ?? Comparators.equalityComparator);
    }

    private* whereGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        for (const d of this) {
            if (predicate(d, index)) {
                yield d;
            }
            ++index;
        }
    }

    private* windowsGenerator(size: number): IterableIterator<IEnumerable<TElement>> {
        const iterator = this[Symbol.iterator]();
        const buffer = new Array<TElement>(size);
        let count = 0;
        let start = 0;

        for (let item = iterator.next(); !item.done; item = iterator.next()) {
            if (count < size) {
                buffer[count] = item.value;
                count++;

                if (count === size) {
                    yield new Enumerable<TElement>(buffer.slice(0, size));
                }
            } else {
                buffer[start] = item.value;
                start = (start + 1) % size;
                const window = new Array<TElement>(size);
                for (let i = 0; i < size; i++) {
                    window[i] = buffer[(start + i) % size];
                }
                yield new Enumerable<TElement>(window);
            }
        }
    }

    private* zipGenerator<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IterableIterator<TResult> {
        const iterator = this[Symbol.iterator]();
        const otherIterator = iterable[Symbol.iterator]();
        while (true) {
            const first = iterator.next();
            const second = otherIterator.next();
            if (first.done || second.done) {
                break;
            } else {
                yield zipper?.(first.value, second.value) ?? [first.value, second.value] as TResult;
            }
        }
    }

    private* zipManyWithZipperGenerator<TIterable extends readonly Iterable<unknown>[], TResult>(
        iterables: readonly [...TIterable],
        zipper: ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>
    ): IterableIterator<TResult> {
        for (const values of this.zipManyWithoutZipperGenerator(iterables)) {
            yield zipper(values as readonly [TElement, ...UnpackIterableTuple<TIterable>]);
        }
    }

    private* zipManyWithoutZipperGenerator<TIterable extends readonly Iterable<unknown>[]>(
        iterables: readonly [...TIterable]
    ): IterableIterator<[TElement, ...UnpackIterableTuple<TIterable>]> {
        const iterators = [this, ...iterables].map(i => i[Symbol.iterator]());
        while (true) {
            const results = iterators.map(i => i.next());
            if (results.some(result => result.done)) {
                break;
            }
            yield results.map(result => result.value) as [TElement, ...UnpackIterableTuple<TIterable>];
        }
    }
}

const createSortedKeys: SortedKeysFactory = <TKey>(comparator: OrderComparator<TKey>) => new SortedSet<TKey>([], comparator);

// Lives here rather than in its own module: Enumerator creates it, and it extends Enumerator.
export class OrderedEnumerator<TElement> extends Enumerator<TElement> implements IOrderedEnumerable<TElement> {
    public constructor(public readonly orderedValueGroups: () => Iterable<Iterable<TElement>>) {
        super(function* () {
            for (const group of orderedValueGroups()) {
                yield* group;
            }
        });
    }

    public static createOrderedEnumerable<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, viaThenBy?: boolean, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        const keyValueGenerator = function* <TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, comparator?: OrderComparator<TKey>): Iterable<Iterable<TElement>> {
            comparator ??= Comparators.orderComparator;
            const sortMap = OrderedEnumerator.createKeyValueMap(source, keySelector);
            const sortedKeys = Array.from(sortMap.keys()).sort(comparator);
            if (ascending) {
                for (const key of sortedKeys) {
                    yield sortMap.get(key) as Iterable<TElement>;
                }
            } else {
                for (const key of sortedKeys.reverse()) {
                    yield sortMap.get(key) as Iterable<TElement>;
                }
            }
        }
        if (source instanceof OrderedEnumerator && viaThenBy) {
            return new OrderedEnumerator<TElement>(function* () {
                for (const group of source.orderedValueGroups()) {
                    yield* keyValueGenerator(group, keySelector, ascending, comparator);
                }
            });
        } else {
            return new OrderedEnumerator<TElement>(() => keyValueGenerator(source, keySelector, ascending, comparator));
        }
    }

    private static createKeyValueMap<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>): Map<TKey, Iterable<TElement>> {
        const sortMap: Map<TKey, TElement[]> = new Map<TKey, TElement[]>();
        for (const element of source) {
            const key = keySelector(element);
            const value = sortMap.get(key);
            if (value) {
                value.push(element);
            } else {
                sortMap.set(key, [element]);
            }
        }
        return sortMap;
    }
}
