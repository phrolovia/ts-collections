import type { EqualityComparator } from "../../shared/EqualityComparator";
import { Comparators } from "../../shared/Comparators";

/**
 * Determines whether {@link source} and another iterable contain equal elements in the same order.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param other Iterable to compare against the source sequence.
 * @param comparator Optional equality comparator used to compare element pairs. Defaults to the library's standard equality comparator.
 * @returns {boolean} `true` when both sequences have the same length and all corresponding elements are equal; otherwise, `false`.
 * @remarks Enumeration stops as soon as a mismatch or length difference is observed. Both sequences are fully enumerated only when they are equal.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3];
 * const numbers2 = [1, 2, 3];
 * const numbers3 = [1, 2, 4];
 *
 * const areEqual1 = sequenceEqual(numbers1, numbers2);
 * console.log(areEqual1); // true
 *
 * const areEqual2 = sequenceEqual(numbers1, numbers3);
 * console.log(areEqual2); // false
 * ```
 */
export const sequenceEqual = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    comparator ??= Comparators.equalityComparator;
    const iterator = source[Symbol.iterator]();
    const otherIterator = other[Symbol.iterator]();
    let first = iterator.next();
    let second = otherIterator.next();
    if (first.done && second.done) {
        return true;
    }
    while (!first.done && !second.done) {
        if (!comparator(first.value, second.value)) {
            return false;
        }
        first = iterator.next();
        second = otherIterator.next();
        if (first.done && second.done) {
            return true;
        }
    }
    return false;
};
