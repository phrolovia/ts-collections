import {IList} from "../list/IList";

export interface IEnumerable<T> {
    aggregate<R>(accumulator: (acc: R, item: T) => R, seed?: R): R;
    all(predicate?: (item: T) => boolean): boolean;
    any(predicate?: (item: T) => boolean): boolean;
    append(item: T): IEnumerable<T>;
    asEnumerable(): IEnumerable<T>;
    average(predicate?: (item: T, index?: number) => number): number
    contains(item: T): boolean;
    count(): number;
    defaultIfEmpty(value?: T): IEnumerable<T>;
    elementAt(index: number): T;
    elementAtOrDefault(index: number): T;
    // except(enumerable: IEnumerable<T>): IEnumerable<T>;
    first(predicate?: (item: T) => boolean): T;
    firstOrDefault(predicate?: (item: T) => boolean): T;
    last(predicate?: (item: T) => boolean): T;
    lastOrDefault(predicate?: (item: T) => boolean): T;
    max(predicate: (item: T, index?: number) => number): number;
    min(predicate: (item: T, index?: number) => number): number;
    prepend(item: T): IEnumerable<T>;
    repeat(item: T, count: number): IEnumerable<T>;
    reverse(): IEnumerable<T>;
    select<R>(predicate: (item: T) => R): IEnumerable<R>;
    single(predicate?: (item: T) => boolean): T;
    singleOrDefault(predicate?: (item: T) => boolean): T;
    skip(count?: number): IEnumerable<T>;
    skipLast(count?: number): IEnumerable<T>;
    skipWhile(predicate: (item: T, index?: number) => boolean): IEnumerable<T>;
    sum(predicate: (item: T) => number): number;
    take(count: number): IEnumerable<T>;
    takeLast(count: number): IEnumerable<T>;
    takeWhile(predicate: (item: T, index?: number) => boolean): IEnumerable<T>;
    toArray(): Array<T>;
    toList(): IList<T>;
    where(predicate: (item: T) => boolean): IEnumerable<T>;
    zip<R, U>(enumerable: IEnumerable<R>, zipper: (left: T, right: R) => U): IEnumerable<U>;
}
