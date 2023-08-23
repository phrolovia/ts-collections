import {AbstractCollection, IRandomAccessCollection} from "../../imports";
import {Predicate} from "../shared/Predicate";

export abstract class AbstractRandomAccessCollection<TElement> extends AbstractCollection<TElement> implements IRandomAccessCollection<TElement> {
    abstract remove(element: TElement): boolean;
    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;
    abstract removeIf(predicate: Predicate<TElement>): boolean;
    // abstract retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        let result = false;
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
        this.removeAll(removedElements);
        return result;
    }
}