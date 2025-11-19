import type { IEnumerable } from "./IEnumerable";
import type { IGroup } from "./IGroup";
import { AbstractEnumerable } from "./AbstractEnumerable";
import { registerGroupFactory } from "./Enumerator";

export class Group<TKey, TElement> extends AbstractEnumerable<TElement> implements IGroup<TKey, TElement> {
    public readonly key: TKey;
    public readonly source: IEnumerable<TElement>;

    public constructor(key: TKey, source: IEnumerable<TElement>) {
        super();
        this.key = key;
        this.source = source;
    }

    * [Symbol.iterator](): IterableIterator<TElement> {
        yield* this.source;
    }
}

registerGroupFactory(<TKey, TElement>(key: TKey, source: IEnumerable<TElement>): Group<TKey, TElement> => {
    return new Group(key, source);
});
