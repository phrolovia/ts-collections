import { hashKey } from "./hashKey";
import { type BitmapNode, emptyRoot, find, insert, remove, TrieEntry } from "./HashTrie";
import { PersistentVector } from "./PersistentVector";

// Below this many slots, removed slots are never compacted away.
const MIN_COMPACTION_SIZE = 32;

/**
 * Persistent hash map that iterates in insertion order, like `Map`.
 *
 * Keys live in a hash array mapped trie; a persistent vector records insertion order.
 * Updating an existing key keeps its position. Removing a key leaves an empty slot in the
 * vector, and the vector is rebuilt once empty slots outnumber entries, so iteration stays
 * O(n) and the rebuild cost is amortized over the removals that caused it.
 */
export class OrderedHashTrie<TKey, TValue> {
    static readonly #empty = new OrderedHashTrie<never, never>(emptyRoot(), PersistentVector.empty(), 0);

    readonly #order: PersistentVector<TrieEntry<TKey, TValue> | undefined>;
    readonly #root: BitmapNode<TKey, TValue>;
    readonly #size: number;

    private constructor(root: BitmapNode<TKey, TValue>, order: PersistentVector<TrieEntry<TKey, TValue> | undefined>, size: number) {
        this.#root = root;
        this.#order = order;
        this.#size = size;
    }

    public static empty<TKey, TValue>(): OrderedHashTrie<TKey, TValue> {
        return OrderedHashTrie.#empty;
    }

    * [Symbol.iterator](): Iterator<TrieEntry<TKey, TValue>> {
        for (const entry of this.#order) {
            if (entry !== undefined) {
                yield entry;
            }
        }
    }

    public find(key: TKey): TrieEntry<TKey, TValue> | undefined {
        return find(this.#root, hashKey(key), key);
    }

    public remove(key: TKey): OrderedHashTrie<TKey, TValue> {
        const hash = hashKey(key);
        const existing = find(this.#root, hash, key);
        if (existing === undefined) {
            return this;
        }
        const size = this.#size - 1;
        if (size === 0) {
            return OrderedHashTrie.#empty;
        }
        const order = this.#order.set(existing.index, undefined);
        if (order.size >= MIN_COMPACTION_SIZE && order.size - size > size) {
            return OrderedHashTrie.#compact(order);
        }
        return new OrderedHashTrie(remove(this.#root, hash, key), order, size);
    }

    /**
     * Returns a trie with the key mapped to the value. Returns the same trie if the key
     * is already mapped to that exact value.
     */
    public set(key: TKey, value: TValue): OrderedHashTrie<TKey, TValue> {
        const hash = hashKey(key);
        const existing = find(this.#root, hash, key);
        if (existing === undefined) {
            const entry = new TrieEntry(hash, key, value, this.#order.size);
            return new OrderedHashTrie(insert(this.#root, entry), this.#order.push(entry), this.#size + 1);
        }
        if (Object.is(existing.value, value)) {
            return this;
        }
        const entry = new TrieEntry(hash, key, value, existing.index);
        return new OrderedHashTrie(insert(this.#root, entry), this.#order.set(existing.index, entry), this.#size);
    }

    // Entries carry their vector index, so both structures are rebuilt with fresh indices.
    static #compact<TKey, TValue>(order: PersistentVector<TrieEntry<TKey, TValue> | undefined>): OrderedHashTrie<TKey, TValue> {
        let root = emptyRoot<TKey, TValue>();
        let compacted = PersistentVector.empty<TrieEntry<TKey, TValue> | undefined>();
        for (const entry of order) {
            if (entry !== undefined) {
                const moved = new TrieEntry(entry.hash, entry.key, entry.value, compacted.size);
                root = insert(root, moved);
                compacted = compacted.push(moved);
            }
        }
        return new OrderedHashTrie(root, compacted, compacted.size);
    }

    public get size(): number {
        return this.#size;
    }
}
