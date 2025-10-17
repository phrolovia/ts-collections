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
import { Zipper, ZipManyZipper } from "../shared/Zipper";
import { ImmutableStack } from "../stack/ImmutableStack";
import { Stack } from "../stack/Stack";
import { Enumerable } from "./Enumerable";
import { from } from "./functions/from";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";
import { PipeOperator } from "../shared/PipeOperator";
import { UnpackIterableTuple } from "../shared/UnpackIterableTuple";
import { MedianTieStrategy } from "../shared/MedianTieStrategy";
import { PercentileStrategy } from "../shared/PercentileStrategy";

/**
 * Determines whether every element in the sequence satisfies the supplied predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
 * @returns {boolean} `true` when all elements satisfy the predicate; otherwise, `false`.
 * @remarks Enumeration stops as soon as the predicate returns `false`.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const allPositive = all(numbers, x => x > 0);
 * console.log(allPositive); // true
 *
 * const mixedNumbers = [-1, 2, 3, -4, 5];
 * const allPositive2 = all(mixedNumbers, x => x > 0);
 * console.log(allPositive2); // false
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasEvenNumber = any(numbers, x => x % 2 === 0);
 * console.log(hasEvenNumber); // true
 *
 * const oddNumbers = [1, 3, 5];
 * const hasEvenNumber2 = any(oddNumbers, x => x % 2 === 0);
 * console.log(hasEvenNumber2); // false
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const appended = append(numbers, 4).toArray();
 * console.log(appended); // [1, 2, 3, 4]
 * ```
 */
export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
};

/**
 * Determines whether {@link source} contains at least {@link count} elements that satisfy the optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The iterable whose elements are evaluated.
 * @param count Minimum number of matching elements required. Must be greater than or equal to 0.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, every element is considered a match.
 * @returns {boolean} `true` when at least {@link count} matching elements are present; otherwise, `false`.
 * @throws {InvalidArgumentException} Thrown when {@link count} is negative.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the predicate.
 * @remarks Enumeration stops as soon as the required number of matches is found, avoiding unnecessary work on long iterables.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasAtLeastTwoEvens = atLeast(numbers, 2, n => n % 2 === 0);
 * console.log(hasAtLeastTwoEvens); // true
 * ```
 */
export const atLeast = <TElement>(
    source: Iterable<TElement>,
    count: number,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).atLeast(count, predicate);
};

/**
 * Determines whether {@link source} contains no more than {@link count} elements that satisfy the optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The iterable whose elements are evaluated.
 * @param count Maximum number of matching elements allowed. Must be greater than or equal to 0.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, every element is considered a match.
 * @returns {boolean} `true` when the number of matching elements does not exceed {@link count}; otherwise, `false`.
 * @throws {InvalidArgumentException} Thrown when {@link count} is negative.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the predicate.
 * @remarks Enumeration stops as soon as the count is exceeded, making it efficient for large or infinite iterables.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasAtMostOneEven = atMost(numbers, 1, n => n % 2 === 0);
 * console.log(hasAtMostOneEven); // false
 * ```
 */
export const atMost = <TElement>(
    source: Iterable<TElement>,
    count: number,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).atMost(count, predicate);
};

/**
 * Computes the arithmetic mean of the numeric values produced for each element in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The arithmetic mean of the selected values.
 * @throws {NoElementsException} Thrown when `source` is empty.
 * @remarks Provide a selector when the elements are not already numeric. All values are enumerated exactly once.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const avg = average(numbers);
 * console.log(avg); // 3
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 35 },
 * ];
 * const avgAge = average(people, p => p.age);
 * console.log(avgAge); // 30
 * ```
 */
export const average = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).average(selector);
};

/**
 * Produces the cartesian product between {@link source} and {@link other}.
 * @template TElement Type of elements in the {@link source} iterable.
 * @template TSecond Type of elements in the {@link other} iterable.
 * @param source The primary iterable that drives the resulting sequence.
 * @param other The secondary iterable paired with every element from {@link source}.
 * @returns {IEnumerable<[TElement, TSecond]>} A deferred sequence that yields each ordered pair `[source, other]`.
 * @throws {unknown} Re-throws any error raised while iterating {@link source} or {@link other}.
 * @remarks The secondary iterable is fully buffered before iteration starts so that it can be replayed for every element from {@link source}. The resulting sequence stops when {@link source} completes.
 * @example
 * ```typescript
 * const pairs = cartesian([1, 2], ['A', 'B']).toArray();
 * console.log(pairs); // [[1, 'A'], [1, 'B'], [2, 'A'], [2, 'B']]
 * ```
 */
export const cartesian = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>
): IEnumerable<[TElement, TSecond]> => {
    return from(source).cartesian(other);
}

/**
 * Reinterprets each element in the sequence as the specified result type.
 * @template TResult Target type exposed by the returned sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TResult>} A sequence that yields the same elements typed as `TResult`.
 * @remarks No runtime conversion occurs; ensure the underlying elements are compatible with `TResult` to avoid downstream failures.
 * @example
 * ```typescript
 * const mixed = [1, 'two', 3, 'four'];
 * const numbers = cast<number>(mixed).where(x => typeof x === 'number');
 * console.log(numbers.toArray()); // [1, 3]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
 * const chunks = chunk(numbers, 3);
 * console.log(chunks.select(c => c.toArray()).toArray()); // [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const combs = combinations(numbers, 2);
 * console.log(combs.select(c => c.toArray()).toArray()); // [[1, 2], [1, 3], [2, 3]]
 * ```
 */
export const combinations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).combinations(size);
};

/**
 * Filters out `null` and `undefined` values from the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<NonNullable<TElement>>} A sequence containing only the elements that are neither `null` nor `undefined`.
 * @remarks The method preserves other falsy values (such as `0` or an empty string) and defers execution until the returned sequence is iterated.
 * @example
 * ```typescript
 * const values = compact([1, null, 0, undefined]).toArray();
 * console.log(values); // [1, 0]
 * ```
 */
export const compact = <TElement>(
    source: Iterable<TElement>,
): IEnumerable<NonNullable<TElement>> => {
    return from(source).compact();
};

/**
 * Appends the specified iterable to the end of the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Additional elements that are yielded after the current sequence.
 * @returns {IEnumerable<TElement>} A sequence containing the elements of the current sequence followed by those from `other`.
 * @remarks Enumeration of both sequences is deferred until the result is iterated.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3];
 * const numbers2 = [4, 5, 6];
 * const concatenated = concat(numbers1, numbers2).toArray();
 * console.log(concatenated); // [1, 2, 3, 4, 5, 6]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasThree = contains(numbers, 3);
 * console.log(hasThree); // true
 *
 * const hasTen = contains(numbers, 10);
 * console.log(hasTen); // false
 * ```
 */
export const contains = <TElement>(
    source: Iterable<TElement>,
    element: TElement,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).contains(element, comparator);
};

/**
 * Computes the Pearson correlation coefficient between {@link source} and {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements within the {@link other} iterable.
 * @param source The source iterable whose elements align with {@link other} by index.
 * @param other The iterable that provides the second series of aligned values.
 * @param selector Optional projection that extracts the numeric value for each element of {@link source}. Defaults to treating the element itself as numeric.
 * @param otherSelector Optional projection that extracts the numeric value for each element of {@link other}. Defaults to treating the element itself as numeric.
 * @returns {number} The correlation coefficient in the interval [-1, 1].
 * @throws {DimensionMismatchException} Thrown when the iterables do not contain the same number of elements.
 * @throws {InsufficientElementException} Thrown when fewer than two aligned pairs are available.
 * @throws {Error} Thrown when the standard deviation of either numeric projection is zero.
 * @throws {unknown} Re-throws any error encountered while iterating either iterable or executing the selector projections.
 * @remarks Both iterables are enumerated simultaneously via an online algorithm that avoids buffering the full dataset. Ensure the iterables are aligned because mismatch detection occurs only after enumeration begins.
 * @example
 * ```typescript
 * const temperatures = [15, 18, 21, 24];
 * const sales = [30, 36, 42, 48];
 * const result = correlation(temperatures, sales);
 * console.log(result); // 1
 * ```
 */
export const correlation = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    selector?: Selector<TElement, number>,
    otherSelector?: Selector<TSecond, number>
): number => {
    return from(source).correlation(other, selector, otherSelector);
};

/**
 * Computes the Pearson correlation coefficient between two numeric projections of {@link source}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable that supplies the data for both projections.
 * @param leftSelector Projection that produces the first numeric series for each element.
 * @param rightSelector Projection that produces the second numeric series for each element.
 * @returns {number} The correlation coefficient in the interval [-1, 1].
 * @throws {InsufficientElementException} Thrown when fewer than two elements are available.
 * @throws {Error} Thrown when the standard deviation of either numeric projection is zero.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the selector projections.
 * @remarks The iterable is enumerated exactly once using an online algorithm, which keeps memory usage constant even for large inputs.
 * @example
 * ```typescript
 * const metrics = [
 *   { impressions: 1_000, clicks: 50 },
 *   { impressions: 1_500, clicks: 75 },
 *   { impressions: 2_000, clicks: 100 }
 * ];
 * const result = correlationBy(metrics, m => m.impressions, m => m.clicks);
 * console.log(result); // 1
 * ```
 */
