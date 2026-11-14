import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import { Comparators } from "../../shared/Comparators";
import { Enumerator } from "../Enumerator";

/**
 * Removes consecutive duplicate elements by comparing keys projected from each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Key type returned by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields the first element in each run of elements whose keys change.
 * @remarks Enumeration stops comparing elements once a different key is encountered, making this useful for collapsing grouped data.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 *   { name: 'Broccoli', category: 'Vegetable' },
 *   { name: 'Orange', category: 'Fruit' },
 * ];
 *
 * const distinctByCategory = distinctUntilChangedBy(products, p => p.category).toArray();
 * console.log(distinctByCategory);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' },
 * //   { name: 'Orange', category: 'Fruit' }
 * // ]
 * ```
 */
export const distinctUntilChangedBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    const comparer = keyComparator ?? Comparators.equalityComparator;
    return new Enumerator(() => distinctUntilChangedGenerator(source, keySelector, comparer));
};

function* distinctUntilChangedGenerator<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey>): IterableIterator<TElement> {
    const iterator = source[Symbol.iterator]();
    let next = iterator.next();
    if (next.done) {
        return yield* [];
    }
    let previousValue = next.value;
    yield previousValue;
    while (!next.done) {
        next = iterator.next();
        if (next.done) {
            return;
        }
        const prevKey = keySelector(previousValue);
        const nextKey = keySelector(next.value);
        if (!keyComparator(prevKey, nextKey)) {
            yield next.value;
            previousValue = next.value;
        }
    }
}
