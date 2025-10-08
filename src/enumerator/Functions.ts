import { Dictionary } from "../dictionary/Dictionary";
import { ImmutableDictionary } from "../dictionary/ImmutableDictionary";
import { ImmutableSortedDictionary } from "../dictionary/ImmutableSortedDictionary";
import { KeyValuePair } from "../dictionary/KeyValuePair";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import { CircularLinkedList } from "../list/CircularLinkedList";
import { CircularQueue } from "../queue/CircularQueue";
import { ImmutableList } from "../list/ImmutableList";
import { LinkedList } from "../list/LinkedList";
import { List } from "../list/List";
import { ILookup } from "../lookup/ILookup";
import { ImmutablePriorityQueue } from "../queue/ImmutablePriorityQueue";
import { ImmutableCircularQueue } from "../queue/ImmutableCircularQueue";
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
import { ImmutableStack } from "../stack/ImmutableStack";
import { Stack } from "../stack/Stack";
import { Enumerable } from "./Enumerable";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

/**
 * Combines the elements of the sequence by applying an accumulator to each element and optionally projecting the final result.
 * @template TElement Type of elements within the `source` iterable.
 * @template TAccumulate Type of the intermediate accumulator. Defaults to `TElement` when no seed is provided.
 * @template TResult Type returned when a `resultSelector` is supplied.
 * @param source The source iterable.
 * @param accumulator Function that merges the running accumulator with the next element.
 * @param seed Optional initial accumulator value. When omitted, the first element is used as the starting accumulator.
 * @param resultSelector Optional projection applied to the final accumulator before it is returned.
 * @returns {TAccumulate|TResult} The final accumulator (or its projection).
 * @throws {NoElementsException} Thrown when `source` has no elements and no `seed` is provided.
 * @remarks The source sequence is enumerated exactly once. Supply a `seed` to avoid exceptions on empty sequences and to control the accumulator type.
 */
export const aggregate = <TElement, TAccumulate = TElement, TResult = TAccumulate>(
    source: Iterable<TElement>,
    accumulator: (accumulator: TAccumulate, element: TElement) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: (accumulator: TAccumulate) => TResult
): TAccumulate | TResult => {
    return from(source).aggregate(accumulator, seed, resultSelector);
};

/**
 * Groups elements by a computed key and aggregates each group by applying an accumulator within that group.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type returned by `keySelector` and used to organise groups.
 * @template TAccumulate Type of the accumulated value created for each group.
 * @param source The source iterable.
 * @param keySelector Selector that derives the grouping key for each element.
 * @param seedSelector Either an initial accumulator value applied to every group or a factory invoked with the group key to produce that value.
 * @param accumulator Function that merges the current accumulator with the next element in the group.
 * @param keyComparator Optional equality comparator used to match group keys.
 * @returns {IEnumerable<KeyValuePair<TKey, TAccumulate>>} A sequence containing one key-value pair per group and its aggregated result.
 * @remarks When `seedSelector` is a factory function, it is evaluated once per group to obtain the initial accumulator.
 */
export const aggregateBy = <TElement, TKey, TAccumulate = TElement>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    seedSelector: Selector<TKey, TAccumulate> | TAccumulate,
    accumulator: Accumulator<TElement, TAccumulate>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, TAccumulate>> => {
    return from(source).aggregateBy(keySelector, seedSelector, accumulator, keyComparator);
};

/**
 * Determines whether every element in the sequence satisfies the supplied predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
 * @returns {boolean} `true` when all elements satisfy the predicate; otherwise, `false`.
 * @remarks Enumeration stops as soon as the predicate returns `false`.
 */
export const all = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return from(source).all(predicate);
};

/**
 * Determines whether the sequence contains at least one element that matches the optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional function used to test elements. When omitted, the function returns `true` if `source` contains any element.
 * @returns {boolean} `true` when a matching element is found; otherwise, `false`.
 * @remarks When the predicate is omitted, only the first element is inspected, making this more efficient than `count(source) > 0`.
 */
export const any = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).any(predicate);
};

/**
 * Creates a sequence that yields the current elements followed by the supplied element.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param element Element appended to the end of the sequence.
 * @returns {IEnumerable<TElement>} A new enumerable whose final item is the provided element.
 * @remarks The source sequence is not modified; enumeration is deferred until the returned sequence is iterated.
 */
export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
};

/**
 * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The arithmetic mean of the selected values.
 * @throws {NoElementsException} Thrown when `source` is empty.
 * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
 */
export const average = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).average(selector);
};

