import { contains } from "../enumerator/functions/contains";
import { AbstractRandomAccessImmutableCollection } from "../core/AbstractRandomAccessImmutableCollection";
import { EnumerableSet } from "./EnumerableSet";
import { EqualityComparator } from "../shared/EqualityComparator";
import { Predicate } from "../shared/Predicate";

export class ImmutableSet<TElement> extends AbstractRandomAccessImmutableCollection<TElement> {
    readonly #set: EnumerableSet<TElement>;

    private constructor(iterable?: Iterable<TElement>) {
        super();
        this.#set = new EnumerableSet(iterable);
    }

    public static create<TElement>(iterable?: Iterable<TElement>): ImmutableSet<TElement> {
        return new ImmutableSet(iterable);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#set;
    }

    /**
     * Adds the given element to this set.
     * @param element The element that will be added to this set.
     * @returns {ImmutableSet} A new set with the added element.
     */
    public add(element: TElement): ImmutableSet<TElement> {
        return new ImmutableSet([...this.#set, element]);
    }

    /**
     * Adds all elements from the provided collection to this set.
     * @param collection The collection whose element will be added to this set.
     * @returns {ImmutableSet} A new set with the added elements.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet([...this.#set, ...collection]);
    }

    /**
     * Removes all elements from this set.
     * @returns {ImmutableSet} An empty set.
     */
    public clear(): ImmutableSet<TElement> {
        return new ImmutableSet<TElement>([]);
    }

    public override contains(element: TElement): boolean {
        return this.#set.contains(element);
    }

    public override count(predicate?: Predicate<TElement>): number {
        return this.#set.count(predicate);
    }

    /**
     * Returns a new set that contains elements from this set that are not in the provided collection.
     * @param collection The collection whose elements will be excluded from this set.
     * @returns {ImmutableSet} A new set that contains elements from this set that are not in the provided collection.
     */
    public exceptWith<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => !contains(collection, x)));
    }

    /**
     * Returns a new set that contains elements that are in both this set and the provided collection.
     * @param collection The collection whose elements will be intersected with this set.
     * @returns {ImmutableSet} A new set that contains elements that are in both this set and the provided collection.
     */
    public intersectWith<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => contains(collection, x)));
    }

    public isProperSubsetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isProperSubsetOf(collection);
    }

    public isProperSupersetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isProperSupersetOf(collection);
    }

    public isSubsetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isSubsetOf(collection);
    }

    public isSupersetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isSupersetOf(collection);
    }

    public overlaps(collection: Iterable<TElement>): boolean {
        return this.#set.overlaps(collection);
    }

    /**
     * Removes the specified element from this set.
     * @param element The element that will be removed from this set.
     * @returns {ImmutableSet} A new set without the specified element.
     */
    public remove(element: TElement): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => x !== element));
    }

    /**
     * Removes all elements from this set that are contained in the specified collection.
     * @param collection The collection whose elements will be removed from this set.
     * @returns {ImmutableSet} A new set without the elements in the specified collection.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => !contains(collection, x)));
    }

    /**
     * Removes all elements from this set that satisfy the specified predicate.
     * @param predicate The predicate used to remove elements from this set.
     * @returns {ImmutableSet} A new set without the elements that satisfy the specified predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => !predicate(x)));
    }

    /**
     * Removes all elements from this set except the ones that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this set.
     * @returns {ImmutableSet} A new set with only the elements in the specified collection.
     */
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        const set = this.#set.toEnumerableSet();
        set.retainAll(collection);
        return new ImmutableSet(set);
    }

    public size(): number {
        return this.#set.size();
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.#set.comparator;
    }

    public override get length(): number {
        return this.#set.length;
    }
}