export const correlationBy = <TElement>(
    source: Iterable<TElement>,
    leftSelector: Selector<TElement, number>,
    rightSelector: Selector<TElement, number>
): number => {
    return from(source).correlationBy(leftSelector, rightSelector);
};

/**
 * Counts the number of elements in the sequence, optionally restricted by a predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
 * @returns {number} The number of elements that satisfy the predicate.
 * @remarks Prefer calling `any(source)` to test for existence instead of comparing this result with zero.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const totalCount = count(numbers);
 * console.log(totalCount); // 5
 *
 * const evenCount = count(numbers, x => x % 2 === 0);
 * console.log(evenCount); // 2
 * ```
 */
export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    if (!predicate) {
        if (Array.isArray(source)) {
            return source.length;
        }
        if (source instanceof Set || source instanceof Map) {
            return source.size;
        }
    }
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
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const countByCategory = countBy(products, p => p.category).toArray();
 * console.log(countByCategory);
 * // [
 * //   { key: 'Fruit', value: 2 },
 * //   { key: 'Vegetable', value: 1 }
 * // ]
 * ```
 */
export const countBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, number>> => {
    return from(source).countBy(keySelector, comparator);
};

/**
 * Calculates the covariance between {@link source} and {@link other}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TSecond Type of elements within {@link other}.
 * @param source The primary iterable whose elements align by index with {@link other}.
 * @param other Secondary iterable supplying the paired values.
 * @param selector Optional projection that extracts the numeric value for each element in {@link source}. Defaults to treating the element itself as numeric.
 * @param otherSelector Optional projection that extracts the numeric value for each element in {@link other}. Defaults to treating the element itself as numeric.
 * @param sample When `true`, computes the sample covariance dividing by _n - 1_; when `false`, computes the population covariance dividing by _n_. Defaults to `true`.
 * @returns {number} The calculated covariance.
 * @throws {DimensionMismatchException} Thrown when {@link source} and {@link other} do not contain the same number of elements.
 * @throws {InsufficientElementException} Thrown when fewer than two aligned pairs are available.
 * @throws {unknown} Re-throws any error thrown while iterating either iterable or executing the selector projections.
 * @remarks Both iterables are consumed simultaneously so streaming statistics can be computed without materialising all elements. Ensure the iterables are aligned because mismatch detection occurs only after iteration begins.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const doubles = [2, 4, 6, 8, 10];
 * const covarianceValue = covariance(numbers, doubles);
 * console.log(covarianceValue); // 5
 * ```
 */
export const covariance = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    selector?: Selector<TElement, number>,
    otherSelector?: Selector<TSecond, number>,
    sample?: boolean
): number => {
    return from(source).covariance(other, selector, otherSelector, sample);
};

/**
 * Calculates the covariance between two numeric projections of {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param leftSelector Projection that produces the first numeric series for each element.
 * @param rightSelector Projection that produces the second numeric series for each element.
 * @param sample When `true`, computes the sample covariance dividing by _n - 1_; when `false`, computes the population covariance dividing by _n_. Defaults to `true`.
 * @returns {number} The calculated covariance.
 * @throws {InsufficientElementException} Thrown when fewer than two elements are available.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing the selector projections.
 * @remarks {@link source} is consumed exactly once using an online algorithm that avoids buffering, making it suitable for large datasets.
 * @example
 * ```typescript
 * const points = [
 *   { x: 1, y: 2 },
 *   { x: 2, y: 4 },
 *   { x: 3, y: 6 }
 * ];
 * const covarianceValue = covarianceBy(points, p => p.x, p => p.y);
 * console.log(covarianceValue); // 2
 * ```
 */
export const covarianceBy = <TElement>(
    source: Iterable<TElement>,
    leftSelector: Selector<TElement, number>,
    rightSelector: Selector<TElement, number>,
    sample?: boolean
): number => {
    return from(source).covarianceBy(leftSelector, rightSelector, sample);
};

/**
 * Repeats the sequence the specified number of times, or indefinitely when no count is provided.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
 * @returns {IEnumerable<TElement>} A sequence that yields the original elements cyclically.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const cycled = cycle(numbers, 2).toArray();
 * console.log(cycled); // [1, 2, 3, 1, 2, 3]
 * ```
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
 * @example
 * ```typescript
 * const empty = [];
 * const withDefault = defaultIfEmpty(empty, 0).toArray();
 * console.log(withDefault); // [0]
 *
 * const numbers = [1, 2, 3];
 * const withDefault2 = defaultIfEmpty(numbers, 0).toArray();
 * console.log(withDefault2); // [1, 2, 3]
 * ```
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(value);
};

/**
 * Determines whether {@link source} and {@link other} share no equivalent elements.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements within the {@link other} iterable.
 * @param source The primary iterable.
 * @param other Iterable compared against {@link source}.
 * @param comparator Optional equality comparator used to match elements across both iterables. Defaults to the library's standard equality comparison.
 * @returns {boolean} `true` when the iterables are disjoint; otherwise, `false`.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source}, {@link other}, or executing the comparator.
 * @remarks When the default comparator is used, the implementation buffers the source elements in a {@link Set} so it can short-circuit as soon as a shared element is detected.
 * With a custom comparator, every pair of elements is compared, which may iterate each iterable multiple times; prefer the default comparator when possible for better performance.
 * @example
 * ```typescript
 * const first = [1, 2, 3];
 * const second = [4, 5, 6];
 * const areDisjoint = disjoint(first, second);
 * console.log(areDisjoint); // true
 * ```
 */
export const disjoint = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    comparator?: EqualityComparator<TElement | TSecond>
): boolean => {
    return from(source).disjoint(other, comparator);
};

/**
 * Determines whether the key projections of {@link source} and {@link other} are mutually exclusive.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements within the {@link other} iterable.
 * @template TKey Key type produced by {@link keySelector}.
 * @template TSecondKey Key type produced by {@link otherKeySelector}.
 * @param source The primary iterable.
 * @param other Iterable compared against {@link source}.
 * @param keySelector Projection that produces the key evaluated for each source element.
 * @param otherKeySelector Projection that produces the key evaluated for each element of {@link other}.
 * @param keyComparator Optional equality comparator applied to projected keys. Defaults to the library's standard equality comparison.
 * @returns {boolean} `true` when no projected keys intersect; otherwise, `false`.
 * @throws {unknown} Re-throws any error encountered while iterating either iterable or executing the selector projections/comparator.
 * @remarks When the default comparator is used, the implementation buffers the larger key collection in a {@link Set} and short-circuits as soon as an intersecting key is found.
 * Supplying a custom comparator forces a full pairwise comparison, which may iterate both iterables repeatedly; prefer the default comparator when suitable.
 * @example
 * ```typescript
 * const left = [{ name: 'Alice' }, { name: 'Bella' }];
 * const right = [{ name: 'Mel' }];
 * const areDisjoint = disjointBy(left, right, p => p.name, p => p.name);
 * console.log(areDisjoint); // true
 * ```
 */
export const disjointBy = <TElement, TSecond, TKey, TSecondKey>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    keySelector: Selector<TElement, TKey>,
    otherKeySelector: Selector<TSecond, TSecondKey>,
    keyComparator?: EqualityComparator<TKey | TSecondKey>
): boolean => {
    return from(source).disjointBy(other, keySelector, otherKeySelector, keyComparator);
};

/**
 * Eliminates duplicate elements from the sequence using an optional comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields each distinct element once.
 * @remarks Elements are compared by value; provide a comparator for custom reference types.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1, 4, 5, 5];
 * const distinctNumbers = distinct(numbers).toArray();
 * console.log(distinctNumbers); // [1, 2, 3, 4, 5]
 * ```
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
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const distinctByCategory = distinctBy(products, p => p.category).toArray();
 * console.log(distinctByCategory);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' }
 * // ]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 1, 2, 2, 2, 1, 3, 3];
 * const distinctUntilChangedNumbers = distinctUntilChanged(numbers).toArray();
 * console.log(distinctUntilChangedNumbers); // [1, 2, 1, 3]
 * ```
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
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 *   { name: 'Broccoli', category: 'Vegetable' },
 *   { name: 'Orange', category: 'Fruit' },
 * ];
 *
 * const distinctByCategory = distinctUntilChangedBy(products, p => p.category).toArray();
 * console.log(distinctByCategory);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' },
 * //   { name: 'Orange', category: 'Fruit' }
 * // ]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const element = elementAt(numbers, 2);
 * console.log(element); // 3
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const element = elementAtOrDefault(numbers, 2);
 * console.log(element); // 3
 *
 * const element2 = elementAtOrDefault(numbers, 10);
 * console.log(element2); // null
 * ```
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
 * @example
 * ```typescript
 * const emptySequence = empty<number>();
 * console.log(emptySequence.toArray()); // []
 * ```
 */
export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};

/**
 * Determines whether {@link source} contains exactly {@link count} elements that satisfy the optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The iterable whose elements are evaluated.
 * @param count Exact number of matching elements required. Must be greater than or equal to 0.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, every element is considered a match.
 * @returns {boolean} `true` when exactly {@link count} matching elements are present; otherwise, `false`.
 * @throws {InvalidArgumentException} Thrown when {@link count} is negative.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the predicate.
 * @remarks Enumeration stops once the running total exceeds {@link count}, preventing unnecessary work on long iterables.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasExactlyThreeOdds = exactly(numbers, 3, n => n % 2 !== 0);
 * console.log(hasExactlyThreeOdds); // true
 * ```
 */
