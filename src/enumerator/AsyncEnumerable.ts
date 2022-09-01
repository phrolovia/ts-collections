import {IAsyncEnumerable} from "./IAsyncEnumerable";
import {AsyncEnumerator} from "./AsyncEnumerator";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "./IEnumerable";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {IndexedAction} from "../shared/IndexedAction";

export class AsyncEnumerable<TElement> implements IAsyncEnumerable<TElement> {
    private readonly enumerator: AsyncEnumerator<TElement>;

    public constructor(private readonly iterable: AsyncIterable<TElement>) {
        this.enumerator = new AsyncEnumerator<TElement>(() => iterable);
    }

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* this.iterable instanceof Function ? this.iterable() : this.iterable;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        return this.enumerator.aggregate(accumulator, seed, resultSelector);
    }

    public all(predicate: Predicate<TElement>): Promise<boolean> {
        return this.enumerator.all(predicate);
    }

    public any(predicate?: Predicate<TElement>): Promise<boolean> {
        return this.enumerator.any(predicate);
    }

    public append(element: TElement): IAsyncEnumerable<TElement> {
        return this.enumerator.append(element);
    }

    public average(selector?: Selector<TElement, number>): Promise<number> {
        return this.enumerator.average(selector);
    }

    public chunk(count: number): IAsyncEnumerable<IEnumerable<TElement>> {
        return this.enumerator.chunk(count);
    }

    public concat(other: IAsyncEnumerable<TElement>): IAsyncEnumerable<TElement> {
        return this.enumerator.concat(other);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        return this.enumerator.contains(element);
    }

    public count(predicate?: Predicate<TElement>): Promise<number> {
        return this.enumerator.count(predicate);
    }

    public defaultIfEmpty(defaultValue?: TElement): IAsyncEnumerable<TElement> {
        return this.enumerator.defaultIfEmpty(defaultValue);
    }

    public distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return this.enumerator.distinct(keySelector, keyComparator);
    }

    public elementAt(index: number): Promise<TElement> {
        return this.enumerator.elementAt(index);
    }

    public elementAtOrDefault(index: number): Promise<TElement | null> {
        return this.enumerator.elementAtOrDefault(index);
    }

    public except(enumerable: IAsyncEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        return this.enumerator.except(enumerable, comparator, orderComparator);
    }

    public first(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.enumerator.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.enumerator.firstOrDefault(predicate);
    }

    public forEach(action: IndexedAction<TElement>): Promise<void> {
        return this.enumerator.forEach(action);
    }

    public prepend(element: TElement): IAsyncEnumerable<TElement> {
        return this.enumerator.prepend(element);
    }

    public select<TResult>(selector: Selector<TElement, TResult>): IAsyncEnumerable<TResult> {
        return this.enumerator.select(selector);
    }

    public skip(count: number): IAsyncEnumerable<TElement> {
        return this.enumerator.skip(count);
    }

    public where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return this.enumerator.where(predicate);
    }

    public async toArray(): Promise<TElement[]> {
        return this.enumerator.toArray();
    }
}