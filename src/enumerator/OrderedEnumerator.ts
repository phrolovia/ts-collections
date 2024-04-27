import { Enumerator, IOrderedEnumerable } from "../imports.ts";
import { Comparators } from "../shared/Comparators";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export class OrderedEnumerator<TElement> extends Enumerator<TElement> implements IOrderedEnumerable<TElement> {
    public constructor(public readonly orderedValueGroups: () => Iterable<Iterable<TElement>>) {
        super(function* () {
            for (const group of orderedValueGroups()) {
                yield* group;
            }
        });
    }

    public static createOrderedEnumerable<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, viaThenBy?: boolean, comparator?: OrderComparator<TKey>) {
        const keyValueGenerator = function* <TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, comparator?: OrderComparator<TKey>): Iterable<Iterable<TElement>> {
            comparator ??= Comparators.orderComparator;
            const sortMap = OrderedEnumerator.createKeyValueMap(source, keySelector);
            const sortedKeys = Array.from(sortMap.keys()).sort(comparator);
            if (ascending) {
                for (const key of sortedKeys) {
                    yield sortMap.get(key) as Iterable<TElement>;
                }
            } else {
                for (const key of sortedKeys.reverse()) {
                    yield sortMap.get(key) as Iterable<TElement>;
                }
            }
        }
        if (source instanceof OrderedEnumerator && viaThenBy) {
            return new OrderedEnumerator<TElement>(function* () {
                for (const group of source.orderedValueGroups()) {
                    yield* keyValueGenerator(group, keySelector, ascending, comparator);
                }
            });
        } else {
            return new OrderedEnumerator<TElement>(() => keyValueGenerator(source, keySelector, ascending, comparator));
        }
    }

    private static createKeyValueMap<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>): Map<TKey, Iterable<TElement>> {
        const sortMap: Map<TKey, TElement[]> = new Map<TKey, TElement[]>();
        for (const element of source) {
            const key = keySelector(element);
            const value = sortMap.get(key);
            if (value) {
                value.push(element);
            } else {
                sortMap.set(key, [element]);
            }
        }
        return sortMap;
    }
}
