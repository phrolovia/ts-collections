import {IEnumerable, ISet, KeyValuePair, List} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";

export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {

    /**
     * Returns the number of elements in this dictionary.
     */
    readonly Count: number;

    /**
     * Adds the specified key and value to the dictionary.
     * @param key The key of the element to add.
     * @param value The value of the element to add. It can be <code>null</code>.
     * @returns The added value.
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
     * <pre>
     *     <code>
     *          for (const [key, value] of dict.entries()) {
     *             //
     *          }
     *     </code>
     * </pre>
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
     */
    keys(): ISet<TKey>;

    /**
     * Removes the specified key and its associated value from this dictionary.
     * @param key They key whose itself and its associated value will be removed from the dictionary.
     * @returns The removed value or null if the key does not exist in the dictionary.
     */
    remove(key: TKey): TValue;

    /**
     * Returns the number of elements in this dictionary.
     */
    size(): number;

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
     * @returns {List} A list of values of this dictionary.
     */
    values(): List<TValue>;
}
