import { AbstractRandomAccessImmutableCollection } from "../core/AbstractRandomAccessImmutableCollection";
import { SortedSet } from "./SortedSet";
import { Comparators } from "../shared/Comparators";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Predicate } from "../shared/Predicate";
import { registerImmutableSortedSetFactory } from "../enumerator/Enumerator";
import { find, fromSorted, insert, nodes, remove, type Tree } from "../shared/internal/SortedTree";

/**
 * Immutable sorted set backed by a persistent weight-balanced tree. `add` and `remove` copy only
 * the O(log n) nodes on the path to the element and share the rest with the original set.
 */
export class ImmutableSortedSet<TElement> extends AbstractRandomAccessImmutableCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #tree: Tree<TElement, null>;
    #view: SortedSet<TElement> | undefined;

    private constructor(tree: Tree<TElement, null>, comparator: OrderComparator<TElement>) {
        super((e1, e2) => comparator(e1, e2) === 0);
        this.#tree = tree;
        this.#comparator = comparator;
    }

    public static create<TElement>(iterable?: Iterable<TElement>,
                                   comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        const order = comparator ?? Comparators.orderComparator;
        return new ImmutableSortedSet(ImmutableSortedSet.#build(iterable ?? [], order), order);
    }

    // Sorts the elements and keeps the first of each run of equal ones, like adding them in order.
    static #build<TElement>(elements: Iterable<TElement>, comparator: OrderComparator<TElement>): Tree<TElement, null> {
        const sorted = Array.from(elements).sort(comparator);
        const unique: Array<TElement> = [];
        for (const element of sorted) {
            if (unique.length === 0 || comparator(unique[unique.length - 1], element) !== 0) {
                unique.push(element);
            }
        }
        return fromSorted(unique, new Array<null>(unique.length).fill(null));
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (const node of nodes(this.#tree)) {
            yield node.key;
        }
    }

    /**
     * Adds the given element to this set.
     * @param element The element that will be added to this set.
     * @returns {ImmutableSortedSet} A new set with the added element.
     */
    public add(element: TElement): ImmutableSortedSet<TElement> {
        return this.#with(insert(this.#tree, element, null, this.#comparator, false));
    }

    /**
     * Adds all elements from the provided collection to this set.
     * @param collection The collection whose element will be added to this set.
     * @returns {ImmutableSortedSet} A new set with the added elements.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        let tree = this.#tree;
        for (const element of collection) {
            tree = insert(tree, element, null, this.#comparator, false);
        }
        return this.#with(tree);
    }

    /**
     * Removes all elements from this set.
     * @returns {ImmutableSortedSet} An empty set.
     */
    public clear(): ImmutableSortedSet<TElement> {
        return this.#with(null);
    }

    public override contains(element: TElement): boolean {
        return find(this.#tree, element, this.#comparator) !== null;
    }

    public exceptWith(other: Iterable<TElement>): ImmutableSortedSet<TElement> {
        return this.removeAll(other);
    }


    /**
     * Returns the first n elements of this set.
     * @param toElement The element up to which the elements will be included.
     * @param inclusive If true, the element toElement will be included; otherwise, it will be excluded.
     * @returns {ImmutableSortedSet} A new set that contains the first n elements of this set.
     */
    public headSet(toElement: TElement, inclusive: boolean = false): ImmutableSortedSet<TElement> {
        const head: Array<TElement> = [];
        for (const node of nodes(this.#tree)) {
            const order = this.#comparator(node.key, toElement);
            if (order > 0 || (order === 0 && !inclusive)) {
                break;
            }
            head.push(node.key);
        }
        return this.#fromSorted(head);
    }

    /**
     * Returns a new set that contains elements that are in both this set and the provided collection.
     * @param other The collection whose elements will be intersected with this set.
     * @returns {ImmutableSortedSet} A new set that contains elements that are in both this set and the provided collection.
     */
    public intersectWith(other: Iterable<TElement>): ImmutableSortedSet<TElement> {
        return this.retainAll(other);
    }

    public isProperSubsetOf(other: Iterable<TElement>): boolean {
        return this.#sortedView().isProperSubsetOf(other);
    }

    public isProperSupersetOf(other: Iterable<TElement>): boolean {
        return this.#sortedView().isProperSupersetOf(other);
    }

    public isSubsetOf(other: Iterable<TElement>): boolean {
        return this.#sortedView().isSubsetOf(other);
    }

    public isSupersetOf(other: Iterable<TElement>): boolean {
        return this.#sortedView().isSupersetOf(other);
    }

    public overlaps(other: Iterable<TElement>): boolean {
        return this.#sortedView().overlaps(other);
    }


    /**
     * Removes the given element from this set.
     * @param element The element that will be removed from this set.
     * @returns {ImmutableSortedSet} A new set with the removed element.
     */
    public remove(element: TElement): ImmutableSortedSet<TElement> {
        return this.#with(remove(this.#tree, element, this.#comparator));
    }

    /**
     * Removes all elements from this set that are contained in the specified collection.
     * @param collection The collection whose elements will be removed from this set.
     * @returns {ImmutableSortedSet} A new set without the elements in the specified collection.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        let tree = this.#tree;
        for (const element of collection) {
            tree = remove(tree, element, this.#comparator);
        }
        return this.#with(tree);
    }

    /**
     * Removes all elements from this set that satisfy the specified predicate.
     * @param predicate The predicate that will be used to remove elements from this set.
     * @returns {ImmutableSortedSet} A new set without the elements that satisfy the predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableSortedSet<TElement> {
        const kept: Array<TElement> = [];
        for (const node of nodes(this.#tree)) {
            if (!predicate(node.key)) {
                kept.push(node.key);
            }
        }
        return kept.length === this.size() ? this : this.#fromSorted(kept);
    }

    /**
     * Replaces all elements in this set with the elements from the provided collection.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableSortedSet} A new set containing only the elements from the provided collection.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        if (collection === this) {
            return this;
        }
        return ImmutableSortedSet.create<TElement>(collection, this.#comparator);
    }

    /**
     * Removes all elements from this set except the ones that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this set.
     * @returns {ImmutableSortedSet} A new set with only the elements in the specified collection.
     */
    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        const retained = ImmutableSortedSet.#build<TElement>(collection, this.#comparator);
        return this.removeIf(element => find(retained, element, this.#comparator) === null);
    }

    public size(): number {
        return this.#tree === null ? 0 : this.#tree.size;
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
        const sub: Array<TElement> = [];
        for (const node of nodes(this.#tree, { key: fromElement, inclusive: fromInclusive, comparator: this.#comparator })) {
            const order = this.#comparator(node.key, toElement);
            if (order > 0 || (order === 0 && !toInclusive)) {
                break;
            }
            sub.push(node.key);
        }
        return this.#fromSorted(sub);
    }

    /**
     * Returns a new set that contains elements that are greater than or equal to the specified element.
     * @param fromElement The element from which the range will start.
     * @param inclusive If true, the element fromElement will be included; otherwise, it will be excluded.
     * @returns {ImmutableSortedSet} A new set that contains elements that are greater than or equal to the specified element.
     */
    public tailSet(fromElement: TElement, inclusive: boolean = false): ImmutableSortedSet<TElement> {
        const tail: Array<TElement> = [];
        for (const node of nodes(this.#tree, { key: fromElement, inclusive, comparator: this.#comparator })) {
            tail.push(node.key);
        }
        return this.#fromSorted(tail);
    }

    #fromSorted(elements: Array<TElement>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(fromSorted(elements, new Array<null>(elements.length).fill(null)), this.#comparator);
    }

    // Built on first use for the subset queries; the tree never changes, so the view stays valid.
    #sortedView(): SortedSet<TElement> {
        return this.#view ??= new SortedSet(this, this.#comparator);
    }

    #with(tree: Tree<TElement, null>): ImmutableSortedSet<TElement> {
        return tree === this.#tree ? this : new ImmutableSortedSet(tree, this.#comparator);
    }

    public override get comparator(): OrderComparator<TElement> {
        return this.#comparator;
    }

    public override get length(): number {
        return this.size();
    }
}

registerImmutableSortedSetFactory(<TElement>(iterable: Iterable<TElement>, comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> => {
    return ImmutableSortedSet.create(iterable, comparator);
});
