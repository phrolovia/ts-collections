import { Dictionary } from "../dictionary/Dictionary";
import { ImmutableDictionary } from "../dictionary/ImmutableDictionary";
import { ImmutableSortedDictionary } from "../dictionary/ImmutableSortedDictionary";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import { ImmutableList } from "../list/ImmutableList";
import { LinkedList } from "../list/LinkedList";
import { List } from "../list/List";
import { ILookup } from "../lookup/ILookup";
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
import { Enumerable } from "./Enumerable";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

/**
 * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
 * If resultSelector function is specified, it will be used to select the result value.
 * @param source The source sequence.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition.
 */
export const all = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return from(source).all(predicate);
}

/**
 * Determines if any element of the sequence satisfies the specified predicate.
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
 */
export const any = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).any(predicate);
}

/**
 * Appends the specified element to the end of the sequence.
 * @param source The source sequence.
 * @param element The element that will be appended to the end of the sequence
 */
export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
}

/**
 * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
 * @param source The source sequence.
 * @param selector The selector function that will select a numeric value from the sequence elements.
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
 * @param source The source sequence.
 * @param size The maximum size of each chunk.
 */
export const chunk = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).chunk(size);
}

/**
 * Concatenates two sequences.
 * @param source The first sequence.
 * @param enumerable The enumerable sequence that will be concatenated to the first sequence.
 */
export const concat = <TElement>(
    source: Iterable<TElement>,
    enumerable: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).concat(from(enumerable));
}

/**
 * Determines where the sequence contains the specified element.
 * @param source The source sequence.
 * @param element The element whose existence will be checked.
 * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition.
 */
export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    return from(source).count(predicate);
}

/**
 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
 * @param source The source sequence.
 * @param value The value to return if the sequence is empty.
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(value);
}

/**
 * Returns distinct elements from the sequence.
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison. If not provided, the item itself will be used.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 */
export const distinct = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinct(keySelector, keyComparator);
}

/**
 * Returns the element at the specified index in the sequence.
 * @param source The source sequence.
 * @param index The index of the element that will be returned.
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
 * @param source The source sequence.
 * @param index The index of the element that will be returned.
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
 * @param source The source sequence.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
 * @param comparator The comparator function that will be used for item comparison. If not provided, default equality comparison is used.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
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
 * @param source The source sequence.
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
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used for grouping.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
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
 * @param source The source sequence.
 * @param innerEnumerable The enumerable sequence to join to the first sequence.
 * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
 * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
 * @param resultSelector The result selector function that will be used to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
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
 * Produces the set intersection of two sequences by using the specified equality comparer or order comparer to compare values.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 *
 * Example:
 * ```typescript
 *     var numberList1 = new List([1, 2, 2, 3, 3, 3, 4, 5]);
 *     var numberList2 = new List([2, 5, 5, 6, 7, 8, 8]);
 *     var result = numberList1.except(numberList2).toArray(); // [2, 5]
 * ```
 * @param source The source sequence.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
 * @param comparator The comparator function that will be used for item comparison. If not provided, default equality comparison is used.
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
 * Correlates the elements of two sequences based on equality of keys
 * @param source The source sequence.
 * @param innerEnumerable The enumerable sequence to join to the first sequence.
 * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
 * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
 * @param resultSelector The result selector function that will be used to create a result element from two matching elements.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
 * @param leftJoin If true, the result sequence will have the value of null for unmatched inner elements.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
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
 * @param source The source sequence.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @throws {Error} If the source is empty.
 */
export const max = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).max(selector);
}

/**
 * Returns the minimum value in the sequence.
 * @param source The source sequence.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @throws {Error} If the source is empty.
 */
export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
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
 * @param source The source sequence.
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
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
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
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
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
 * @param source The source sequence.
 * @param resultSelector The result selector function that will be used to create a result element from the current and the following element.
 */
export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
}

/**
 * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition.
 */
export const partition = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>] => {
    return from(source).partition(predicate);
}

