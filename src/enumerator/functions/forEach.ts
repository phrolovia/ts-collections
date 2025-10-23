import { IndexedAction } from "../../shared/IndexedAction";
import { from } from "./from";

/**
 * Executes the provided callback for every element in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param action Callback invoked for each element; receives the element and its zero-based index.
 * @returns {void}
 * @remarks Enumeration starts immediately. Avoid mutating the underlying collection while iterating.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * forEach(numbers, (x, i) => console.log(`Index ${i}: ${x}`));
 * // Index 0: 1
 * // Index 1: 2
 * // Index 2: 3
 * ```
 */
export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
};
