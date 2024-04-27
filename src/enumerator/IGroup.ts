import { IEnumerable } from "./IEnumerable";

export interface IGroup<TKey, TElement> extends IEnumerable<TElement> {
    readonly key: TKey;
    readonly source: IEnumerable<TElement>;
}