/**
 * Reinterprets each element in the sequence as the specified result type.
 * @template TResult Target type exposed by the returned sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TResult>} A sequence that yields the same elements typed as `TResult`.
 * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
 */
export const cast = <TResult, TElement = unknown>(
    source: Iterable<TElement>
): IEnumerable<TResult> => {
    return from(source).cast<TResult>();
};

/**
 * Splits the sequence into contiguous subsequences containing at most the specified number of elements.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Maximum number of elements to include in each chunk. Must be greater than 0.
 * @returns {IEnumerable<IEnumerable<TElement>>} A sequence where each element is a chunk of the original sequence.
 * @throws {InvalidArgumentException} Thrown when `size` is less than 1.
 * @remarks The final chunk may contain fewer elements than `size`. Enumeration is deferred until the returned sequence is iterated.
 */
export const chunk = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).chunk(size);
};

/**
 * Generates the unique combinations that can be built from the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
 * @returns {IEnumerable<IEnumerable<TElement>>} A sequence of combinations built from the source elements.
 * @throws {InvalidArgumentException} Thrown when `size` is negative.
 * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
 */
export const combinations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).combinations(size);
};

/**
 * Appends the specified iterable to the end of the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Additional elements that are yielded after the current sequence.
 * @returns {IEnumerable<TElement>} A sequence containing the elements of the current sequence followed by those from `other`.
 * @remarks Enumeration of both sequences is deferred until the result is iterated.
 */
export const concat = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).concat(from(other));
};

/**
 * Determines whether the sequence contains a specific element using an optional comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param element Element to locate in the sequence.
 * @param comparator Optional equality comparator used to match elements. Defaults to the library's standard equality comparison.
 * @returns {boolean} `true` when the element is found; otherwise, `false`.
 */
export const contains = <TElement>(
    source: Iterable<TElement>,
    element: TElement,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).contains(element, comparator);
};

/**
 * Counts the number of elements in the sequence, optionally restricted by a predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
 * @returns {number} The number of elements that satisfy the predicate.
 * @remarks Prefer calling `any(source)` to test for existence instead of comparing this result with zero.
 */
export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    return from(source).count(predicate);
};

/**
 * Counts the occurrences of elements grouped by a derived key.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type produced by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the grouping key for each element.
 * @param comparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<KeyValuePair<TKey, number>>} A sequence of key/count pairs describing how many elements share each key.
 * @remarks Each key appears exactly once in the result with its associated occurrence count.
 */
export const countBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, number>> => {
    return from(source).countBy(keySelector, comparator);
};

/**
 * Repeats the sequence the specified number of times, or indefinitely when no count is provided.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
 * @returns {IEnumerable<TElement>} A sequence that yields the original elements cyclically.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
 */
export const cycle = <TElement>(
    source: Iterable<TElement>,
    count?: number
): IEnumerable<TElement> => {
    return from(source).cycle(count);
};

/**
 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
 * @template TElement
 * @param source The source iterable.
 * @param value The value to return if the sequence is empty. Defaults to null if not provided.
 * @returns {IEnumerable<TElement | null>} The specified sequence or the specified value in a singleton collection if the sequence is empty.
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(value);
};

/**
 * Returns distinct elements from the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
 */
export const distinct = <TElement>(
    source: Iterable<TElement>,
    keyComparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).distinct(keyComparator);
};

/**
 * Returns distinct elements from the sequence based on a key selector.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
 */
export const distinctBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinctBy(keySelector, keyComparator);
};

/**
 * Removes consecutive duplicate elements from the sequence by comparing each element with the immediately previous element.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The comparator function that will be used for equality comparison. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that yields the first element of each run of equal values.
 */
export const distinctUntilChanged = <TElement>(source: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> => {
    return from(source).distinctUntilChanged(comparator);
};

/**
 * Removes consecutive duplicate elements from the sequence by comparing keys produced for each element.
 * @template TElement
 * @template TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to project each element before comparison.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that yields the first element of each run of equal keys.*/
export const distinctUntilChangedBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinctUntilChangedBy(keySelector, keyComparator);
};

/**
 * Returns the element at the specified index in the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param index The index of the element that will be returned.
 * @returns {TElement} The element at the specified index in the sequence.
 * @throws {IndexOutOfBoundsException} If index is less than 0 or greater than or equal to the number of elements in the sequence.
 */
export const elementAt = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement => {
    return from(source).elementAt(index);
};

/**
 * Returns the element at the specified index in the sequence or a default value if the index is out of range.
 * @template TElement
 * @param source The source iterable.
 * @param index The index of the element that will be returned.
 * @returns {TElement|null} The element at the specified index in the sequence or null if the index is out of range.
 */
