import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    CircularLinkedList,
    CircularQueue,
    Collections,
    Dictionary,
    Enumerable,
    EnumerableSet,
    Group,
    IEnumerable,
    IGroup,
    ILookup,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableCircularQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    IOrderedEnumerable,
    LinkedList,
    List,
    OrderedEnumerator,
    PriorityQueue,
    Queue,
    SortedDictionary,
    SortedSet,
    Stack
} from "../imports";
import { Lookup } from "../lookup/Lookup";
import { Accumulator } from "../shared/Accumulator";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate, IndexedTypePredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { IndexOutOfBoundsException } from "../shared/IndexOutOfBoundsException";
import { InferredType } from "../shared/InferredType";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { JoinSelector } from "../shared/JoinSelector";
import { MoreThanOneElementException } from "../shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../shared/NoElementsException";
import { NoMatchingElementException } from "../shared/NoMatchingElementException";
import { ClassType, ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate, TypePredicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper, ZipManyZipper } from "../shared/Zipper";
import { findGroupInStore, findOrCreateGroupEntry, GroupJoinLookup } from "./helpers/groupJoinHelpers";
import { buildGroupsSync, processOuterElement } from "./helpers/joinHelpers";
import { permutationsGenerator } from "./helpers/permutationsGenerator";
import {PipeOperator} from "../shared/PipeOperator";
import {UnpackIterableTuple} from "../shared/UnpackIterableTuple";

export class Enumerator<TElement> implements IOrderedEnumerable<TElement> {
    private static readonly MORE_THAN_ONE_ELEMENT_EXCEPTION = new MoreThanOneElementException();
    private static readonly MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION = new MoreThanOneMatchingElementException();
    private static readonly NO_ELEMENTS_EXCEPTION = new NoElementsException();
    private static readonly NO_MATCHING_ELEMENT_EXCEPTION = new NoMatchingElementException();

