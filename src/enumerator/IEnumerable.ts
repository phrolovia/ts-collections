import {EqualityComparator} from "../shared/EqualityComparator";
import {Accumulator} from "../shared/Accumulator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {List} from "../list/List";
import {IndexedPredicate} from "../shared/IndexedPredicate";

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
    // groupBy<K>(keySelector: Selector<T, K>, keyComparator?: EqualityComparator<K>): IEnumerable<IGrouping<K, T>>;
    // groupJoin<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
    //                    resultSelector: JoinSelector<K, IEnumerable<E>, R>, keyComparator?: EqualityComparator<K>): IEnumerable<R>;
    intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    // join<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
    //               resultSelector: JoinSelector<T, E, R>, keyComparator?: EqualityComparator<K>, leftJoin?: boolean): IEnumerable<R>;
    last(predicate?: Predicate<TElement>): TElement;
    lastOrDefault(predicate?: Predicate<TElement>): TElement;
    max(selector?: Selector<TElement, number>): number;
    min(selector?: Selector<TElement, number>): number;
    // orderBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T>;
    // orderByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T>;
    prepend(item: TElement): IEnumerable<TElement>;
    reverse(): IEnumerable<TElement>;
    select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult>;
    // selectMany<R>(selector: IndexedSelector<T, Iterable<R>>): IEnumerable<R>;
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
    // toDictionary<K, V>(keySelector?: Selector<T, K>, valueSelector?: Selector<T, V>, keyComparator?: EqualityComparator<K>): Dictionary<K, V>;
    toList(): List<TElement>;
    union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    // zip<R, U=[T,R]>(enumerable: IEnumerable<R>, zipper?: Zipper<T, R, U>): IEnumerable<[T, R]> | IEnumerable<U>;
}
