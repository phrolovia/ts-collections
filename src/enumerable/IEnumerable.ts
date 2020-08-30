import {IList} from "../list/IList";
import {IGrouping} from "./IGrouping";
import {IOrderedEnumerable} from "./IOrderedEnumerable";

export interface IEnumerable<T> {
    aggregate<R>(accumulator: (acc: R, item: T) => R, seed?: R): R;
    all(predicate?: (item: T) => boolean): boolean;
    any(predicate?: (item: T) => boolean): boolean;
    append(item: T): IEnumerable<T>;
    asEnumerable(): IEnumerable<T>;
    average(predicate?: (item: T, index?: number) => number): number;
    concat(enumerable: IEnumerable<T>): IEnumerable<T>;
    contains(item: T, comparator?: (item1: T, item2: T) => number): boolean;
    count(predicate?: (item: T) => boolean): number;
    defaultIfEmpty(value?: T): IEnumerable<T>;
    distinct(comparer?: (item1: T, item2: T) => number): IEnumerable<T>;
    elementAt(index: number): T;
    elementAtOrDefault(index: number): T;
    except(enumerable: IEnumerable<T>, comparator?: (item1: T, item2: T) => number): IEnumerable<T>;
    first(predicate?: (item: T) => boolean): T;
    firstOrDefault(predicate?: (item: T) => boolean): T;
    groupBy<R>(keySelector: (item: T) => R, keyComparator?: (item1: R, item2: R) => number): IEnumerable<IGrouping<R, T>>;
    intersect(enumerable: IEnumerable<T>, comparator?: (item1: T, item2: T) => number): IEnumerable<any>;
    join<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: (item: T) => K, innerKeySelector: (item: E) => K,
                  resultSelector: (outerItem: T, innerItem: E) => R, keyComparator?: (item1: K, item2: K) => number, leftJoin?: boolean): IEnumerable<R>;
    groupJoin<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: (item: T) => K, innerKeySelector: (item: E) => K,
                       resultSelector: (key: K, data: IEnumerable<E>) => R,
                       keyComparator?: (item1: K, item2: K) => number): IEnumerable<R>;
    last(predicate?: (item: T) => boolean): T;
    lastOrDefault(predicate?: (item: T) => boolean): T;
    max(predicate: (item: T, index?: number) => number): number;
    min(predicate: (item: T, index?: number) => number): number;
    orderBy<K>(keySelector: (item: T) => K, comparator?: (item1: K, item2: K) => number): IOrderedEnumerable<T>;
    orderByDescending<K>(keySelector: (item: T) => K, comparator?: (item1: K, item2: K) => number): IOrderedEnumerable<T>;
    prepend(item: T): IEnumerable<T>;
    repeat(item: T, count: number): IEnumerable<T>;
    reverse(): IEnumerable<T>;
    select<R>(predicate: (item: T, index?: number) => R): IEnumerable<R>;
    selectMany<R>(predicate: (item: T, index?: number) => IEnumerable<R>|Array<R>): IEnumerable<R>;
    sequenceEqual(enumerable: IEnumerable<T>, comparator?: (item1: T, item2: T) => number): boolean;
    single(predicate?: (item: T) => boolean): T;
    singleOrDefault(predicate?: (item: T) => boolean): T;
    skip(count: number): IEnumerable<T>;
    skipLast(count: number): IEnumerable<T>;
    skipWhile(predicate: (item: T, index?: number) => boolean): IEnumerable<T>;
    sum(predicate: (item: T) => number): number;
    take(count: number): IEnumerable<T>;
    takeLast(count: number): IEnumerable<T>;
    takeWhile(predicate: (item: T, index?: number) => boolean): IEnumerable<T>;
    toArray(): Array<T>;
    toList(): IList<T>;
    union(enumerable: IEnumerable<T>|Array<T>, comparator?:  (item1: T, item2: T) => number): IEnumerable<T>;
    where(predicate: (item: T) => boolean): IEnumerable<T>;
    zip<R, U>(enumerable: IEnumerable<R>, zipper: (left: T, right: R) => U): IEnumerable<U>;
}
