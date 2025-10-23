import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Filters out `null` and `undefined` values from the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<NonNullable<TElement>>} A sequence containing only the elements that are neither `null` nor `undefined`.
 * @remarks The method preserves other falsy values (such as `0` or an empty string) and defers execution until the returned sequence is iterated.
 * @example
 * ```typescript
 * const values = compact([1, null, 0, undefined]).toArray();
 * console.log(values); // [1, 0]
 * ```
 */
export const compact = <TElement>(
    source: Iterable<TElement>,
): IEnumerable<NonNullable<TElement>> => {
    return from(source).compact();
};
