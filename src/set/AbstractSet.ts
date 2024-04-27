import { AbstractRandomAccessCollection, from, ISet } from "../imports.ts";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";

export abstract class AbstractSet<TElement> extends AbstractRandomAccessCollection<TElement> implements ISet<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super((e1: TElement, e2: TElement) => (comparator ?? Comparators.equalityComparator)(e1, e2));
    }

    public exceptWith(other: Iterable<TElement>): void {
        this.removeAll(other);
    }

    public intersectWith(other: Iterable<TElement>): void {
        this.retainAll(other);
    }

    public isProperSubsetOf(other: Iterable<TElement>): boolean {
        return this.isSubsetOf(other) && this.size() < this.getIterableSize(other);
    }

    public isProperSupersetOf(other: Iterable<TElement>): boolean {
        return this.isSupersetOf(other) && this.size() > this.getIterableSize(other);
    }

    public isSubsetOf(other: Iterable<TElement>): boolean {
        if (this.isEmpty()) {
            return true;
        }
        if (this.size() > this.getIterableSize(other)) {
            return false;
        }
        for (const element of this) {
            if (!from(other).contains(element)) {
                return false;
            }
        }
        return true;
    }

    public isSupersetOf(other: Iterable<TElement>): boolean {
        if (!from(other).any()) {
            return true;
        }
        if (this.size() < this.getIterableSize(other)) {
            return false;
        }
        for (const element of other) {
            if (!this.contains(element)) {
                return false;
            }
        }
        return true;
    }

    public overlaps(other: Iterable<TElement>): boolean {
        for (const element of other) {
            if (this.contains(element)) {
                return true;
            }
        }
        return false;
    }
}
