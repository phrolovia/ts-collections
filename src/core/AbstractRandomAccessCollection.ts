import { AbstractCollection } from "./AbstractCollection";
import type { Predicate } from "../shared/Predicate";
import type { IRandomAccessCollection } from "./IRandomAccessCollection";

export abstract class AbstractRandomAccessCollection<TElement> extends AbstractCollection<TElement> implements IRandomAccessCollection<TElement> {
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const elementsToRetain = Array.from(collection);
        const removedElements = new Set<TElement>();
        for (const element of this) {
            const found = this.comparer
                ? elementsToRetain.some(e => this.comparer(e as TElement, element))
                : elementsToRetain.includes(element as TSource);

            if (!found) {
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
