import { from } from "./from";

/**
 * Materialises {@link source} into an array.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {TElement[]} An array containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately. Subsequent changes to {@link source} are not reflected in the returned array.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const array = toArray(numbers);
 * console.log(array); // [1, 2, 3]
 * ```
 */
export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
};
