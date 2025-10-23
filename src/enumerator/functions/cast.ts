import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Reinterprets each element in the sequence as the specified result type.
 * @template TResult Target type exposed by the returned sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TResult>} A sequence that yields the same elements typed as `TResult`.
 * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
 * @example
 * ```typescript
 * const mixed = [1, 'two', 3, 'four'];
 * const numbers = cast<number>(mixed).where(x => typeof x === 'number');
 * console.log(numbers.toArray()); // [1, 3]
 * ```
 */
export const cast = <TResult, TElement = unknown>(
    source: Iterable<TElement>
): IEnumerable<TResult> => {
    return from(source).cast<TResult>();
};
