import {AbstractReadonlyCollection} from "./AbstractReadonlyCollection";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IReadonlyCollection} from "./IReadonlyCollection";
import {List, ReadonlyList} from "../../imports";

export class ReadonlyCollection<TElement> extends AbstractReadonlyCollection<TElement> {
    public collection: IReadonlyCollection<TElement>;
    public constructor(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.collection = new ReadonlyList(new List(iterable, comparator));
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.collection;
    }

    public override size(): number {
        return this.collection.size();
    }
}