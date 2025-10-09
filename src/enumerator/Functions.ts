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
 * Supplies fallback content when the sequence contains no elements.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param value Optional value returned in a singleton sequence when the source is empty. Defaults to `null`.
 * @returns {IEnumerable<TElement | null>} The original sequence when it has elements; otherwise, a singleton sequence containing the provided value.
 * @remarks Use this to ensure downstream operators always receive at least one element.
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(value);
};

/**
 * Eliminates duplicate elements from the sequence using an optional comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields each distinct element once.
 * @remarks Elements are compared by value; provide a comparator for custom reference types.
 */
export const distinct = <TElement>(
    source: Iterable<TElement>,
    keyComparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).distinct(keyComparator);
};

/**
 * Eliminates duplicate elements by comparing keys computed for each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Key type returned by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for distinctness.
 * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that contains the first occurrence of each unique key.
 * @remarks Each element's key is evaluated exactly once; cache expensive key computations when possible.
 */
export const distinctBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinctBy(keySelector, keyComparator);
};

/**
 * Removes consecutive duplicate elements by comparing each element with its predecessor.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used to determine whether adjacent elements are equal. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields the first element of each run of equal values.
 * @remarks Unlike {@link distinct}, this only filters adjacent duplicates and preserves earlier occurrences of repeated values.
 */
export const distinctUntilChanged = <TElement>(source: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> => {
    return from(source).distinctUntilChanged(comparator);
};

/**
 * Removes consecutive duplicate elements by comparing keys projected from each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Key type returned by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields the first element in each run of elements whose keys change.
 * @remarks Enumeration stops comparing elements once a different key is encountered, making this useful for collapsing grouped data.
 */
export const distinctUntilChangedBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinctUntilChangedBy(keySelector, keyComparator);
};

/**
 * Retrieves the element at the specified zero-based index.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param index Zero-based position of the element to retrieve.
 * @returns {TElement} The element located at the requested index.
 * @throws {IndexOutOfBoundsException} Thrown when `index` is negative or greater than or equal to the number of elements in {@link source}.
 * @remarks Enumeration stops once the requested element is found; remaining elements are not evaluated.
 */
export const elementAt = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement => {
    return from(source).elementAt(index);
};

/**
 * Retrieves the element at the specified zero-based index or returns `null` when the index is out of range.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param index Zero-based position of the element to retrieve.
 * @returns {TElement | null} The element at `index`, or `null` when {@link source} is shorter than `index + 1` or when `index` is negative.
 * @remarks Use this overload when out-of-range access should produce a sentinel value instead of throwing an exception.
 */
export const elementAtOrDefault = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement | null => {
    return from(source).elementAtOrDefault(index);
};

/**
 * Creates an empty sequence.
 * @template TElement Type of elements that the returned sequence can produce.
 * @returns {IEnumerable<TElement>} A reusable, cached empty sequence.
 * @remarks The returned instance is immutable and can be shared safely across callers.
 */
export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};

/**
 * Returns the elements of {@link source} that are not present in {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Sequence whose elements should be removed from {@link source}.
 * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the elements from {@link source} that do not appear in {@link other}.
 * @remarks The original ordering and duplicate occurrences from {@link source} are preserved. {@link other} is fully enumerated to build the exclusion set.
 */
export const except = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).except(other, comparator);
};

/**
 * Returns the elements of {@link source} whose projected keys are not present in {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type produced by `keySelector`.
 * @param source The source iterable.
 * @param other Sequence whose elements define the keys that should be excluded.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence that contains the elements from {@link source} whose keys are absent from {@link other}.
 * @remarks Source ordering is preserved and duplicate elements with distinct keys remain. {@link other} is fully enumerated to materialise the exclusion keys.
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
 * Returns the first element in the sequence, optionally filtered by a predicate or type guard.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element; when omitted, the first element is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered} The first element that satisfies the predicate (or the very first element when none is provided).
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks Enumeration stops immediately once a matching element is found.
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
 * Returns the first element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element; when omitted, the first element is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered | null} The first matching element, or `null` when no match is found.
 * @remarks This function never throws for missing elements; it communicates absence through the `null` return value.
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
 * Executes the provided callback for every element in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param action Callback invoked for each element; receives the element and its zero-based index.
 * @returns {void}
 * @remarks Enumeration starts immediately. Avoid mutating the underlying collection while iterating.
 */
