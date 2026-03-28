import type { EqualityComparator } from "../shared/EqualityComparator";
import { AbstractReadonlyCollection } from "./AbstractReadonlyCollection";
import type { IImmutableCollection } from "./IImmutableCollection";

export abstract class AbstractImmutableCollection<TElement> extends AbstractReadonlyCollection<TElement> implements IImmutableCollection<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    public reset<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement> {
        return this.clear().addAll(collection);
    }

    abstract add(element: TElement): IImmutableCollection<TElement>;

    abstract addAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;

    abstract clear(): IImmutableCollection<TElement>;
}