export const exactly = <TElement>(
    source: Iterable<TElement>,
    count: number,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).exactly(count, predicate);
};

/**
 * Returns the elements of {@link source} that are not present in {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Sequence whose elements should be removed from {@link source}.
 * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the elements from {@link source} that do not appear in {@link other}.
 * @remarks The original ordering and duplicate occurrences from {@link source} are preserved. {@link other} is fully enumerated to build the exclusion set.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3, 4, 5];
 * const numbers2 = [3, 5, 7];
 * const result = except(numbers1, numbers2).toArray();
 * console.log(result); // [1, 2, 4]
 * ```
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
 * @example
 * ```typescript
 * const products1 = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 * const products2 = [
 *   { name: 'Broccoli', category: 'Vegetable' },
 * ];
 *
 * const result = exceptBy(products1, products2, p => p.category).toArray();
 * console.log(result);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Banana', category: 'Fruit' }
 * // ]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const firstElement = first(numbers);
 * console.log(firstElement); // 1
 *
 * const firstEven = first(numbers, x => x % 2 === 0);
 * console.log(firstEven); // 2
 * ```
 */
export function first<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;
/**
 * Returns the first element in the sequence that satisfies an optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element; when omitted, the first element is returned.
 * @returns {TElement} The first element that satisfies {@link predicate}, or the very first element when the predicate is missing.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks Enumeration stops immediately once a matching element is found.
 */
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const firstElement = firstOrDefault(numbers);
 * console.log(firstElement); // 1
 *
 * const firstEven = firstOrDefault(numbers, x => x % 2 === 0);
 * console.log(firstEven); // 2
 *
 * const empty: number[] = [];
 * const firstOfEmpty = firstOrDefault(empty);
 * console.log(firstOfEmpty); // null
 *
 * const noEvens = [1, 3, 5];
 * const firstEven2 = firstOrDefault(noEvens, x => x % 2 === 0);
 * console.log(firstEven2); // null
 * ```
 */
export function firstOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;
/**
 * Returns the first element in the sequence that satisfies an optional predicate, or `null` when none does.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element; when omitted, the first element is returned.
 * @returns {TElement | null} The first element that satisfies {@link predicate}, or `null` when the sequence is empty or no element matches.
 * @remarks This overload never throws for missing elements; use {@link first} when absence should raise an exception.
 */
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * forEach(numbers, (x, i) => console.log(`Index ${i}: ${x}`));
 * // Index 0: 1
 * // Index 1: 2
 * // Index 2: 3
 * ```
 */
export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
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
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const grouped = groupBy(products, p => p.category);
 * for (const group of grouped) {
 *   console.log(group.key, group.toArray());
 * }
 * // Fruit [ { name: 'Apple', category: 'Fruit' }, { name: 'Banana', category: 'Fruit' } ]
 * // Vegetable [ { name: 'Carrot', category: 'Vegetable' } ]
 * ```
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
 * @example
 * ```typescript
 * const categories = [
 *   { id: 1, name: 'Fruit' },
 *   { id: 2, name: 'Vegetable' },
 * ];
 * const products = [
 *   { name: 'Apple', categoryId: 1 },
 *   { name: 'Banana', categoryId: 1 },
 *   { name: 'Carrot', categoryId: 2 },
 * ];
 *
 * const joined = groupJoin(
 *   categories,
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
 * @example
 * ```typescript
 * const letters = ['a', 'b', 'c'];
 * const indexed = index(letters).toArray();
 * console.log(indexed); // [[0, 'a'], [1, 'b'], [2, 'c']]
 * ```
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
 * @example
 * ```typescript
 * const numbers1 = [1, 3, 5];
 * const numbers2 = [2, 4, 6];
 * const interleaved = interleave(numbers1, numbers2).toArray();
 * console.log(interleaved); // [1, 2, 3, 4, 5, 6]
 * ```
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
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3, 4, 5];
 * const numbers2 = [3, 5, 7];
 * const result = intersect(numbers1, numbers2).toArray();
 * console.log(result); // [3, 5]
 * ```
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
 * @example
 * ```typescript
 * const products1 = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 * const products2 = [
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Broccoli', category: 'Vegetable' },
 * ];
 *
 * const result = intersectBy(products1, products2, p => p.category).toArray();
 * console.log(result);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' }
 * // ]
 * ```
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
 * @example
 * ```typescript
 * const letters = ['a', 'b', 'c'];
 * const interspersed = intersperse(letters, '-').toArray();
 * console.log(interspersed); // ['a', '-', 'b', '-', 'c']
 * ```
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
 * @example
 * ```typescript
 * const categories = [
 *   { id: 1, name: 'Fruit' },
 *   { id: 2, name: 'Vegetable' },
 * ];
 * const products = [
 *   { name: 'Apple', categoryId: 1 },
 *   { name: 'Banana', categoryId: 1 },
 *   { name: 'Carrot', categoryId: 2 },
 * ];
 *
 * const joined = join(
 *   categories,
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const lastElement = last(numbers);
 * console.log(lastElement); // 5
 *
 * const lastEven = last(numbers, x => x % 2 === 0);
 * console.log(lastEven); // 4
 * ```
 */
export function last<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;
/**
 * Returns the last element in the sequence that satisfies an optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the final element of the sequence is returned.
 * @returns {TElement} The last element that satisfies {@link predicate}, or the final element when no predicate is supplied.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks The entire sequence is enumerated to locate the final match.
 */
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
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const lastElement = lastOrDefault(numbers);
 * console.log(lastElement); // 5
 *
 * const lastEven = lastOrDefault(numbers, x => x % 2 === 0);
 * console.log(lastEven); // 4
 *
 * const empty: number[] = [];
 * const lastOfEmpty = lastOrDefault(empty);
 * console.log(lastOfEmpty); // null
 *
 * const noEvens = [1, 3, 5];
 * const lastEven2 = lastOrDefault(noEvens, x => x % 2 === 0);
 * console.log(lastEven2); // null
 * ```
 */
export function lastOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;
/**
 * Returns the last element in the sequence that satisfies an optional predicate, or `null` when none does.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the final element of the sequence is returned.
 * @returns {TElement | null} The last element that satisfies {@link predicate}, or `null` when the sequence is empty or no element matches.
 * @remarks Unlike {@link last}, this overload communicates absence through `null` instead of throwing.
 */
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
 * @example
 * ```typescript
 * const numbers = [1, 5, 2, 4, 3];
 * const maxNumber = max(numbers);
 * console.log(maxNumber); // 5
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 28 },
 * ];
 * const maxAge = max(people, p => p.age);
 * console.log(maxAge); // 30
 * ```
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
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 28 },
 * ];
 * const oldestPerson = maxBy(people, p => p.age);
 * console.log(oldestPerson); // { name: 'Bob', age: 30 }
 * ```
 */
export const maxBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).maxBy(keySelector, comparator);
};

/**
 * Calculates the median of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to treating the element itself as numeric.
 * @param tie Determines how the median is resolved when {@link source} contains an even number of elements. Defaults to `"interpolate"`, which averages the two central values. Specify `"low"` or `"high"` to choose the lower or higher neighbour respectively.
 * @returns {number} The calculated median, or `NaN` when {@link source} contains no elements.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks {@link source} is enumerated once and buffered so a selection algorithm can locate the middle element(s) without fully sorting. Supply {@link selector} when elements are not already numeric.
 * @example
 * ```typescript
 * const medianValue = median([1, 5, 2, 4, 3]);
 * console.log(medianValue); // 3
 *
 * const people = [
 *   { name: 'Alice', age: 23 },
 *   { name: 'Bella', age: 21 },
 *   { name: 'Mirei', age: 22 },
 *   { name: 'Hanna', age: 20 },
 *   { name: 'Noemi', age: 29 }
 * ];
 * const medianAge = median(people, p => p.age);
 * console.log(medianAge); // 22
 * ```
 */
export const median = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>,
    tie?: MedianTieStrategy
): number => {
    return from(source).median(selector, tie);
};

/**
 * Returns the smallest numeric value produced for the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @returns {number} The minimum of the projected values.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks The entire sequence is enumerated exactly once. Provide a selector when the elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [3, 1, 5, 2, 4];
 * const minNumber = min(numbers);
 * console.log(minNumber); // 1
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 22 },
 * ];
 * const minAge = min(people, p => p.age);
 * console.log(minAge); // 22
 * ```
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
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 *   { name: 'Charlie', age: 22 },
 * ];
 * const youngestPerson = minBy(people, p => p.age);
 * console.log(youngestPerson); // { name: 'Charlie', age: 22 }
 * ```
 */
export const minBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).minBy(keySelector, comparator);
};

/**
 * Returns the element that appears most frequently in {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable to inspect.
 * @param keySelector Optional selector that projects each element to the key used for frequency counting. Defaults to the element itself.
 * @returns {TElement} The first element whose occurrence count matches the maximum frequency.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link keySelector}.
 * @remarks The source iterable is fully enumerated to build frequency counts before the result is determined. When multiple keys share the same frequency, the earliest corresponding element is returned.
 * @example
 * ```typescript
 * const winner = mode([1, 2, 2, 3]);
 * console.log(winner); // 2
 * ```
 */
export const mode = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>,
): TElement => {
    return from(source).mode(keySelector);
};

/**
 * Returns the element that appears most frequently in {@link source}, or `null` when the iterable is empty.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable to inspect.
 * @param keySelector Optional selector that projects each element to the key used for frequency counting. Defaults to the element itself.
 * @returns {TElement | null} The first most frequent element, or `null` when {@link source} contains no elements.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link keySelector}.
 * @remarks Unlike {@link mode}, this function communicates the absence of elements by returning `null`. When multiple keys share the maximum frequency, the element encountered first is returned.
 * @example
 * ```typescript
 * const winner = modeOrDefault<number>([]);
 * console.log(winner); // null
 * ```
 */
export const modeOrDefault = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>
): TElement | null => {
    return from(source).modeOrDefault(keySelector);
};

/**
 * Produces the elements whose occurrence count is tied for the highest frequency in {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable to inspect.
 * @param keySelector Optional selector that projects each element to the key used for frequency counting. Defaults to the element itself.
 * @returns {IEnumerable<TElement>} A deferred sequence containing one representative element for each frequency mode.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link keySelector}.
 * @remarks Enumeration of the result buffers the entire source to compute frequency counts before yielding results. When multiple elements share a key, only the first occurrence is emitted.
 * @example
 * ```typescript
 * const modes = multimode([1, 2, 2, 3, 3]).toArray();
 * console.log(modes); // [2, 3]
 * ```
 */
export const multimode = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>
): IEnumerable<TElement> => {
    return from(source).multimode(keySelector);
};

/**
 * Determines whether the sequence contains no elements that satisfy the optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the function returns `true` if the sequence is empty.
 * @returns {boolean} `true` when no element satisfies the predicate (or when the sequence is empty and no predicate is provided); otherwise, `false`.
 * @remarks This is more efficient than negating `any` with a predicate because iteration stops as soon as a matching element is found.
 * @example
 * ```typescript
 * const numbers = [1, 3, 5];
 * const noEvens = none(numbers, x => x % 2 === 0);
 * console.log(noEvens); // true
 *
 * const mixedNumbers = [1, 2, 3, 5];
 * const noEvens2 = none(mixedNumbers, x => x % 2 === 0);
 * console.log(noEvens2); // false
 * ```
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
 * @param type Type descriptor that determines which elements are retained (e.g., 'string', `Number`, `Date`).
 * @returns {IEnumerable<InferredType<TResult>>} A sequence containing only the elements that match the specified type.
 * @remarks This function performs a runtime type check for each element and yields matching elements lazily.
 * @example
 * ```typescript
 * const mixed = [1, 'two', 3, 'four', new Date()];
 * const numbers = ofType(mixed, 'number').toArray();
 * console.log(numbers); // [1, 3]
 *
 * const dates = ofType(mixed, Date).toArray();
 * console.log(dates); // [Date object]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [3, 1, 5, 2, 4];
 * const sorted = order(numbers).toArray();
 * console.log(sorted); // [1, 2, 3, 4, 5]
 * ```
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
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Bob', age: 30 },
 *   { name: 'Alice', age: 25 },
 *   { name: 'Charlie', age: 22 },
 * ];
 * const sorted = orderBy(people, p => p.age).toArray();
 * console.log(sorted);
 * // [
 * //   { name: 'Charlie', age: 22 },
 * //   { name: 'Alice', age: 25 },
 * //   { name: 'Bob', age: 30 }
 * // ]
 * ```
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
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Charlie', age: 22 },
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 * ];
 * const sorted = orderByDescending(people, p => p.age).toArray();
 * console.log(sorted);
 * // [
 * //   { name: 'Bob', age: 30 },
 * //   { name: 'Alice', age: 25 },
 * //   { name: 'Charlie', age: 22 }
 * // ]
 * ```
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
 * @example
 * ```typescript
 * const numbers = [3, 1, 5, 2, 4];
 * const sorted = orderDescending(numbers).toArray();
 * console.log(sorted); // [5, 4, 3, 2, 1]
 * ```
 */
export const orderDescending = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): IOrderedEnumerable<TElement> => {
    return from(source).orderDescending(comparator);
};

/**
 * Creates a deferred sequence of adjacent element pairs drawn from the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param resultSelector Optional projection applied to each current/next pair. Defaults to returning `[current, next]`.
 * @returns {IEnumerable<[TElement, TElement]>} A sequence with one element per consecutive pair from {@link source}.
 * @remarks The final element is omitted because it lacks a successor. {@link source} is enumerated lazily and exactly once.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4];
 * const pairs = pairwise(numbers).toArray();
 * console.log(pairs); // [[1, 2], [2, 3], [3, 4]]
 * ```
 */
