import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    CircularLinkedList,
    CircularQueue,
    Dictionary,
    EnumerableSet,
    IGroup,
    ILookup,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableCircularQueue,
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

export interface IEnumerable<TElement> extends Iterable<TElement> {

    /**
     * Combines the elements of the sequence by applying an accumulator to each element and optionally projecting the final result.
     * @template TAccumulate Type of the intermediate accumulator. Defaults to `TElement` when no seed is provided.
     * @template TResult Type returned when a `resultSelector` is supplied.
     * @param accumulator Function that merges the running accumulator with the next element.
     * @param seed Optional initial accumulator value. When omitted, the first element is used as the starting accumulator.
     * @param resultSelector Optional projection applied to the final accumulator before it is returned.
     * @returns {TAccumulate|TResult} The final accumulator (or its projection).
     * @throws {NoElementsException} Thrown when the sequence is empty and no `seed` is provided.
     * @remarks The source sequence is enumerated exactly once. Supply a `seed` to avoid exceptions on empty sequences and to control the accumulator type.
     */
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;

    /**
     * Groups elements by a computed key and aggregates each group by applying an accumulator within that group.
     * @template TKey Type returned by `keySelector` and used to organise groups.
     * @template TAccumulate Type of the accumulated value created for each group.
     * @param keySelector Selector that derives the grouping key for each element.
     * @param seedSelector Either an initial accumulator value applied to every group or a factory invoked with the group key to produce that value.
     * @param accumulator Function that merges the current accumulator with the next element in the group.
     * @param keyComparator Optional equality comparator used to match group keys.
     * @returns {IEnumerable<KeyValuePair<TKey, TAccumulate>>} A sequence containing one key-value pair per group and its aggregated result.
     * @remarks When `seedSelector` is a function, it is evaluated once per group to obtain the initial accumulator.
     */
    aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>>;

    /**
     * Determines whether every element in the sequence satisfies the supplied predicate.
     * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
     * @returns {boolean} `true` when all elements satisfy the predicate; otherwise, `false`.
     * @remarks Enumeration stops as soon as the predicate returns `false`.
     */
    all(predicate: Predicate<TElement>): boolean;

    /**
     * Determines whether the sequence contains at least one element that matches the optional predicate.
     * @param predicate Optional function used to test elements. When omitted, the method returns `true` if the sequence contains any element.
     * @returns {boolean} `true` when a matching element is found; otherwise, `false`.
     * @remarks When the predicate is omitted, only the first element is inspected, making this more efficient than `count() > 0`.
     */
    any(predicate?: Predicate<TElement>): boolean;

