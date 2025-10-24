import { AbstractCollection, List } from "../imports";
import { Predicate } from "../shared/Predicate";
import { IRandomAccessCollection } from "./IRandomAccessCollection";

export abstract class AbstractRandomAccessCollection<TElement> extends AbstractCollection<TElement> implements IRandomAccessCollection<TElement> {
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const elementsToRetainList = new List<TSource>(collection);
        const removedElements = new Set<TElement>();
        for (const element of this) {
            if (!elementsToRetainList.contains(element as TSource, this.comparer)) {
                removedElements.add(element);
            }
        }
        if (removedElements.size > 0) {
            return this.removeAll(removedElements);
        }
        return false;
    }

    abstract remove(element: TElement): boolean;

    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

    abstract removeIf(predicate: Predicate<TElement>): boolean;

}
