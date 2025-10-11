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
import { Zipper, ZipperMany } from "../shared/Zipper";
import { PipeOperator } from "../shared/PipeOperator";
import { UnpackIterableTuple } from "../shared/UnpackIterableTuple";

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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const sum = numbers.aggregate((acc, x) => acc + x);
     * console.log(sum); // 15
     *
     * const product = numbers.aggregate((acc, x) => acc * x, 1);
     * console.log(product); // 120
     * ```
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
     * @example
     * ```typescript
     * const products = from([
     *   { name: 'Apple', category: 'Fruit', price: 1.2 },
     *   { name: 'Banana', category: 'Fruit', price: 0.5 },
     *   { name: 'Carrot', category: 'Vegetable', price: 0.8 },
     *   { name: 'Broccoli', category: 'Vegetable', price: 1.5 },
     * ]);
     *
     * const totalPriceByCategory = products.aggregateBy(
     *   p => p.category,
     *   0,
     *   (acc, p) => acc + p.price
     * ).toArray();
     *
     * console.log(totalPriceByCategory);
     * // [
     * //   { key: 'Fruit', value: 1.7 },
     * //   { key: 'Vegetable', value: 2.3 }
     * // ]
     * ```
     */
    aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>>;

    /**
     * Determines whether every element in the sequence satisfies the supplied predicate.
     * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
     * @returns {boolean} `true` when all elements satisfy the predicate; otherwise, `false`.
     * @remarks Enumeration stops as soon as the predicate returns `false`.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const allPositive = numbers.all(x => x > 0);
     * console.log(allPositive); // true
     *
     * const mixedNumbers = from([-1, 2, 3, -4, 5]);
     * const allPositive2 = mixedNumbers.all(x => x > 0);
     * console.log(allPositive2); // false
     * ```
     */
    all(predicate: Predicate<TElement>): boolean;

    /**
     * Determines whether the sequence contains at least one element that matches the optional predicate.
     * @param predicate Optional function used to test elements. When omitted, the method returns `true` if the sequence contains any element.
     * @returns {boolean} `true` when a matching element is found; otherwise, `false`.
     * @remarks When the predicate is omitted, only the first element is inspected, making this more efficient than `count() > 0`.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const hasEvenNumber = numbers.any(x => x % 2 === 0);
     * console.log(hasEvenNumber); // true
     *
     * const oddNumbers = from([1, 3, 5]);
     * const hasEvenNumber2 = oddNumbers.any(x => x % 2 === 0);
     * console.log(hasEvenNumber2); // false
     * ```
     */
    any(predicate?: Predicate<TElement>): boolean;

    /**
     * Creates a sequence that yields the current elements followed by the supplied element.
     * @param element Element appended to the end of the sequence.
     * @returns {IEnumerable<TElement>} A new enumerable whose final item is the provided element.
     * @remarks The source sequence is not modified; enumeration is deferred until the returned sequence is iterated.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const appended = numbers.append(4).toArray();
     * console.log(appended); // [1, 2, 3, 4]
     * ```
     */
    append(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {number} The arithmetic mean of the selected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const avg = numbers.average();
     * console.log(avg); // 3
     *
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     *   { name: 'Charlie', age: 35 },
     * ]);
     * const avgAge = people.average(p => p.age);
     * console.log(avgAge); // 30
     * ```
     */
    average(selector?: Selector<TElement, number>): number;

    /**
     * Reinterprets each element in the sequence as the specified result type.
     * @template TResult Target type exposed by the returned sequence.
     * @returns {IEnumerable<TResult>} A sequence that yields the same elements typed as `TResult`.
     * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
     * @example
     * ```typescript
     * const mixed = from([1, 'two', 3, 'four']);
     * const numbers = mixed.cast<number>().where(x => typeof x === 'number');
     * console.log(numbers.toArray()); // [1, 3]
     * ```
     */
    cast<TResult>(): IEnumerable<TResult>;

    /**
     * Splits the sequence into contiguous subsequences containing at most the specified number of elements.
     * @param size Maximum number of elements to include in each chunk. Must be greater than 0.
     * @returns {IEnumerable<IEnumerable<TElement>>} A sequence where each element is a chunk of the original sequence.
     * @throws {InvalidArgumentException} Thrown when `size` is less than 1.
     * @remarks The final chunk may contain fewer elements than `size`. Enumeration is deferred until the returned sequence is iterated.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5, 6, 7, 8]);
     * const chunks = numbers.chunk(3);
     * console.log(chunks.select(c => c.toArray()).toArray()); // [[1, 2, 3], [4, 5, 6], [7, 8]]
     * ```
     */
    chunk(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Generates the unique combinations that can be built from the elements in the sequence.
     * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
     * @returns {IEnumerable<IEnumerable<TElement>>} A sequence of combinations built from the source elements.
     * @throws {InvalidArgumentException} Thrown when `size` is negative.
     * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const combs = numbers.combinations(2);
     * console.log(combs.select(c => c.toArray()).toArray()); // [[1, 2], [1, 3], [2, 3]]
     * ```
     */
    combinations(size?: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Appends the specified iterable to the end of the sequence.
     * @param iterable Additional elements that are yielded after the current sequence.
     * @returns {IEnumerable<TElement>} A sequence containing the elements of the current sequence followed by those from `iterable`.
     * @remarks Enumeration of both sequences is deferred until the result is iterated.
     * @example
     * ```typescript
     * const numbers1 = from([1, 2, 3]);
     * const numbers2 = [4, 5, 6];
     * const concatenated = numbers1.concat(numbers2).toArray();
     * console.log(concatenated); // [1, 2, 3, 4, 5, 6]
     * ```
     */
    concat(iterable: Iterable<TElement>): IEnumerable<TElement>;

    /**
     * Determines whether the sequence contains a specific element using an optional comparator.
     * @param element Element to locate in the sequence.
     * @param comparator Optional equality comparator used to match elements. Defaults to the library's standard equality comparison.
     * @returns {boolean} `true` when the element is found; otherwise, `false`.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const hasThree = numbers.contains(3);
     * console.log(hasThree); // true
     *
     * const hasTen = numbers.contains(10);
     * console.log(hasTen); // false
     * ```
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Counts the number of elements in the sequence, optionally restricted by a predicate.
     * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
     * @returns {number} The number of elements that satisfy the predicate.
     * @remarks Prefer calling `any()` to test for existence instead of comparing this result with zero.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const totalCount = numbers.count();
     * console.log(totalCount); // 5
     *
     * const evenCount = numbers.count(x => x % 2 === 0);
     * console.log(evenCount); // 2
     * ```
     */
    count(predicate?: Predicate<TElement>): number;

    /**
     * Counts the occurrences of elements grouped by a derived key.
     * @template TKey Type produced by `keySelector`.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param comparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<KeyValuePair<TKey, number>>} A sequence of key/count pairs describing how many elements share each key.
     * @remarks Each key appears exactly once in the result with its associated occurrence count.
     * @example
     * ```typescript
     * const products = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     *
     * const countByCategory = products.countBy(p => p.category).toArray();
     * console.log(countByCategory);
     * // [
     * //   { key: 'Fruit', value: 2 },
     * //   { key: 'Vegetable', value: 1 }
     * // ]
     * ```
     */
    countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>>;

    /**
     * Repeats the sequence the specified number of times, or indefinitely when no count is provided.
     * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
     * @returns {IEnumerable<TElement>} A sequence that yields the original elements cyclically.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const cycled = numbers.cycle(2).toArray();
     * console.log(cycled); // [1, 2, 3, 1, 2, 3]
     * ```
     */
    cycle(count?: number): IEnumerable<TElement>;

    /**
     * Supplies fallback content when the sequence contains no elements.
     * @param value Optional value returned in a singleton sequence when the source is empty. Defaults to `null`.
     * @returns {IEnumerable<TElement | null>} The original sequence when it has elements; otherwise, a singleton sequence containing the provided value.
     * @remarks Use this to ensure downstream operators always receive at least one element.
     * @example
     * ```typescript
     * const empty = from([]);
     * const withDefault = empty.defaultIfEmpty(0).toArray();
     * console.log(withDefault); // [0]
     *
     * const numbers = from([1, 2, 3]);
     * const withDefault2 = numbers.defaultIfEmpty(0).toArray();
     * console.log(withDefault2); // [1, 2, 3]
     * ```
     */
    defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null>;

    /**
     * Eliminates duplicate elements from the sequence using an optional comparator.
     * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that yields each distinct element once.
     * @remarks Elements are compared by value; when using custom types, provide an appropriate comparator to avoid reference-based comparisons.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 2, 3, 1, 4, 5, 5]);
     * const distinctNumbers = numbers.distinct().toArray();
     * console.log(distinctNumbers); // [1, 2, 3, 4, 5]
     * ```
     */
    distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Eliminates duplicate elements by comparing keys computed for each element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for distinctness.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that contains the first occurrence of each unique key.
     * @remarks When keys are expensive to compute, consider memoisation because each element's key is evaluated exactly once.
     * @example
     * ```typescript
     * const products = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     *
     * const distinctByCategory = products.distinctBy(p => p.category).toArray();
     * console.log(distinctByCategory);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Carrot', category: 'Vegetable' }
     * // ]
     * ```
     */
    distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing each element with its predecessor.
     * @param comparator Optional equality comparator used to determine whether adjacent elements are equal. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that yields the first element of each run of equal values.
     * @remarks Unlike {@link distinct}, this only filters out adjacent duplicates and preserves earlier occurrences of repeated values.
     * @example
     * ```typescript
     * const numbers = from([1, 1, 2, 2, 2, 1, 3, 3]);
     * const distinctUntilChangedNumbers = numbers.distinctUntilChanged().toArray();
     * console.log(distinctUntilChangedNumbers); // [1, 2, 1, 3]
     * ```
     */
    distinctUntilChanged(comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing keys projected from each element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<TElement>} A sequence that yields the first element in each run of elements whose keys change.
     * @remarks Enumeration stops comparing elements once a different key is encountered, making this useful for collapsing grouped data.
     * @example
     * ```typescript
     * const products = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     *   { name: 'Broccoli', category: 'Vegetable' },
     *   { name: 'Orange', category: 'Fruit' },
     * ]);
     *
     * const distinctByCategory = products.distinctUntilChangedBy(p => p.category).toArray();
     * console.log(distinctByCategory);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Carrot', category: 'Vegetable' },
     * //   { name: 'Orange', category: 'Fruit' }
     * // ]
     * ```
     */
    distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Retrieves the element at the specified zero-based index.
     * @param index Zero-based position of the element to retrieve.
     * @returns {TElement} The element located at the requested index.
     * @throws {IndexOutOfBoundsException} Thrown when `index` is negative or greater than or equal to the number of elements in the sequence.
     * @remarks Enumeration stops once the requested element is found; remaining elements are not evaluated.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const element = numbers.elementAt(2);
     * console.log(element); // 3
     * ```
     */
    elementAt(index: number): TElement;

    /**
     * Retrieves the element at the specified zero-based index or returns `null` when the index is out of range.
     * @param index Zero-based position of the element to retrieve.
     * @returns {TElement | null} The element at `index`, or `null` when the sequence is shorter than `index + 1` or when `index` is negative.
     * @remarks Use this overload when out-of-range access should produce a sentinel value instead of throwing an exception.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const element = numbers.elementAtOrDefault(2);
     * console.log(element); // 3
     *
     * const element2 = numbers.elementAtOrDefault(10);
     * console.log(element2); // null
     * ```
     */
    elementAtOrDefault(index: number): TElement | null;

    /**
     * Returns the elements of this sequence that are not present in the specified iterable.
     * @param iterable Sequence whose elements should be removed from the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IEnumerable<TElement>} A sequence containing the elements from this sequence that do not appear in `iterable`.
     * @remarks The original ordering and duplicate occurrences from this sequence are preserved. The `iterable` is fully enumerated to build the exclusion set.
     * @example
     * ```typescript
     * const numbers1 = from([1, 2, 3, 4, 5]);
     * const numbers2 = [3, 5, 7];
     * const result = numbers1.except(numbers2).toArray();
     * console.log(result); // [1, 2, 4]
     * ```
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
     * @example
     * ```typescript
     * const products1 = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     * const products2 = [
     *   { name: 'Broccoli', category: 'Vegetable' },
     * ];
     *
     * const result = products1.exceptBy(products2, p => p.category).toArray();
     * console.log(result);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Banana', category: 'Fruit' }
     * // ]
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const firstElement = numbers.first();
     * console.log(firstElement); // 1
     *
     * const firstEven = numbers.first(x => x % 2 === 0);
     * console.log(firstEven); // 2
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const firstElement = numbers.firstOrDefault();
     * console.log(firstElement); // 1
     *
     * const firstEven = numbers.firstOrDefault(x => x % 2 === 0);
     * console.log(firstEven); // 2
     *
     * const empty = from<number>([]);
     * const firstOfEmpty = empty.firstOrDefault();
     * console.log(firstOfEmpty); // null
     *
     * const noEvens = from([1, 3, 5]);
     * const firstEven2 = noEvens.firstOrDefault(x => x % 2 === 0);
     * console.log(firstEven2); // null
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * numbers.forEach((x, i) => console.log(`Index ${i}: ${x}`));
     * // Index 0: 1
     * // Index 1: 2
     * // Index 2: 3
     * ```
     */
    forEach(action: IndexedAction<TElement>): void;

    /**
     * Partitions the sequence into groups based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IEnumerable<IGroup<TKey, TElement>>} A sequence of groups, each exposing the key and the elements that share it.
     * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration.
     * @example
     * ```typescript
     * const products = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     *
     * const grouped = products.groupBy(p => p.category);
     * for (const group of grouped) {
     *   console.log(group.key, group.toArray());
     * }
     * // Fruit [ { name: 'Apple', category: 'Fruit' }, { name: 'Banana', category: 'Fruit' } ]
     * // Vegetable [ { name: 'Carrot', category: 'Vegetable' } ]
     * ```
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
     * @example
     * ```typescript
     * const categories = from([
     *   { id: 1, name: 'Fruit' },
     *   { id: 2, name: 'Vegetable' },
     * ]);
     * const products = from([
     *   { name: 'Apple', categoryId: 1 },
     *   { name: 'Banana', categoryId: 1 },
     *   { name: 'Carrot', categoryId: 2 },
     * ]);
     *
     * const joined = categories.groupJoin(
     *   products,
     *   c => c.id,
     *   p => p.categoryId,
     *   (c, ps) => ({ ...c, products: ps.toArray() })
     * ).toArray();
     *
     * console.log(joined);
     * // [
     * //   { id: 1, name: 'Fruit', products: [ { name: 'Apple', categoryId: 1 }, { name: 'Banana', categoryId: 1 } ] },
     * //   { id: 2, name: 'Vegetable', products: [ { name: 'Carrot', categoryId: 2 } ] }
     * // ]
     * ```
     */
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                                     resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;

    /**
     * Enumerates the sequence while exposing the zero-based index alongside each element.
     * @returns {IEnumerable<[number, TElement]>} A sequence of `[index, element]` tuples.
     * @remarks The index is assigned in the order elements are produced. Enumeration is deferred until the result is iterated.
     * @example
     * ```typescript
     * const letters = from(['a', 'b', 'c']);
     * const indexed = letters.index().toArray();
     * console.log(indexed); // [[0, 'a'], [1, 'b'], [2, 'c']]
     * ```
    */
    index(): IEnumerable<[number, TElement]>;

    /**
     * Interleaves the sequence with another iterable, yielding elements in alternating order.
     * @template TSecond Type of elements in the second iterable.
     * @param iterable Iterable whose elements are alternated with the current sequence.
     * @returns {IEnumerable<TElement | TSecond>} A sequence that alternates between elements from this sequence and `iterable`.
     * @remarks If one sequence is longer, the remaining elements are appended after the shorter sequence is exhausted. Enumeration is deferred.
     * @example
     * ```typescript
     * const numbers1 = from([1, 3, 5]);
     * const numbers2 = [2, 4, 6];
     * const interleaved = numbers1.interleave(numbers2).toArray();
     * console.log(interleaved); // [1, 2, 3, 4, 5, 6]
     * ```
     */
    interleave<TSecond>(iterable: Iterable<TSecond>): IEnumerable<TElement | TSecond>;

    /**
     * Returns the elements common to this sequence and the specified iterable.
     * @param iterable Sequence whose elements are compared against the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences.
     * @remarks The original ordering of this sequence is preserved. The `iterable` is fully enumerated to build the inclusion set prior to yielding results.
     * @example
     * ```typescript
     * const numbers1 = from([1, 2, 3, 4, 5]);
     * const numbers2 = [3, 5, 7];
     * const result = numbers1.intersect(numbers2).toArray();
     * console.log(result); // [3, 5]
     * ```
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
     * @example
     * ```typescript
     * const products1 = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     * const products2 = [
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Broccoli', category: 'Vegetable' },
     * ];
     *
     * const result = products1.intersectBy(products2, p => p.category).toArray();
     * console.log(result);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Carrot', category: 'Vegetable' }
     * // ]
     * ```
     */
    intersectBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement>;

    /**
     * Inserts the specified separator between adjoining elements.
     * @template TSeparator Type of separator to insert. Defaults to `TElement`.
     * @param separator Value inserted between consecutive elements.
     * @returns {IEnumerable<TElement | TSeparator>} A sequence containing the original elements with separators interleaved.
     * @remarks No separator precedes the first element or follows the last element.
     * @example
     * ```typescript
     * const letters = from(['a', 'b', 'c']);
     * const interspersed = letters.intersperse('-').toArray();
     * console.log(interspersed); // ['a', '-', 'b', '-', 'c']
     * ```
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
     * @example
     * ```typescript
     * const categories = from([
     *   { id: 1, name: 'Fruit' },
     *   { id: 2, name: 'Vegetable' },
     * ]);
     * const products = from([
     *   { name: 'Apple', categoryId: 1 },
     *   { name: 'Banana', categoryId: 1 },
     *   { name: 'Carrot', categoryId: 2 },
     * ]);
     *
     * const joined = categories.join(
     *   products,
     *   c => c.id,
     *   p => p.categoryId,
     *   (c, p) => ({ category: c.name, product: p.name })
     * ).toArray();
     *
     * console.log(joined);
     * // [
     * //   { category: 'Fruit', product: 'Apple' },
     * //   { category: 'Fruit', product: 'Banana' },
     * //   { category: 'Vegetable', product: 'Carrot' }
     * // ]
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const lastElement = numbers.last();
     * console.log(lastElement); // 5
     *
     * const lastEven = numbers.last(x => x % 2 === 0);
     * console.log(lastEven); // 4
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const lastElement = numbers.lastOrDefault();
     * console.log(lastElement); // 5
     *
     * const lastEven = numbers.lastOrDefault(x => x % 2 === 0);
     * console.log(lastEven); // 4
     *
     * const empty = from<number>([]);
     * const lastOfEmpty = empty.lastOrDefault();
     * console.log(lastOfEmpty); // null
     *
     * const noEvens = from([1, 3, 5]);
     * const lastEven2 = noEvens.lastOrDefault(x => x % 2 === 0);
     * console.log(lastEven2); // null
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 5, 2, 4, 3]);
     * const maxNumber = numbers.max();
     * console.log(maxNumber); // 5
     *
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     *   { name: 'Charlie', age: 28 },
     * ]);
     * const maxAge = people.max(p => p.age);
     * console.log(maxAge); // 30
     * ```
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
     * @example
     * ```typescript
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     *   { name: 'Charlie', age: 28 },
     * ]);
     * const oldestPerson = people.maxBy(p => p.age);
     * console.log(oldestPerson); // { name: 'Bob', age: 30 }
     * ```
     */
    maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement;

    /**
     * Returns the smallest numeric value produced for the elements in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {number} The minimum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 5, 2, 4]);
     * const minNumber = numbers.min();
     * console.log(minNumber); // 1
     *
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     *   { name: 'Charlie', age: 22 },
     * ]);
     * const minAge = people.min(p => p.age);
     * console.log(minAge); // 22
     * ```
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
     * @example
     * ```typescript
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     *   { name: 'Charlie', age: 22 },
     * ]);
     * const youngestPerson = people.minBy(p => p.age);
     * console.log(youngestPerson); // { name: 'Charlie', age: 22 }
     * ```
     */
    minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement;

    /**
     * Determines whether the sequence contains no elements that satisfy the optional predicate.
     * @param predicate Optional predicate evaluated against each element. When omitted, the method returns `true` if the sequence is empty.
     * @returns {boolean} `true` when no element satisfies the predicate (or when the sequence is empty and no predicate is provided); otherwise, `false`.
     * @remarks This is more efficient than negating `any` with a predicate because iteration stops as soon as a matching element is found.
     * @example
     * ```typescript
     * const numbers = from([1, 3, 5]);
     * const noEvens = numbers.none(x => x % 2 === 0);
     * console.log(noEvens); // true
     *
     * const mixedNumbers = from([1, 2, 3, 5]);
     * const noEvens2 = mixedNumbers.none(x => x % 2 === 0);
     * console.log(noEvens2); // false
     * ```
     */
    none(predicate?: Predicate<TElement>): boolean;

    /**
     * Filters the sequence, keeping only elements assignable to the specified type.
     * @template TResult Type descriptor used to filter elements (constructor function or primitive type string).
     * @param type Type descriptor that determines which elements are retained.
     * @returns {IEnumerable<InferredType<TResult>>} A sequence containing only the elements that match the specified type.
     * @remarks This method performs a runtime type check for each element and yields matching elements lazily.
     * @example
     * ```typescript
     * const mixed = from([1, 'two', 3, 'four', new Date()]);
     * const numbers = mixed.ofType('number').toArray();
     * console.log(numbers); // [1, 3]
     *
     * const dates = mixed.ofType(Date).toArray();
     * console.log(dates); // [Date object]
     * ```
     */
    ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>>;

    /**
     * Sorts the elements of the sequence in ascending order using the provided comparator.
     * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted ascending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 5, 2, 4]);
     * const sorted = numbers.order().toArray();
     * console.log(sorted); // [1, 2, 3, 4, 5]
     * ```
     */
    order(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of the sequence in ascending order based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for ordering.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence that preserves the original relative ordering of elements that share the same key.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     * @example
     * ```typescript
     * const people = from([
     *   { name: 'Bob', age: 30 },
     *   { name: 'Alice', age: 25 },
     *   { name: 'Charlie', age: 22 },
     * ]);
     * const sorted = people.orderBy(p => p.age).toArray();
     * console.log(sorted);
     * // [
     * //   { name: 'Charlie', age: 22 },
     * //   { name: 'Alice', age: 25 },
     * //   { name: 'Bob', age: 30 }
     * // ]
     * ```
     */
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of the sequence in descending order based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for ordering.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence that preserves the original relative ordering of elements that share the same key while ordering keys descending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     * @example
     * ```typescript
     * const people = from([
     *   { name: 'Charlie', age: 22 },
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     * ]);
     * const sorted = people.orderByDescending(p => p.age).toArray();
     * console.log(sorted);
     * // [
     * //   { name: 'Bob', age: 30 },
     * //   { name: 'Alice', age: 25 },
     * //   { name: 'Charlie', age: 22 }
     * // ]
     * ```
     */
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of the sequence in descending order using the provided comparator.
     * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted descending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 5, 2, 4]);
     * const sorted = numbers.orderDescending().toArray();
     * console.log(sorted); // [5, 4, 3, 2, 1]
     * ```
     */
    orderDescending(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement>;

    /**
     * Creates a deferred sequence of adjacent element pairs.
     * @param resultSelector Optional projection applied to each current/next pair. Defaults to returning `[current, next]`.
     * @returns {IEnumerable<[TElement, TElement]>} A sequence with one element per consecutive pair from the source sequence.
     * @remarks The final element is omitted because it lacks a successor. The source sequence is enumerated lazily and only once.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4]);
     * const pairs = numbers.pairwise().toArray();
     * console.log(pairs); // [[1, 2], [2, 3], [3, 4]]
     * ```
     */
    pairwise(resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]>;
    /**
     * Splits the sequence into two cached partitions by applying a type guard predicate.
     * @template TFiltered Type produced when {@link predicate} confirms the element.
     * @param predicate Type guard invoked for each element. Elements that satisfy the predicate populate the first partition.
     * @returns {[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]} A tuple containing the matching partition and the partition with the remaining elements.
     * @remarks The source is fully enumerated immediately and buffered so that both partitions can be iterated repeatedly without re-evaluating the predicate.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5, 6]);
     * const [evens, odds] = numbers.partition(x => x % 2 === 0);
     * console.log(evens.toArray()); // [2, 4, 6]
     * console.log(odds.toArray()); // [1, 3, 5]
     * ```
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
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const perms = numbers.permutations(2);
     * console.log(perms.select(p => p.toArray()).toArray()); // [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
     * ```
     */
    permutations(size?: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Applies a user-defined pipeline to this sequence and returns the operator's result.
     * @template TResult Result type produced by {@link operator}.
     * @param operator Function that receives the enumerable view of this sequence and returns an arbitrary result.
     * @returns {TResult} The value produced by {@link operator} after optionally enumerating the sequence.
     * @throws {unknown} Re-throws any error thrown by {@link operator} or during enumeration initiated by the operator.
     * @remarks The operator controls when and how the sequence is iterated, enabling custom aggregations, projections, or interop with external APIs while preserving fluent syntax.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const sum = numbers.pipe(e => e.sum());
     * console.log(sum); // 15
     *
     * const filteredAndDoubled = numbers.pipe(e =>
     *   e.where(x => x % 2 === 0).select(x => x * 2).toArray()
     * );
     * console.log(filteredAndDoubled); // [4, 8]
     * ```
     */
    pipe<TResult>(operator: PipeOperator<TElement, TResult>): TResult;

    /**
     * Returns a deferred sequence that yields the supplied element before the source sequence.
     * @param element Element emitted before the original sequence.
     * @returns {IEnumerable<TElement>} A sequence that yields {@link element} followed by the source elements.
     * @remarks Enumeration is deferred; the source is not iterated until the resulting sequence is consumed.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const prepended = numbers.prepend(0).toArray();
     * console.log(prepended); // [0, 1, 2, 3]
     * ```
     */
    prepend(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the multiplicative aggregate of the values produced for each element.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to interpreting the element itself as a number.
     * @returns {number} The product of all projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The source is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const result = numbers.product();
     * console.log(result); // 120
     *
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     * ]);
     * const ageProduct = people.product(p => p.age);
     * console.log(ageProduct); // 750
     * ```
     */
    product(selector?: Selector<TElement, number>): number;

    /**
     * Returns a deferred sequence that yields the source elements in reverse order.
     * @returns {IEnumerable<TElement>} A sequence that produces the elements of the source in reverse iteration order.
     * @remarks The implementation materialises the entire sequence into an array before emitting elements, so avoid using it on infinite sequences or when memory usage is a concern.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const reversed = numbers.reverse().toArray();
     * console.log(reversed); // [5, 4, 3, 2, 1]
     * ```
     */
    reverse(): IEnumerable<TElement>;

    /**
     * Returns a deferred sequence that rotates the elements by the specified offset while preserving length.
     * @param shift Number of positions to rotate. Positive values move elements toward the end (left rotation); negative values move them toward the beginning (right rotation).
     * @returns {IEnumerable<TElement>} A sequence containing the same elements shifted by the requested amount.
     * @remarks The source is buffered sufficiently to honour the rotation. Rotation amounts larger than the sequence length are normalised by that length, so extremely large offsets may still require holding the entire sequence in memory.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const rotated = numbers.rotate(2).toArray();
     * console.log(rotated); // [3, 4, 5, 1, 2]
     *
     * const rotatedNegative = numbers.rotate(-2).toArray();
     * console.log(rotatedNegative); // [4, 5, 1, 2, 3]
     * ```
     */
    rotate(shift: number): IEnumerable<TElement>;

    /**
     * Produces a running aggregate of the sequence and yields each intermediate accumulator.
     * @template TAccumulate Result type produced by {@link accumulator}. Defaults to `TElement` when {@link seed} is omitted.
     * @param accumulator Function that combines the current accumulator value with the next element to produce the next accumulator.
     * @param seed Optional initial accumulator. When omitted, the first element becomes the initial accumulator and is emitted as the first result.
     * @returns {IEnumerable<TAccumulate>} A deferred sequence containing every intermediate accumulator produced by {@link accumulator}.
     * @throws {NoElementsException} Thrown when the sequence is empty and {@link seed} is not provided.
     * @remarks The source is enumerated exactly once. When {@link seed} is supplied, it is not emitted; only accumulator results appear in the output.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const runningTotal = numbers.scan((acc, x) => acc + x).toArray();
     * console.log(runningTotal); // [1, 3, 6, 10, 15]
     * ```
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate>;

    /**
     * Projects each element and its zero-based index into a new form.
     * @template TResult Result type produced by {@link selector}.
     * @param selector Projection invoked for each element together with its index.
     * @returns {IEnumerable<TResult>} A deferred sequence containing the values produced by {@link selector}.
     * @remarks Enumeration is deferred. The index argument increments sequentially starting at zero.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const squares = numbers.select(x => x * x).toArray();
     * console.log(squares); // [1, 4, 9, 16, 25]
     * ```
     */
    select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult>;

    /**
     * Projects each element and index into an iterable and flattens the results into a single sequence.
     * @template TResult Element type of the flattened sequence.
     * @param selector Projection that returns an iterable for each element and its index.
     * @returns {IEnumerable<TResult>} A deferred sequence containing the concatenated contents of the iterables produced by {@link selector}.
     * @remarks Each inner iterable is enumerated in order before moving to the next source element. Use this to expand one-to-many relationships.
     * @example
     * ```typescript
     * const lists = from([[1, 2], [3, 4], [5]]);
     * const flattened = lists.selectMany(x => x).toArray();
     * console.log(flattened); // [1, 2, 3, 4, 5]
     * ```
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;

    /**
     * Determines whether the sequence and another iterable contain equal elements in the same order.
     * @param iterable The iterable to compare against the source sequence.
     * @param comparator Optional equality comparator used to compare element pairs. Defaults to the library's standard equality comparator.
     * @returns {boolean} `true` when both sequences have the same length and all corresponding elements are equal; otherwise, `false`.
     * @remarks Enumeration stops as soon as a mismatch or length difference is observed. Both sequences are fully enumerated only when they are equal.
     * @example
     * ```typescript
     * const numbers1 = from([1, 2, 3]);
     * const numbers2 = [1, 2, 3];
     * const numbers3 = [1, 2, 4];
     *
     * const areEqual1 = numbers1.sequenceEqual(numbers2);
     * console.log(areEqual1); // true
     *
     * const areEqual2 = numbers1.sequenceEqual(numbers3);
     * console.log(areEqual2); // false
     * ```
     */
    sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns a deferred sequence whose elements appear in random order.
     * @returns {IEnumerable<TElement>} A sequence containing the same elements as the source but shuffled.
     * @remarks The implementation materialises all elements into an array before shuffling, making this unsuitable for infinite sequences. Randomness is provided by {@link Collections.shuffle}.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const shuffled = numbers.shuffle().toArray();
     * console.log(shuffled); // e.g., [3, 1, 5, 2, 4]
     * ```
     */
    shuffle(): IEnumerable<TElement>;

    /**
     * Returns the only element that satisfies the provided type guard predicate.
     * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
     * @param predicate Type guard evaluated for each element. The returned value is narrowed to `TFiltered`.
     * @returns {TFiltered} The single element that satisfies {@link predicate}.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when no element satisfies {@link predicate}.
     * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
     * @remarks The source is fully enumerated to ensure exactly one matching element exists.
     * @example
     * ```typescript
     * const numbers = from([5]);
     * const singleElement = numbers.single();
     * console.log(singleElement); // 5
     *
     * const numbers2 = from([1, 2, 3, 4, 5]);
     * const singleEven = numbers2.single(x => x > 4);
     * console.log(singleEven); // 5
     * ```
     */
    single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;

    /**
     * Returns the only element in the sequence or the only element that satisfies an optional predicate.
     * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
     * @returns {TElement} The single element in the sequence or the single element that satisfies {@link predicate}.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
     * @throws {NoMatchingElementException} Thrown when {@link predicate} is provided and no element satisfies it.
     * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
     * @remarks The source is fully enumerated to validate uniqueness.
     */
    single(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the only element that satisfies the provided type guard predicate, or `null` when no such element exists.
     * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
     * @param predicate Type guard evaluated for each element. The returned value is narrowed to `TFiltered` when not `null`.
     * @returns {TFiltered | null} The single matching element, or `null` when no element satisfies {@link predicate}.
     * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
     * @remarks The source is fully enumerated to confirm uniqueness of the matching element.
     * @example
     * ```typescript
     * const numbers = from([5]);
     * const singleElement = numbers.singleOrDefault();
     * console.log(singleElement); // 5
     *
     * const numbers2 = from([1, 2, 3, 4, 5]);
     * const singleEven = numbers2.singleOrDefault(x => x > 4);
     * console.log(singleEven); // 5
     *
     * const empty = from<number>([]);
     * const singleOfEmpty = empty.singleOrDefault();
     * console.log(singleOfEmpty); // null
     *
     * const noMatch = from([1, 2, 3]);
     * const singleNoMatch = noMatch.singleOrDefault(x => x > 4);
     * console.log(singleNoMatch); // null
     * ```
     */
    singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;

    /**
     * Returns the only element in the sequence or the only element that satisfies an optional predicate, or `null` when no such element exists.
     * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
     * @returns {TElement | null} The single element or matching element, or `null` when no element satisfies the conditions.
     * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
     * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
     * @remarks The source is fully enumerated. Unlike {@link single}, this method returns `null` instead of throwing when no matching element is found.
     */
    singleOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Skips a specified number of elements before yielding the remainder of the sequence.
     * @param count Number of elements to bypass. Values less than or equal to zero result in no elements being skipped.
     * @returns {IEnumerable<TElement>} A deferred sequence containing the elements that remain after skipping {@link count} items.
     * @remarks Enumeration is deferred. Only the skipped prefix is traversed without yielding.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const skipped = numbers.skip(2).toArray();
     * console.log(skipped); // [3, 4, 5]
     * ```
     */
    skip(count: number): IEnumerable<TElement>;

    /**
     * Omits a specified number of elements from the end of the sequence.
     * @param count Number of trailing elements to exclude. Values less than or equal to zero leave the sequence unchanged.
     * @returns {IEnumerable<TElement>} A deferred sequence excluding the last {@link count} elements.
     * @remarks The implementation buffers up to {@link count} elements to determine which items to drop, which can increase memory usage for large values.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const skipped = numbers.skipLast(2).toArray();
     * console.log(skipped); // [1, 2, 3]
     * ```
     */
    skipLast(count: number): IEnumerable<TElement>;

    /**
     * Skips elements while a predicate returns `true` and then yields the remaining elements.
     * @param predicate Predicate receiving the element and its index. The first element for which it returns `false` is included in the result.
     * @returns {IEnumerable<TElement>} A deferred sequence starting with the first element that fails {@link predicate}.
     * @remarks The predicate receives a zero-based index that increments only while elements are being skipped.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5, 1, 2]);
     * const skipped = numbers.skipWhile(x => x < 4).toArray();
     * console.log(skipped); // [4, 5, 1, 2]
     * ```
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Splits the sequence into the maximal leading span that satisfies a type guard and the remaining elements.
     * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
     * @param predicate Type guard evaluated for each element until it first returns `false`.
     * @returns {[IEnumerable<TFiltered>, IEnumerable<TElement>]} A tuple containing the contiguous matching prefix and the remainder of the sequence.
     * @remarks The source is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 1, 2]);
     * const [first, second] = numbers.span(x => x < 3);
     * console.log(first.toArray()); // [1, 2]
     * console.log(second.toArray()); // [3, 4, 1, 2]
     * ```
     */
    span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>];

    /**
     * Splits the sequence into the maximal leading span that satisfies a predicate and the remaining elements.
     * @param predicate Predicate evaluated for each element until it first returns `false`.
     * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing the contiguous matching prefix and the remainder of the sequence.
     * @remarks The source is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
     */
    span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Returns every n-th element of the sequence, starting with the first.
     * @param step Positive interval indicating how many elements to skip between yielded items.
     * @returns {IEnumerable<TElement>} A deferred sequence containing elements whose zero-based index is divisible by {@link step}.
     * @throws {InvalidArgumentException} Thrown when {@link step} is less than 1.
     * @remarks The source is enumerated exactly once; elements that are not yielded are still visited.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
     * const stepped = numbers.step(3).toArray();
     * console.log(stepped); // [1, 4, 7]
     * ```
     */
    step(step: number): IEnumerable<TElement>;

    /**
     * Computes the sum of the numeric values produced for each element.
     * @param selector Optional projection that extracts the numeric value. Defaults to interpreting the element itself as a number.
     * @returns {number} The sum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The source is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const total = numbers.sum();
     * console.log(total); // 15
     *
     * const people = from([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     * ]);
     * const totalAge = people.sum(p => p.age);
     * console.log(totalAge); // 55
     * ```
     */
    sum(selector?: Selector<TElement, number>): number;

    /**
     * Returns up to the specified number of leading elements.
     * @param count Number of elements to emit; values less than or equal to zero produce an empty sequence.
     * @returns {IEnumerable<TElement>} A deferred sequence containing at most {@link count} elements from the start of the source.
     * @remarks Enumeration stops once {@link count} elements have been yielded or the source sequence ends.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const firstTwo = numbers.take(2).toArray();
     * console.log(firstTwo); // [1, 2]
     *
     * const emptyTake = numbers.take(0).toArray();
     * console.log(emptyTake); // []
     * ```
     */
    take(count: number): IEnumerable<TElement>;

    /**
     * Returns up to the specified number of trailing elements.
     * @param count Number of elements to keep from the end; values less than or equal to zero produce an empty sequence.
     * @returns {IEnumerable<TElement>} A deferred sequence containing at most {@link count} elements from the end of the source.
     * @remarks The implementation buffers up to {@link count} elements to determine the tail, so memory usage grows with {@link count}. The source must be finite.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const lastTwo = numbers.takeLast(2).toArray();
     * console.log(lastTwo); // [4, 5]
     *
     * const emptyTakeLast = numbers.takeLast(0).toArray();
     * console.log(emptyTakeLast); // []
     * ```
     */
    takeLast(count: number): IEnumerable<TElement>;

    /**
     * Returns consecutive leading elements while a type guard predicate returns `true`, narrowing the element type.
     * @template TFiltered extends TElement Result type produced when {@link predicate} returns `true`.
     * @param predicate Type guard invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
     * @returns {IEnumerable<TFiltered>} A deferred sequence containing the contiguous prefix that satisfies {@link predicate}.
     * @remarks Elements after the first failing element are not inspected.
     * @example
     * ```typescript
     * const mixed: (number | string)[] = [1, 2, 'three', 4, 5];
     * const numbers = from(mixed).takeWhile((x): x is number => typeof x === 'number').toArray();
     * console.log(numbers); // [1, 2]
     * ```
     */
    takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;

    /**
     * Returns consecutive leading elements while a predicate returns `true`.
     * @param predicate Predicate invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
     * @returns {IEnumerable<TElement>} A deferred sequence containing the contiguous prefix that satisfies {@link predicate}.
     * @remarks Elements after the first failing element are not inspected.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5, 1, 2]);
     * const taken = numbers.takeWhile(x => x < 4).toArray();
     * console.log(taken); // [1, 2, 3]
     *
     * const takenWithIndex = numbers.takeWhile((x, i) => i < 3).toArray();
     * console.log(takenWithIndex); // [1, 2, 3]
     * ```
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Invokes the specified action for each element while yielding the original elements unchanged.
     * @param action Callback receiving the element and its zero-based index.
     * @returns {IEnumerable<TElement>} The original sequence, enabling fluent chaining.
     * @remarks The action executes lazily as the sequence is iterated, making it suitable for logging or instrumentation.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const tapped = numbers
     *   .tap(x => console.log(`Processing: ${x}`))
     *   .select(x => x * 2)
     *   .toArray();
     * console.log(tapped); // [2, 4, 6]
     * // Expected console output:
     * // Processing: 1
     * // Processing: 2
     * // Processing: 3
     * ```
     */
    tap(action: IndexedAction<TElement>): IEnumerable<TElement>;

    /**
     * Materialises the sequence into an array.
     * @returns {TElement[]} An array containing all elements from the source sequence in iteration order.
     * @remarks The entire sequence is enumerated immediately. Subsequent changes to the source are not reflected in the returned array.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const array = numbers.toArray();
     * console.log(array); // [1, 2, 3]
     * ```
     */
    toArray(): TElement[];

    /**
     * Materialises the sequence into a circular linked list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {CircularLinkedList<TElement>} A circular linked list containing all elements from the source.
     * @remarks The entire sequence is enumerated immediately, and elements are stored in iteration order.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const circularList = numbers.toCircularLinkedList();
     * console.log(circularList.toArray()); // [1, 2, 3]
     * ```
     */
    toCircularLinkedList(comparator?: EqualityComparator<TElement>): CircularLinkedList<TElement>;

    /**
     * Materialises the sequence into a circular queue that uses the implementation's default capacity.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {CircularQueue<TElement>} A circular queue containing the most recent elements from the source, up to the default capacity.
     * @remarks The entire sequence is enumerated immediately. Once the queue reaches its capacity (currently 32), older items are discarded as new elements are enqueued.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const circularQueue = numbers.toCircularQueue();
     * console.log(circularQueue.toArray()); // [1, 2, 3]
     * ```
     */
    toCircularQueue(comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;

    /**
     * Materialises the sequence into a circular queue with the specified capacity.
     * @param capacity Maximum number of elements retained by the resulting queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {CircularQueue<TElement>} A circular queue containing the most recent elements from the source, bounded by {@link capacity}.
     * @remarks The entire sequence is enumerated immediately. When the source contains more than {@link capacity} elements, earlier items are discarded.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const circularQueue = numbers.toCircularQueue(3);
     * console.log(circularQueue.toArray()); // [3, 4, 5]
     * ```
     */
    toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;

    /**
     * Materialises the sequence into a dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
     * @returns {Dictionary<TKey, TValue>} A dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is enumerated immediately and entries are inserted in iteration order.
     * @example
     * ```typescript
     * const people = from([
     *   { id: 1, name: 'Alice' },
     *   { id: 2, name: 'Bob' },
     * ]);
     * const dictionary = people.toDictionary(p => p.id, p => p.name);
     * console.log(dictionary.get(1)); // 'Alice'
     * console.log(dictionary.get(2)); // 'Bob'
     * ```
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;

    /**
     * Materialises the sequence into an enumerable set containing the distinct elements.
     * @returns {EnumerableSet<TElement>} A set populated with the distinct elements from the source.
     * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's equality semantics.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 2, 3, 1]);
     * const set = numbers.toEnumerableSet();
     * console.log(set.toArray()); // [1, 2, 3]
     * ```
     */
    toEnumerableSet(): EnumerableSet<TElement>;

    /**
     * Materialises the sequence into an immutable circular queue that uses the implementation's default capacity.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing the most recent elements from the source, up to the default capacity.
     * @remarks The entire sequence is enumerated immediately. Earlier items are discarded when the number of elements exceeds the queue's capacity (currently 32).
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const immutableCircularQueue = numbers.toImmutableCircularQueue();
     * console.log(immutableCircularQueue.toArray()); // [1, 2, 3]
     * ```
     */
    toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;

    /**
     * Materialises the sequence into an immutable circular queue with the specified capacity.
     * @param capacity Maximum number of elements retained by the resulting queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing the most recent elements from the source, bounded by {@link capacity}.
     * @remarks The entire sequence is enumerated immediately. When the source contains more than {@link capacity} elements, earlier items are discarded.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const immutableCircularQueue = numbers.toImmutableCircularQueue(3);
     * console.log(immutableCircularQueue.toArray()); // [3, 4, 5]
     * ```
     */
    toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;

    /**
     * Materialises the sequence into an immutable dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
     * @returns {ImmutableDictionary<TKey, TValue>} An immutable dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const people = from([
     *   { id: 1, name: 'Alice' },
     *   { id: 2, name: 'Bob' },
     * ]);
     * const immutableDictionary = people.toImmutableDictionary(p => p.id, p => p.name);
     * console.log(immutableDictionary.get(1)); // 'Alice'
     * console.log(immutableDictionary.get(2)); // 'Bob'
     * ```
     */
    toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;

    /**
     * Materialises the sequence into an immutable list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {ImmutableList<TElement>} An immutable list containing all elements from the source in iteration order.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const immutableList = numbers.toImmutableList();
     * console.log(immutableList.toArray()); // [1, 2, 3]
     * ```
     */
    toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement>;

    /**
     * Materialises the sequence into an immutable priority queue.
     * @param comparator Optional order comparator used to compare elements in the resulting queue.
     * @returns {ImmutablePriorityQueue<TElement>} An immutable priority queue containing all elements from the source.
     * @remarks The entire sequence is enumerated immediately. Elements are ordered according to {@link comparator} or the default ordering.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 4, 1, 5, 9, 2, 6]);
     * const immutablePriorityQueue = numbers.toImmutablePriorityQueue();
     * console.log(immutablePriorityQueue.toArray()); // [1, 1, 2, 3, 4, 5, 6, 9] (sorted)
     * ```
     */
    toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement>;

    /**
     * Materialises the sequence into an immutable FIFO queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {ImmutableQueue<TElement>} An immutable queue containing all elements from the source in enqueue order.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const immutableQueue = numbers.toImmutableQueue();
     * console.log(immutableQueue.toArray()); // [1, 2, 3]
     * ```
     */
    toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement>;

    /**
     * Materialises the sequence into an immutable set containing the distinct elements.
     * @returns {ImmutableSet<TElement>} An immutable set built from the distinct elements of the source.
     * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's equality semantics.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 2, 3, 1]);
     * const immutableSet = numbers.toImmutableSet();
     * console.log(immutableSet.toArray()); // [1, 2, 3]
     * ```
     */
    toImmutableSet(): ImmutableSet<TElement>;

    /**
     * Materialises the sequence into an immutable sorted dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
     * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
     * @returns {ImmutableSortedDictionary<TKey, TValue>} An immutable sorted dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const people = from([
     *   { id: 2, name: 'Bob' },
     *   { id: 1, name: 'Alice' },
     * ]);
     * const immutableSortedDictionary = people.toImmutableSortedDictionary(p => p.id, p => p.name);
     * console.log(immutableSortedDictionary.keys().toArray()); // [1, 2]
     * console.log(immutableSortedDictionary.get(1)); // 'Alice'
     * ```
     */
    toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;

    /**
     * Materialises the sequence into an immutable sorted set of distinct elements.
     * @param comparator Optional order comparator used to sort the elements.
     * @returns {ImmutableSortedSet<TElement>} An immutable sorted set containing the distinct elements from the source.
     * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's ordering semantics.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 4, 1, 5, 9, 2, 6]);
     * const immutableSortedSet = numbers.toImmutableSortedSet();
     * console.log(immutableSortedSet.toArray()); // [1, 2, 3, 4, 5, 6, 9]
     * ```
     */
    toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement>;

    /**
     * Materialises the sequence into an immutable stack (LIFO).
     * @param comparator Optional equality comparator used by the resulting stack.
     * @returns {ImmutableStack<TElement>} An immutable stack whose top element corresponds to the last element of the source.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const immutableStack = numbers.toImmutableStack();
     * console.log(immutableStack.peek()); // 3
     * console.log(immutableStack.pop().peek()); // 2
     * ```
     */
    toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement>;

    /**
     * Materialises the sequence into a linked list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {LinkedList<TElement>} A linked list containing all elements from the source in iteration order.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const linkedList = numbers.toLinkedList();
     * console.log(linkedList.toArray()); // [1, 2, 3]
     * ```
     */
    toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement>;

    /**
     * Materialises the sequence into a resizable list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {List<TElement>} A list containing all elements from the source in iteration order.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const list = numbers.toList();
     * console.log(list.toArray()); // [1, 2, 3]
     * ```
     */
    toList(comparator?: EqualityComparator<TElement>): List<TElement>;

    /**
     * Materialises the sequence into a lookup keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param keyComparator Optional order comparator used to compare keys in the resulting lookup.
     * @returns {ILookup<TKey, TValue>} A lookup grouping the projected values by key.
     * @remarks The entire sequence is enumerated immediately. Elements within each group preserve their original order and the groups are cached for repeated enumeration.
     * @example
     * ```typescript
     * const products = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     * const lookup = products.toLookup(p => p.category, p => p.name);
     * console.log(lookup.get('Fruit').toArray()); // ['Apple', 'Banana']
     * console.log(lookup.get('Vegetable').toArray()); // ['Carrot']
     * ```
     */
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue>;

    /**
     * Materialises the sequence into a `Map` keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @returns {Map<TKey, TValue>} A map populated with the projected key/value pairs.
     * @remarks The entire sequence is enumerated immediately. When {@link keySelector} produces duplicate keys, later elements overwrite earlier entries.
     * @example
     * ```typescript
     * const people = from([
     *   { id: 1, name: 'Alice' },
     *   { id: 2, name: 'Bob' },
     * ]);
     * const map = people.toMap(p => p.id, p => p.name);
     * console.log(map.get(1)); // 'Alice'
     * console.log(map.get(2)); // 'Bob'
     * ```
     */
    toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue>;

    /**
     * Materialises the sequence into a plain object keyed by the provided selector.
     * @template TKey extends string | number | symbol Property key type returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the property key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @returns {Record<TKey, TValue>} An object populated with the projected key/value pairs.
     * @remarks The entire sequence is enumerated immediately. When {@link keySelector} produces duplicate keys, later values overwrite earlier ones.
     * @example
     * ```typescript
     * const people = from([
     *   { id: 1, name: 'Alice' },
     *   { id: 2, name: 'Bob' },
     * ]);
     * const obj = people.toObject(p => p.id, p => p.name);
     * console.log(obj[1]); // 'Alice'
     * console.log(obj[2]); // 'Bob'
     * ```
     */
    toObject<TKey extends PropertyKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue>;

    /**
     * Materialises the sequence into a priority queue.
     * @param comparator Optional order comparator used to compare elements in the resulting queue.
     * @returns {PriorityQueue<TElement>} A priority queue containing all elements from the source.
     * @remarks The entire sequence is enumerated immediately. Elements are ordered according to {@link comparator} or the default ordering.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 4, 1, 5, 9, 2, 6]);
     * const priorityQueue = numbers.toPriorityQueue();
     * console.log(priorityQueue.dequeue()); // 1
     * console.log(priorityQueue.dequeue()); // 1
     * ```
     */
    toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement>;

    /**
     * Materialises the sequence into a FIFO queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Queue<TElement>} A queue containing all elements from the source in enqueue order.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const queue = numbers.toQueue();
     * console.log(queue.dequeue()); // 1
     * console.log(queue.dequeue()); // 2
     * ```
     */
    toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement>;

    /**
     * Materialises the sequence into a native `Set`.
     * @returns {Set<TElement>} A set containing the distinct elements from the source.
     * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using JavaScript's `SameValueZero` semantics.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 2, 3, 1]);
     * const set = numbers.toSet();
     * console.log(Array.from(set)); // [1, 2, 3]
     * ```
     */
    toSet(): Set<TElement>;

    /**
     * Materialises the sequence into a sorted dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
     * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
     * @returns {SortedDictionary<TKey, TValue>} A sorted dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const people = from([
     *   { id: 2, name: 'Bob' },
     *   { id: 1, name: 'Alice' },
     * ]);
     * const sortedDictionary = people.toSortedDictionary(p => p.id, p => p.name);
     * console.log(sortedDictionary.keys().toArray()); // [1, 2]
     * console.log(sortedDictionary.get(1)); // 'Alice'
     * ```
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue>;

    /**
     * Materialises the sequence into a sorted set of distinct elements.
     * @param comparator Optional order comparator used to sort the elements.
     * @returns {SortedSet<TElement>} A sorted set containing the distinct elements from the source.
     * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's ordering semantics.
     * @example
     * ```typescript
     * const numbers = from([3, 1, 4, 1, 5, 9, 2, 6]);
     * const sortedSet = numbers.toSortedSet();
     * console.log(sortedSet.toArray()); // [1, 2, 3, 4, 5, 6, 9]
     * ```
     */
    toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement>;

    /**
     * Materialises the sequence into a stack (LIFO).
     * @param comparator Optional equality comparator used by the resulting stack.
     * @returns {Stack<TElement>} A stack whose top element corresponds to the last element of the source.
     * @remarks The entire sequence is enumerated immediately.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const stack = numbers.toStack();
     * console.log(stack.peek()); // 3
     * console.log(stack.pop().peek()); // 2
     * ```
     */
    toStack(comparator?: EqualityComparator<TElement>): Stack<TElement>;

    /**
     * Creates a set-style union between this sequence and {@link iterable} using an equality comparator.
     * @param iterable Additional sequence whose elements are appended after the source when forming the union.
     * @param comparator Optional equality comparator that determines whether two elements are considered the same. Defaults to the library's standard equality comparator.
     * @returns {IEnumerable<TElement>} A deferred sequence containing the distinct elements from this sequence followed by elements from {@link iterable} that are not already present according to {@link comparator}.
     * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link comparator}.
     * @remarks Elements from the original sequence always appear before contributions from {@link iterable}. The method caches only the comparison keys needed to detect duplicates and enumerates each input at most once.
     * @example
     * ```typescript
     * const numbers1 = from([1, 2, 3, 4, 5]);
     * const numbers2 = [3, 5, 6, 7];
     * const unioned = numbers1.union(numbers2).toArray();
     * console.log(unioned); // [1, 2, 3, 4, 5, 6, 7]
     * ```
     */
    union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Creates a set-style union between this sequence and {@link iterable} by comparing keys projected from each element.
     * @template TKey Type of key generated by {@link keySelector}.
     * @param iterable Additional sequence whose elements are appended after the source when forming the union.
     * @param keySelector Projection that produces a comparison key for each element.
     * @param comparator Optional equality comparator that determines whether two keys are considered the same. Defaults to the library's standard equality comparator.
     * @returns {IEnumerable<TElement>} A deferred sequence containing the distinct elements from this sequence followed by elements from {@link iterable} whose keys were not previously observed.
     * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link keySelector} or {@link comparator}.
     * @remarks Keys are buffered to ensure uniqueness while the elements themselves remain lazily produced. Provide {@link comparator} when keys require structural equality semantics.
     * @example
     * ```typescript
     * const products1 = from([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     * ]);
     * const products2 = [
     *   { name: 'Carrot', category: 'Vegetable' },
     *   { name: 'Apple', category: 'Fruit' },
     * ];
     *
     * const unioned = products1.unionBy(products2, p => p.category).toArray();
     * console.log(unioned);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Banana', category: 'Fruit' },
     * //   { name: 'Carrot', category: 'Vegetable' }
     * // ]
     * ```
     */
    unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Filters the sequence using a type guard predicate and narrows the resulting element type.
     * @template TFiltered extends TElement
     * @param predicate Type guard invoked with each element and its zero-based index. Return `true` to keep the element in the results.
     * @returns {IEnumerable<TFiltered>} A deferred sequence containing only elements that satisfy the type guard.
     * @throws {unknown} Re-throws any error thrown while iterating the source or executing {@link predicate}.
     * @remarks Enumeration is lazy; {@link predicate} executes on demand and may be invoked again if consumers restart iteration.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const evenNumbers = numbers.where(x => x % 2 === 0).toArray();
     * console.log(evenNumbers); // [2, 4]
     * ```
     */
    where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;

    /**
     * Filters the sequence using a predicate that can inspect both the element and its position.
     * @param predicate Predicate invoked with each element and its zero-based index. Return `true` to keep the element in the results.
     * @returns {IEnumerable<TElement>} A deferred sequence containing only the elements that satisfy {@link predicate}.
     * @throws {unknown} Re-throws any error thrown while iterating the source or executing {@link predicate}.
     * @remarks Enumeration is lazy; {@link predicate} executes on demand and iteration stops as soon as the consumer stops reading.
     */
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Produces a sequence of sliding windows of fixed size over the source sequence.
     * @param size Length of each window; must be at least 1.
     * @returns {IEnumerable<IEnumerable<TElement>>} A deferred sequence where each element exposes one contiguous window from the source.
     * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1.
     * @throws {unknown} Re-throws any error thrown while iterating the source sequence.
     * @remarks Windows overlap and are yielded only after enough source elements are observed to fill {@link size}. Trailing partial windows are omitted.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3, 4, 5]);
     * const windows = numbers.windows(3);
     * console.log(windows.select(w => w.toArray()).toArray()); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
     * ```
     */
    windows(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Combines this sequence with {@link iterable} and yields tuples of aligned elements.
     * @template TSecond Type of elements produced by {@link iterable}.
     * @param iterable The secondary sequence whose elements are paired with the source elements.
     * @returns {IEnumerable<[TElement, TSecond]>} A deferred sequence of `[source, other]` tuples truncated to the length of the shorter input.
     * @throws {unknown} Re-throws any error thrown while iterating either sequence.
     * @remarks Enumeration is lazy; pairs are produced on demand and iteration stops when either sequence completes. Use the overload that accepts a `zipper` when you need to project custom results.
     * @example
     * ```typescript
     * const numbers = from([1, 2, 3]);
     * const letters = ['a', 'b', 'c'];
     * const zipped = numbers.zip(letters).toArray();
     * console.log(zipped); // [[1, 'a'], [2, 'b'], [3, 'c']]
     *
     * const zippedWithSelector = numbers.zip(letters, (num, letter) => `${num}-${letter}`).toArray();
     * console.log(zippedWithSelector); // ['1-a', '2-b', '3-c']
     * ```
     */
    zip<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]>;

    /**
     * Combines this sequence with {@link iterable} and projects each aligned pair using {@link zipper}.
     * @template TSecond Type of elements produced by {@link iterable}.
     * @template TResult Result type produced by {@link zipper}.
     * @param iterable The secondary sequence whose elements are paired with the source elements.
     * @param zipper Projection invoked with each `[source, other]` pair to produce the resulting element.
     * @returns {IEnumerable<TResult>} A deferred sequence of projected results truncated to the length of the shorter input.
     * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link zipper}.
     * @remarks Enumeration is lazy; the `zipper` function executes on demand for each pair and iteration stops when either sequence completes.
     */
    zip<TSecond, TResult>(iterable: Iterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;

    zipMany<TIterable extends readonly Iterable<unknown>[]>(
        ...iterables: [...TIterable]
    ): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>;
    zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable, ZipperMany<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<TResult>;
}
