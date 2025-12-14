import { Enumerable } from "../Enumerable";
import { IEnumerable } from "../IEnumerable";

/**
 * Generates an infinite numeric sequence starting from the specified value with the given step increment.
 * @param start Initial value of the sequence.
 * @param step Step size to increment each subsequent value.
 * @returns {IEnumerable<number>} An infinite sequence of numbers starting from {@link start}, incremented by {@link step} for each subsequent element.
 * @remarks Enumeration is deferred and will continue indefinitely unless limited by operations like {@link take} or {@link takeWhile}. The sequence can be ascending (positive step) or descending (negative step).
 * @example
 * ```typescript
 * const ascending = infiniteSequence(1, 1).take(5).toArray();
 * console.log(ascending); // [1, 2, 3, 4, 5]
 * ```
 * @example
 * ```typescript
 * const descending = infiniteSequence(10, -1).take(5).toArray();
 * console.log(descending); // [10, 9, 8, 7, 6]
 * ```
 * @example
 * ```typescript
 * const stepped = infiniteSequence(0, 2).take(5).toArray();
 * console.log(stepped); // [0, 2, 4, 6, 8]
 * ```
 */
export const infiniteSequence = (start: number, step: number): IEnumerable<number> => {
    return Enumerable.infiniteSequence(start, step);
};
