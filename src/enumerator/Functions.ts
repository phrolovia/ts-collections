import { Dictionary } from "../dictionary/Dictionary";
import { ImmutableDictionary } from "../dictionary/ImmutableDictionary";
import { ImmutableSortedDictionary } from "../dictionary/ImmutableSortedDictionary";
import { KeyValuePair } from "../dictionary/KeyValuePair";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import { ImmutableList } from "../list/ImmutableList";
import { LinkedList } from "../list/LinkedList";
import { List } from "../list/List";
import { ILookup } from "../lookup/ILookup";
import { ImmutableQueue } from "../queue/ImmutableQueue";
import { PriorityQueue } from "../queue/PriorityQueue";
import { Queue } from "../queue/Queue";
import { EnumerableSet } from "../set/EnumerableSet";
import { ImmutableSet } from "../set/ImmutableSet";
import { ImmutableSortedSet } from "../set/ImmutableSortedSet";
import { SortedSet } from "../set/SortedSet";
import { Accumulator } from "../shared/Accumulator";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";
import { ImmutableStack } from "../stack/ImmutableStack";
import { Stack } from "../stack/Stack";
import { Enumerable } from "./Enumerable";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

/**
 * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
 * If resultSelector function is specified, it will be used to select the result value.
 * @param source The source iterable.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
 * @param resultSelector The function that will be used to select the result value.
 */
export const aggregate = <TElement, TAccumulate = TElement, TResult = TAccumulate>(
    source: Iterable<TElement>,
    accumulator: (accumulator: TAccumulate, element: TElement) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: (accumulator: TAccumulate) => TResult
): TAccumulate | TResult => {
    return from(source).aggregate(accumulator, seed, resultSelector);
}

/**
 * Determines if all elements of the sequence satisfy the specified predicate.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {boolean} True if all elements satisfy the condition, otherwise false.
 */
export const all = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return from(source).all(predicate);
}

/**
 * Determines if any element of the sequence satisfies the specified predicate.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
 * @returns {boolean} True if any element satisfies the condition, otherwise false.
 */
export const any = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).any(predicate);
}

/**
 * Appends the specified element to the end of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param element The element that will be appended to the end of the sequence
 * @returns {IEnumerable<TElement>} A new enumerable sequence that ends with the specified element.
 */
export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
}

/**
 * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will select a numeric value from the sequence elements.
 * @returns {number} The average of the sequence.
 */
export const average = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).average(selector);
}

/**
 * Casts the elements of the sequence to the specified type.
 * @example
 *      const onlyNumbers = new List([1, 2, 'a', 'b', 3, 4, 'c', 5]).where(e => typeof e === 'number').cast<number>();
 *      console.log(onlyNumbers.toArray()); // [1, 2, 3, 4, 5]
 * @template TResult
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
 */
export const cast = <TResult, TElement = unknown>(
    source: Iterable<TElement>
): IEnumerable<TResult> => {
    return from(source).cast<TResult>();
}

/**
 * Splits the elements of the sequence into chunks of size at most the specified size.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param size The maximum size of each chunk.
 * @returns {IEnumerable<IEnumerable<TElement>>} An enumerable sequence of chunks.
 */
export const chunk = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).chunk(size);
}

/**
 * Returns all combinations of the elements of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param size The size of the combinations. If not specified, it will return all possible combinations.
 * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are combinations of the source sequence.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 */
export const combinations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).combinations(size);
}

/**
 * Concatenates two sequences.
 * @template TElement The type of elements in the sequence.
 * @param source The first sequence.
 * @param enumerable The enumerable sequence that will be concatenated to the first sequence.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements of both sequences.
 */
export const concat = <TElement>(
    source: Iterable<TElement>,
    enumerable: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).concat(from(enumerable));
}

/**
 * Determines where the sequence contains the specified element.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param element The element whose existence will be checked.
 * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
 * @returns {boolean} True if the sequence contains the element, otherwise false.
 */
export const contains = <TElement>(
    source: Iterable<TElement>,
    element: TElement,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).contains(element, comparator);
}

