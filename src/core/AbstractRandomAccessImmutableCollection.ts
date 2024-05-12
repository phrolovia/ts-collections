import { AbstractImmutableCollection, IImmutableCollection } from "../imports.ts";

export abstract class AbstractRandomAccessImmutableCollection<TElement> extends AbstractImmutableCollection<TElement> {
    abstract remove(element: TElement): IImmutableCollection<TElement>;

    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;

    abstract removeIf(predicate: (element: TElement) => boolean): IImmutableCollection<TElement>;

    abstract retainAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
}