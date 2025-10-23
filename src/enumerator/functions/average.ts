import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The arithmetic mean of the selected values.
 * @throws {NoElementsException} Thrown when `source` is empty.
 * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const avg = average(numbers);
 * console.log(avg); // 3
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 35 },
 * ];
 * const avgAge = average(people, p => p.age);
 * console.log(avgAge); // 30
 * ```
 */
export const average = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).average(selector);
};
