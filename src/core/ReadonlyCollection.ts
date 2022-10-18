import {EqualityComparator} from "../shared/EqualityComparator";
import {AbstractReadonlyCollection, IReadonlyCollection, List, ReadonlyList} from "../../imports";

export class ReadonlyCollection<TElement> extends AbstractReadonlyCollection<TElement> {
    private readonly collection: IReadonlyCollection<TElement>;

    public constructor(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.collection = new ReadonlyList(new List(iterable, comparator));
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.collection;
    }

    public override size(): number {
        return this.collection.size();
    }
}