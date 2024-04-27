import {EqualityComparator} from "../shared/EqualityComparator";
import {AbstractReadonlyCollection, ICollection, IReadonlyCollection} from "../imports.ts";

export class ReadonlyCollection<TElement> extends AbstractReadonlyCollection<TElement> {
    private readonly collection: IReadonlyCollection<TElement>;

    public constructor(collection: ICollection<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.collection = collection;
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.collection;
    }

    public override size(): number {
        return this.collection.size();
    }

    public override get length(): number {
        return this.collection.length;
    }
}