/**
 * Returns the number of elements in the sequence.
 *
 * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {number} The number of elements in the sequence.
 */
export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    return from(source).count(predicate);
}

/**
 * Returns an enumerable sequence of key value pair objects that contain the key and the number of occurrences of the key in the source sequence.
 * @template TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @returns {IEnumerable<KeyValuePair<TKey, number>>} A new enumerable sequence that contains key value pair objects.
 */
export const countBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, number>> => {
    return from(source).countBy(keySelector, comparator);
}

/**
 * Returns a new enumerable sequence that repeats the elements of the source sequence a specified number of times.
 * If count is not specified, the sequence will be repeated indefinitely.
 * If the sequence is empty, an error will be thrown.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of times the source sequence will be repeated.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that repeats the elements of the source sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const cycle = <TElement>(
    source: Iterable<TElement>,
    count?: number
): IEnumerable<TElement> => {
    return from(source).cycle(count);
}

/**
 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param value The value to return if the sequence is empty.
 * @returns {IEnumerable<TElement>} The source sequence or a singleton collection that contains the specified value.
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(value);
}

/**
 * Returns distinct elements from the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
 */
export const distinct = <TElement>(
    source: Iterable<TElement>,
    keyComparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).distinct(keyComparator);
}

/**
 * Returns distinct elements from the sequence based on a specified key selector function.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
 */
export const distinctBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinctBy(keySelector, keyComparator);
}


/**
 * Returns the element at the specified index in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param index The index of the element that will be returned.
 * @returns {TElement} The element at the specified index in the sequence.
 * @throws {Error} If index is less than 0 or greater than or equal to the number of elements in the sequence.
 */
export const elementAt = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement => {
    return from(source).elementAt(index);
}

/**
 * Returns the element at the specified index in the sequence or a default value if the index is out of range.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param index The index of the element that will be returned.
 * @returns {TElement | null} The element at the specified index in the sequence or a default value if the index is out of range.
 */
export const elementAtOrDefault = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement | null => {
    return from(source).elementAtOrDefault(index);
}

/**
 * Creates an empty sequence.
 *
 * @template TElement The type of elements in the sequence.
 * @returns {IEnumerable<TElement>} An empty sequence.
 */
export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};

/**
 * Produces the set difference of two sequences by using the specified equality comparer or order comparer to compare values.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 *
 * Example:
 * ```typescript
 *     var numberList1 = new List([1, 2, 2, 3, 3, 3, 4, 5]);
 *     var numberList2 = new List([2, 5, 5, 6, 7, 8, 8]);
 *     var result = numberList1.except(numberList2).toArray(); // [1, 3, 4]
 * ```
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
 * @param comparator The comparator function that will be used for item comparison. If not provided, default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the set difference of the elements of the two sequences.
 * @throws {Error} If the iterable is null or undefined.
 */
export const except = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null
): IEnumerable<TElement> => {
    return from(source).except(other, comparator);
}

/**
 * Gets the first element of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
 * @returns {TElement} The first element of the sequence.
 * @throws {Error} If the source is null or undefined, or if predicate is specified and no element satisfies the condition.
 */
export const first = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return from(source).first(predicate);
}

/**
 * Gets the first element of the sequence or a default value if the no element satisfies the condition.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
 * @returns {TElement | null} The first element of the sequence or a default value if the no element satisfies the condition.
 * @throws {Error} If the source is null or undefined.
 */
export const firstOrDefault = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return from(source).firstOrDefault(predicate);
}

/**
 * Iterates over the sequence and performs the specified action on each element.
 * @param source The source iterable.
 * @param action The action function that will be performed on each element.
 */
export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
}

/**
 * Creates an enumerable sequence from the given source.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable that will be converted to an enumerable sequence.
 * @returns {IEnumerable<TElement>} An enumerable sequence that contains the elements of the source.
 */
export const from = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return Enumerable.from(source);
};

/**
 * Groups the elements of the sequence according to a specified key selector function.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for grouping.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for grouping.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @returns {IEnumerable<IGroup<TKey, TElement>>} An enumerable sequence of groups.
 */
