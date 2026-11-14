import type { Selector } from "../../shared/Selector";
import { NoElementsException } from "../../shared/NoElementsException";

/**
 * Computes the sum of the numeric values produced for each element.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value. Defaults to interpreting the element itself as a number.
 * @returns {number} The sum of the projected values.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @remarks {@link source} is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const total = sum(numbers);
 * console.log(total); // 15
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 * ];
 * const totalAge = sum(people, p => p.age);
 * console.log(totalAge); // 55
 * ```
 */
export function sum(source: Iterable<number>): number;
export function sum<TElement>(source: Iterable<TElement>, selector: Selector<TElement, number>): number;
export function sum<TElement>(source: Iterable<TElement>, selector?: Selector<TElement, number>): number {
    let total: number = 0;
    let hasElements = false;
    for (const d of source) {
        total += selector?.(d) ?? d as unknown as number;
        hasElements = true;
    }
    if (!hasElements) {
        throw new NoElementsException();
    }
    return total;
}
