import { EqualityComparator } from "../../shared/EqualityComparator";
import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Determines whether the key projections of {@link source} and {@link other} are mutually exclusive.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements within the {@link other} iterable.
 * @template TKey Key type produced by {@link keySelector}.
 * @template TSecondKey Key type produced by {@link otherKeySelector}.
 * @param source The primary iterable.
 * @param other Iterable compared against {@link source}.
 * @param keySelector Projection that produces the key evaluated for each source element.
 * @param otherKeySelector Projection that produces the key evaluated for each element of {@link other}.
 * @param keyComparator Optional equality comparator applied to projected keys. Defaults to the library's standard equality comparison.
 * @returns {boolean} `true` when no projected keys intersect; otherwise, `false`.
 * @throws {unknown} Re-throws any error encountered while iterating either iterable or executing the selector projections/comparator.
 * @remarks When the default comparator is used, the implementation buffers the larger key collection in a {@link Set} and short-circuits as soon as an intersecting key is found.
 * Supplying a custom comparator forces a full pairwise comparison, which may iterate both iterables repeatedly; prefer the default comparator when suitable.
 * @example
 * ```typescript
 * const left = [{ name: 'Alice' }, { name: 'Bella' }];
 * const right = [{ name: 'Mel' }];
 * const areDisjoint = disjointBy(left, right, p => p.name, p => p.name);
 * console.log(areDisjoint); // true
 * ```
 */
export const disjointBy = <TElement, TSecond, TKey, TSecondKey>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    keySelector: Selector<TElement, TKey>,
    otherKeySelector: Selector<TSecond, TSecondKey>,
    keyComparator?: EqualityComparator<TKey | TSecondKey>
): boolean => {
    return from(source).disjointBy(other, keySelector, otherKeySelector, keyComparator);
};
