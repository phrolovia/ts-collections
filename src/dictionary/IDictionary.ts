import type { IReadonlyDictionary } from "./IReadonlyDictionary";

export interface IDictionary<TKey, TValue> extends IReadonlyDictionary<TKey, TValue> {

    /**
     * Adds the specified key and value to the dictionary.
     * @param key The key of the element to add.
     * @param value The value of the element to add. It can be <code>null</code>.
     * @returns The added value.
     * @throws {InvalidArgumentException} If the key already exists in the dictionary.
     */
    add(key: TKey, value: TValue): TValue;

    /**
     * Removes all elements from this dictionary.
     */
    clear(): void;

    /**
     * Adds a value to the dictionary.
     * If the key already exists, the value associated with the key will be replaced by the new value.
     * @param key The key of the element to add or update.
     * @param value The value which will be added or updated.
     * @returns The old value of the key, or null if there was no mapping for the key.
     * @throws {Error} If the key is null
     */
    put(key: TKey, value: TValue): void;

    /**
     * Removes the specified key and its associated value from this dictionary.
     * @param key They key whose itself and its associated value will be removed from the dictionary.
     * @returns The removed value or null if the key does not exist in the dictionary.
     */
    remove(key: TKey): TValue | null;

    /**
     * Sets the value of the given key.
     * @param key The key whose value will be set.
     * @param value The new value of the key
     * @throws {KeyNotFoundException} If the key does not exist in the dictionary.
     */
    set(key: TKey, value: TValue): void;

    /**
     * Attempts to add the specified key and value to the dictionary. Unlike `add` method,
     * it will not throw an error if key already exists.
     * @param key The key of the element to add.
     * @param value The value of the element to add. It can be <code>null</code>.
     * @returns {boolean} true if key-value pair is added; false otherwise.
     */
    tryAdd(key: TKey, value: TValue): boolean;
}