export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
};

/**
 * Splits the sequence into cached partitions using a type guard predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered extends TElement Type produced when {@link predicate} narrows an element.
 * @param source The source iterable.
 * @param predicate Type guard invoked for each element. Elements that satisfy the predicate populate the first partition.
 * @returns {[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]} A tuple containing the matching partition and the partition with the remaining elements.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating the predicate.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const [evens, odds] = partition(numbers, x => x % 2 === 0);
 * console.log(evens.toArray()); // [2, 4, 6]
 * console.log(odds.toArray()); // [1, 3, 5]
 * ```
 */
export function partition<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];
/**
 * Splits the sequence into cached partitions using a boolean predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Predicate evaluated for each element. Elements for which it returns `true` populate the first partition.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing the elements that satisfied {@link predicate} and those that did not.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating the predicate.
 */
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
 * Calculates a percentile of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param percent Percentile expressed as a fraction between 0 and 1 where `0` corresponds to the minimum and `1` to the maximum.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to treating the element itself as numeric.
 * @param strategy Strategy that determines how fractional ranks are resolved. Defaults to `"linear"`, which interpolates between neighbouring values. Alternative strategies include `"nearest"`, `"low"`, `"high"`, and `"midpoint"`.
 * @returns {number} The percentile value, or `NaN` when {@link source} contains no elements.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks {@link source} is enumerated once and buffered so the selection algorithm can determine the requested rank without fully sorting the data. When {@link percent} is outside `[0, 1]`, the result is clamped to the range implied by {@link strategy}.
 * @example
 * ```typescript
 * const upperQuartile = percentile([1, 2, 3, 4, 5], 0.75);
 * console.log(upperQuartile); // 4
 *
 * const responseTimes = [
 *   { endpoint: '/users', duration: 120 },
 *   { endpoint: '/users', duration: 80 },
 *   { endpoint: '/users', duration: 200 }
 * ];
 * const p95 = percentile(responseTimes, 0.95, r => r.duration, "nearest");
 * console.log(p95); // 200
 * ```
 */
export const percentile = <TElement>(
    source: Iterable<TElement>,
    percent: number,
    selector?: Selector<TElement, number>,
    strategy?: PercentileStrategy
): number => {
    return from(source).percentile(percent, selector, strategy);
}

/**
 * Generates permutations from the distinct elements of the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Optional target length for each permutation. When omitted, permutations use all distinct elements of the source.
 * @returns {IEnumerable<IEnumerable<TElement>>} A lazy sequence of permutations, each materialised as an enumerable.
 * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1 or greater than the number of distinct elements.
 * @remarks {@link source} is enumerated to collect distinct elements before permutations are produced. Expect combinatorial growth in the number of permutations.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const perms = permutations(numbers, 2);
 * console.log(perms.select(p => p.toArray()).toArray()); // [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
 * ```
 */
export const permutations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).permutations(size);
};

/**
 * Applies a user-defined pipeline to {@link source} and returns the operator's result.
 * @template TElement Type of elements within {@link source}.
 * @template TResult Result type produced by {@link operator}.
 * @param source The iterable whose enumerable view is supplied to {@link operator}.
 * @param operator Function that receives the enumerable view of {@link source} and returns an arbitrary result.
 * @returns {TResult} The value produced by {@link operator} after optionally enumerating {@link source}.
 * @throws {unknown} Re-throws any error thrown by {@link operator} or during enumeration initiated by the operator.
 * @remarks The operator chooses how the sequence is consumed, making this helper convenient for custom aggregations, projections, or interop scenarios.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const sum = pipe(numbers, e => e.sum());
 * console.log(sum); // 15
 *
 * const filteredAndDoubled = pipe(numbers, e =>
 *   e.where(x => x % 2 === 0).select(x => x * 2).toArray()
 * );
 * console.log(filteredAndDoubled); // [4, 8]
 * ```
 */
export const pipe = <TElement, TResult>(
    source: Iterable<TElement>,
    operator: PipeOperator<TElement, TResult>
): TResult => {
    return from(source).pipe(operator);
}

/**
 * Returns a deferred sequence that yields the supplied element before the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param element Element emitted before the original sequence.
 * @returns {IEnumerable<TElement>} A sequence that yields {@link element} followed by the elements from {@link source}.
 * @remarks Enumeration is deferred; {@link source} is not iterated until the resulting sequence is consumed.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const prepended = prepend(numbers, 0).toArray();
 * console.log(prepended); // [0, 1, 2, 3]
 * ```
 */
export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
};

