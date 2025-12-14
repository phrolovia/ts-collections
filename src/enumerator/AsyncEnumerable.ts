import type { Dictionary } from "../dictionary/Dictionary";
import type { ImmutableDictionary } from "../dictionary/ImmutableDictionary";
import type { ImmutableSortedDictionary } from "../dictionary/ImmutableSortedDictionary";
import type { KeyValuePair } from "../dictionary/KeyValuePair";
import type { SortedDictionary } from "../dictionary/SortedDictionary";
import type { CircularLinkedList } from "../list/CircularLinkedList";
import type { ImmutableList } from "../list/ImmutableList";
import type { LinkedList } from "../list/LinkedList";
import type { List } from "../list/List";
import type { ILookup } from "../lookup/ILookup";
import type { CircularQueue } from "../queue/CircularQueue";
import type { ImmutableCircularQueue } from "../queue/ImmutableCircularQueue";
import type { ImmutablePriorityQueue } from "../queue/ImmutablePriorityQueue";
import type { ImmutableQueue } from "../queue/ImmutableQueue";
import type { PriorityQueue } from "../queue/PriorityQueue";
import type { Queue } from "../queue/Queue";
import type { EnumerableSet } from "../set/EnumerableSet";
import type { ImmutableSet } from "../set/ImmutableSet";
import type { ImmutableSortedSet } from "../set/ImmutableSortedSet";
import type { SortedSet } from "../set/SortedSet";
import type { Accumulator } from "../shared/Accumulator";
import type { EqualityComparator } from "../shared/EqualityComparator";
import type { IndexedAction } from "../shared/IndexedAction";
import type { IndexedPredicate, IndexedTypePredicate } from "../shared/IndexedPredicate";
import type { IndexedSelector } from "../shared/IndexedSelector";
import type { InferredType } from "../shared/InferredType";
import type { JoinSelector } from "../shared/JoinSelector";
import type { MedianTieStrategy } from "../shared/MedianTieStrategy";
import type { ObjectType } from "../shared/ObjectType";
import type { OrderComparator } from "../shared/OrderComparator";
import type { PairwiseSelector } from "../shared/PairwiseSelector";
import type { PercentileStrategy } from "../shared/PercentileStrategy";
import type { AsyncPipeOperator } from "../shared/PipeOperator";
import type { Predicate, TypePredicate } from "../shared/Predicate";
import type { Selector } from "../shared/Selector";
import type { UnpackAsyncIterableTuple } from "../shared/UnpackAsyncIterableTuple";
import type { ZipManyZipper, Zipper } from "../shared/Zipper";
import type { ImmutableStack } from "../stack/ImmutableStack";
import type { Stack } from "../stack/Stack";
import { AsyncEnumerator } from "./AsyncEnumerator";
import { ensureSequenceArgumentValidity } from "./helpers/sequenceHelpers";
import type { IAsyncEnumerable } from "./IAsyncEnumerable";
import type { IEnumerable } from "./IEnumerable";
import type { IGroup } from "./IGroup";
import type { IOrderedAsyncEnumerable } from "./IOrderedAsyncEnumerable";

export class AsyncEnumerable<TElement> implements IAsyncEnumerable<TElement> {
    readonly #enumerator: AsyncEnumerator<TElement>;

    public constructor(private readonly iterable: AsyncIterable<TElement>) {
        this.#enumerator = new AsyncEnumerator<TElement>(() => iterable);
    }

    public static empty<TSource>(): IAsyncEnumerable<TSource> {
        return new AsyncEnumerator<TSource>(async function* () {
            yield* [];
        });
    }

    public static from<TSource>(source: AsyncIterable<TSource>): IAsyncEnumerable<TSource> {
        return new AsyncEnumerable<TSource>(source);
    }

    public static infiniteSequence(start: number, step: number): IAsyncEnumerable<number> {
        return new AsyncEnumerator(async function* () {
            let ix = start;
            while (true) {
                yield ix;
                ix += step;
            }
        });
    }

    public static range(start: number, count: number): IAsyncEnumerable<number> {
        return new AsyncEnumerator(async function* () {
            for (let ix = 0; ix < count; ix++) {
                yield start + ix;
            }
        });
    }

    public static repeat<TSource>(element: TSource, count: number): IAsyncEnumerable<TSource> {
        return new AsyncEnumerator(async function* () {
            yield* new Array(count).fill(element);
        });
    }

