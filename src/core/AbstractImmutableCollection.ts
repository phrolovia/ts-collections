import { AbstractReadonlyCollection } from "./AbstractReadonlyCollection";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IImmutableCollection } from "./IImmutableCollection";

export abstract class AbstractImmutableCollection<TElement> extends AbstractReadonlyCollection<TElement> implements IImmutableCollection<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    abstract add(element: TElement): IImmutableCollection<TElement>;

    abstract addAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;

    abstract clear(): IImmutableCollection<TElement>;
}