export const elementAtOrDefault = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement | null => {
    return from(source).elementAtOrDefault(index);
};

/**
 * Creates an empty sequence.
 *
 * @template TElement The type of elements in the sequence.
 * @returns {IEnumerable<TElement>} An empty sequence.*/
export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};

/**
 * Produces the set difference of two sequences by using the specified equality comparer or order comparer to compare values.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 * @template TElement
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
 * @param comparator The comparator function that will be used for item comparison. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set difference of the two sequences.
 */
export const except = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).except(other, comparator);
};

/**
 * Produces the set difference of two sequences by using the specified key selector function to compare elements.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 * @template TElement, TKey
 * @typeParam TElement The type of the elements in the source sequence.
 * @typeParam TKey The type of the key that will be used for comparison.
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
 * @param keySelector The key selector function that will be used for selecting a key which will be used for comparison.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set difference of the two sequences.
 */
export const exceptBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).exceptBy(other, keySelector, keyComparator);
};

/**
 * Gets the first element of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
 * @returns {TElement} The first element of the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @throws {NoMatchingElementException} If no element satisfies the condition.
 */
export function first<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;
export function first<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement;
export function first<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered {
    return from(source).first(predicate as Predicate<TElement> | undefined);
}

/**
 * Gets the first element of the sequence or a default value if the no element satisfies the condition.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
 * @returns {TElement|null} The first element of the sequence or null if no element satisfies the condition or the sequence is empty.
 */
export function firstOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;
export function firstOrDefault<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null;
export function firstOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered | null {
    return from(source).firstOrDefault(predicate as Predicate<TElement> | undefined);
}

/**
 * Iterates over the sequence and performs the specified action on each element.
 * @param source The source iterable.
 * @param action The action function that will be performed on each element. The second parameter of the action is the index.
 */
export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
};

/**
 * Creates an enumerable sequence from the given source.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable that will be converted to an enumerable sequence.
 * @returns {IEnumerable<TElement>} An enumerable sequence that contains the elements of the source.*/
export const from = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return Enumerable.from(source);
};

/**
 * Groups the elements of the sequence according to a specified key selector function.
 * @template TKey, TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for grouping.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<IGroup<TKey, TElement>>} A new enumerable sequence whose elements are groups that contain the elements of the source sequence.
 */
export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return from(source).groupBy(keySelector, keyComparator);
};

/**
 * Correlates the elements of two sequences based on equality of keys and groups the results.
 * The result contains elements from the first (outer) sequence and a collection of matching elements from the second (inner) sequence.
 * @template TInner, TKey, TResult, TElement
 * @param source The source iterable.
 * @param innerEnumerable The enumerable sequence to join to the first sequence.
 * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
 * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
 * @param resultSelector The result selector function that will be used to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the group join operation.
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
};

/**
 * Returns an enumerable of tuples, each containing the index and the element from the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {IEnumerable<[number, TElement]>} A new enumerable sequence whose elements are tuples of the index and the element.
 */
export const index = <TElement>(source: Iterable<TElement>): IEnumerable<[number, TElement]> => {
    return from(source).index();
};

/**
 * Interleaves the source sequence with another iterable, yielding elements in alternating order.
 * @template TElement
 * @template TSecond
 * @param source The source iterable.
 * @param other The iterable sequence whose elements will be interleaved with the source sequence.
 * @returns {IEnumerable<TElement | TSecond>} A new enumerable sequence that alternates between elements from the source and the provided iterable.
 */
export const interleave = <TElement, TSecond>(source: Iterable<TElement>, other: Iterable<TSecond>): IEnumerable<TElement | TSecond> => {
    return from(source).interleave(other);
};

/**
 * Produces the set intersection of two sequences by using the specified equality comparer or order comparer to compare values.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 * @template TElement
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
 * @param comparator The comparator function that will be used for item comparison. If not provided, a default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set intersection of the two sequences.
 * @throws {Error} If the iterable is null or undefined.
 */
export const intersect = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).intersect(other, comparator);
};

/**
 * Produces the set intersection of two sequences by using the specified key selector function to compare elements.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 * @template TElement, TKey
 * @typeParam TElement The type of the elements in the source sequence.
 * @typeParam TKey The type of the key that will be used for comparison.
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
 * @param keySelector The key selector function that will be used for selecting a key which will be used for comparison.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set intersection of the two sequences.
 */
export const intersectBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).intersectBy(other, keySelector, keyComparator);
};

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
};