    public static sequence(start: number, end: number, step: number): IAsyncEnumerable<number> {
        ensureSequenceArgumentValidity(start, end, step);
        if (step === 0 && end === start) {
            return new AsyncEnumerator(async function* () {
                yield start;
            });
        }
        return new AsyncEnumerator(async function* () {
            if (start < end) {
                for (let ix = start; ix <= end; ix += step) {
                    yield ix;
                }
            } else if (start > end) {
                for (let ix = start; ix >= end; ix += step) {
                    yield ix;
                }
            } else {
                yield start;
            }
        });
    }

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* this.iterable instanceof Function ? this.iterable() : this.iterable;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        return this.#enumerator.aggregate(accumulator, seed, resultSelector);
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>> {
        return this.#enumerator.aggregateBy(keySelector, seedSelector, accumulator, keyComparator);
    }

    public all(predicate: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.all(predicate);
    }

    public any(predicate?: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.any(predicate);
    }

    public append(element: TElement): IAsyncEnumerable<TElement> {
        return this.#enumerator.append(element);
    }

    public atLeast(count: number, predicate?: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.atLeast(count, predicate);
    }

    public atMost(count: number, predicate?: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.atMost(count, predicate);
    }

    public average(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.average(selector);
    }

    public cartesian<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<[TElement, TSecond]> {
        return this.#enumerator.cartesian(iterable);
    }

    public cast<TResult>(): IAsyncEnumerable<TResult> {
        return this.#enumerator.cast();
    }

    public chunk(count: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.#enumerator.chunk(count);
    }

