import {EqualityComparator} from "../shared/EqualityComparator";
import {AbstractReadonlyCollection, IList, IReadonlyList} from "../../imports";

export class ReadonlyList<TElement> extends AbstractReadonlyCollection<TElement> implements IReadonlyList<TElement> {
    private readonly list: IList<TElement>;

    public constructor(list: IList<TElement>) {
        super(list.comparator);
        this.list = list;
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.list;
    }

    public* entries(): IterableIterator<[number, TElement]> {
        yield* this.list.entries();
    }

    public get(index: number): TElement {
        return this.list.get(index);
    }

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        return this.list.indexOf(element, comparator);
    }

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        return this.list.lastIndexOf(element, comparator);
    }

    public override get length(): number {
        return this.list.length;
    }

    public override size(): number {
        return this.list.size();
    }
}