/**
 * Correlates the elements of two sequences based on equality of keys.
 * @template TInner, TKey, TResult, TElement
 * @param source The source iterable.
 * @param innerEnumerable The enumerable sequence to join to the first sequence.
 * @param outerKeySelector The key selector function that will be used for selecting the key for an element from the first sequence.
 * @param innerKeySelector The key selector function that will be used for selecting the key for an element from the second sequence.
 * @param resultSelector The result selector function that will be used to create a result element from two matching elements.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @param leftJoin If true, the result sequence will include outer elements that have no matching inner element, with null provided as the inner element to the resultSelector. Defaults to false.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the join operation.
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
};

/**
 * Returns the last element of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
 * @returns {TElement} The last element of the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @throws {NoMatchingElementException} If no element satisfies the condition.
 */
export function last<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;
export function last<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement;
export function last<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered {
    return from(source).last(predicate as Predicate<TElement> | undefined);
}

/**
 * Returns the last element of the sequence or a default value if the no element satisfies the condition.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
 * @returns {TElement|null} The last element of the sequence or null if the sequence is empty or no element satisfies the condition.
 */
export function lastOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;
export function lastOrDefault<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null;
export function lastOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered | null {
    return from(source).lastOrDefault(predicate as Predicate<TElement> | undefined);
}

/**
 * Returns the maximum value in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @returns {number} The maximum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const max = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).max(selector);
};

/**
 * Returns the element with the maximum value that is obtained by applying the key selector function to each element in the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {TElement} The element with the maximum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const maxBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).maxBy(keySelector, comparator);
};

/**
 * Returns the minimum value in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @returns {number} The minimum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
};

/**
 * Returns the element with the minimum value that is obtained by applying the key selector function to each element in the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {TElement} The element with the minimum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 */
export const minBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).minBy(keySelector, comparator);
};

/**
 * Determines whether no elements of the sequence satisfy the specified predicate.
 * If no predicate is specified, it returns true if the sequence is empty, and false otherwise.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {boolean} true if no elements satisfy the predicate, or if the sequence is empty and no predicate is provided; otherwise, false.
 */
export const none = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).none(predicate);
};

/**
 * Returns the elements that are of the specified type.
 * The type can be specified either as a constructor function or as a string representing a primitive type.
 * @template TResult
 * @param source The source iterable.
 * @param type The type to filter the elements of the sequence with (e.g., 'string', 'number', Boolean, Date, MyCustomClass).
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
 */
export const ofType = <TElement, TResult extends ObjectType>(
    source: Iterable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return from(source).ofType(type);
};

/**
 * Sorts the elements of the sequence in ascending order by using the provided comparator.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The comparator function that will be used for comparing two elements. If not provided, the default order comparison is used.
 * @returns {IOrderedEnumerable<TElement>} A new ordered enumerable whose elements are sorted in ascending order.*/
export const order = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): IOrderedEnumerable<TElement> => {
    return from(source).order(comparator);
};

/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in ascending order.
 */
export const orderBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderBy(keySelector, comparator);
};

/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in descending order.
 */
export const orderByDescending = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderByDescending(keySelector, comparator);
};

/**
 * Sorts the elements of the sequence in descending order by using the provided comparator.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The comparator function that will be used for comparing two elements. If not provided, the default order comparison is used.
 * @returns {IOrderedEnumerable<TElement>} A new ordered enumerable whose elements are sorted in descending order.*/
export const orderDescending = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): IOrderedEnumerable<TElement> => {
    return from(source).orderDescending(comparator);
};

/**
 * Produces a sequence of tuples containing the element and the following element.
 * @template TElement, TResult
 * @param source The source iterable.
 * @param resultSelector The optional function to create a result element from the current and the next element. Defaults to creating a tuple `[current, next]`.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of applying the `resultSelector` to adjacent elements.
 */
export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
};

/**
 * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
 * Note: This method iterates the source sequence immediately and stores the results.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing two enumerable sequences: the first for elements satisfying the predicate, the second for the rest.
 */
export function partition<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];
export function partition<TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>];
export function partition<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
    return from(source).partition(predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>];
}

/**
 * Returns an enumerable sequence of permutations, each containing a permutation of the elements of the source sequence.
 * Note: This method first extracts distinct elements from the source before generating permutations.
 * @template TElement
 * @param source The source iterable.
 * @param size If specified, it will return only the permutations of the specified size. If not specified, it will return permutations of the size of the distinct elements in the source sequence.
 * @returns {IEnumerable<IEnumerable<TElement>>} An enumerable of enumerable sequences, each containing a permutation of the distinct elements of the source sequence.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 */
export const permutations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).permutations(size);
};

