import type { Selector } from "../../shared/Selector";
import { NoElementsException } from "../../shared/NoElementsException";

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
export function average(source: Iterable<number>): number;
export function average<TElement>(source: Iterable<TElement>, selector: Selector<TElement, number>): number;
export function average<TElement>(source: Iterable<TElement>, selector?: Selector<TElement, number>): number {
    let total: number = 0;
    let count: number = 0;
    for (const d of source) {
        total += selector?.(d) ?? d as unknown as number;
        count++;
    }
    if (count === 0) {
        throw new NoElementsException();
    }
    return total / count;
}
