import {AbstractList} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {ErrorMessages} from "../shared/ErrorMessages";
import {OrderComparator} from "../shared/OrderComparator";

/**
 * A list whose elements can be accessed via [] operator.
 * Important: Due to TypeScript limitations, assigning to an index that is greater than
 * the size of the list will break the list.
 */
export class RecordList<TElement> extends AbstractList<TElement> {
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
        this.updateCount();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (let ex = 0; ex < this.size(); ++ex) {
            yield this[ex];
        }
    }

    public add(element: TElement): boolean {
        this[this.listSize] = element;
        this.listSize++;
        this.updateCount();
        return true;
    }

    public addAt(element: TElement, index: number): boolean {
        if (index < 0 || index > this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        if (index === this.size()) {
            this[index] = element;
            this.listSize++;
            this.updateCount();
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
        this.updateCount();
        return true;
    }

    public clear(): void {
        for (let ex = 0; ex < this.size(); ++ex) {
            delete this[ex];
        }
        this.listSize = 0;
        this.updateCount();
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return this[index];
    }

    public remove(element: TElement): boolean {
        let copy: TElement[] = [];
        let found: boolean = false;
        for (const item of this) {
            if (!found && this.comparator(item, element)) {
                found = true;
                continue;
            }
            copy.push(item);
        }
        const removed = copy.length !== this.size();
        if (removed) {
            for (let ex = 0; ex < this.size(); ++ex) {
                if (ex < copy.length) {
                    this[ex] = copy[ex];
                } else {
                    delete this[ex];
                    this.listSize--;
                }
            }
            this.updateCount();
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
        delete this[this.size()];
        this.listSize--;
        this.updateCount();
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