/**
 * Adds a value to the beginning of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param element The element to add to the sequence.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that starts with the specified element.
 */
export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
};

/**
 * Computes the product of the sequence. Assumes elements are numbers or uses a selector to get numbers.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select a numeric value from the sequence elements.
 * @returns {number} The product of the sequence. Returns 1 if the sequence is empty.
 * @throws {NoElementsException} If the source is empty.
 */
export const product = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).product(selector);
};

/**
 * Creates a range of numbers starting from the specified start value and containing the specified count of elements.
 * @param {number} start The start value of the range.
 * @param {number} count The number of elements in the range.
 * @returns {IEnumerable<number>} An enumerable range of numbers.*/
export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};

/**
 * Repeats the specified element a specified number of times.
 *
 * @template TElement The type of the element to repeat.
 * @param {TElement} element The element to repeat.
 * @param {number} count The number of times to repeat the element.
 * @returns {IEnumerable<TElement>} An Iterable representing the repeated elements.*/
export const repeat = <TElement>(element: TElement, count: number): IEnumerable<TElement> => {
    return Enumerable.repeat(element, count);
};

/**
 * Inverts the order of the elements in the sequence.
 *
 * Note: This method internally converts the sequence to an array to reverse it.
 * @template TElement
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are in the reverse order of the source sequence.
 */
export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
};

/**
 * Rotates the elements in the sequence by the specified amount while preserving the sequence length.
 * Positive values rotate elements towards the end (left rotation), and negative values rotate towards the beginning (right rotation).
 * @template TElement
 * @param source The source iterable.
 * @param shift The number of positions by which the sequence will be rotated.
 * @returns {IEnumerable<TElement>} A new enumerable sequence containing the rotated elements.
 */
export const rotate = <TElement>(source: Iterable<TElement>, shift: number): IEnumerable<TElement> => {
    return from(source).rotate(shift);
};

/**
 * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
 * If seed is specified, it is used as the initial value for the accumulator, but it is not included in the result sequence.
 * @template TAccumulate
 * @param source The source iterable.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param seed The value that will be used as the initial value. If not specified, the first element of the sequence will be used as the seed value and also included as the first element of the result.
 * @returns {IEnumerable<TAccumulate>} A new enumerable sequence whose elements are the result of each intermediate computation.
 * @throws {NoElementsException} If the source is empty and seed is not provided.
 */
export const scan = <TElement, TAccumulate = TElement>(
    source: Iterable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return from(source).scan(accumulator, seed);
};

/**
 * Projects each element of a sequence into a new form.
 * @template TResult
 * @param source The source iterable.
 * @param selector The selector function that will be used to project each element into a new form. The second parameter is the index.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the selector function.
 */
export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
};

/**
 * Projects each element of a sequence into a new form (which is an iterable) and flattens the resulting sequences into one sequence.
 * @template TResult
 * @param source The source iterable.
 * @param selector The selector function that will be used to project each element into a new iterable form. The second parameter is the index.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the flattened result of the selector function.
 */
export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
};

/**
 * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
 * Compares elements pairwise in order. Sequences must have the same length and equal elements at corresponding positions.
 * @param source The source iterable.
 * @param other The iterable sequence to compare to the source sequence.
 * @param comparator The equality comparer that will be used to compare the elements. If not specified, the default equality comparer will be used.
 * @returns {boolean} true if the two source sequences are of equal length and their corresponding elements are equal, according to the specified equality comparer; otherwise, false.
 */
export const sequenceEqual = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).sequenceEqual(other, comparator);
};

/**
 * Returns a new enumerable sequence whose elements are shuffled randomly.
 * Note: This method internally converts the sequence to an array to shuffle it.
 * @template TElement
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are shuffled.
 */
export const shuffle = <TElement>(
    source: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).shuffle();
};

/**
 * Returns the only element of a sequence and throws an exception if there is not exactly one element in the sequence.
 * Can optionally apply a predicate to filter the sequence first.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, checks the entire sequence.
 * @returns {TElement} The single element of the sequence (or the single element satisfying the predicate).
 * @throws {NoElementsException} If the source (or filtered sequence) is empty.
 * @throws {MoreThanOneElementException} If the source (or filtered sequence) contains more than one element.
 * @throws {NoMatchingElementException} If a predicate is specified and no element satisfies the condition.
 * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.
 */
export function single<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;
export function single<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement;
export function single<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered {
    return from(source).single(predicate as Predicate<TElement> | undefined);
}

