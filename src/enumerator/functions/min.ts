import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Returns the smallest numeric value produced for the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The minimum of the projected values.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [3, 1, 5, 2, 4];
 * const minNumber = min(numbers);
 * console.log(minNumber); // 1
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 22 },
 * ];
 * const minAge = min(people, p => p.age);
 * console.log(minAge); // 22
 * ```
 */
export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
};
