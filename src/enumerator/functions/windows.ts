import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Produces a sequence of sliding windows of fixed size over {@link source}.
 * @template TElement Type of elements within {@link source}.
 * @param source The iterable to window.
 * @param size Length of each window; must be at least 1.
 * @returns {IEnumerable<IEnumerable<TElement>>} A deferred sequence where each element exposes one contiguous window from {@link source}.
 * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source}.
 * @remarks Windows overlap and are yielded only after enough source elements are observed to fill {@link size}. Trailing partial windows are omitted.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const windows = windows(numbers, 3);
 * console.log(windows.select(w => w.toArray()).toArray()); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * ```
 */
export const windows = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).windows(size);
};
