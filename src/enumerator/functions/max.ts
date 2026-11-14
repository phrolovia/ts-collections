import type { Selector } from "../../shared/Selector";
import { NoElementsException } from "../../shared/NoElementsException";

/**
 * Returns the largest numeric value produced for the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The maximum of the projected values.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [1, 5, 2, 4, 3];
 * const maxNumber = max(numbers);
 * console.log(maxNumber); // 5
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 28 },
 * ];
 * const maxAge = max(people, p => p.age);
 * console.log(maxAge); // 30
 * ```
 */
export function max(source: Iterable<number>): number;
export function max<TElement>(source: Iterable<TElement>, selector: Selector<TElement, number>): number;
export function max<TElement>(source: Iterable<TElement>, selector?: Selector<TElement, number>): number {
    let max: number | null = null;
    if (!selector) {
        for (const item of source) {
            max = Math.max(max ?? Number.NEGATIVE_INFINITY, item as unknown as number);
        }
        if (max == null) {
            throw new NoElementsException();
        }
        return max;
    } else {
        for (const item of source) {
            max = Math.max(max ?? Number.NEGATIVE_INFINITY, selector(item));
        }
        if (max == null) {
            throw new NoElementsException();
        }
        return max;
    }
}
