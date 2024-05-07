import { AbstractImmutableCollection, contains, IReadonlyList, List, ReadonlyList } from "../imports.ts";
import { EqualityComparator } from "../shared/EqualityComparator";
import { ErrorMessages } from "../shared/ErrorMessages";
import { OrderComparator } from "../shared/OrderComparator";
import { Predicate } from "../shared/Predicate";

export class ImmutableList<TElement> extends AbstractImmutableCollection<TElement> implements IReadonlyList<TElement> {
    readonly #list: ReadonlyList<TElement>;

    private constructor(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#list = new ReadonlyList(new List(iterable, comparator));
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#list;
    }

    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return new ImmutableList(iterable, comparator);
    }

    /**
     * Adds the given element to the end of this list.
     * @param element The element that will be added to this list.
     * @returns {ImmutableList} A new list with the added element.
     */
    public add(element: TElement): ImmutableList<TElement> {
        return new ImmutableList([...this.#list, element], this.comparer);
    }

    /**
     * Adds the given element to the specified index of this list.
     * @param collection The collection whose element will be added to this list.
     * @returns {ImmutableList} A new list with the added element.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        return new ImmutableList([...this.#list, ...collection], this.comparer);
    }

    public override any(predicate?: Predicate<TElement>): boolean {
        return this.#list.any(predicate);
    }

    /**
     * Removes all elements from this list.
     * @returns {ImmutableList} An empty list.
     */
    public clear(): ImmutableList<TElement> {
        return new ImmutableList([], this.comparer);
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.#list.contains(element, comparator);
    }

    public override containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.#list.containsAll(collection);
    }

    public override count(predicate?: Predicate<TElement>): number {
        return this.#list.count(predicate);
    }

    public override elementAt(index: number): TElement {
        return this.#list.elementAt(index);
    }

    public override elementAtOrDefault(index: number): TElement | null {
        return this.#list.elementAtOrDefault(index);
    }

    public* entries(): IterableIterator<[number, TElement]> {
        yield* this.#list.entries();
    }

    public override first(predicate?: Predicate<TElement>): TElement {
        return this.#list.first(predicate);
    }

    public override firstOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return this.#list.firstOrDefault(predicate);
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return this.#list.get(index);
    }

    /**
     * Returns a new list that contains the elements in the specified range.
     * @param index The index at which the range starts.
     * @param count The number of elements in the range.
     * @returns {ImmutableList} A new list that contains the elements in the specified range.
     */
    public getRange(index: number, count: number): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return new ImmutableList(this.#list.getRange(index, count), this.comparer);
    }

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        return this.#list.indexOf(element, comparator);
    }

    public override last(predicate?: Predicate<TElement>): TElement {
        return this.#list.last(predicate);
    }

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        return this.#list.lastIndexOf(element, comparator);
    }

    public override lastOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return this.#list.lastOrDefault(predicate);
    }

    /**
     * Removes the element at the given index from this list.
     * @param element The element that will be removed from the list.
     * @returns {ImmutableList} A new list without the specified element.
     */
    public remove(element: TElement): ImmutableList<TElement> {
        return new ImmutableList(this.#list.where(e => !this.comparer(element, e)), this.comparer);
    }

    /**
     * Removes all elements from this list that are contained in the specified collection.
     * @param collection The collection whose elements will be removed from this list.
     * @returns {ImmutableList} A new list without the elements in the specified collection.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        return new ImmutableList(this.#list.where(e => !contains(collection, e, this.comparer)), this.comparer);
    }

    /**
     * Removes the element at the given index from this list.
     * @param index The index from which the element will be removed.
     * @returns {ImmutableList} A new list without the element at the specified index.
     */
    public removeAt(index: number): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return new ImmutableList(this.#list.where((_, i) => i !== index), this.comparer);
    }

    /**
     * Removes all elements from this list that satisfies the specified predicate.
     * @param predicate The predicate used to remove elements from this list.
     * @returns {ImmutableList} A new list without the elements that satisfies the specified predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableList<TElement> {
        return new ImmutableList(this.#list.where(e => !predicate(e)), this.comparer);
    }

    /**
     * Removes all elements from this list except the ones that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this list.
     * @returns {ImmutableList} A new list with only the elements in the specified collection.
     */
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        const list = this.#list.toList();
        list.retainAll(collection);
        return new ImmutableList(list, this.comparer);
    }

    /**
     * Replaces the element at the given index with the given element.
     * @param index The index at which the element will be replaced
     * @param element The element which will replace the element at the given index.
     * @returns {ImmutableList} A new list with the replaced element.
     */
    public set(index: number, element: TElement): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return new ImmutableList(this.#list.select((e, i) => i === index ? element : e), this.comparer);
    }

    public size(): number {
        return this.#list.size();
    }

    /**
     * Sorts the list according to the specified comparator. The original list will not be modified.
     * @param comparator The comparator used to compare the list elements.
     * @returns {ImmutableList} A new list that is sorted according to the specified comparator.
     */
    public sort(comparator?: OrderComparator<TElement>): ImmutableList<TElement> {
        return new ImmutableList(this.#list.toArray().sort(comparator), this.comparer);
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#list.length;
    }
}