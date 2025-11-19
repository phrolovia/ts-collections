import type { IndexedSelector } from "../../shared/IndexedSelector";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Transforms each element and its zero-based index into a new value.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TResult Result type produced by {@link selector}.
 * @param source The source iterable.
 * @param selector Projection invoked for each element together with its index.
 * @returns {IEnumerable<TResult>} A deferred sequence containing the values produced by {@link selector}.
 * @remarks Enumeration is deferred. The index argument increments sequentially starting at zero.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const squares = select(numbers, x => x * x).toArray();
 * console.log(squares); // [1, 4, 9, 16, 25]
 * ```
 */
export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
};
