import type { Selector } from "../../shared/Selector";

// Yields the first element seen for each key that occurs most often, in the order the keys first appeared.
export function* modes<TElement, TKey>(source: Iterable<TElement>, keySelector?: Selector<TElement, TKey>): IterableIterator<TElement> {
    const selector = keySelector ?? ((item: TElement): TKey => item as unknown as TKey);
    const counts = new Map<TKey, number>();
    const representatives = new Map<TKey, TElement>();
    let max = 0;

    for (const item of source) {
        const key = selector(item);
        if (!representatives.has(key)) {
            representatives.set(key, item);
        }
        const next = (counts.get(key) ?? 0) + 1;
        counts.set(key, next);
        if (next > max) {
            max = next;
        }
    }
    if (max === 0) {
        return;
    }
    for (const [key, count] of counts) {
        if (count === max) {
            yield representatives.get(key) as TElement;
        }
    }
}
