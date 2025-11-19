import { AbstractImmutableCollection } from "./AbstractImmutableCollection";
import { IRandomAccessImmutableCollection } from "./IRandomAccessImmutableCollection";

export abstract class AbstractRandomAccessImmutableCollection<TElement> extends AbstractImmutableCollection<TElement> implements IRandomAccessImmutableCollection<TElement> {
    abstract remove(element: TElement): IRandomAccessImmutableCollection<TElement>;

    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): IRandomAccessImmutableCollection<TElement>;

    abstract removeIf(predicate: (element: TElement) => boolean): IRandomAccessImmutableCollection<TElement>;

    abstract retainAll<TSource extends TElement>(collection: Iterable<TSource>): IRandomAccessImmutableCollection<TElement>;
}