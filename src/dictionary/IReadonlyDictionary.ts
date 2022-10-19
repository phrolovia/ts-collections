import {EqualityComparator} from "../shared/EqualityComparator";
import {Selector} from "../shared/Selector";
import {ICollection, ISet, KeyValuePair, IEnumerable} from "../../imports";

export interface IReadonlyDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {
    /**
     * Returns the number of elements in this dictionary.
     */
    readonly length: number;

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
     * Returns a list of values of the dictionary.
     * @returns {ICollection} A collection of values of this dictionary.
     */
    values(): ICollection<TValue>;

    get keyValueComparator(): EqualityComparator<KeyValuePair<TKey, TValue>>;
    get valueComparator(): EqualityComparator<TValue>;
}