/**
 * Returns the only element of a sequence, or a default value (null) if the sequence is empty.
 * Throws an exception if there is more than one element in the sequence (or more than one matching the predicate).
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, checks the entire sequence.
 * @returns {TElement|null} The single element of the sequence (or the single element satisfying the predicate), or null if the sequence (or filtered sequence) is empty.
 * @throws {MoreThanOneElementException} If the source contains more than one element (and no predicate is used).
 * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.
 */
export function singleOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;
export function singleOrDefault<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null;
export function singleOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered | null {
    return from(source).singleOrDefault(predicate as Predicate<TElement> | undefined);
}

/**
 * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to skip before returning the remaining elements. If the count is zero or negative, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements that occur after the specified number of skipped elements.
 */
export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
};

/**
 * Returns a new enumerable sequence that contains the elements from the source with the last count elements of the source sequence omitted.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to omit from the end of the collection. If the count is zero or negative, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from source with the last count elements omitted.
 */
export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skipLast(count);
};

/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * The element that first fails the condition is included in the result.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function (accepting element and index) that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements starting from the first element that does not satisfy the predicate.
 */
export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
};

/**
 * Splits the sequence into two sequences based on a predicate.
 * The first sequence contains the elements from the start of the input sequence that satisfy the predicate continuously.
 * The second sequence contains the remaining elements, starting from the first element that failed the predicate.
 * Note: This method iterates the source sequence immediately and stores the results.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to test each element.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences.
 */
export function span<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<TElement>];
export function span<TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>];
export function span<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
    return from(source).span(predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>];
}

/**
 * Selects elements from a sequence at regular intervals (steps).
 * Includes the first element (index 0) and then every 'step'-th element after that.
 * @template TElement
 * @param source The source iterable.
 * @param step The number of elements to skip between included elements. Must be 1 or greater.
 * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements at the specified step intervals.
 * @throws {InvalidArgumentException} If the step is less than 1.
 */
export const step = <TElement>(
    source: Iterable<TElement>,
    step: number
): IEnumerable<TElement> => {
    return from(source).step(step);
};

/**
 * Returns the sum of the values in the sequence. Assumes elements are numbers or uses a selector to get numbers.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the numeric value to sum. If not specified, the element itself is used.
 * @returns {number} The sum of the values in the sequence. Returns 0 if the sequence is empty.
 * @throws {NoElementsException} If the source is empty.
 */
export const sum = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).sum(selector);
};

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
 */
export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
};

/**
 * Returns a specified number of contiguous elements from the end of a sequence.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the end of the input sequence.
 */
export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
};

/**
 * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function (accepting element and index) that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
 */
export function takeWhile<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;
export function takeWhile<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;
export function takeWhile<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).takeWhile(predicate as IndexedPredicate<TElement>);
}

/**
 * Invokes the specified action on each element while yielding the original sequence unchanged.
 * @template TElement
 * @param source The source iterable.
 * @param action The action to perform for each element. The second parameter is the element index.
 * @returns {IEnumerable<TElement>} The original sequence, enabling fluent chaining.*/
export const tap = <TElement>(source: Iterable<TElement>, action: IndexedAction<TElement>): IEnumerable<TElement> => {
    return from(source).tap(action);
};

/**
 * Creates a new array from the elements of the sequence.
 * This forces evaluation of the entire sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {TElement[]} An array that contains the elements from the input sequence.
 */
export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
};

/**
 * Creates a new circular linked list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {CircularLinkedList<TElement>} A new circular linked list that contains the elements from the input sequence.
 */
export const toCircularLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularLinkedList<TElement> => {
    return from(source).toCircularLinkedList(comparator);
};

/**
 * Creates a new circular queue from the elements of the source sequence.
 * The queue retains only the most recent values up to the specified capacity, discarding older entries when full.
 * Forces evaluation of the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @param capacity Optional capacity for the resulting queue. If omitted, the queue's default capacity is used.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {CircularQueue<TElement>} A new circular queue that contains the retained elements from the input sequence.
 */
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement>;
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacity: number,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement>;
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacityOrComparator?: number | EqualityComparator<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement> {
    if (typeof capacityOrComparator === "number") {
        return from(source).toCircularQueue(capacityOrComparator, comparator);
    }
    return from(source).toCircularQueue(capacityOrComparator);
}

/**
 * Creates a new dictionary from the elements of the sequence.
 * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
 * @template TKey, TValue
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
 * @returns {Dictionary<TKey, TValue>} A new dictionary that contains the elements from the input sequence.
 */
export const toDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): Dictionary<TKey, TValue> => {
    return from(source).toDictionary(keySelector, valueSelector, valueComparator);
};

