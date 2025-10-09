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
     * Asynchronously combines the elements of the sequence by applying an accumulator to each element and optionally projecting the final result.
     * @template TAccumulate Type of the intermediate accumulator. Defaults to `TElement` when no seed is provided.
     * @template TResult Type returned when a `resultSelector` is supplied.
     * @param accumulator Function that merges the running accumulator with the next element.
     * @param seed Optional initial accumulator value. When omitted, the first element is used as the starting accumulator.
     * @param resultSelector Optional projection applied to the final accumulator before it is resolved.
     * @returns {Promise<TAccumulate|TResult>} A promise that resolves to the final accumulator (or its projection).
     * @throws {NoElementsException} Thrown when the sequence is empty and no `seed` is provided.
     * @remarks The source sequence is enumerated asynchronously exactly once. Supply a `seed` to avoid exceptions on empty sequences and to control the accumulator type.
     */
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult>;

    /**
     * Groups elements by a computed key and aggregates each group by applying an accumulator within that group.
     * @template TKey Type returned by `keySelector` and used to organise groups.
     * @template TAccumulate Type of the accumulated value created for each group.
     * @param keySelector Selector that derives the grouping key for each element.
     * @param seedSelector Either an initial accumulator value applied to every group or a factory invoked with the group key to produce that value.
     * @param accumulator Function that merges the current accumulator with the next element in the group.
     * @param keyComparator Optional equality comparator used to match group keys.
     * @returns {IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>>} An async sequence containing one key-value pair per group and its aggregated result.
     * @remarks When `seedSelector` is a function, it is evaluated once per group to obtain the initial accumulator.
     */
    aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>>

    /**
     * Determines whether every element in the sequence satisfies the supplied predicate.
     * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
     * @returns {Promise<boolean>} `true` when all elements satisfy the predicate; otherwise, `false`.
     * @remarks Enumeration stops as soon as the predicate returns `false`.
     */
    all(predicate: Predicate<TElement>): Promise<boolean>;

    /**
     * Determines whether the sequence contains at least one element that matches the optional predicate.
     * @param predicate Optional function used to test elements. When omitted, the method resolves to `true` if the sequence contains any element.
     * @returns {Promise<boolean>} `true` when a matching element is found; otherwise, `false`.
     * @remarks When the predicate is omitted, only the first element is inspected, making this more efficient than awaiting `count() > 0`.
     */
    any(predicate?: Predicate<TElement>): Promise<boolean>;

    /**
     * Creates an async sequence that yields the current elements followed by the supplied element.
     * @param element Element appended to the end of the sequence.
     * @returns {IAsyncEnumerable<TElement>} A new async enumerable whose final item is the provided element.
     * @remarks The source sequence is not modified; enumeration is deferred until the returned sequence is iterated.
     */
    append(element: TElement): IAsyncEnumerable<TElement>;

    /**
     * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {Promise<number>} A promise that resolves to the arithmetic mean of the selected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
     */
    average(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Reinterprets each element in the async sequence as the specified result type.
     * @template TResult Target type exposed by the returned sequence.
     * @returns {IAsyncEnumerable<TResult>} An async sequence that yields the same elements typed as `TResult`.
     * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
     */
    cast<TResult>(): IAsyncEnumerable<TResult>;

    /**
     * Splits the sequence into contiguous subsequences containing at most the specified number of elements.
     * @param size Maximum number of elements to include in each chunk. Must be greater than 0.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} An async sequence whose elements are chunks of the original sequence.
     * @throws {InvalidArgumentException} Thrown when `size` is less than 1.
     * @remarks Each chunk is yielded as an `IEnumerable<TElement>`. The final chunk may contain fewer elements than `size`.
     */
    chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Generates the unique combinations that can be built from the elements in the async sequence.
     * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} An async sequence of combinations built from the source elements.
     * @throws {InvalidArgumentException} Thrown when `size` is negative.
     * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
     */
    combinations(size?: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Appends the specified async iterable to the end of the sequence.
     * @param other Additional elements that are yielded after the current sequence.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the elements of the current sequence followed by those from `other`.
     * @remarks Enumeration of both sequences is deferred until the result is iterated.
     */
    concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Determines whether the async sequence contains a specific element using an optional comparator.
     * @param element Element to locate in the sequence.
     * @param comparator Optional equality comparator used to match elements. Defaults to the library's standard equality comparison.
     * @returns {Promise<boolean>} `true` when the element is found; otherwise, `false`.
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean>;

    /**
     * Counts the number of elements in the async sequence, optionally restricted by a predicate.
     * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
     * @returns {Promise<number>} A promise that resolves to the number of elements that satisfy the predicate.
     * @remarks Prefer calling `any()` to test for existence instead of comparing this result with zero.
     */
    count(predicate?: Predicate<TElement>): Promise<number>;

    /**
     * Counts the occurrences of elements grouped by a derived key.
     * @template TKey Type produced by `keySelector`.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param comparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<KeyValuePair<TKey, number>>} An async sequence of key/count pairs describing how many elements share each key.
     * @remarks Each key appears exactly once in the result with its associated occurrence count.
     */
    countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>>;

    /**
     * Repeats the async sequence the specified number of times, or indefinitely when no count is provided.
     * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields the original elements cyclically.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
     */
    cycle(count?: number): IAsyncEnumerable<TElement>;

    /**
     * Supplies fallback content when the async sequence contains no elements.
     * @param defaultValue Optional value returned in a singleton sequence when the source is empty. Defaults to `null`.
     * @returns {IAsyncEnumerable<TElement | null>} The original sequence when it has elements; otherwise, a singleton sequence containing the provided value.
     * @remarks Use this to guarantee that downstream async operators receive at least one element.
     */
    defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null>;

    /**
     * Eliminates duplicate elements from the async sequence using an optional comparator.
     * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields each distinct element once.
     * @remarks Elements are compared by value; when using custom types, provide an appropriate comparator to avoid reference-based comparisons.
     */
    distinct(keyComparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Eliminates duplicate elements by comparing keys computed for each async element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for distinctness.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that contains the first occurrence of each unique key.
     * @remarks Each element's key is evaluated exactly once; cache expensive key computations when possible.
     */
    distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing each yielded value with its predecessor.
     * @param comparator Optional equality comparator used to determine whether adjacent elements are equal. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields the first element of each run of equal values.
     * @remarks Unlike {@link distinct}, this only filters adjacent duplicates and preserves earlier occurrences of repeated values.
     */
    distinctUntilChanged(comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing keys projected from each element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields the first element in each run of elements whose keys change.
     * @remarks Enumeration stops comparing elements once a different key is encountered, making this useful for collapsing grouped async data.
     */
    distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Asynchronously retrieves the element at the specified zero-based index.
     * @param index Zero-based position of the element to retrieve.
     * @returns {Promise<TElement>} A promise that resolves to the element located at the requested index.
     * @throws {IndexOutOfBoundsException} Thrown when `index` is negative or greater than or equal to the number of elements in the sequence.
     * @throws {NoSuchElementException} Thrown when the sequence terminates unexpectedly before yielding the requested element.
     * @remarks Enumeration stops once the requested element is found; remaining elements are not evaluated.
     */
    elementAt(index: number): Promise<TElement>;

    /**
     * Asynchronously retrieves the element at the specified zero-based index or resolves to `null` when the index is out of range.
     * @param index Zero-based position of the element to retrieve.
     * @returns {Promise<TElement | null>} A promise that resolves to the element at `index`, or `null` when the sequence is shorter than `index + 1` or when `index` is negative.
     * @remarks Use this overload when out-of-range access should produce a sentinel value instead of throwing an exception.
     */
    elementAtOrDefault(index: number): Promise<TElement | null>;

    /**
     * Returns the elements of this async sequence that are not present in the specified async iterable.
     * @param enumerable Async sequence whose elements should be removed from the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the elements from this sequence that do not appear in `enumerable`.
     * @remarks The original ordering and duplicate occurrences from this sequence are preserved. The `enumerable` is fully enumerated to build the exclusion set.
     */
    except(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Returns the elements of this async sequence whose projected keys are not present in the specified async iterable.
     * @template TKey Type produced by `keySelector`.
     * @param enumerable Async sequence whose elements define the keys that should be excluded.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param comparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that contains the elements from this sequence whose keys are absent from `enumerable`.
     * @remarks Source ordering is preserved and duplicate elements with distinct keys remain. The exclusion keys are materialised by fully enumerating `enumerable`.
     */
    exceptBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Asynchronously returns the first element that satisfies the provided type guard.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element until it returns true.
     * @returns {Promise<TFiltered>} A promise that resolves to the first element satisfying the type guard.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when no element satisfies the type guard.
     * @remarks Enumeration stops immediately once a matching element is found.
     */
    first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;

    /**
     * Asynchronously returns the first element in the sequence, optionally filtered by a predicate.
     * @param predicate Predicate evaluated against each element; when omitted, the first element is returned.
     * @returns {Promise<TElement>} A promise that resolves to the first element satisfying the predicate (or the very first element when none is provided).
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
     * @remarks Enumeration stops immediately once a matching element is found.
     */
    first(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Asynchronously returns the first element that satisfies the provided type guard, or `null` when no such element exists.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element until it returns true.
     * @returns {Promise<TFiltered | null>} A promise that resolves to the first element satisfying the type guard, or `null` when none match.
     * @remarks Enumeration stops immediately once a matching element is found.
     */
    firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;

    /**
     * Asynchronously returns the first element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
     * @param predicate Predicate evaluated against each element; when omitted, the first element is returned.
     * @returns {Promise<TElement | null>} A promise that resolves to the first matching element, or `null` when no match is found.
     * @remarks This method never rejects for missing elements; it communicates absence through the `null` result.
     */
    firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Executes the provided callback for every element in the async sequence.
     * @param action Callback invoked for each element; receives the element and its zero-based index.
     * @returns {Promise<void>} A promise that resolves when iteration completes.
     * @remarks Enumeration starts immediately. Avoid mutating the underlying collection while iterating.
     */
    forEach(action: IndexedAction<TElement>): Promise<void>;

    /**
     * Partitions the async sequence into groups based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<IGroup<TKey, TElement>>} An async sequence of groups, each exposing the key and the elements that share it.
     * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration.
     */
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<IGroup<TKey, TElement>>;

    /**
     * Correlates each element of the async sequence with a collection of matching elements from another async sequence.
     * @template TInner Type of elements in the inner sequence.
     * @template TKey Type of key produced by the key selectors.
     * @template TResult Type of element returned by {@link resultSelector}.
     * @param inner Async sequence whose elements are grouped and joined with the outer elements.
     * @param outerKeySelector Selector that extracts the join key from each outer element.
     * @param innerKeySelector Selector that extracts the join key from each inner element.
     * @param resultSelector Projection that combines an outer element with an `IEnumerable` of matching inner elements.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TResult>} An async sequence produced by applying {@link resultSelector} to each outer element and its matching inner elements.
     * @remarks The inner sequence is enumerated once to build an in-memory lookup before outer elements are processed. Each outer element is then evaluated lazily and preserves the original outer ordering.
     */
    groupJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult>;

    /**
     * Enumerates the async sequence while exposing the zero-based index alongside each element.
     * @returns {IAsyncEnumerable<[number, TElement]>} An async sequence of `[index, element]` tuples.
     * @remarks The index is assigned in the order elements are produced. Enumeration is deferred until the result is iterated.
     */
    index(): IAsyncEnumerable<[number, TElement]>;

    /**
     * Interleaves the async sequence with another iterable, yielding elements in alternating order.
     * @template TSecond Type of elements in the second iterable.
     * @param iterable Async iterable whose elements are alternated with the current sequence.
     * @returns {IAsyncEnumerable<TElement | TSecond>} An async sequence that alternates between elements from this sequence and `iterable`.
     * @remarks If one sequence is longer, the remaining elements are appended after the shorter sequence is exhausted. Enumeration is deferred.
     */
    interleave<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<TElement | TSecond>;

    /**
     * Returns the elements common to this async sequence and the specified iterable.
     * @param enumerable Async sequence whose elements are compared against the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the intersection of the two sequences.
     * @remarks The original ordering of this sequence is preserved. The `enumerable` is fully enumerated to build the inclusion set prior to yielding results.
     */
    intersect(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Returns the elements whose keys are common to this async sequence and the specified iterable.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param enumerable Async sequence whose elements define the keys considered part of the intersection.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param comparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the intersection of the two sequences based on matching keys.
     * @remarks The `enumerable` is fully enumerated to materialise the inclusion keys before yielding results. Source ordering is preserved.
     */
    intersectBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Inserts the specified separator between adjoining elements.
     * @template TSeparator Type of separator to insert. Defaults to `TElement`.
     * @param separator Value inserted between consecutive elements.
     * @returns {IAsyncEnumerable<TElement | TSeparator>} An async sequence containing the original elements with separators interleaved.
     * @remarks No separator precedes the first element or follows the last element.
     */
    intersperse<TSeparator = TElement>(separator: TSeparator): IAsyncEnumerable<TElement | TSeparator>;

    /**
     * Produces a projection from the async sequence and a second async sequence by matching elements that share an identical join key.
     * @template TInner Type of elements in the inner sequence.
     * @template TKey Type of key produced by the key selectors.
     * @template TResult Type of element returned by {@link resultSelector}.
     * @param inner Async sequence whose elements are joined with the outer sequence.
     * @param outerKeySelector Selector that extracts the join key from each outer element.
     * @param innerKeySelector Selector that extracts the join key from each inner element.
     * @param resultSelector Projection that combines an outer element with a matching inner element. When {@link leftJoin} is `true` and no match exists, `null` is supplied as the inner value.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison when omitted.
     * @param leftJoin When `true`, outer elements with no matching inner element are included once with `null` provided to {@link resultSelector}. Defaults to `false` (inner join).
     * @returns {IAsyncEnumerable<TResult>} An async sequence generated by applying {@link resultSelector} to each matching pair (and unmatched outer elements when {@link leftJoin} is enabled).
     * @remarks The inner sequence is fully enumerated to build an in-memory lookup before outer elements are processed. The outer sequence is then enumerated lazily and its original ordering is preserved.
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
