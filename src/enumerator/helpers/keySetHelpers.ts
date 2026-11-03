import type { EqualityComparator } from "../../shared/EqualityComparator";
import { identityKey, isDefaultEquality } from "../../shared/internal/membership";
import type { OrderComparator } from "../../shared/OrderComparator";

type SortedKeys<TKey> = {
    add(key: TKey): boolean;
    contains(key: TKey): boolean;
    remove(key: TKey): boolean;
    size(): number;
};

export type SortedKeysFactory = <TKey>(comparator: OrderComparator<TKey>) => SortedKeys<TKey>;

/**
 * The keys seen by except, intersect, distinct and union, compared with their key comparator.
 * The default comparator hashes the keys. An order comparator keeps them in a sorted set, and any
 * other comparator scans them. Which of the two applies is found by comparing the first key with
 * itself, so neither sequence has to be read ahead.
 */
export class KeySet<TKey> {
    readonly #comparator: EqualityComparator<TKey> | OrderComparator<TKey>;
    readonly #createSorted: SortedKeysFactory;
    readonly #hashed: Set<unknown> | null;
    #scanned: TKey[] | null = null;
    #sorted: SortedKeys<TKey> | null = null;

    public constructor(comparator: EqualityComparator<TKey> | OrderComparator<TKey>, createSorted: SortedKeysFactory) {
        this.#comparator = comparator;
        this.#createSorted = createSorted;
        this.#hashed = isDefaultEquality(comparator) ? new Set() : null;
    }

    // Adds the key and returns true, or returns false when an equal key is already present.
    public add(key: TKey): boolean {
        if (this.#hashed) {
            const hash = identityKey(key);
            if (this.#hashed.has(hash)) {
                return false;
            }
            this.#hashed.add(hash);
            return true;
        }
        const sorted = this.#sortedFor(key);
        if (sorted) {
            return sorted.add(key);
        }
        const scanned = this.#scanned!;
        if (this.#indexOf(scanned, key) !== -1) {
            return false;
        }
        scanned.push(key);
        return true;
    }

    // Removes the first equal key and returns true, or returns false when there is none.
    public delete(key: TKey): boolean {
        if (this.#hashed) {
            return this.#hashed.delete(identityKey(key));
        }
        const sorted = this.#sortedFor(key);
        if (sorted) {
            return sorted.remove(key);
        }
        const scanned = this.#scanned!;
        const index = this.#indexOf(scanned, key);
        if (index === -1) {
            return false;
        }
        scanned.splice(index, 1);
        return true;
    }

    public get size(): number {
        return this.#hashed?.size ?? this.#sorted?.size() ?? this.#scanned?.length ?? 0;
    }

    // Keys are compared as comparator(key, stored key), the order the earlier List.contains used.
    #indexOf(scanned: TKey[], key: TKey): number {
        const comparator = this.#comparator as EqualityComparator<TKey>;
        for (let index = 0; index < scanned.length; ++index) {
            if (comparator(key, scanned[index])) {
                return index;
            }
        }
        return -1;
    }

    #sortedFor(key: TKey): SortedKeys<TKey> | null {
        if (!this.#sorted && !this.#scanned) {
            if (typeof this.#comparator(key, key) === "number") {
                this.#sorted = this.#createSorted(this.#comparator as OrderComparator<TKey>);
            } else {
                this.#scanned = [];
            }
        }
        return this.#sorted;
    }
}
