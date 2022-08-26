import {EqualityComparator} from "../shared/EqualityComparator";
import {Predicate} from "../shared/Predicate";
import {IList, LinkedList} from "../../imports";
import {OrderComparator} from "../shared/OrderComparator";
import {AbstractRandomAccessCollection} from "../core/AbstractRandomAccessCollection";
import {ErrorMessages} from "../shared/ErrorMessages";

export abstract class AbstractList<TElement> extends AbstractRandomAccessCollection<TElement> implements IList<TElement> {

    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
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

    public override elementAtOrDefault(index: number): TElement {
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

    // public override first(predicate?: Predicate<TElement>): TElement {
    //     if (!predicate) {
    //         if (this.isEmpty()) {
    //             throw new Error(ErrorMessages.NoElements);
    //         }
    //         return this.get(0);
    //     }
    //     return super.first(predicate);
    // }
    //
    // public override firstOrDefault(predicate?: Predicate<TElement>): TElement {
    //     if (!predicate) {
    //         return this.isEmpty() ? null : this.get(0);
    //     }
    //     return super.firstOrDefault(predicate);
    // }

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

    public override last(predicate?: Predicate<TElement>): TElement {
        if (!predicate) {
            if (this.isEmpty()) {
                throw new Error(ErrorMessages.NoElements);
            }
            return this.get(this.size() - 1);
        }
        return super.last(predicate);
    }

    public override lastOrDefault(predicate?: Predicate<TElement>): TElement {
        if (!predicate) {
            return this.isEmpty() ? null : this.get(this.size() - 1);
        }
        return super.lastOrDefault(predicate);
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
        this.updateLength();
        return this.size() !== oldSize;
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        const oldSize = this.size();
        for (let index = this.size() - 1; index >= 0; --index) {
            if (predicate(this.get(index))) {
                this.removeAt(index);
            }
        }
        this.updateLength();
        return this.size() !== oldSize;
    }

    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const oldSize = this.size();
        const removedElements = new LinkedList<TElement>();
        for (const element of this) {
            const iterator = collection[Symbol.iterator]();
            let next = iterator.next();
            let found = false;
            while (!next.done) {
                if (this.comparator(element, next.value)) {
                    found = true;
                    break;
                }
                next = iterator.next();
            }
            if (!found) {
                removedElements.add(element);
            }
        }
        this.removeAll(removedElements);
        this.updateLength();
        return this.size() !== oldSize;
    }

    public abstract addAt(element: TElement, index: number): boolean;
    public abstract get(index: number): TElement;
    public abstract removeAt(index: number): TElement;
    public abstract set(index: number, element: TElement): TElement;
    public abstract sort(comparator?: OrderComparator<TElement>): void;
}
