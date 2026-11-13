import { AbstractRandomAccessCollection } from "../core/AbstractRandomAccessCollection";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Predicate, TypePredicate } from "../shared/Predicate";
import { membership } from "../shared/internal/membership";
import type { IList } from "./IList";

export abstract class AbstractList<TElement> extends AbstractRandomAccessCollection<TElement> implements IList<TElement> {

    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    /** @internal get(index) returns the element that iteration yields at that position. Read by shared/internal/collectionAccess. */
    protected get isIndexedSource(): true {
        return true;
    }

    public add(element: TElement): boolean {
        return this.addAt(element, this.size());
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.indexOf(element, comparator) !== -1;
    }

    public override elementAt(index: number): TElement {
        return this.get(index);
    }

    public override elementAtOrDefault(index: number): TElement | null {
        if (index < 0 || index >= this.size()) {
            return null;
        }
        return this.get(index);
    }

    public* entries(): IterableIterator<[number, TElement]> {
        let index = 0;
        for (const element of this) {
            yield [index++, element];
        }
    }

    public override first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public override first(predicate?: Predicate<TElement>): TElement;
    public override first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        if (!predicate) {
            if (this.isEmpty()) {
                throw new NoElementsException();
            }
            return this.get(0);
        }
        return super.first(predicate as Predicate<TElement>);
    }

    public override firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public override firstOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public override firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        if (!predicate) {
            return this.isEmpty() ? null : this.get(0);
        }
        return super.firstOrDefault(predicate as Predicate<TElement>);
    }

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        comparator ??= this.comparer;
        let index = 0;
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

    public override last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public override last(predicate?: Predicate<TElement>): TElement;
    public override last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        if (!predicate) {
            if (this.isEmpty()) {
                throw new NoElementsException();
            }
            return this.get(this.size() - 1);
        }
        return super.last(predicate as Predicate<TElement>);
    }

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        const array = this.toArray();
        comparator ??= this.comparer;
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

    public override lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public override lastOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public override lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        if (!predicate) {
            return this.isEmpty() ? null : this.get(this.size() - 1);
        }
        return super.lastOrDefault(predicate as Predicate<TElement>);
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const contains = membership<TElement>(collection, this.comparer);
        return this.removeIf(contains);
    }

    /**
     * Removes the matching elements in one pass and re-adds the rest, so the cost stays linear
     * for lists whose positional removal is not O(1).
     */
    public removeIf(predicate: Predicate<TElement>): boolean {
        const kept: TElement[] = [];
        for (const element of this) {
            if (!predicate(element)) {
                kept.push(element);
            }
        }
        if (kept.length === this.size()) {
            return false;
        }
        this.clear();
        for (const element of kept) {
            this.add(element);
        }
        return true;
    }

    public abstract addAt(element: TElement, index: number): boolean;

    public abstract get(index: number): TElement;

    public abstract getRange(index: number, count: number): IList<TElement>;

    public abstract removeAt(index: number): TElement;

    public abstract set(index: number, element: TElement): TElement;

    public abstract sort(comparator?: OrderComparator<TElement>): void;
}