/**
 * Computes the multiplicative aggregate of the values produced for each element in the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to interpreting the element itself as a number.
 * @returns {number} The product of all projected values.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @remarks {@link source} is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const result = product(numbers);
 * console.log(result); // 120
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 * ];
 * const ageProduct = product(people, p => p.age);
 * console.log(ageProduct); // 750
 * ```
 */
export const product = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).product(selector);
};

/**
 * Generates a numeric range beginning at the specified start value.
 * @param start Start value of the range.
 * @param count Number of sequential values to produce.
 * @returns {IEnumerable<number>} A sequence of `count` integers starting from {@link start}.
 * @remarks Enumeration is deferred. When {@link count} is zero or negative, the resulting sequence is empty.
 * @example
 * ```typescript
 * const numbers = range(1, 5).toArray();
 * console.log(numbers); // [1, 2, 3, 4, 5]
 * ```
 */
export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};

/**
 * Creates a sequence that repeats the specified element a fixed number of times.
 * @template TElement Type of the repeated element.
 * @param element Element to repeat.
 * @param count Number of repetitions to produce.
 * @returns {IEnumerable<TElement>} A sequence containing {@link element} repeated {@link count} times.
 * @remarks Enumeration is deferred. When {@link count} is zero or negative, the resulting sequence is empty.
 * @example
 * ```typescript
 * const repeated = repeat('a', 5).toArray();
 * console.log(repeated); // ['a', 'a', 'a', 'a', 'a']
 * ```
 */
export const repeat = <TElement>(element: TElement, count: number): IEnumerable<TElement> => {
    return Enumerable.repeat(element, count);
};

/**
 * Returns a deferred sequence that yields the source elements in reverse order.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A sequence that produces the elements of {@link source} in reverse iteration order.
 * @remarks The implementation materialises the entire sequence into an array before emitting elements, so avoid using it on infinite sequences or when memory usage is a concern.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const reversed = reverse(numbers).toArray();
 * console.log(reversed); // [5, 4, 3, 2, 1]
 * ```
 */
export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
};

/**
 * Returns a deferred sequence that rotates the elements by the specified offset while preserving length.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param shift Number of positions to rotate. Positive values move elements toward the end (left rotation); negative values move them toward the beginning (right rotation).
 * @returns {IEnumerable<TElement>} A sequence containing the same elements shifted by the requested amount.
 * @remarks The source is buffered sufficiently to honour the rotation. Rotation amounts larger than the length of {@link source} are normalised by that length, which may require buffering the full sequence.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const rotated = rotate(numbers, 2).toArray();
 * console.log(rotated); // [3, 4, 5, 1, 2]
 *
 * const rotatedNegative = rotate(numbers, -2).toArray();
 * console.log(rotatedNegative); // [4, 5, 1, 2, 3]
 * ```
 */
export const rotate = <TElement>(source: Iterable<TElement>, shift: number): IEnumerable<TElement> => {
    return from(source).rotate(shift);
};

/**
 * Accumulates the sequence and emits each intermediate result.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TAccumulate Accumulator type produced by {@link accumulator}; defaults to `TElement` when {@link seed} is omitted.
 * @param source The source iterable.
 * @param accumulator Function that merges the current accumulator value with the next element to produce the subsequent accumulator.
 * @param seed Optional initial accumulator. When omitted, the first element supplies the initial accumulator and is emitted as the first result.
 * @returns {IEnumerable<TAccumulate>} A deferred sequence containing every intermediate accumulator produced by {@link accumulator}.
 * @throws {NoElementsException} Thrown when {@link source} is empty and {@link seed} is not provided.
 * @remarks {@link source} is enumerated exactly once. Supplying {@link seed} prevents exceptions on empty sources but the seed itself is not emitted.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const runningTotal = scan(numbers, (acc, x) => acc + x).toArray();
 * console.log(runningTotal); // [1, 3, 6, 10, 15]
 * ```
 */
export const scan = <TElement, TAccumulate = TElement>(
    source: Iterable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return from(source).scan(accumulator, seed);
};

/**
 * Transforms each element and its zero-based index into a new value.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TResult Result type produced by {@link selector}.
 * @param source The source iterable.
 * @param selector Projection invoked for each element together with its index.
 * @returns {IEnumerable<TResult>} A deferred sequence containing the values produced by {@link selector}.
 * @remarks Enumeration is deferred. The index argument increments sequentially starting at zero.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const squares = select(numbers, x => x * x).toArray();
 * console.log(squares); // [1, 4, 9, 16, 25]
 * ```
 */
export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
};

/**
 * Projects each element and index into an iterable and flattens the results into a single sequence.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TResult Element type produced by the flattened iterables.
 * @param source The source iterable.
 * @param selector Projection that returns an iterable for each element and its index.
 * @returns {IEnumerable<TResult>} A deferred sequence containing the concatenated contents of the iterables produced by {@link selector}.
 * @remarks Each inner iterable is fully enumerated in order before the next source element is processed, preserving the relative ordering of results.
 * @example
 * ```typescript
 * const lists = [[1, 2], [3, 4], [5]];
 * const flattened = selectMany(lists, x => x).toArray();
 * console.log(flattened); // [1, 2, 3, 4, 5]
 * ```
 */
export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
};

/**
 * Determines whether {@link source} and another iterable contain equal elements in the same order.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param other Iterable to compare against the source sequence.
 * @param comparator Optional equality comparator used to compare element pairs. Defaults to the library's standard equality comparator.
 * @returns {boolean} `true` when both sequences have the same length and all corresponding elements are equal; otherwise, `false`.
 * @remarks Enumeration stops as soon as a mismatch or length difference is observed. Both sequences are fully enumerated only when they are equal.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3];
 * const numbers2 = [1, 2, 3];
 * const numbers3 = [1, 2, 4];
 *
 * const areEqual1 = sequenceEqual(numbers1, numbers2);
 * console.log(areEqual1); // true
 *
 * const areEqual2 = sequenceEqual(numbers1, numbers3);
 * console.log(areEqual2); // false
 * ```
 */
export const sequenceEqual = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).sequenceEqual(other, comparator);
};

/**
 * Returns a deferred sequence whose elements appear in random order.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A sequence containing the same elements as {@link source} but shuffled.
 * @remarks The implementation materialises the entire sequence into an array before shuffling, making this unsuitable for infinite sequences.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(numbers).toArray();
 * console.log(shuffled); // e.g., [3, 1, 5, 2, 4]
 * ```
 */
export const shuffle = <TElement>(
    source: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).shuffle();
};

/**
 * Returns the only element that satisfies the provided type guard predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
 * @param source The source iterable.
 * @param predicate Type guard evaluated for each element. The returned value is narrowed to `TFiltered`.
 * @returns {TFiltered} The single element that satisfies {@link predicate}.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @throws {NoMatchingElementException} Thrown when no element satisfies {@link predicate}.
 * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
 * @remarks {@link source} is fully enumerated to ensure exactly one matching element exists.
 * @example
 * ```typescript
 * const numbers = [5];
 * const singleElement = single(numbers);
 * console.log(singleElement); // 5
 *
 * const numbers2 = [1, 2, 3, 4, 5];
 * const singleEven = single(numbers2, x => x > 4);
 * console.log(singleEven); // 5
 * ```
 */
export function single<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;

/**
 * Returns the only element in the sequence or the only element that satisfies an optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
 * @returns {TElement} The single element in {@link source} or the single element that satisfies {@link predicate}.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
 * @throws {NoMatchingElementException} Thrown when {@link predicate} is provided and no element satisfies it.
 * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
 * @remarks {@link source} is fully enumerated to validate uniqueness.
 */
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
 * Returns the only element that satisfies the provided type guard predicate, or `null` when no such element exists.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
 * @param source The source iterable.
 * @param predicate Type guard evaluated for each element. The returned value is narrowed to `TFiltered` when not `null`.
 * @returns {TFiltered | null} The single matching element, or `null` when no element satisfies {@link predicate}.
 * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
 * @remarks {@link source} is fully enumerated to confirm uniqueness of the matching element.
 * @example
 * ```typescript
 * const numbers = [5];
 * const singleElement = singleOrDefault(numbers);
 * console.log(singleElement); // 5
 *
 * const numbers2 = [1, 2, 3, 4, 5];
 * const singleEven = singleOrDefault(numbers2, x => x > 4);
 * console.log(singleEven); // 5
 *
 * const empty: number[] = [];
 * const singleOfEmpty = singleOrDefault(empty);
 * console.log(singleOfEmpty); // null
 *
 * const noMatch = [1, 2, 3];
 * const singleNoMatch = singleOrDefault(noMatch, x => x > 4);
 * console.log(singleNoMatch); // null
 * ```
 */
export function singleOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;

/**
 * Returns the only element in the sequence or the only element that satisfies an optional predicate, or `null` when no such element exists.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
 * @returns {TElement | null} The single element or matching element, or `null` when no element satisfies the conditions.
 * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
 * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
 * @remarks Unlike {@link single}, this method communicates the absence of a matching element by returning `null`.
 */
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
 * Skips a specified number of elements before yielding the remainder of the sequence.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param count Number of elements to bypass. Values less than or equal to zero result in no elements being skipped.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the elements that remain after skipping {@link count} items.
 * @remarks Enumeration advances through the skipped prefix without yielding any of those elements.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const skipped = skip(numbers, 2).toArray();
 * console.log(skipped); // [3, 4, 5]
 * ```
 */
export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
};

/**
 * Omits a specified number of elements from the end of the sequence.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param count Number of trailing elements to exclude. Values less than or equal to zero leave the sequence unchanged.
 * @returns {IEnumerable<TElement>} A deferred sequence excluding the last {@link count} elements.
 * @remarks The implementation buffers up to {@link count} elements to determine which items to drop, which can increase memory usage for large counts.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const skipped = skipLast(numbers, 2).toArray();
 * console.log(skipped); // [1, 2, 3]
 * ```
 */
