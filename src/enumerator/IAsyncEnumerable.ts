import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "./IEnumerable";
import {EqualityComparator} from "../shared/EqualityComparator";

export interface IAsyncEnumerable<TElement> extends AsyncIterable<TElement> {
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult>;
    all(predicate?: Predicate<TElement>): Promise<boolean>;
    any(predicate?: Predicate<TElement>): Promise<boolean>;
    append(element: TElement): IAsyncEnumerable<TElement>;
    average(selector?: Selector<TElement, number>): Promise<number>;
    chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>>;
    concat(other: IAsyncEnumerable<TElement>): IAsyncEnumerable<TElement>;
    contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean>;
    count(predicate?: Predicate<TElement>): Promise<number>;
    defaultIfEmpty(defaultValue?: TElement): IAsyncEnumerable<TElement>;
    first(predicate?: Predicate<TElement>): Promise<TElement>;
    firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement>;
    prepend(element: TElement): IAsyncEnumerable<TElement>;
    select<TResult>(selector: Selector<TElement, TResult>): IAsyncEnumerable<TResult>;
    skip(count: number): IAsyncEnumerable<TElement>;
    where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;
    toArray(): Promise<TElement[]>;
}