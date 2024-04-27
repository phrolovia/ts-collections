import {AbstractReadonlyCollection} from "../imports.ts";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IImmutableCollection} from "./IImmutableCollection";

export abstract class AbstractImmutableCollection<TElement> extends AbstractReadonlyCollection<TElement> implements IImmutableCollection<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    abstract add(element: TElement): IImmutableCollection<TElement>;
    abstract addAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
    abstract clear(): IImmutableCollection<TElement>;
    abstract remove(element: TElement): IImmutableCollection<TElement>;
    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
    abstract removeIf(predicate: (element: TElement) => boolean): IImmutableCollection<TElement>;
    abstract retainAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
}