import { Enumerable } from "../Enumerable";
import { IEnumerable } from "../IEnumerable";

/**
 * Generates a numeric sequence from the specified start value to the end value (inclusive) with the given step.
 * @param start Start value of the sequence.
 * @param end End value of the sequence (inclusive).
 * @param step Step size between consecutive values. Must be positive when ascending, negative when descending, and zero only when start equals end.
 * @returns {IEnumerable<number>} A sequence of numbers from {@link start} to {@link end} (inclusive) incremented by {@link step}.
 * @throws {InvalidArgumentException} Thrown when any parameter is NaN, when step direction doesn't match the start/end relationship, or when step is zero and start doesn't equal end.
 * @remarks Enumeration is deferred. The sequence includes {@link end} if it is reachable from {@link start} using the given {@link step}. For ascending sequences (start < end), step must be positive. For descending sequences (start > end), step must be negative.
 * @example
 * ```typescript
 * const ascending = sequence(1, 10, 1).toArray();
 * console.log(ascending); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 * ```
 * @example
 * ```typescript
 * const descending = sequence(10, 1, -1).toArray();
 * console.log(descending); // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
 * ```
 * @example
 * ```typescript
 * const stepped = sequence(1, 10, 2).toArray();
 * console.log(stepped); // [1, 3, 5, 7, 9]
 * ```
 */
export const sequence = (
    start: number,
    end: number,
    step: number
): IEnumerable<number> => {
    return Enumerable.sequence(start, end, step);
}