export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
};

/**
 * Wraps an iterable with the library's `IEnumerable` implementation.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The iterable to expose as an enumerable sequence.
 * @returns {IEnumerable<TElement>} An enumerable view over the given iterable.
 * @remarks The returned sequence defers enumeration of {@link source} until iterated.
 */
export const from = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return Enumerable.from(source);
};

/**
 * Partitions the sequence into groups based on keys projected from each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the grouping key for each element.
 * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<IGroup<TKey, TElement>>} A sequence of groups, each exposing the key and the elements that share it.
 * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration.
 */
export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return from(source).groupBy(keySelector, keyComparator);
};

/**
 * Correlates each element of the sequence with a collection of matching elements from another sequence.
 * @template TElement Type of elements within the outer sequence.
 * @template TInner Type of elements within the inner sequence.
 * @template TKey Type of key produced by the key selectors.
 * @template TResult Type of element returned by {@link resultSelector}.
 * @param source The outer sequence.
 * @param innerEnumerable Sequence whose elements are grouped and joined with the outer elements.
 * @param outerKeySelector Selector that extracts the join key from each outer element.
 * @param innerKeySelector Selector that extracts the join key from each inner element.
 * @param resultSelector Projection that combines an outer element with an `IEnumerable` of matching inner elements.
 * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TResult>} A sequence produced by applying {@link resultSelector} to each outer element and its matching inner elements.
 * @remarks The inner sequence is enumerated once to build an in-memory lookup before outer elements are processed. Each outer element is then evaluated lazily and preserves the original outer ordering.
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
 * Enumerates the sequence while exposing the zero-based index alongside each element.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<[number, TElement]>} A sequence of `[index, element]` tuples.
 * @remarks The index is assigned in the order elements are produced. Enumeration is deferred until the result is iterated.
 */
export const index = <TElement>(source: Iterable<TElement>): IEnumerable<[number, TElement]> => {
    return from(source).index();
};

/**
 * Interleaves the sequence with another iterable, yielding elements in alternating order.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements in the second iterable.
 * @param source The source iterable.
 * @param other Iterable whose elements are alternated with the current sequence.
 * @returns {IEnumerable<TElement | TSecond>} A sequence that alternates between elements from {@link source} and {@link other}.
 * @remarks If one sequence is longer, the remaining elements are appended after the shorter sequence is exhausted. Enumeration is deferred.
 */
export const interleave = <TElement, TSecond>(source: Iterable<TElement>, other: Iterable<TSecond>): IEnumerable<TElement | TSecond> => {
    return from(source).interleave(other);
};

/**
 * Returns the elements common to {@link source} and {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Iterable whose elements are compared against {@link source}.
 * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences.
 * @remarks The original ordering of {@link source} is preserved. {@link other} is fully enumerated to build the inclusion set prior to yielding results.
 */
export const intersect = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).intersect(other, comparator);
};

/**
 * Returns the elements whose keys are common to {@link source} and {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param other Iterable whose elements define the keys considered part of the intersection.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences based on matching keys.
 * @remarks {@link other} is fully enumerated to materialise the inclusion keys before yielding results. Source ordering is preserved.
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
 * Inserts the specified separator between adjoining elements.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSeparator Type of separator to insert.
 * @param source The source iterable.
 * @param separator Value inserted between consecutive elements.
 * @returns {IEnumerable<TElement | TSeparator>} A sequence containing the original elements with separators interleaved.
 * @remarks No separator precedes the first element or follows the last element.
 */
