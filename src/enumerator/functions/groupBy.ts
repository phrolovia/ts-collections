import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import type { IGroup } from "../IGroup";
import { Enumerator, List, Group } from "../Enumerator";
import { isDefaultEquality, identityKey } from "../../shared/internal/membership";

/**
 * Partitions the sequence into groups based on keys projected from each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the grouping key for each element.
 * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @param hashSelector Optional hash selector. When provided together with `keyComparator`, the sequence will use a bucketed approach for faster grouping based on the hash values.
 * @returns {IEnumerable<IGroup<TKey, TElement>>} A sequence of groups, each exposing the key and the elements that share it.
 * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration. Without a comparator, or with the default one, groups are found through a hash map. Any other comparator is checked against every group's key, which is quadratic when there are many groups: supply {@link hashSelector}, or project a key that the default comparator can match. The grouping runs again each time the result is enumerated; materialise it with `toArray` or `toLookup` to reuse it.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const grouped = groupBy(products, p => p.category);
 * for (const group of grouped) {
 *   console.log(group.key, group.toArray());
 * }
 * // Fruit [ { name: 'Apple', category: 'Fruit' }, { name: 'Banana', category: 'Fruit' } ]
 * // Vegetable [ { name: 'Carrot', category: 'Vegetable' } ]
 * ```
 */
export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>,
    hashSelector?: Selector<TElement, PropertyKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return new Enumerator(() => groupByGenerator(source, keySelector, keyComparator, hashSelector));
};

function* groupByGenerator<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>, hashSelector?: Selector<TElement, PropertyKey>): IterableIterator<IGroup<TKey, TElement>> {
    if (!keyComparator) {
        const groupMap = new Map<TKey, IGroup<TKey, TElement>>();
        for (const item of source) {
            const key = keySelector(item);
            const group = groupMap.get(key);
            if (group) {
                (group.source as List<TElement>).add(item);
            } else {
                const newList = new List<TElement>([item]);
                const newGroup = new Group(key, newList);
                groupMap.set(key, newGroup);
            }
        }
        yield* groupMap.values();
    } else if (hashSelector) {
        type BucketEntry = { canonicalKey: TKey; group: IGroup<TKey, TElement> };
        const bucketMap = new Map<PropertyKey, BucketEntry[]>();
        const orderedGroups: IGroup<TKey, TElement>[] = [];
        for (const item of source) {
            const key = keySelector(item);
            const hash = hashSelector(item);
            let bucket = bucketMap.get(hash);
            let found: BucketEntry | undefined;
            if (bucket) {
                found = bucket.find(entry => keyComparator(entry.canonicalKey, key));
            } else {
                bucket = [];
                bucketMap.set(hash, bucket);
            }
            if (found) {
                (found.group.source as List<TElement>).add(item);
            } else {
                const newList = new List<TElement>([item]);
                const newGroup = new Group(key, newList);
                bucket.push({ canonicalKey: key, group: newGroup });
                orderedGroups.push(newGroup);
            }
        }
        yield* orderedGroups;
    } else if (isDefaultEquality(keyComparator)) {
        // The default comparator is Object.is, which a Map can index once -0 has its own key.
        const groupMap = new Map<unknown, IGroup<TKey, TElement>>();
        for (const item of source) {
            const key = keySelector(item);
            const hash = identityKey(key);
            const group = groupMap.get(hash);
            if (group) {
                (group.source as List<TElement>).add(item);
            } else {
                const newList = new List<TElement>([item]);
                const newGroup = new Group(key, newList);
                groupMap.set(hash, newGroup);
            }
        }
        yield* groupMap.values();
    } else {
        const groupMap = new Map<TKey, IGroup<TKey, TElement>>();
        const findExistingKey = (targetKey: TKey): TKey | undefined => {
            for (const existingKey of groupMap.keys()) {
                if (keyComparator(existingKey, targetKey)) {
                    return existingKey;
                }
            }
            return undefined;
        };
        for (const item of source) {
            const key = keySelector(item);
            const existingKey = findExistingKey(key);
            if (existingKey !== undefined) {
                const group = groupMap.get(existingKey)!;
                (group.source as List<TElement>).add(item);
            } else {
                const newList = new List<TElement>([item]);
                const newGroup = new Group(key, newList);
                groupMap.set(key, newGroup);
            }
        }
        yield* groupMap.values();
    }
}
