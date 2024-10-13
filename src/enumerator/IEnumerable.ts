import {
    Dictionary,
    EnumerableSet,
    IGroup,
    ILookup,
    ImmutableDictionary,
    ImmutableList,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    IOrderedEnumerable,
    LinkedList,
    List,
    PriorityQueue,
    Queue,
    SortedDictionary,
    SortedSet,
    Stack
} from "../imports";
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

export interface IEnumerable<TElement> extends Iterable<TElement> {

    /**
     * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
     * If resultSelector function is specified, it will be used to select the result value.
     * @template TAccumulate
     * @template TResult
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     * @param resultSelector The function that will be used to select the result value.
     * @returns {TAccumulate|TResult} The final accumulator value.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     */
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;

    /**
     * Determines if all elements of the sequence satisfy the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {boolean} true if all elements of the sequence satisfy the specified predicate; otherwise, false.
     */
    all(predicate: Predicate<TElement>): boolean;

    /**
     * Determines if any element of the sequence satisfies the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
     * @returns {boolean} true if any element of the sequence satisfies the specified predicate; otherwise, false.
     */
    any(predicate?: Predicate<TElement>): boolean;

    /**
     * Appends the specified element to the end of the sequence.
     * @template TElement
     * @param element The element that will be appended to the end of the sequence
     * @returns {IEnumerable<TElement>} A new enumerable sequence that ends with the specified element.
     */
    append(element: TElement): IEnumerable<TElement>;

    /**
     * Converts the enumerable object to an IEnumerable.
     * @template TElement
     * @returns {IEnumerable<TElement>} An IEnumerable object.
     */
    asEnumerable(): IEnumerable<TElement>;

    /**
     * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
     * @param selector The selector function that will select a numeric value from the sequence elements.
     * @returns {number} The average of the sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    average(selector?: Selector<TElement, number>): number;

    /**
     * Casts the elements of the sequence to the specified type.
     * @example
     *      const onlyNumbers = new List([1, 2, 'a', 'b', 3, 4, 'c', 5]).where(e => typeof e === 'number').cast<number>();
     *      console.log(onlyNumbers.toArray()); // [1, 2, 3, 4, 5]
     * @template TResult
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
     */
    cast<TResult>(): IEnumerable<TResult>;

    /**
     * Splits the elements of the sequence into chunks of size at most the specified size.
     * @template TElement
     * @param size The maximum size of each chunk.
     * @return {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are chunks of the original sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     */
    chunk(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Concatenates two sequences.
     * @template TElement
     * @param iterable The iterable sequence that will be concatenated to the first sequence.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements of both sequences.
     */
    concat(iterable: Iterable<TElement>): IEnumerable<TElement>;

    /**
     * Determines whether the sequence contains the specified element.
     * @param element The element whose existence will be checked.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @returns {boolean} true if the sequence contains the specified element; otherwise, false.
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns the number of elements in the sequence.
     *
     * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {number} The number of elements in the sequence.
     */
    count(predicate?: Predicate<TElement>): number;

    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
     * @template TElement
     * @param value The value to return if the sequence is empty.
     * @returns {IEnumerable<TElement>} The specified sequence or the specified value in a singleton collection if the sequence is empty.
     */
    defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null>;

    /**
     * Returns distinct elements from the sequence.
     * @template TElement
     * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison. If not provided, the item itself will be used.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
     */
    distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Returns the element at the specified index in the sequence.
     * @template TElement
     * @param index The index of the element that will be returned.
     * @returns {TElement} The element at the specified index in the sequence.
     * @throws {IndexOutOfBoundsException} If index is less than 0 or greater than or equal to the number of elements in the sequence.
     */
    elementAt(index: number): TElement;

    /**
     * Returns the element at the specified index in the sequence or a default value if the index is out of range.
     * @template TElement
     * @param index The index of the element that will be returned.
     * @returns {TElement|null} The element at the specified index in the sequence or a default value if the index is out of range.
     */
    elementAtOrDefault(index: number): TElement | null;

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
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
     * @param comparator The comparator function that will be used for item comparison. If not provided, default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set difference of the two sequences.
     * @throws {Error} If the iterable is null or undefined.
     */
    except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null): IEnumerable<TElement>;

    /**
     * Gets the first element of the sequence.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @returns {TElement} The first element of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     */
    first(predicate?: Predicate<TElement>): TElement;