export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skipLast(count);
};

/**
 * Skips elements while a predicate returns `true` and then yields the remaining elements.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Predicate receiving the element and its zero-based index. The first element for which it returns `false` is included in the result.
 * @returns {IEnumerable<TElement>} A deferred sequence starting with the first element that fails {@link predicate}.
 * @remarks The predicate's index parameter increments only while elements are being skipped.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 1, 2];
 * const skipped = skipWhile(numbers, x => x < 4).toArray();
 * console.log(skipped); // [4, 5, 1, 2]
 * ```
 */
export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
};

/**
 * Splits the sequence into the maximal leading span that satisfies a type guard and the remaining elements.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
 * @param source The source iterable.
 * @param predicate Type guard evaluated for each element until it first returns `false`.
 * @returns {[IEnumerable<TFiltered>, IEnumerable<TElement>]} A tuple containing the contiguous matching prefix and the remainder of the sequence.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 1, 2];
 * const [first, second] = span(numbers, x => x < 3);
 * console.log(first.toArray()); // [1, 2]
 * console.log(second.toArray()); // [3, 4, 1, 2]
 * ```
 */
export function span<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<TElement>];

/**
 * Splits the sequence into the maximal leading span that satisfies a predicate and the remaining elements.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Predicate evaluated for each element until it first returns `false`.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing the contiguous matching prefix and the remainder of the sequence.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
 */
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
 * Calculates the standard deviation of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @param sample When `true`, computes the sample standard deviation; when `false`, computes the population standard deviation. Defaults to `true`.
 * @returns {number} The calculated standard deviation, or `NaN` when there are insufficient values to compute it.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks This function delegates to {@link variance}; when the variance is `NaN`, that value is returned unchanged. The iterable is enumerated exactly once using a numerically stable single-pass algorithm.
 * @example
 * ```typescript
 * const populationStdDev = standardDeviation([1, 2, 3, 4, 5], x => x, false);
 * console.log(populationStdDev); // Math.sqrt(2)
 * ```
 */
export const standardDeviation = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>,
    sample?: boolean
): number => {
    return from(source).standardDeviation(selector, sample);
};

/**
 * Returns every n-th element of the sequence, starting with the first.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param step Positive interval indicating how many elements to skip between yielded items.
 * @returns {IEnumerable<TElement>} A deferred sequence containing elements whose zero-based index is divisible by {@link step}.
 * @throws {InvalidArgumentException} Thrown when {@link step} is less than 1.
 * @remarks {@link source} is enumerated exactly once; elements that are not yielded are still visited to honour the stepping interval.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const stepped = step(numbers, 3).toArray();
 * console.log(stepped); // [1, 4, 7]
 * ```
 */
export const step = <TElement>(
    source: Iterable<TElement>,
    step: number
): IEnumerable<TElement> => {
    return from(source).step(step);
};

/**
 * Computes the sum of the numeric values produced for each element.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param selector Optional projection that extracts the numeric value. Defaults to interpreting the element itself as a number.
 * @returns {number} The sum of the projected values.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @remarks {@link source} is enumerated exactly once. Supply {@link selector} when elements are not already numeric.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const total = sum(numbers);
 * console.log(total); // 15
 *
 * const people = [
 *   { name: 'Alice', age: 25 },
 *   { name: 'Bob', age: 30 },
 * ];
 * const totalAge = sum(people, p => p.age);
 * console.log(totalAge); // 55
 * ```
 */
export const sum = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).sum(selector);
};

/**
 * Returns up to the specified number of leading elements from {@link source}.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param count Number of elements to emit; values less than or equal to zero produce an empty sequence.
 * @returns {IEnumerable<TElement>} A deferred sequence containing at most {@link count} elements from the start of {@link source}.
 * @remarks Enumeration stops once {@link count} elements have been yielded or the source sequence ends.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const firstTwo = take(numbers, 2).toArray();
 * console.log(firstTwo); // [1, 2]
 *
 * const emptyTake = take(numbers, 0).toArray();
 * console.log(emptyTake); // []
 * ```
 */
export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
};

/**
 * Returns up to the specified number of trailing elements from {@link source}.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param count Number of elements to keep from the end; values less than or equal to zero produce an empty sequence.
 * @returns {IEnumerable<TElement>} A deferred sequence containing at most {@link count} elements from the end of {@link source}.
 * @remarks The implementation buffers up to {@link count} elements to determine the tail, so memory usage grows with {@link count}. The source must be finite.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const lastTwo = takeLast(numbers, 2).toArray();
 * console.log(lastTwo); // [4, 5]
 *
 * const emptyTakeLast = takeLast(numbers, 0).toArray();
 * console.log(emptyTakeLast); // []
 * ```
 */
export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
};

/**
 * Returns consecutive leading elements while a type guard predicate continues to succeed, narrowing the element type.
 * @template TElement Type of elements within {@link source}.
 * @template TFiltered extends TElement Narrowed element type produced by {@link predicate}.
 * @param source The source iterable.
 * @param predicate Type guard invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
 * @returns {IEnumerable<TFiltered>} A deferred sequence containing the contiguous prefix that satisfies {@link predicate}.
 * @remarks Elements after the first failing element are not inspected. Use this overload when you need the result to reflect the guarded type.
 * @example
 * ```typescript
 * const mixed: (number | string)[] = [1, 2, 'three', 4, 5];
 * const numbers = takeWhile(mixed, (x): x is number => typeof x === 'number').toArray();
 * console.log(numbers); // [1, 2]
 * ```
 */
export function takeWhile<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

/**
 * Returns consecutive leading elements while a predicate returns `true`.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param predicate Predicate invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the contiguous prefix that satisfies {@link predicate}.
 * @remarks Elements after the first failing element are not inspected.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 1, 2];
 * const taken = takeWhile(numbers, x => x < 4).toArray();
 * console.log(taken); // [1, 2, 3]
 *
 * const takenWithIndex = takeWhile(numbers, (x, i) => i < 3).toArray();
 * console.log(takenWithIndex); // [1, 2, 3]
 * ```
 */
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
 * Invokes the specified action for each element while yielding the original elements unchanged.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param action Callback receiving the element and its zero-based index.
 * @returns {IEnumerable<TElement>} The original sequence, enabling fluent chaining.
 * @remarks The action executes lazily as the sequence is iterated, making it suitable for logging or instrumentation.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const tapped = tap(numbers, x => console.log(`Processing: ${x}`))
 *   .select(x => x * 2)
 *   .toArray();
 * console.log(tapped); // [2, 4, 6]
 * // Expected console output:
 * // Processing: 1
 * // Processing: 2
 * // Processing: 3
 * ```
 */
export const tap = <TElement>(source: Iterable<TElement>, action: IndexedAction<TElement>): IEnumerable<TElement> => {
    return from(source).tap(action);
};

/**
 * Materialises {@link source} into an array.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {TElement[]} An array containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately. Subsequent changes to {@link source} are not reflected in the returned array.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const array = toArray(numbers);
 * console.log(array); // [1, 2, 3]
 * ```
 */
export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
};

/**
 * Materialises {@link source} into a circular linked list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {CircularLinkedList<TElement>} A circular linked list containing all elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately, and elements are stored in iteration order.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const circularList = toCircularLinkedList(numbers);
 * console.log(circularList.toArray()); // [1, 2, 3]
 * ```
 */
export const toCircularLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularLinkedList<TElement> => {
    return from(source).toCircularLinkedList(comparator);
};

/**
 * Materialises {@link source} into a circular queue with the specified capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param capacity Maximum number of elements retained by the resulting queue.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {CircularQueue<TElement>} A circular queue containing the most recent elements from {@link source}, bounded by {@link capacity}.
 * @remarks The entire sequence is enumerated immediately. When {@link source} contains more than {@link capacity} elements, earlier items are discarded.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const circularQueue = toCircularQueue(numbers, 3);
 * console.log(circularQueue.toArray()); // [3, 4, 5]
 * ```
 */
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacity: number,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement>;
/**
 * Materialises {@link source} into a circular queue using the implementation's default capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {CircularQueue<TElement>} A circular queue containing the most recent elements from {@link source}, bounded by the default capacity.
 * @remarks The entire sequence is enumerated immediately. Earlier items are discarded when the number of elements exceeds the queue's capacity.
 */
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
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
 * Materialises {@link source} into a dictionary keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
 * @returns {Dictionary<TKey, TValue>} A dictionary populated with the projected key/value pairs.
 * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
 * @remarks The entire sequence is enumerated immediately and entries are inserted in iteration order.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const dictionary = toDictionary(people, p => p.id, p => p.name);
 * console.log(dictionary.get(1)); // 'Alice'
 * console.log(dictionary.get(2)); // 'Bob'
 * ```
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
 * Materialises {@link source} into an enumerable set containing the distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {EnumerableSet<TElement>} A set populated with the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's equality semantics.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1];
 * const set = toEnumerableSet(numbers);
 * console.log(set.toArray()); // [1, 2, 3]
 * ```
 */
