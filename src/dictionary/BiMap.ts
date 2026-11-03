import { from } from "../enumerator/functions/from";
import { EnumerableSet } from "../set/EnumerableSet";
import { Comparators } from "../shared/Comparators";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { isDefaultEquality } from "../shared/internal/membership";
import { KeyNotFoundException } from "../shared/KeyNotFoundException";
import { AbstractDictionary } from "./AbstractDictionary";
import { KeyValuePair } from "./KeyValuePair";
import type { ISet } from "../set/ISet";
import type { IImmutableCollection } from "../core/IImmutableCollection";

/**
 * A dictionary whose values are unique as well as its keys, so it can be looked up in both
 * directions in O(1) time.
 * @template TKey The type of the keys. Keys are hashed like the keys of a Map.
 * @template TValue The type of the values. Values are hashed like the keys of a Map.
 * @remarks Adding a value that is already mapped to another key throws, so a key and a value always map to each other. Use {@link forcePut} to replace the existing mapping instead. {@link inverse} returns a view with keys and values swapped that shares this map's entries.
 */
export class BiMap<TKey, TValue> extends AbstractDictionary<TKey, TValue> {
    #backward: Map<TValue, TKey> = new Map<TValue, TKey>();
    #forward: Map<TKey, TValue> = new Map<TKey, TValue>();
    #inverse: BiMap<TValue, TKey> | null = null;

    public constructor();
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>>);
    public constructor(iterable: Iterable<[TKey, TValue]>);
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]>);
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]> = [] as Array<KeyValuePair<TKey, TValue>>) {
        super(
            Comparators.equalityComparator,
            (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => Comparators.equalityComparator(p1.key, p2.key) && Comparators.equalityComparator(p1.value, p2.value)
        );
        for (const pair of iterable) {
            if (pair instanceof KeyValuePair) {
                this.add(pair.key, pair.value);
            } else {
                this.add(pair[0], pair[1]);
            }
        }
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        for (const [key, value] of this.#forward) {
            yield new KeyValuePair(key, value);
        }
    }

    /**
     * Adds a key and its value.
     * @param key The key to add.
     * @param value The value to add.
     * @returns The added value.
     * @throws {InvalidArgumentException} If the key or the value is already in the map.
     */
    public add(key: TKey, value: TValue): TValue {
        if (this.#forward.has(key)) {
            throw new InvalidArgumentException(`Key already exists: ${key}`);
        }
        this.#checkValueFree(value);
        this.#forward.set(key, value);
        this.#backward.set(value, key);
        return value;
    }

    public clear(): void {
        this.#forward.clear();
        this.#backward.clear();
    }

    public override containsKey(key: TKey): boolean {
        return this.#forward.has(key);
    }

    public override containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean {
        if (comparator == null || isDefaultEquality(comparator)) {
            return this.#backward.has(value);
        }
        return from(this.#backward.keys()).any(v => comparator(v, value));
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        yield* this.#forward;
    }

    /**
     * Maps a key to a value, removing any existing mapping of either of them first.
     * @param key The key to map.
     * @param value The value to map it to. If another key maps to it, that key is removed.
     * @returns {TValue | null} The key's previous value, or null if the key was not in the map.
     */
    public forcePut(key: TKey, value: TValue): TValue | null {
        const oldValue = this.remove(key);
        this.removeValue(value);
        this.#forward.set(key, value);
        this.#backward.set(value, key);
        return oldValue;
    }

    public get(key: TKey): TValue | null {
        return this.#forward.has(key) ? this.#forward.get(key) as TValue : null;
    }

    /**
     * Returns the key that maps to a value.
     * @param value The value whose key is returned.
     * @returns {TKey | null} The key, or null if no key maps to the value.
     */
    public getKey(value: TValue): TKey | null {
        return this.#backward.has(value) ? this.#backward.get(value) as TKey : null;
    }

    /**
     * Returns a view of this map with keys and values swapped. Changes to either map show in the other.
     * @returns {BiMap<TValue, TKey>} The inverse view.
     */
    public inverse(): BiMap<TValue, TKey> {
        if (this.#inverse == null) {
            const inverse = new BiMap<TValue, TKey>();
            inverse.#forward = this.#backward;
            inverse.#backward = this.#forward;
            inverse.#inverse = this;
            this.#inverse = inverse;
        }
        return this.#inverse;
    }

    public keys(): ISet<TKey> {
        return new EnumerableSet<TKey>(this.#forward.keys());
    }

    public remove(key: TKey): TValue | null {
        if (!this.#forward.has(key)) {
            return null;
        }
        const value = this.#forward.get(key) as TValue;
        this.#forward.delete(key);
        this.#backward.delete(value);
        return value;
    }

    /**
     * Removes a value and the key that maps to it.
     * @param value The value to remove.
     * @returns {TKey | null} The removed key, or null if no key maps to the value.
     */
    public removeValue(value: TValue): TKey | null {
        if (!this.#backward.has(value)) {
            return null;
        }
        const key = this.#backward.get(value) as TKey;
        this.#backward.delete(value);
        this.#forward.delete(key);
        return key;
    }

    /**
     * Sets the value of a key.
     * @param key The key whose value is set.
     * @param value The new value.
     * @throws {KeyNotFoundException} If the key is not in the map.
     * @throws {InvalidArgumentException} If another key already maps to the value.
     */
    public set(key: TKey, value: TValue): void {
        if (!this.#forward.has(key)) {
            throw new KeyNotFoundException(String(key));
        }
        const oldValue = this.#forward.get(key) as TValue;
        // Compared as the maps compare, so that 0 and -0 are the same value.
        const sameValue = oldValue === value || (oldValue !== oldValue && value !== value);
        if (!sameValue) {
            this.#checkValueFree(value);
        }
        this.#backward.delete(oldValue);
        this.#forward.set(key, value);
        this.#backward.set(value, key);
    }

    public size(): number {
        return this.#forward.size;
    }

    public values(): IImmutableCollection<TValue> {
        return from(this.#forward.values()).toImmutableList(this.valueComparer);
    }

    #checkValueFree(value: TValue): void {
        if (this.#backward.has(value)) {
            throw new InvalidArgumentException(`Value already exists: ${value}`);
        }
    }

    public override get length(): number {
        return this.#forward.size;
    }
}
