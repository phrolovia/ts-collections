import {AbstractList} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {ErrorMessages} from "../shared/ErrorMessages";
import {OrderComparator} from "../shared/OrderComparator";

/**
 * A list is a collection of elements that can be accessed by index.
 * Note that adding and element to the list via index will not update the list properly.
 * Therefore, to add a new element to the list, always use the {@link add} method.
 */
export class IndexableList<TElement> extends AbstractList<TElement> {
    private listSize: number = 0;
    [n: number]: TElement;
    public constructor(iterable: Iterable<TElement> = [], comparator: EqualityComparator<TElement> = Comparators.equalityComparator) {
        super(comparator);
        if (iterable) {
            let index: number = 0;
            for (const element of iterable) {
                this[index++] = element;
                this.listSize++;
            }
        }
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (let ex = 0; ex < this.size(); ++ex) {
            yield this[ex];
        }
    }

    public override add(element: TElement): boolean {
        return this.addAt(element, this.size());
    }

    public addAt(element: TElement, index: number): boolean {
        if (index < 0 || index > this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        if (index === this.size()) {
            this[index] = element;
            this.listSize++;
            this.updateLength();
            return true;
        }
        let shiftedItem: TElement = this[index];
        for (let ex = index; ex < this.size() - 1; ++ex) {
            this[ex] = element;
            shiftedItem = this[ex + 1];
        }
        this[this.size()] = shiftedItem;
        this[this.size() + 1] = element;
        this.listSize++;
        this.updateLength();
        return true;
    }

    public clear(): void {
        for (let ex = 0; ex < this.size(); ++ex) {
            delete this[ex];
        }
        this.listSize = 0;
        this.updateLength();
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return this[index];
    }

    public remove(element: TElement): boolean {
        let removed = false;
        for (let ex = 0; ex < this.size(); ++ex) {
            if (this.comparer(this[ex], element)) {
                if (ex === this.size() - 1) {
                    delete this[ex];
                    this.listSize--;
                    this.updateLength();
                    return true;
                }
                this.removeAt(ex);
                removed = true;
                break;
            }
        }
        return removed;
    }

    public removeAt(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        const element = this[index];
        for (let ex = index; ex < this.size() - 1; ++ex) {
            this[ex] = this[ex + 1];
        }
        delete this[this.size()-1];
        this.listSize--;
        this.updateLength();
        return element;
    }

    public set(index: number, element: TElement): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        const oldElement = this[index];
        this[index] = element;
        return oldElement;
    }

    public size(): number {
        return this.listSize;
    }

    public sort(comparator: OrderComparator<TElement> = Comparators.orderComparator): void {
        const copy = this.toArray() as TElement[];
        copy.sort(comparator);
        for (const [index, element] of copy.entries()) {
            this[index] = element;
        }
    }
}