export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
};

/**
 * Materialises {@link source} into an immutable circular queue that uses the implementation\'s default capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing the most recent elements from {@link source}, up to the default capacity.
 * @remarks The entire sequence is enumerated immediately. Earlier items are discarded when the number of elements exceeds the queue\'s capacity (currently 32).
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableCircularQueue = toImmutableCircularQueue(numbers);
 * console.log(immutableCircularQueue.toArray()); // [1, 2, 3]
 * ```
 */
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement>;
/**
 * Materialises {@link source} into an immutable circular queue with the specified capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param capacity Maximum number of elements retained by the resulting queue.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing the most recent elements from {@link source}, bounded by {@link capacity}.
 * @remarks The entire sequence is enumerated immediately. When {@link source} contains more than {@link capacity} elements, earlier items are discarded.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const immutableCircularQueue = toImmutableCircularQueue(numbers, 3);
 * console.log(immutableCircularQueue.toArray()); // [3, 4, 5]
 * ```
 */
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
 * Materialises {@link source} into an immutable dictionary keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
 * @returns {ImmutableDictionary<TKey, TValue>} An immutable dictionary populated with the projected key/value pairs.
 * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const immutableDictionary = toImmutableDictionary(people, p => p.id, p => p.name);
 * console.log(immutableDictionary.get(1)); // 'Alice'
 * console.log(immutableDictionary.get(2)); // 'Bob'
 * ```
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
 * Materialises {@link source} into an immutable list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {ImmutableList<TElement>} An immutable list containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableList = toImmutableList(numbers);
 * console.log(immutableList.toArray()); // [1, 2, 3]
 * ```
 */
export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
};

/**
 * Materialises {@link source} into an immutable priority queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements in the resulting queue.
 * @returns {ImmutablePriorityQueue<TElement>} An immutable priority queue containing all elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately. Elements are ordered according to {@link comparator} or the default ordering.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const immutablePriorityQueue = toImmutablePriorityQueue(numbers);
 * console.log(immutablePriorityQueue.toArray()); // [1, 1, 2, 3, 4, 5, 6, 9] (sorted)
 * ```
 */
export const toImmutablePriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutablePriorityQueue<TElement> => {
    return from(source).toImmutablePriorityQueue(comparator);
};

/**
 * Materialises {@link source} into an immutable FIFO queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {ImmutableQueue<TElement>} An immutable queue containing all elements from {@link source} in enqueue order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableQueue = toImmutableQueue(numbers);
 * console.log(immutableQueue.toArray()); // [1, 2, 3]
 * ```
 */
export const toImmutableQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableQueue<TElement> => {
    return from(source).toImmutableQueue(comparator);
};

/**
 * Materialises {@link source} into an immutable set containing the distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {ImmutableSet<TElement>} An immutable set built from the distinct elements of {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's equality semantics.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1];
 * const immutableSet = toImmutableSet(numbers);
 * console.log(immutableSet.toArray()); // [1, 2, 3]
 * ```
 */
export const toImmutableSet = <TElement>(
    source: Iterable<TElement>
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
};

/**
 * Materialises {@link source} into an immutable sorted dictionary keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
 * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
 * @returns {ImmutableSortedDictionary<TKey, TValue>} An immutable sorted dictionary populated with the projected key/value pairs.
 * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const people = [
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' },
 * ];
 * const immutableSortedDictionary = toImmutableSortedDictionary(people, p => p.id, p => p.name);
 * console.log(immutableSortedDictionary.keys().toArray()); // [1, 2]
 * console.log(immutableSortedDictionary.get(1)); // 'Alice'
 * ```
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
 * Materialises {@link source} into an immutable sorted set of distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to sort the elements.
 * @returns {ImmutableSortedSet<TElement>} An immutable sorted set containing the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's ordering semantics.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const immutableSortedSet = toImmutableSortedSet(numbers);
 * console.log(immutableSortedSet.toArray()); // [1, 2, 3, 4, 5, 6, 9]
 * ```
 */
export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
};

/**
 * Materialises {@link source} into an immutable stack (LIFO).
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting stack.
 * @returns {ImmutableStack<TElement>} An immutable stack whose top element corresponds to the last element of {@link source}.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableStack = toImmutableStack(numbers);
 * console.log(immutableStack.peek()); // 3
 * console.log(immutableStack.pop().peek()); // 2
 * ```
 */
export const toImmutableStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableStack<TElement> => {
    return from(source).toImmutableStack(comparator);
};

/**
 * Materialises {@link source} into a linked list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {LinkedList<TElement>} A linked list containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const linkedList = toLinkedList(numbers);
 * console.log(linkedList.toArray()); // [1, 2, 3]
 * ```
 */
export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
};

/**
 * Materialises {@link source} into a resizable list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {List<TElement>} A list containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const list = toList(numbers);
 * console.log(list.toArray()); // [1, 2, 3]
 * ```
 */
export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
};

/**
 * Materialises {@link source} into a lookup keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param keyComparator Optional order comparator used to compare keys in the resulting lookup.
 * @returns {ILookup<TKey, TValue>} A lookup grouping the projected values by key.
 * @remarks The entire sequence is enumerated immediately. Elements within each group preserve their original order and the groups are cached for repeated enumeration.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 * const lookup = toLookup(products, p => p.category, p => p.name);
 * console.log(lookup.get('Fruit').toArray()); // ['Apple', 'Banana']
 * console.log(lookup.get('Vegetable').toArray()); // ['Carrot']
 * ```
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
 * Materialises {@link source} into a `Map` keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @returns {Map<TKey, TValue>} A map populated with the projected key/value pairs.
 * @remarks The entire sequence is enumerated immediately. When {@link keySelector} produces duplicate keys, later elements overwrite earlier entries.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const map = toMap(people, p => p.id, p => p.name);
 * console.log(map.get(1)); // 'Alice'
 * console.log(map.get(2)); // 'Bob'
 * ```
 */
export const toMap = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Map<TKey, TValue> => {
    return from(source).toMap(keySelector, valueSelector);
};

/**
 * Materialises {@link source} into a plain object keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey extends PropertyKey Property key type returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the property key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @returns {Record<TKey, TValue>} An object populated with the projected key/value pairs.
 * @remarks The entire sequence is enumerated immediately. When {@link keySelector} produces duplicate keys, later values overwrite earlier ones.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const obj = toObject(people, p => p.id, p => p.name);
 * console.log(obj[1]); // 'Alice'
 * console.log(obj[2]); // 'Bob'
 * ```
 */
export const toObject = <TElement, TKey extends PropertyKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Record<TKey, TValue> => {
    return from(source).toObject(keySelector, valueSelector);
};

/**
 * Materialises {@link source} into a priority queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements in the resulting queue.
 * @returns {PriorityQueue<TElement>} A priority queue containing all elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately. Elements are ordered according to {@link comparator} or the default ordering.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const priorityQueue = toPriorityQueue(numbers);
 * console.log(priorityQueue.dequeue()); // 1
 * console.log(priorityQueue.dequeue()); // 1
 * ```
 */
export const toPriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): PriorityQueue<TElement> => {
    return from(source).toPriorityQueue(comparator);
};

/**
 * Materialises {@link source} into a FIFO queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {Queue<TElement>} A queue containing all elements from {@link source} in enqueue order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const queue = toQueue(numbers);
 * console.log(queue.dequeue()); // 1
 * console.log(queue.dequeue()); // 2
 * ```
 */
export const toQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Queue<TElement> => {
    return from(source).toQueue(comparator);
};

/**
 * Materialises {@link source} into a native `Set`.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {Set<TElement>} A set containing the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using JavaScript's `SameValueZero` semantics.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1];
 * const set = toSet(numbers);
 * console.log(Array.from(set)); // [1, 2, 3]
 * ```
 */
export const toSet = <TElement>(
    source: Iterable<TElement>
): Set<TElement> => {
    return from(source).toSet();
};

/**
 * Materialises {@link source} into a sorted dictionary keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
 * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
 * @returns {SortedDictionary<TKey, TValue>} A sorted dictionary populated with the projected key/value pairs.
 * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const people = [
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' },
 * ];
 * const sortedDictionary = toSortedDictionary(people, p => p.id, p => p.name);
 * console.log(sortedDictionary.keys().toArray()); // [1, 2]
 * console.log(sortedDictionary.get(1)); // 'Alice'
 * ```
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
 * Materialises {@link source} into a sorted set of distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to sort the elements.
 * @returns {SortedSet<TElement>} A sorted set containing the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's ordering semantics.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const sortedSet = toSortedSet(numbers);
 * console.log(sortedSet.toArray()); // [1, 2, 3, 4, 5, 6, 9]
 * ```
 */
export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
};

/**
 * Materialises {@link source} into a stack (LIFO).
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting stack.
 * @returns {Stack<TElement>} A stack whose top element corresponds to the last element of {@link source}.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const stack = toStack(numbers);
 * console.log(stack.peek()); // 3
 * console.log(stack.pop().peek()); // 2
 * ```
 */
