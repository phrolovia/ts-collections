import {IEnumerable} from "../enumerator/IEnumerable";
import {IGrouping} from "../enumerator/IGrouping";

export interface ILookup<TKey, TElement> extends IEnumerable<IGrouping<TKey, TElement>> {
    readonly length: number;
    get(key: TKey): IEnumerable<TElement>;
    hasKey(key: TKey): boolean;
    size(): number;
}
