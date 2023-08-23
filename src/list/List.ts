import {ErrorMessages} from "../shared/ErrorMessages";
import {AbstractList} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {Comparators} from "../shared/Comparators";
import {Selector} from "../shared/Selector";

export class List<TElement> extends AbstractList<TElement> {
    protected readonly data: TElement[] = [];

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator?: EqualityComparator<TElement>
    ) {
        super(comparator);
        for (const element of iterable) {
            this.add(element);
        }
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.data;
    }

    public addAt(element: TElement, index: number): boolean {
        if (index < 0 || index > this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        this.data.splice(index, 0, element);
        this.updateLength();
        return true;
    }

    public clear(): void {
        this.data.length = 0;
        this.updateLength();
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return this.data[index];
    }

    public remove(element: TElement): boolean {
        let deleted = false;
        for (let index = 0; index < this.data.length; ++index) {
            if (this.comparer(element, this.data[index])) {
                this.data.splice(index, 1);
                deleted = true;
                break;
            }
        }
        this.updateLength();
        return deleted;
    }

    public removeAt(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        const element = this.data[index];
        this.data.splice(index, 1);
        this.updateLength();
        return element;
    }

    public set(index: number, element: TElement): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        const oldElement = this.data[index];
        this.data[index] = element;
        return oldElement;
    }

    public size(): number {
        return this.data.length;
    }

    public sort(comparator?: OrderComparator<TElement>): void {
        comparator ??= Comparators.orderComparator;
        this.data.sort(comparator);
    }

    public override toArray(): TElement[] {
        return [...this.data];
    }

    public override toString(): string;
    public override toString(separator?: string): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string {
        if (this.isEmpty()) {
            return "";
        }
        const buffer = new Array<string>();
        for (const element of this) {
            buffer.push(selector?.(element) ?? String(element));
        }
        return buffer.join(separator ?? ", ");
    }
}
