import {IEnumerable} from "../enumerator/IEnumerable";
import {IGroup} from "../enumerator/IGroup";

export interface ILookup<TKey, TElement> extends IEnumerable<IGroup<TKey, TElement>> {
    readonly length: number;
    get(key: TKey): IEnumerable<TElement>;
    hasKey(key: TKey): boolean;
    size(): number;
}
