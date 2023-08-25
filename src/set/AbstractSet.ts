import {AbstractRandomAccessCollection, IEnumerable, ISet} from "../../imports";
import {Comparators} from "../shared/Comparators";
import {EqualityComparator} from "../shared/EqualityComparator";

export abstract class AbstractSet<TElement> extends AbstractRandomAccessCollection<TElement> implements ISet<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super((e1: TElement, e2: TElement) => (comparator ?? Comparators.equalityComparator)(e1, e2));
    }

    public exceptWith(other: IEnumerable<TElement>): void {
        this.removeAll(other);
    }

    public intersectWith(other: IEnumerable<TElement>): void {
        this.retainAll(other);
    }

    public isProperSubsetOf(other: IEnumerable<TElement>): boolean {
        return this.isSubsetOf(other) && this.size() < other.count();
    }

    public isProperSupersetOf(other: IEnumerable<TElement>): boolean {
        return this.isSupersetOf(other) && this.size() > other.count();
    }

    public isSubsetOf(other: IEnumerable<TElement>): boolean {
        if (this.isEmpty()) {
            return true;
        }
        if (this.size() > other.count()) {
            return false;
        }
        for (const element of this) {
            if (!other.contains(element)) {
                return false;
            }
        }
        return true;
    }

    public isSupersetOf(other: IEnumerable<TElement>): boolean {
        if (!other.any()) {
            return true;
        }
        if (this.size() < other.count()) {
            return false;
        }
        for (const element of other) {
            if (!this.contains(element)) {
                return false;
            }
        }
        return true;
    }

    public overlaps(other: IEnumerable<TElement>): boolean {
        for (const element of other) {
            if (this.contains(element)) {
                return true;
            }
        }
        return false;
    }
}
