import type { Accumulator } from "../../shared/Accumulator";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import { Comparators } from "../../shared/Comparators";
import { groupBy } from "./groupBy";
import { KeyValuePair } from "../../dictionary/KeyValuePair";
import { select } from "./select";
import { aggregate } from "./aggregate";

/**
 * Groups elements by a computed key and aggregates each group by applying an accumulator within that group.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type returned by `keySelector` and used to organise groups.
 * @template TAccumulate Type of the accumulated value created for each group.
 * @param source The source iterable.
 * @param keySelector Selector that derives the grouping key for each element.
 * @param seedSelector Either an initial accumulator value applied to every group or a factory invoked with the group key to produce that value.
 * @param accumulator Function that merges the current accumulator with the next element in the group.
 * @param keyComparator Optional equality comparator used to match group keys.
 * @returns {IEnumerable<KeyValuePair<TKey, TAccumulate>>} A sequence containing one key-value pair per group and its aggregated result.
 * @remarks When `seedSelector` is a factory function, it is evaluated once per group to obtain the initial accumulator.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit', price: 1.2 },
 *   { name: 'Banana', category: 'Fruit', price: 0.5 },
 *   { name: 'Carrot', category: 'Vegetable', price: 0.8 },
 *   { name: 'Broccoli', category: 'Vegetable', price: 1.5 },
 * ];
 *
 * const totalPriceByCategory = aggregateBy(
 *   from(products),
 *   p => p.category,
 *   0,
 *   (acc, p) => acc + p.price
 * ).toArray();
 *
 * console.log(totalPriceByCategory);
 * // [
 * //   { key: 'Fruit', value: 1.7 },
 * //   { key: 'Vegetable', value: 2.3 }
 * // ]
 * ```
 */
export const aggregateBy = <TElement, TKey, TAccumulate = TElement>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    seedSelector: Selector<TKey, TAccumulate> | TAccumulate,
    accumulator: Accumulator<TElement, TAccumulate>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, TAccumulate>> => {
    const groups = groupBy(source, keySelector, keyComparator ?? Comparators.equalityComparator);
    return select(groups, group => {
        const seed = seedSelector instanceof Function ? seedSelector(group.key) : seedSelector;
        return new KeyValuePair(group.key, aggregate(group.source, accumulator, seed));
    });
};
