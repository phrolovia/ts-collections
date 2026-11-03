import { AbstractCollection } from "./AbstractCollection";
import { Comparators } from "../shared/Comparators";
import { membership } from "../shared/internal/membership";
import type { Predicate } from "../shared/Predicate";
import type { IRandomAccessCollection } from "./IRandomAccessCollection";

export abstract class AbstractRandomAccessCollection<TElement> extends AbstractCollection<TElement> implements IRandomAccessCollection<TElement> {
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        // Retained elements are compared as comparer(retained, element), hence the flipped comparator.
        const comparer = this.comparer === Comparators.equalityComparator
            ? this.comparer
            : (element: TElement, retained: TElement) => this.comparer(retained, element);
        const retains = membership<TElement>(collection, comparer);
        return this.removeIf(element => !retains(element));
    }

    abstract remove(element: TElement): boolean;

    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

    abstract removeIf(predicate: Predicate<TElement>): boolean;

}
