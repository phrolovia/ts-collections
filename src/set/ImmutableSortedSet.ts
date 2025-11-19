import { contains } from "../enumerator/functions/contains";
import { AbstractRandomAccessImmutableCollection } from "../core/AbstractRandomAccessImmutableCollection";
import { SortedSet } from "./SortedSet";
import { Comparators } from "../shared/Comparators";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Predicate } from "../shared/Predicate";
import { registerImmutableSortedSetFactory } from "../enumerator/Enumerator";

export class ImmutableSortedSet<TElement> extends AbstractRandomAccessImmutableCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #set: SortedSet<TElement>;

    private constructor(iterable: Iterable<TElement> = [] as TElement[],
                        comparator: OrderComparator<TElement> = Comparators.orderComparator) {
        super((e1, e2) => comparator(e1, e2) === 0);
        this.#set = new SortedSet(iterable, comparator);
        this.#comparator = comparator;
    }

    public static create<TElement>(iterable?: Iterable<TElement>,
                                   comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(iterable, comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#set;
    }

    /**
     * Adds the given element to this set.
     * @param element The element that will be added to this set.
     * @returns {ImmutableSortedSet} A new set with the added element.
     */
    public add(element: TElement): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.append(element), this.#comparator);
    }

    /**
     * Adds all elements from the provided collection to this set.
     * @param collection The collection whose element will be added to this set.
     * @returns {ImmutableSortedSet} A new set with the added elements.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet([...this.#set, ...collection], this.#comparator);
    }

    /**
     * Removes all elements from this set.
     * @returns {ImmutableSortedSet} An empty set.
     */
    public clear(): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet<TElement>([], this.#comparator);
    }

    public override contains(element: TElement): boolean {
        return this.#set.contains(element);
    }

    public override count(predicate?: Predicate<TElement>): number {
        return this.#set.count(predicate);
    }

    public exceptWith(other: Iterable<TElement>) {
        const set = this.#set.toEnumerableSet();
        set.exceptWith(other);
        return new ImmutableSortedSet(set, this.#comparator);
    }


    /**
     * Returns the first n elements of this set.
     * @param toElement The element up to which the elements will be included.
     * @param inclusive If true, the element toElement will be included; otherwise, it will be excluded.
     * @returns {ImmutableSortedSet} A new set that contains the first n elements of this set.
     */
    public headSet(toElement: TElement, inclusive: boolean = false): ImmutableSortedSet<TElement> {
        const headSet = this.#set.headSet(toElement, inclusive);
        return new ImmutableSortedSet(headSet, this.#comparator);
    }

    /**
     * Returns a new set that contains elements that are in both this set and the provided collection.
     * @param other The collection whose elements will be intersected with this set.
     * @returns {ImmutableSortedSet} A new set that contains elements that are in both this set and the provided collection.
     */
    public intersectWith(other: Iterable<TElement>): ImmutableSortedSet<TElement> {
        const set = this.#set.toEnumerableSet();
        set.intersectWith(other);
        return new ImmutableSortedSet(set, this.#comparator);
    }

    public isProperSubsetOf(other: Iterable<TElement>): boolean {
        return this.#set.isProperSubsetOf(other);
    }

    public isProperSupersetOf(other: Iterable<TElement>): boolean {
        return this.#set.isProperSupersetOf(other);
    }

    public isSubsetOf(other: Iterable<TElement>): boolean {
        return this.#set.isSubsetOf(other);
    }

    public isSupersetOf(other: Iterable<TElement>): boolean {
        return this.#set.isSupersetOf(other);
    }

    public overlaps(other: Iterable<TElement>): boolean {
        return this.#set.overlaps(other);
    }


    /**
     * Removes the given element from this set.
     * @param element The element that will be removed from this set.
     * @returns {ImmutableSortedSet} A new set with the removed element.
     */
    public remove(element: TElement): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.where(e => e !== element), this.#comparator);
    }

    /**
     * Removes all elements from this set that are contained in the specified collection.
     * @param collection The collection whose elements will be removed from this set.
     * @returns {ImmutableSortedSet} A new set without the elements in the specified collection.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.where(e => !contains(collection, e)), this.#comparator);
    }

    /**
     * Removes all elements from this set that satisfy the specified predicate.
     * @param predicate The predicate that will be used to remove elements from this set.
     * @returns {ImmutableSortedSet} A new set without the elements that satisfy the predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.where(e => !predicate(e)), this.#comparator);
    }

    /**
     * Removes all elements from this set except the ones that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this set.
     * @returns {ImmutableSortedSet} A new set with only the elements in the specified collection.
     */
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        const set = this.#set.toEnumerableSet();
        set.retainAll(collection);
        return new ImmutableSortedSet(set, this.#comparator);
    }

    public size(): number {
        return this.#set.size();
    }

    /**
     * Returns a new set that contains elements that are in the specified range.
     * @param fromElement The element from which the range will start.
     * @param toElement The element up to which the range will be included.
     * @param fromInclusive If true, the element fromElement will be included; otherwise, it will be excluded.
     * @param toInclusive If true, the element toElement will be included; otherwise, it will be excluded.
     * @returns {ImmutableSortedSet} A new set that contains elements that are in the specified range.
     */
    public subSet(fromElement: TElement, toElement: TElement, fromInclusive: boolean = false, toInclusive: boolean = false): ImmutableSortedSet<TElement> {
        const subSet = this.#set.subSet(fromElement, toElement, fromInclusive, toInclusive);
        return new ImmutableSortedSet(subSet, this.#comparator);
    }

    /**
     * Returns a new set that contains elements that are greater than or equal to the specified element.
     * @param fromElement The element from which the range will start.
     * @param inclusive If true, the element fromElement will be included; otherwise, it will be excluded.
     * @returns {ImmutableSortedSet} A new set that contains elements that are greater than or equal to the specified element.
     */
    public tailSet(fromElement: TElement, inclusive: boolean = false): ImmutableSortedSet<TElement> {
        const tailSet = this.#set.tailSet(fromElement, inclusive);
        return new ImmutableSortedSet(tailSet, this.#comparator);
    }

    public override get comparator(): OrderComparator<TElement> {
        return this.#comparator;
    }

    public override get length(): number {
        return this.#set.length;
    }
}

registerImmutableSortedSetFactory(<TElement>(iterable: Iterable<TElement>, comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> => {
    return ImmutableSortedSet.create(iterable, comparator);
});