export const toStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Stack<TElement> => {
    return from(source).toStack(comparator);
};

/**
 * Creates a set-style union between {@link source} and {@link other} using an equality comparator.
 * @template TElement Type of elements contained by the input sequences.
 * @param source The initial sequence whose distinct elements lead the union.
 * @param other Additional sequence whose elements are appended after {@link source} when forming the union.
 * @param comparator Optional equality comparator that determines whether two elements are considered the same. Defaults to the library's standard equality comparator.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the distinct elements from {@link source} followed by elements from {@link other} that are not already present according to {@link comparator}.
 * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link comparator}.
 * @remarks Elements yielded by {@link source} always appear before contributions from {@link other}. Only comparison data required to detect duplicates is buffered, and each input is enumerated at most once.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3, 4, 5];
 * const numbers2 = [3, 5, 6, 7];
 * const unioned = union(numbers1, numbers2).toArray();
 * console.log(unioned); // [1, 2, 3, 4, 5, 6, 7]
 * ```
 */
export const union = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(other, comparator);
};

/**
 * Creates a set-style union between {@link source} and {@link other} by comparing keys projected from each element.
 * @template TElement Type of elements contained by the input sequences.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The initial sequence whose distinct elements lead the union.
 * @param other Additional sequence whose elements are appended after {@link source} when forming the union.
 * @param keySelector Projection that produces a comparison key for each element.
 * @param comparator Optional equality comparator that determines whether two keys are considered the same. Defaults to the library's standard equality comparator.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the distinct elements from {@link source} followed by elements from {@link other} whose keys were not previously observed.
 * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link keySelector} or {@link comparator}.
 * @remarks Keys are buffered to ensure uniqueness while elements remain lazily produced. Provide {@link comparator} when keys require structural equality semantics.
 * @example
 * ```typescript
 * const products1 = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 * ];
 * const products2 = [
 *   { name: 'Carrot', category: 'Vegetable' },
 *   { name: 'Apple', category: 'Fruit' },
 * ];
 *
 * const unioned = unionBy(products1, products2, p => p.category).toArray();
 * console.log(unioned);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Banana', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' }
 * // ]
 * ```
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
 * Calculates the variance of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @param sample When `true`, computes the sample variance dividing by _n - 1_; when `false`, computes the population variance dividing by _n_. Defaults to `true`.
 * @returns {number} The calculated variance, or `NaN` when {@link source} is empty—or for sample variance when it contains a single element.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks A numerically stable single-pass algorithm (Welford's method) is used, so the iterable is enumerated exactly once regardless of size.
 * @example
 * ```typescript
 * const populationVariance = variance([1, 2, 3, 4, 5], x => x, false);
 * console.log(populationVariance); // 2
 * ```
 */
export const variance = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>,
    sample?: boolean
): number => {
    return from(source).variance(selector, sample);
};

/**
 * Filters {@link source} using a type guard predicate and narrows the resulting element type.
 * @template TElement Type of elements within {@link source}.
 * @template TFiltered extends TElement Narrowed element type produced by {@link predicate}.
 * @param source The iterable to filter.
 * @param predicate Type guard invoked with each element and its zero-based index. Return `true` to keep the element in the results.
 * @returns {IEnumerable<TFiltered>} A deferred sequence containing only elements that satisfy the type guard.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link predicate}.
 * @remarks Enumeration is lazy; {@link predicate} executes on demand and may be invoked again when consumers restart iteration.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const evenNumbers = where(numbers, x => x % 2 === 0).toArray();
 * console.log(evenNumbers); // [2, 4]
 * ```
 */
export function where<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;
/**
 * Filters {@link source} using a predicate that can inspect both the element and its position.
 * @template TElement Type of elements within {@link source}.
 * @param source The iterable to filter.
 * @param predicate Predicate invoked with each element and its zero-based index. Return `true` to keep the element in the results.
 * @returns {IEnumerable<TElement>} A deferred sequence containing only the elements that satisfy {@link predicate}.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link predicate}.
 * @remarks Enumeration is lazy; {@link predicate} executes on demand and iteration stops as soon as the consumer stops reading.
 */
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
 * Produces a sequence of sliding windows of fixed size over {@link source}.
 * @template TElement Type of elements within {@link source}.
 * @param source The iterable to window.
 * @param size Length of each window; must be at least 1.
 * @returns {IEnumerable<IEnumerable<TElement>>} A deferred sequence where each element exposes one contiguous window from {@link source}.
 * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source}.
 * @remarks Windows overlap and are yielded only after enough source elements are observed to fill {@link size}. Trailing partial windows are omitted.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const windows = windows(numbers, 3);
 * console.log(windows.select(w => w.toArray()).toArray()); // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
 * ```
 */
export const windows = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).windows(size);
};

/**
 * Combines {@link source} with {@link other} and optionally projects each aligned pair using {@link zipper}.
 * @template TElement Type of elements within {@link source}.
 * @template TSecond Type of elements within {@link other}.
 * @template TResult Result type produced by {@link zipper}; defaults to `[TElement, TSecond]` when {@link zipper} is omitted.
 * @param source The primary sequence whose elements lead each pair.
 * @param other The secondary sequence whose elements are paired with {@link source}.
 * @param zipper Optional projection invoked with each `[source, other]` pair. When omitted, the tuples `[source, other]` are emitted.
 * @returns {IEnumerable<TResult>} A deferred sequence of projected results truncated to the length of the shorter input.
 * @throws {unknown} Re-throws any error thrown while iterating either input sequence or executing {@link zipper}.
 * @remarks Enumeration is lazy; pairs are produced on demand and iteration stops as soon as either input completes.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const letters = ['a', 'b', 'c'];
 * const zipped = zip(numbers, letters).toArray();
 * console.log(zipped); // [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 * const zippedWithSelector = zip(numbers, letters, (num, letter) => `${num}-${letter}`).toArray();
 * console.log(zippedWithSelector); // ['1-a', '2-b', '3-c']
 * ```
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

/**
 * Zips {@link source} with the iterables supplied in {@link iterables}, producing aligned tuples.
 * @template TElement Type of elements in the {@link source} iterable.
 * @template TIterable Extends `readonly Iterable<unknown>[]`; each iterable's element type contributes to the resulting tuple.
 * @param source The primary iterable zipped with the additional iterables.
 * @param iterables Additional iterables to zip with {@link source}.
 * @returns {IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>} A deferred sequence of tuples truncated to the length of the shortest input.
 * @throws {unknown} Re-throws any error raised while iterating {@link source} or any of {@link iterables}.
 * @remarks Iteration stops as soon as any participating iterable is exhausted. Tuple element types are inferred from the supplied iterables, preserving strong typing across the zipped result.
 * @example
 * ```typescript
 * const zipped = zipMany([1, 2, 3], ['A', 'B', 'C'], [true, false]).toArray();
 * console.log(zipped); // [[1, 'A', true], [2, 'B', false]]
 * ```
 */
export function zipMany<TElement, TIterable extends readonly Iterable<unknown>[]>(
    source: Iterable<TElement>,
    ...iterables: [...TIterable]
): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>;
/**
 * Zips {@link source} with the iterables supplied in {@link iterablesAndZipper} and projects each tuple with {@link ZipManyZipper zipper}.
 * @template TElement Type of elements in the {@link source} iterable.
 * @template TIterable Extends `readonly Iterable<unknown>[]`; each iterable's element type contributes to the zipper input tuple.
 * @template TResult Result type produced by {@link ZipManyZipper zipper}.
 * @param source The primary iterable zipped with the additional iterables.
 * @param iterablesAndZipper The trailing argument may be a zipper invoked with each tuple to produce a projected result; preceding arguments are the iterables to zip with.
 * @returns {IEnumerable<TResult>} A deferred sequence of projected results truncated to the length of the shortest input.
 * @throws {unknown} Re-throws any error raised while iterating {@link source}, the supplied iterables, or executing the zipper.
 * @remarks The zipper receives a readonly tuple `[source, ...others]` for each aligned set. Iteration stops as soon as any participating iterable is exhausted.
 * @example
 * ```typescript
 * const labels = zipMany(
 *     [1, 2, 3],
 *     ['A', 'B', 'C'],
 *     [true, true, false],
 *     ([num, letter, flag]) => `${num}${letter}-${flag ? "yes" : "no"}`
 * ).toArray();
 * console.log(labels); // ["1A-yes", "2B-yes", "3C-no"]
 * ```
 */
export function zipMany<TElement, TIterable extends readonly Iterable<unknown>[], TResult>(
    source: Iterable<TElement>,
    ...iterablesAndZipper: [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
): IEnumerable<TResult>;
export function zipMany<TElement, TIterable extends readonly Iterable<unknown>[], TResult>(
    source: Iterable<TElement>,
    ...iterablesAndZipper: [...TIterable] | [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]> | IEnumerable<TResult> {
    const lastArg = iterablesAndZipper[iterablesAndZipper.length - 1];
    const hasZipper = iterablesAndZipper.length > 0 && typeof lastArg === "function";
    if (hasZipper) {
        const iterables = iterablesAndZipper.slice(0, -1) as [...TIterable];
        const zipper = lastArg as ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>;
        return from(source).zipMany(...iterables, zipper);
    }
    const iterables = iterablesAndZipper as [...TIterable];
    return from(source).zipMany(...iterables);
}