export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return from(source).groupBy(keySelector, keyComparator);
}

/**
 * Correlates the elements of two sequences based on equality of keys and groups the results.
 * @template TElement The type of elements in the source sequence.
 * @template TInner The type of elements in the inner sequence.
 * @template TKey The type of the key that will be used for joining.
 * @template TResult The type of the result elements.
 * @param source The source iterable.
 * @param innerEnumerable The enumerable sequence to join to the first sequence.
 * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
 * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
 * @param resultSelector The result selector function that will be used to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @returns {IEnumerable<TResult>} An enumerable sequence of result elements.
 */
export const groupJoin = <TElement, TInner, TKey, TResult>(
    source: Iterable<TElement>,
    innerEnumerable: Iterable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TResult> => {
    return from(source).groupJoin(from(innerEnumerable), outerKeySelector, innerKeySelector, resultSelector, keyComparator);
}

/**
 * Returns an enumerable of tuples, each containing the index and the element from the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {IEnumerable<[number, TElement]>} A new enumerable sequence whose elements are tuples of the index and the element.
 */
export const index = <TElement>(source: Iterable<TElement>): IEnumerable<[number, TElement]> => {
    return from(source).index();
}

/**
 * Produces the set intersection of two sequences by using the specified equality comparer or order comparer to compare values.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 *
 * Example:
 * ```typescript
 *     var numberList1 = new List([1, 2, 2, 3, 3, 3, 4, 5]);
 *     var numberList2 = new List([2, 5, 5, 6, 7, 8, 8]);
 *     var result = numberList1.except(numberList2).toArray(); // [2, 5]
 * ```
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
 * @param comparator The comparator function that will be used for item comparison. If not provided, default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the set intersection of the elements of the two sequences.
 * @throws {Error} If the iterable is null or undefined.
 */
export const intersect = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null
): IEnumerable<TElement> => {
    return from(source).intersect(other, comparator);
}

/**
 * Intersperses a specified element between each element of the sequence.
 * @template TElement, TSeparator
 * @param source The source iterable.
 * @param separator The element that will be interspersed between each element of the sequence.
 * @returns {IEnumerable<TElement|TSeparator>} A new enumerable sequence whose elements are the elements of the source sequence interspersed with the specified element.
 */
export const intersperse = <TElement, TSeparator>(
    source: Iterable<TElement>,
    separator: TSeparator
): IEnumerable<TElement | TSeparator> => {
    return from(source).intersperse(separator);
}

/**
 * Correlates the elements of two sequences based on equality of keys
 * @template TElement The type of elements in the source sequence.
 * @template TInner The type of elements in the inner sequence.
 * @template TKey The type of the key that will be used for joining.
 * @template TResult The type of the result elements.
 * @param source The source iterable.
 * @param innerEnumerable The enumerable sequence to join to the first sequence.
 * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
 * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
 * @param resultSelector The result selector function that will be used to create a result element from two matching elements.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @param leftJoin If true, the result sequence will have the value of null for unmatched inner elements.
 * @returns {IEnumerable<TResult>} An enumerable sequence of result elements.
 */
export const join = <TElement, TInner, TKey, TResult>(
    source: Iterable<TElement>,
    innerEnumerable: Iterable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, TInner, TResult>,
    keyComparator?: EqualityComparator<TKey>,
    leftJoin?: boolean
): IEnumerable<TResult> => {
    return from(source).join(from(innerEnumerable), outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
}

/**
 * Returns the last element of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
 * @returns {TElement} The last element of the sequence.
 * @throws {Error} If the source is null or undefined, or if predicate is specified and no element satisfies the condition.
 */
export const last = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return from(source).last(predicate);
}

/**
 * Returns the last element of the sequence or a default value if the no element satisfies the condition.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
 * @returns {TElement | null} The last element of the sequence or a default value if the no element satisfies the condition.
 * @throws {Error} If the source is null or undefined.
 */
export const lastOrDefault = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return from(source).lastOrDefault(predicate);
}

