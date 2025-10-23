import { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Determines whether {@link source} and {@link other} share no equivalent elements.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements within the {@link other} iterable.
 * @param source The primary iterable.
 * @param other Iterable compared against {@link source}.
 * @param comparator Optional equality comparator used to match elements across both iterables. Defaults to the library's standard equality comparison.
 * @returns {boolean} `true` when the iterables are disjoint; otherwise, `false`.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source}, {@link other}, or executing the comparator.
 * @remarks When the default comparator is used, the implementation buffers the source elements in a {@link Set} so it can short-circuit as soon as a shared element is detected.
 * With a custom comparator, every pair of elements is compared, which may iterate each iterable multiple times; prefer the default comparator when possible for better performance.
 * @example
 * ```typescript
 * const first = [1, 2, 3];
 * const second = [4, 5, 6];
 * const areDisjoint = disjoint(first, second);
 * console.log(areDisjoint); // true
 * ```
 */
export const disjoint = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    comparator?: EqualityComparator<TElement | TSecond>
): boolean => {
    return from(source).disjoint(other, comparator);
};
