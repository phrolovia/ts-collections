import { AbstractRandomAccessImmutableCollection } from "../core/AbstractRandomAccessImmutableCollection";
import { EnumerableSet } from "./EnumerableSet";
import type { EqualityComparator } from "../shared/EqualityComparator";
import type { Predicate } from "../shared/Predicate";
import { registerImmutableSetFactory } from "../enumerator/Enumerator";
import { OrderedHashTrie } from "../shared/internal/OrderedHashTrie";

/**
 * Immutable set backed by a persistent hash array mapped trie.
 * Updates share structure with the original set instead of copying it, so `add` and `remove`
 * run in O(log32 n). Elements are compared like `Set` does and iterate in insertion order.
 */
export class ImmutableSet<TElement> extends AbstractRandomAccessImmutableCollection<TElement> {
    readonly #trie: OrderedHashTrie<TElement, true>;

    private constructor(trie: OrderedHashTrie<TElement, true>) {
        super();
        this.#trie = trie;
    }

    public static create<TElement>(iterable: Iterable<TElement> = []): ImmutableSet<TElement> {
        return new ImmutableSet(ImmutableSet.#addAllTo(OrderedHashTrie.empty(), iterable));
    }

    static #addAllTo<TElement>(trie: OrderedHashTrie<TElement, true>, iterable: Iterable<TElement>): OrderedHashTrie<TElement, true> {
        for (const element of iterable) {
            trie = trie.set(element, true);
        }
        return trie;
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (const entry of this.#trie) {
            yield entry.key;
        }
    }

    /**
     * Adds the given element to this set.
     * @param element The element that will be added to this set.
     * @returns {ImmutableSet} A new set with the added element.
     */
    public add(element: TElement): ImmutableSet<TElement> {
        return this.#withTrie(this.#trie.set(element, true));
    }

    /**
     * Adds all elements from the provided collection to this set.
     * @param collection The collection whose element will be added to this set.
     * @returns {ImmutableSet} A new set with the added elements.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return this.#withTrie(ImmutableSet.#addAllTo(this.#trie, collection));
    }

    /**
     * Removes all elements from this set.
     * @returns {ImmutableSet} An empty set.
     */
    public clear(): ImmutableSet<TElement> {
        return this.#withTrie(OrderedHashTrie.empty());
    }

    public override contains(element: TElement): boolean {
        return this.#trie.find(element) !== undefined;
    }

    /**
     * Returns a new set that contains elements from this set that are not in the provided collection.
     * @param collection The collection whose elements will be excluded from this set.
     * @returns {ImmutableSet} A new set that contains elements from this set that are not in the provided collection.
     */
    public exceptWith<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return this.removeAll(collection);
    }

    /**
     * Returns a new set that contains elements that are in both this set and the provided collection.
     * @param collection The collection whose elements will be intersected with this set.
     * @returns {ImmutableSet} A new set that contains elements that are in both this set and the provided collection.
     */
    public intersectWith<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return this.retainAll(collection);
    }

    public isProperSubsetOf(collection: Iterable<TElement>): boolean {
        return this.#view().isProperSubsetOf(collection);
    }

    public isProperSupersetOf(collection: Iterable<TElement>): boolean {
        return this.#view().isProperSupersetOf(collection);
    }

    public isSubsetOf(collection: Iterable<TElement>): boolean {
        return this.#view().isSubsetOf(collection);
    }

    public isSupersetOf(collection: Iterable<TElement>): boolean {
        return this.#view().isSupersetOf(collection);
    }

    public overlaps(collection: Iterable<TElement>): boolean {
        return this.#view().overlaps(collection);
    }

    /**
     * Removes the specified element from this set.
     * @param element The element that will be removed from this set.
     * @returns {ImmutableSet} A new set without the specified element.
     */
    public remove(element: TElement): ImmutableSet<TElement> {
        return this.#withTrie(this.#trie.remove(element));
    }

    /**
     * Removes all elements from this set that are contained in the specified collection.
     * @param collection The collection whose elements will be removed from this set.
     * @returns {ImmutableSet} A new set without the elements in the specified collection.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        let trie = this.#trie;
        for (const element of collection) {
            trie = trie.remove(element);
        }
        return this.#withTrie(trie);
    }

    /**
     * Removes all elements from this set that satisfy the specified predicate.
     * @param predicate The predicate used to remove elements from this set.
     * @returns {ImmutableSet} A new set without the elements that satisfy the specified predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableSet<TElement> {
        let trie = this.#trie;
        for (const entry of this.#trie) {
            if (predicate(entry.key)) {
                trie = trie.remove(entry.key);
            }
        }
        return this.#withTrie(trie);
    }

    /**
     * Replaces all elements in this set with the elements from the provided collection.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableSet} A new set containing only the elements from the provided collection.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        if (collection === this) {
            return this;
        }
        return ImmutableSet.create<TElement>(collection);
    }

    /**
     * Removes all elements from this set except the ones that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this set.
     * @returns {ImmutableSet} A new set with only the elements in the specified collection.
     */
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        const retained = new Set<TElement>(collection);
        let trie = this.#trie;
        for (const entry of this.#trie) {
            if (!retained.has(entry.key)) {
                trie = trie.remove(entry.key);
            }
        }
        return this.#withTrie(trie);
    }

    public size(): number {
        return this.#trie.size;
    }

    // Subset queries scan both collections anyway, so they run on a temporary EnumerableSet.
    #view(): EnumerableSet<TElement> {
        return new EnumerableSet(this);
    }

    // Returns this set when an operation left the trie unchanged.
    #withTrie(trie: OrderedHashTrie<TElement, true>): ImmutableSet<TElement> {
        return trie === this.#trie ? this : new ImmutableSet(trie);
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#trie.size;
    }
}

registerImmutableSetFactory(<TElement>(iterable: Iterable<TElement>): ImmutableSet<TElement> => {
    return ImmutableSet.create(iterable);
});
