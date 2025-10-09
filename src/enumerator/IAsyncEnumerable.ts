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
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const sum = await numbers.aggregate((acc, x) => acc + x);
     * console.log(sum); // 15
     *
     * const product = await numbers.aggregate((acc, x) => acc * x, 1);
     * console.log(product); // 120
     * ```
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
     * @example
     * ```typescript
     * const products = fromAsync([
     *   { name: 'Apple', category: 'Fruit', price: 1.2 },
     *   { name: 'Banana', category: 'Fruit', price: 0.5 },
     *   { name: 'Carrot', category: 'Vegetable', price: 0.8 },
     *   { name: 'Broccoli', category: 'Vegetable', price: 1.5 },
     * ]);
     *
     * const totalPriceByCategory = await products.aggregateBy(
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
    aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>>

    /**
     * Determines whether every element in the sequence satisfies the supplied predicate.
     * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
     * @returns {Promise<boolean>} `true` when all elements satisfy the predicate; otherwise, `false`.
     * @remarks Enumeration stops as soon as the predicate returns `false`.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const allPositive = await numbers.all(x => x > 0);
     * console.log(allPositive); // true
     *
     * const mixedNumbers = fromAsync([-1, 2, 3, -4, 5]);
     * const allPositive2 = await mixedNumbers.all(x => x > 0);
     * console.log(allPositive2); // false
     * ```
     */
    all(predicate: Predicate<TElement>): Promise<boolean>;

    /**
     * Determines whether the sequence contains at least one element that matches the optional predicate.
     * @param predicate Optional function used to test elements. When omitted, the method resolves to `true` if the sequence contains any element.
     * @returns {Promise<boolean>} `true` when a matching element is found; otherwise, `false`.
     * @remarks When the predicate is omitted, only the first element is inspected, making this more efficient than awaiting `count() > 0`.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const hasEvenNumber = await numbers.any(x => x % 2 === 0);
     * console.log(hasEvenNumber); // true
     *
     * const oddNumbers = fromAsync([1, 3, 5]);
     * const hasEvenNumber2 = await oddNumbers.any(x => x % 2 === 0);
     * console.log(hasEvenNumber2); // false
     * ```
     */
    any(predicate?: Predicate<TElement>): Promise<boolean>;

    /**
     * Creates an async sequence that yields the current elements followed by the supplied element.
     * @param element Element appended to the end of the sequence.
     * @returns {IAsyncEnumerable<TElement>} A new async enumerable whose final item is the provided element.
     * @remarks The source sequence is not modified; enumeration is deferred until the returned sequence is iterated.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3]);
     * const appended = await numbers.append(4).toArray();
     * console.log(appended); // [1, 2, 3, 4]
     * ```
     */
    append(element: TElement): IAsyncEnumerable<TElement>;

    /**
     * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {Promise<number>} A promise that resolves to the arithmetic mean of the selected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const avg = await numbers.average();
     * console.log(avg); // 3
     *
     * const people = fromAsync([
     *   { name: 'Alice', age: 25 },
     *   { name: 'Bob', age: 30 },
     *   { name: 'Charlie', age: 35 },
     * ]);
     * const avgAge = await people.average(p => p.age);
     * console.log(avgAge); // 30
     * ```
     */
    average(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Reinterprets each element in the async sequence as the specified result type.
     * @template TResult Target type exposed by the returned sequence.
     * @returns {IAsyncEnumerable<TResult>} An async sequence that yields the same elements typed as `TResult`.
     * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
     * @example
     * ```typescript
     * const mixed = fromAsync([1, 'two', 3, 'four']);
     * const numbers = mixed.cast<number>().where(x => typeof x === 'number');
     * console.log(await numbers.toArray()); // [1, 3]
     * ```
     */
    cast<TResult>(): IAsyncEnumerable<TResult>;

    /**
     * Splits the sequence into contiguous subsequences containing at most the specified number of elements.
     * @param size Maximum number of elements to include in each chunk. Must be greater than 0.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} An async sequence whose elements are chunks of the original sequence.
     * @throws {InvalidArgumentException} Thrown when `size` is less than 1.
     * @remarks Each chunk is yielded as an `IEnumerable<TElement>`. The final chunk may contain fewer elements than `size`.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5, 6, 7, 8]);
     * const chunks = numbers.chunk(3);
     * const result = await chunks.select(c => c.toArray()).toArray();
     * console.log(result); // [[1, 2, 3], [4, 5, 6], [7, 8]]
     * ```
     */
    chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Generates the unique combinations that can be built from the elements in the async sequence.
     * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} An async sequence of combinations built from the source elements.
     * @throws {InvalidArgumentException} Thrown when `size` is negative.
     * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3]);
     * const combs = numbers.combinations(2);
     * const result = await combs.select(c => c.toArray()).toArray();
     * console.log(result); // [[1, 2], [1, 3], [2, 3]]
     * ```
     */
    combinations(size?: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Appends the specified async iterable to the end of the sequence.
     * @param other Additional elements that are yielded after the current sequence.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the elements of the current sequence followed by those from `other`.
     * @remarks Enumeration of both sequences is deferred until the result is iterated.
     * @example
     * ```typescript
     * const numbers1 = fromAsync([1, 2, 3]);
     * const numbers2 = [4, 5, 6];
     * const concatenated = await numbers1.concat(numbers2).toArray();
     * console.log(concatenated); // [1, 2, 3, 4, 5, 6]
     * ```
     */
    concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Determines whether the async sequence contains a specific element using an optional comparator.
     * @param element Element to locate in the sequence.
     * @param comparator Optional equality comparator used to match elements. Defaults to the library's standard equality comparison.
     * @returns {Promise<boolean>} `true` when the element is found; otherwise, `false`.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const hasThree = await numbers.contains(3);
     * console.log(hasThree); // true
     *
     * const hasTen = await numbers.contains(10);
     * console.log(hasTen); // false
     * ```
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean>;

    /**
     * Counts the number of elements in the async sequence, optionally restricted by a predicate.
     * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
     * @returns {Promise<number>} A promise that resolves to the number of elements that satisfy the predicate.
     * @remarks Prefer calling `any()` to test for existence instead of comparing this result with zero.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const totalCount = await numbers.count();
     * console.log(totalCount); // 5
     *
     * const evenCount = await numbers.count(x => x % 2 === 0);
     * console.log(evenCount); // 2
     * ```
     */
    count(predicate?: Predicate<TElement>): Promise<number>;

    /**
     * Counts the occurrences of elements grouped by a derived key.
     * @template TKey Type produced by `keySelector`.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param comparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<KeyValuePair<TKey, number>>} An async sequence of key/count pairs describing how many elements share each key.
     * @remarks Each key appears exactly once in the result with its associated occurrence count.
     * @example
     * ```typescript
     * const products = fromAsync([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     *
     * const countByCategory = await products.countBy(p => p.category).toArray();
     * console.log(countByCategory);
     * // [
     * //   { key: 'Fruit', value: 2 },
     * //   { key: 'Vegetable', value: 1 }
     * // ]
     * ```
     */
    countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>>;

    /**
     * Repeats the async sequence the specified number of times, or indefinitely when no count is provided.
     * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields the original elements cyclically.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3]);
     * const cycled = await numbers.cycle(2).toArray();
     * console.log(cycled); // [1, 2, 3, 1, 2, 3]
     * ```
     */
    cycle(count?: number): IAsyncEnumerable<TElement>;

    /**
     * Supplies fallback content when the async sequence contains no elements.
     * @param defaultValue Optional value returned in a singleton sequence when the source is empty. Defaults to `null`.
     * @returns {IAsyncEnumerable<TElement | null>} The original sequence when it has elements; otherwise, a singleton sequence containing the provided value.
     * @remarks Use this to guarantee that downstream async operators receive at least one element.
     * @example
     * ```typescript
     * const empty = fromAsync([]);
     * const withDefault = await empty.defaultIfEmpty(0).toArray();
     * console.log(withDefault); // [0]
     *
     * const numbers = fromAsync([1, 2, 3]);
     * const withDefault2 = await numbers.defaultIfEmpty(0).toArray();
     * console.log(withDefault2); // [1, 2, 3]
     * ```
     */
    defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null>;

    /**
     * Eliminates duplicate elements from the async sequence using an optional comparator.
     * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields each distinct element once.
     * @remarks Elements are compared by value; when using custom types, provide an appropriate comparator to avoid reference-based comparisons.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 2, 3, 1, 4, 5, 5]);
     * const distinctNumbers = await numbers.distinct().toArray();
     * console.log(distinctNumbers); // [1, 2, 3, 4, 5]
     * ```
     */
    distinct(keyComparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Eliminates duplicate elements by comparing keys computed for each async element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for distinctness.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that contains the first occurrence of each unique key.
     * @remarks Each element's key is evaluated exactly once; cache expensive key computations when possible.
     * @example
     * ```typescript
     * const products = fromAsync([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     *
     * const distinctByCategory = await products.distinctBy(p => p.category).toArray();
     * console.log(distinctByCategory);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Carrot', category: 'Vegetable' }
     * // ]
     * ```
     */
    distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing each yielded value with its predecessor.
     * @param comparator Optional equality comparator used to determine whether adjacent elements are equal. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields the first element of each run of equal values.
     * @remarks Unlike {@link distinct}, this only filters adjacent duplicates and preserves earlier occurrences of repeated values.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 1, 2, 2, 2, 1, 3, 3]);
     * const distinctUntilChangedNumbers = await numbers.distinctUntilChanged().toArray();
     * console.log(distinctUntilChangedNumbers); // [1, 2, 1, 3]
     * ```
     */
    distinctUntilChanged(comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Removes consecutive duplicate elements by comparing keys projected from each element.
     * @template TKey Key type returned by `keySelector`.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields the first element in each run of elements whose keys change.
     * @remarks Enumeration stops comparing elements once a different key is encountered, making this useful for collapsing grouped async data.
     * @example
     * ```typescript
     * const products = fromAsync([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     *   { name: 'Broccoli', category: 'Vegetable' },
     *   { name: 'Orange', category: 'Fruit' },
     * ]);
     *
     * const distinctByCategory = await products.distinctUntilChangedBy(p => p.category).toArray();
     * console.log(distinctByCategory);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Carrot', category: 'Vegetable' },
     * //   { name: 'Orange', category: 'Fruit' }
     * // ]
     * ```
     */
    distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Asynchronously retrieves the element at the specified zero-based index.
     * @param index Zero-based position of the element to retrieve.
     * @returns {Promise<TElement>} A promise that resolves to the element located at the requested index.
     * @throws {IndexOutOfBoundsException} Thrown when `index` is negative or greater than or equal to the number of elements in the sequence.
     * @throws {NoSuchElementException} Thrown when the sequence terminates unexpectedly before yielding the requested element.
     * @remarks Enumeration stops once the requested element is found; remaining elements are not evaluated.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const element = await numbers.elementAt(2);
     * console.log(element); // 3
     * ```
     */
    elementAt(index: number): Promise<TElement>;

    /**
     * Asynchronously retrieves the element at the specified zero-based index or resolves to `null` when the index is out of range.
     * @param index Zero-based position of the element to retrieve.
     * @returns {Promise<TElement | null>} A promise that resolves to the element at `index`, or `null` when the sequence is shorter than `index + 1` or when `index` is negative.
     * @remarks Use this overload when out-of-range access should produce a sentinel value instead of throwing an exception.
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const element = await numbers.elementAtOrDefault(2);
     * console.log(element); // 3
     *
     * const element2 = await numbers.elementAtOrDefault(10);
     * console.log(element2); // null
     * ```
     */
    elementAtOrDefault(index: number): Promise<TElement | null>;

    /**
     * Returns the elements of this async sequence that are not present in the specified async iterable.
     * @param enumerable Async sequence whose elements should be removed from the current sequence.
     * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the elements from this sequence that do not appear in `enumerable`.
     * @remarks The original ordering and duplicate occurrences from this sequence are preserved. The `enumerable` is fully enumerated to build the exclusion set.
     * @example
     * ```typescript
     * const numbers1 = fromAsync([1, 2, 3, 4, 5]);
     * const numbers2 = [3, 5, 7];
     * const result = await numbers1.except(numbers2).toArray();
     * console.log(result); // [1, 2, 4]
     * ```
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
     * @example
     * ```typescript
     * const products1 = fromAsync([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     * const products2 = [
     *   { name: 'Broccoli', category: 'Vegetable' },
     * ];
     *
     * const result = await products1.exceptBy(products2, p => p.category).toArray();
     * console.log(result);
     * // [
     * //   { name: 'Apple', category: 'Fruit' },
     * //   { name: 'Banana', category: 'Fruit' }
     * // ]
     * ```
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
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const firstElement = await numbers.first();
     * console.log(firstElement); // 1
     *
     * const firstEven = await numbers.first(x => x % 2 === 0);
     * console.log(firstEven); // 2
     * ```
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
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3, 4, 5]);
     * const firstElement = await numbers.firstOrDefault();
     * console.log(firstElement); // 1
     *
     * const firstEven = await numbers.firstOrDefault(x => x % 2 === 0);
     * console.log(firstEven); // 2
     *
     * const empty = fromAsync<number>([]);
     * const firstOfEmpty = await empty.firstOrDefault();
     * console.log(firstOfEmpty); // null
     *
     * const noEvens = fromAsync([1, 3, 5]);
     * const firstEven2 = await noEvens.firstOrDefault(x => x % 2 === 0);
     * console.log(firstEven2); // null
     * ```
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
     * @example
     * ```typescript
     * const numbers = fromAsync([1, 2, 3]);
     * await numbers.forEach((x, i) => console.log(`Index ${i}: ${x}`));
     * // Index 0: 1
     * // Index 1: 2
     * // Index 2: 3
     * ```
     */
    forEach(action: IndexedAction<TElement>): Promise<void>;

    /**
     * Partitions the async sequence into groups based on keys projected from each element.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to derive the grouping key for each element.
     * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
     * @returns {IAsyncEnumerable<IGroup<TKey, TElement>>} An async sequence of groups, each exposing the key and the elements that share it.
     * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration.
     * @example
     * ```typescript
     * const products = fromAsync([
     *   { name: 'Apple', category: 'Fruit' },
     *   { name: 'Banana', category: 'Fruit' },
     *   { name: 'Carrot', category: 'Vegetable' },
     * ]);
     *
     * const grouped = products.groupBy(p => p.category);
     * for await (const group of grouped) {
     *   console.log(group.key, group.toArray());
     * }
     * // Fruit [ { name: 'Apple', category: 'Fruit' }, { name: 'Banana', category: 'Fruit' } ]
     * // Vegetable [ { name: 'Carrot', category: 'Vegetable' } ]
     * ```
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
     * @example
     * ```typescript
     * const categories = fromAsync([
     *   { id: 1, name: 'Fruit' },
     *   { id: 2, name: 'Vegetable' },
     * ]);
     * const products = fromAsync([
     *   { name: 'Apple', categoryId: 1 },
     *   { name: 'Banana', categoryId: 1 },
     *   { name: 'Carrot', categoryId: 2 },
     * ]);
     *
     * const joined = await categories.groupJoin(
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
     * Asynchronously returns the last element that satisfies the provided type guard.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element. Every matching element becomes a candidate, and the final match is returned.
     * @returns {Promise<TFiltered>} A promise that resolves to the last element that satisfies the type guard.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when no element satisfies the type guard.
     * @remarks The entire sequence is enumerated to locate the final match.
     */
    last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;

    /**
     * Asynchronously returns the last element in the sequence, optionally filtered by a predicate.
     * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned.
     * @returns {Promise<TElement>} A promise that resolves to the last element that satisfies the predicate (or the final element when no predicate is supplied).
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
     * @remarks The entire sequence is enumerated to locate the final match.
     */
    last(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Asynchronously returns the last element that satisfies the provided type guard, or `null` when no such element exists.
     * @template TFiltered Subtype confirmed by the type guard.
     * @param predicate Type guard evaluated against each element. Every matching element becomes a candidate, and the final match is returned.
     * @returns {Promise<TFiltered | null>} A promise that resolves to the last element that satisfies the type guard, or `null` when none match.
     * @remarks The entire sequence is enumerated to locate the final match. This overload never rejects for missing elements; it communicates absence through the `null` result.
     */
    lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;

    /**
     * Asynchronously returns the last element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
     * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned.
     * @returns {Promise<TElement | null>} A promise that resolves to the last element that satisfies the predicate, or `null` when no match is found.
     * @remarks The entire sequence is enumerated to locate the final match. This overload never rejects for missing elements; it communicates absence through the `null` result.
     */
    lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Asynchronously returns the largest numeric value produced for the elements in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {Promise<number>} A promise that resolves to the maximum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
     */
    max(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Asynchronously returns the element whose projected key is greatest according to the provided comparator.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {Promise<TElement>} A promise that resolves to the element whose key is maximal.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When multiple elements share the maximal key, the first such element in the sequence is returned.
     */
    maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement>;

    /**
     * Asynchronously returns the smallest numeric value produced for the elements in the sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
     * @returns {Promise<number>} A promise that resolves to the minimum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
     */
    min(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Asynchronously returns the element whose projected key is smallest according to the provided comparator.
     * @template TKey Type of key produced by {@link keySelector}.
     * @param keySelector Selector used to project each element to the key used for comparison.
     * @param comparator Optional order comparator used to compare keys. Defaults to the library's standard order comparison when omitted.
     * @returns {Promise<TElement>} A promise that resolves to the element whose key is minimal.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks When multiple elements share the minimal key, the first such element in the sequence is returned.
     */
    minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement>;

    /**
     * Determines whether the async sequence contains no elements that satisfy the optional predicate.
     * @param predicate Optional predicate evaluated against each element. When omitted, the method resolves to `true` if the sequence is empty.
     * @returns {Promise<boolean>} A promise that resolves to `true` when no element satisfies the predicate (or when the sequence is empty and no predicate is provided); otherwise, `false`.
     * @remarks This is more efficient than negating `any` with a predicate because iteration stops as soon as a matching element is found.
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
     * Sorts the elements of the async sequence in ascending order using the provided comparator.
     * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedAsyncEnumerable<TElement>} An ordered async sequence sorted ascending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
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
     * Sorts the elements of the async sequence in descending order using the provided comparator.
     * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
     * @returns {IOrderedAsyncEnumerable<TElement>} An ordered async sequence sorted descending.
     * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
     */
    orderDescending(comparator?: OrderComparator<TElement>): IOrderedAsyncEnumerable<TElement>;

    /**
     * Creates a deferred asynchronous sequence of adjacent element pairs.
     * @param resultSelector Projection applied to each current/next pair; the value it returns becomes the emitted element.
     * @returns {IAsyncEnumerable<[TElement, TElement]>} An async sequence with one element per consecutive pair from the source sequence.
     * @remarks The final element is omitted because it lacks a successor. Iteration is lazy and consumes the source sequence exactly once via its async iterator.
     */
    pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IAsyncEnumerable<[TElement, TElement]>;

    /**
     * Splits the asynchronous sequence into two cached partitions by applying a type guard predicate.
     * @template TFiltered Type produced when {@link predicate} confirms the element.
     * @param predicate Type guard invoked for each element. Elements that satisfy the predicate populate the first partition.
     * @returns {Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]>} A promise that resolves to the matching partition and the partition with the remaining elements.
     * @remarks The entire source is consumed asynchronously and buffered before the promise resolves, allowing both partitions to be iterated multiple times without replaying the source.
     */
    partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]>;

    /**
     * Splits the asynchronous sequence into two cached partitions by applying a boolean predicate.
     * @param predicate Predicate evaluated for each element. Elements for which it returns `true` populate the first partition.
     * @returns {Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>} A promise that resolves to the elements that satisfied the predicate and those that did not.
     * @remarks The entire source is consumed asynchronously and buffered before the promise resolves, allowing both partitions to be iterated multiple times without replaying the source.
     */
    partition(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;

    /**
     * Generates permutations from the distinct elements of the asynchronous sequence.
     * @param size Optional target length for each permutation. When omitted, permutations use all distinct elements of the source.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} A lazy async sequence of permutations, each materialised as an enumerable.
     * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1 or greater than the number of distinct elements.
     * @remarks The source is fully enumerated to collect distinct elements before permutations are produced. Expect combinatorial growth in the number of permutations.
     */
    permutations(size?: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Returns a deferred asynchronous sequence that yields the supplied element before the source sequence.
     * @param element Element emitted before the original sequence.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that yields {@link element} followed by the source elements.
     * @remarks Enumeration is deferred; the source is not iterated until the resulting sequence is consumed.
     */
    prepend(element: TElement): IAsyncEnumerable<TElement>;

    /**
     * Computes the multiplicative aggregate of the values produced for each element in the asynchronous sequence.
     * @param selector Optional projection that extracts the numeric value for each element. Defaults to interpreting the element itself as a number.
     * @returns {Promise<number>} A promise that resolves to the product of all projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The source is consumed exactly once. Supply {@link selector} when elements are not already numeric.
     */
    product(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Returns a deferred asynchronous sequence that yields the source elements in reverse order.
     * @returns {IAsyncEnumerable<TElement>} An async sequence that produces the elements of the source in reverse iteration order.
     * @remarks The implementation materialises the entire sequence into an array before emitting elements, so avoid using it on infinite sequences or when memory usage is a concern.
     */
    reverse(): IAsyncEnumerable<TElement>;

    /**
     * Returns a deferred asynchronous sequence that rotates the elements by the specified offset while preserving length.
     * @param shift Number of positions to rotate. Positive values move elements toward the end (left rotation); negative values move them toward the beginning (right rotation).
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the same elements shifted by the requested amount.
     * @remarks The source is consumed asynchronously and buffered to honour the rotation. Rotation amounts larger than the sequence length are normalised by that length, which may require buffering the full sequence.
     */
    rotate(shift: number): IAsyncEnumerable<TElement>;

    /**
     * Accumulates the asynchronous sequence and emits each intermediate result.
     * @template TAccumulate Accumulator type produced by {@link accumulator}; defaults to `TElement` when {@link seed} is omitted.
     * @param accumulator Function that merges the current accumulator value with the next element to produce the subsequent accumulator.
     * @param seed Optional initial accumulator. When omitted, the first element supplies the initial accumulator and is emitted as the first result.
     * @returns {IAsyncEnumerable<TAccumulate>} An async sequence containing every intermediate accumulator produced by {@link accumulator}.
     * @throws {NoElementsException} Thrown when the sequence is empty and {@link seed} is not provided.
     * @remarks The source is consumed asynchronously exactly once. Supplying {@link seed} prevents exceptions on empty sources but the seed itself is not emitted.
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IAsyncEnumerable<TAccumulate>;

    /**
     * Transforms each element and its zero-based index into a new value.
     * @template TResult Result type produced by {@link selector}.
     * @param selector Projection invoked for each element together with its index.
     * @returns {IAsyncEnumerable<TResult>} An async sequence containing the values produced by {@link selector}.
     * @remarks Enumeration is deferred. The index argument increments sequentially starting at zero.
     */
    select<TResult>(selector: IndexedSelector<TElement, TResult>): IAsyncEnumerable<TResult>;

    /**
     * Projects each element and index into an iterable and flattens the results into a single asynchronous sequence.
     * @template TResult Element type produced by the flattened iterables.
     * @param selector Projection that returns an iterable for each element and its index.
     * @returns {IAsyncEnumerable<TResult>} An async sequence containing the concatenated contents of the iterables produced by {@link selector}.
     * @remarks Each inner iterable is fully enumerated in order before the next source element is processed, preserving the relative ordering of results.
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IAsyncEnumerable<TResult>;

    /**
     * Determines whether the asynchronous sequence and another async iterable contain equal elements in the same order.
     * @param enumerable Async iterable to compare against the source sequence.
     * @param comparator Optional equality comparator used to compare element pairs. Defaults to the library's standard equality comparator.
     * @returns {Promise<boolean>} A promise that resolves to `true` when both sequences have the same length and all corresponding elements are equal; otherwise, `false`.
     * @remarks Enumeration stops as soon as a mismatch or length difference is observed. Both sequences are fully enumerated only when they are equal.
     */
    sequenceEqual(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): Promise<boolean>;

    /**
     * Returns a deferred asynchronous sequence whose elements appear in random order.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the same elements as the source but shuffled.
     * @remarks The implementation materialises the entire sequence into an array before shuffling, making this unsuitable for infinite sequences. Randomness is provided by {@link Collections.shuffle}.
     */
    shuffle(): IAsyncEnumerable<TElement>;

    /**
     * Returns the only element that satisfies the provided type guard predicate.
     * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
     * @param predicate Type guard evaluated for each element. The resolved element is narrowed to `TFiltered`.
     * @returns {Promise<TFiltered>} A promise that resolves to the single element satisfying {@link predicate}.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {NoMatchingElementException} Thrown when no element satisfies {@link predicate}.
     * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
     * @remarks The source is fully enumerated asynchronously to ensure exactly one matching element exists.
     */
    single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered>;

    /**
     * Returns the only element in the sequence or the only element that satisfies an optional predicate.
     * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
     * @returns {Promise<TElement>} A promise that resolves to the single element in the sequence or the single element that satisfies {@link predicate}.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
     * @throws {NoMatchingElementException} Thrown when {@link predicate} is provided and no element satisfies it.
     * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
     * @remarks The source is fully enumerated asynchronously to validate uniqueness.
     */
    single(predicate?: Predicate<TElement>): Promise<TElement>;

    /**
     * Returns the only element that satisfies the provided type guard predicate, or `null` when no such element exists.
     * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
     * @param predicate Type guard evaluated for each element. The resolved element is narrowed to `TFiltered` when not `null`.
     * @returns {Promise<TFiltered | null>} A promise that resolves to the single matching element, or `null` when no element satisfies {@link predicate}.
     * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
     * @remarks The source is fully enumerated asynchronously to confirm uniqueness of the matching element.
     */
    singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<TFiltered | null>;

    /**
     * Returns the only element in the sequence or the only element that satisfies an optional predicate, or resolves to `null` when no such element exists.
     * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
     * @returns {Promise<TElement | null>} A promise that resolves to the single element or matching element, or `null` when no element satisfies the conditions.
     * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
     * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
     * @remarks Unlike {@link single}, this method communicates the absence of a matching element by resolving to `null`.
     */
    singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null>;

    /**
     * Skips a specified number of elements before yielding the remainder of the asynchronous sequence.
     * @param count Number of elements to bypass. Values less than or equal to zero result in no elements being skipped.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing the elements that remain after skipping {@link count} items.
     * @remarks Enumeration advances through the skipped prefix without yielding any of those elements.
     */
    skip(count: number): IAsyncEnumerable<TElement>;

    /**
     * Omits a specified number of elements from the end of the sequence.
     * @param count Number of trailing elements to exclude. Values less than or equal to zero leave the sequence unchanged.
     * @returns {IAsyncEnumerable<TElement>} An async sequence excluding the last {@link count} elements.
     * @remarks The implementation buffers up to {@link count} elements to determine which items to drop, which can increase memory usage for large counts.
     */
    skipLast(count: number): IAsyncEnumerable<TElement>;

    /**
     * Skips elements while a predicate returns `true` and then yields the remaining elements.
     * @param predicate Predicate receiving the element and its zero-based index. The first element for which it returns `false` is included in the result.
     * @returns {IAsyncEnumerable<TElement>} An async sequence starting with the first element that fails {@link predicate}.
     * @remarks The predicate's index parameter increments only while elements are being skipped.
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Splits the sequence into the maximal leading span that satisfies a type guard and the remaining elements.
     * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
     * @param predicate Type guard evaluated for each element until it first returns `false`.
     * @returns {Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]>} A promise that resolves to the contiguous matching prefix and the remainder of the sequence.
     * @remarks The source is fully enumerated asynchronously and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
     */
    span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): Promise<[IEnumerable<TFiltered>, IEnumerable<TElement>]>;

    /**
     * Splits the sequence into the maximal leading span that satisfies a predicate and the remaining elements.
     * @param predicate Predicate evaluated for each element until it first returns `false`.
     * @returns {Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>} A promise that resolves to the contiguous matching prefix and the remainder of the sequence.
     * @remarks The source is fully enumerated asynchronously and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
     */
    span(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]>;

    /**
     * Returns every n-th element of the sequence, starting with the first.
     * @param step Positive interval indicating how many elements to skip between yielded items.
     * @returns {IAsyncEnumerable<TElement>} An async sequence containing elements whose zero-based index is divisible by {@link step}.
     * @throws {InvalidArgumentException} Thrown when {@link step} is less than 1.
     * @remarks The source is enumerated asynchronously exactly once; elements that are not yielded are still visited to honour the stepping interval.
     */
    step(step: number): IAsyncEnumerable<TElement>;

    /**
     * Computes the sum of the numeric values produced for each element.
     * @param selector Optional projection that extracts the numeric value. Defaults to interpreting the element itself as a number.
     * @returns {Promise<number>} A promise that resolves to the sum of the projected values.
     * @throws {NoElementsException} Thrown when the sequence is empty.
     * @remarks The source is enumerated asynchronously exactly once. Supply {@link selector} when elements are not already numeric.
     */
    sum(selector?: Selector<TElement, number>): Promise<number>;

    /**
     * Returns up to the specified number of leading elements.
     * @param count Number of elements to emit; values less than or equal to zero produce an empty sequence.
     * @returns {IAsyncEnumerable<TElement>} A deferred async sequence containing at most {@link count} elements from the start of the source.
     * @remarks Enumeration stops once {@link count} elements have been yielded or the source sequence ends.
     */
    take(count: number): IAsyncEnumerable<TElement>;

    /**
     * Returns up to the specified number of trailing elements.
     * @param count Number of elements to keep from the end; values less than or equal to zero produce an empty sequence.
     * @returns {IAsyncEnumerable<TElement>} A deferred async sequence containing at most {@link count} elements from the end of the source.
     * @remarks The implementation buffers up to {@link count} elements to determine the tail, so memory usage grows with {@link count}. The source must be finite.
     */
    takeLast(count: number): IAsyncEnumerable<TElement>;

    /**
     * Returns consecutive leading elements while a type guard predicate returns `true`, narrowing the element type.
     * @template TFiltered extends TElement Result type produced when {@link predicate} returns `true`.
     * @param predicate Type guard invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
     * @returns {IAsyncEnumerable<TFiltered>} A deferred async sequence containing the contiguous prefix that satisfies {@link predicate}.
     * @remarks Elements after the first failing element are not inspected.
     */
    takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;

    /**
     * Returns consecutive leading elements while a predicate returns `true`.
     * @param predicate Predicate invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
     * @returns {IAsyncEnumerable<TElement>} A deferred async sequence containing the contiguous prefix that satisfies {@link predicate}.
     * @remarks Elements after the first failing element are not inspected.
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Invokes the specified action for each element while yielding the original elements unchanged.
     * @param action Callback receiving the element and its zero-based index.
     * @returns {IAsyncEnumerable<TElement>} The original async sequence, enabling fluent chaining.
     * @remarks The action executes lazily as the sequence is iterated asynchronously, making it suitable for logging or instrumentation.
     */
    tap(action: IndexedAction<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Materialises the asynchronous sequence into an array.
     * @returns {Promise<TElement[]>} A promise that resolves with all elements from the source sequence in iteration order.
     * @remarks The entire sequence is consumed asynchronously before the array is returned. Subsequent changes to the source are not reflected in the result.
     */
    toArray(): Promise<TElement[]>;

    /**
     * Materialises the asynchronous sequence into a circular linked list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {Promise<CircularLinkedList<TElement>>} A promise that resolves to a circular linked list containing all elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the list is created, and elements are stored in iteration order.
     */
    toCircularLinkedList(comparator?: EqualityComparator<TElement>): Promise<CircularLinkedList<TElement>>;

    /**
     * Materialises the asynchronous sequence into a circular queue that uses the implementation's default capacity.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Promise<CircularQueue<TElement>>} A promise that resolves to a circular queue containing the most recent elements from the source, up to the default capacity.
     * @remarks The entire sequence is consumed asynchronously. Once the queue reaches its capacity (currently 32), older items are discarded as new elements are enqueued.
     */
    toCircularQueue(comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into a circular queue with the specified capacity.
     * @param capacity Maximum number of elements retained by the resulting queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Promise<CircularQueue<TElement>>} A promise that resolves to a circular queue containing the most recent elements from the source, bounded by {@link capacity}.
     * @remarks The entire sequence is consumed asynchronously. When the source contains more than {@link capacity} elements, earlier items are discarded.
     */
    toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<CircularQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into a dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
     * @returns {Promise<Dictionary<TKey, TValue>>} A promise that resolves to a dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is consumed asynchronously before the dictionary is returned.
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<Dictionary<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into an enumerable set containing the distinct elements.
     * @returns {Promise<EnumerableSet<TElement>>} A promise that resolves to a set populated with the distinct elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the set is returned, and duplicate elements are collapsed using the set's equality semantics.
     */
    toEnumerableSet(): Promise<EnumerableSet<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable circular queue that uses the implementation's default capacity.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Promise<ImmutableCircularQueue<TElement>>} A promise that resolves to an immutable circular queue containing the most recent elements from the source, up to the default capacity.
     * @remarks The entire sequence is consumed asynchronously. Earlier items are discarded when the number of elements exceeds the queue's capacity (currently 32).
     */
    toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable circular queue with the specified capacity.
     * @param capacity Maximum number of elements retained by the resulting queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Promise<ImmutableCircularQueue<TElement>>} A promise that resolves to an immutable circular queue containing the most recent elements from the source, bounded by {@link capacity}.
     * @remarks The entire sequence is consumed asynchronously. When the source contains more than {@link capacity} elements, earlier items are discarded.
     */
    toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): Promise<ImmutableCircularQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
     * @returns {Promise<ImmutableDictionary<TKey, TValue>>} A promise that resolves to an immutable dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is consumed asynchronously before the dictionary is returned.
     */
    toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableDictionary<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into an immutable list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {Promise<ImmutableList<TElement>>} A promise that resolves to an immutable list containing all elements from the source in iteration order.
     * @remarks The entire sequence is consumed asynchronously before the list is returned.
     */
    toImmutableList(comparator?: EqualityComparator<TElement>): Promise<ImmutableList<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable priority queue.
     * @param comparator Optional order comparator used to compare elements in the resulting queue.
     * @returns {Promise<ImmutablePriorityQueue<TElement>>} A promise that resolves to an immutable priority queue containing all elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the queue is returned. Elements are ordered according to {@link comparator} or the default ordering.
     */
    toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): Promise<ImmutablePriorityQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable FIFO queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Promise<ImmutableQueue<TElement>>} A promise that resolves to an immutable queue containing all elements from the source in enqueue order.
     * @remarks The entire sequence is consumed asynchronously before the queue is returned.
     */
    toImmutableQueue(comparator?: EqualityComparator<TElement>): Promise<ImmutableQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable set containing the distinct elements.
     * @returns {Promise<ImmutableSet<TElement>>} A promise that resolves to an immutable set built from the distinct elements of the source.
     * @remarks The entire sequence is consumed asynchronously before the set is returned, and duplicate elements are collapsed using the set's equality semantics.
     */
    toImmutableSet(): Promise<ImmutableSet<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable sorted dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
     * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
     * @returns {Promise<ImmutableSortedDictionary<TKey, TValue>>} A promise that resolves to an immutable sorted dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is consumed asynchronously before the dictionary is returned.
     */
    toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<ImmutableSortedDictionary<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into an immutable sorted set of distinct elements.
     * @param comparator Optional order comparator used to sort the elements.
     * @returns {Promise<ImmutableSortedSet<TElement>>} A promise that resolves to an immutable sorted set containing the distinct elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the set is returned, and duplicate elements are collapsed using the set's ordering semantics.
     */
    toImmutableSortedSet(comparator?: OrderComparator<TElement>): Promise<ImmutableSortedSet<TElement>>;

    /**
     * Materialises the asynchronous sequence into an immutable stack (LIFO).
     * @param comparator Optional equality comparator used by the resulting stack.
     * @returns {Promise<ImmutableStack<TElement>>} A promise that resolves to an immutable stack whose top element corresponds to the last element of the source.
     * @remarks The entire sequence is consumed asynchronously before the stack is returned.
     */
    toImmutableStack(comparator?: EqualityComparator<TElement>): Promise<ImmutableStack<TElement>>;

    /**
     * Materialises the asynchronous sequence into a linked list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {Promise<LinkedList<TElement>>} A promise that resolves to a linked list containing all elements from the source in iteration order.
     * @remarks The entire sequence is consumed asynchronously before the list is returned.
     */
    toLinkedList(comparator?: EqualityComparator<TElement>): Promise<LinkedList<TElement>>;

    /**
     * Materialises the asynchronous sequence into a resizable list.
     * @param comparator Optional equality comparator used by the resulting list.
     * @returns {Promise<List<TElement>>} A promise that resolves to a list containing all elements from the source in iteration order.
     * @remarks The entire sequence is consumed asynchronously before the list is returned.
     */
    toList(comparator?: EqualityComparator<TElement>): Promise<List<TElement>>;

    /**
     * Materialises the asynchronous sequence into a lookup keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param keyComparator Optional order comparator used to compare keys in the resulting lookup.
     * @returns {Promise<ILookup<TKey, TValue>>} A promise that resolves to a lookup grouping the projected values by key.
     * @remarks The entire sequence is consumed asynchronously. Elements within each group preserve their original order and the groups are cached for repeated enumeration.
     */
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): Promise<ILookup<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into a `Map` keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @returns {Promise<Map<TKey, TValue>>} A promise that resolves to a map populated with the projected key/value pairs.
     * @remarks The entire sequence is consumed asynchronously. When {@link keySelector} produces duplicate keys, later elements overwrite earlier entries.
     */
    toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Map<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into a plain object keyed by the provided selector.
     * @template TKey extends string | number | symbol Property key type returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the property key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @returns {Promise<Record<TKey, TValue>>} A promise that resolves to an object populated with the projected key/value pairs.
     * @remarks The entire sequence is consumed asynchronously. When {@link keySelector} produces duplicate keys, later values overwrite earlier ones.
     */
    toObject<TKey extends PropertyKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Record<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into a priority queue.
     * @param comparator Optional order comparator used to compare elements in the resulting queue.
     * @returns {Promise<PriorityQueue<TElement>>} A promise that resolves to a priority queue containing all elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the queue is returned. Elements are ordered according to {@link comparator} or the default ordering.
     */
    toPriorityQueue(comparator?: OrderComparator<TElement>): Promise<PriorityQueue<TElement>>;

    /**
     * Materialises the asynchronous sequence into a FIFO queue.
     * @param comparator Optional equality comparator used by the resulting queue.
     * @returns {Promise<Queue<TElement>>} A promise that resolves to a queue containing all elements from the source in enqueue order.
     * @remarks The entire sequence is consumed asynchronously before the queue is returned.
     */
    toQueue(comparator?: EqualityComparator<TElement>): Promise<Queue<TElement>>;

    /**
     * Materialises the asynchronous sequence into a native `Set`.
     * @returns {Promise<Set<TElement>>} A promise that resolves to a set containing the distinct elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the set is returned, and duplicate elements are collapsed using JavaScript's `SameValueZero` semantics.
     */
    toSet(): Promise<Set<TElement>>;

    /**
     * Materialises the asynchronous sequence into a sorted dictionary keyed by the provided selector.
     * @template TKey Type of key returned by {@link keySelector}.
     * @template TValue Type of value returned by {@link valueSelector}.
     * @param keySelector Selector used to derive the key for each element.
     * @param valueSelector Selector used to derive the value for each element.
     * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
     * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
     * @returns {Promise<SortedDictionary<TKey, TValue>>} A promise that resolves to a sorted dictionary populated with the projected key/value pairs.
     * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
     * @remarks The entire sequence is consumed asynchronously before the dictionary is returned.
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Promise<SortedDictionary<TKey, TValue>>;

    /**
     * Materialises the asynchronous sequence into a sorted set of distinct elements.
     * @param comparator Optional order comparator used to sort the elements.
     * @returns {Promise<SortedSet<TElement>>} A promise that resolves to a sorted set containing the distinct elements from the source.
     * @remarks The entire sequence is consumed asynchronously before the set is returned, and duplicate elements are collapsed using the set's ordering semantics.
     */
    toSortedSet(comparator?: OrderComparator<TElement>): Promise<SortedSet<TElement>>;

    /**
     * Materialises the asynchronous sequence into a stack (LIFO).
     * @param comparator Optional equality comparator used by the resulting stack.
     * @returns {Promise<Stack<TElement>>} A promise that resolves to a stack whose top element corresponds to the last element of the source.
     * @remarks The entire sequence is consumed asynchronously before the stack is returned.
     */
    toStack(comparator?: EqualityComparator<TElement>): Promise<Stack<TElement>>;

    /**
     * Creates a set-style union between this asynchronous sequence and {@link enumerable} using an equality comparator.
     * @param enumerable Additional asynchronous sequence whose elements are consumed after the source when forming the union.
     * @param comparator Optional equality comparator that determines whether two elements are considered the same. Defaults to the library's standard equality comparator.
     * @returns {IAsyncEnumerable<TElement>} A deferred asynchronous sequence containing the distinct elements from this sequence followed by elements from {@link enumerable} that are not already present according to {@link comparator}.
     * @throws {unknown} Re-throws any error thrown while iterating either async sequence or executing {@link comparator}.
     * @remarks Elements from the original sequence always appear before contributions from {@link enumerable}. The method buffers only the comparison data needed to detect duplicates and consumes each input at most once.
     */
    union(enumerable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Creates a set-style union between this asynchronous sequence and {@link enumerable} by comparing keys projected from each element.
     * @template TKey Type of key generated by {@link keySelector}.
     * @param enumerable Additional asynchronous sequence whose elements are consumed after the source when forming the union.
     * @param keySelector Projection that produces a comparison key for each element.
     * @param comparator Optional equality comparator that determines whether two keys are considered the same. Defaults to the library's standard equality comparator.
     * @returns {IAsyncEnumerable<TElement>} A deferred asynchronous sequence containing the distinct elements from this sequence followed by elements from {@link enumerable} whose keys were not previously observed.
     * @throws {unknown} Re-throws any error thrown while iterating either async sequence or executing {@link keySelector} or {@link comparator}.
     * @remarks Keys are buffered to ensure uniqueness while elements remain streamable. Provide {@link comparator} when keys require structural equality semantics.
     */
    unionBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement>;

    /**
     * Filters the asynchronous sequence using a type guard predicate and narrows the resulting element type.
     * @template TFiltered extends TElement
     * @param predicate Type guard invoked with each element and its zero-based index. Return `true` to keep the element in the results.
     * @returns {IAsyncEnumerable<TFiltered>} A deferred async sequence containing only elements that satisfy the type guard.
     * @throws {unknown} Re-throws any error thrown while iterating the source or awaiting {@link predicate}.
     * @remarks Enumeration is lazy; {@link predicate} executes on demand and may run concurrently when the consumer requests multiple elements in parallel.
     */
    where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IAsyncEnumerable<TFiltered>;

    /**
     * Filters the asynchronous sequence using a predicate that can inspect both the element and its position.
     * @param predicate Predicate invoked with each element and its zero-based index. Return `true` to keep the element in the results.
     * @returns {IAsyncEnumerable<TElement>} A deferred async sequence containing only the elements that satisfy {@link predicate}.
     * @throws {unknown} Re-throws any error thrown while iterating the source or awaiting {@link predicate}.
     * @remarks Enumeration is lazy; {@link predicate} executes on demand and iteration stops as soon as the consumer stops awaiting further elements.
     */
    where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement>;

    /**
     * Produces an asynchronous sequence of sliding windows of fixed size over the source sequence.
     * @param size Length of each window; must be at least 1.
     * @returns {IAsyncEnumerable<IEnumerable<TElement>>} A deferred async sequence where each element exposes one contiguous window from the source.
     * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1.
     * @throws {unknown} Re-throws any error thrown while asynchronously iterating the source sequence.
     * @remarks Windows overlap and are yielded only after enough source elements are observed to fill {@link size}. Trailing partial windows are omitted.
     */
    windows(size: number): IAsyncEnumerable<IEnumerable<TElement>>;

    /**
     * Combines this asynchronous sequence with {@link iterable} and yields tuples of aligned elements.
     * @template TSecond Type of elements produced by {@link iterable}.
     * @param iterable The secondary async sequence whose elements are paired with the source elements.
     * @returns {IAsyncEnumerable<[TElement, TSecond]>} A deferred async sequence of `[source, other]` tuples truncated to the length of the shorter input.
     * @throws {unknown} Re-throws any error thrown while iterating either async sequence.
     * @remarks Enumeration is lazy; pairs are produced on demand and iteration stops when either sequence completes. Use the overload that accepts a `zipper` when you need to project custom results.
     */
    zip<TSecond>(iterable: AsyncIterable<TSecond>): IAsyncEnumerable<[TElement, TSecond]>;

    /**
     * Combines this asynchronous sequence with {@link iterable} and projects each aligned pair using {@link zipper}.
     * @template TSecond Type of elements produced by {@link iterable}.
     * @template TResult Result type produced by {@link zipper}.
     * @param iterable The secondary async sequence whose elements are paired with the source elements.
     * @param zipper Projection invoked with each `[source, other]` pair to produce the resulting element. When omitted, the overload returning tuples should be used instead.
     * @returns {IAsyncEnumerable<TResult>} A deferred async sequence of projected results truncated to the length of the shorter input.
     * @throws {unknown} Re-throws any error thrown while iterating either async sequence or executing the `zipper` function.
     * @remarks Enumeration is lazy; the `zipper` function executes on demand for each pair and iteration stops when either sequence completes.
     */
    zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult>;
}
