import { select } from "../enumerator/functions/select";
import { EnumerableSet } from "../set/EnumerableSet";
import { Comparators } from "../shared/Comparators";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { KeyNotFoundException } from "../shared/KeyNotFoundException";
import { AbstractDictionary } from "./AbstractDictionary";
import { KeyValuePair } from "./KeyValuePair";
import type { ISet } from "../set/ISet";
import type { IImmutableCollection } from "../core/IImmutableCollection";

/**
 * A dictionary with a maximum capacity that evicts its least recently used entries when a new key
 * would exceed that capacity or when {@link setCapacity} lowers it below the current size.
 * @template TKey The type of the keys. Keys are hashed like the keys of a Map.
 * @template TValue The type of the values.
 * @remarks Reading a value with {@link get} and writing one with `add`, `put` or {@link set} make its key the most recently used. {@link peek}, `containsKey` and enumeration do not. Entries are enumerated from the least to the most recently used, from a snapshot taken when enumeration starts, so reading values while enumerating is safe.
 */
export class LruCache<TKey, TValue> extends AbstractDictionary<TKey, TValue> {
    readonly #cache: Map<TKey, KeyValuePair<TKey, TValue>> = new Map<TKey, KeyValuePair<TKey, TValue>>();
    readonly #onEvict: ((key: TKey, value: TValue) => void) | null;
    #capacity: number;

    /**
     * Creates an LRU cache.
     * @param capacity The maximum number of entries. Must be a positive integer.
     * @param onEvict Optional callback that receives each entry the cache evicts, either to make room for a new key or because {@link setCapacity} lowered the capacity. It runs after the evicted entries have left the cache, least recently used first. If it throws, the entries evicted by the same operation that it has not yet received are not reported. It is not called for entries removed with `remove` or `clear`.
     * @param valueComparator Optional comparator for the values.
     * @throws {InvalidArgumentException} If {@link capacity} is not a positive integer.
     */
    public constructor(capacity: number, onEvict?: (key: TKey, value: TValue) => void, valueComparator?: EqualityComparator<TValue>) {
        super(
            valueComparator ?? Comparators.equalityComparator,
            (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => Comparators.equalityComparator(p1.key, p2.key) && (valueComparator ?? Comparators.equalityComparator)(p1.value, p2.value)
        );
        LruCache.#assertCapacity(capacity);
        this.#capacity = capacity;
        this.#onEvict = onEvict ?? null;
    }

    [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        return Array.from(this.#cache.values())[Symbol.iterator]();
    }

    public add(key: TKey, value: TValue): TValue {
        if (this.#cache.has(key)) {
            throw new InvalidArgumentException(`Key already exists: ${key}`);
        }
        this.#cache.set(key, new KeyValuePair(key, value));
        this.#evict();
        return value;
    }

    public clear(): void {
        this.#cache.clear();
    }

    public override containsKey(key: TKey): boolean {
        return this.#cache.has(key);
    }

    public override containsValue(value: TValue, comparator: EqualityComparator<TValue> = Comparators.equalityComparator): boolean {
        for (const pair of this.#cache.values()) {
            if (comparator(pair.value, value)) {
                return true;
            }
        }
        return false;
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        for (const pair of Array.from(this.#cache.values())) {
            yield [pair.key, pair.value];
        }
    }

    /**
     * Returns the value of a key and makes the key the most recently used.
     * @param key The key whose value is returned.
     * @returns {TValue | null} The value, or null if the key is not in the cache.
     */
    public get(key: TKey): TValue | null {
        const pair = this.#cache.get(key);
        if (pair == null) {
            return null;
        }
        this.#cache.delete(key);
        this.#cache.set(key, pair);
        return pair.value;
    }

    public keys(): ISet<TKey> {
        return new EnumerableSet<TKey>(this.#cache.keys());
    }

    /**
     * Returns the value of a key without changing how recently it was used.
     * @param key The key whose value is returned.
     * @returns {TValue | null} The value, or null if the key is not in the cache.
     */
    public peek(key: TKey): TValue | null {
        return this.#cache.get(key)?.value ?? null;
    }

    public remove(key: TKey): TValue | null {
        const pair = this.#cache.get(key);
        if (pair == null) {
            return null;
        }
        this.#cache.delete(key);
        return pair.value;
    }

    /**
     * Sets the value of a key and makes the key the most recently used.
     * @param key The key whose value is set.
     * @param value The new value.
     * @throws {KeyNotFoundException} If the key is not in the cache.
     */
    public set(key: TKey, value: TValue): void {
        if (!this.#cache.delete(key)) {
            throw new KeyNotFoundException(String(key));
        }
        this.#cache.set(key, new KeyValuePair(key, value));
    }

    /**
     * Changes the capacity of the cache. If the new capacity is below the current size, the least recently used entries are evicted until the cache fits.
     * @param capacity The new maximum number of entries. Must be a positive integer.
     * @throws {InvalidArgumentException} If {@link capacity} is not a positive integer. The cache is left unchanged.
     */
    public setCapacity(capacity: number): void {
        LruCache.#assertCapacity(capacity);
        this.#capacity = capacity;
        this.#evict();
    }

    public size(): number {
        return this.#cache.size;
    }

    public values(): IImmutableCollection<TValue> {
        return select(this.#cache.values(), x => x.value).toImmutableList(this.valueComparer);
    }

    static #assertCapacity(capacity: number): void {
        if (!Number.isInteger(capacity) || capacity < 1) {
            throw new InvalidArgumentException(`Expected a positive integer, but got ${capacity}.`, "capacity");
        }
    }

    #evict(): void {
        const evicted: KeyValuePair<TKey, TValue>[] = [];
        for (const [key, pair] of this.#cache) {
            if (this.#cache.size <= this.#capacity) {
                break;
            }
            this.#cache.delete(key);
            evicted.push(pair);
        }
        for (const pair of evicted) {
            this.#onEvict?.(pair.key, pair.value);
        }
    }

    /**
     * The maximum number of entries the cache holds.
     */
    public get capacity(): number {
        return this.#capacity;
    }

    public override get length(): number {
        return this.#cache.size;
    }
}