/**
 * Adds a value to the beginning of the sequence.
 * @param source The source sequence.
 * @param element The element to add to the sequence.
 */
export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
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
 */
export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
}

/**
 * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
 * If seed is specified, it is used as the initial value for the accumulator; but it is not included in the result.
 * @param source The source sequence.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
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
 * @param source The source sequence.
 * @param selector The selector function that will be used to project each element into a new form.
 */
export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: Selector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
}

/**
 * Projects each element of a sequence into a new form and flattens the resulting sequences into one sequence.
 * @param source The source sequence.
 * @param selector The selector function that will be used to project each element into a new form.
 */
export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
}

/**
 * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
 * @param source The source sequence.
 * @param other The iterable sequence to compare to the source sequence.
 * @param comparator The equality comparer that will be used to compare the elements. If not specified, default equality comparer will be used.
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
 * @param source The source sequence.
 */
export const shuffle = <TElement>(
    source: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).shuffle();
}

/**
 * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
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
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
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
 * @param source The source sequence.
 * @param count The number of elements to skip before returning the remaining elements.
 */
export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
}

/**
 * Returns a new enumerable sequence that contains the elements from source with the last count elements of the source sequence omitted.
 * @param source The source sequence.
 * @param count The number of elements to omit from the end of the collection.
 */
export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skipLast(count);
}

/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to test each element.
 */
export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
}

/**
 * Returns the sum of the values in the sequence.
 * @param source The source sequence.
 * @param selector The selector function that will be used to select the value to sum. If not specified, the value itself will be used.
 */
export const sum = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).sum(selector);
}

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @param source The source sequence.
 * @param count The number of elements to return.
 */
export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
}

/**
 * Returns a specified number of contiguous elements from the end of a sequence.
 * @param source The source sequence.
 * @param count The number of elements to return.
 */
export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
}

/**
 * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to test each element.
 */
export const takeWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).takeWhile(predicate);
}

/**
 * Creates a new array from the elements of the sequence.
 */
export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
}

/**
 * Creates a new dictionary from the elements of the sequence.
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
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
 */
export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>,
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
}

/**
 * Creates a new immutable dictionary from the elements of the sequence.
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
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
 * @param source The source sequence.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 */
export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
}

/**
 * Creates a new immutable set from the elements of the sequence.
 * @param source The source sequence.
 */
export const toImmutableSet = <TElement>(
    source: Iterable<TElement>,
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
}

/**
 * Creates a new immutable sorted dictionary from the elements of the sequence.
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
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
 * @param source The source sequence.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
 */
export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
}

/**
 * Creates a new linked list from the elements of the sequence.
 * @param source The source sequence.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 */
export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
}

/**
 * Creates a new list from the elements of the sequence.
 * @param source The source sequence.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 */
export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
}

/**
 * Creates a new lookup from the elements of the sequence.
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default equality comparer will be used.
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
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
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
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 */
export const toObject = <TElement, TKey extends string | number | symbol, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Record<TKey, TValue> => {
    return from(source).toObject(keySelector, valueSelector);
}

/**
 * Creates a new dictionary from the elements of the sequence.
 * @param source The source sequence.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
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
 * @param source The source sequence.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
 */
export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
}

/**
 * Produces the set union of two sequences by using an equality comparer.
 * @param source The source sequence.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
 */
export const union = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(other, comparator);
}

/**
 * Filters a sequence of values based on a predicate.
 * @param source The source sequence.
 * @param predicate The predicate function that will be used to test each element.
 */
export const where = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).where(predicate);
}

/**
 * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
 * @param source The first source sequence.
 * @param other The iterable sequence to merge with the first sequence.
 * @param zipper The function that specifies how to merge the elements from the two sequences. If this is not specified, the merge result will be a tuple of two elements.
 */
export const zip = <TElement, TSecond, TResult = [TElement, TSecond]>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    zipper?: Zipper<TElement, TSecond, TResult>
): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> => {
    return from(source).zip(other, zipper);
}
