import { hashKey } from "./hashKey";
import { type BitmapNode, emptyRoot, find, lastChange, remove, TrieEntry, type TrieOwner, upsert } from "./HashTrie";
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
 *
 * {@link asMutable} returns a copy that `set` and `remove` modify in place and return,
 * which avoids copying nodes during bulk changes. {@link asImmutable} freezes it again.
 */
export class OrderedHashTrie<TKey, TValue> {
    static readonly #empty = new OrderedHashTrie<never, never>(emptyRoot(), PersistentVector.empty(), 0, undefined);

    #order: PersistentVector<TrieEntry<TKey, TValue> | undefined>;
    #owner: TrieOwner | undefined;
    #root: BitmapNode<TKey, TValue>;
    #size: number;

    private constructor(
        root: BitmapNode<TKey, TValue>,
        order: PersistentVector<TrieEntry<TKey, TValue> | undefined>,
        size: number,
        owner: TrieOwner | undefined
    ) {
        this.#root = root;
        this.#order = order;
        this.#size = size;
        this.#owner = owner;
    }

    public static empty<TKey, TValue>(): OrderedHashTrie<TKey, TValue> {
        return OrderedHashTrie.#empty;
    }

    * [Symbol.iterator](): Iterator<TrieEntry<TKey, TValue>> {
        for (const leaf of this.#order.leaves()) {
            for (let index = 0; index < leaf.length; ++index) {
                const entry = leaf[index];
                if (entry !== undefined) {
                    yield entry;
                }
            }
        }
    }

    /**
     * Freezes a mutable trie and returns it. The trie must not be modified afterwards.
     */
    public asImmutable(): OrderedHashTrie<TKey, TValue> {
        if (this.#owner !== undefined) {
            this.#owner = undefined;
            this.#order = this.#order.asImmutable();
        }
        return this;
    }

    public asMutable(): OrderedHashTrie<TKey, TValue> {
        return new OrderedHashTrie(this.#root, this.#order.asMutable(), this.#size, {});
    }

    public find(key: TKey): TrieEntry<TKey, TValue> | undefined {
        return find(this.#root, hashKey(key), key);
    }

    public remove(key: TKey): OrderedHashTrie<TKey, TValue> {
        const root = remove(this.#root, hashKey(key), key, this.#owner);
        const removed = lastChange.previous;
        if (removed === undefined) {
            return this;
        }
        const size = this.#size - 1;
        if (size === 0 && this.#owner === undefined) {
            return OrderedHashTrie.#empty;
        }
        const order = this.#order.set(removed.index, undefined);
        if (order.size >= MIN_COMPACTION_SIZE && order.size - size > size) {
            return this.#compact(order);
        }
        return this.#update(root, order, size);
    }

    /**
     * Maps the key to the value. Returns the same trie if the key is already mapped to
     * that exact value.
     */
    public set(key: TKey, value: TValue): OrderedHashTrie<TKey, TValue> {
        const root = upsert(this.#root, hashKey(key), key, value, this.#order.size, this.#owner);
        const entry = lastChange.entry as TrieEntry<TKey, TValue> | undefined;
        if (entry === undefined) {
            return this;
        }
        return lastChange.previous === undefined
            ? this.#update(root, this.#order.push(entry), this.#size + 1)
            : this.#update(root, this.#order.set(entry.index, entry), this.#size);
    }

    // Entries carry their vector index, so both structures are rebuilt with fresh indices.
    #compact(order: PersistentVector<TrieEntry<TKey, TValue> | undefined>): OrderedHashTrie<TKey, TValue> {
        const compacted = OrderedHashTrie.#empty.asMutable() as OrderedHashTrie<TKey, TValue>;
        for (const leaf of order.leaves()) {
            for (const entry of leaf) {
                if (entry !== undefined) {
                    compacted.set(entry.key, entry.value);
                }
            }
        }
        if (this.#owner === undefined) {
            return compacted.asImmutable();
        }
        // The compacted copy is discarded, so this trie can take over its nodes and edit token.
        this.#owner = compacted.#owner;
        return this.#update(compacted.#root, compacted.#order, compacted.#size);
    }

    #update(
        root: BitmapNode<TKey, TValue>,
        order: PersistentVector<TrieEntry<TKey, TValue> | undefined>,
        size: number
    ): OrderedHashTrie<TKey, TValue> {
        if (this.#owner === undefined) {
            return new OrderedHashTrie(root, order, size, undefined);
        }
        this.#root = root;
        this.#order = order;
        this.#size = size;
        return this;
    }

    public get size(): number {
        return this.#size;
    }
}
