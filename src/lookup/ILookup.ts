import {IGrouping} from "../enumerator/Enumerable";
import {IEnumerable} from "../enumerator/IEnumerable";

export interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>> {
    get(key: TKey): IEnumerable<TElement>;
    hasKey(key: TKey): boolean;
    size(): number;
}
