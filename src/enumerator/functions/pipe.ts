import { from } from "./from";
import { PipeOperator } from "../../shared/PipeOperator";

/**
 * Applies a user-defined pipeline to {@link source} and returns the operator's result.
 * @template TElement Type of elements within {@link source}.
 * @template TResult Result type produced by {@link operator}.
 * @param source The iterable whose enumerable view is supplied to {@link operator}.
 * @param operator Function that receives the enumerable view of {@link source} and returns an arbitrary result.
 * @returns {TResult} The value produced by {@link operator} after optionally enumerating {@link source}.
 * @throws {unknown} Re-throws any error thrown by {@link operator} or during enumeration initiated by the operator.
 * @remarks The operator chooses how the sequence is consumed, making this helper convenient for custom aggregations, projections, or interop scenarios.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const sum = pipe(numbers, e => e.sum());
 * console.log(sum); // 15
 *
 * const filteredAndDoubled = pipe(numbers, e =>
 *   e.where(x => x % 2 === 0).select(x => x * 2).toArray()
 * );
 * console.log(filteredAndDoubled); // [4, 8]
 * ```
 */
export const pipe = <TElement, TResult>(
    source: Iterable<TElement>,
    operator: PipeOperator<TElement, TResult>
): TResult => {
    return from(source).pipe(operator);
}
