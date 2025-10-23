import { InferredType } from "../../shared/InferredType";
import { ObjectType } from "../../shared/ObjectType";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Filters the sequence, keeping only elements assignable to the specified type.
 * @template TElement Type of elements within the `source` iterable.
 * @template TResult Type descriptor used to filter elements (constructor function or primitive type string).
 * @param source The source iterable.
 * @param type Type descriptor that determines which elements are retained (e.g., 'string', `Number`, `Date`).
 * @returns {IEnumerable<InferredType<TResult>>} A sequence containing only the elements that match the specified type.
 * @remarks This function performs a runtime type check for each element and yields matching elements lazily.
 * @example
 * ```typescript
 * const mixed = [1, 'two', 3, 'four', new Date()];
 * const numbers = ofType(mixed, 'number').toArray();
 * console.log(numbers); // [1, 3]
 *
 * const dates = ofType(mixed, Date).toArray();
 * console.log(dates); // [Date object]
 * ```
 */
export const ofType = <TElement, TResult extends ObjectType>(
    source: Iterable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return from(source).ofType(type);
};
