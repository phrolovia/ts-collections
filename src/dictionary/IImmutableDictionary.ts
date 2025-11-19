import type { IReadonlyDictionary } from "./IReadonlyDictionary";

export interface IImmutableDictionary<TKey, TValue> extends IReadonlyDictionary<TKey, TValue> {
    readonly length: number;

    /**
     * Adds the specified key and value to the dictionary.
     * @param key The key of the element to add.
     * @param value The value of the element to add.
     * @returns {IImmutableDictionary} A new dictionary with the added key-value pair.
     */
    add(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;

    /**
     * Removes all elements from this dictionary.
     * @returns {IImmutableDictionary} An empty dictionary.
     */
    clear(): IImmutableDictionary<TKey, TValue>;

    /**
     * Adds a value to the dictionary.
     * If the key already exists, the value associated with the key will be replaced by the new value.
     * @param key The key of the element to add or update.
     * @param value The value which will be added or updated.
     * @returns {IImmutableDictionary} A new dictionary with the added or updated key-value pair.
     */
    put(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;

    /**
     * Removes the specified key and its associated value from this dictionary.
     * @param key They key whose itself and its associated value will be removed from the dictionary.
     * @returns {IImmutableDictionary} A new dictionary without the specified key-value pair.
     */
    remove(key: TKey): IImmutableDictionary<TKey, TValue>;

    /**
     * Sets the value of the given key.
     * @param key The key whose value will be set.
     * @param value The new value of the key
     * @returns {IImmutableDictionary} A new dictionary with the updated value.
     */
    set(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;
}
