import type { ZipManyZipper } from "../../shared/Zipper";
import type { IEnumerable } from "../IEnumerable";
import type { UnpackIterableTuple } from "../../shared/UnpackIterableTuple";
import { Enumerator } from "../Enumerator";

/**
 * Zips {@link source} with the iterables supplied in {@link iterables}, producing aligned tuples.
 * @template TElement Type of elements in the {@link source} iterable.
 * @template TIterable Extends `readonly Iterable<unknown>[]`; each iterable's element type contributes to the resulting tuple.
 * @param source The primary iterable zipped with the additional iterables.
 * @param iterables Additional iterables to zip with {@link source}.
 * @returns {IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>} A deferred sequence of tuples truncated to the length of the shortest input.
 * @throws {unknown} Re-throws any error raised while iterating {@link source} or any of {@link iterables}.
 * @remarks Iteration stops as soon as any participating iterable is exhausted. Tuple element types are inferred from the supplied iterables, preserving strong typing across the zipped result.
 * @example
 * ```typescript
 * const zipped = zipMany([1, 2, 3], ['A', 'B', 'C'], [true, false]).toArray();
 * console.log(zipped); // [[1, 'A', true], [2, 'B', false]]
 * ```
 */
export function zipMany<TElement, TIterable extends readonly Iterable<unknown>[]>(
    source: Iterable<TElement>,
    ...iterables: [...TIterable]
): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>;

/**
 * Zips {@link source} with the iterables supplied in {@link iterablesAndZipper} and projects each tuple with {@link ZipManyZipper zipper}.
 * @template TElement Type of elements in the {@link source} iterable.
 * @template TIterable Extends `readonly Iterable<unknown>[]`; each iterable's element type contributes to the zipper input tuple.
 * @template TResult Result type produced by {@link ZipManyZipper zipper}.
 * @param source The primary iterable zipped with the additional iterables.
 * @param iterablesAndZipper The trailing argument may be a zipper invoked with each tuple to produce a projected result; preceding arguments are the iterables to zip with.
 * @returns {IEnumerable<TResult>} A deferred sequence of projected results truncated to the length of the shortest input.
 * @throws {unknown} Re-throws any error raised while iterating {@link source}, the supplied iterables, or executing the zipper.
 * @remarks The zipper receives a readonly tuple `[source, ...others]` for each aligned set. Iteration stops as soon as any participating iterable is exhausted.
 * @example
 * ```typescript
 * const labels = zipMany(
 *     [1, 2, 3],
 *     ['A', 'B', 'C'],
 *     [true, true, false],
 *     ([num, letter, flag]) => `${num}${letter}-${flag ? "yes" : "no"}`
 * ).toArray();
 * console.log(labels); // ["1A-yes", "2B-yes", "3C-no"]
 * ```
 */
export function zipMany<TElement, TIterable extends readonly Iterable<unknown>[], TResult>(
    source: Iterable<TElement>,
    ...iterablesAndZipper: [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
): IEnumerable<TResult>;
export function zipMany<TElement, TIterable extends readonly Iterable<unknown>[], TResult>(
    source: Iterable<TElement>,
    ...iterablesAndZipper: [...TIterable] | [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]> | IEnumerable<TResult> {
    const lastArg = iterablesAndZipper[iterablesAndZipper.length - 1];
    const hasZipper = iterablesAndZipper.length > 0 && typeof lastArg === "function";
    if (hasZipper) {
        const iterables = iterablesAndZipper.slice(0, -1) as [...TIterable];
        const zipper = lastArg as ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>;
        return new Enumerator<TResult>(() => zipManyWithZipperGenerator(source, iterables, zipper));
    }
    const iterables = iterablesAndZipper as [...TIterable];
    return new Enumerator<[TElement, ...UnpackIterableTuple<TIterable>]>(() => zipManyWithoutZipperGenerator(source, iterables));
}

function* zipManyWithZipperGenerator<TElement, TIterable extends readonly Iterable<unknown>[], TResult>(source: Iterable<TElement>, iterables: readonly [...TIterable], zipper: ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>): IterableIterator<TResult> {
    for (const values of zipManyWithoutZipperGenerator(source, iterables)) {
        yield zipper(values as readonly [TElement, ...UnpackIterableTuple<TIterable>]);
    }
}

function* zipManyWithoutZipperGenerator<TElement, TIterable extends readonly Iterable<unknown>[]>(source: Iterable<TElement>, iterables: readonly [...TIterable]): IterableIterator<[TElement, ...UnpackIterableTuple<TIterable>]> {
    const iterators = [source, ...iterables].map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        if (results.some(result => result.done)) {
            break;
        }
        yield results.map(result => result.value) as [TElement, ...UnpackIterableTuple<TIterable>];
    }
}
