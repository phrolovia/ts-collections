import {EqualityComparator} from "../shared/EqualityComparator";
import {Accumulator} from "../shared/Accumulator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Zipper} from "../shared/Zipper";
import {JoinSelector} from "../shared/JoinSelector";
import {OrderComparator} from "../shared/OrderComparator";
import {
    SortedDictionary,
    IGroup,
    ILookup,
    IOrderedEnumerable,
    List,
    Dictionary,
    IndexableList, EnumerableSet, SortedSet
} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";
import {PairwiseSelector} from "../shared/PairwiseSelector";

export interface IEnumerable<TElement> extends Iterable<TElement> {

    /**
     * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
     * If resultSelector function is specified, it will be used to select the result value.
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     * @param resultSelector The function that will be used to select the result value.
     */
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;

    /**
     * Determines if all elements of the sequence satisfy the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
     */
    all(predicate?: Predicate<TElement>): boolean;

    /**
     * Determines if any element of the sequence satisfies the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
     */
    any(predicate?: Predicate<TElement>): boolean;

    /**
     * Appends the specified element to the end of the sequence.
     * @param element The element that will be appended to the end of the sequence
     */
    append(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
     * @param selector The selector function that will select a numeric value from the sequence elements.
     */
    average(selector?: Selector<TElement, number>): number;

    /**
     * Splits the elements of the sequence into chunks of size at most the specified size.
     * @param size The maximum size of each chunk.
     */
    chunk(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Concatenates two sequences.
     * @param enumerable The enumerable sequence that will be concatenated to the first sequence.
     */
    concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement>;

    /**
     * Determines where the sequence contains the specified element.
     * @param element The element whose existence will be checked.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns the number of elements in the sequence.
     *
     * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
     * @param predicate The predicate function that will be used to check each element for a condition.
     */
    count(predicate?: Predicate<TElement>): number;

    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
     * @param value The value to return if the sequence is empty.
     */
    defaultIfEmpty(value?: TElement): IEnumerable<TElement>;

    /**
     * Returns distinct elements from the sequence.
     * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison. If not provided, the item itself will be used.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Returns the element at the specified index in the sequence.
     * @param index The index of the element that will be returned.
     * @throws {Error} If index is less than 0 or greater than or equal to the number of elements in the sequence.
     */
    elementAt(index: number): TElement;

    /**
     * Returns the element at the specified index in the sequence or a default value if the index is out of range.
     * @param index The index of the element that will be returned.
     */
    elementAtOrDefault(index: number): TElement;

    /**
     * Produces the set difference of two sequences by using the specified equality comparer or order comparer to compare values.
     *
     * About the difference between comparator and orderComparator:
     * - If both comparator and orderComparator are specified, the order comparator will be used for internal operations.
     * - If only one of the comparators is specified, the specified comparator will be used for internal operations.
     * - If no comparator is specified, it will use the <b>default equality</b> comparer.
     *
     * If the elements of the enumerable can be sorted, it is advised to use the orderComparator due to its better performance.
     *
     * Example:
     * ```
     *     var numberList1 = new List([1, 2, 2, 3, 3, 3, 4, 5]);
     *     var numberList2 = new List([2, 5, 5, 6, 7, 8, 8]);
     *     var result = numberList1.except(numberList2).toArray(); // [1, 3, 4]
     * ```
     * @param enumerable The enumerable sequence whose distinct elements that also appear in the first sequence will be removed.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @param orderComparator The comparator function that will be used for order comparison. If not provided, default <b>equality comparison</b> will be used.
     * @throws {Error} If the enumerable is null or undefined.
     */
    except(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IEnumerable<TElement>;

    /**
     * Gets the first element of the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @throws {Error} If the source is null or undefined, or if predicate is specified and no element satisfies the condition.
     */
    first(predicate?: Predicate<TElement>): TElement;

    /**
     * Gets the first element of the sequence or a default value if the no element satisfies the condition.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @throws {Error} If the source is null or undefined.
     */
    firstOrDefault(predicate?: Predicate<TElement>): TElement;

    /**
     * Iterates over the sequence and performs the specified action on each element.
     * @param action The action function that will be performed on each element.
     */
    forEach(action: IndexedAction<TElement>): void;

    /**
     * Groups the elements of the sequence according to a specified key selector function.
     * @param keySelector The key selector function that will be used for grouping.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>>;

    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * @param innerEnumerable The enumerable sequence to join to the first sequence.
     * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
     * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
     * @param resultSelector The result selector function that will be used to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                       resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;

    /**
     * Produces the set intersection of two sequences by using the specified equality comparer or order comparer to compare values.
     *
     * About the difference between comparator and orderComparator:
     * - If both comparator and orderComparator are specified, the order comparator will be used for internal operations.
     * - If only one of the comparators is specified, the specified comparator will be used for internal operations.
     * - If no comparator is specified, it will use the <b>default equality</b> comparer.
     *
     * If the elements of the enumerable can be sorted, it is advised to use the orderComparator due to its better performance.
     *
     * Example:
     * ```
     *     var numberList1 = new List([1, 2, 2, 3, 3, 3, 4, 5]);
     *     var numberList2 = new List([2, 5, 5, 6, 7, 8, 8]);
     *     var result = numberList1.except(numberList2).toArray(); // [2, 5]
     * ```
     * @param enumerable The enumerable sequence whose distinct elements that also appear in the first sequence will be returned.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @param orderComparator The comparator function that will be used for order comparison. If not provided, default <b>equality comparison</b> will be used.
     * @throws {Error} If the enumerable is null or undefined.
     */
    intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IEnumerable<TElement>;

    /**
     * Correlates the elements of two sequences based on equality of keys
     * @param innerEnumerable The enumerable sequence to join to the first sequence.
     * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
     * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
     * @param resultSelector The result selector function that will be used to create a result element from two matching elements.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @param leftJoin If true, the result sequence will have the value of null for unmatched inner elements.
     */
    join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                  resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult>;

    /**
     * Returns the last element of the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @throws {Error} If the source is null or undefined, or if predicate is specified and no element satisfies the condition.
     */
    last(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the last element of the sequence or a default value if the no element satisfies the condition.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @throws {Error} If the source is null or undefined.
     */
    lastOrDefault(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the maximum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @throws {Error} If the source is empty.
     */
    max(selector?: Selector<TElement, number>): number;

    /**
     * Returns the minimum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @throws {Error} If the source is empty.
     */
    min(selector?: Selector<TElement, number>): number;

    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     */
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     */
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Produces a tuple of the element and the following element.
     * @param resultSelector The result selector function that will be used to create a result element from the current and the following element.
     *
     * <br/>
     * Example:
     * ```
     *    const numberList = new List([1, 2, 3, 4, 5]);
     *    const result = numberList.pairwise((current, next) => current + "-" + next).toArray(); // [1-2, 2-3, 3-4, 4-5]
     * ```
     */
    pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]>;


    /**
     * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
     * @param predicate The predicate function that will be used to check each element for a condition.
     */
    partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Adds a value to the beginning of the sequence.
     * @param element The element to add to the sequence.
     */
    prepend(element: TElement): IEnumerable<TElement>;

    /**
     * Inverts the order of the elements in the sequence.
     */
    reverse(): IEnumerable<TElement>;

    /**
     * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
     * If seed is specified, it is used as the initial value for the accumulator; but it is not included in the result.
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate>;

    /**
     * Projects each element of a sequence into a new form.
     * @param selector The selector function that will be used to project each element into a new form.
     */
    select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult>;

    /**
     * Projects each element of a sequence into a new form and flattens the resulting sequences into one sequence.
     * @param selector The selector function that will be used to project each element into a new form.
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;

    /**
     * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
     * @param enumerable The enumerable sequence to compare to the source sequence.
     * @param comparator The equality comparer that will be used to compare the elements. If not specified, default equality comparer will be used.
     */
    sequenceEqual(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @throws {Error} If the source is empty or if predicate is specified and no element satisfies the condition.
     */
    single(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the only element of a sequence, or a default value if the sequence is empty. This method throws an exception if there is more than one element in the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @throws {Error} If the source is contains more than one element or if predicate is specified and more than one element satisfies the condition.
     */
    singleOrDefault(predicate?: Predicate<TElement>): TElement;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    skip(count: number): IEnumerable<TElement>;

    /**
     * Returns a new enumerable sequence that contains the elements from source with the last count elements of the source sequence omitted.
     * @param count The number of elements to omit from the end of the collection.
     */
    skipLast(count: number): IEnumerable<TElement>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate The predicate function that will be used to test each element.
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Returns the sum of the values in the sequence.
     * @param selector The selector function that will be used to select the value to sum. If not specified, the value itself will be used.
     */
    sum(selector?: Selector<TElement, number>): number;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    take(count: number): IEnumerable<TElement>;

    /**
     * Returns a specified number of contiguous elements from the end of a sequence.
     * @param count The number of elements to return.
     */
    takeLast(count: number): IEnumerable<TElement>;

    /**
     * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
     * @param predicate The predicate function that will be used to test each element.
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Creates a new array from the elements of the sequence.
     */
    toArray(): TElement[];

    /**
     * Creates a new dictionary from the elements of the sequence.
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;

    /**
     * Creates a new enumerable set from the elements of the sequence.
     */
    toEnumerableSet(): EnumerableSet<TElement>;

    /**
     * Creates a new indexable list from the elements of the sequence.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     */
    toIndexableList(comparator?: EqualityComparator<TElement>): IndexableList<TElement>;

    /**
     * Creates a new list from the elements of the sequence.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     */
    toList(comparator?: EqualityComparator<TElement>): List<TElement>;

    /**
     * Creates a new lookup from the elements of the sequence.
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default equality comparer will be used.
     */
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue>;

    /**
     * Creates a new dictionary from the elements of the sequence.
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue>;

    /**
     * Creates a new sorted set from the elements of the sequence.
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
     */
    toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement>;

    /**
     * Produces the set union of two sequences by using an equality comparer.
     * @param enumerable The enumerable sequence whose distinct elements form the second set for the union.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     */
    union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate The predicate function that will be used to test each element.
     */
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @param enumerable The enumerable sequence to merge with the first sequence.
     * @param zipper The function that specifies how to merge the elements from the two sequences. If this is not specified, the merge result will be a tuple of two elements.
     */
    zip<TSecond, TResult=[TElement, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult>;
}