    /**
     * Creates a sequence that yields the current elements followed by the supplied element.
     * @param element Element appended to the end of the sequence.
     * @returns {IEnumerable<TElement>} A new enumerable whose final item is the provided element.
     * @remarks The source sequence is not modified; enumeration is deferred until the returned sequence is iterated.
     */
    append(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {number} The arithmetic mean of the selected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
     */
    average(selector?: Selector<TElement, number>): number;

    /**
     * Reinterprets each element in the sequence as the specified result type.
     * @template TResult Target type exposed by the returned sequence.
     * @returns {IEnumerable<TResult>} A sequence that yields the same elements typed as `TResult`.
     * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
     */
    cast<TResult>(): IEnumerable<TResult>;

    /**
     * Splits the sequence into contiguous subsequences containing at most the specified number of elements.
     * @param size Maximum number of elements to include in each chunk. Must be greater than 0.
     * @returns {IEnumerable<IEnumerable<TElement>>} A sequence where each element is a chunk of the original sequence.
     * @throws {InvalidArgumentException} Thrown when `size` is less than 1.
     * @remarks The final chunk may contain fewer elements than `size`. Enumeration is deferred until the returned sequence is iterated.
     */
    chunk(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Generates the unique combinations that can be built from the elements in the sequence.
     * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
     * @returns {IEnumerable<IEnumerable<TElement>>} A sequence of combinations built from the source elements.
     * @throws {InvalidArgumentException} Thrown when `size` is negative.
     * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
     */
    combinations(size?: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Appends the specified iterable to the end of the sequence.
     * @param iterable Additional elements that are yielded after the current sequence.
     * @returns {IEnumerable<TElement>} A sequence containing the elements of the current sequence followed by those from `iterable`.
     * @remarks Enumeration of both sequences is deferred until the result is iterated.
     */
    concat(iterable: Iterable<TElement>): IEnumerable<TElement>;

    /**
     * Determines whether the sequence contains a specific element using an optional comparator.
     * @param element Element to locate in the sequence.
     * @param comparator Optional equality comparator used to match elements. Defaults to the library's standard equality comparison.
     * @returns {boolean} `true` when the element is found; otherwise, `false`.
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Counts the number of elements in the sequence, optionally restricted by a predicate.
     * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
     * @returns {number} The number of elements that satisfy the predicate.
     * @remarks Prefer calling `any()` to test for existence instead of comparing this result with zero.
     */
    count(predicate?: Predicate<TElement>): number;

    /**
     * Counts the occurrences of elements grouped by a derived key.
     * @template TKey Type produced by `keySelector`.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param comparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<KeyValuePair<TKey, number>>} A sequence of key/count pairs describing how many elements share each key.
     * @remarks Each key appears exactly once in the result with its associated occurrence count.
     */
    countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>>;

    /**
     * Repeats the sequence the specified number of times, or indefinitely when no count is provided.
     * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
     * @returns {IEnumerable<TElement>} A sequence that yields the original elements cyclically.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
     */
    cycle(count?: number): IEnumerable<TElement>;

    /**
     * Supplies fallback content when the sequence contains no elements.
     * @param value Optional value returned in a singleton sequence when the source is empty. Defaults to `null`.
     * @returns {IEnumerable<TElement | null>} The original sequence when it has elements; otherwise, a singleton sequence containing the provided value.
     * @remarks Use this to ensure downstream operators always receive at least one element.
     */
    defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null>;

    /**
     * Eliminates duplicate elements from the sequence using an optional comparator.
     * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that yields each distinct element once.
     * @remarks Elements are compared by value; when using custom types, provide an appropriate comparator to avoid reference-based comparisons.
     */
    distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Eliminates duplicate elements by comparing keys computed for each element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for distinctness.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that contains the first occurrence of each unique key.
     * @remarks When keys are expensive to compute, consider memoisation because each element's key is evaluated exactly once.
     */
    distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing each element with its predecessor.
     * @param comparator Optional equality comparator used to determine whether adjacent elements are equal. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that yields the first element of each run of equal values.
     * @remarks Unlike {@link distinct}, this only filters out adjacent duplicates and preserves earlier occurrences of repeated values.
     */
    distinctUntilChanged(comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing keys projected from each element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that yields the first element in each run of elements whose keys change.
     * @remarks Enumeration stops comparing elements once a different key is encountered, making this useful for collapsing grouped data.
     */
    distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Retrieves the element at the specified zero-based index.
     * @param index Zero-based position of the element to retrieve.
     * @returns {TElement} The element located at the requested index.
     * @throws {IndexOutOfBoundsException} Thrown when `index` is negative or greater than or equal to the number of elements in the sequence.
     * @remarks Enumeration stops once the requested element is found; remaining elements are not evaluated.
     */
    elementAt(index: number): TElement;

    /**
     * Retrieves the element at the specified zero-based index or returns `null` when the index is out of range.
     * @param index Zero-based position of the element to retrieve.
     * @returns {TElement | null} The element at `index`, or `null` when the sequence is shorter than `index + 1` or when `index` is negative.
     * @remarks Use this overload when out-of-range access should produce a sentinel value instead of throwing an exception.
     */
    elementAtOrDefault(index: number): TElement | null;

    /**
     * Returns the elements of this sequence that are not present in the specified iterable.
     * @param iterable Sequence whose elements should be removed from the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IEnumerable<TElement>} A sequence containing the elements from this sequence that do not appear in `iterable`.
     * @remarks The original ordering and duplicate occurrences from this sequence are preserved. The `iterable` is fully enumerated to build the exclusion set.
     */
    except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement>;

    /**
     * Returns the elements of this sequence whose projected keys are not present in the specified iterable.
     * @template TKey Type produced by `keySelector`.
     * @param iterable Sequence whose elements define the keys that should be excluded.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IEnumerable<TElement>} A sequence that contains the elements from this sequence whose keys are absent from `iterable`.
     * @remarks Source ordering is preserved and duplicate elements with distinct keys remain. The exclusion keys are materialised by fully enumerating `iterable`.
     */
    exceptBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement>;

    /**
     * Returns the first element that satisfies the provided type guard.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element until it returns true.
     * @returns {TFiltered} The first element that satisfies the type guard.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when no element satisfies the type guard.
     * @remarks Enumeration stops immediately once a matching element is found.
     */
    first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;

    /**
     * Returns the first element in the sequence, optionally filtered by a predicate.
     * @param predicate Predicate evaluated against each element; when omitted, the first element is returned.
     * @returns {TElement} The first element of the sequence that satisfies the predicate (or the very first element when none is provided).
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
     * @remarks Enumeration stops immediately once a matching element is found.
     */
    first(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the first element that satisfies the provided type guard, or `null` when no such element exists.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element until it returns true.
     * @returns {TFiltered | null} The first element that satisfies the type guard, or `null` when none match.
     * @remarks Enumeration stops immediately once a matching element is found.
     */
    firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;

    /**
     * Returns the first element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
     * @param predicate Predicate evaluated against each element; when omitted, the first element is returned.
     * @returns {TElement | null} The first matching element, or `null` when no match is found.
     * @remarks This method never throws; it communicates absence through the `null` return value.
     */
    firstOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Executes the provided callback for every element in the sequence.
     * @param action Callback invoked for each element; receives the element and its zero-based index.
     * @returns {void}
     * @remarks Enumeration starts immediately. Avoid mutating the underlying collection while iterating.
     */
    forEach(action: IndexedAction<TElement>): void;

    /**
     * Partitions the sequence into groups based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<IGroup<TKey, TElement>>} A sequence of groups, each exposing the key and the elements that share it.
     * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration.
     */
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>>;

    /**
     * Correlates each element of the sequence with a collection of matching elements from another sequence.
     * @template TInner Type of elements in the inner sequence.
     * @template TKey Type of key produced by the key selectors.
     * @template TResult Type of element returned by {@link resultSelector}.
     * @param innerEnumerable Sequence whose elements are grouped and joined with the outer elements.
     * @param outerKeySelector Selector that extracts the join key from each outer element.
     * @param innerKeySelector Selector that extracts the join key from each inner element.
     * @param resultSelector Projection that combines an outer element with an `IEnumerable` of matching inner elements.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TResult>} A sequence produced by applying {@link resultSelector} to each outer element and its matching inner elements.
     * @remarks The inner sequence is enumerated once to build an in-memory lookup before outer elements are processed. Each outer element is then evaluated lazily and preserves the original outer ordering.
     */
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                                     resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;

    /**
     * Enumerates the sequence while exposing the zero-based index alongside each element.
     * @returns {IEnumerable<[number, TElement]>} A sequence of `[index, element]` tuples.
     * @remarks The index is assigned in the order elements are produced. Enumeration is deferred until the result is iterated.
    */
    index(): IEnumerable<[number, TElement]>;

    /**
     * Interleaves the sequence with another iterable, yielding elements in alternating order.
     * @template TSecond Type of elements in the second iterable.
     * @param iterable Iterable whose elements are alternated with the current sequence.
     * @returns {IEnumerable<TElement | TSecond>} A sequence that alternates between elements from this sequence and `iterable`.
     * @remarks If one sequence is longer, the remaining elements are appended after the shorter sequence is exhausted. Enumeration is deferred.
     */
    interleave<TSecond>(iterable: Iterable<TSecond>): IEnumerable<TElement | TSecond>;

    /**
     * Returns the elements common to this sequence and the specified iterable.
     * @param iterable Sequence whose elements are compared against the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences.
     * @remarks The original ordering of this sequence is preserved. The `iterable` is fully enumerated to build the inclusion set prior to yielding results.
     */
    intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement>;

    /**
     * Returns the elements whose keys are common to this sequence and the specified iterable.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param iterable Sequence whose elements define the keys considered part of the intersection.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences based on matching keys.
     * @remarks The `iterable` is fully enumerated to materialise the inclusion keys before yielding results. Source ordering is preserved.
     */
    intersectBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement>;

    /**
     * Inserts the specified separator between adjoining elements.
     * @template TSeparator Type of separator to insert. Defaults to `TElement`.
     * @param separator Value inserted between consecutive elements.
     * @returns {IEnumerable<TElement | TSeparator>} A sequence containing the original elements with separators interleaved.
     * @remarks No separator precedes the first element or follows the last element.
     */
    intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator>;

    /**
     * Produces a projection from the sequence and a second sequence by matching elements that share an identical join key.
     * @template TInner Type of elements in the inner sequence.
     * @template TKey Type of key produced by the key selectors.
     * @template TResult Type of element returned by {@link resultSelector}.
     * @param innerEnumerable Sequence whose elements are joined with the outer sequence.
     * @param outerKeySelector Selector that extracts the join key from each outer element.
     * @param innerKeySelector Selector that extracts the join key from each inner element.
     * @param resultSelector Projection that combines an outer element with a matching inner element. When {@link leftJoin} is `true` and no match exists, `null` is supplied as the inner value.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison when omitted.
     * @param leftJoin When `true`, outer elements with no matching inner element are included once with `null` provided to {@link resultSelector}. Defaults to `false` (inner join).
     * @returns {IEnumerable<TResult>} A sequence generated by applying {@link resultSelector} to each matching pair (and unmatched outer elements when {@link leftJoin} is enabled).
     * @remarks The inner sequence is fully enumerated to build an in-memory lookup before outer elements are processed. The outer sequence is then enumerated lazily and its original ordering is preserved.
     */
    join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                                resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult>;

    /**
     * Returns the last element that satisfies the provided type guard.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element. Every matching element becomes a candidate, and the final match is returned.
     * @returns {TFiltered} The last element that satisfies the type guard.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when no element satisfies the type guard.
     * @remarks The entire sequence is enumerated to locate the final match.
     */
    last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;

    /**
     * Returns the last element in the sequence, optionally filtered by a predicate.
     * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned.
     * @returns {TElement} The last element that satisfies the predicate (or the final element when no predicate is supplied).
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
     * @remarks The entire sequence is enumerated to locate the final match.
     */
    last(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the last element that satisfies the provided type guard, or `null` when no such element exists.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element. Every matching element becomes a candidate, and the final match is returned.
     * @returns {TFiltered | null} The last element that satisfies the type guard, or `null` when none match.
     * @remarks The entire sequence is enumerated to locate the final match. This overload never throws; it communicates absence through the `null` return value.
     */
    lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;

    /**
     * Returns the last element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
     * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned.
     * @returns {TElement | null} The last element that satisfies the predicate, or `null` when no match is found.
     * @remarks The entire sequence is enumerated to locate the final match. This overload never throws; it communicates absence through the `null` return value.
     */
    lastOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Returns the largest numeric value produced for the elements in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {number} The maximum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
     */
    max(selector?: Selector<TElement, number>): number;

    /**
     * Returns the element whose projected key is greatest according to the provided comparator.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {TElement} The element whose key is maximal.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When multiple elements share the maximal key, the first such element in the sequence is returned.
     */
    maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement;

    /**
     * Returns the smallest numeric value produced for the elements in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {number} The minimum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
     */
    min(selector?: Selector<TElement, number>): number;

    /**
     * Returns the element whose projected key is smallest according to the provided comparator.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {TElement} The element whose key is minimal.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When multiple elements share the minimal key, the first such element in the sequence is returned.
     */
    minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement;

    /**
     * Determines whether the sequence contains no elements that satisfy the optional predicate.
     * @param predicate Optional predicate evaluated against each element. When omitted, the method returns `true` if the sequence is empty.
     * @returns {boolean} `true` when no element satisfies the predicate (or when the sequence is empty and no predicate is provided); otherwise, `false`.
     * @remarks This is more efficient than negating `any` with a predicate because iteration stops as soon as a matching element is found.
     */
    none(predicate?: Predicate<TElement>): boolean;

    /**
     * Filters the sequence, keeping only elements assignable to the specified type.
     * @template TResult Type descriptor used to filter elements (constructor function or primitive type string).
     * @param type Type descriptor that determines which elements are retained.
     * @returns {IEnumerable<InferredType<TResult>>} A sequence containing only the elements that match the specified type.
     * @remarks This method performs a runtime type check for each element and yields matching elements lazily.
     */
    ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>>;

    /**
     * Sorts the elements of the sequence in ascending order using the provided comparator.
     * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted ascending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     */
    order(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of the sequence in ascending order based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for ordering.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence that preserves the original relative ordering of elements that share the same key.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     */
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of the sequence in descending order based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for ordering.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence that preserves the original relative ordering of elements that share the same key while ordering keys descending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     */
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of the sequence in descending order using the provided comparator.
     * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted descending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     */
    orderDescending(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement>;

    /**
     * Creates a deferred sequence of adjacent element pairs.
     * @param resultSelector Optional projection applied to each current/next pair. Defaults to returning `[current, next]`.
     * @returns {IEnumerable<[TElement, TElement]>} A sequence with one element per consecutive pair from the source sequence.
     * @remarks The final element is omitted because it lacks a successor. The source sequence is enumerated lazily and only once.
     */
    pairwise(resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]>;
    /**
     * Splits the sequence into two cached partitions by applying a type guard predicate.
     * @template TFiltered Type produced when {@link predicate} confirms the element.
     * @param predicate Type guard invoked for each element. Elements that satisfy the predicate populate the first partition.
     * @returns {[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]} A tuple containing the matching partition and the partition with the remaining elements.
     * @remarks The source is fully enumerated immediately and buffered so that both partitions can be iterated repeatedly without re-evaluating the predicate.
     */
    partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];

    /**
     * Splits the sequence into two cached partitions by applying a boolean predicate.
     * @param predicate Predicate evaluated for each element. Elements for which it returns `true` populate the first partition.
     * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing the elements that satisfied the predicate and those that did not.
     * @remarks The source is fully enumerated immediately and buffered so that both partitions can be iterated repeatedly without re-evaluating the predicate.
     */
    partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Generates permutations from the distinct elements of the sequence.
     * @param size Optional target length for each permutation. When omitted, permutations use all distinct elements of the source.
     * @returns {IEnumerable<IEnumerable<TElement>>} A lazy sequence of permutations, each materialised as an enumerable.
     * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1 or greater than the number of distinct elements.
     * @remarks The source is enumerated to collect distinct elements before permutations are produced. Expect combinatorial growth in the number of permutations.
     */
    permutations(size?: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Returns a deferred sequence that yields the supplied element before the source sequence.
     * @param element Element emitted before the original sequence.
     * @returns {IEnumerable<TElement>} A sequence that yields {@link element} followed by the source elements.
     * @remarks Enumeration is deferred; the source is not iterated until the resulting sequence is consumed.
     */
    prepend(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the multiplicative aggregate of the values produced for each element.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to interpreting the element itself as a number.
     * @returns {number} The product of all projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The source is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
     */
    product(selector?: Selector<TElement, number>): number;

    /**
     * Returns a deferred sequence that yields the source elements in reverse order.
     * @returns {IEnumerable<TElement>} A sequence that produces the elements of the source in reverse iteration order.
     * @remarks The implementation materialises the entire sequence into an array before emitting elements, so avoid using it on infinite sequences or when memory usage is a concern.
     */
    reverse(): IEnumerable<TElement>;

    /**
     * Returns a deferred sequence that rotates the elements by the specified offset while preserving length.
     * @param shift Number of positions to rotate. Positive values move elements toward the end (left rotation); negative values move them toward the beginning (right rotation).
     * @returns {IEnumerable<TElement>} A sequence containing the same elements shifted by the requested amount.
     * @remarks The source is buffered sufficiently to honour the rotation. Rotation amounts larger than the sequence length are normalised by that length, so extremely large offsets may still require holding the entire sequence in memory.
     */
    rotate(shift: number): IEnumerable<TElement>;

    /**
     * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
     * If seed is specified, it is used as the initial value for the accumulator, but it is not included in the result sequence.
     * @template TAccumulate
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, the first element of the sequence will be used as the seed value and also included as the first element of the result.
     * @returns {IEnumerable<TAccumulate>} A new enumerable sequence whose elements are the result of each intermediate computation.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate>;

    /**
     * Projects each element of a sequence into a new form.
     * @template TResult
     * @param selector The selector function that will be used to project each element into a new form. The second parameter is the index.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the selector function.
     */
    select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult>;

    /**
     * Projects each element of a sequence into a new form (which is an iterable) and flattens the resulting sequences into one sequence.
     * @template TResult
     * @param selector The selector function that will be used to project each element into a new iterable form. The second parameter is the index.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the flattened result of the selector function.
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;

    /**
     * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
     * Compares elements pairwise in order. Sequences must have the same length and equal elements at corresponding positions.
     * @param iterable The iterable sequence to compare to the source sequence.
     * @param comparator The equality comparer that will be used to compare the elements. If not specified, the default equality comparer will be used.
     * @returns {boolean} true if the two source sequences are of equal length and their corresponding elements are equal, according to the specified equality comparer; otherwise, false.
     */
    sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns a new enumerable sequence whose elements are shuffled randomly.
     * Note: This method internally converts the sequence to an array to shuffle it.
     * @template TElement
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are shuffled.
     */
    shuffle(): IEnumerable<TElement>;

    /**
     * Returns the only element that satisfies the provided type guard predicate, guaranteeing the guarded type.
     * Throws an exception if there is not exactly one matching element.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The returned element is guaranteed to match the guarded type when found.
     * @returns {TFiltered} The single matching element.
     * @throws {NoElementsException} If the source (or filtered sequence) is empty.
     * @throws {MoreThanOneElementException} If the source (or filtered sequence) contains more than one element.
     * @throws {NoMatchingElementException} If no element satisfies the predicate.
     * @throws {MoreThanOneMatchingElementException} If more than one element satisfies the predicate.
     */
    single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;

    /**
     * Returns the only element of a sequence, optionally filtered by a predicate.
     * Throws an exception if there is not exactly one matching element.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, checks the entire sequence.
     * @returns {TElement} The single element of the sequence (or the single element satisfying the predicate).
     * @throws {NoElementsException} If the source (or filtered sequence) is empty.
     * @throws {MoreThanOneElementException} If the source (or filtered sequence) contains more than one element.
     * @throws {NoMatchingElementException} If a predicate is specified and no element satisfies the condition.
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.

     */
    single(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the only element that satisfies the provided type guard predicate, or null when no such element exists.
     * Throws an exception if more than one matching element is found.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The returned element is guaranteed to match the guarded type when found.
     * @returns {TFiltered|null} The single matching element, or null if none matches.
     * @throws {MoreThanOneElementException} If the source contains more than one element (and no predicate is used).
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.
     */
    singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;

    /**
     * Returns the only element of a sequence, or null if the sequence is empty or no element satisfies the predicate.
     * Throws an exception if more than one matching element exists.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, checks the entire sequence.
     * @returns {TElement|null} The single element of the sequence (or the single element satisfying the predicate), or null when no such element exists.
     * @throws {MoreThanOneElementException} If the source contains more than one element (and no predicate is used).
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.
     */
    singleOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @template TElement
     * @param count The number of elements to skip before returning the remaining elements. If the count is zero or negative, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements that occur after the specified number of skipped elements.
     */
    skip(count: number): IEnumerable<TElement>;

    /**
     * Returns a new enumerable sequence that contains the elements from the source with the last count elements of the source sequence omitted.
     * @template TElement
     * @param count The number of elements to omit from the end of the collection. If the count is zero or negative, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from source with the last count elements omitted.
     */
    skipLast(count: number): IEnumerable<TElement>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * The element that first fails the condition is included in the result.
     * @template TElement
     * @param predicate The predicate function (accepting element and index) that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements starting from the first element that does not satisfy the predicate.
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Splits the sequence into two sequences while a type guard predicate continues to return true for consecutive elements.
     * Once an element fails the predicate, it and the remaining elements are yielded in the second sequence.
     * Note: This method iterates the source sequence immediately and stores the results.
     * @template TFiltered
     * @param predicate The predicate that acts as a type guard. The first returned sequence is narrowed to the guarded type.
     * @returns {[IEnumerable<TFiltered>, IEnumerable<TElement>]} A tuple containing the initial span of guarded elements and the remaining elements.
     */
    span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>];

    /**
     * Splits the sequence into two sequences while a predicate continues to return true for consecutive elements.
     * Once an element fails the predicate, it and the remaining elements are yielded in the second sequence.
     * Note: This method iterates the source sequence immediately and stores the results.
     * @param predicate The predicate function that will be used to test each element.
     * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences.
     */
    span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Selects elements from a sequence at regular intervals (steps).
     * Includes the first element (index 0) and then every 'step'-th element after that.
     * @template TElement
     * @param step The number of elements to skip between included elements. Must be 1 or greater.
     * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements at the specified step intervals.
     * @throws {InvalidArgumentException} If the step is less than 1.
     */
    step(step: number): IEnumerable<TElement>;

    /**
     * Returns the sum of the values in the sequence. Assumes elements are numbers or uses a selector to get numbers.
     * @param selector The selector function that will be used to select the numeric value to sum. If not specified, the element itself is used.
     * @returns {number} The sum of the values in the sequence. Returns 0 if the sequence is empty.
     * @throws {NoElementsException} If the source is empty.
     */
    sum(selector?: Selector<TElement, number>): number;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @template TElement
     * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
     */
    take(count: number): IEnumerable<TElement>;

    /**
     * Returns a specified number of contiguous elements from the end of a sequence.
     * @template TElement
     * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the end of the input sequence.
     */
    takeLast(count: number): IEnumerable<TElement>;

    /**
     * Returns consecutive elements from the sequence while a type guard predicate evaluates to true, narrowing the resulting sequence type.
     * @template TFiltered
     * @param predicate The predicate (receiving element and index) that acts as a type guard. Iteration stops once the predicate returns false.
     * @returns {IEnumerable<TFiltered>} A new enumerable sequence containing the leading elements that satisfy the predicate.
     */
    takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;

    /**
     * Returns consecutive elements from the sequence while a predicate evaluates to true.
     * @param predicate The predicate function (receiving element and index) that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence containing the leading elements that satisfy the predicate.
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Invokes the specified action on each element while yielding the original sequence unchanged.
     * @param action The action to perform for each element. The second parameter is the element index.
     * @returns {IEnumerable<TElement>} The original sequence, enabling fluent chaining.
     */
    tap(action: IndexedAction<TElement>): IEnumerable<TElement>;

    /**
     * Creates a new array from the elements of the sequence.
     * This forces evaluation of the entire sequence.
     * @template TElement
     * @returns {TElement[]} An array that contains the elements from the input sequence.
     */
    toArray(): TElement[];

    /**
     * Creates a new circular linked list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement The type of elements in the sequence.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {CircularLinkedList<TElement>} A new circular linked list that contains the elements from the input sequence.
     */
    toCircularLinkedList(comparator?: EqualityComparator<TElement>): CircularLinkedList<TElement>;

    /**
     * Creates a new circular queue from the elements of the sequence using the queue's default capacity.
     * Forces evaluation of the sequence.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {CircularQueue<TElement>} A new circular queue containing all elements from the input sequence.
     */
    toCircularQueue(comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;

    /**
     * Creates a new circular queue from the elements of the sequence and enforces the specified capacity.
     * When the number of source elements exceeds the capacity, only the most recent items are retained.
     * Forces evaluation of the sequence.
     * @param capacity The maximum number of elements that the resulting queue can hold.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {CircularQueue<TElement>} A new circular queue that contains up to `capacity` most recent elements from the input sequence.
     */
    toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;

    /**
     * Creates a new dictionary from the elements of the sequence.
     * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
     * @returns {Dictionary<TKey, TValue>} A new dictionary that contains the elements from the input sequence.
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;

    /**
     * Creates a new enumerable set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence.
     * @template TElement
     * @returns {EnumerableSet<TElement>} An enumerable set that contains the distinct elements from the input sequence.
     */
    toEnumerableSet(): EnumerableSet<TElement>;

    /**
     * Creates a new immutable circular queue from the elements of the sequence using the queue's default capacity.
     * Forces evaluation of the sequence.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing all elements from the input sequence.
     */
    toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;

    /**
     * Creates a new immutable circular queue from the elements of the sequence and limits it to the specified capacity.
     * When the number of source elements exceeds the capacity, only the most recent items are retained.
     * Forces evaluation of the sequence.
     * @param capacity The maximum number of elements that the resulting queue can hold.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue that contains up to `capacity` most recent elements from the input sequence.
     */
    toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;

    /**
     * Creates a new immutable dictionary from the elements of the sequence.
     * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
     * @returns {ImmutableDictionary<TKey, TValue>} A new immutable dictionary that contains the elements from the input sequence.
     */
    toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;

    /**
     * Creates a new immutable list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableList<TElement>} A new immutable list that contains the elements from the input sequence.
     */
    toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement>;

    /**
     * Creates a new immutable priority queue from the elements of the sequence.
     * Forces evaluation of the sequence. Elements are ordered based on the comparator.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used.
     * @returns {ImmutablePriorityQueue<TElement>} A new immutable priority queue that contains the elements from the input sequence.
     */
    toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement>;

    /**
     * Creates a new immutable queue from the elements of the sequence (FIFO).
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableQueue<TElement>} A new immutable queue that contains the elements from the input sequence.
     */
    toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement>;

    /**
     * Creates a new immutable set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence.
     * @template TElement
     * @returns {ImmutableSet<TElement>} A new immutable set that contains the distinct elements from the input sequence.
     */
    toImmutableSet(): ImmutableSet<TElement>;

    /**
     * Creates a new immutable sorted dictionary from the elements of the sequence.
     * Forces evaluation of the sequence. Keys are sorted. Throws if duplicate keys are encountered.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys for sorting. If not specified, the default order comparer will be used.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
     * @returns {ImmutableSortedDictionary<TKey, TValue>} A new immutable sorted dictionary that contains the elements from the input sequence.
     */
    toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;

    /**
     * Creates a new immutable sorted set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence. Elements are sorted.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
     * @returns {ImmutableSortedSet<TElement>} A new immutable sorted set that contains the distinct, sorted elements from the input sequence.
     */
    toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement>;

    /**
     * Creates a new immutable stack from the elements of the sequence (LIFO).
     * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableStack<TElement>} A new immutable stack that contains the elements from the input sequence.
     */
    toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement>;

    /**
     * Creates a new linked list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {LinkedList<TElement>} A new linked list that contains the elements from the input sequence.
     */
    toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement>;

    /**
     * Creates a new list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {List<TElement>} A new list that contains the elements from the input sequence.
     */
    toList(comparator?: EqualityComparator<TElement>): List<TElement>;

    /**
     * Creates a new lookup from the elements of the sequence. A lookup is similar to a dictionary but allows multiple values per key.
     * Forces evaluation of the sequence.
     * @template TKey
     * @template TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys. If not specified, the default equality comparer will be used.
     * @returns {ILookup<TKey, TValue>} A new lookup that contains the elements from the input sequence, grouped by key.
     */
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue>;

    /**
     * Converts this enumerable to a JavaScript Map.
     * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
     * @template TKey
     * @template TValue
     * @param keySelector The selector that will be used to select the property that will be used as the key of the map.
     * @param valueSelector The selector that will be used to select the property that will be used as the value of the map.
     * @returns {Map<TKey, TValue>} A Map representation of this sequence.
     */
    toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue>;

    /**
     * Converts this enumerable to a JavaScript object (Record).
     * Forces evaluation of the sequence. If duplicate keys are encountered, the last value for that key overwrites previous ones.
     * @template TKey
     * @template TValue
     * @param keySelector The selector that will be used to select the property that will be used as the key of the object. Must return string, number, or symbol.
     * @param valueSelector The selector that will be used to select the property that will be used as the value of the object.
     * @returns {Record<TKey, TValue>} An object that contains the elements of the sequence.
     */
    toObject<TKey extends string|number|symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue>;

    /**
     * Creates a new priority queue from the elements of the sequence.
     * Forces evaluation of the sequence. Elements are ordered based on the comparator.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used (min-heap).
     * @returns {PriorityQueue<TElement>} A new priority queue that contains the elements from the input sequence.
     */
    toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement>;

    /**
     * Creates a new queue from the elements of the sequence (FIFO).
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {Queue<TElement>} A new queue that contains the elements from the input sequence.
     */
    toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement>;

    /**
     * Creates a new JavaScript Set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence.
     * @template TElement
     * @returns {Set<TElement>} A new Set that contains the distinct elements from the input sequence.
     */
    toSet(): Set<TElement>;

    /**
     * Creates a new sorted dictionary from the elements of the sequence.
     * Forces evaluation of the sequence. Keys are sorted. Throws if duplicate keys are encountered.
     * @template TKey
     * @template TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param keyComparator The key comparator function that will be used to compare two keys for sorting. If not specified, the default order comparer will be used.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
     * @returns {SortedDictionary<TKey, TValue>} A new sorted dictionary that contains the elements from the input sequence.
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue>;

    /**
     * Creates a new sorted set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence. Elements are sorted.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
     * @returns {SortedSet<TElement>} A new sorted set that contains the distinct, sorted elements from the input sequence.
     */
    toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement>;

    /**
     * Creates a new stack from the elements of the sequence (LIFO).
     * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {Stack<TElement>} A new stack that contains the elements from the input sequence.
     */
    toStack(comparator?: EqualityComparator<TElement>): Stack<TElement>;

    /**
     * Produces the set union of two sequences by using an equality comparer.
     * The result contains all unique elements from both sequences.
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements form the second set for the union.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding duplicates. Order is preserved from the original sequences, with elements from the first sequence appearing before elements from the second.
     */
    union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Produces the set union of two sequences by using a key selector function.
     * The result contains all elements from both sequences whose selected keys are unique.
     * @template TElement, TKey
     * @param iterable The iterable sequence whose distinct elements form the second set for the union.
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param comparator The equality comparator function that will be used to compare two keys. If not specified, the default equality comparer will be used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding elements with duplicate keys based on the selector. Order is preserved.
     */
    unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Filters a sequence of values based on a type guard predicate, narrowing the resulting element type.
     * @template TFiltered
     * @param predicate The predicate function (accepting element and index) that acts as a type guard. Return true to keep the element, false to filter it out.
     * @returns {IEnumerable<TFiltered>} A new enumerable sequence that contains elements matching the guarded type.
     */
    where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;

    /**
     * Filters a sequence of values based on a predicate.
     * @param predicate The predicate function (accepting element and index) that will be used to test each element. Return true to keep the element, false to filter it out.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains elements from the input sequence that satisfy the condition.
     */
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Returns an enumerable sequence of sliding windows of the specified size over the source sequence.
     * Each window is an IEnumerable itself.
     * @template TElement
     * @param size The size of the windows. Must be 1 or greater.
     * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence where each element is a window (as an IEnumerable) of the specified size.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     */
    windows(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of tuples.
     * If the two sequences are of different lengths, the resulting sequence will have the length of the shorter sequence.
     * @template TElement The type of elements in the first sequence.
     * @template TSecond The type of elements in the second sequence.
     * @param iterable The iterable sequence to merge with the first sequence.
     * @returns {IEnumerable<[TElement, TSecond]>} A new enumerable sequence that contains tuples [TElement, TSecond] of the merged elements.
     */
    zip<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]>;

    /**
     * Applies a specified function (zipper) to the corresponding elements of two sequences, producing a sequence of the results.
     * If the two sequences are of different lengths, the resulting sequence will have the length of the shorter sequence.
     * @template TElement The type of elements in the first sequence.
     * @template TSecond The type of elements in the second sequence.
     * @template TResult The type of elements in the result sequence, as determined by the zipper function.
     * @param iterable The iterable sequence to merge with the first sequence.
     * @param zipper The function that specifies how to merge the elements from the two sequences into a result element.
     * @returns {IEnumerable<TResult>} A new enumerable sequence that contains the result of applying the zipper function to corresponding elements.
     */
    zip<TSecond, TResult>(iterable: Iterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;
}
