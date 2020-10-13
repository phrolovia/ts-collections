import {EqualityComparator} from "../shared/EqualityComparator";
import {Accumulator} from "../shared/Accumulator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Zipper} from "../shared/Zipper";
import {JoinSelector} from "../shared/JoinSelector";
import {OrderComparator} from "../shared/OrderComparator";
import {Dictionary, IGrouping, IOrderedEnumerable, List} from "../../imports";

export interface IEnumerable<TElement> extends Iterable<TElement> {
    aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;
    all(predicate?: Predicate<TElement>): boolean;
    any(predicate?: Predicate<TElement>): boolean;
    append(element: TElement): IEnumerable<TElement>;
    average(selector?: Selector<TElement, number>): number;
    concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement>;
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;
    count(predicate?: Predicate<TElement>): number;
    defaultIfEmpty(value?: TElement): IEnumerable<TElement>;
    distinct(comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    elementAt(index: number): TElement;
    elementAtOrDefault(index: number): TElement;
    except(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    first(predicate?: Predicate<TElement>): TElement;
    firstOrDefault(predicate?: Predicate<TElement>): TElement;
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGrouping<TKey, TElement>>;
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                       resultSelector: JoinSelector<TKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;
    intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                  resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult>;
    last(predicate?: Predicate<TElement>): TElement;
    lastOrDefault(predicate?: Predicate<TElement>): TElement;
    max(selector?: Selector<TElement, number>): number;
    min(selector?: Selector<TElement, number>): number;
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    prepend(element: TElement): IEnumerable<TElement>;
    reverse(): IEnumerable<TElement>;
    select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult>;
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;
    sequenceEqual(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean;
    single(predicate?: Predicate<TElement>): TElement;
    singleOrDefault(predicate?: Predicate<TElement>): TElement;
    skip(count: number): IEnumerable<TElement>;
    skipLast(count: number): IEnumerable<TElement>;
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    sum(selector?: Selector<TElement, number>): number;
    take(count: number): IEnumerable<TElement>;
    takeLast(count: number): IEnumerable<TElement>;
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    toArray(): TElement[];
    toDictionary<TKey, TValue>(keySelector?: Selector<TElement, TKey>, valueSelector?: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;
    toList(comparator?: EqualityComparator<TElement>): List<TElement>;
    union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    zip<TSecond, TResult=[TElement, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult>;
}
