import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    CircularLinkedList,
    CircularQueue,
    Dictionary,
    EnumerableSet,
    ILookup,
    ImmutableCircularQueue,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
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
import { IndexedPredicate, IndexedTypePredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate, TypePredicate } from "../shared/Predicate";
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
     * Groups the elements of the sequence according to a specified key selector function and applies an accumulator function over each group.
     * @template TKey The type of the key returned by the key selector.
     * @template TAccumulate The type of the accumulated value.
     * @param keySelector The key selector function that will be used for selecting the key for each element.
     * @param seedSelector The seed selector function that will be used to get the initial value for each group, or a constant value that will be used as the initial value for all groups.
     * @param accumulator The accumulator function that will be applied over each group.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>>} An enumerable sequence of key-value pairs, where each key is a unique key from the source sequence and each value is the accumulated value for that key.
     */
    aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>>

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
     * Returns an enumerable sequence of key value pair objects that contain the key and the number of occurrences of the key in the source sequence.
     * @template TKey
     * @param keySelector The key selector function that will be used for selecting the key for each element.
     * @param comparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IAsyncEnumerable<KeyValuePair<TKey, number>>} An enumerable sequence of key value pair objects that contain the key and the number of occurrences of the key in the source sequence.
     */
    countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>>;

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
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    distinct(keyComparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Returns distinct elements from the sequence based on a key selector function.
     * @template TKey The type of the key returned by the key selector.
     * @param keySelector The key selector function that will be used for selecting the key for each element.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IAsyncEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence based on the key selector.
     */
    distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Returns elements where each yielded value differs from the immediately previous element.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     */
    distinctUntilChanged(comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Returns elements where each yielded value differs from the immediately previous element based on a key selector.
     * @template TKey The type of the key returned by the key selector.
     * @param keySelector The key selector function that will be used for selecting the key for each element.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

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
     * @throws {Error} If the enumerable is null or undefined.
     */
    except(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Produces the set difference of two sequences by using the specified key selector function and comparator.
     * @template TKey The type of the key returned by the key selector.
     * @param enumerable The enumerable sequence whose distinct elements that also appear in the first sequence will be removed.
     * @param keySelector The key selector function that will be used for selecting the key for each element.
     * @param comparator The comparator function that will be used for equality comparison or order comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IAsyncEnumerable<TElement>} A sequence that contains the set difference of the elements from the source sequence and the enumerable sequence.
     * @throws {Error} If the enumerable is null or undefined.
     */
    exceptBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Gets the first element that satisfies the provided type guard predicate and narrows the resulting type.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The resolved element is guaranteed to match the guarded type when found.
     * @returns {Promise<TFiltered>} A promise that resolves to the first matching element.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the predicate.
     */
    first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;

    /**
     * Gets the first element of the sequence, optionally filtered by a predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence is returned.
     * @returns {Promise<TElement>} A promise that resolves to the first element of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If a predicate is specified and no element satisfies it.
     */
    first(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Gets the first element that satisfies the provided type guard predicate, or resolves to null when no such element exists.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The resolved element is guaranteed to match the guarded type when found.
     * @returns {Promise<TFiltered | null>} A promise that resolves to the first matching element or null if none matches.
     */
    firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;

    /**
     * Gets the first element of the sequence or resolves to null when the sequence is empty or no element satisfies the predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence is returned.
     * @returns {Promise<TElement | null>} A promise that resolves to the first matching element or null when no match is found.
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
     * Returns an enumerable of tuples, each containing the index and the element from the source sequence.
     * @template TElement
     * @returns {IAsyncEnumerable<[number, TElement]>} An enumerable of tuples, each containing the index and the element from the source sequence.
     */
    index(): IAsyncEnumerable<[number, TElement]>;

    /**
     * Interleaves elements from the current sequence with elements from another sequence.
     * @param iterable The iterable sequence to interleave with the source sequence.
     */
    interleave<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<TElement | TSecond>;

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
     * @throws {Error} If the enumerable is null or undefined.
     */
    intersect(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Produces the set intersection of two sequences by using the specified key selector function and comparator.
     * @template TKey The type of the key returned by the key selector.
     * @param enumerable The enumerable sequence whose distinct elements that also appear in the first sequence will be returned.
     * @param keySelector The key selector function that will be used for selecting the key for each element.
     * @param comparator The comparator function that will be used for equality comparison or order comparison of selected keys. If not provided, default equality comparison is used.
     * @returns {IAsyncEnumerable<TElement>} A sequence that contains the elements that form the set intersection of the source sequence and the enumerable sequence.
     * @throws {Error} If the enumerable is null or undefined.
     */
    intersectBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IAsyncEnumerable<TElement>;

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
     * Returns the last element that satisfies the provided type guard predicate and narrows the resulting type.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The resolved element is guaranteed to match the guarded type when found.
     * @returns {Promise<TFiltered>} A promise that resolves to the last matching element.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the predicate.
     */
    last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;

    /**
     * Returns the last element of the sequence, optionally filtered by a predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence is returned.
     * @returns {Promise<TElement>} A promise that resolves to the last element of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If a predicate is specified and no element satisfies it.
     */
    last(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Returns the last element that satisfies the provided type guard predicate, or resolves to null when no such element exists.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The resolved element is guaranteed to match the guarded type when found.
     * @returns {Promise<TFiltered | null>} A promise that resolves to the last matching element, or null if none matches.
     */
    lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;

    /**
     * Returns the last element of the sequence or resolves to null when the sequence is empty or no element satisfies the predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence is returned.
     * @returns {Promise<TElement | null>} A promise that resolves to the last matching element or null when no match is found.
     */
    lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Returns the maximum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @throws {NoElementsException} If the source is empty.
     */
    max(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Returns the element with the maximum value that is obtained by applying the key selector function to each element in the sequence.
     * @template TElement
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     * @returns {Promise<TElement>} The element with the maximum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement>;

    /**
     * Returns the minimum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @throws {NoElementsException} If the source is empty.
     */
    min(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Returns the element with the minimum value that is obtained by applying the key selector function to each element in the sequence.
     * @template TElement
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, default order comparison will be used.
     * @returns {Promise<TElement>} The element with the minimum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     */
    minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement>;

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
     * Sorts the elements of the sequence in ascending order using the provided comparator.
     * @param comparator The comparator function that will be used for comparing two elements. If not specified, default order comparison will be used.
     */
    order(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement>;

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
     * Sorts the elements of the sequence in descending order using the provided comparator.
     * @param comparator The comparator function that will be used for comparing two elements. If not specified, default order comparison will be used.
     */
    orderDescending(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement>;

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
     * Splits the sequence into two sequences based on a type guard predicate, narrowing the element type of the first sequence.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The first resulting sequence contains the elements that satisfy the predicate, the second contains the remainder.
     * @returns {Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]>} A promise that resolves to a tuple of sequences.
     */
    partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]>;

    /**
     * Splits the sequence into two sequences based on a boolean predicate.
     * @param predicate The predicate function that will be used to decide whether an element belongs to the first sequence.
     * @returns {Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>} A promise that resolves to a tuple containing the matching and non-matching elements.
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
     * Rotates the elements in the sequence by the specified amount.
     * @param shift The number of positions by which the sequence will be rotated. Positive values rotate to the left; negative values rotate to the right.
     */
    rotate(shift: number): IAsyncEnumerable<TElement>;

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
     * Returns the only element that satisfies the provided type guard predicate and narrows the resulting type.
     * Throws an exception if there is not exactly one matching element.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The resolved element is guaranteed to match the guarded type when found.
     * @returns {Promise<TFiltered>} A promise that resolves to the single matching element.
     * @throws {NoElementsException} If the source (or filtered sequence) is empty.
     * @throws {MoreThanOneElementException} If the source (or filtered sequence) contains more than one element.
     * @throws {NoMatchingElementException} If no element satisfies the predicate.
     * @throws {MoreThanOneMatchingElementException} If more than one element satisfies the predicate.
     */
    single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;

    /**
     * Returns the only element of a sequence, optionally filtered by a predicate.
     * Throws an exception if there is not exactly one matching element.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @returns {Promise<TElement>} A promise that resolves to the single element of the sequence.
     * @throws {NoElementsException} If the source (or filtered sequence) is empty.
     * @throws {MoreThanOneElementException} If the source (or filtered sequence) contains more than one element.
     * @throws {NoMatchingElementException} If a predicate is specified and no element satisfies it.
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies it.
     */
    single(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Returns the only element that satisfies the provided type guard predicate, or resolves to null when no such element exists.
     * Throws an exception if more than one matching element is found.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The resolved element is guaranteed to match the guarded type when found.
     * @returns {Promise<TFiltered | null>} A promise that resolves to the single matching element or null if none matches.
     * @throws {MoreThanOneElementException} If the source contains more than one element (and no predicate is used).
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies it.
     */
    singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;

    /**
     * Returns the only element of a sequence, or null if the sequence is empty or no element satisfies the predicate.
     * Throws an exception if more than one matching element exists.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the only element of the sequence will be returned.
     * @returns {Promise<TElement | null>} A promise that resolves to the single element of the sequence or null when no such element exists.
     * @throws {MoreThanOneElementException} If the source contains more than one element (and no predicate is used).
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies it.
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
     * Splits the sequence into two sequences while a type guard predicate continues to return true for consecutive elements.
     * Once the predicate returns false, the remaining elements are emitted in the second sequence.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The first resulting sequence is narrowed to the guarded type.
     * @returns {Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]>} A promise that resolves to a tuple containing the guarded prefix and the remainder of the sequence.
     */
    span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]>;

    /**
     * Splits the sequence into two sequences while a predicate continues to return true for consecutive elements.
     * Once the predicate returns false, the remaining elements are emitted in the second sequence.
     * @param predicate The predicate function that will be used to test each element.
     * @returns {Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>} A promise that resolves to a tuple containing the matching prefix and the remainder of the sequence.
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
     * Returns consecutive elements from the sequence while a type guard predicate evaluates to true, narrowing the resulting element type.
     * @template TFiltered
     * @param predicate The predicate function (receiving element and index) that acts as a type guard. Iteration stops once the predicate returns false.
     * @returns {IAsyncEnumerable<TFiltered>} An async enumerable containing the leading elements that satisfy the predicate.
     */
    takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;

    /**
     * Returns consecutive elements from the sequence while a predicate evaluates to true.
     * @param predicate The predicate function (receiving element and index) that will be used to test each element.
     * @returns {IAsyncEnumerable<TElement>} An async enumerable containing the leading elements that satisfy the predicate.
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Invokes the specified action on each element while yielding the original elements.
     * @param action The action function that will be performed on each element.
     */
    tap(action: IndexedAction<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Creates a new array from the elements of the sequence.
     */
    toArray(): Promise<TElement[]>;

    /**
     * Creates a circular linked list containing the elements of the sequence.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     */
    toCircularLinkedList(comparator?: EqualityComparator<TElement>): Promise<CircularLinkedList<TElement>>;

    /**
     * Creates a circular queue containing the elements of the sequence using the queue's default capacity.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @returns {Promise<CircularQueue<TElement>>} A promise that resolves to a circular queue containing the sequence elements.
     */
    toCircularQueue(comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;

    /**
     * Creates a circular queue containing the elements of the sequence and limits it to the specified capacity.
     * When more elements are provided than the capacity allows, only the most recent items are retained.
     * @param capacity The maximum number of elements that the resulting queue can hold.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @returns {Promise<CircularQueue<TElement>>} A promise that resolves to a circular queue containing up to `capacity` most recent elements.
     */
    toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;

    /**
     * Creates a dictionary from the sequence by using the specified key and value selectors.
     * @template TKey The type of the keys in the dictionary.
     * @template TValue The type of the values in the dictionary.
     * @param keySelector Selector used to select the key for each element.
     * @param valueSelector Selector used to select the value for each element.
     * @param valueComparator Optional comparator for equality comparison of values.
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<Dictionary<TKey, TValue>>;

    /**
     * Creates an enumerable set containing the elements of the sequence.
     */
    toEnumerableSet(): Promise<EnumerableSet<TElement>>;

    /**
     * Creates an immutable circular queue containing the elements of the sequence using the queue's default capacity.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @returns {Promise<ImmutableCircularQueue<TElement>>} A promise that resolves to an immutable circular queue containing the sequence elements.
     */
    toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;

    /**
     * Creates an immutable circular queue containing the elements of the sequence and limits it to the specified capacity.
     * When more elements are provided than the capacity allows, only the most recent items are retained.
     * @param capacity The maximum number of elements that the resulting queue can hold.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     * @returns {Promise<ImmutableCircularQueue<TElement>>} A promise that resolves to an immutable circular queue containing up to `capacity` most recent elements.
     */
    toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;

    /**
     * Creates an immutable dictionary from the sequence by using the specified key and value selectors.
     * @template TKey The type of the key returned by the key selector.
     * @template TValue The type of the value returned by the value selector.
     * @param keySelector Selector used to select the key for each element.
     * @param valueSelector Selector used to select the value for each element.
     * @param valueComparator Optional comparator for equality comparison of values.
     */
    toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableDictionary<TKey, TValue>>;

    /**
     * Creates an immutable list containing the elements of the sequence.
     */
    toImmutableList(comparator?: EqualityComparator<TElement>): Promise<ImmutableList<TElement>>;

    /**
     * Creates an immutable priority queue containing the elements of the sequence.
     * @param comparator The comparator function that will be used for comparing two elements. If not specified, default order comparison will be used.
     */
    toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): Promise<ImmutablePriorityQueue<TElement>>;

    /**
     * Creates an immutable queue containing the elements of the sequence.
     */
    toImmutableQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableQueue<TElement>>;

    /**
     * Creates an immutable set containing the elements of the sequence.
     */
    toImmutableSet(): Promise<ImmutableSet<TElement>>;

    /**
     * Creates an immutable sorted dictionary from the sequence by using the specified key and value selectors.
     * @template TKey The type of the keys in the dictionary.
     * @template TValue The type of the values in the dictionary.
     * @param keySelector Selector used to select the key for each element.
     * @param valueSelector Selector used to select the value for each element.
     * @param keyComparator Comparator used for ordering of keys.
     * @param valueComparator Comparator used for equality comparison of values.
     */
    toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableSortedDictionary<TKey, TValue>>;

    /**
     * Creates an immutable sorted set containing the elements of the sequence.
     * @param comparator The comparator function that will be used for comparing two elements. If not specified, default order comparison will be used.
     */
    toImmutableSortedSet(comparator?: OrderComparator<TElement>): Promise<ImmutableSortedSet<TElement>>;

    /**
     * Creates an immutable stack containing the elements of the sequence.
     */
    toImmutableStack(comparator?: EqualityComparator<TElement>): Promise<ImmutableStack<TElement>>;

    /**
     * Creates a linked list containing the elements of the sequence.
     */
    toLinkedList(comparator?: EqualityComparator<TElement>): Promise<LinkedList<TElement>>;

    /**
     * Creates a list containing the elements of the sequence.
     */
    toList(comparator?: EqualityComparator<TElement>): Promise<List<TElement>>;

    /**
     * Creates a lookup from the sequence by using the specified key and value selectors.
     * @template TKey The type of the key returned by the key selector.
     * @template TValue The type of the value returned by the value selector.
     * @param keySelector Selector used to select the key for each element.
     * @param valueSelector Selector used to select the value for each element.
     * @param keyComparator Comparator used for ordering of keys.
     */
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): Promise<ILookup<TKey, TValue>>;

    /**
     * Creates a map from the sequence by using the specified key and value selectors.
     * @template TKey The type of the keys in the map.
     * @template TValue The type of the values in the map.
     * @param keySelector Selector used to select the key for each element.
     * @param valueSelector Selector used to select the value for each element.
     */
    toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Map<TKey, TValue>>;

    /**
     * Converts this enumerable to an object.
     * @template TKey
     * @template TValue
     * @param keySelector The selector that will be used to select the property that will be used as the key of the object. Can only be a string, number or symbol.
     * @param valueSelector The selector that will be used to select the property that will be used as the value of the object.
     * @returns {Promise<Record<TKey, TValue>>} An object that contains the elements of the sequence.
     */
    toObject<TKey extends string|number|symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Record<TKey, TValue>>;

    /**
     * Creates a priority queue containing the elements of the sequence.
     * @param comparator The comparator function that will be used for comparing two elements. If not specified, default order comparison will be used.
     */
    toPriorityQueue(comparator?: OrderComparator<TElement>): Promise<PriorityQueue<TElement>>;

    /**
     * Creates a queue containing the elements of the sequence.
     */
    toQueue(comparator?: EqualityComparator<TElement>): Promise<Queue<TElement>>;

    /**
     * Creates a set containing the elements of the sequence.
     */
    toSet(): Promise<Set<TElement>>;

    /**
     * Creates a sorted dictionary from the sequence by using the specified key and value selectors.
     * @template TKey The type of the keys in the dictionary.
     * @template TValue The type of the values in the dictionary.
     * @param keySelector Selector used to select the key for each element.
     * @param valueSelector Selector used to select the value for each element.
     * @param keyComparator Comparator used for ordering of keys.
     * @param valueComparator Comparator used for equality comparison of values.
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<SortedDictionary<TKey, TValue>>;

    /**
     * Creates a sorted set containing the elements of the sequence.
     * @param comparator The comparator function that will be used for comparing two elements. If not specified, default order comparison will be used.
     */
    toSortedSet(comparator?: OrderComparator<TElement>): Promise<SortedSet<TElement>>;

    /**
     * Creates a stack containing the elements of the sequence.
     */
    toStack(comparator?: EqualityComparator<TElement>): Promise<Stack<TElement>>;

    /**
     * Produces the set union of two sequences by using an equality comparer.
     * @param enumerable The enumerable sequence whose distinct elements form the second set for the union.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, default equality comparer will be used.
     */
    union(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Produces the set union of two sequences by using the specified key selector function.
     * @param enumerable The enumerable sequence whose distinct elements form the second set for the union.
     * @param keySelector The key selector function that will be used to select the key for each element.
     * @param comparator The equality comparator function that will be used to compare two keys. If not specified, default equality comparer will be used.
     */
    unionBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Filters a sequence of values based on a type guard predicate, narrowing the resulting element type.
     * @template TFiltered
     * @param predicate The predicate function (accepting element and index) that acts as a type guard. Return true to keep the element, false to filter it out.
     * @returns {IAsyncEnumerable<TFiltered>} An async enumerable containing elements matching the guarded type.
     */
    where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate The predicate function (accepting element and index) that will be used to test each element. Return true to keep the element, false to filter it out.
     * @returns {IAsyncEnumerable<TElement>} An async enumerable containing elements that satisfy the predicate.
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