/**
 * Returns the maximum value in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @returns {number} The maximum value in the sequence.
 * @throws {Error} If the source is empty.
 */
export const max = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).max(selector);
}

/**
 * Returns the element with the maximum value that is obtained by applying the key selector function to each element in the sequence.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
 * @returns {TElement} The element with the maximum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const maxBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).maxBy(keySelector, comparator);
}

/**
 * Returns the minimum value in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @returns {number} The minimum value in the sequence.
 * @throws {Error} If the source is empty.
 */
export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
}

/**
 * Returns the element with the minimum value that is obtained by applying the key selector function to each element in the sequence.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
 * @returns {TElement} The element with the minimum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const minBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).minBy(keySelector, comparator);
}

/**
 * Determines whether no elements of the sequence satisfy the specified predicate.
 * If no predicate is specified, it will return true if the sequence is empty.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {boolean} true if no elements of the sequence satisfy the specified predicate; otherwise, false.
 */
export const none = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).none(predicate);
}

/**
 * Returns the elements that are of the specified type.
 * The type can be specified either as a constructor function or as a string.
 * @example
 *     const list = new List([1, 2, 'a', 'b', 3, 4, 'c', 5]);
 *     const onlyNumbers = ofType(list, 'number');
 *     console.log(onlyNumbers.toArray()); // [1, 2, 3, 4, 5]
 *
 * @example
 *    // When using a constructor function:
 *    const list = new List([1, 2, 'a', 'b', 3, 4, 'c', 5]);
 *    const onlyNumbers = ofType(list, Number);
 *    console.log(onlyNumbers.toArray()); // [1, 2, 3, 4, 5]
 *
 * @example
 *   // In case of an inheritance, querying the base type will also return the derived types.
 *   class Base { }
 *   class Derived extends Base { }
 *   const list = new List([new Base(), new Derived(), new Base()]);
 *   const onlyBase = ofType(list, Base);
 *   console.log(onlyBase.toArray()); // [Base {}, Derived {}, Base {}]
 *
 *   const onlyDerived = ofType(list, Derived);
 *   console.log(onlyDerived.toArray()); // [Derived {}]
 *
 * @template TResult
 * @param source The source iterable.
 * @param type The type to filter the elements of the sequence with.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
 */
export const ofType = <TElement, TResult extends ObjectType>(
    source: Iterable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return from(source).ofType(type);
}

/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for sorting.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} An ordered enumerable sequence.
 */
export const orderBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderBy(keySelector, comparator);
}

/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for sorting.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} An ordered enumerable sequence in descending order.
 */
export const orderByDescending = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderByDescending(keySelector, comparator);
}

/**
 * Produces a tuple of the element and the following element.
 * <br/>
 * Example:
 * ```
 *    const numberList = new List([1, 2, 3, 4, 5]);
 *    const result = numberList.pairwise((current, next) => current + "-" + next).toArray(); // [1-2, 2-3, 3-4, 4-5]
 * ```
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param resultSelector The result selector function that will be used to create a result element from the current and the following element.
 * @returns {IEnumerable<[TElement, TElement]>} An enumerable sequence of tuples.
 */
export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
}

/**
 * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences.
 */
export const partition = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>] => {
    return from(source).partition(predicate);
}

/**
 * Returns an enumerable sequence of permutations, each containing a permutation of the elements of the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @param size If specified, it will return only the permutations of the specified size.
 * If not specified, it will return permutations of the size of the source sequence.
 * @returns {IEnumerable<IEnumerable<TElement>>} An enumerable of enumerable sequences, each containing a permutation of the elements of the source sequence.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 */
export const permutations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).permutations(size);
}

/**
 * Adds a value to the beginning of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param element The element to add to the sequence.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that starts with the specified element.
 */
export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
}

/**
 * Computes the product of the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select a numeric value from the sequence elements.
 * @returns {number} The product of the sequence.
 */
export const product = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).product(selector);
}

/**
 * Creates a range of numbers starting from the specified start value and containing the specified count of elements.
 * @param {number} start The start value of the range.
 * @param {number} count The number of elements in the range.
 * @returns {IEnumerable<number>} An enumerable range of numbers.
 */
