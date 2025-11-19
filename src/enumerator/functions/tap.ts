import type { IndexedAction } from "../../shared/IndexedAction";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Invokes the specified action for each element while yielding the original elements unchanged.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param action Callback receiving the element and its zero-based index.
 * @returns {IEnumerable<TElement>} The original sequence, enabling fluent chaining.
 * @remarks The action executes lazily as the sequence is iterated, making it suitable for logging or instrumentation.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const tapped = tap(numbers, x => console.log(`Processing: ${x}`))
 *   .select(x => x * 2)
 *   .toArray();
 * console.log(tapped); // [2, 4, 6]
 * // Expected console output:
 * // Processing: 1
 * // Processing: 2
 * // Processing: 3
 * ```
 */
export const tap = <TElement>(source: Iterable<TElement>, action: IndexedAction<TElement>): IEnumerable<TElement> => {
    return from(source).tap(action);
};
