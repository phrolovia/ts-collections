import {ICollection, IEnumerable, ISet, KeyValuePair} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Selector} from "../shared/Selector";

export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {

    /**
     * Returns the number of elements in this dictionary.
     */
    readonly length: number;

    /**
     * Adds the specified key and value to the dictionary.
     * @param key The key of the element to add.
     * @param value The value of the element to add. It can be <code>null</code>.
     * @returns The added value.
     * @throws If the key is null or already exists.
     */
    add(key: TKey, value: TValue): TValue;

    /**
     * Removes all elements from this dictionary.
     */
    clear(): void;

    /**
     * Checks whether this dictionary contains the specified key.
     * @param key The key to locate in this dictionary.
     * @returns {boolean} true if this dictionary contains an element with the specified key; false otherwise.
     */
    containsKey(key: TKey): boolean;

    /**
     * Checks whether this dictionary contains the specified value.
     * @param value The key to locate in this dictionary.
     * @param comparator The comparator function which will be used to compare the equality of the values.
     * @returns {boolean} true if this dictionary contains an element with the specified value; false otherwise.
     */
    containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean;

    /**
     * Returns an IterableIterator that yields a tuple of [key, value].
     */
    entries(): IterableIterator<[TKey, TValue]>;

    /**
     * Returns the value associated with the given key.
     * @param key The key whose associated value will be returned
     * @returns The associated value of the key. If key does not exist, it will return null.
     */
    get(key: TKey): TValue;

    /**
     * Checks if the dictionary is empty or not.
     * @returns {boolean} true if the dictionary is empty; false otherwise.
     */
    isEmpty(): boolean;

    /**
     * Returns a set of keys of this dictionary.
     * @returns {ISet} A set of keys of this dictionary.
     */
    keys(): ISet<TKey>;

    /**
     * Adds a value to the dictionary.
     * If the key already exists, the value associated with the key will be replaced by the new value.
     * @param key The key of the element to add or update.
     * @param value The value which will be added or updated.
     * @returns The old value of the key, or null if there was no mapping for the key.
     * @throws If the key is null
     */
    put(key: TKey, value: TValue): void;

    /**
     * Removes the specified key and its associated value from this dictionary.
     * @param key They key whose itself and its associated value will be removed from the dictionary.
     * @returns The removed value or null if the key does not exist in the dictionary.
     */
    remove(key: TKey): TValue;

    /**
     * Sets the value of the given key.
     * @param key The key whose value will be set.
     * @param value The new value of the key
     * @throws If the key does not exist in the dictionary.
     */
    set(key: TKey, value: TValue): void;

    /**
     * Returns the number of elements in this dictionary.
     */
    size(): number;

    /**
     * Returns a string representation of this dictionary.
     */
    toString(): string;

    /**
     * Returns a string representation of this dictionary.
     * @param selector The selector that will be used to select the property that will be used to generate the string representation of this dictionary.
     */
    toString(selector?: Selector<KeyValuePair<TKey, TValue>, string>): string;

    /**
     * Attempts to add the specified key and value to the dictionary. Unlike `add` method,
     * it will not throw an error if key already exists.
     * @param key The key of the element to add.
     * @param value The value of the element to add. It can be <code>null</code>.
     * @returns {boolean} true if key-value pair is added; false otherwise.
     */
    tryAdd(key: TKey, value: TValue): boolean;

    /**
     * Returns a list of values of the dictionary.
     * @returns {ICollection} A collection of values of this dictionary.
     */
    values(): ICollection<TValue>;
}