export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};

/**
 * Repeats the specified element a specified number of times.
 *
 * @template TElement The type of the element to repeat.
 * @param {TElement} element The element to repeat.
 * @param {number} count The number of times to repeat the element.
 * @returns {IEnumerable<TElement>} An Iterable representing the repeated elements.
 */
export const repeat = <TElement>(element: TElement, count: number): IEnumerable<TElement> => {
    return Enumerable.repeat(element, count);
};

/**
 * Inverts the order of the elements in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are in reverse order.
 */
export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
}

/**
 * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
 * If seed is specified, it is used as the initial value for the accumulator; but it is not included in the result.
 * @template TElement The type of elements in the sequence.
 * @template TAccumulate The type of the accumulated value.
 * @param source The source iterable.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
 * @returns {IEnumerable<TAccumulate>} An enumerable sequence of intermediate accumulated values.
 */
export const scan = <TElement, TAccumulate = TElement>(
    source: Iterable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return from(source).scan(accumulator, seed);
}

/**
 * Projects each element of a sequence into a new form.
 * @template TElement The type of elements in the sequence.
 * @template TResult The type of the result elements.
 * @param source The source iterable.
 * @param selector The selector function that will be used to project each element into a new form.
 * @returns {IEnumerable<TResult>} A new enumerable sequence that contains the projected elements.
 */
export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: Selector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
}

/**
 * Projects each element of a sequence into a new form and flattens the resulting sequences into one sequence.
 * @template TElement The type of elements in the source sequence.
 * @template TResult The type of the result elements.
 * @param source The source iterable.
 * @param selector The selector function that will be used to project each element into a new form.
 * @returns {IEnumerable<TResult>} A new enumerable sequence that contains the projected elements.
 */
export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
}

/**
 * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param other The iterable sequence to compare to the source sequence.
 * @param comparator The equality comparer that will be used to compare the elements. If not specified, default equality comparer will be used.
 * @returns {boolean} True if the two sequences are equal, otherwise false.
 */
export const sequenceEqual = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).sequenceEqual(other, comparator);
}

/**
 * Returns a new enumerable sequence whose elements are shuffled.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are shuffled.
 */
export const shuffle = <TElement>(
    source: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).shuffle();
}

/**
 * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
 * @returns {TElement} The only element of the sequence.
 * @throws {Error} If the source is empty or if predicate is specified and no element satisfies the condition.
 */
export const single = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return from(source).single(predicate);
}

/**
 * Returns the only element of a sequence, or a default value if the sequence is empty. This method throws an exception if there is more than one element in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
 * @returns {TElement | null} The only element of the sequence or a default value if the sequence is empty.
 * @throws {Error} If the source contains more than one element or if predicate is specified and more than one element satisfies the condition.
 */
export const singleOrDefault = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return from(source).singleOrDefault(predicate);
}

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param count The number of elements to skip before returning the remaining elements.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements that occur after the specified index in the input sequence.
 */
export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
}

/**
 * Returns a new enumerable sequence that contains the elements from source with the last count elements of the source sequence omitted.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param count The number of elements to omit from the end of the collection.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from source with the last count elements omitted.
 */
export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skipLast(count);
}

/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
 */
export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
}

/**
 * Splits the sequence into two sequences based on a predicate.
 * The first sequence contains the elements from the start of the input sequence that satisfy the predicate,
 * and it continues until the predicate no longer holds.
 * The second sequence contains the remaining elements.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to test each element.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences, the first one containing the elements that satisfy the condition,
 * and the second one containing the rest of the elements regardless of the condition.
 */
export const span = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>] => {
    return from(source).span(predicate);
}

/**
 * Skips elements in a sequence according to a specified step size.
 *
 * Example:
 * ```typescript
 *    const numberList = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
 *    const result = numberList.step(2).toArray(); // [1, 3, 5, 7, 9]
 *    const result2 = numberList.step(3).toArray(); // [1, 4, 7, 10]
 * ```
 * @template TElement
 * @param source The source iterable.
 * @param step The number of elements to skip between each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence with the elements skipped according to the specified step size.
 */
