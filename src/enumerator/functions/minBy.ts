import type { OrderComparator } from "../../shared/OrderComparator";
import type { Selector } from "../../shared/Selector";
import { Comparators } from "../../shared/Comparators";
import { NoElementsException } from "../../shared/NoElementsException";

/**
 * Returns the element whose projected key is smallest according to the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
 * @returns {TElement} The element whose key is minimal.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When multiple elements share the minimal key, the first such element in the sequence is returned.
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 22 },
 * ];
 * const youngestPerson = minBy(people, p => p.age);
 * console.log(youngestPerson); // { name: 'Charlie', age: 22 }
 * ```
 */
export const minBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    let min: TElement | null = null;
    let minKey: TKey | null = null;
    for (const item of source) {
        const key = keySelector(item);
        if (minKey == null || (comparator ?? Comparators.orderComparator)(key, minKey) < 0) {
            min = item;
            minKey = key;
        }
    }
    if (min == null) {
        throw new NoElementsException();
    }
    return min;
};
