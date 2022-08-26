import {IAsyncEnumerable} from "./IAsyncEnumerable";
import {AsyncEnumerator} from "./AsyncEnumerator";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {Predicate} from "../shared/Predicate";

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

    public async all(predicate: Predicate<TElement>): Promise<boolean> {
        return this.enumerator.all(predicate);
    }

    public async any(predicate?: Predicate<TElement>): Promise<boolean> {
        return this.enumerator.any(predicate);
    }

    public append(element: TElement): IAsyncEnumerable<TElement> {
        return this.enumerator.append(element);
    }

    public async average(selector?: Selector<TElement, number>): Promise<number> {
        return this.enumerator.average(selector);
    }

    public async first(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.enumerator.first(predicate);
    }

    public async firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement> {
        return this.enumerator.firstOrDefault(predicate);
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