/**
 * Creates a new enumerable set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {EnumerableSet<TElement>} An enumerable set that contains the distinct elements from the input sequence.
 */
export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
};

/**
 * Creates a new immutable circular queue from the elements of the source sequence.
 * The queue keeps only the most recent values up to the specified capacity and discards older entries when the capacity is exceeded.
 * Forces evaluation of the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @param capacity Optional capacity for the resulting queue. If omitted, the queue's default capacity is used.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableCircularQueue<TElement>} A new immutable circular queue that contains the retained elements from the input sequence.
 */
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement>;
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacity: number,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement>;
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacityOrComparator?: number | EqualityComparator<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement> {
    if (typeof capacityOrComparator === "number") {
        return from(source).toImmutableCircularQueue(capacityOrComparator, comparator);
    }
    return from(source).toImmutableCircularQueue(capacityOrComparator);
}

/**
 * Creates a new immutable dictionary from the elements of the sequence.
 * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
 * @template TKey, TValue
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
 * @returns {ImmutableDictionary<TKey, TValue>} A new immutable dictionary that contains the elements from the input sequence.
 */
export const toImmutableDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableDictionary<TKey, TValue> => {
    return from(source).toImmutableDictionary(keySelector, valueSelector, valueComparator);
};

/**
 * Creates a new immutable list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableList<TElement>} A new immutable list that contains the elements from the input sequence.
 */
export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
};

/**
 * Creates a new immutable priority queue from the elements of the sequence.
 * Forces evaluation of the sequence. Elements are ordered based on the comparator.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used.
 * @returns {ImmutablePriorityQueue<TElement>} A new immutable priority queue that contains the elements from the input sequence.
 */
export const toImmutablePriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutablePriorityQueue<TElement> => {
    return from(source).toImmutablePriorityQueue(comparator);
};

/**
 * Creates a new immutable queue from the elements of the sequence (FIFO).
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableQueue<TElement>} A new immutable queue that contains the elements from the input sequence.
 */
export const toImmutableQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableQueue<TElement> => {
    return from(source).toImmutableQueue(comparator);
};

/**
 * Creates a new immutable set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {ImmutableSet<TElement>} A new immutable set that contains the distinct elements from the input sequence.
 */
export const toImmutableSet = <TElement>(
    source: Iterable<TElement>
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
};

/**
 * Creates a new immutable sorted dictionary from the elements of the sequence.
 * Forces evaluation of the sequence. Keys are sorted. Throws if duplicate keys are encountered.
 * @template TKey, TValue
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys for sorting. If not specified, the default order comparer will be used.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
 * @returns {ImmutableSortedDictionary<TKey, TValue>} A new immutable sorted dictionary that contains the elements from the input sequence.
 */
export const toImmutableSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableSortedDictionary<TKey, TValue> => {
    return from(source).toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
};

/**
 * Creates a new immutable sorted set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence. Elements are sorted.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
 * @returns {ImmutableSortedSet<TElement>} A new immutable sorted set that contains the distinct, sorted elements from the input sequence.
 */
export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
};

/**
 * Creates a new immutable stack from the elements of the sequence (LIFO).
 * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableStack<TElement>} A new immutable stack that contains the elements from the input sequence.
 */
export const toImmutableStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableStack<TElement> => {
    return from(source).toImmutableStack(comparator);
};

/**
 * Creates a new linked list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {LinkedList<TElement>} A new linked list that contains the elements from the input sequence.
 */
export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
};

/**
 * Creates a new list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @param source The source iterable.
 * @template TElement
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {List<TElement>} A new list that contains the elements from the input sequence.
 */
export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
};

/**
 * Creates a new lookup from the elements of the sequence. A lookup is similar to a dictionary but allows multiple values per key.
 * Forces evaluation of the sequence.
 * @template TKey
 * @template TValue
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, the default equality comparer will be used.
 * @returns {ILookup<TKey, TValue>} A new lookup that contains the elements from the input sequence, grouped by key.
 */
export const toLookup = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>
): ILookup<TKey, TValue> => {
    return from(source).toLookup(keySelector, valueSelector, keyComparator);
};

/**
 * Converts this enumerable to a JavaScript Map.
 * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
 * @template TKey
 * @template TValue
 * @param source The source iterable.
 * @param keySelector The selector that will be used to select the property that will be used as the key of the map.
 * @param valueSelector The selector that will be used to select the property that will be used as the value of the map.
 * @returns {Map<TKey, TValue>} A Map representation of this sequence.
 */
export const toMap = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Map<TKey, TValue> => {
    return from(source).toMap(keySelector, valueSelector);
};

