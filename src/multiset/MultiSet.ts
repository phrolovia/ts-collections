import { AbstractRandomAccessCollection } from "../core/AbstractRandomAccessCollection";
import { KeyValuePair } from "../dictionary/KeyValuePair";
import { Enumerator } from "../enumerator/Enumerator";
import type { IEnumerable } from "../enumerator/IEnumerable";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import type { Predicate } from "../shared/Predicate";

/**
 * A collection that counts how many times each element occurs, also known as a bag. Unlike a set,
 * it can hold an element more than once; unlike a list, adding, removing and counting an element
 * takes O(1) time.
 * @template TElement The type of the elements. Elements are hashed like the values of a Set, so equal primitives are the same element and objects are compared by reference.
 * @remarks Enumerating a multiset yields each element as many times as it occurs, with the occurrences of an element next to each other, in the order the elements were first added. {@link size} is the total number of occurrences.
 */
export class MultiSet<TElement> extends AbstractRandomAccessCollection<TElement> {
    readonly #counts: Map<TElement, number> = new Map<TElement, number>();
    #size: number = 0;

    public constructor(iterable: Iterable<TElement> = []) {
        super();
        for (const element of iterable) {
            this.add(element);
        }
    }

    /** @internal contains(element) hashes with SameValueZero, like a native Set. Read by shared/internal/collectionAccess. */
    protected get isHashedSetSource(): true {
        return true;
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (const [element, count] of this.#counts) {
            for (let i = 0; i < count; ++i) {
                yield element;
            }
        }
    }

    /**
     * Adds occurrences of an element.
     * @param element The element to add.
     * @param occurrences The number of occurrences to add. Defaults to 1.
     * @returns {boolean} true if the multiset changed, which is false only when {@link occurrences} is 0.
     * @throws {InvalidArgumentException} If {@link occurrences} is not a non-negative integer.
     */
    public add(element: TElement, occurrences: number = 1): boolean {
        MultiSet.#checkCount(occurrences, "occurrences");
        if (occurrences === 0) {
            return false;
        }
        this.#counts.set(element, (this.#counts.get(element) ?? 0) + occurrences);
        this.#size += occurrences;
        return true;
    }

    public clear(): void {
        this.#counts.clear();
        this.#size = 0;
    }

    public override contains(element: TElement): boolean {
        return this.#counts.has(element);
    }

    /**
     * Returns the number of distinct elements.
     * @returns {number} The number of elements that occur at least once.
     */
    public distinctCount(): number {
        return this.#counts.size;
    }

    /**
     * Returns a deferred sequence of the distinct elements and how many times each occurs.
     * @returns {IEnumerable<KeyValuePair<TElement, number>>} One pair per distinct element, in the order the elements were first added.
     */
    public entries(): IEnumerable<KeyValuePair<TElement, number>> {
        const counts = this.#counts;
        return new Enumerator(function* (): IterableIterator<KeyValuePair<TElement, number>> {
            for (const [element, count] of counts) {
                yield new KeyValuePair(element, count);
            }
        });
    }

    /**
     * Returns the most frequent elements and how many times each occurs.
     * @param count Optional number of elements to return. Without it, every distinct element is returned.
     * @returns {IEnumerable<KeyValuePair<TElement, number>>} Pairs ordered from the most to the least frequent element. Elements that occur equally often keep the order they were first added in.
     */
    public mostCommon(count?: number): IEnumerable<KeyValuePair<TElement, number>> {
        const ordered = this.entries().orderByDescending(pair => pair.value);
        return count == null ? ordered : ordered.take(count);
    }

    /**
     * Returns how many times an element occurs.
     * @param element The element to count.
     * @returns {number} The number of occurrences, or 0 if the element is not in the multiset.
     */
    public occurrences(element: TElement): number {
        return this.#counts.get(element) ?? 0;
    }

    /**
     * Removes occurrences of an element.
     * @param element The element to remove.
     * @param occurrences The number of occurrences to remove. Defaults to 1. If the element occurs fewer times, every occurrence is removed.
     * @returns {boolean} true if any occurrence was removed.
     * @throws {InvalidArgumentException} If {@link occurrences} is not a non-negative integer.
     */
    public remove(element: TElement, occurrences: number = 1): boolean {
        MultiSet.#checkCount(occurrences, "occurrences");
        const count = this.#counts.get(element);
        if (count == null || occurrences === 0) {
            return false;
        }
        this.#setCount(element, count, Math.max(0, count - occurrences));
        return true;
    }

    /**
     * Removes every occurrence of each element of the given collection.
     * @param collection The elements to remove.
     * @returns {boolean} true if the multiset changed.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        let changed = false;
        for (const element of collection) {
            changed = this.setOccurrences(element, 0) > 0 || changed;
        }
        return changed;
    }

    /**
     * Removes every occurrence of the elements that satisfy a predicate.
     * @param predicate The test, called once per distinct element.
     * @returns {boolean} true if the multiset changed.
     */
    public removeIf(predicate: Predicate<TElement>): boolean {
        let changed = false;
        for (const [element, count] of this.#counts) {
            if (predicate(element)) {
                this.#setCount(element, count, 0);
                changed = true;
            }
        }
        return changed;
    }

    /**
     * Sets how many times an element occurs.
     * @param element The element whose count is set.
     * @param occurrences The new number of occurrences. 0 removes the element.
     * @returns {number} The previous number of occurrences.
     * @throws {InvalidArgumentException} If {@link occurrences} is not a non-negative integer.
     */
    public setOccurrences(element: TElement, occurrences: number): number {
        MultiSet.#checkCount(occurrences, "occurrences");
        const count = this.#counts.get(element) ?? 0;
        this.#setCount(element, count, occurrences);
        return count;
    }

    public size(): number {
        return this.#size;
    }

    static #checkCount(count: number, argument: string): void {
        if (!Number.isInteger(count) || count < 0) {
            throw new InvalidArgumentException(`Expected a non-negative integer, but got ${count}.`, argument);
        }
    }

    #setCount(element: TElement, oldCount: number, newCount: number): void {
        if (newCount === 0) {
            this.#counts.delete(element);
        } else {
            this.#counts.set(element, newCount);
        }
        this.#size += newCount - oldCount;
    }

    public override get length(): number {
        return this.#size;
    }
}
