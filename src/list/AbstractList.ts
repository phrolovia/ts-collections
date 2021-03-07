import {EqualityComparator} from "../shared/EqualityComparator";
import {Predicate} from "../shared/Predicate";
import {AbstractCollection, ICollection, IList, LinkedList} from "../../imports";
import {OrderComparator} from "../shared/OrderComparator";

export abstract class AbstractList<TElement> extends AbstractCollection<TElement> implements IList<TElement> {

    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    public add(element: TElement): boolean {
        return this.addAt(element, this.size());
    }

    public elementAt(index: number): TElement {
        return this.get(index);
    }

    public elementAtOrDefault(index: number): TElement {
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

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        comparator ??= this.comparator;
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

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        const array = this.toArray();
        comparator ??= this.comparator;
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

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const oldSize = this.size();
        let index = 0;
        for (const e of collection) {
            index = this.indexOf(e);
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

    public retainAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean {
        const oldSize = this.size();
        const collectionList = collection instanceof Array
            ? new LinkedList<TSource>(collection, this.comparator)
            : collection as ICollection<TSource>;
        for (let index = this.size() - 1; index >= 0; --index) {
            if (!collectionList.contains(this.get(index) as TSource, this.comparator)) {
                this.removeAt(index);
            }
        }
        return this.size() !== oldSize;
    }

    public abstract addAt(element: TElement, index: number): boolean;
    public abstract get(index: number): TElement;
    public abstract removeAt(index: number): TElement;
    public abstract set(index: number, element: TElement): TElement;
    public abstract sort(comparator?: OrderComparator<TElement>): void;
}
