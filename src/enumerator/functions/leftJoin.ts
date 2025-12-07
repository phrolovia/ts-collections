import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { JoinSelector } from "../../shared/JoinSelector";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import { from } from "./from";

export const leftJoin = <TElement, TInner, TKey, TResult>(
    source: Iterable<TElement>,
    innerEnumerable: Iterable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, TInner, TResult>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TResult> => {
    return from(source).leftJoin(from(innerEnumerable), outerKeySelector, innerKeySelector, resultSelector, keyComparator);
};
