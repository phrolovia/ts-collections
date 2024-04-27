import { AsyncEnumerator, IOrderedAsyncEnumerable } from "../imports.ts";
import { Comparators } from "../shared/Comparators";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export class OrderedAsyncEnumerator<TElement> extends AsyncEnumerator<TElement> implements IOrderedAsyncEnumerable<TElement> {
    public constructor(public readonly orderedValueGroups: () => AsyncIterable<AsyncIterable<TElement>>) {
        super(async function* () {
            for await (const group of orderedValueGroups()) {
                yield* group;
            }
        });
    }

    public static createOrderedEnumerable<TElement, TKey>(source: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, viaThenBy?: boolean, comparator?: OrderComparator<TKey>) {
        const keyValueGenerator = async function* <TKey>(source: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, comparator?: OrderComparator<TKey>): AsyncIterable<AsyncIterable<TElement>> {
            comparator ??= Comparators.orderComparator;
            const sortMap = await OrderedAsyncEnumerator.createKeyValueMap(source, keySelector);
            const sortedKeys = Array.from(sortMap.keys()).sort(comparator);
            if (ascending) {
                for (const key of sortedKeys) {
                    yield sortMap.get(key) as AsyncIterable<TElement>;
                }
            } else {
                for (const key of sortedKeys.reverse()) {
                    yield sortMap.get(key) as AsyncIterable<TElement>;
                }
            }
        };
        if (source instanceof OrderedAsyncEnumerator && viaThenBy) {
            return new OrderedAsyncEnumerator<TElement>(async function* () {
                for await (const group of source.orderedValueGroups()) {
                    yield* keyValueGenerator(group, keySelector, ascending, comparator);
                }
            });
        } else {
            return new OrderedAsyncEnumerator<TElement>(() => keyValueGenerator(source, keySelector, ascending, comparator));
        }
    }

    private static async createKeyValueMap<TElement, TKey>(source: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>): Promise<Map<TKey, AsyncIterable<TElement>>> {
        const sortMap: Map<TKey, TElement[]> = new Map<TKey, TElement[]>();
        for await (const element of source) {
            const key = keySelector(element);
            const value = sortMap.get(key);
            if (value) {
                value.push(element);
            } else {
                sortMap.set(key, [element]);
            }
        }
        const asyncEnumerable = (values: TElement[]) => new AsyncEnumerator(async function* () {
            yield* values;
        });
        return new Map<TKey, AsyncIterable<TElement>>(Array.from(sortMap.entries()).map(([key, value]) => [key, asyncEnumerable(value)]));
    }
}