import { Enumerable } from "./Enumerable";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";

export class Group<TKey, TElement> extends Enumerable<TElement> implements IGroup<TKey, TElement> {
    public readonly key: TKey;
    public readonly source: IEnumerable<TElement>;

    public constructor(key: TKey, source: IEnumerable<TElement>) {
        super(source);
        this.key = key;
        this.source = source;
    }
}