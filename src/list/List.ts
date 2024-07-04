import { AbstractList } from "../imports";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexOutOfBoundsException } from "../shared/IndexOutOfBoundsException";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export class List<TElement> extends AbstractList<TElement> {
    readonly #data: TElement[] = [];

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator?: EqualityComparator<TElement>
    ) {
        super(comparator);
        for (const element of iterable) {
            this.add(element);
        }
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#data;
    }

    public addAt(element: TElement, index: number): boolean {
        if (index < 0 || index > this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        this.#data.splice(index, 0, element);
        return true;
    }

    public clear(): void {
        this.#data.length = 0;
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return this.#data.some(item => comparator ? comparator(element, item) : element === item);
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        return this.#data[index];
    }

    public override getRange(index: number, count: number): List<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        if (count < 0) {
            throw new InvalidArgumentException("count must be greater than or equal to zero.", "count");
        }
        if (count < 0 || index + count > this.size()) {
            throw new IndexOutOfBoundsException(index + count);
        }
        return new List(this.#data.slice(index, index + count), this.comparer);
    }

    public remove(element: TElement): boolean {
        let deleted = false;
        for (let index = 0; index < this.#data.length; ++index) {
            if (this.comparer(element, this.#data[index])) {
                this.#data.splice(index, 1);
                deleted = true;
                break;
            }
        }
        return deleted;
    }

    public removeAt(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        const element = this.#data[index];
        this.#data.splice(index, 1);
        return element;
    }

    public set(index: number, element: TElement): TElement {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        const oldElement = this.#data[index];
        this.#data[index] = element;
        return oldElement;
    }

    public size(): number {
        return this.#data.length;
    }

    public sort(comparator?: OrderComparator<TElement>): void {
        comparator ??= Comparators.orderComparator;
        this.#data.sort(comparator);
    }

    public override toArray(): TElement[] {
        return [...this.#data];
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

    public override get length(): number {
        return this.#data.length;
    }
}
