import {EqualityComparator} from "../shared/EqualityComparator";
import {Accumulator} from "../shared/Accumulator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {List} from "../list/List";

export interface IEnumerable<TElement> extends Iterable<TElement> {
    aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;
    all(predicate?: Predicate<TElement>): boolean;
    any(predicate?: Predicate<TElement>): boolean;
    append(element: TElement): IEnumerable<TElement>;
    // average(selector?: Selector<T, number>): number;
    concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement>;
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;
    // count(predicate?: Predicate<T>): number;
    // defaultIfEmpty(value?: T): IEnumerable<T>;
    // distinct(comparator?: EqualityComparator<T>): IEnumerable<T>;
    // elementAt(index: number): T;
    // elementAtOrDefault(index: number): T;
    // except(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): IEnumerable<T>;
    first(predicate?: Predicate<TElement>): TElement;
    firstOrDefault(predicate?: Predicate<TElement>): TElement;
    // groupBy<K>(keySelector: Selector<T, K>, keyComparator?: EqualityComparator<K>): IEnumerable<IGrouping<K, T>>;
    // groupJoin<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
    //                    resultSelector: JoinSelector<K, IEnumerable<E>, R>, keyComparator?: EqualityComparator<K>): IEnumerable<R>;
    // intersect(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): IEnumerable<T>;
    // join<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
    //               resultSelector: JoinSelector<T, E, R>, keyComparator?: EqualityComparator<K>, leftJoin?: boolean): IEnumerable<R>;
    // last(predicate?: Predicate<T>): T;
    // lastOrDefault(predicate?: Predicate<T>): T;
    // max(selector?: Selector<T, number>): number;
    // min(selector?: Selector<T, number>): number;
    // orderBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T>;
    // orderByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T>;
    // prepend(item: T): IEnumerable<T>;
    // reverse(): IEnumerable<T>;
    // select<R>(selector: Selector<T, R>): IEnumerable<R>;
    // selectMany<R>(selector: IndexedSelector<T, Iterable<R>>): IEnumerable<R>;
    // sequenceEqual(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): boolean;
    // single(predicate?: Predicate<T>): T;
    // singleOrDefault(predicate?: Predicate<T>): T;
    skip(count: number): IEnumerable<TElement>;
    // skipLast(count: number): IEnumerable<T>;
    // skipWhile(predicate: IndexedPredicate<T>): IEnumerable<T>;
    // sum(selector?: Selector<T, number>): number;
    // take(count: number): IEnumerable<T>;
    // takeLast(count: number): IEnumerable<T>;
    // takeWhile(predicate: IndexedPredicate<T>): IEnumerable<T>;
    toArray(): TElement[];
    // toDictionary<K, V>(keySelector?: Selector<T, K>, valueSelector?: Selector<T, V>, keyComparator?: EqualityComparator<K>): Dictionary<K, V>;
    toList(): List<TElement>;
    // union(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): IEnumerable<T>;
    // where(predicate: Predicate<T>): IEnumerable<T>;
    // zip<R, U=[T,R]>(enumerable: IEnumerable<R>, zipper?: Zipper<T, R, U>): IEnumerable<[T, R]> | IEnumerable<U>;
}