/**
 * Converts this enumerable to a JavaScript object (Record).
 * Forces evaluation of the sequence. If duplicate keys are encountered, the last value for that key overwrites previous ones.
 * @template TKey
 * @template TValue
 * @param source The source iterable.
 * @param keySelector The selector that will be used to select the property that will be used as the key of the object. Must return string, number, or symbol.
 * @param valueSelector The selector that will be used to select the property that will be used as the value of the object.
 * @returns {Record<TKey, TValue>} An object that contains the elements of the sequence.
 */
export const toObject = <TElement, TKey extends PropertyKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Record<TKey, TValue> => {
    return from(source).toObject(keySelector, valueSelector);
};

/**
 * Creates a new priority queue from the elements of the sequence.
 * Forces evaluation of the sequence. Elements are ordered based on the comparator.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used (min-heap).
 * @returns {PriorityQueue<TElement>} A new priority queue that contains the elements from the input sequence.
 */
export const toPriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): PriorityQueue<TElement> => {
    return from(source).toPriorityQueue(comparator);
};

/**
 * Creates a new queue from the elements of the sequence (FIFO).
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {Queue<TElement>} A new queue that contains the elements from the input sequence.
 */
export const toQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Queue<TElement> => {
    return from(source).toQueue(comparator);
};

/**
 * Creates a new JavaScript Set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {Set<TElement>} A new Set that contains the distinct elements from the input sequence.
 */
export const toSet = <TElement>(
    source: Iterable<TElement>
): Set<TElement> => {
    return from(source).toSet();
};

/**
 * Creates a new sorted dictionary from the elements of the sequence.
 * Forces evaluation of the sequence. Keys are sorted. Throws if duplicate keys are encountered.
 * @template TKey
 * @template TValue
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param valueSelector The value selector function that will be used to select the value for an element.
 * @param keyComparator The key comparator function that will be used to compare two keys for sorting. If not specified, the default order comparer will be used.
 * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
 * @returns {SortedDictionary<TKey, TValue>} A new sorted dictionary that contains the elements from the input sequence.
 */
export const toSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): SortedDictionary<TKey, TValue> => {
    return from(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
};

/**
 * Creates a new sorted set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence. Elements are sorted.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
 * @returns {SortedSet<TElement>} A new sorted set that contains the distinct, sorted elements from the input sequence.
 */
export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
};

/**
 * Creates a new stack from the elements of the sequence (LIFO).
 * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {Stack<TElement>} A new stack that contains the elements from the input sequence.
 */
export const toStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Stack<TElement> => {
    return from(source).toStack(comparator);
};

/**
 * Produces the set union of two sequences by using an equality comparer.
 * The result contains all unique elements from both sequences.
 * @template TElement
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding duplicates. Order is preserved from the original sequences, with elements from the first sequence appearing before elements from the second.
 */
export const union = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(other, comparator);
};

/**
 * Produces the set union of two sequences by using a key selector function.
 * The result contains all elements from both sequences whose selected keys are unique.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The equality comparator function that will be used to compare two keys. If not specified, the default equality comparer will be used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding elements with duplicate keys based on the selector. Order is preserved.
 */
export const unionBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).unionBy(other, keySelector, comparator);
};

/**
 * Filters a sequence of values based on a predicate.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function (accepting element and index) that will be used to test each element. Return true to keep the element, false to filter it out.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains elements from the input sequence that satisfy the condition.
 */
export function where<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;
export function where<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;
export function where<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).where(predicate as IndexedPredicate<TElement>);
}

/**
 * Returns an enumerable sequence of sliding windows of the specified size over the source sequence.
 * Each window is an IEnumerable itself.
 * @template TElement
 * @param source The source iterable.
 * @param size The size of the windows. Must be 1 or greater.
 * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence where each element is a window (as an IEnumerable) of the specified size.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 */
export const windows = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).windows(size);
};

/**
 * Applies a specified function (zipper) to the corresponding elements of two sequences, producing a sequence of the results.
 * If the two sequences are of different lengths, the resulting sequence will have the length of the shorter sequence.
 * @template TElement The type of elements in the first sequence.
 * @template TSecond The type of elements in the second sequence.
 * @template TResult The type of elements in the result sequence, as determined by the zipper function.
 * @param source The source iterable.
 * @param other The iterable sequence to merge with the first sequence.
 * @param zipper The function that specifies how to merge the elements from the two sequences into a result element.
 * @returns {IEnumerable<TResult>} A new enumerable sequence that contains the result of applying the zipper function to corresponding elements.
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
};
