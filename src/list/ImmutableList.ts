import { contains } from "../enumerator/functions/contains";
import { AbstractRandomAccessImmutableCollection } from "../core/AbstractRandomAccessImmutableCollection";
import { List } from "./List";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { IndexOutOfBoundsException } from "../shared/IndexOutOfBoundsException";
import { NoElementsException } from "../shared/NoElementsException";
import { PersistentVector } from "../shared/internal/PersistentVector";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Predicate, TypePredicate } from "../shared/Predicate";
import type { IReadonlyList } from "./IReadonlyList";

/**
 * Immutable list backed by a persistent vector. `add`, `set`, `get` and removing the last element
 * share structure with the original list and run in O(log32 n). Operations that shift elements,
 * such as `addAt` or `removeAt` in the middle, still rebuild the list in O(n).
 */
export class ImmutableList<TElement> extends AbstractRandomAccessImmutableCollection<TElement> implements IReadonlyList<TElement> {
    readonly #vector: PersistentVector<TElement>;

    private constructor(vector: PersistentVector<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#vector = vector;
    }

    /** @internal get(index) returns the element that iteration yields at that position. Read by shared/internal/collectionAccess. */
    protected get isIndexedSource(): true {
        return true;
    }

    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return new ImmutableList(PersistentVector.empty<TElement>().pushAll(iterable ?? []), comparator);
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.#vector[Symbol.iterator]();
    }

    /**
     * Adds the given element to the end of this list.
     * @param element The element that will be added to this list.
     * @returns {ImmutableList} A new list with the added element.
     */
    public add(element: TElement): ImmutableList<TElement> {
        return this.#with(this.#vector.push(element));
    }

    /**
     * Adds all elements from the provided collection to this list.
     * @param collection The collection whose element will be added to this list.
     * @returns {ImmutableList} A new list with the added element.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        return this.#with(this.#vector.pushAll(collection));
    }

    public addAt(element: TElement, index: number): ImmutableList<TElement> {
        if (index < 0 || index > this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        if (index === this.size()) {
            return this.add(element);
        }
        const list = this.#toList();
        list.addAt(element, index);
        return this.#from(list);
    }

    /**
     * Removes all elements from this list.
     * @returns {ImmutableList} An empty list.
     */
    public clear(): ImmutableList<TElement> {
        return this.#with(PersistentVector.empty());
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.indexOf(element, comparator) !== -1;
    }

    public override elementAt(index: number): TElement {
        return this.get(index);
    }

    public override elementAtOrDefault(index: number): TElement | null {
        return index < 0 || index >= this.size() ? null : this.#vector.get(index);
    }

    public* entries(): IterableIterator<[number, TElement]> {
        let index = 0;
        for (const element of this.#vector) {
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
            return this.#vector.get(0);
        }
        return super.first(predicate as Predicate<TElement>);
    }

    public override firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public override firstOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public override firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        if (!predicate) {
            return this.isEmpty() ? null : this.#vector.get(0);
        }
        return super.firstOrDefault(predicate as Predicate<TElement>);
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        return this.#vector.get(index);
    }

    /**
     * Returns a new list that contains the elements in the specified range.
     * @param index The index at which the range starts.
     * @param count The number of elements in the range.
     * @returns {ImmutableList} A new list that contains the elements in the specified range.
     */
    public getRange(index: number, count: number): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        return this.#from(this.#toList().getRange(index, count));
    }

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        comparator ??= this.comparer;
        let index = 0;
        for (const e of this.#vector) {
            if (element == null ? e == null : comparator(e, element)) {
                return index;
            }
            ++index;
        }
        return -1;
    }

    public override isEmpty(): boolean {
        return this.#vector.size === 0;
    }

    public override last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public override last(predicate?: Predicate<TElement>): TElement;
    public override last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        if (!predicate) {
            if (this.isEmpty()) {
                throw new NoElementsException();
            }
            return this.#vector.get(this.size() - 1);
        }
        return super.last(predicate as Predicate<TElement>);
    }

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        comparator ??= this.comparer;
        for (let index = this.size() - 1; index >= 0; --index) {
            const e = this.#vector.get(index);
            if (element == null ? e == null : comparator(element, e)) {
                return index;
            }
        }
        return -1;
    }

    public override lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public override lastOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public override lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        if (!predicate) {
            return this.isEmpty() ? null : this.#vector.get(this.size() - 1);
        }
        return super.lastOrDefault(predicate as Predicate<TElement>);
    }

    /**
     * Removes the element at the given index from this list.
     * @param element The element that will be removed from the list.
     * @returns {ImmutableList} A new list without the specified element.
     */
    public remove(element: TElement): ImmutableList<TElement> {
        return this.removeIf(e => this.comparer(element, e));
    }

    /**
     * Removes all elements from this list that are contained in the specified collection.
     * @param collection The collection whose elements will be removed from this list.
     * @returns {ImmutableList} A new list without the elements in the specified collection.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        return this.removeIf(e => contains(collection, e, this.comparer));
    }

    /**
     * Removes the element at the given index from this list.
     * @param index The index from which the element will be removed.
     * @returns {ImmutableList} A new list without the element at the specified index.
     */
    public removeAt(index: number): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        if (index === this.size() - 1) {
            return this.#with(this.#vector.pop());
        }
        const list = this.#toList();
        list.removeAt(index);
        return this.#from(list);
    }

    /**
     * Removes all elements from this list that satisfies the specified predicate.
     * @param predicate The predicate used to remove elements from this list.
     * @returns {ImmutableList} A new list without the elements that satisfies the specified predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableList<TElement> {
        const kept = PersistentVector.empty<TElement>().asMutable();
        for (const element of this.#vector) {
            if (!predicate(element)) {
                kept.push(element);
            }
        }
        return kept.size === this.size() ? this : this.#with(kept.asImmutable());
    }

    /**
     * Replaces all elements in this list with the elements from the provided collection.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableList} A new list containing only the elements from the provided collection.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        if (collection === this) {
            return this;
        }
        return ImmutableList.create<TElement>(collection, this.comparer);
    }

    /**
     * Removes all elements from this list except the ones that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this list.
     * @returns {ImmutableList} A new list with only the elements in the specified collection.
     */
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        const list = this.#toList();
        list.retainAll(collection);
        return list.size() === this.size() ? this : this.#from(list);
    }

    /**
     * Replaces the element at the given index with the given element.
     * @param index The index at which the element will be replaced
     * @param element The element which will replace the element at the given index.
     * @returns {ImmutableList} A new list with the replaced element.
     */
    public set(index: number, element: TElement): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        return this.#with(this.#vector.set(index, element));
    }

    public size(): number {
        return this.#vector.size;
    }

    /**
     * Sorts the list according to the specified comparator. The original list will not be modified.
     * @param comparator The comparator used to compare the list elements.
     * @returns {ImmutableList} A new list that is sorted according to the specified comparator.
     */
    public sort(comparator?: OrderComparator<TElement>): ImmutableList<TElement> {
        return this.#from(Array.from(this.#vector).sort(comparator));
    }

    #from(elements: Iterable<TElement>): ImmutableList<TElement> {
        return ImmutableList.create(elements, this.comparer);
    }

    #toList(): List<TElement> {
        return new List(this.#vector, this.comparer);
    }

    #with(vector: PersistentVector<TElement>): ImmutableList<TElement> {
        return vector === this.#vector ? this : new ImmutableList(vector, this.comparer);
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#vector.size;
    }
}
