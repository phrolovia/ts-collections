import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    AsyncEnumerable,
    CircularLinkedList,
    CircularQueue,
    Collections,
    Dictionary,
    Enumerable,
    EnumerableSet,
    Group,
    IAsyncEnumerable,
    IEnumerable,
    IGroup,
    ILookup,
    ImmutableCircularQueue,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    IOrderedAsyncEnumerable,
    LinkedList,
    List,
    OrderedAsyncEnumerator,
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
import { NoSuchElementException } from "../shared/NoSuchElementException";
import { ClassType, ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate, TypePredicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { MedianTieStrategy } from "../shared/MedianTieStrategy";
import { PercentileStrategy } from "../shared/PercentileStrategy";
import { DimensionMismatchException } from "../shared/DimensionMismatchException";
import { InsufficientElementException } from "../shared/InsufficientElementException";
import { Zipper, ZipManyZipper } from "../shared/Zipper";
import { UnpackAsyncIterableTuple } from "../shared/UnpackAsyncIterableTuple";
import {
    accumulatePairStatsFromAsyncIterables,
    accumulatePairStatsFromSingleAsyncIterable,
    accumulateSingleStatsAsync, findCorrelation,
    resolveNumberSelector
} from "./helpers/statisticsHelpers";
import { findGroupInStore, findOrCreateGroupEntry, GroupJoinLookup } from "./helpers/groupJoinHelpers";
import { buildGroupsAsync, processOuterElement } from "./helpers/joinHelpers";
import { permutationsGenerator } from "./helpers/permutationsGenerator";
import { AsyncPipeOperator } from "../shared/PipeOperator";
import { findMedian } from "./helpers/medianHelpers";
import { findPercentile } from "./helpers/percentileHelpers";

export class AsyncEnumerator<TElement> implements IAsyncEnumerable<TElement> {
    private static readonly DIMENSION_MISMATCH_EXCEPTION = new DimensionMismatchException();
    private static readonly MORE_THAN_ONE_ELEMENT_EXCEPTION = new MoreThanOneElementException();
    private static readonly MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION = new MoreThanOneMatchingElementException();
    private static readonly NO_ELEMENTS_EXCEPTION = new NoElementsException();
    private static readonly NO_MATCHING_ELEMENT_EXCEPTION = new NoMatchingElementException();

    public constructor(private readonly iterable: () => AsyncIterable<TElement>) {
    }

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* this.iterable();
    }

    public async aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>,
                                                                          seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            const iterator = this[Symbol.asyncIterator]();
            const first = await iterator.next();
            if (first.done) {
                throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
            }
            accumulatedValue = first.value as unknown as TAccumulate;
            let next = await iterator.next();
            while (!next.done) {
                accumulatedValue = accumulator(accumulatedValue, next.value);
                next = await iterator.next();
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        }
        return resultSelector?.(accumulatedValue) ?? accumulatedValue;
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>> {
        keyComparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, keyComparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.aggregate(accumulator, seedSelector instanceof Function ? seedSelector(g.key) : seedSelector)));
    }

    public async all(predicate: Predicate<TElement>): Promise<boolean> {
        for await (const element of this) {
            if (!predicate(element)) {
                return false;
            }
        }
        return true;
    }

    public async any(predicate?: Predicate<TElement>): Promise<boolean> {
        if (!predicate) {
            return this[Symbol.asyncIterator]().next().then(result => !result.done);
        }
        for await (const element of this) {
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }

    public append(element: TElement): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.appendGenerator(element));
    }

    public async atLeast(count: number, predicate?: Predicate<TElement>): Promise<boolean> {
        if (count < 0) {
            throw new InvalidArgumentException("Count must be greater than or equal to 0.", "count");
        }
        if (count === 0) {
            return true;
        }
        const matcher: Predicate<TElement> = predicate ?? (() => true);
        let matches = 0;
        for await (const item of this) {
            if (matcher(item)) {
                ++matches;
                if (matches >= count) {
                    return true;
                }
            }
        }
        return matches >= count;
    }

    public async atMost(count: number, predicate?: Predicate<TElement>): Promise<boolean> {
        if (count < 0) {
            throw new InvalidArgumentException("Count must be greater than or equal to 0.", "count");
        }
        const matcher: Predicate<TElement> = predicate ?? (() => true);
        let matches = 0;
        for await (const item of this) {
            if (matcher(item)) {
                ++matches;
                if (matches > count) {
                    return false;
                }
            }
        }
        return true;
    }

    public async average(selector?: Selector<TElement, number>): Promise<number> {
        let total = 0;
        let count = 0;
        for await (const element of this) {
            total += selector?.(element) ?? element as number;
            ++count;
        }
        if (count === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        return total / count;
    }

    public cartesian<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<[TElement, TSecond]> {
        return new AsyncEnumerator<[TElement, TSecond]>(() => this.cartesianGenerator(iterable));
    }

    public cast<TResult>(): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.castGenerator());
    }

    public chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.chunkGenerator(size));
    }

    public combinations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 0) {
            throw new InvalidArgumentException("Size must be greater than or equal to 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.combinationsGenerator(size));
    }

    public compact(): IAsyncEnumerable<NonNullable<TElement>> {
        return new AsyncEnumerator<NonNullable<TElement>>(() => this.compactGenerator());
    }

    public concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.concatGenerator(other));
    }

    public async contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        comparator ??= Comparators.equalityComparator;
        for await (const e of this) {
            if (comparator(e, element)) {
                return true;
            }
        }
        return false;
    }

    public async correlation<TSecond>(iterable: AsyncIterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>): Promise<number> {
        const leftSelector = resolveNumberSelector(selector);
        const rightSelector = resolveNumberSelector(otherSelector);
        const stats = await accumulatePairStatsFromAsyncIterables(
            this,
            iterable,
            leftSelector,
            rightSelector,
            AsyncEnumerator.DIMENSION_MISMATCH_EXCEPTION
        );
        return findCorrelation(stats);
    }

    public async correlationBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>): Promise<number> {
        const stats = await accumulatePairStatsFromSingleAsyncIterable(this, leftSelector, rightSelector);
        return findCorrelation(stats);
    }

    public async count(predicate?: Predicate<TElement>): Promise<number> {
        let count = 0;
        if (!predicate) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of this) {
                ++count;
            }
            return count;
        }
        for await (const element of this) {
            if (predicate(element)) {
                ++count;
            }
        }
        return count;
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>> {
        comparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, comparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.count()));
    }

    public async covariance<TSecond>(iterable: AsyncIterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>, sample: boolean = true): Promise<number> {
        const leftSelector = resolveNumberSelector(selector);
        const rightSelector = resolveNumberSelector(otherSelector);
        const stats = await accumulatePairStatsFromAsyncIterables(
            this,
            iterable,
            leftSelector,
            rightSelector,
            AsyncEnumerator.DIMENSION_MISMATCH_EXCEPTION
        );

        if (stats.count < 2) {
            throw new InsufficientElementException("Covariance requires at least two pairs of elements.");
        }

        return sample
            ? stats.sumSqXY / (stats.count - 1)
            : stats.sumSqXY / stats.count;
    }

    public async covarianceBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>, sample: boolean = true): Promise<number> {
        const stats = await accumulatePairStatsFromSingleAsyncIterable(this, leftSelector, rightSelector);

        if (stats.count < 2) {
            throw new InsufficientElementException("Covariance requires at least two pairs of elements.");
        }

        return sample
            ? stats.sumSqXY / (stats.count - 1)
            : stats.sumSqXY / stats.count;
    }

    public cycle(count?: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.cycleGenerator(count));
    }

    public defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null> {
        return new AsyncEnumerator<TElement | null>(() => this.defaultIfEmptyGenerator(defaultValue));
    }

    public distinct(keyComparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        const keyComparer = keyComparator ?? Comparators.equalityComparator;
        const asyncEnumerable = new AsyncEnumerator(async function* () {
            yield* [] as TElement[];
        });
        return new AsyncEnumerator<TElement>(() => this.unionGenerator(
            asyncEnumerable as IAsyncEnumerable<TElement>, keyComparer));
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        keyComparator ??= Comparators.equalityComparator;
        const asyncEnumerable = new AsyncEnumerator(async function* () {
            yield* [] as TElement[];
        });
        return new AsyncEnumerator<TElement>(() => this.unionByGenerator(asyncEnumerable, keySelector, keyComparator));
    }

    public distinctUntilChanged(comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        const comparer = comparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.distinctUntilChangedGenerator(item => item, comparer));
    }

    public distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        const comparer = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.distinctUntilChangedGenerator(keySelector, comparer));
    }

    public async elementAt(index: number): Promise<TElement> {
        if (index < 0) {
            throw new IndexOutOfBoundsException(index);
        }
        let count = 0;
        for await (const element of this) {
            if (count === index) {
                return element;
            }
            ++count;
        }
        if (index >= count) {
            throw new IndexOutOfBoundsException(index);
        }
        throw new NoSuchElementException();
    }

    public async elementAtOrDefault(index: number): Promise<TElement | null> {
        if (index < 0) {
            return null;
        }
        let count = 0;
        for await (const element of this) {
            if (count === index) {
                return element;
            }
            ++count;
        }
        return null;
    }

    public async exactly(count: number, predicate?: Predicate<TElement>): Promise<boolean> {
        if (count < 0) {
            throw new InvalidArgumentException("Count must be greater than or equal to 0.", "count");
        }
        const matcher: Predicate<TElement> = predicate ?? (() => true);
        let matches = 0;
        for await (const item of this) {
            if (matcher(item)) {
                ++matches;
                if (matches > count) {
                    return false;
                }
            }
        }
        return matches === count;
    }

    public except(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.exceptGenerator(iterable, comparator));
    }

    public exceptBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> |  OrderComparator<TKey>): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.exceptByGenerator(enumerable, keySelector, comparator));
    }

    public async first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;
    public async first(predicate?: Predicate<TElement>): Promise<TElement>;
    public async first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered> {
        const predicateFn = predicate as Predicate<TElement> | undefined;
        let count = 0;
        for await (const element of this) {
            ++count;
            if (!predicateFn) {
                return element;
            }
            if (predicateFn(element)) {
                return element;
            }
        }
        if (count === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        throw AsyncEnumerator.NO_MATCHING_ELEMENT_EXCEPTION;
    }

    public async firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;
    public async firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;
    public async firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered | null> {
        const predicateFn = predicate as Predicate<TElement> | undefined;
        for await (const element of this) {
            if (!predicateFn) {
                return element;
            }
            if (predicateFn(element)) {
                return element;
            }
        }
        return null;
    }

    public async forEach(action: IndexedAction<TElement>): Promise<void> {
        let index = 0;
        for await (const element of this) {
            action(element, index);
            ++index;
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<IGroup<TKey, TElement>> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<IGroup<TKey, TElement>>(() => this.groupByGenerator(keySelector, keyCompare));
    }

    public groupJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TResult>(() => this.groupJoinGenerator(inner, outerKeySelector, innerKeySelector, resultSelector, keyCompare));
    }

    public index(): IAsyncEnumerable<[number, TElement]> {
        return new AsyncEnumerator<[number, TElement]>(() => this.indexGenerator());
    }

    public interleave<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<TElement | TSecond> {
        return new AsyncEnumerator<TElement | TSecond>(() => this.interleaveGenerator(iterable));
    }

    public intersect(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> |  OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        const compare = comparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.intersectGenerator(iterable, compare));
    }

    public intersectBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> |  OrderComparator<TKey>): IAsyncEnumerable<TElement> {
        const compare = comparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.intersectByGenerator(enumerable, keySelector, compare));
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IAsyncEnumerable<TElement | TSeparator> {
        return new AsyncEnumerator<TElement | TSeparator>(() => this.intersperseGenerator(separator));
    }

    public join<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IAsyncEnumerable<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TResult>(() => this.joinGenerator(inner, outerKeySelector, innerKeySelector, resultSelector, keyCompare, leftJoin ?? false));
    }

    public async last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;
    public async last(predicate?: Predicate<TElement>): Promise<TElement>;
    public async last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered> {
        const predicateFn = predicate as Predicate<TElement> | undefined;
        let last: TElement | null = null;
        let found = false;

        for await (const element of this) {
            if (!predicateFn || predicateFn(element)) {
                last = element;
                found = true;
            }
        }

        if (!found) {
            throw predicateFn
                ? AsyncEnumerator.NO_MATCHING_ELEMENT_EXCEPTION
                : AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }

        return last as TElement | TFiltered;
    }

    public async lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;
    public async lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;
    public async lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered | null> {
        const predicateFn = predicate as Predicate<TElement> | undefined;
        let last: TElement | null = null;
        for await (const element of this) {
            if (!predicateFn || predicateFn(element)) {
                last = element;
            }
        }
        return last as TElement | TFiltered | null;
    }

    public async max(selector?: Selector<TElement, number>): Promise<number> {
        let max: number | null = null;
        for await (const element of this) {
            const value = selector ? selector(element) : element as unknown as number;
            max = Math.max(max ?? Number.NEGATIVE_INFINITY, value);
        }
        if (max == null) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        return max;
    }

    public async maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        let maxElement: TElement | null = null;
        let maxKey: TKey | null = null;
        for await (const element of this) {
            const key = keySelector(element);
            if (maxKey == null || (comparator?.(key, maxKey) ?? key) > maxKey) {
                maxKey = key;
                maxElement = element;
            }
        }
        if (maxElement == null) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        return maxElement;
    }

    public async median(selector?: Selector<TElement, number>, tie?: MedianTieStrategy): Promise<number> {
        const numberSelector = selector ?? ((item: TElement): number => item as unknown as number);
        const numericData: number[] = [];
        for await (const item of this) {
            numericData.push(numberSelector(item));
        }
        return findMedian(numericData, tie);
    }

    public async min(selector?: Selector<TElement, number>): Promise<number> {
        let min: number | null = null;
        for await (const element of this) {
            const value = selector ? selector(element) : element as unknown as number;
            min = Math.min(min ?? Number.POSITIVE_INFINITY, value);
        }
        if (min == null) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        return min;
    }

    public async minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        let minElement: TElement | null = null;
        let minKey: TKey | null = null;
        for await (const element of this) {
            const key = keySelector(element);
            if (minKey == null || (comparator?.(key, minKey) ?? key) < minKey) {
                minKey = key;
                minElement = element;
            }
        }
        if (minElement == null) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        return minElement;
    }

    public async mode<TKey>(keySelector?: Selector<TElement, TKey>): Promise<TElement> {
        const iterator = this.multimode(keySelector)[Symbol.asyncIterator]();
        const first = await iterator.next();
        if (first.done) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        return first.value;
    }

    public async modeOrDefault<TKey>(keySelector?: Selector<TElement, TKey>): Promise<TElement | null> {
        const iterator = this.multimode(keySelector)[Symbol.asyncIterator]();
        const first = await iterator.next();
        return first.done ? null : first.value;
    }

    public multimode<TKey>(keySelector?: Selector<TElement, TKey>): IAsyncEnumerable<TElement> {
        const selector = keySelector ?? ((item: TElement): TKey => item as unknown as TKey);
        return new AsyncEnumerator<TElement>(() => this.multimodeGenerator(selector));
    }

    public async none(predicate?: Predicate<TElement>): Promise<boolean> {
        return !await this.any(predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IAsyncEnumerable<InferredType<TResult>> {
        return new AsyncEnumerator<InferredType<TResult>>(() => this.ofTypeGenerator(type));
    }

    public order(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, item => item, true, false, comparator);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, true, false, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, false, false, comparator);
    }

    public orderDescending(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, item => item, false, false, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IAsyncEnumerable<[TElement, TElement]> {
        return new AsyncEnumerator<[TElement, TElement]>(() => this.pairwiseGenerator(resultSelector));
    }

    public async partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]>;
    public async partition(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;
    public async partition<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>] | [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]> {
        const predicateFn = predicate as Predicate<TElement>;
        const trueElements: TElement[] = [];
        const falseElements: TElement[] = [];
        for await (const element of this) {
            if (predicateFn(element)) {
                trueElements.push(element);
            } else {
                falseElements.push(element);
            }
        }
        return [Enumerable.from(trueElements), Enumerable.from(falseElements)] as [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public async percentile(percent: number, selector?: Selector<TElement, number>, strategy?: PercentileStrategy): Promise<number> {
        const numberSelector = selector ?? ((item: TElement): number => item as unknown as number);
        const numericData: number[] = [];
        for await (const item of this) {
            numericData.push(numberSelector(item));
        }
        return findPercentile(numericData, percent, strategy);
    }

    public permutations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.permutationsGenerator(size));
    }

    public pipe<TResult>(operator: AsyncPipeOperator<TElement, TResult>): Promise<TResult> {
        return operator(this);
    }

    public prepend(element: TElement): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.prependGenerator(element));
    }

    public async product(selector?: Selector<TElement, number>): Promise<number> {
        let product = 1;
        let count = 0;

        for await (const element of this) {
            product *= selector?.(element) ?? element as unknown as number;
            ++count;
        }

        if (count === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }

        return product;
    }

    public reverse(): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.reverseGenerator());
    }

    public rotate(shift: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.rotateGenerator(shift));
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IAsyncEnumerable<TAccumulate> {
        return new AsyncEnumerator<TAccumulate>(() => this.scanGenerator(accumulator, seed));
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.selectGenerator(selector));
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.selectManyGenerator(selector));
    }

    public async sequenceEqual(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        comparator ??= Comparators.equalityComparator;
        const iterator = this[Symbol.asyncIterator]();
        const otherIterator = iterable[Symbol.asyncIterator]();
        let first = await iterator.next();
        let second = await otherIterator.next();
        if (first.done && second.done) {
            return true;
        }
        while (!first.done && !second.done) {
            if (!comparator(first.value, second.value)) {
                return false;
            }
            first = await iterator.next();
            second = await otherIterator.next();
            if (first.done && second.done) {
                return true;
            }
        }
        return false;
    }

    public shuffle(): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.shuffleGenerator());
    }

    public async single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;
    public async single(predicate?: Predicate<TElement>): Promise<TElement>;
    public async single<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered> {
        const predicateFn = predicate as Predicate<TElement> | undefined;
        let single: TElement | null = null;
        let found = false;
        let count = 0;

        for await (const element of this) {
            count++;
            if (!predicateFn || predicateFn(element)) {
                if (found) {
                    throw predicateFn ? AsyncEnumerator.MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION : AsyncEnumerator.MORE_THAN_ONE_ELEMENT_EXCEPTION;
                }
                single = element;
                found = true;
            }
        }

        if (count === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }

        if (!found) {
            throw AsyncEnumerator.NO_MATCHING_ELEMENT_EXCEPTION;
        }

        return single as TElement | TFiltered;
    }

    public async singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;
    public async singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;
    public async singleOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered | null> {
        const predicateFn = predicate as Predicate<TElement> | undefined;
        let single: TElement | null = null;
        let found = false;

        for await (const element of this) {
            if (!predicateFn || predicateFn(element)) {
                if (found) {
                    throw predicateFn ? AsyncEnumerator.MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION : AsyncEnumerator.MORE_THAN_ONE_ELEMENT_EXCEPTION;
                }
                single = element;
                found = true;
            }
        }

        return single as TElement | TFiltered | null;
    }

    public skip(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.skipGenerator(count));
    }

    public skipLast(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.skipLastGenerator(count));
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.skipWhileGenerator(predicate));
    }

    public async span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]>;
    public async span(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;
    public async span<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>]> {
        const predicateFn = predicate as Predicate<TElement>;
        const span = new List<TElement>();
        const rest = new List<TElement>();
        let found = false;

        for await (const item of this) {
            if (!found && predicateFn(item)) {
                span.add(item);
            } else {
                found = true;
                rest.add(item);
            }
        }
        return [new Enumerable(span), new Enumerable(rest)] as [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public async standardDeviation(selector?: Selector<TElement, number>, sample?: boolean): Promise<number> {
        const variance = await this.variance(selector, sample);
        return Number.isNaN(variance) ? variance : Math.sqrt(variance);
    }

    public step(step: number): IAsyncEnumerable<TElement> {
        if (step < 1) {
            throw new InvalidArgumentException("Step must be greater than 0.", "step");
        }
        return new AsyncEnumerator<TElement>(() => this.stepGenerator(step));
    }

    public async sum(selector?: Selector<TElement, number>): Promise<number> {
        let count = 0;
        let sum = 0;
        for await (const element of this) {
            sum += selector?.(element) ?? element as unknown as number;
            ++count;
        }
        if (count === 0) {
            throw new NoElementsException();
        }
        return sum;
    }

    public take(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.takeGenerator(count));
    }

    public takeLast(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.takeLastGenerator(count));
    }

    public takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;
    public takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    public takeWhile<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TElement> | IAsyncEnumerable<TFiltered> {
        return new AsyncEnumerator<TElement>(() => this.takeWhileGenerator(predicate as IndexedPredicate<TElement>));
    }

    public tap(action: IndexedAction<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.tapGenerator(action));
    }

    public thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, true, true, comparator);
    }

    public thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, false, true, comparator);
    }

    public async toArray(): Promise<TElement[]> {
        const result: TElement[] = [];
        for await (const element of this) {
            result.push(element);
        }
        return result;
    }

    public async toCircularLinkedList(comparator?: EqualityComparator<TElement>): Promise<CircularLinkedList<TElement>> {
        return new CircularLinkedList<TElement>(await this.toArray(), comparator);
    }

    public async toCircularQueue(comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;
    public async toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;
    public async toCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): Promise<CircularQueue<TElement>> {
        let capacity: number | undefined;
        let comparer: EqualityComparator<TElement> | undefined;

        if (typeof capacityOrComparator === "number") {
            capacity = capacityOrComparator;
            comparer = comparator;
        } else {
            comparer = capacityOrComparator;
        }

        const queue = new CircularQueue<TElement>(capacity, comparer);
        queue.addAll(await this.toArray());
        return queue;
    }

    public async toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<Dictionary<TKey, TValue>> {
        const dictionary = new Dictionary<TKey, TValue>([], valueComparator);
        for await (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            dictionary.add(key, value);
        }
        return dictionary;
    }

    public async toEnumerableSet(): Promise<EnumerableSet<TElement>> {
        return new EnumerableSet<TElement>(await this.toArray());
    }

    public async toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;
    public async toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;
    public async toImmutableCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): Promise<ImmutableCircularQueue<TElement>> {
        const items = await this.toArray();
        if (typeof capacityOrComparator === "number") {
            return ImmutableCircularQueue.create(capacityOrComparator, items, comparator);
        }
        return ImmutableCircularQueue.create(items, capacityOrComparator);
    }

    public async toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableDictionary<TKey, TValue>> {
        const dictionary = await this.toDictionary(keySelector, valueSelector, valueComparator);
        const pairs = dictionary.keys().zip(dictionary.values()).select(x => new KeyValuePair(x[0], x[1]));
        return ImmutableDictionary.create(pairs);
    }

    public async toImmutableList(comparator?: EqualityComparator<TElement>): Promise<ImmutableList<TElement>> {
        return ImmutableList.create(await this.toArray(), comparator);
    }

    public async toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): Promise<ImmutablePriorityQueue<TElement>> {
        return ImmutablePriorityQueue.create(await this.toArray(), comparator);
    }

    public async toImmutableQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableQueue<TElement>> {
        return ImmutableQueue.create(await this.toArray(), comparator);
    }

    public async toImmutableSet(): Promise<ImmutableSet<TElement>> {
        return ImmutableSet.create(await this.toArray());
    }

    public async toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableSortedDictionary<TKey, TValue>> {
        const dictionary = await this.toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
        const pairs = dictionary.keys().zip(dictionary.values()).select(x => new KeyValuePair(x[0], x[1]));
        return ImmutableSortedDictionary.create(pairs);
    }

    public async toImmutableSortedSet(comparator?: OrderComparator<TElement>): Promise<ImmutableSortedSet<TElement>> {
        return ImmutableSortedSet.create(await this.toArray(), comparator);
    }

    public async toImmutableStack(comparator?: EqualityComparator<TElement>): Promise<ImmutableStack<TElement>> {
        return ImmutableStack.create(await this.toArray(), comparator);
    }

    public async toLinkedList(comparator?: EqualityComparator<TElement>): Promise<LinkedList<TElement>> {
        return new LinkedList<TElement>(await this.toArray(), comparator);
    }

    public async toList(comparator?: EqualityComparator<TElement>): Promise<List<TElement>> {
        return new List<TElement>(await this.toArray(), comparator);
    }

    public async toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): Promise<ILookup<TKey, TValue>> {
        const sequence = Enumerable.from(await this.toArray());
        return Lookup.create(sequence, keySelector, valueSelector, keyComparator);
    }

    public async toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Map<TKey, TValue>> {
        const map = new Map<TKey, TValue>();
        for await (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            map.set(key, value);
        }
        return map;
    }

    public async toObject<TKey extends PropertyKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Record<TKey, TValue>> {
        const obj: Record<TKey, TValue> = {} as Record<TKey, TValue>;
        for await (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            obj[key] = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
        }
        return obj;
    }

    public async toPriorityQueue(comparator?: OrderComparator<TElement>): Promise<PriorityQueue<TElement>> {
        return new PriorityQueue<TElement>(await this.toArray(), comparator);
    }

    public async toQueue(comparator?: EqualityComparator<TElement>): Promise<Queue<TElement>> {
        return new Queue<TElement>(await this.toArray(), comparator);
    }

    public async toSet(): Promise<Set<TElement>> {
        return new Set(await this.toArray());
    }

    public async toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<SortedDictionary<TKey, TValue>> {
        const dictionary = new SortedDictionary<TKey, TValue>([], keyComparator, valueComparator);
        for await (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            dictionary.add(key, value);
        }
        return dictionary;
    }

    public async toSortedSet(comparator?: OrderComparator<TElement>): Promise<SortedSet<TElement>> {
        return new SortedSet<TElement>(await this.toArray(), comparator);
    }

    public async toStack(comparator?: EqualityComparator<TElement>): Promise<Stack<TElement>> {
        return new Stack<TElement>(await this.toArray(), comparator);
    }

    public union(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.unionGenerator(iterable, comparator));
    }

    public unionBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.unionByGenerator(enumerable, keySelector, comparator));
    }

    public async variance(selector?: Selector<TElement, number>, sample: boolean = true): Promise<number> {
        const numberSelector = resolveNumberSelector(selector);
        const stats = await accumulateSingleStatsAsync(this, numberSelector);

        if (stats.count === 0 || (sample && stats.count < 2)) {
            return Number.NaN;
        }

        return sample ? stats.sumSq / (stats.count - 1) : stats.sumSq / stats.count;
    }

    public where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;
    public where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    public where<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TElement> | IAsyncEnumerable<TFiltered> {
        return new AsyncEnumerator<TElement>(() => this.whereGenerator(predicate as IndexedPredicate<TElement>));
    }

    public windows(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.windowsGenerator(size));
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, resultSelector?: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.zipGenerator(iterable, resultSelector));
    }

    public zipMany<TIterable extends readonly AsyncIterable<unknown>[]>(
        ...iterables: [...TIterable]
    ): IAsyncEnumerable<[TElement, ...UnpackAsyncIterableTuple<TIterable>]>;
    public zipMany<TIterable extends readonly AsyncIterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable, ZipManyZipper<[TElement, ...UnpackAsyncIterableTuple<TIterable>], TResult>]
    ): IAsyncEnumerable<TResult>;
    public zipMany<TIterable extends readonly AsyncIterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable] | [...TIterable, ZipManyZipper<[TElement, ...UnpackAsyncIterableTuple<TIterable>], TResult>]
    ): IAsyncEnumerable<[TElement, ...UnpackAsyncIterableTuple<TIterable>]> | IAsyncEnumerable<TResult> {
        const lastArg = iterablesAndZipper[iterablesAndZipper.length - 1];
        const hasZipper = iterablesAndZipper.length > 0 && typeof lastArg === "function";
        if (hasZipper) {
            const iterables = iterablesAndZipper.slice(0, -1) as [...TIterable];
            const zipper = lastArg as ZipManyZipper<[TElement, ...UnpackAsyncIterableTuple<TIterable>], TResult>;
            return new AsyncEnumerator<TResult>(() => this.zipManyWithZipperGenerator(iterables, zipper));
        }
        const iterables = iterablesAndZipper as [...TIterable];
        return new AsyncEnumerator<[TElement, ...UnpackAsyncIterableTuple<TIterable>]>(() => this.zipManyWithoutZipperGenerator(iterables));
    }

    private async* appendGenerator(element: TElement): AsyncIterableIterator<TElement> {
        yield* this;
        yield element;
    }

    private async* cartesianGenerator<TSecond>(iterable: AsyncIterable<TSecond>): AsyncIterableIterator<[TElement, TSecond]> {
        const cache: TSecond[] = [];
        for await (const item of iterable) {
            cache.push(item);
        }
        if (cache.length === 0) {
            return;
        }
        for await (const element of this) {
            for (let cx = 0; cx < cache.length; cx++) {
                yield [element, cache[cx]];
            }
        }
    }

    private async* castGenerator<TResult>(): AsyncIterableIterator<TResult> {
        for await (const element of this) {
            yield element as unknown as TResult;
        }
    }

    private async* chunkGenerator(size: number): AsyncIterableIterator<IEnumerable<TElement>> {
        const buffer: TElement[] = [];
        for await (const element of this) {
            buffer.push(element);
            if (buffer.length === size) {
                yield Enumerable.from([...buffer]);
                buffer.length = 0;
            }
        }
        if (buffer.length > 0) {
            yield Enumerable.from([...buffer]);
        }
    }

    private async* combinationsGenerator(size?: number): AsyncIterableIterator<IEnumerable<TElement>> {
        const items: TElement[] = [];

        for await (const item of this) {
            items.push(item);
        }

        const n = items.length;
        const totalCombinations = 1 << n;
        const seen = new Set<string>();

        for (let cx = 0; cx < totalCombinations; cx++) {
            const combination = new List<TElement>();

            for (let jx = 0; jx < n; jx++) {
                if (cx & (1 << jx)) {
                    combination.add(items[jx]);
                }
            }

            if (size === undefined || combination.length === size) {
                const key = combination.aggregate((acc, cur) => acc + cur, ","); // Join elements to create a string key
                if (!seen.has(key)) {
                    seen.add(key);
                    yield combination;
                }
            }
        }
    }

    private async* compactGenerator(): AsyncIterableIterator<NonNullable<TElement>> {
        for await (const item of this) {
            if (item != null) {
                yield item;
            }
        }
    }

    private async* concatGenerator(other: AsyncIterable<TElement>): AsyncIterableIterator<TElement> {
        yield* this;
        yield* other;
    }

    private async* cycleGenerator(count?: number): AsyncIterableIterator<TElement> {
        const elements = [];
        for await (const item of this) {
            elements.push(item);
        }

        if (elements.length === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }

        if (count == null) {
            while (true) {
                for (const element of elements) {
                    yield element;
                }
            }
        } else {
            for (let i = 0; i < count; ++i) {
                for (const element of elements) {
                    yield element;
                }
            }
        }
    }

    private async* defaultIfEmptyGenerator(defaultValue?: TElement | null): AsyncIterableIterator<TElement | null> {
        let hasElements = false;
        for await (const element of this) {
            hasElements = true;
            yield element;
        }
        if (!hasElements) {
            yield defaultValue ?? null;
        }
    }

    private async* distinctUntilChangedGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey>): AsyncIterableIterator<TElement> {
        const iterator = this[Symbol.asyncIterator]();
        let next = await iterator.next();
        if (next.done) {
            return yield* [];
        }
        let previousValue = next.value;
        yield previousValue;
        while (!next.done) {
            next = await iterator.next();
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

    private async* exceptByGenerator<TKey>(iterable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey> | OrderComparator<TKey>): AsyncIterableIterator<TElement> {
        const keySet = new SortedSet<TKey>([], comparator as OrderComparator<TKey>);
        const keyList = new List<TKey>([], comparator as EqualityComparator<TKey>);

        const {value: first, done} = await new AsyncEnumerator(() => iterable)[Symbol.asyncIterator]().next();
        if (done) {
            return yield* this;
        }

        const firstKey = keySelector(first);
        const keyCollection = typeof comparator(firstKey, firstKey) === "number" ? keySet : keyList;

        keyCollection.add(firstKey);

        for await (const element of iterable) {
            const key = keySelector(element);
            keyCollection.add(key);
        }

        for await (const element of this) {
            const key = keySelector(element);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
                yield element;
            }
        }
    }

    private async* exceptGenerator(iterable: AsyncIterable<TElement>, comparator: EqualityComparator<TElement> |  OrderComparator<TElement>): AsyncIterableIterator<TElement> {
        return yield* this.exceptByGenerator(iterable, e => e, comparator);
    }

    private async* groupByGenerator<TKey>(
        keySelector: Selector<TElement, TKey>,
        keyComparator: EqualityComparator<TKey>
    ): AsyncIterableIterator<IGroup<TKey, TElement>> {

        const groupMap = new Map<TKey, IGroup<TKey, TElement>>();

        const findExistingKeyInMap = (targetKey: TKey): TKey | undefined => {
            for (const existingKey of groupMap.keys()) {
                if (keyComparator(existingKey, targetKey)) {
                    return existingKey;
                }
            }
            return undefined;
        };

        for await (const element of this) {
            const key = keySelector(element);
            let group: IGroup<TKey, TElement> | undefined;
            const existingMapKey = findExistingKeyInMap(key);

            if (existingMapKey !== undefined) {
                group = groupMap.get(existingMapKey);
                if (!group) {
                    throw new NoSuchElementException(`Group with key ${existingMapKey} not found.`);
                }
            }

            if (group) {
                (group.source as List<TElement>).add(element);
            } else {
                const newList = new List<TElement>([element]);
                const newGroup = new Group<TKey, TElement>(key, newList);
                groupMap.set(key, newGroup);
            }
        }
        yield* groupMap.values();
    }

    private async* groupJoinGenerator<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator: EqualityComparator<TKey>): AsyncIterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const lookupStore: Array<GroupJoinLookup<TKey, TInner>> = [];

        for await (const innerElement of inner) {
            const innerKey = innerKeySelector(innerElement);
            const group = findOrCreateGroupEntry(lookupStore, innerKey, keyCompare);
            group.push(innerElement);
        }

        for await (const element of this) {
            const outerKey = outerKeySelector(element);
            const joinedEntries = findGroupInStore(lookupStore, outerKey, keyCompare);
            yield resultSelector(element, Enumerable.from(joinedEntries ?? []));
        }
    }

    private async* indexGenerator(): AsyncIterableIterator<[number, TElement]> {
        let index = 0;
        for await (const element of this) {
            yield [index++, element];
        }
    }

    private async* interleaveGenerator<TSecond>(other: AsyncIterable<TSecond>): AsyncIterableIterator<TElement | TSecond> {
        const sourceIterator = this[Symbol.asyncIterator]();
        const otherIterator = other[Symbol.asyncIterator]();
        let nextSource = await sourceIterator.next();
        let nextOther = await otherIterator.next();

        while (!nextSource.done || !nextOther.done) {
            if (!nextSource.done) {
                yield nextSource.value;
                nextSource = await sourceIterator.next();
            }
            if (!nextOther.done) {
                yield nextOther.value;
                nextOther = await otherIterator.next();
            }
        }
    }

    private async* intersectByGenerator<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey> | OrderComparator<TKey>): AsyncIterableIterator<TElement> {
        const keySet = new SortedSet<TKey>([], comparator as OrderComparator<TKey>);
        const keyList = new List<TKey>([], comparator as EqualityComparator<TKey>);

        const {value: first, done} = await new AsyncEnumerator(() => enumerable)[Symbol.asyncIterator]().next();
        if (done) {
            return yield* AsyncEnumerable.empty<TElement>();
        }

        const firstKey = keySelector(first);
        const keyCollection = typeof comparator(firstKey, firstKey) === "number" ? keySet : keyList;
        keyCollection.add(firstKey);

        for await (const element of enumerable) {
            const key = keySelector(element);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
            }
        }
        for await (const element of this) {
            const key = keySelector(element);
            if (keyCollection.contains(key)) {
                keyCollection.remove(key);
                yield element;
            }
        }
    }

    private async* intersectGenerator(iterable: AsyncIterable<TElement>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): AsyncIterableIterator<TElement> {
        return yield* this.intersectByGenerator(iterable, e => e, comparator);
    }

    private async* intersperseGenerator<TSeparator = TElement>(separator: TSeparator): AsyncIterableIterator<TElement | TSeparator> {
        let index = 0;
        for await (const element of this) {
            if (index > 0) {
                yield separator;
            }
            yield element;
            ++index;
        }
    }

    private async* joinGenerator<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator: EqualityComparator<TKey>, leftJoin: boolean): AsyncIterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const effectiveLeftJoin = leftJoin ?? false;
        const groups = await buildGroupsAsync(inner, innerKeySelector, keyCompare);

        for await (const outerElement of this) {
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

    private async* multimodeGenerator<TKey>(keySelector: Selector<TElement, TKey>): AsyncIterableIterator<TElement> {
        const counts = new Map<TKey, number>();
        const representatives = new Map<TKey, TElement>();
        let max = 0;

        for await (const item of this) {
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

    private async* ofTypeGenerator<TResult extends ObjectType>(type: TResult): AsyncIterableIterator<InferredType<TResult>> {
        const isOfType = typeof type === "string"
            ? ((item: unknown) => typeof item === type) as (item: unknown) => item is InferredType<TResult>
            : (item: unknown): item is InferredType<TResult> => item instanceof (ClassType(type) as any);
        for await (const item of this) {
            if (isOfType(item)) {
                yield item;
            }
        }
    }

    private async* pairwiseGenerator(resultSelector: PairwiseSelector<TElement, TElement>): AsyncIterableIterator<[TElement, TElement]> {
        const iterator = this[Symbol.asyncIterator]();
        let next = await iterator.next();
        while (!next.done) {
            const previous = next;
            next = await iterator.next();
            if (!next.done) {
                yield resultSelector(previous.value, next.value);
            }
        }
    }

    private async* permutationsGenerator(size?: number): AsyncIterableIterator<IEnumerable<TElement>> {
        const distinctElements = await this.distinct().toArray();
        yield* permutationsGenerator(distinctElements, size);
    }

    private async* prependGenerator(element: TElement): AsyncIterableIterator<TElement> {
        yield element;
        yield* this;
    }

    private async* reverseGenerator(): AsyncIterableIterator<TElement> {
        yield* (await this.toArray()).reverse();
    }

    private async* rotateGenerator(shift: number): AsyncIterableIterator<TElement> {
        if (shift === 0) {
            return yield* this;
        }
        if (shift > 0) {
            return yield* this.rotateLeftGenerator(shift);
        }
        return yield* this.rotateRightGenerator(shift);
    }

    private async* rotateLeftGenerator(shift: number): AsyncIterableIterator<TElement> {
        const iterator = this[Symbol.asyncIterator]() as AsyncIterator<TElement, TElement, TElement>;
        const head: TElement[] = [];
        let taken = 0;

        while (taken < shift) {
            const next = await iterator.next();
            if (next.done) {
                if (head.length === 0) {
                    return;
                }
                const remainder = shift % head.length;
                for (let i = remainder; i < head.length; ++i) {
                    yield head[i];
                }
                for (let i = 0; i < remainder; ++i) {
                    yield head[i];
                }
                return;
            }
            head.push(next.value);
            ++taken;
        }

        for (let next = await iterator.next(); !next.done; next = await iterator.next()) {
            yield next.value;
        }

        for (const element of head) {
            yield element;
        }
    }

    private async* rotateRightGenerator(shift: number): AsyncIterableIterator<TElement> {
        const buffer = await this.toArray();
        if (buffer.length === 0) {
            return;
        }
        const r = (-shift) % buffer.length;
        const k = (buffer.length - r) % buffer.length;
        for (let index = 0; index < buffer.length; ++index) {
            yield buffer[(index + k) % buffer.length];
        }
    }

    private async* scanGenerator<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): AsyncIterableIterator<TAccumulate> {
        let accumulatedValue: TAccumulate | null = null;
        if (seed == null) {
            let index = 0;
            for await (const element of this) {
                if (index === 0) {
                    accumulatedValue = element as unknown as TAccumulate;
                    yield accumulatedValue;
                } else {
                    accumulatedValue = accumulator(accumulatedValue as TAccumulate, element);
                    yield accumulatedValue;
                }
                ++index;
            }
            if (index === 0) {
                throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
                yield accumulatedValue;
            }
        }
    }

    private async* selectGenerator<TResult>(selector: IndexedSelector<TElement, TResult>): AsyncIterableIterator<TResult> {
        let index = 0;
        for await (const element of this) {
            yield selector(element, index++);
        }
    }

    private async* selectManyGenerator<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): AsyncIterableIterator<TResult> {
        let index = 0;
        for await (const element of this) {
            yield* selector(element, index++);
        }
    }

    private async* shuffleGenerator(): AsyncIterableIterator<TElement> {
        const array = await this.toArray();
        Collections.shuffle(array);
        yield* array;
    }

    private async* skipGenerator(count: number): AsyncIterableIterator<TElement> {
        let index = 0;
        if (count <= 0) {
            yield* this;
        } else {
            for await (const d of this) {
                if (index >= count) {
                    yield d;
                }
                ++index;
            }
        }
    }

    private async* skipLastGenerator(count: number): AsyncIterableIterator<TElement> {
        if (count <= 0) {
            return yield* this;
        }

        const buffer: TElement[] = new Array(count);
        let bufferSize = 0;
        let index = 0;

        for await (const item of this) {
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

    private async* skipWhileGenerator(predicate: IndexedPredicate<TElement>): AsyncIterableIterator<TElement> {
        let index = 0;
        let skipEnded = false;
        for await (const element of this) {
            if (skipEnded) {
                yield element;
            } else if (predicate(element, index)) {
                ++index;
            } else {
                skipEnded = true;
                yield element;
            }
        }
    }

    private async* stepGenerator(step: number): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const element of this) {
            if (index % step === 0) {
                yield element;
            }
            ++index;
        }
    }

    private async* takeGenerator(count: number): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const element of this) {
            if (index < count) {
                yield element;
            } else {
                break;
            }
            ++index;
        }
    }

    private async* takeLastGenerator(count: number): AsyncIterableIterator<TElement> {
        if (count <= 0) {
            return;
        }

        const buffer = new Array<TElement | undefined>(count);
        let startIndex = 0;
        let size = 0;

        for await (const element of this) {
            const nextIndex = (startIndex + size) % count;

            buffer[nextIndex] = element;

            if (size < count) {
                size++;
            } else {
                startIndex = (startIndex + 1) % count;
            }
        }

        for (let i = 0; i < size; i++) {
            const readIndex = (startIndex + i) % count;
            yield buffer[readIndex]!;
        }
    }

    private async* takeWhileGenerator(predicate: IndexedPredicate<TElement>): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const element of this) {
            if (predicate(element, index)) {
                yield element;
            } else {
                break;
            }
            ++index;
        }
    }

    private async* tapGenerator(action: IndexedAction<TElement>): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const element of this) {
            action(element, index++);
            yield element;
        }
    }

    private async* unionByGenerator<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): AsyncIterableIterator<TElement> {
        const seenKeys = new Map<TKey, boolean>();
        comparator ??= Comparators.equalityComparator;

        const isDefaultComparator = comparator === Comparators.equalityComparator;
        for await (const source of [this, enumerable]) {
            for await (const element of source) {
                const key = keySelector(element);
                let exists = false;

                if (isDefaultComparator) {
                    exists = seenKeys.has(key);
                } else {
                    for (const seenKey of seenKeys.keys()) {
                        if (comparator(key, seenKey)) {
                            exists = true;
                            break;
                        }
                    }
                }

                if (!exists) {
                    yield element;
                    seenKeys.set(key, true);
                }
            }
        }
    }

    private async* unionGenerator(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): AsyncIterableIterator<TElement> {
        yield* this.unionByGenerator(iterable, element => element, comparator);
    }

    private async* whereGenerator(predicate: IndexedPredicate<TElement>): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const d of this) {
            if (predicate(d, index)) {
                yield d;
            }
            ++index;
        }
    }

    private async* windowsGenerator(size: number): AsyncIterableIterator<IEnumerable<TElement>> {
        const window: TElement[] = new Array(size);
        let index = 0;
        let count = 0;

        for await (const element of this) {
            window[index] = element;
            index = (index + 1) % size;

            if (count < size) {
                count++;
            }

            if (count === size) {
                const result: TElement[] = [];
                for (let i = 0; i < size; i++) {
                    const readIndex = (index + i) % size;
                    result.push(window[readIndex]);
                }
                yield Enumerable.from(result);
            }
        }
    }

    private async* zipGenerator<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): AsyncIterableIterator<TResult> {
        const iterator1 = this[Symbol.asyncIterator]();
        const iterator2 = iterable[Symbol.asyncIterator]();
        let next1 = await iterator1.next();
        let next2 = await iterator2.next();
        while (!next1.done && !next2.done) {
            yield zipper?.(next1.value, next2.value) ?? [next1.value, next2.value] as TResult;
            next1 = await iterator1.next();
            next2 = await iterator2.next();
        }
    }

    private async* zipManyWithZipperGenerator<TIterable extends readonly AsyncIterable<unknown>[], TResult>(
        iterables: readonly [...TIterable],
        zipper: ZipManyZipper<[TElement, ...UnpackAsyncIterableTuple<TIterable>], TResult>
    ): AsyncIterableIterator<TResult> {
        for await (const values of this.zipManyWithoutZipperGenerator(iterables)) {
            yield zipper(values as readonly [TElement, ...UnpackAsyncIterableTuple<TIterable>]);
        }
    }

    private async* zipManyWithoutZipperGenerator<TIterable extends readonly AsyncIterable<unknown>[]>(
        iterables: readonly [...TIterable]
    ): AsyncIterableIterator<[TElement, ...UnpackAsyncIterableTuple<TIterable>]> {
        const iterators = [this, ...iterables].map(iterable => iterable[Symbol.asyncIterator]());
        while (true) {
            const results = await Promise.all(iterators.map(iterator => iterator.next()));
            if (results.some(result => result.done)) {
                break;
            }
            yield results.map(result => result.value) as [TElement, ...UnpackAsyncIterableTuple<TIterable>];
        }
    }
}
