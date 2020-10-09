import {AbstractList} from "./AbstractList";
import {ErrorMessages} from "../shared/ErrorMessages";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {ICollection} from "../core/ICollection";

export class List<TElement> extends AbstractList<TElement> {
    private readonly data: TElement[] = [];

    public constructor(collection?: ICollection<TElement> | Iterable<TElement>) {
        super();
        if (collection) {
            for (const element of collection) {
                this.add(element);
            }
        }
    }

    public static from<TSource>(source: Iterable<TSource>): List<TSource> {
        return new List<TSource>(source);
    }

    *[Symbol.iterator](): Iterator<TElement> {
        for (const element of this.data) {
            yield element;
        }
    }

    public addAt(element: TElement, index: number): boolean {
        if (index < 0 || index > this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        this.data.splice(index, 0, element);
        return true;
    }

    public clear(): void {
        this.data.length = 0;
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return this.data[index];
    }

    public remove(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        let deleted = false;
        for (let index = 0; index < this.data.length; ++index) {
            if (comparator(element, this.data[index])) {
                this.data.splice(index, 1);
                deleted = true;
                break;
            }
        }
        return deleted;
    }

    public removeAt(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        const element = this.data[index];
        this.data.splice(index, 1);
        return element;
    }

    public set(index: number, element: TElement): void {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        this.data[index] = element;
    }

    public size(): number {
        return this.data.length;
    }
}
