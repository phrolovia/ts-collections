import { Comparators } from "../../shared/Comparators";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { identityKey } from "../../shared/internal/membership";
import type { JoinSelector } from "../../shared/JoinSelector";
import type { Selector } from "../../shared/Selector";

const NO_GROUPS: ReadonlyArray<never> = [];

/**
 * Groups values by key in first-seen order. With the default comparator the groups are indexed by
 * a Map, so lookups take O(1); any other comparator falls back to a linear scan of the groups.
 */
export class JoinGroups<TKey, TValue> {
    readonly #comparator: EqualityComparator<TKey>;
    readonly #index: Map<unknown, JoinGroup<TKey, TValue>> | null;
    public readonly groups: Array<JoinGroup<TKey, TValue>> = [];

    public constructor(comparator: EqualityComparator<TKey>) {
        this.#comparator = comparator;
        this.#index = comparator === Comparators.equalityComparator ? new Map() : null;
    }

    public add(key: TKey, value: TValue): void {
        const group = this.find(key);
        if (group) {
            group.elements.push(value);
            return;
        }
        const created = { key, elements: [value] };
        this.groups.push(created);
        this.#index?.set(identityKey(key), created);
    }

    // Returns the first group whose key matches, comparing as comparator(key, group.key).
    public find(key: TKey): JoinGroup<TKey, TValue> | undefined {
        if (this.#index) {
            return this.#index.get(identityKey(key));
        }
        for (const group of this.groups) {
            if (this.#comparator(key, group.key)) {
                return group;
            }
        }
        return undefined;
    }

    // Returns every group whose key matches; a comparator that is not transitive may match several.
    public matching(key: TKey): ReadonlyArray<JoinGroup<TKey, TValue>> {
        if (this.#index) {
            const group = this.#index.get(identityKey(key));
            return group ? [group] : NO_GROUPS;
        }
        return this.groups.filter(group => this.#comparator(key, group.key));
    }
}

export const processGroupElement = <TInner, TKey>(innerElement: TInner, groups: JoinGroups<TKey, TInner>, innerKeySelector: Selector<TInner, TKey>): void => {
    groups.add(innerKeySelector(innerElement), innerElement);
}

export const buildGroupsSync = <TInner, TKey>(innerEnumerable: Iterable<TInner>, innerKeySelector: Selector<TInner, TKey>, keyCompare: EqualityComparator<TKey>): JoinGroups<TKey, TInner> => {
    const groups = new JoinGroups<TKey, TInner>(keyCompare);

    if (!innerEnumerable) {
        return groups;
    }

    for (const innerElement of innerEnumerable) {
        processGroupElement(innerElement, groups, innerKeySelector);
    }
    return groups;
}

export const buildGroupsAsync = async <TInner, TKey>(innerAsyncEnumerable: AsyncIterable<TInner>, innerKeySelector: Selector<TInner, TKey>, keyCompare: EqualityComparator<TKey>): Promise<JoinGroups<TKey, TInner>> => {
    const groups = new JoinGroups<TKey, TInner>(keyCompare);
    if (!innerAsyncEnumerable) {
        return groups;
    }

    for await (const innerElement of innerAsyncEnumerable) {
        processGroupElement(innerElement, groups, innerKeySelector);
    }

    return groups;
}

export const processOuterElement = function* <TElement, TInner, TKey, TResult>(
    outerElement: TElement,
    outerKey: TKey,
    groups: JoinGroups<TKey, TInner>,
    resultSelector: JoinSelector<TElement, TInner, TResult>,
    leftJoin: boolean
): Iterable<TResult> {
    let foundMatch = false;
    for (const group of groups.matching(outerKey)) {
        for (const innerElement of group.elements) {
            yield resultSelector(outerElement, innerElement);
            foundMatch = true;
        }
    }
    if (leftJoin && !foundMatch) {
        yield resultSelector(outerElement, null);
    }
}

export type JoinGroup<TKey, TInner> = { key: TKey; elements: TInner[] };