export const intersperse = <TElement, TSeparator>(
    source: Iterable<TElement>,
    separator: TSeparator
): IEnumerable<TElement | TSeparator> => {
    return from(source).intersperse(separator);
};

/**
 * Produces a projection from the sequence and a second sequence by matching elements that share an identical join key.
 * @template TElement Type of elements within the outer sequence.
 * @template TInner Type of elements within the inner sequence.
 * @template TKey Type of key produced by the key selectors.
 * @template TResult Type of element returned by {@link resultSelector}.
 * @param source The outer sequence.
 * @param innerEnumerable Sequence whose elements are joined with the outer sequence.
 * @param outerKeySelector Selector that extracts the join key from each outer element.
 * @param innerKeySelector Selector that extracts the join key from each inner element.
 * @param resultSelector Projection that combines an outer element with a matching inner element. When {@link leftJoin} is `true` and no match exists, `null` is supplied as the inner value.
 * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison when omitted.
 * @param leftJoin When `true`, outer elements with no matching inner element are included once with `null` provided to {@link resultSelector}. Defaults to `false` (inner join).
 * @returns {IEnumerable<TResult>} A sequence generated by applying {@link resultSelector} to each matching pair (and unmatched outer elements when {@link leftJoin} is enabled).
 * @remarks The inner sequence is fully enumerated to build an in-memory lookup before outer elements are processed. The outer sequence is then enumerated lazily and its original ordering is preserved.
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
 * Returns the last element in the sequence, optionally filtered by a predicate or type guard.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered} The last element that satisfies the predicate (or the final element when no predicate is supplied).
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks The entire sequence is enumerated to locate the final match.
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
 * Returns the last element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered | null} The last element that satisfies the predicate, or `null` when no match is found.
 * @remarks The entire sequence is enumerated to locate the final match. This function never throws for missing elements; it communicates absence through the `null` return value.
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
 * Returns the largest numeric value produced for the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The maximum of the projected values.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
 */
export const max = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).max(selector);
};

/**
 * Returns the element whose projected key is greatest according to the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
 * @returns {TElement} The element whose key is maximal.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When multiple elements share the maximal key, the first such element in the sequence is returned.
 */
export const maxBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).maxBy(keySelector, comparator);
};

/**
 * Returns the smallest numeric value produced for the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The minimum of the projected values.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
 */
export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
};

/**
 * Returns the element whose projected key is smallest according to the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
 * @returns {TElement} The element whose key is minimal.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When multiple elements share the minimal key, the first such element in the sequence is returned.
 */
export const minBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).minBy(keySelector, comparator);
};

/**
 * Determines whether the sequence contains no elements that satisfy the optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the function returns `true` if the sequence is empty.
 * @returns {boolean} `true` when no element satisfies the predicate (or when the sequence is empty and no predicate is provided); otherwise, `false`.
 * @remarks This is more efficient than negating `any` with a predicate because iteration stops as soon as a matching element is found.
 */
export const none = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).none(predicate);
};

/**
 * Filters the sequence, keeping only elements assignable to the specified type.
 * @template TElement Type of elements within the `source` iterable.
 * @template TResult Type descriptor used to filter elements (constructor function or primitive type string).
 * @param source The source iterable.
 * @param type Type descriptor that determines which elements are retained (e.g., `'string'`, `Number`, `Date`).
 * @returns {IEnumerable<InferredType<TResult>>} A sequence containing only the elements that match the specified type.
 * @remarks This function performs a runtime type check for each element and yields matching elements lazily.
 */
export const ofType = <TElement, TResult extends ObjectType>(
    source: Iterable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return from(source).ofType(type);
};

/**
 * Sorts the elements of the sequence in ascending order using the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
 * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted ascending.
 * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
 */
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
 * Sorts the elements of the sequence in descending order using the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
 * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted descending.
 * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
 */
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
