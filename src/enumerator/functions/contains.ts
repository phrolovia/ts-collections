import type { EqualityComparator } from "../../shared/EqualityComparator";
import { asHashedSet } from "../../shared/internal/collectionAccess";
import { isDefaultEquality } from "../../shared/internal/membership";
import { from } from "./from";

/**
 * Determines whether the sequence contains a specific element using an optional comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param element Element to locate in the sequence.
 * @param comparator Optional equality comparator used to match elements. Defaults to the library's standard equality comparison.
 * @returns {boolean} `true` when the element is found; otherwise, `false`.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasThree = contains(numbers, 3);
 * console.log(hasThree); // true
 *
 * const hasTen = contains(numbers, 10);
 * console.log(hasTen); // false
 * ```
 */
export const contains = <TElement>(
    source: Iterable<TElement>,
    element: TElement,
    comparator?: EqualityComparator<TElement>
): boolean => {
    // Set.has uses SameValueZero, which agrees with the default Object.is comparator except on zeros.
    if ((comparator == null || isDefaultEquality(comparator)) && element !== 0) {
        if (source instanceof Set) {
            return source.has(element);
        }
        const hashed = asHashedSet(source);
        if (hashed) {
            return hashed.contains(element);
        }
    }
    return from(source).contains(element, comparator);
};
