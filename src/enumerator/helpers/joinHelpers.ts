import { EqualityComparator } from "../../shared/EqualityComparator";
import { JoinSelector } from "../../shared/JoinSelector";
import { Selector } from "../../shared/Selector";
import { IEnumerable } from "../IEnumerable";

export const processGroupElement = <TInner, TKey>(innerElement: TInner, groups: JoinGroup<TKey, TInner>[], innerKeySelector: Selector<TInner, TKey>, keyCompare: EqualityComparator<TKey>): void => {
    const innerKey = innerKeySelector(innerElement);
    let foundGroup = false;

    // Find existing group using the comparator
    for (const group of groups) {
        if (keyCompare(innerKey, group.key)) {
            group.elements.push(innerElement);
            foundGroup = true;
            break;
        }
    }

    if (!foundGroup) {
        groups.push({key: innerKey, elements: [innerElement]});
    }
}

export const buildGroupsSync = <TInner, TKey>(innerEnumerable: IEnumerable<TInner>, innerKeySelector: Selector<TInner, TKey>, keyCompare: EqualityComparator<TKey>): JoinGroup<TKey, TInner>[] => {
    const groups: JoinGroup<TKey, TInner>[] = [];

    if (!innerEnumerable) {
        return groups;
    }

    for (const innerElement of innerEnumerable) {
        processGroupElement(innerElement, groups, innerKeySelector, keyCompare);
    }
    return groups;
}

export const buildGroupsAsync = async <TInner, TKey>(innerAsyncEnumerable: AsyncIterable<TInner>, innerKeySelector: Selector<TInner, TKey>, keyCompare: EqualityComparator<TKey>): Promise<JoinGroup<TKey, TInner>[]> => {
    const groups: JoinGroup<TKey, TInner>[] = [];
    if (!innerAsyncEnumerable) {
        return groups;
    }

    try {
        for await (const innerElement of innerAsyncEnumerable) {
            processGroupElement(innerElement, groups, innerKeySelector, keyCompare);
        }
    } catch (error) {
        throw error;
    }
    return groups;
}

export const processOuterElement = function* <TElement, TInner, TKey, TResult>(
    outerElement: TElement,
    outerKey: TKey,
    groups: JoinGroup<TKey, TInner>[],
    keyCompare: EqualityComparator<TKey>,
    resultSelector: JoinSelector<TElement, TInner, TResult>,
    leftJoin: boolean
): Iterable<TResult> {
    let foundMatch = false;
    for (const group of groups) {
        if (keyCompare(outerKey, group.key)) {
            for (const innerElement of group.elements) {
                yield resultSelector(outerElement, innerElement);
                foundMatch = true;
            }
        }
    }
    if (leftJoin && !foundMatch) {
        yield resultSelector(outerElement, null);
    }
}

export type JoinGroup<TKey, TInner> = { key: TKey; elements: TInner[] };
