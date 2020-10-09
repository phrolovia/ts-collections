import {AbstractCollection} from "../core/AbstractCollection";
import {IList} from "./IList";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {ICollection} from "../core/ICollection";
import {Predicate} from "../shared/Predicate";

export abstract class AbstractList<TElement> extends AbstractCollection<TElement> implements IList<TElement> {

    public add(element: TElement): boolean {
        return this.addAt(element, this.size());
    }

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        let index = 0;
        comparator ??= Comparators.equalityComparator;
        if (element == null) {
            for (const e of this) {
                if (e == null) {
                    return index;
                }
                ++index;
            }
        } else {
            for (const e of this) {
                if (comparator(e, element)) {
                    return index;
                }
                ++index;
            }
        }
        return -1;
    }

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        const array = this.toArray();
        comparator ??= Comparators.equalityComparator;
        if (element == null) {
            for (let index = array.length - 1; index >= 0; --index) {
                if (array[index] == null) {
                    return index;
                }
            }
        } else {
            for (let index = array.length - 1; index >= 0; --index) {
                if (comparator(element, array[index])) {
                    return index;
                }
            }
        }
        return -1;
    }

    public removeAll<TSource extends TElement>(collection: ICollection<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        const oldSize = this.size();
        let index = 0;
        for (const e of collection) {
            index = this.indexOf(e, comparator);
            if (index !== -1) {
                this.removeAt(index);
            }
        }
        return this.size() !== oldSize;
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        const oldSize = this.size();
        for (let index = this.size() - 1; index >= 0; --index) {
            if (predicate(this.get(index))) {
                this.removeAt(index);
            }
        }
        return this.size() !== oldSize;
    }

    public retainAll<TSource extends TElement>(collection: ICollection<TSource>, comparator?: EqualityComparator<TElement>): boolean {
        const oldSize = this.size();
        for (let index = this.size() - 1; index >= 0; --index) {
            if (!collection.contains(this.get(index) as TSource, comparator)) {
                this.removeAt(index);
            }
        }
        return this.size() !== oldSize;
    }

    public abstract addAt(element: TElement, index: number): boolean;
    public abstract get(index: number): TElement;
    public abstract removeAt(index: number): TElement;
    public abstract set(index: number, element: TElement): TElement;
}