    public combinations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.#enumerator.combinations(size);
    }

    public compact(): IAsyncEnumerable<NonNullable<TElement>> {
        return this.#enumerator.compact();
    }

    public concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.concat(other);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        return this.#enumerator.contains(element, comparator);
    }

    public correlation<TSecond>(iterable: AsyncIterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>): Promise<number> {
        return this.#enumerator.correlation(iterable, selector, otherSelector);
    }

    public correlationBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.correlationBy(leftSelector, rightSelector);
    }

    public count(predicate?: Predicate<TElement>): Promise<number> {
        return this.#enumerator.count(predicate);
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>> {
        return this.#enumerator.countBy(keySelector, comparator);
    }

    public covariance<TSecond>(iterable: AsyncIterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>, sample?: boolean): Promise<number> {
        return this.#enumerator.covariance(iterable, selector, otherSelector, sample);
    }

    public covarianceBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>, sample?: boolean): Promise<number> {
        return this.#enumerator.covarianceBy(leftSelector, rightSelector, sample);
    }

    public cycle(count?: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.cycle(count);
    }

    public defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null> {
        return this.#enumerator.defaultIfEmpty(defaultValue);
    }

    public disjoint<TSecond>(iterable: AsyncIterable<TSecond>, comparator?: EqualityComparator<TElement | TSecond>): Promise<boolean> {
        return this.#enumerator.disjoint(iterable, comparator);
    }

    public disjointBy<TSecond, TKey, TSecondKey>(iterable: AsyncIterable<TSecond>, keySelector: Selector<TElement, TKey>, otherKeySelector: Selector<TSecond, TSecondKey>, keyComparator?: EqualityComparator<TKey | TSecondKey>): Promise<boolean> {
        return this.#enumerator.disjointBy(iterable, keySelector, otherKeySelector, keyComparator);
    }

    public distinct(keyComparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.distinct(keyComparator);
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.distinctBy(keySelector, keyComparator);
    }

    public distinctUntilChanged(comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.distinctUntilChanged(comparator);
    }

    public distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.distinctUntilChangedBy(keySelector, keyComparator);
    }

    public elementAt(index: number): Promise<TElement> {
        return this.#enumerator.elementAt(index);
    }

    public elementAtOrDefault(index: number): Promise<TElement | null> {
        return this.#enumerator.elementAtOrDefault(index);
    }

    public exactly(count: number, predicate?: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.exactly(count, predicate);
    }

    public except(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.except(iterable, comparator);
    }

    public exceptBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.exceptBy(enumerable, keySelector, comparator);
    }

    public first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;
    public first(predicate?: Predicate<TElement>): Promise<TElement>;
    public first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered> {
        return this.#enumerator.first(predicate as Predicate<TElement> | undefined) as Promise<TElement | TFiltered>;
    }

    public firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;
    public firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;
    public firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered | null> {
        return this.#enumerator.firstOrDefault(predicate as Predicate<TElement> | undefined) as Promise<TElement | TFiltered | null>;
    }

    public forEach(action: IndexedAction<TElement>): Promise<void> {
        return this.#enumerator.forEach(action);
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<IGroup<TKey, TElement>> {
        return this.#enumerator.groupBy(keySelector, keyComparator);
    }

    public groupJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        return this.#enumerator.groupJoin(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public index(): IAsyncEnumerable<[number, TElement]> {
        return this.#enumerator.index();
    }

    public interleave<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<TElement | TSecond> {
        return this.#enumerator.interleave(iterable);
    }

    public intersect(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.intersect(iterable, comparator);
    }

    public intersectBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.intersectBy(enumerable, keySelector, comparator);
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IAsyncEnumerable<TElement | TSeparator> {
        return this.#enumerator.intersperse(separator);
    }

    public join<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        return this.#enumerator.join(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;
    public last(predicate?: Predicate<TElement>): Promise<TElement>;
    public last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered> {
        return this.#enumerator.last(predicate as Predicate<TElement> | undefined) as Promise<TElement | TFiltered>;
    }

    public lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;
    public lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;
    public lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered | null> {
        return this.#enumerator.lastOrDefault(predicate as Predicate<TElement> | undefined) as Promise<TElement | TFiltered | null>;
    }

    public leftJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        return this.#enumerator.leftJoin(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public max(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.max(selector);
    }

    public maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        return this.#enumerator.maxBy(keySelector, comparator);
    }

    public median(selector?: Selector<TElement, number>, tie?: MedianTieStrategy): Promise<number> {
        return this.#enumerator.median(selector, tie);
    }

    public min(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.min(selector);
    }

    public minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        return this.#enumerator.minBy(keySelector, comparator);
    }

    public mode<TKey>(keySelector?: Selector<TElement, TKey>): Promise<TElement> {
        return this.#enumerator.mode(keySelector);
    }

    public modeOrDefault<TKey>(keySelector?: Selector<TElement, TKey>): Promise<TElement | null> {
        return this.#enumerator.modeOrDefault(keySelector);
    }

    public multimode<TKey>(keySelector?: Selector<TElement, TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.multimode(keySelector);
    }

    public none(predicate?: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.none(predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IAsyncEnumerable<InferredType<TResult>> {
        return this.#enumerator.ofType(type);
    }

    public order(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement> {
        return this.#enumerator.order(comparator);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return this.#enumerator.orderBy(keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return this.#enumerator.orderByDescending(keySelector, comparator);
    }

    public orderDescending(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement> {
        return this.#enumerator.orderDescending(comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IAsyncEnumerable<[TElement, TElement]> {
        return this.#enumerator.pairwise(resultSelector);
    }

    public partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]>;
    public partition(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;
    public partition<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]> | Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]> {
        return this.#enumerator.partition(predicate as Predicate<TElement>) as Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]> | Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;
    }

    public percentile(percent: number, selector?: Selector<TElement, number>, strategy?: PercentileStrategy): Promise<number> {
        return this.#enumerator.percentile(percent, selector, strategy);
    }

    public permutations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.#enumerator.permutations(size);
    }

    public pipe<TResult>(operator: AsyncPipeOperator<TElement, TResult>): Promise<TResult> {
        return this.#enumerator.pipe(operator);
    }

    public prepend(element: TElement): IAsyncEnumerable<TElement> {
        return this.#enumerator.prepend(element);
    }

    public product(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.product(selector);
    }

    public reverse(): IAsyncEnumerable<TElement> {
        return this.#enumerator.reverse();
    }

    public rightJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement | null, TInner, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        return this.#enumerator.rightJoin(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public rotate(shift: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.rotate(shift);
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IAsyncEnumerable<TAccumulate> {
        return this.#enumerator.scan(accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IAsyncEnumerable<TResult> {
        return this.#enumerator.select(selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IAsyncEnumerable<TResult> {
        return this.#enumerator.selectMany(selector);
    }

    public sequenceEqual(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        return this.#enumerator.sequenceEqual(iterable, comparator);
    }

    public shuffle(): IAsyncEnumerable<TElement> {
        return this.#enumerator.shuffle();
    }

    public single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;
    public single(predicate?: Predicate<TElement>): Promise<TElement>;
    public single<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered> {
        return this.#enumerator.single(predicate as Predicate<TElement> | undefined) as Promise<TElement | TFiltered>;
    }

    public singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;
    public singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;
    public singleOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<TElement | TFiltered | null> {
        return this.#enumerator.singleOrDefault(predicate as Predicate<TElement> | undefined) as Promise<TElement | TFiltered | null>;
    }

    public skip(count: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.skip(count);
    }

    public skipLast(count: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.skipLast(count);
    }

    public skipUntil<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;
    public skipUntil(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    public skipUntil<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TElement> | IAsyncEnumerable<TFiltered> {
        return this.#enumerator.skipUntil(predicate);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.skipWhile(predicate);
    }

    public span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]>;
    public span(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;
    public span<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]> | Promise<[IEnumerable<TElement>, IEnumerable<TElement>]> {
        return this.#enumerator.span(predicate as Predicate<TElement>) as Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]> | Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;
    }

    public standardDeviation(selector?: Selector<TElement, number>, sample?: boolean): Promise<number> {
        return this.#enumerator.standardDeviation(selector, sample);
    }

    public step(step: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.step(step);
    }

    public sum(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.sum(selector);
    }

    public take(count: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.take(count);
    }

    public takeLast(count: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.takeLast(count);
    }

    public takeUntil<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;
    public takeUntil(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    public takeUntil<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TElement> | IAsyncEnumerable<TFiltered> {
        return this.#enumerator.takeUntil(predicate);
    }

    public takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;
    public takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    public takeWhile<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TElement> | IAsyncEnumerable<TFiltered> {
        return this.#enumerator.takeWhile(predicate as IndexedPredicate<TElement>);
    }

    public tap(action: IndexedAction<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.tap(action);
    }

    public async toArray(): Promise<TElement[]> {
        return this.#enumerator.toArray();
    }

    public toCircularLinkedList(comparator?: EqualityComparator<TElement>): Promise<CircularLinkedList<TElement>> {
        return this.#enumerator.toCircularLinkedList(comparator);
    }

    public toCircularQueue(comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;
    public toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;
    public toCircularQueue(capacityOrComparator?: number | EqualityComparator<TElement>, comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>> {
        if (typeof capacityOrComparator === "number") {
            return this.#enumerator.toCircularQueue(capacityOrComparator, comparator);
        }
        return this.#enumerator.toCircularQueue(capacityOrComparator);
    }

    public toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<Dictionary<TKey, TValue>> {
        return this.#enumerator.toDictionary(keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): Promise<EnumerableSet<TElement>> {
        return this.#enumerator.toEnumerableSet();
    }

    public toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;
    public toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;
    public toImmutableCircularQueue(capacityOrComparator?: number | EqualityComparator<TElement>, comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>> {
        if (typeof capacityOrComparator === "number") {
            return this.#enumerator.toImmutableCircularQueue(capacityOrComparator, comparator);
        }
        return this.#enumerator.toImmutableCircularQueue(capacityOrComparator);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableDictionary<TKey, TValue>> {
        return this.#enumerator.toImmutableDictionary(keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<TElement>): Promise<ImmutableList<TElement>> {
        return this.#enumerator.toImmutableList(comparator);
    }

    public toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): Promise<ImmutablePriorityQueue<TElement>> {
        return this.#enumerator.toImmutablePriorityQueue(comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableQueue<TElement>> {
        return this.#enumerator.toImmutableQueue(comparator);
    }

    public toImmutableSet(): Promise<ImmutableSet<TElement>> {
        return this.#enumerator.toImmutableSet();
    }

    public toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableSortedDictionary<TKey, TValue>> {
        return this.#enumerator.toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): Promise<ImmutableSortedSet<TElement>> {
        return this.#enumerator.toImmutableSortedSet(comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): Promise<ImmutableStack<TElement>> {
        return this.#enumerator.toImmutableStack(comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): Promise<LinkedList<TElement>> {
        return this.#enumerator.toLinkedList(comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): Promise<List<TElement>> {
        return this.#enumerator.toList(comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): Promise<ILookup<TKey, TValue>> {
        return this.#enumerator.toLookup(keySelector, valueSelector, keyComparator);
    }

    public toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Map<TKey, TValue>> {
        return this.#enumerator.toMap(keySelector, valueSelector);
    }

    public async toObject<TKey extends string | number | symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Record<TKey, TValue>> {
        return this.#enumerator.toObject(keySelector, valueSelector);
    }

    public toPriorityQueue(comparator?: OrderComparator<TElement>): Promise<PriorityQueue<TElement>> {
        return this.#enumerator.toPriorityQueue(comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Promise<Queue<TElement>> {
        return this.#enumerator.toQueue(comparator);
    }

    public toSet(): Promise<Set<TElement>> {
        return this.#enumerator.toSet();
    }

    public toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<SortedDictionary<TKey, TValue>> {
        return this.#enumerator.toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<TElement>): Promise<SortedSet<TElement>> {
        return this.#enumerator.toSortedSet(comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Promise<Stack<TElement>> {
        return this.#enumerator.toStack(comparator);
    }

    public union(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.union(iterable, comparator);
    }

    public unionBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.unionBy(enumerable, keySelector, comparator);
    }

    public variance(selector?: Selector<TElement, number>, sample?: boolean): Promise<number> {
        return this.#enumerator.variance(selector, sample);
    }

    public where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;
    public where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    public where<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TElement> | IAsyncEnumerable<TFiltered> {
        return this.#enumerator.where(predicate as IndexedPredicate<TElement>);
    }

    public windows(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.#enumerator.windows(size);
    }

    public zip<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<[TElement, TSecond]>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult> {
        return this.#enumerator.zip(iterable, zipper);
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
            return this.#enumerator.zipMany(...iterables, zipper);
        }
        const iterables = iterablesAndZipper as [...TIterable];
        return this.#enumerator.zipMany(...iterables);
    }
}