export const step = <TElement>(
    source: Iterable<TElement>,
    step: number
): IEnumerable<TElement> => {
    return from(source).step(step);
}

/**
 * Returns the sum of the values in the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the value to sum. If not specified, the value itself will be used.
 * @returns {number} The sum of the values in the sequence.
 */
export const sum = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).sum(selector);
}

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param count The number of elements to return.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
 */
export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
}

/**
 * Returns a specified number of contiguous elements from the end of a sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param count The number of elements to return.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the end of the input sequence.
 */
export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
}

/**
 * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
 */
export const takeWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).takeWhile(predicate);
}

/**
 * Creates a new array from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @returns {TElement[]} A new array that contains the elements of the source.
 */
export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
}

/**
 * Creates a new dictionary from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for the dictionary.
 * @template TValue The type of the value that will be used for the dictionary.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
 * @returns {Dictionary<TKey, TValue>} A new dictionary that contains the elements of the source.
 */
export const toDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): Dictionary<TKey, TValue> => {
    return from(source).toDictionary(keySelector, valueSelector, valueComparator);
}

/**
 * Creates a new enumerable set from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @returns {EnumerableSet<TElement>} A new enumerable set that contains the elements of the source.
 */
export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>,
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
}

/**
 * Creates a new immutable dictionary from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for the dictionary.
 * @template TValue The type of the value that will be used for the dictionary.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
 * @returns {ImmutableDictionary<TKey, TValue>} A new immutable dictionary that contains the elements of the source.
 */
export const toImmutableDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableDictionary<TKey, TValue> => {
    return from(source).toImmutableDictionary(keySelector, valueSelector, valueComparator);
}

/**
 * Creates a new immutable list from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {ImmutableList<TElement>} A new immutable list that contains the elements of the source.
 */
export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
}

/**
 * Creates a new immutable queue from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {ImmutableQueue<TElement>} A new immutable queue that contains the elements of the source.
 */
export const toImmutableQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableQueue<TElement> => {
    return from(source).toImmutableQueue(comparator);
}

/**
 * Creates a new immutable set from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @returns {ImmutableSet<TElement>} A new immutable set that contains the elements of the source.
 */
export const toImmutableSet = <TElement>(
    source: Iterable<TElement>,
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
}

/**
 * Creates a new immutable sorted dictionary from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for the dictionary.
 * @template TValue The type of the value that will be used for the dictionary.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
 * @returns {ImmutableSortedDictionary<TKey, TValue>} A new immutable sorted dictionary that contains the elements of the source.
 */
export const toImmutableSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableSortedDictionary<TKey, TValue> => {
    return from(source).toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
}

/**
 * Creates a new immutable sorted set from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
 * @returns {ImmutableSortedSet<TElement>} A new immutable sorted set that contains the elements of the source.
 */
export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
}

/**
 * Creates a new immutable stack from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {ImmutableStack<TElement>} A new immutable stack that contains the elements of the source.
 */
export const toImmutableStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableStack<TElement> => {
    return from(source).toImmutableStack(comparator);
}

/**
 * Creates a new linked list from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {LinkedList<TElement>} A new linked list that contains the elements of the source.
 */
export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
}

/**
 * Creates a new list from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {List<TElement>} A new list that contains the elements of the source.
 */
export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
}

/**
 * Creates a new lookup from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of keys in the lookup.
 * @template TValue The type of values in the lookup.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default equality comparer will be used.
 * @returns {ILookup<TKey, TValue>} A new lookup that contains the elements of the source.
 */
export const toLookup = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>
): ILookup<TKey, TValue> => {
    return from(source).toLookup(keySelector, valueSelector, keyComparator);
}

/**
 * Creates a new map from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of keys in the map.
 * @template TValue The type of values in the map.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @returns {Map<TKey, TValue>} A new map that contains the elements of the source.
 */
export const toMap = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Map<TKey, TValue> => {
    return from(source).toMap(keySelector, valueSelector);
}

