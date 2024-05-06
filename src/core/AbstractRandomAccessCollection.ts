import { AbstractCollection, IRandomAccessCollection } from "../imports.ts";
import { Predicate } from "../shared/Predicate";

export abstract class AbstractRandomAccessCollection<TElement> extends AbstractCollection<TElement> implements IRandomAccessCollection<TElement> {
    abstract remove(element: TElement): boolean;

    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

    abstract removeIf(predicate: Predicate<TElement>): boolean;

    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const removedElements: TElement[] = [];
        for (const element of this) {
            const iterator = collection[Symbol.iterator]();
            let next = iterator.next();
            let found = false;
            while (!next.done) {
                if (this.comparer(element, next.value)) {
                    found = true;
                    break;
                }
                next = iterator.next();
            }
            if (!found) {
                removedElements.push(element);
            }
        }
        return this.removeAll(removedElements);
    }
}