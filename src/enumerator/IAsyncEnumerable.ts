import { Accumulator } from "../shared/Accumulator";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedAsyncEnumerable } from "./IOrderedAsyncEnumerable";

export interface IAsyncEnumerable<TElement> extends AsyncIterable<TElement> {

    /**
     * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
     * If resultSelector function is specified, it will be used to select the result value.
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     * @param resultSelector The function that will be used to select the result value.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     */
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult>;

    /**
     * Determines if all elements of the sequence satisfy the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition.
     */
    all(predicate: Predicate<TElement>): Promise<boolean>;

    /**
     * Determines if any element of the sequence satisfies the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
     */
    any(predicate?: Predicate<TElement>): Promise<boolean>;

    /**
     * Appends the specified element to the end of the sequence.
     * @param element The element that will be appended to the end of the sequence
     */
    append(element: TElement): IAsyncEnumerable<TElement>;

    /**
     * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
     * @param selector The selector function that will select a numeric value from the sequence elements.
     * @throws {NoElementsException} If the source is empty.
     */
    average(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Casts the elements of the sequence to the specified type.
     * @template TResult
     * @returns {IAsyncEnumerable<TResult>} The elements of the sequence cast to the specified type.
     */
    cast<TResult>(): IAsyncEnumerable<TResult>;

    /**
     * Splits the elements of the sequence into chunks of size at most the specified size.
     * @param size The maximum size of each chunk.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     */
    chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Returns all combinations of the elements of the sequence.
     * The outputs will not include duplicate combinations.
     * @template TElement
     * @param size The size of the combinations. If not specified, it will return all possible combinations.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are combinations of the source sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     */
    combinations(size?: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Concatenates two sequences.
     * @param other The enumerable sequence that will be concatenated to the first sequence.
     */
    concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Determines where the sequence contains the specified element.
     * @param element The element whose existence will be checked.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean>;

    /**
     * Returns the number of elements in the sequence.
     *
     * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
     * @param predicate The predicate function that will be used to check each element for a condition.
     */
    count(predicate?: Predicate<TElement>): Promise<number>;

    /**
     * Returns a new enumerable sequence that repeats the elements of the source sequence a specified number of times.
     * If count is not specified, the sequence will be repeated indefinitely.
     * If the sequence is empty, an error will be thrown.
     * @template TElement
     * @param count The number of times the source sequence will be repeated.
     * @returns {IAsyncEnumerable<TElement>} A new enumerable sequence that repeats the elements of the source sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    cycle(count?: number): IAsyncEnumerable<TElement>;

    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
     * @param defaultValue The value to return if the sequence is empty.
     */
    defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null>;

    /**
     * Returns distinct elements from the sequence.
     * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison. If not provided, the item itself will be used.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Returns the element at the specified index in the sequence.
     * @param index The index of the element that will be returned.
     * @throws {IndexOutOfBoundsException} If index is less than 0 or greater than or equal to the number of elements in the sequence.
     * @throws {NoSuchElementException} If the source is empty.
     */
    elementAt(index: number): Promise<TElement>;

    /**
     * Returns the element at the specified index in the sequence or a default value if the index is out of range.
     * @param index The index of the element that will be returned.
     */
    elementAtOrDefault(index: number): Promise<TElement | null>;

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
    except(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): IAsyncEnumerable<TElement>;

    /**
     * Gets the first element of the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     */
    first(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Gets the first element of the sequence or a default value if the no element satisfies the condition.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     */
    firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Iterates over the sequence and performs the specified action on each element.
     * @param action The action function that will be performed on each element.
     */
    forEach(action: IndexedAction<TElement>): Promise<void>;

    /**
     * Groups the elements of the sequence according to a specified key selector function.
     * @param keySelector The key selector function that will be used for grouping.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<IGroup<TKey, TElement>>;

    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * @param inner The enumerable sequence to join to the first sequence.
     * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
     * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
     * @param resultSelector The result selector function that will be used to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    groupJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult>;

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
    intersect(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): IAsyncEnumerable<TElement>;

    /**
     * Intersperses a specified element between each element of the sequence.
     * @template TElement, TSeparator
     * @param separator The element that will be interspersed between each element of the sequence.
     * @returns {IAsyncEnumerable<TElement|TSeparator>} A new enumerable sequence whose elements are the elements of the source sequence interspersed with the specified element.
     */
    intersperse<TSeparator = TElement>(separator: TSeparator): IAsyncEnumerable<TElement | TSeparator>;

    /**
     * Correlates the elements of two sequences based on equality of keys
     * @param inner The enumerable sequence to join to the first sequence.
     * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
     * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
     * @param resultSelector The result selector function that will be used to create a result element from two matching elements.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @param leftJoin If true, the result sequence will have the value of null for unmatched inner elements.
     */
    join<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IAsyncEnumerable<TResult>;

    /**
     * Returns the last element of the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     */
    last(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Returns the last element of the sequence or a default value if the no element satisfies the condition.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @throws {Error} If the source is null or undefined.
     */
    lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Returns the maximum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @throws {NoElementsException} If the source is empty.
     */
    max(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Returns the minimum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @throws {NoElementsException} If the source is empty.
     */
    min(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Determines whether no elements of the sequence satisfy the specified predicate.
     * If no predicate is specified, it will return true if the sequence is empty.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {Promise<boolean>} true if no elements of the sequence satisfy the specified predicate; otherwise, false.
     */
    none(predicate?: Predicate<TElement>): Promise<boolean>;

    /**
     * Returns the elements that are of the specified type.
     * The type can be specified either as a constructor function or as a string.
     * @template TResult
     * @param type The type to filter the elements of the sequence with.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
     */
    ofType<TResult extends ObjectType>(type: TResult): IAsyncEnumerable<InferredType<TResult>>;

    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     */
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     */
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;

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
    pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IAsyncEnumerable<[TElement, TElement]>;

    /**
     * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
     * @param predicate The predicate function that will be used to check each element for a condition.
     */
    partition(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;

    /**
     * Returns an enumerable sequence of permutations, each containing a permutation of the elements of the source sequence.
     * @template TElement
     * @param size If specified, it will return only the permutations of the specified size.
     * If not specified, it will return permutations of the size of the source sequence.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} An enumerable of enumerable sequences, each containing a permutation of the elements of the source sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     */
    permutations(size?: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Adds a value to the beginning of the sequence.
     * @param element The element to add to the sequence.
     */
    prepend(element: TElement): IAsyncEnumerable<TElement>;

    /**
     * Computes the product of the sequence.
     * @param selector The selector function that will be used to select a numeric value from the sequence elements.
     * @returns {Promise<number>} The product of the sequence.
     */
    product(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Inverts the order of the elements in the sequence.
     */
    reverse(): IAsyncEnumerable<TElement>;

    /**
     * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
     * If seed is specified, it is used as the initial value for the accumulator; but it is not included in the result.
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IAsyncEnumerable<TAccumulate>;

    /**
     * Projects each element of a sequence into a new form.
     * @param selector The selector function that will be used to project each element into a new form.
     */
    select<TResult>(selector: IndexedSelector<TElement, TResult>): IAsyncEnumerable<TResult>;

    /**
     * Projects each element of a sequence into a new form and flattens the resulting sequences into one sequence.
     * @param selector The selector function that will be used to project each element into a new form.
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IAsyncEnumerable<TResult>;

    /**
     * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
     * @param enumerable The enumerable sequence to compare to the source sequence.
     * @param comparator The equality comparer that will be used to compare the elements. If not specified, default equality comparer will be used.
     */
    sequenceEqual(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): Promise<boolean>;

    /**
     * Returns a new enumerable sequence whose elements are shuffled.
     */
    shuffle(): IAsyncEnumerable<TElement>;

    /**
     * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @throws {NoElementsException} If the source is empty.
     * @throws {MoreThanOneElementException} If the source contains more than one element.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     * @throws {MoreThanOneMatchingElementException} If more than one element satisfies the condition.
     */
    single(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Returns the only element of a sequence, or a default value if the sequence is empty. This method throws an exception if there is more than one element in the sequence.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @throws {MoreThanOneElementException} If the source contains more than one element.
     * @throws {MoreThanOneMatchingElementException} If more than one element satisfies the condition.
     */
    singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @param count The number of elements to skip before returning the remaining elements.
     */
    skip(count: number): IAsyncEnumerable<TElement>;

    /**
     * Returns a new enumerable sequence that contains the elements from source with the last count elements of the source sequence omitted.
     * @param count The number of elements to omit from the end of the collection.
     */
    skipLast(count: number): IAsyncEnumerable<TElement>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @param predicate The predicate function that will be used to test each element.
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Splits the sequence into two sequences based on a predicate.
     * The first sequence contains the elements from the start of the input sequence that satisfy the predicate,
     * and it continues until the predicate no longer holds.
     * The second sequence contains the remaining elements.
     * @template TElement
     * @param predicate The predicate function that will be used to test each element.
     * @returns {Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>} A tuple of two enumerable sequences, the first one containing the elements that satisfy the condition,
     * and the second one containing the rest of the elements regardless of the condition.
     */
    span(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;

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
     * @param step The number of elements to skip between each element.
     * @returns {IAsyncEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence with the elements skipped according to the specified step size.
     */
    step(step: number): IAsyncEnumerable<TElement>;

    /**
     * Returns the sum of the values in the sequence.
     * @param selector The selector function that will be used to select the value to sum. If not specified, the value itself will be used.
     * @throws {NoElementsException} If the source is empty.
     */
    sum(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @param count The number of elements to return.
     */
    take(count: number): IAsyncEnumerable<TElement>;

    /**
     * Returns a specified number of contiguous elements from the end of a sequence.
     * @param count The number of elements to return.
     */
    takeLast(count: number): IAsyncEnumerable<TElement>;

    /**
     * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
     * @param predicate The predicate function that will be used to test each element.
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Creates a new array from the elements of the sequence.
     */
    toArray(): Promise<TElement[]>;

    /**
     * Produces the set union of two sequences by using an equality comparer.
     * @param enumerable The enumerable sequence whose distinct elements form the second set for the union.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     */
    union(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate The predicate function that will be used to test each element.
     */
    where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

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
     * @param size The size of the windows.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     */
    windows(size: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @param iterable The iterable sequence to merge with the first sequence.
     */
    zip<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<[TElement, TSecond]>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @param iterable The iterable sequence to merge with the first sequence.
     * @param zipper The function that specifies how to merge the elements from the two sequences. If this is not specified, the merge result will be a tuple of two elements.
     */
    zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult>;
}