/**
 * Creates a new object from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of keys in the object.
 * @template TValue The type of values in the object.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @returns {Record<TKey, TValue>} A new object that contains the elements of the source.
 */
export const toObject = <TElement, TKey extends string | number | symbol, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Record<TKey, TValue> => {
    return from(source).toObject(keySelector, valueSelector);
}

/**
 * Creates a new priority queue from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
 * @returns {PriorityQueue<TElement>} A new priority queue that contains the elements of the source.
 */
export const toPriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): PriorityQueue<TElement> => {
    return from(source).toPriorityQueue(comparator);
}

/**
 * Creates a new queue from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {Queue<TElement>} A new queue that contains the elements of the source.
 */
export const toQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Queue<TElement> => {
    return from(source).toQueue(comparator);
}

/**
 * Creates a new set from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @returns {Set<TElement>} A new set that contains the elements of the source.
 */
export const toSet = <TElement>(
    source: Iterable<TElement>
): Set<TElement> => {
    return from(source).toSet();
}

/**
 * Creates a new dictionary from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @template TKey The type of the key that will be used for the dictionary.
 * @template TValue The type of the value that will be used for the dictionary.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
 * @returns {SortedDictionary<TKey, TValue>} A new dictionary that contains the elements of the source.
 */
export const toSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): SortedDictionary<TKey, TValue> => {
    return from(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
}

/**
 * Creates a new sorted set from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
 * @returns {SortedSet<TElement>} A new sorted set that contains the elements of the source.
 */
export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
}

/**
 * Creates a new stack from the elements of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {Stack<TElement>} A new stack that contains the elements of the source.
 */
export const toStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Stack<TElement> => {
    return from(source).toStack(comparator);
}

/**
 * Produces the set union of two sequences by using an equality comparer.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 * @returns {IEnumerable<TElement>} An enumerable sequence that contains the elements from both input sequences, excluding duplicates.
 */
export const union = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(other, comparator);
}

/**
 * Produces the set union of two sequences by using a key selector function.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The equality comparator function that will be used to compare two keys. If not specified, default equality comparer will be used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding duplicates.
 */
export const unionBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).unionBy(other, keySelector, comparator);
}

/**
 * Filters a sequence of values based on a predicate.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence that satisfy the condition.
 */
export const where = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).where(predicate);
}

/**
 * Returns an enumerable sequence of windows of the specified size.
 * If the size is less than or equal to 0, an error will be thrown.
 * If the size is greater than the number of elements in the sequence, an empty sequence will be returned.
 *
 * The windows will overlap, meaning that each element will be included in multiple windows.
 *
 * Example:
 * ```typescript
 *   const numberList = new List([1, 2, 3, 4, 5]);
 *   const result = numberList.windows(3).toArray(); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 *   const result2 = numberList.windows(1).toArray(); // [[1], [2], [3], [4], [5]]
 *   const result3 = numberList.windows(5).toArray(); // [[1, 2, 3, 4, 5]]
 *   const result4 = numberList.windows(6).toArray(); // []
 *   const result5 = numberList.windows(0).toArray(); // Error
 *   const result6 = numberList.windows(-1).toArray(); // Error
 * ```
 * @template TElement
 * @param source The source iterable.
 * @param size The size of the windows.
 * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 */
export const windows = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).windows(size);
}

/**
 * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
 * @template TElement The type of elements in the first sequence.
 * @template TSecond The type of elements in the second sequence.
 * @param source The first source sequence.
 * @param other The iterable sequence to merge with the first sequence.
 * @param zipper The function that specifies how to merge the elements from the two sequences. If this is not specified, the merge result will be a tuple of two elements.
 * @returns {IEnumerable<[TElement, TSecond]>} An enumerable sequence that contains merged elements of two input sequences.
 */
export const zip = <TElement, TSecond, TResult = [TElement, TSecond]>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    zipper?: Zipper<TElement, TSecond, TResult>
): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> => {
    if (zipper) {
        return from(source).zip(other, zipper);
    } else {
        return from(source).zip(other);
    }
}
