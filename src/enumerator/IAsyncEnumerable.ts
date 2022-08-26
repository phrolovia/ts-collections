import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {Predicate} from "../shared/Predicate";

export interface IAsyncEnumerable<TElement> extends AsyncIterable<TElement> {
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult>;
    all(predicate?: Predicate<TElement>): Promise<boolean>;
    any(predicate?: Predicate<TElement>): Promise<boolean>;
    append(element: TElement): IAsyncEnumerable<TElement>;
    average(selector?: Selector<TElement, number>): Promise<number>;
    first(predicate?: Predicate<TElement>): Promise<TElement>;
    firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement>;
    prepend(element: TElement): IAsyncEnumerable<TElement>;
    select<TResult>(selector: Selector<TElement, TResult>): IAsyncEnumerable<TResult>;
    skip(count: number): IAsyncEnumerable<TElement>;
    where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    toArray(): Promise<TElement[]>;
}