    public constructor(private readonly iterable: () => Iterable<TElement>) {
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.iterable();
    }

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
        return groups.select(g => new KeyValuePair(g.key, g.source.aggregate(accumulator, seedSelector instanceof Function ? seedSelector(g.key) : seedSelector )));
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
        return new Enumerator(() => this.appendGenerator(element));
    }

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

    public cast<TResult>(): IEnumerable<TResult> {
        return new Enumerator<TResult>(() => this.castGenerator());
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

    public concat(iterable: Iterable<TElement>): IEnumerable<TElement> {
        return new Enumerator(() => this.concatGenerator(iterable));
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

    public cycle(count?: number): IEnumerable<TElement> {
        return new Enumerator(() => this.cycleGenerator(count));
    }

    public defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null> {
        return new Enumerator(() => this.defaultIfEmptyGenerator(value));
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

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.groupByGenerator(keySelector, keyComparator));
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

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.joinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin));
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
        return new Enumerator(() => this.prependGenerator(element));
    }

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

    public rotate(shift: number): IEnumerable<TElement> {
        return new Enumerator(() => this.rotateGenerator(shift));
    }

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

    public step(step: number): IEnumerable<TElement> {
        if (step < 1) {
            throw new InvalidArgumentException("Step must be greater than 0.", "step");
        }
        return new Enumerator(() => this.stepGenerator(step));
    }

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
        return Array.from(this);
    }

    public toCircularLinkedList(comparator?: EqualityComparator<TElement, TElement>): CircularLinkedList<TElement> {
        return new CircularLinkedList<TElement>(this, comparator);
    }

    public toCircularQueue(comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;
    public toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;
    public toCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): CircularQueue<TElement> {
        let capacity: number | undefined;
        let comparer: EqualityComparator<TElement> | undefined;

        if (typeof capacityOrComparator === "number") {
            capacity = capacityOrComparator;
            comparer = comparator;
        } else {
            comparer = capacityOrComparator;
        }

        const queue = new CircularQueue<TElement>(capacity, comparer);
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
        return new EnumerableSet<TElement>(this);
    }

    public toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public toImmutableCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): ImmutableCircularQueue<TElement> {
        let capacity: number | undefined;
        let comparer: EqualityComparator<TElement> | undefined;

        if (typeof capacityOrComparator === "number") {
            capacity = capacityOrComparator;
            comparer = comparator;
        } else {
            comparer = capacityOrComparator;
        }

        return capacity !== undefined
            ? ImmutableCircularQueue.create<TElement>(capacity, this, comparer)
            : ImmutableCircularQueue.create<TElement>(this, comparer);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        const dictionary = this.toDictionary(keySelector, valueSelector, valueComparator);
        return ImmutableDictionary.create(dictionary);
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
        return ImmutableSortedDictionary.create(dictionary);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return ImmutableSortedSet.create(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return ImmutableStack.create(this, comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        return new LinkedList<TElement>(this, comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        return new List<TElement>(this, comparator);
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
        return new PriorityQueue<TElement>(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement> {
        return new Queue<TElement>(this, comparator);
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
        return new SortedSet<TElement>(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Stack<TElement> {
        return new Stack<TElement>(this, comparator);
    }

    public union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionGenerator(iterable, comparator));
    }

    public unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionByGenerator(iterable, keySelector, comparator));
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

    private* appendGenerator(element: TElement): IterableIterator<TElement> {
        yield* this;
        yield element;
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

    private* concatGenerator(enumerable: Iterable<TElement>): IterableIterator<TElement> {
        yield* this;
        yield* enumerable;
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
        const keySet = new SortedSet<TKey>([], keyComparator as OrderComparator<TKey>);
        const keyList = new List<TKey>([], keyComparator as EqualityComparator<TKey>);

        const { value: first, done } = new Enumerator<TElement>(() => iterable)[Symbol.iterator]().next();
        if (done) {
            const { value: first, done } = new Enumerator<TElement>(() => this)[Symbol.iterator]().next();
            if (done) {
                return yield* this;
            }
            const firstKey = keySelector(first);
            const keyCollection = typeof keyComparator(firstKey, firstKey) === "number" ? keySet : keyList;
            for (const item of this) {
                const key = keySelector(item);
                if (!keyCollection.contains(key)) {
                    keyCollection.add(key);
                    yield item;
                }
            }
            return;
        }

        const firstKey = keySelector(first);
        const keyCollection = typeof keyComparator(firstKey, firstKey) === "number" ? keySet : keyList;
        for (const item of iterable) {
            const key = keySelector(item);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
            }
        }
        for (const item of this) {
            const key = keySelector(item);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
                yield item;
            }
        }
    }

    private* exceptGenerator(iterable: Iterable<TElement>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): IterableIterator<TElement> {
        return yield* this.exceptByGenerator(iterable, x => x, comparator);
    }

    private* groupByGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IterableIterator<IGroup<TKey, TElement>> {
        if (!keyComparator) {
            const groupMap = new Map<TKey, IGroup<TKey, TElement>>();

            for (const item of this) {
                const key = keySelector(item);
                const group = groupMap.get(key);
                if (group) {
                    (group.source as List<TElement>).add(item);
                } else {
                    const newList = new List([item]);
                    const newGroup = new Group(key, newList);
                    groupMap.set(key, newGroup);
                }
            }
            yield* groupMap.values();
        } else {
            const groupMap = new Map<TKey, IGroup<TKey, TElement>>();
            const keyLookupMap = new Map<TKey, TKey>();

            const findExistingKey = (targetKey: TKey): TKey | undefined => {
                for (const existingKey of keyLookupMap.values()) {
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
                    const newList = new List([item]);
                    const newGroup = new Group(key, newList);
                    groupMap.set(key, newGroup);
                    keyLookupMap.set(key, key);
                }
            }
            yield* groupMap.values();
        }
    }

    private* groupJoinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const lookupStore: Array<GroupJoinLookup<TKey, TInner>> = [];

        for (const innerElement of innerEnumerable) {
            const innerKey = innerKeySelector(innerElement);
            const group = findOrCreateGroupEntry(lookupStore, innerKey, keyCompare);
            group.push(innerElement);
        }

        for (const element of this) {
            const outerKey = outerKeySelector(element);
            const joinedEntries = findGroupInStore(lookupStore, outerKey, keyCompare);
            yield resultSelector(element, Enumerable.from(joinedEntries ?? []));
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
        const keySet = new SortedSet<TKey>([], keyComparator as OrderComparator<TKey>);
        const keyList = new List<TKey>([], keyComparator as EqualityComparator<TKey>);

        const { value: first, done } = new Enumerator<TElement>(() => iterable)[Symbol.iterator]().next();
        if (done) {
            return yield* Enumerable.empty<TElement>();
        }

        const firstKey = keySelector(first);
        const keyCollection = typeof keyComparator(firstKey, firstKey) === "number" ? keySet : keyList;
        for (const item of iterable) {
            const key = keySelector(item);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
            }
        }
        for (const item of this) {
            const key = keySelector(item);
            if (keyCollection.remove(key)) {
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

    private* joinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const effectiveLeftJoin = leftJoin ?? false;
        const groups = buildGroupsSync(innerEnumerable, innerKeySelector, keyCompare);

        for (const outerElement of this) {
            const outerKey = outerKeySelector(outerElement);
            yield* processOuterElement(
                outerElement,
                outerKey,
                groups,
                keyCompare,
                resultSelector,
                effectiveLeftJoin
            );
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

    private* prependGenerator(item: TElement): IterableIterator<TElement> {
        yield item;
        yield* this;
    }

    private* reverseGenerator(): IterableIterator<TElement> {
        yield* Array.from(this).reverse();
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
        Collections.shuffle(array);
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
        const isDefaultComparator = comparator === Comparators.equalityComparator;

        if (isDefaultComparator) {
            const seenKeys = new Set<TKey>();
            for (const source of [this, enumerable]) {
                for (const item of source) {
                    const key = keySelector(item);
                    if (!seenKeys.has(key)) {
                        seenKeys.add(key);
                        yield item;
                    }
                }
            }
        } else {
            const seenKeysMap = new Map<TKey, boolean>();
            const findExistingKey = (targetKey: TKey): TKey | undefined => {
                for (const existingKey of seenKeysMap.keys()) {
                    if (comparator(targetKey, existingKey)) {
                        return existingKey;
                    }
                }
                return undefined;
            };

            for (const source of [this, enumerable]) {
                for (const item of source) {
                    const key = keySelector(item);
                    const existingKey = findExistingKey(key);

                    if (existingKey === undefined) {
                        seenKeysMap.set(key, true);
                        yield item;
                    }
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




