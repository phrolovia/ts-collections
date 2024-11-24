import { KeyValuePair } from "../dictionary/KeyValuePair";
import { AsyncEnumerator, IAsyncEnumerable, IEnumerable, IOrderedAsyncEnumerable } from "../imports";
import { Accumulator } from "../shared/Accumulator";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";
import { IGroup } from "./IGroup";

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

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* this.iterable instanceof Function ? this.iterable() : this.iterable;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        return this.#enumerator.aggregate(accumulator, seed, resultSelector);
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

    public average(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.average(selector);
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

    public concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.concat(other);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        return this.#enumerator.contains(element, comparator);
    }

    public count(predicate?: Predicate<TElement>): Promise<number> {
        return this.#enumerator.count(predicate);
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>> {
        return this.#enumerator.countBy(keySelector, comparator);
    }

    public cycle(count?: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.cycle(count);
    }

    public defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null> {
        return this.#enumerator.defaultIfEmpty(defaultValue);
    }

    public distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.distinct(keySelector, keyComparator);
    }

    public elementAt(index: number): Promise<TElement> {
        return this.#enumerator.elementAt(index);
    }

    public elementAtOrDefault(index: number): Promise<TElement | null> {
        return this.#enumerator.elementAtOrDefault(index);
    }

    public except(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): IAsyncEnumerable<TElement> {
        return this.#enumerator.except(iterable, comparator, orderComparator);
    }

    public first(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.#enumerator.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        return this.#enumerator.firstOrDefault(predicate);
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

    public intersect(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): IAsyncEnumerable<TElement> {
        return this.#enumerator.intersect(iterable, comparator, orderComparator);
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IAsyncEnumerable<TElement | TSeparator> {
        return this.#enumerator.intersperse(separator);
    }

    public join<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IAsyncEnumerable<TResult> {
        return this.#enumerator.join(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.#enumerator.last(predicate);
    }

    public lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        return this.#enumerator.lastOrDefault(predicate);
    }

    public max(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.max(selector);
    }

    public maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        return this.#enumerator.maxBy(keySelector, comparator);
    }

    public min(selector?: Selector<TElement, number>): Promise<number> {
        return this.#enumerator.min(selector);
    }

    public minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        return this.#enumerator.minBy(keySelector, comparator);
    }

    public none(predicate?: Predicate<TElement>): Promise<boolean> {
        return this.#enumerator.none(predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IAsyncEnumerable<InferredType<TResult>> {
        return this.#enumerator.ofType(type);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return this.#enumerator.orderBy(keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return this.#enumerator.orderByDescending(keySelector, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IAsyncEnumerable<[TElement, TElement]> {
        return this.#enumerator.pairwise(resultSelector);
    }

    public partition(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]> {
        return this.#enumerator.partition(predicate);
    }

    public permutations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.#enumerator.permutations(size);
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

    public single(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.#enumerator.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        return this.#enumerator.singleOrDefault(predicate);
    }

    public skip(count: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.skip(count);
    }

    public skipLast(count: number): IAsyncEnumerable<TElement> {
        return this.#enumerator.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.skipWhile(predicate);
    }

    public span(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]> {
        return this.#enumerator.span(predicate);
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

    public takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.takeWhile(predicate);
    }

    public async toArray(): Promise<TElement[]> {
        return this.#enumerator.toArray();
    }

    public union(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.union(iterable, comparator);
    }

    public unionBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.#enumerator.unionBy(enumerable, keySelector, comparator);
    }

    public where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return this.#enumerator.where(predicate);
    }

    public windows(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.#enumerator.windows(size);
    }

    public zip<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<[TElement, TSecond]>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult> {
        return this.#enumerator.zip(iterable, zipper);
    }
}
