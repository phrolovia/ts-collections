import type { EqualityComparator } from "../../shared/EqualityComparator";

export const findOrCreateGroupEntry = <TInner, TKey>(lookupStore: Array<GroupJoinLookup<TKey, TInner>>, key: TKey, keyCompare: EqualityComparator<TKey>): TInner[] => {
    for (const entry of lookupStore) {
        if (keyCompare(entry.key, key)) {
            return entry.group;
        }
    }
    const newGroup: TInner[] = [];
    lookupStore.push({key: key, group: newGroup});
    return newGroup;
}

export const findGroupInStore = <TInner, TKey>(lookupStore: ReadonlyArray<GroupJoinLookup<TKey, TInner>>, key: TKey, keyCompare: EqualityComparator<TKey>): ReadonlyArray<TInner> | null => {
    for (const entry of lookupStore) {
        if (keyCompare(entry.key, key)) {
            return entry.group;
        }
    }
    return null;
}

export type GroupJoinLookup<TKey, TInner> = { key: TKey; group: TInner[] }
