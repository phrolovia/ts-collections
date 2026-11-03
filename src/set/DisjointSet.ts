import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import { Enumerator } from "../enumerator/Enumerator";
import type { IEnumerable } from "../enumerator/IEnumerable";
import { NoSuchElementException } from "../shared/NoSuchElementException";

/**
 * Partitions elements into disjoint sets that can be merged, also known as union-find. It answers
 * whether two elements are in the same set in nearly constant time.
 * @template TElement The type of the elements. Elements are hashed like the values of a Set, so equal primitives are the same element and objects are compared by reference.
 * @remarks Every element starts in a set of its own, and {@link merge} merges two sets. Merging is by size with path halving, so a sequence of operations takes O(α(n)) amortised time each, where α grows so slowly that it is below 5 for any practical n. Elements cannot be removed or split off again. Enumerating yields the elements in the order they were added.
 */
export class DisjointSet<TElement> extends AbstractEnumerable<TElement> {
    readonly #elements: TElement[] = [];
    readonly #indexes: Map<TElement, number> = new Map<TElement, number>();
    readonly #parents: number[] = [];
    readonly #sizes: number[] = [];
    #setCount: number = 0;

    public constructor(iterable: Iterable<TElement> = []) {
        super();
        for (const element of iterable) {
            this.add(element);
        }
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.#elements[Symbol.iterator]();
    }

    /**
     * Adds an element in a set of its own.
     * @param element The element to add.
     * @returns {boolean} true if the element is added, false if it is already present.
     */
    public add(element: TElement): boolean {
        if (this.#indexes.has(element)) {
            return false;
        }
        this.#indexOf(element);
        return true;
    }

    /**
     * Removes every element.
     */
    public clear(): void {
        this.#elements.length = 0;
        this.#indexes.clear();
        this.#parents.length = 0;
        this.#sizes.length = 0;
        this.#setCount = 0;
    }

    /**
     * Checks whether two elements are in the same set.
     * @param first One element.
     * @param second The other element.
     * @returns {boolean} true if both elements are present and in the same set.
     */
    public connected(first: TElement, second: TElement): boolean {
        const firstIndex = this.#indexes.get(first);
        const secondIndex = this.#indexes.get(second);
        if (firstIndex == null || secondIndex == null) {
            return false;
        }
        return this.#root(firstIndex) === this.#root(secondIndex);
    }

    public override contains(element: TElement): boolean {
        return this.#indexes.has(element);
    }

    /**
     * Returns the representative of an element's set: the same element for every member of the set
     * until the set is merged with another.
     * @param element The element whose set's representative is returned.
     * @returns {TElement} The representative.
     * @throws {NoSuchElementException} If the element is not present.
     */
    public find(element: TElement): TElement {
        const index = this.#indexes.get(element);
        if (index == null) {
            throw new NoSuchElementException(`Element is not in the disjoint set: ${String(element)}`);
        }
        return this.#elements[this.#root(index)];
    }

    /**
     * Merges the sets of two elements, adding either element first if it is not present.
     * @param first One element.
     * @param second The other element.
     * @returns {boolean} true if two sets were merged, false if the elements were already in the same set.
     */
    public merge(first: TElement, second: TElement): boolean {
        let firstRoot = this.#root(this.#indexOf(first));
        let secondRoot = this.#root(this.#indexOf(second));
        if (firstRoot === secondRoot) {
            return false;
        }
        if (this.#sizes[firstRoot] < this.#sizes[secondRoot]) {
            [firstRoot, secondRoot] = [secondRoot, firstRoot];
        }
        this.#parents[secondRoot] = firstRoot;
        this.#sizes[firstRoot] += this.#sizes[secondRoot];
        --this.#setCount;
        return true;
    }

    /**
     * Returns the number of disjoint sets.
     * @returns {number} The number of sets the elements are partitioned into.
     */
    public setCount(): number {
        return this.#setCount;
    }

    /**
     * Returns the number of elements in an element's set.
     * @param element The element whose set is measured.
     * @returns {number} The size of the element's set, or 0 if the element is not present.
     */
    public setSize(element: TElement): number {
        const index = this.#indexes.get(element);
        return index == null ? 0 : this.#sizes[this.#root(index)];
    }

    /**
     * Returns a deferred sequence of the disjoint sets.
     * @returns {IEnumerable<TElement[]>} Every set once, as an array of its elements. The sets, and the elements within each set, are in the order the elements were added.
     */
    public sets(): IEnumerable<TElement[]> {
        return new Enumerator(() => {
            const sets = new Map<number, TElement[]>();
            for (let index = 0; index < this.#elements.length; ++index) {
                const root = this.#root(index);
                const members = sets.get(root);
                if (members) {
                    members.push(this.#elements[index]);
                } else {
                    sets.set(root, [this.#elements[index]]);
                }
            }
            return sets.values();
        });
    }

    /**
     * Returns the number of elements.
     * @returns {number} The number of elements across all sets.
     */
    public size(): number {
        return this.#elements.length;
    }

    // Returns the element's index, adding the element in a set of its own if it is not present.
    #indexOf(element: TElement): number {
        let index = this.#indexes.get(element);
        if (index == null) {
            index = this.#elements.length;
            this.#indexes.set(element, index);
            this.#elements.push(element);
            this.#parents.push(index);
            this.#sizes.push(1);
            ++this.#setCount;
        }
        return index;
    }

    #root(index: number): number {
        const parents = this.#parents;
        while (parents[index] !== index) {
            parents[index] = parents[parents[index]];
            index = parents[index];
        }
        return index;
    }

    public get length(): number {
        return this.#elements.length;
    }
}
