import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Computes the multiplicative aggregate of the values produced for each element in the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to interpreting the element itself as a number.
 * @returns {number} The product of all projected values.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @remarks {@link source} is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const result = product(numbers);
 * console.log(result); // 120
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 * ];
 * const ageProduct = product(people, p => p.age);
 * console.log(ageProduct); // 750
 * ```
 */
export const product = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).product(selector);
};
