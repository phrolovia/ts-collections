import type { Dictionary } from "./Dictionary";
import { Comparators } from "../shared/Comparators";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { KeyNotFoundException } from "../shared/KeyNotFoundException";
import { AbstractImmutableDictionary } from "./AbstractImmutableDictionary";
import { KeyValuePair } from "./KeyValuePair";
import type { ISet } from "../set/ISet";
import { EnumerableSet } from "../set/EnumerableSet";
import { select } from "../enumerator/functions/select";
import { registerImmutableDictionaryFactory } from "../enumerator/Enumerator";
import type { IImmutableCollection } from "../core/IImmutableCollection";
import { OrderedHashTrie } from "./internal/OrderedHashTrie";

/**
 * Immutable dictionary backed by a persistent hash array mapped trie.
 * `add`, `put`, `remove` and `set` share structure with the original dictionary and run in
 * O(log32 n) instead of copying it. Iteration follows insertion order, like {@link Dictionary}.
 */
export class ImmutableDictionary<TKey, TValue> extends AbstractImmutableDictionary<TKey, TValue> {
    readonly #trie: OrderedHashTrie<TKey, TValue>;

    private constructor(
        trie: OrderedHashTrie<TKey, TValue>,
        valueComparator: EqualityComparator<TValue>,
        keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>
    ) {
        super(valueComparator, keyValueComparator);
        this.#trie = trie;
    }

    public static create<TKey, TValue>(): ImmutableDictionary<TKey, TValue>;
    public static create<TKey, TValue>(iterable: Iterable<KeyValuePair<TKey, TValue>>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;
    public static create<TKey, TValue>(iterable: Iterable<[TKey, TValue]>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;
    public static create<TKey, TValue>(iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;
    public static create<TKey, TValue>(
        iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]> = [] as Array<KeyValuePair<TKey, TValue>>,
        valueComparator?: EqualityComparator<TValue>
    ): ImmutableDictionary<TKey, TValue> {
        const comparator = valueComparator ?? Comparators.equalityComparator;
        let trie = OrderedHashTrie.empty<TKey, TValue>();
        for (const pair of iterable) {
            const [key, value] = pair instanceof KeyValuePair ? [pair.key, pair.value] : pair;
            if (trie.find(key) !== undefined) {
                throw new InvalidArgumentException(`Key already exists: ${String(key)}`);
            }
            trie = trie.set(key, value);
        }
        return new ImmutableDictionary(
            trie,
            comparator,
            (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => Comparators.equalityComparator(p1.key, p2.key) && comparator(p1.value, p2.value)
        );
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        for (const entry of this.#trie) {
            yield new KeyValuePair(entry.key, entry.value);
        }
    }

    public add(key: TKey, value: TValue): ImmutableDictionary<TKey, TValue> {
        if (this.containsKey(key)) {
            throw new InvalidArgumentException(`Key already exists: ${String(key)}`);
        }
        return this.#withTrie(this.#trie.set(key, value));
    }

    public override clear(): ImmutableDictionary<TKey, TValue> {
        return this.#withTrie(OrderedHashTrie.empty());
    }

    public containsKey(key: TKey): boolean {
        return this.#trie.find(key) !== undefined;
    }

    public containsValue(value: TValue, comparator: EqualityComparator<TValue> = Comparators.equalityComparator): boolean {
        for (const entry of this.#trie) {
            if (comparator(entry.value, value)) {
                return true;
            }
        }
        return false;
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        for (const entry of this.#trie) {
            yield [entry.key, entry.value];
        }
    }

    public get(key: TKey): TValue | null {
        const entry = this.#trie.find(key);
        return entry === undefined ? null : entry.value;
    }

    public keys(): ISet<TKey> {
        return new EnumerableSet<TKey>(select(this.#trie, e => e.key));
    }

    public override put(key: TKey, value: TValue): ImmutableDictionary<TKey, TValue> {
        return this.#withTrie(this.#trie.set(key, value));
    }

    public override remove(key: TKey): ImmutableDictionary<TKey, TValue> {
        return this.#withTrie(this.#trie.remove(key));
    }

    public override set(key: TKey, value: TValue): ImmutableDictionary<TKey, TValue> {
        if (!this.containsKey(key)) {
            throw new KeyNotFoundException(String(key));
        }
        return this.#withTrie(this.#trie.set(key, value));
    }

    public override size(): number {
        return this.#trie.size;
    }

    public values(): IImmutableCollection<TValue> {
        return select(this.#trie, e => e.value).toImmutableList(this.valueComparator);
    }

    // Returns this dictionary when an operation left the trie unchanged.
    #withTrie(trie: OrderedHashTrie<TKey, TValue>): ImmutableDictionary<TKey, TValue> {
        return trie === this.#trie ? this : new ImmutableDictionary(trie, this.valueComparator, this.keyValueComparator);
    }

    public override get length(): number {
        return this.#trie.size;
    }
}

registerImmutableDictionaryFactory(<TKey, TValue>(dictionary: Dictionary<TKey, TValue>): ImmutableDictionary<TKey, TValue> => {
    return ImmutableDictionary.create<TKey, TValue>(dictionary, dictionary.valueComparator);
});
