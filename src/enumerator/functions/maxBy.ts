import type { OrderComparator } from "../../shared/OrderComparator";
import type { Selector } from "../../shared/Selector";
import { Comparators } from "../../shared/Comparators";
import { NoElementsException } from "../../shared/NoElementsException";

/**
 * Returns the element whose projected key is greatest according to the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
 * @returns {TElement} The element whose key is maximal.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When multiple elements share the maximal key, the first such element in the sequence is returned.
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 28 },
 * ];
 * const oldestPerson = maxBy(people, p => p.age);
 * console.log(oldestPerson); // { name: 'Bob', age: 30 }
 * ```
 */
export const maxBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    let max: TElement | null = null;
    let maxKey: TKey | null = null;
    for (const item of source) {
        const key = keySelector(item);
        if (maxKey == null || (comparator ?? Comparators.orderComparator)(key, maxKey) > 0) {
            max = item;
            maxKey = key;
        }
    }
    if (max == null) {
        throw new NoElementsException();
    }
    return max;
};