    /**
     * Gets the first element of the sequence or a default value if the no element satisfies the condition.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @returns {TElement|null} The first element of the sequence or a default value if the no element satisfies the condition.
     */
    firstOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Iterates over the sequence and performs the specified action on each element.
     * @param action The action function that will be performed on each element.
     */
    forEach(action: IndexedAction<TElement>): void;

    /**
     * Groups the elements of the sequence according to a specified key selector function.
     * @template TKey, TElement
     * @param keySelector The key selector function that will be used for grouping.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IEnumerable<IGroup<TKey, TElement>>} A new enumerable sequence whose elements are groups that contain the elements of the source sequence.
     */
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>>;

    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * @template TInner, TKey, TResult, TElement
     * @param innerEnumerable The enumerable sequence to join to the first sequence.
     * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
     * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
     * @param resultSelector The result selector function that will be used to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the group join operation.
     */
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                                     resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;

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
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
     * @param comparator The comparator function that will be used for item comparison. If not provided, default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set intersection of the two sequences.
     * @throws {Error} If the iterable is null or undefined.
     */
    intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null): IEnumerable<TElement>;

    /**
     * Correlates the elements of two sequences based on equality of keys
     * @template TInner, TKey, TResult, TElement
     * @param innerEnumerable The enumerable sequence to join to the first sequence.
     * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
     * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
     * @param resultSelector The result selector function that will be used to create a result element from two matching elements.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @param leftJoin If true, the result sequence will have the value of null for unmatched inner elements.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the join operation.
     */
    join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                                resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult>;

    /**
     * Returns the last element of the sequence.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @returns {TElement} The last element of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     */
    last(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the last element of the sequence or a default value if the no element satisfies the condition.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @returns {TElement|null} The last element of the sequence or a default value if the no element satisfies the condition.
     */
    lastOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Returns the maximum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @returns {number} The maximum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    max(selector?: Selector<TElement, number>): number;

    /**
     * Returns the minimum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @returns {number} The minimum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    min(selector?: Selector<TElement, number>): number;

    /**
     * Returns the elements that are of the specified type.
     * The type can be specified either as a constructor function or as a string.
     * @example
     *     const list = new List([1, 2, 'a', 'b', 3, 4, 'c', 5]);
     *     const onlyNumbers = list.ofType('number');
     *     console.log(onlyNumbers.toArray()); // [1, 2, 3, 4, 5]
     *
     * @example
     *    // When using a constructor function:
     *    const list = new List([1, 2, 'a', 'b', 3, 4, 'c', 5]);
     *    const onlyNumbers = list.ofType(Number);
     *    console.log(onlyNumbers.toArray()); // [1, 2, 3, 4, 5]
     *
     * @example
     *   // In case of an inheritance, querying the base type will also return the derived types.
     *   class Base { }
     *   class Derived extends Base { }
     *   const list = new List([new Base(), new Derived(), new Base()]);
     *   const onlyBase = list.ofType(Base);
     *   console.log(onlyBase.toArray()); // [Base {}, Derived {}, Base {}]
     *
     *   const onlyDerived = list.ofType(Derived);
     *   console.log(onlyDerived.toArray()); // [Derived {}]
     * @template TResult
     * @param type The type to filter the elements of the sequence with.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
     */
    ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>>;

    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @template TElement
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in ascending order.
     */
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @template TElement
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in descending order.
     */
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Produces a tuple of the element and the following element.
     * <br/>
     * Example:
     * ```
     *    const numberList = new List([1, 2, 3, 4, 5]);
     *    const result = numberList.pairwise((current, next) => current + "-" + next).toArray(); // [1-2, 2-3, 3-4, 4-5]
     * ```
     * @template TElement
     * @param resultSelector The result selector function that will be used to create a result element from the current and the following element.
     * @returns {IEnumerable<[TElement, TElement]>} A new enumerable sequence whose elements are tuples of the element and the following element.
     */
    pairwise(resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]>;

    /**
     * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
     */
    partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Adds a value to the beginning of the sequence.
     * @template TElement
     * @param element The element to add to the sequence.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that starts with the specified element.
     */
    prepend(element: TElement): IEnumerable<TElement>;

    /**
     * Inverts the order of the elements in the sequence.
     * @template TElement
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are in the reverse order of the source sequence.
     */
    reverse(): IEnumerable<TElement>;

    /**
     * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
     * If seed is specified, it is used as the initial value for the accumulator; but it is not included in the result.
     * @template TAccumulate
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     * @returns {IEnumerable<TAccumulate>} A new enumerable sequence whose elements are the result of each intermediate computation.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate>;

    /**
     * Projects each element of a sequence into a new form.
     * @template TResult
     * @param selector The selector function that will be used to project each element into a new form.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the selector function.
     */
    select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult>;

    /**
     * Projects each element of a sequence into a new form and flattens the resulting sequences into one sequence.
     * @template TResult
     * @param selector The selector function that will be used to project each element into a new form.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the selector function.
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;

    /**
     * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
     * @param iterable The iterable sequence to compare to the source sequence.
     * @param comparator The equality comparer that will be used to compare the elements. If not specified, default equality comparer will be used.
     * @returns {boolean} true if the two source sequences are of equal length and their corresponding elements are equal according to the specified equality comparer; otherwise, false.
     */
    sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns a new enumerable sequence whose elements are shuffled.
     * @template TElement
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are shuffled.
     */
    shuffle(): IEnumerable<TElement>;

    /**
     * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @returns {TElement} The only element of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @throws {MoreThanOneElementException} If the source contains more than one element.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     * @throws {MoreThanOneMatchingElementException} If more than one element satisfies the condition.
     */
    single(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the only element of a sequence, or a default value if the sequence is empty. This method throws an exception if there is more than one element in the sequence.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @returns {TElement|null} The only element of the sequence or a default value if the sequence is empty.
     * @throws {MoreThanOneElementException} If the source contains more than one element.
     * @throws {MoreThanOneMatchingElementException} If more than one element satisfies the condition.
     */
    singleOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @template TElement
     * @param count The number of elements to skip before returning the remaining elements.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements that occur after the specified index in the input sequence.
     */
    skip(count: number): IEnumerable<TElement>;

    /**
     * Returns a new enumerable sequence that contains the elements from source with the last count elements of the source sequence omitted.
     * @template TElement
     * @param count The number of elements to omit from the end of the collection.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from source with the last count elements omitted.
     */
    skipLast(count: number): IEnumerable<TElement>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * @template TElement
     * @param predicate The predicate function that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence starting at the first element in the linear series that does not pass the test specified by predicate.
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Returns the sum of the values in the sequence.
     * @param selector The selector function that will be used to select the value to sum. If not specified, the value itself will be used.
     * @returns {number} The sum of the values in the sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    sum(selector?: Selector<TElement, number>): number;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @template TElement
     * @param count The number of elements to return.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
     */
    take(count: number): IEnumerable<TElement>;

    /**
     * Returns a specified number of contiguous elements from the end of a sequence.
     * @template TElement
     * @param count The number of elements to return.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the end of the input sequence.
     */
    takeLast(count: number): IEnumerable<TElement>;

    /**
     * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
     * @template TElement
     * @param predicate The predicate function that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Creates a new array from the elements of the sequence.
     * @template TElement
     * @returns {TElement[]} An array that contains the elements from the input sequence.
     */
    toArray(): TElement[];

    /**
     * Creates a new dictionary from the elements of the sequence.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
     * @returns {Dictionary<TKey, TValue>} A new dictionary that contains the elements from the input sequence.
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;

    /**
     * Creates a new enumerable set from the elements of the sequence.
     * @template TElement
     * @returns {EnumerableSet<TElement>} An enumerable set that contains the elements from the input sequence.
     */
    toEnumerableSet(): EnumerableSet<TElement>;

    /**
     * Creates a new immutable dictionary from the elements of the sequence.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
     * @returns {ImmutableDictionary<TKey, TValue>} A new immutable dictionary that contains the elements from the input sequence.
     */
    toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;

    /**
     * Creates a new immutable list from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {ImmutableList<TElement>} A new immutable list that contains the elements from the input sequence.
     */
    toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement>;

    /**
     * Creates a new immutable queue from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {ImmutableQueue<TElement>} A new immutable queue that contains the elements from the input sequence.
     */
    toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement>;

    /**
     * Creates a new immutable set from the elements of the sequence.
     * @template TElement
     * @returns {ImmutableSet<TElement>} A new immutable set that contains the elements from the input sequence.
     */
    toImmutableSet(): ImmutableSet<TElement>;

    /**
     * Creates a new immutable sorted dictionary from the elements of the sequence.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
     * @returns {ImmutableSortedDictionary<TKey, TValue>} A new immutable sorted dictionary that contains the elements from the input sequence.
     */
    toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;

    /**
     * Creates a new immutable sorted set from the elements of the sequence.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
     * @returns {ImmutableSortedSet<TElement>} A new immutable sorted set that contains the elements from the input sequence.
     */
    toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement>;

    /**
     * Creates a new immutable stack from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {ImmutableStack<TElement>} A new immutable stack that contains the elements from the input sequence.
     */
    toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement>;

    /**
     * Creates a new linked list from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {LinkedList<TElement>} A new linked list that contains the elements from the input sequence.
     */
    toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement>;

    /**
     * Creates a new list from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {List<TElement>} A new list that contains the elements from the input sequence.
     */
    toList(comparator?: EqualityComparator<TElement>): List<TElement>;

    /**
     * Creates a new lookup from the elements of the sequence.
     * @template TKey
     * @template TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default equality comparer will be used.
     * @returns {ILookup<TKey, TValue>} A new lookup that contains the elements from the input sequence.
     */
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue>;

    /**
     * Converts this dictionary to a JavaScript Map.
     * @template TKey
     * @template TValue
     * @param keySelector The selector that will be used to select the property that will be used as the key of the map.
     * @param valueSelector The selector that will be used to select the property that will be used as the value of the map.
     * @returns {Map<TKey, TValue>} A Map representation of this dictionary.
     */
    toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue>;

    /**
     * Converts this dictionary to an object.
     * @template TKey
     * @template TValue
     * @param keySelector The selector that will be used to select the property that will be used as the key of the object. Can only be a string, number or symbol.
     * @param valueSelector The selector that will be used to select the property that will be used as the value of the object.
     * @returns {Record<TKey, TValue>} An object representation of this dictionary.
     */
    toObject<TKey extends string|number|symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue>;

    /**
     * Creates a new priority queue from the elements of the sequence.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
     * @returns {PriorityQueue<TElement>} A new priority queue that contains the elements from the input sequence.
     */
    toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement>;

    /**
     * Creates a new queue from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {Queue<TElement>} A new queue that contains the elements from the input sequence.
     */
    toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement>;

    /**
     * Creates a new set from the elements of the sequence.
     * @template TElement
     * @returns {Set<TElement>} A new set that contains the elements from the input sequence.
     */
    toSet(): Set<TElement>;

    /**
     * Creates a new dictionary from the elements of the sequence.
     * @template TKey
     * @template TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, default order comparer will be used.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, default equality comparer will be used.
     * @returns {SortedDictionary<TKey, TValue>} A new sorted dictionary that contains the elements from the input sequence.
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue>;

    /**
     * Creates a new sorted set from the elements of the sequence.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, default order comparer will be used.
     * @returns {SortedSet<TElement>} A new sorted set that contains the elements from the input sequence.
     */
    toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement>;

    /**
     * Creates a new stack from the elements of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {Stack<TElement>} A new stack that contains the elements from the input sequence.
     */
    toStack(comparator?: EqualityComparator<TElement>): Stack<TElement>;

    /**
     * Produces the set union of two sequences by using an equality comparer.
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements form the second set for the union.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding duplicates.
     */
    union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Filters a sequence of values based on a predicate.
     * @template TElement
     * @param predicate The predicate function that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains elements from the input sequence that satisfy the condition.
     */
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @template TElement
     * @template TSecond
     * @param {Iterable<TElement>} iterable The iterable sequence to merge with the first sequence.
     * @returns {IEnumerable<[TElement, TSecond]>} A new enumerable sequence that contains the elements of both sequences.
     */
    zip<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
     * @template TElement
     * @template TResult
     * @param iterable {Iterable<TElement>} The iterable sequence to merge with the first sequence.
     * @param zipper The function that specifies how to merge the elements from the two sequences. If this is not specified, the merge result will be a tuple of two elements.
     * @returns {IEnumerable<TResult>} A new enumerable sequence that contains the elements of both sequences.
     */
    zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;
}
