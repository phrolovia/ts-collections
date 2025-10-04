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
 * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
 * If the resultSelector function is specified, it will be used to select the result value.
 * @template TAccumulate
 * @template TResult
 * @param source The source iterable.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param seed The value that will be used as the initial value. If not specified, the first element of the sequence will be used as the seed value.
 * @param resultSelector The function that will be used to select the result value.
 * @returns {TAccumulate|TResult} The final accumulator value.
 * @throws {NoElementsException} If the source is empty and seed is not provided.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const sum = aggregate(numbers, (acc, current) => acc + current); // sum = 15
 *      const productWithSeed = aggregate(numbers, (acc, current) => acc * current, 10); // productWithSeed = 1200 (10 * 1 * 2 * 3 * 4 * 5)
 *      const sumAsString = aggregate(
 *          numbers,
 *          (acc, current) => acc + current, // Accumulator
 *          0,                             // Seed
 *          (finalResult) => `Sum: ${finalResult}` // Result selector
 *      ); // sumAsString = "Sum: 15"
 */
export const aggregate = <TElement, TAccumulate = TElement, TResult = TAccumulate>(
    source: Iterable<TElement>,
    accumulator: (accumulator: TAccumulate, element: TElement) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: (accumulator: TAccumulate) => TResult
): TAccumulate | TResult => {
    return from(source).aggregate(accumulator, seed, resultSelector);
}

/**
 * Applies an accumulator function over the sequence, grouping the results by a key from the key selector function.
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param seedSelector Initial accumulator value or a function that will be used to select the initial accumulator value.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @example
 *      interface Product { category: string; price: number; }
 *      const products = from<Product>([
 *           { category: 'Electronics', price: 700 },
 *           { category: 'Books', price: 120 },
 *           { category: 'Electronics', price: 200 },
 *           { category: 'Books', price: 90 }
 *      ]);
 *      const totalValuePerCategory = toArray(aggregateBy(
 *           products,
 *           p => p.category, // keySelector: group by category
 *           0,               // seedSelector: start sum at 0 for each category
 *           (sum, p) => sum + p.price // accumulator: add product price to sum
 *      ));
 *      // totalValuePerCategory: [{ key: 'Electronics', value: 900 }, { key: 'Books', value: 210 }]
 */
export const aggregateBy = <TElement, TKey, TAccumulate = TElement>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    seedSelector: Selector<TKey, TAccumulate> | TAccumulate,
    accumulator: Accumulator<TElement, TAccumulate>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, TAccumulate>> => {
    return from(source).aggregateBy(keySelector, seedSelector, accumulator, keyComparator);
}

/**
 * Determines if all elements of the sequence satisfy the specified predicate.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {boolean} true if all elements of the sequence satisfy the specified predicate; otherwise, false.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const allPositive = all(numbers, n => n > 0); // allPositive = true
 *      const allEven = all(numbers, n => n % 2 === 0); // allEven = false
 */
export const all = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return from(source).all(predicate);
}

/**
 * Determines if any element of the sequence satisfies the specified predicate.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * If not specified, it will return true if the sequence has elements, otherwise false.
 * @returns {boolean} true if any element of the sequence satisfies the specified predicate; otherwise, false.
 * @example
 *      const numbers = [1, 2, -3, 4, 5];
 *      const hasNegative = any(numbers, n => n < 0); // hasNegative = true
 *      const hasGreaterThanTen = any(numbers, n => n > 10); // hasGreaterThanTen = false
 *      const isEmpty = any([] as number[]); // isEmpty = false
 *      const isNotEmpty = any(numbers); // isNotEmpty = true
 */
export const any = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).any(predicate);
}

/**
 * Appends the specified element to the end of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param element The element that will be appended to the end of the sequence
 * @returns {IEnumerable<TElement>} A new enumerable sequence that ends with the specified element.
 * @example
 *      const numbers = [1, 2, 3];
 *      const appended = toArray(append(numbers, 4)); // appended = [1, 2, 3, 4]
 */
export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
}

/**
 * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
 * @param source The source iterable.
 * @param selector The selector function that will select a numeric value from the sequence elements.
 * @returns {number} The average of the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const avg = average(numbers); // avg = 3
 *
 *      interface Item { value: number; }
 *      const items = [
 *          { value: 10 },
 *          { value: 20 },
 *          { value: 60 }
 *      ];
 *      const avgValue = average(items, item => item.value); // avgValue = 30
 */
export const average = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).average(selector);
}

/**
 * Casts the elements of the sequence to the specified type.
 * @template TResult
 * @param source The source iterable.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
 * @example
 *      const mixedList = [1, 'two', 3, 'four', 5];
 *      const numbersOnly = toArray(cast<number>(
 *          where(mixedList, item => typeof item === 'number')
 *      ));
 *      // numbersOnly = [1, 3, 5]
 *
 *      // Note: Cast doesn't perform type conversion, only type assertion.
 *      // If an element cannot be cast, it may lead to runtime errors later.
 *      // Example of a potential issue (if not pre-filtered):
 *      // const potentialError = cast<number>(mixedList);
 *      // Iterating potentialError might throw errors when 'two' or 'four' are accessed as numbers.
 */
export const cast = <TResult, TElement = unknown>(
    source: Iterable<TElement>
): IEnumerable<TResult> => {
    return from(source).cast<TResult>();
}

/**
 * Splits the elements of the sequence into chunks of size at most the specified size.
 * @template TElement
 * @param source The source iterable.
 * @param size The maximum size of each chunk.
 * @return {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are chunks of the original sequence.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
 *      const chunks = toArray(select(
 *          chunk(numbers, 3),
 *          chunkItems => toArray(chunkItems)
 *      ));
 *      // chunks = [[1, 2, 3], [4, 5, 6], [7, 8]]
 */
export const chunk = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).chunk(size);
}

/**
 * Returns all combinations of the elements of the sequence.
 * The outputs will not include duplicate combinations.
 * @template TElement
 * @param source The source iterable.
 * @param size The size of the combinations. If not specified, it will return all possible combinations.
 * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are combinations of the source sequence.
 * @throws {InvalidArgumentException} If size is less than or equal to 0.
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const combinationsOfTwo = toArray(select(
 *          combinations(letters, 2),
 *          combo => toArray(combo)
 *      ));
 *      // combinationsOfTwo = [['a', 'b'], ['a', 'c'], ['b', 'c']]
 *
 *      const allCombinations = toArray(select(
 *          combinations(letters),
 *          combo => toArray(combo)
 *      ));
 *      // allCombinations = [['a'], ['b'], ['c'], ['a', 'b'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']]
 */
export const combinations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).combinations(size);
}

/**
 * Concatenates two sequences.
 * @template TElement
 * @param source The source iterable.
 * @param other The iterable sequence that will be concatenated to the first sequence.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements of both sequences.
 * @example
 *      const list1 = [1, 2];
 *      const list2 = [3, 4];
 *      const concatenated = toArray(concat(list1, list2));
 *      // concatenated = [1, 2, 3, 4]
 */
export const concat = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).concat(from(other));
}

/**
 * Determines whether the sequence contains the specified element.
 * @param source The source iterable.
 * @param element The element whose existence will be checked.
 * @param comparator The comparator function that will be used for equality comparison. If not provided, the default equality comparison is used.
 * @returns {boolean} true if the sequence contains the specified element; otherwise, false.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const hasThree = contains(numbers, 3);
 *      // hasThree = true
 *      const hasTen = contains(numbers, 10);
 *      // hasTen = false
 *
 *      // Using a custom comparator for objects
 *      interface Person { id: number; name: string; }
 *      const people = [
 *          { id: 1, name: 'Alice' },
 *          { id: 2, name: 'Bob' }
 *      ];
 *      const bob = { id: 2, name: 'Bob' };
 *      const hasBobById = contains(people, bob, (p1, p2) => p1.id === p2.id);
 *      // hasBobById = true
 */
export const contains = <TElement>(
    source: Iterable<TElement>,
    element: TElement,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).contains(element, comparator);
}

/**
 * Returns the number of elements in the sequence.
 *
 * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {number} The number of elements in the sequence.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6];
 *      const totalCount = count(numbers);
 *      // totalCount = 6
 *
 *      const evenCount = count(numbers, n => n % 2 === 0);
 *      // evenCount = 3
 */
export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    return from(source).count(predicate);
}

/**
 * Returns an enumerable sequence of key value pair objects that contain the key and the number of occurrences of the key in the source sequence.
 * @template TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<KeyValuePair<TKey, number>>} A new enumerable sequence that contains key value pair objects.
 * @example
 *      const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
 *      const fruitCounts = toArray(countBy(fruits, fruit => fruit));
 *      // fruitCounts = [
 *      //   { key: 'apple', value: 3 },
 *      //   { key: 'banana', value: 2 },
 *      //   { key: 'orange', value: 1 }
 *      // ]
 *
 *      // Example with objects and key selector
 *      interface Item { type: string; }
 *      const items = [
 *          { type: 'A' },
 *          { type: 'B' },
 *          { type: 'A' }
 *      ];
 *      const typeCounts = toArray(countBy(items, item => item.type));
 *      // typeCounts = [ { key: 'A', value: 2 }, { key: 'B', value: 1 } ]
 */
export const countBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, number>> => {
    return from(source).countBy(keySelector, comparator);
}

/**
 * Returns a new enumerable sequence that repeats the elements of the source sequence a specified number of times.
 * If the count is not specified, the sequence will be repeated indefinitely.
 * If the sequence is empty, an error will be thrown.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of times the source sequence will be repeated.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that repeats the elements of the source sequence.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      const pattern = [1, 2];
 *      const repeatedFinite = toArray(cycle(pattern, 3));
 *      // repeatedFinite = [1, 2, 1, 2, 1, 2]
 *
 *      // Infinite cycle (use with caution, typically with take)
 *      // const repeatedInfinite = cycle(pattern);
 *      // const firstTen = toArray(take(repeatedInfinite, 10));
 *      // firstTen = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
 *
 *      // Throws error if the source is empty
 *      // cycle([] as number[]); // Throws NoElementsException
 */
export const cycle = <TElement>(
    source: Iterable<TElement>,
    count?: number
): IEnumerable<TElement> => {
    return from(source).cycle(count);
}

/**
 * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
 * @template TElement
 * @param source The source iterable.
 * @param value The value to return if the sequence is empty. Defaults to null if not provided.
 * @returns {IEnumerable<TElement | null>} The specified sequence or the specified value in a singleton collection if the sequence is empty.
 * @example
 *      const numbers = [1, 2, 3];
 *      const resultNotEmpty = toArray(defaultIfEmpty(numbers, 0));
 *      // resultNotEmpty = [1, 2, 3]
 *
 *      const emptyList = [] as number[];
 *      const resultEmptyWithDefault = toArray(defaultIfEmpty(emptyList, 0));
 *      // resultEmptyWithDefault = [0]
 *
 *      const resultEmptyNull = toArray(defaultIfEmpty(emptyList)); // No value specified, defaults to null
 *      // resultEmptyNull = [null]
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(value);
}

/**
 * Returns distinct elements from the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
 * @example
 *      const numbers = [1, 2, 2, 3, 1, 4, 5, 5];
 *      const distinctNumbers = toArray(distinct(numbers));
 *      // distinctNumbers = [1, 2, 3, 4, 5]
 *
 *      // Using a custom comparator for objects (compares based on id)
 *      interface Item { id: number; value: string; }
 *      const items = [
 *          { id: 1, value: 'A' },
 *          { id: 2, value: 'B' },
 *          { id: 1, value: 'C' }
 *      ];
 *      const distinctItemsById = toArray(distinct(items, (a, b) => a.id === b.id));
 *      // distinctItemsById = [{ id: 1, value: 'A' }, { id: 2, value: 'B' }]
 */
export const distinct = <TElement>(
    source: Iterable<TElement>,
    keyComparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).distinct(keyComparator);
}

/**
 * Returns distinct elements from the sequence based on a key selector.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison.
 * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
 * @example
 *      interface Product { category: string; name: string; }
 *      const products = [
 *          { category: 'Electronics', name: 'Laptop' },
 *          { category: 'Books', name: 'TypeScript Guide' },
 *          { category: 'Electronics', name: 'Mouse' },
 *          { category: 'Books', name: 'Another Book' }
 *      ];
 *
 *      // Get one product from each distinct category
 *      const distinctByCategory = toArray(distinctBy(products, p => p.category));
 *      // distinctByCategory might be:
 *      // [
 *      //   { category: 'Electronics', name: 'Laptop' },
 *      //   { category: 'Books', name: 'TypeScript Guide' }
 *      // ]
 *      // (The specific element kept from duplicates is the first one encountered)
 *
 *      // Using a custom key comparator (case-insensitive category)
 *      const productsMixedCase = [
 *          { category: 'Electronics', name: 'Laptop' },
 *          { category: 'electronics', name: 'Keyboard' },
 *          { category: 'Books', name: 'Guide' }
 *      ];
 *      const distinctCaseInsensitive = toArray(distinctBy(
 *          productsMixedCase,
 *          p => p.category,
 *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase()
 *      ));
 *      // distinctCaseInsensitive might be:
 *      // [
 *      //   { category: 'Electronics', name: 'Laptop' },
 *      //   { category: 'Books', name: 'Guide' }
 *      // ]
 */
export const distinctBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinctBy(keySelector, keyComparator);
}


/**
 * Returns the element at the specified index in the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param index The index of the element that will be returned.
 * @returns {TElement} The element at the specified index in the sequence.
 * @throws {IndexOutOfBoundsException} If index is less than 0 or greater than or equal to the number of elements in the sequence.
 * @example
 *      const letters = ['a', 'b', 'c', 'd'];
 *      const secondLetter = elementAt(letters, 1);
 *      // secondLetter = 'b'
 *
 *      try {
 *          elementAt(letters, 4); // Throws IndexOutOfBoundsException
 *      } catch (e) {
 *          console.log(e.message); // Output: Index was outside the bounds of the sequence.
 *      }
 *
 *      try {
 *          elementAt(letters, -1); // Throws IndexOutOfBoundsException
 *      } catch (e) {
 *          console.log(e.message); // Output: Index was outside the bounds of the sequence.
 *      }
 */
export const elementAt = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement => {
    return from(source).elementAt(index);
}

/**
 * Returns the element at the specified index in the sequence or a default value if the index is out of range.
 * @template TElement
 * @param source The source iterable.
 * @param index The index of the element that will be returned.
 * @returns {TElement|null} The element at the specified index in the sequence or null if the index is out of range.
 * @example
 *      const letters = ['a', 'b', 'c', 'd'];
 *      const secondLetter = elementAtOrDefault(letters, 1);
 *      // secondLetter = 'b'
 *
 *      const fifthLetter = elementAtOrDefault(letters, 4);
 *      // fifthLetter = null
 *
 *      const negativeIndex = elementAtOrDefault(letters, -1);
 *      // negativeIndex = null
 */
export const elementAtOrDefault = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement | null => {
    return from(source).elementAtOrDefault(index);
}

/**
 * Creates an empty sequence.
 *
 * @template TElement The type of elements in the sequence.
 * @returns {IEnumerable<TElement>} An empty sequence.
 */
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
 * @example
 *      const numbers1 = [1, 2, 3, 4, 5];
 *      const numbers2 = [3, 5, 6, 7];
 *      const difference = toArray(except(numbers1, numbers2));
 *      // difference = [1, 2, 4]
 *
 *      // Using custom object comparison
 *      interface Item { id: number; }
 *      const items1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
 *      const items2 = [{ id: 2 }, { id: 4 }];
 *      const itemDifference = toArray(except(items1, items2, (a, b) => a.id === b.id));
 *      // itemDifference = [{ id: 1 }, { id: 3 }]
 */
export const except = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).except(other, comparator);
}

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
 * @example
 *      interface Product { code: string; name: string; }
 *      const store1Products = [
 *          { code: 'A1', name: 'Apple' },
 *          { code: 'B2', name: 'Banana' },
 *          { code: 'C3', name: 'Cherry' }
 *      ];
 *      const store2Products = [
 *          { code: 'B2', name: 'Banana' }, // Same code as store1
 *          { code: 'D4', name: 'Date' }
 *      ];
 *
 *      // Find products in store1 whose codes are not in store2
 *      const uniqueToStore1 = toArray(exceptBy(
 *          store1Products,
 *          store2Products,
 *          p => p.code // Compare based on the 'code' property
 *      ));
 *      // uniqueToStore1 = [ { code: 'A1', name: 'Apple' }, { code: 'C3', name: 'Cherry' } ]
 *
 *      // Example with case-insensitive key comparison
 *      const listA = [{ val: 'a' }, { val: 'b' }];
 *      const listB = [{ val: 'B' }, { val: 'c' }];
 *      const diffCaseInsensitive = toArray(exceptBy(
 *          listA,
 *          listB,
 *          item => item.val,
 *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase() // Case-insensitive comparator
 *      ));
 *      // diffCaseInsensitive = [ { val: 'a' } ]
 */
export const exceptBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).exceptBy(other, keySelector, keyComparator);
}

/**
 * Gets the first element of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
 * @returns {TElement} The first element of the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @throws {NoMatchingElementException} If no element satisfies the condition.
 * @example
 *      const numbers = [10, 20, 30, 40];
 *      const firstElement = first(numbers);
 *      // firstElement = 10
 *
 *      const firstGreaterThan25 = first(numbers, n => n > 25);
 *      // firstGreaterThan25 = 30
 *
 *      const emptyList = [] as number[];
 *      try {
 *          first(emptyList); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 *
 *      try {
 *          first(numbers, n => n > 50); // Throws NoMatchingElementException
 *      } catch (e) {
 *          console.log(e.message); // Output: No element satisfies the condition.
 *      }
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
 * @example
 *      const numbers = [10, 20, 30, 40];
 *      const firstElement = firstOrDefault(numbers);
 *      // firstElement = 10
 *
 *      const firstGreaterThan25 = firstOrDefault(numbers, n => n > 25);
 *      // firstGreaterThan25 = 30
 *
 *      const firstGreaterThan50 = firstOrDefault(numbers, n => n > 50);
 *      // firstGreaterThan50 = null
 *
 *      const emptyList = [] as number[];
 *      const firstFromEmpty = firstOrDefault(emptyList);
 *      // firstFromEmpty = null
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
 * @example
 *      const names = ['Alice', 'Bob', 'Charlie'];
 *      let output = '';
 *      names.forEach((name, index) => {
 *          output += `${index}: ${name}\n`;
 *      });
 *      // output:
 *      // 0: Alice
 *      // 1: Bob
 *      // 2: Charlie
 *
 *      // Note: forEach executes immediately and does not return a new sequence.
 */
export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
}

/**
 * Creates an enumerable sequence from the given source.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable that will be converted to an enumerable sequence.
 * @returns {IEnumerable<TElement>} An enumerable sequence that contains the elements of the source.
 */
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
 * @example
 *      interface Pet { name: string; species: string; age: number; }
 *      const pets = [
 *          { name: 'Fluffy', species: 'Cat', age: 3 },
 *          { name: 'Buddy', species: 'Dog', age: 5 },
 *          { name: 'Whiskers', species: 'Cat', age: 2 },
 *          { name: 'Rex', species: 'Dog', age: 7 }
 *      ];
 *
 *      // Group pets by species
 *      const groupsBySpecies = toArray(groupBy(pets, pet => pet.species));
 *      // groupsBySpecies will contain IGroup objects. Example structure:
 *      // [
 *      //   { key: 'Cat', source: Enumerable containing Fluffy and Whiskers },
 *      //   { key: 'Dog', source: Enumerable containing Buddy and Rex }
 *      // ]
 *
 *      // To get results as arrays:
 *      const speciesArrays = toArray(select(
 *          groupBy(pets, pet => pet.species),
 *          group => ({ species: group.key, pets: toArray(group.source) })
 *      ));
 *      // speciesArrays = [
 *      //   { species: 'Cat', pets: [{ name: 'Fluffy', ... }, { name: 'Whiskers', ... }] },
 *      //   { species: 'Dog', pets: [{ name: 'Buddy', ... }, { name: 'Rex', ... }] }
 *      // ]
 *
 *      // Using a custom comparator (e.g., grouping ages into ranges)
 *      const ageGroups = toArray(select(
 *          groupBy(
 *              pets,
 *              pet => pet.age, // Temporary key selector
 *              (age1, age2) => Math.floor(age1 / 3) === Math.floor(age2 / 3) // Comparator: group by age range (0-2, 3-5, 6-8, etc.)
 *          ),
 *          group => ({ ageRangeKey: group.key, pets: toArray(group.source) }) // Note: group.key will be the first age encountered in that range
 *      ));
 *      // ageGroups might look like:
 *      // [
 *      //   { ageRangeKey: 3, pets: [Fluffy, Whiskers] }, // Ages 3 and 2 fall in the same range (key is 3 as it was encountered first)
 *      //   { ageRangeKey: 5, pets: [Buddy, Rex] }      // Ages 5 and 7 fall in the same range (key is 5)
 *      // ]
 */
export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return from(source).groupBy(keySelector, keyComparator);
}

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
 * @example
 *      interface Department { id: number; name: string; }
 *      interface Employee { name: string; deptId: number; }
 *
 *      const departments = [
 *          { id: 1, name: 'HR' },
 *          { id: 2, name: 'Engineering' },
 *          { id: 3, name: 'Sales' }
 *      ];
 *
 *      const employees = [
 *          { name: 'Alice', deptId: 2 },
 *          { name: 'Bob', deptId: 1 },
 *          { name: 'Charlie', deptId: 2 },
 *          { name: 'David', deptId: 4 } // Belongs to a non-listed department
 *      ];
 *
 *      // Group employees by department
 *      const departmentEmployees = toArray(groupJoin(
 *          departments,
 *          employees,
 *          dept => dept.id, // Outer key selector (department ID)
 *          emp => emp.deptId, // Inner key selector (employee department ID)
 *          (dept, emps) => ({ // Result selector
 *              departmentName: dept.name,
 *              employees: toArray(select(emps, e => e.name)) // Project employee names
 *          })
 *      ));
 *
 *      // departmentEmployees = [
 *      //   { departmentName: 'HR', employees: ['Bob'] },
 *      //   { departmentName: 'Engineering', employees: ['Alice', 'Charlie'] },
 *      //   { departmentName: 'Sales', employees: [] } // Sales has no matching employees
 *      // ]
 *      // Note: Employees in non-listed departments (David) are ignored as they don't match an outer key.
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
}

/**
 * Returns an enumerable of tuples, each containing the index and the element from the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {IEnumerable<[number, TElement]>} A new enumerable sequence whose elements are tuples of the index and the element.
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const indexedLetters = toArray(index(letters));
 *      // indexedLetters = [[0, 'a'], [1, 'b'], [2, 'c']]
 */
export const index = <TElement>(source: Iterable<TElement>): IEnumerable<[number, TElement]> => {
    return from(source).index();
}

/**
 * Produces the set intersection of two sequences by using the specified equality comparer or order comparer to compare values.
 * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
 * @template TElement
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
 * @param comparator The comparator function that will be used for item comparison. If not provided, a default equality comparison is used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set intersection of the two sequences.
 * @throws {Error} If the iterable is null or undefined.
 * @example
 *      const numbers1 = [1, 2, 3, 4, 5, 5]; // Source has duplicates
 *      const numbers2 = [3, 5, 6, 7, 5]; // Other has duplicates
 *      const intersection = toArray(intersect(numbers1, numbers2));
 *      // intersection = [3, 5] (Order matches source, duplicates removed)
 *
 *      // Using custom object comparison
 *      interface Item { id: number; value: string; }
 *      const items1 = [{ id: 1, value: 'A' }, { id: 2, value: 'B' }];
 *      const items2 = [{ id: 2, value: 'Different B' }, { id: 3, value: 'C' }];
 *      const itemIntersection = toArray(intersect(items1, items2, (a, b) => a.id === b.id));
 *      // itemIntersection = [{ id: 2, value: 'B' }] (Keeps the element from the first list)
 */
export const intersect = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).intersect(other, comparator);
}

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
 * @example
 *      interface Product { code: string; name: string; }
 *      const store1Products = [
 *          { code: 'A1', name: 'Apple' },
 *          { code: 'B2', name: 'Banana' },
 *          { code: 'C3', name: 'Cherry' }
 *      ];
 *      const store2Products = [
 *          { code: 'B2', name: 'Banana V2' }, // Same code as store1
 *          { code: 'D4', name: 'Date' }
 *      ];
 *
 *      // Find products in store1 whose codes also exist in store2
 *      const commonProducts = toArray(intersectBy(
 *          store1Products,
 *          store2Products,
 *          p => p.code // Compare based on the 'code' property
 *      ));
 *      // commonProducts = [ { code: 'B2', name: 'Banana' } ] (Takes the element from store1)
 *
 *      // Example with case-insensitive key comparison
 *      const listA = [{ val: 'a' }, { val: 'b' }];
 *      const listB = [{ val: 'B' }, { val: 'c' }];
 *      const intersectCaseInsensitive = toArray(intersectBy(
 *          listA,
 *          listB,
 *          item => item.val,
 *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase() // Case-insensitive comparator
 *      ));
 *      // intersectCaseInsensitive = [ { val: 'b' } ] (Keeps 'b' from listA as it matches 'B')
 */
export const intersectBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).intersectBy(other, keySelector, keyComparator);
}

/**
 * Intersperses a specified element between each element of the sequence.
 * @template TElement, TSeparator
 * @param source The source iterable.
 * @param separator The element that will be interspersed between each element of the sequence.
 * @returns {IEnumerable<TElement|TSeparator>} A new enumerable sequence whose elements are the elements of the source sequence interspersed with the specified element.
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const interspersedLetters = toArray(intersperse(letters, '-'));
 *      // interspersedLetters = ['a', '-', 'b', '-', 'c']
 *
 *      const numbers = [1, 2, 3];
 *      const interspersedNumbers = toArray(intersperse(numbers, 0));
 *      // interspersedNumbers = [1, 0, 2, 0, 3]
 *
 *      const emptyList = [] as string[];
 *      const interspersedEmpty = toArray(intersperse(emptyList, '-'));
 *      // interspersedEmpty = []
 *
 *      const singleItemList = ['a'];
 *      const interspersedSingle = toArray(intersperse(singleItemList, '-'));
 *      // interspersedSingle = ['a']
 */
export const intersperse = <TElement, TSeparator>(
    source: Iterable<TElement>,
    separator: TSeparator
): IEnumerable<TElement | TSeparator> => {
    return from(source).intersperse(separator);
}

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
 * @example
 *      interface Department { id: number; name: string; location: string }
 *      interface Employee { name: string; deptId: number; role: string }
 *
 *      const departments = [
 *          { id: 1, name: 'HR', location: 'Building A' },
 *          { id: 2, name: 'Engineering', location: 'Building B' },
 *          { id: 3, name: 'Marketing', location: 'Building A' } // No employees here
 *      ];
 *
 *      const employees = [
 *          { name: 'Alice', deptId: 2, role: 'Developer' },
 *          { name: 'Bob', deptId: 1, role: 'Manager' },
 *          { name: 'Charlie', deptId: 2, role: 'Tester' },
 *          { name: 'David', deptId: 4, role: 'Intern' } // Department 4 not in departments list
 *      ];
 *
 *      // Inner Join (default: leftJoin = false)
 *      const innerJoinResult = toArray(join(
 *          departments,
 *          employees,
 *          dept => dept.id,           // Outer key: department ID
 *          emp => emp.deptId,         // Inner key: employee department ID
 *          (dept, emp) => ({          // Result selector
 *              employeeName: emp.name,
 *              departmentName: dept.name
 *          })
 *      ));
 *      // innerJoinResult = [
 *      //   { employeeName: 'Bob', departmentName: 'HR' },
 *      //   { employeeName: 'Alice', departmentName: 'Engineering' },
 *      //   { employeeName: 'Charlie', departmentName: 'Engineering' }
 *      // ]
 *      // Note: Marketing dept and David (dept 4) are excluded.
 *
 *      // Left Join (leftJoin = true)
 *      const leftJoinResult = toArray(join(
 *          departments,
 *          employees,
 *          dept => dept.id,
 *          emp => emp.deptId,
 *          (dept, emp) => ({
 *              departmentName: dept.name,
 *              employeeName: emp?.name ?? 'N/A' // Use nullish coalescing for unmatched employees
 *          }),
 *          Comparators.equalityComparator, // Default comparator can be explicit or omitted
 *          true                       // Set leftJoin to true
 *      ));
 *      // leftJoinResult = [
 *      //   { departmentName: 'HR', employeeName: 'Bob' },
 *      //   { departmentName: 'Engineering', employeeName: 'Alice' },
 *      //   { departmentName: 'Engineering', employeeName: 'Charlie' },
 *      //   { departmentName: 'Marketing', employeeName: 'N/A' } // Marketing included, no matching employee
 *      // ]
 *      // Note: David (dept 4) is still excluded as the join starts from departments.
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
}

/**
 * Returns the last element of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
 * @returns {TElement} The last element of the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @throws {NoMatchingElementException} If no element satisfies the condition.
 * @example
 *      const numbers = [10, 20, 30, 25, 40];
 *      const lastElement = last(numbers);
 *      // lastElement = 40
 *
 *      const lastLessThan30 = last(numbers, n => n < 30);
 *      // lastLessThan30 = 25
 *
 *      const emptyList = [] as number[];
 *      try {
 *          last(emptyList); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 *
 *      try {
 *          last(numbers, n => n > 50); // Throws NoMatchingElementException
 *      } catch (e) {
 *          console.log(e.message); // Output: No element satisfies the condition.
 *      }
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
 * @example
 *      const numbers = [10, 20, 30, 25, 40];
 *      const lastElement = lastOrDefault(numbers);
 *      // lastElement = 40
 *
 *      const lastLessThan30 = lastOrDefault(numbers, n => n < 30);
 *      // lastLessThan30 = 25
 *
 *      const lastGreaterThan50 = lastOrDefault(numbers, n => n > 50);
 *      // lastGreaterThan50 = null
 *
 *      const emptyList = [] as number[];
 *      const lastFromEmpty = lastOrDefault(emptyList);
 *      // lastFromEmpty = null
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
 * @example
 *      const numbers = [10, 50, 20, 45, 30];
 *      const maxNumber = max(numbers);
 *      // maxNumber = 50
 *
 *      interface Item { value: number; }
 *      const items = [{ value: 100 }, { value: 50 }, { value: 200 }];
 *      const maxValue = max(items, item => item.value);
 *      // maxValue = 200
 *
 *      const emptyList = [] as number[];
 *      try {
 *          emptyList.max(); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 */
export const max = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).max(selector);
}

/**
 * Returns the element with the maximum value that is obtained by applying the key selector function to each element in the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {TElement} The element with the maximum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      interface Product { name: string; price: number; }
 *      const products = [
 *          { name: 'Laptop', price: 1200 },
 *          { name: 'Mouse', price: 25 },
 *          { name: 'Keyboard', price: 75 },
 *          { name: 'Monitor', price: 300 }
 *      ];
 *
 *      // Find the most expensive product
 *      const mostExpensive = maxBy(products, p => p.price);
 *      // mostExpensive = { name: 'Laptop', price: 1200 }
 *
 *      // Using a custom comparator (e.g., longest name)
 *      const productWithLongestName = maxBy(
 *          products,
 *          p => p.name.length // Key is the length of the name
 *      );
 *      // productWithLongestName = { name: 'Keyboard', price: 75 }
 *
 *      const emptyList = [] as Product[];
 *      try {
 *          maxBy(emptyList, p => p.price); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 */
export const maxBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).maxBy(keySelector, comparator);
}

/**
 * Returns the minimum value in the sequence.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
 * @returns {number} The minimum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      const numbers = [10, 50, 20, 45, 30];
 *      const minNumber = min(numbers);
 *      // minNumber = 10
 *
 *      interface Item { value: number; }
 *      const items = [{ value: 100 }, { value: 50 }, { value: 200 }];
 *      const minValue = min(items, item => item.value);
 *      // minValue = 50
 *
 *      const emptyList = [] as number[];
 *      try {
 *          min(emptyList); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 */
export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
}

/**
 * Returns the element with the minimum value that is obtained by applying the key selector function to each element in the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {TElement} The element with the minimum value in the sequence.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      interface Product { name: string; price: number; }
 *      const products = [
 *          { name: 'Laptop', price: 1200 },
 *          { name: 'Mouse', price: 25 },
 *          { name: 'Keyboard', price: 75 },
 *          { name: 'Monitor', price: 300 }
 *      ];
 *
 *      // Find the cheapest product
 *      const cheapest = minBy(products, p => p.price);
 *      // cheapest = { name: 'Mouse', price: 25 }
 *
 *      // Using a custom comparator (e.g., the shortest name)
 *      const productWithShortestName = minBy(
 *          products,
 *          p => p.name.length // Key is the length of the name
 *      );
 *      // productWithShortestName = { name: 'Mouse', price: 25 }
 *
 *      const emptyList = [] as Product[];
 *      try {
 *          minBy(emptyList, p => p.price); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 */
export const minBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): TElement => {
    return from(source).minBy(keySelector, comparator);
}

/**
 * Determines whether no elements of the sequence satisfy the specified predicate.
 * If no predicate is specified, it returns true if the sequence is empty, and false otherwise.
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {boolean} true if no elements satisfy the predicate, or if the sequence is empty and no predicate is provided; otherwise, false.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *
 *      // Check if none are negative
 *      const noneNegative = none(numbers, n => n < 0);
 *      // noneNegative = true
 *
 *      // Check if none are greater than 10
 *      const noneGreaterThan10 = none(numbers, n => n > 10);
 *      // noneGreaterThan10 = true
 *
 *      // Check if none are even (this will be false)
 *      const noneEven = none(numbers, n => n % 2 === 0);
 *      // noneEven = false
 *
 *      // Check if an empty list has no elements (no predicate)
 *      const emptyList = [] as number[];
 *      const emptyNone = none(emptyList);
 *      // emptyNone = true
 *
 *      // Check if a non-empty list has no elements (no predicate)
 *      const nonEmptyNone = none(numbers);
 *      // nonEmptyNone = false
 */
export const none = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).none(predicate);
}

/**
 * Returns the elements that are of the specified type.
 * The type can be specified either as a constructor function or as a string representing a primitive type.
 * @template TResult
 * @param source The source iterable.
 * @param type The type to filter the elements of the sequence with (e.g., 'string', 'number', Boolean, Date, MyCustomClass).
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
 * @example
 *      // --- Basic Usage with Primitives (string type name) ---
 *      const mixedList = [1, 'apple', true, 2.5, 'banana', false, null, undefined];
 *
 *      const stringsOnly = toArray(ofType(mixedList, 'string'));
 *      // stringsOnly = ['apple', 'banana']
 *
 *      const numbersOnly = toArray(ofType(mixedList, 'number'));
 *      // numbersOnly = [1, 2.5]
 *
 *      const booleansOnly = toArray(ofType(mixedList, 'boolean'));
 *      // booleansOnly = [true, false]
 *
 *      // Note: 'object' will match non-null objects, including arrays, dates, custom objects, etc.
 *      const objectsOnly = toArray(ofType(mixedList, 'object'));
 *      // objectsOnly = [] (in this specific list, as null is considered object but often filtered implicitly)
 *
 *      const listWithObject = [1, { name: 'obj' }, new Date(), [1, 2]];
 *      const objectsInList = toArray(ofType(listWithObject, 'object'));
 *      // objectsInList = [ { name: 'obj' }, Date(...), [1, 2] ]
 *
 *      // --- Usage with Constructor Functions ---
 *      class Animal { constructor(public name: string) {} }
 *      class Dog extends Animal { constructor(name: string, public breed: string) { super(name); } }
 *      class Cat extends Animal { constructor(name: string, public lives: number) { super(name); } }
 *
 *      const animals = [
 *          new Dog('Buddy', 'Golden Retriever'),
 *          new Cat('Whiskers', 9),
 *          'Not an animal',
 *          new Dog('Rex', 'German Shepherd'),
 *          null // Will be filtered out
 *      ];
 *
 *      // Get only Dog instances
 *      const dogs = toArray(ofType(animals, Dog));
 *      // dogs = [ Dog { name: 'Buddy', breed: 'Golden Retriever' }, Dog { name: 'Rex', breed: 'German Shepherd' } ]
 *      // TypeScript knows `dogs` is of type Dog[]
 *
 *      // Get only Cat instances
 *      const cats = toArray(ofType(animals, Cat));
 *      // cats = [ Cat { name: 'Whiskers', lives: 9 } ]
 *      // TypeScript knows `cats` is of type Cat[]
 *
 *      // --- Inheritance Handling ---
 *      // Get all instances of Animal (includes Dogs and Cats)
 *      const allAnimals = toArray(ofType(animals, Animal));
 *      // allAnimals = [
 *      //   Dog { name: 'Buddy', breed: 'Golden Retriever' },
 *      //   Cat { name: 'Whiskers', lives: 9 },
 *      //   Dog { name: 'Rex', breed: 'German Shepherd' }
 *      // ]
 *      // TypeScript knows `allAnimals` is of type Animal[]
 *
 *      // --- Using with built-in constructors ---
 *      const variousData = [new Date(), 123, "hello", new Date(0), true];
 *      const datesOnly = toArray(ofType(variousData, Date));
 *      // datesOnly = [ Date(...), Date(0) ] // Contains the two Date objects
 *
 *      const numbersFromAny = toArray(ofType(variousData, Number));
 *      // numbersFromAny = [ 123 ]
 *
 *      // --- Edge Cases ---
 *      const nullsAndUndefined = [null, undefined, 0, ''];
 *      const objects = toArray(ofType(nullsAndUndefined, 'object')); // 'object' typically matches non-null objects
 *      // objects = []
 *
 *      const undefinedOnly = toArray(ofType(nullsAndUndefined, 'undefined'));
 *      // undefinedOnly = [undefined]
 */
export const ofType = <TElement, TResult extends ObjectType>(
    source: Iterable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return from(source).ofType(type);
}

/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in ascending order.
 * @example
 *      const numbers = [50, 10, 40, 30, 20];
 *      const sortedNumbers = toArray(orderBy(numbers, n => n));
 *      // sortedNumbers = [10, 20, 30, 40, 50]
 *
 *      interface Person { name: string; age: number; }
 *      const people = [
 *          { name: 'Charlie', age: 30 },
 *          { name: 'Alice', age: 25 },
 *          { name: 'Bob', age: 35 }
 *      ];
 *
 *      // Order by age (ascending)
 *      const peopleByAge = toArray(orderBy(people, p => p.age));
 *      // peopleByAge = [
 *      //   { name: 'Alice', age: 25 },
 *      //   { name: 'Charlie', age: 30 },
 *      //   { name: 'Bob', age: 35 }
 *      // ]
 *
 *      // Order by name (string comparison, ascending)
 *      const peopleByName = toArray(orderBy(people, p => p.name));
 *      // peopleByName = [
 *      //   { name: 'Alice', age: 25 },
 *      //   { name: 'Bob', age: 35 },
 *      //   { name: 'Charlie', age: 30 }
 *      // ]
 *
 *      // Using a custom comparator (e.g., sort numbers as strings)
 *      const numbersToSortAsString = [1, 10, 2, 20];
 *      const sortedAsString = toArray(orderBy(
 *          numbersToSortAsString,
 *          n => n,
 *          (a, b) => String(a).localeCompare(String(b)) // String comparison
 *      ));
 *      // sortedAsString = [1, 10, 2, 20] (standard numeric sort would be [1, 2, 10, 20])
 */
export const orderBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderBy(keySelector, comparator);
}

/**
 * Sorts the elements of a sequence in descending order by using a specified comparer.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in descending order.
 * @example
 *      const numbers = [50, 10, 40, 30, 20];
 *      const sortedNumbersDesc = toArray(orderByDescending(numbers, n => n));
 *      // sortedNumbersDesc = [50, 40, 30, 20, 10]
 *
 *      interface Person { name: string; age: number; }
 *      const people = [
 *          { name: 'Charlie', age: 30 },
 *          { name: 'Alice', age: 25 },
 *          { name: 'Bob', age: 35 }
 *      ];
 *
 *      // Order by age (descending)
 *      const peopleByAgeDesc = toArray(orderByDescending(people, p => p.age));
 *      // peopleByAgeDesc = [
 *      //   { name: 'Bob', age: 35 },
 *      //   { name: 'Charlie', age: 30 },
 *      //   { name: 'Alice', age: 25 }
 *      // ]
 *
 *      // Order by name (string comparison, descending)
 *      const peopleByNameDesc = toArray(orderByDescending(people, p => p.name));
 *      // peopleByNameDesc = [
 *      //   { name: 'Charlie', age: 30 },
 *      //   { name: 'Bob', age: 35 },
 *      //   { name: 'Alice', age: 25 }
 *      // ]
 */
export const orderByDescending = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderByDescending(keySelector, comparator);
}

/**
 * Produces a sequence of tuples containing the element and the following element.
 * @template TElement, TResult
 * @param source The source iterable.
 * @param resultSelector The optional function to create a result element from the current and the next element. Defaults to creating a tuple `[current, next]`.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of applying the `resultSelector` to adjacent elements.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *
 *      // Default behavior: creates tuples
 *      const pairs = toArray(pairwise(numbers));
 *      // pairs = [[1, 2], [2, 3], [3, 4], [4, 5]]
 *
 *      // Custom result selector: calculate differences
 *      const differences = toArray(pairwise(numbers, (current, next) => next - current));
 *      // differences = [1, 1, 1, 1]
 *
 *      // Custom result selector: create strings
 *      const pairStrings = toArray(pairwise(numbers, (current, next) => `${current}-${next}`));
 *      // pairStrings = ["1-2", "2-3", "3-4", "4-5"]
 *
 *      const shortList = [10];
 *      const noPairs = toArray(pairwise(shortList));
 *      // noPairs = []
 *
 *      const emptyList = [] as number[];
 *      const emptyPairs = toArray(pairwise(emptyList));
 *      // emptyPairs = []
 */
export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
}

/**
 * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
 * Note: This method iterates the source sequence immediately and stores the results.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to check each element for a condition.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing two enumerable sequences: the first for elements satisfying the predicate, the second for the rest.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 *      const [evens, odds] = partition(numbers, n => n % 2 === 0);
 *
 *      const evensArray = toArray(evens);
 *      // evensArray = [2, 4, 6, 8, 10]
 *
 *      const oddsArray = toArray(odds);
 *      // oddsArray = [1, 3, 5, 7, 9]
 *
 *      interface Person { name: string; age: number; }
 *      const people = [
 *          { name: 'Alice', age: 25 },
 *          { name: 'Bob', age: 17 },
 *          { name: 'Charlie', age: 30 },
 *          { name: 'Diana', age: 15 }
 *      ];
 *
 *      const [adults, minors] = partition(people, p => p.age >= 18);
 *
 *      const adultNames = toArray(select(adults, p => p.name));
 *      // adultNames = ['Alice', 'Charlie']
 *
 *      const minorNames = toArray(select(minors, p => p.name));
 *      // minorNames = ['Bob', 'Diana']
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
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const allPermutations = toArray(select(
 *          permutations(letters),
 *          p => toArray(p).join('') // Convert each permutation sequence to a string
 *      ));
 *      // allPermutations = ["abc", "acb", "bac", "bca", "cab", "cba"]
 *
 *      const permutationsOfTwo = toArray(select(
 *          permutations(letters, 2),
 *          p => toArray(p).join('')
 *      ));
 *      // permutationsOfTwo = ["ab", "ac", "ba", "bc", "ca", "cb"]
 *
 *      // With duplicates in source - only distinct elements are permuted
 *      const lettersWithDuplicates = ['a', 'a', 'b'];
 *      const permsFromDup = toArray(select(
 *          permutations(lettersWithDuplicates), // Equivalent to permutations of ['a', 'b']
 *          p => toArray(p).join('')
 *      ));
 *      // permsFromDup = ["ab", "ba"]
 *
 *      const permsOfOne = toArray(select(
 *          permutations(letters, 1),
 *          p => toArray(p).join('')
 *      ));
 *      // permsOfOne = ["a", "b", "c"]
 *
 *      try {
 *          permutations(letters, 0); // Throws InvalidArgumentException
 *      } catch (e) {
 *          console.log(e.message); // Output: Size must be greater than 0.
 *      }
 */
export const permutations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).permutations(size);
}

/**
 * Adds a value to the beginning of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param element The element to add to the sequence.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that starts with the specified element.
 * @example
 *      const numbers = [1, 2, 3];
 *      const prepended = toArray(prepend(numbers, 0));
 *      // prepended = [0, 1, 2, 3]
 *
 *      const emptyList = [] as string[];
 *      const prependedToEmpty = toArray(prepend(emptyList, "first"));
 *      // prependedToEmpty = ["first"]
 */
export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
}

/**
 * Computes the product of the sequence. Assumes elements are numbers or uses a selector to get numbers.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select a numeric value from the sequence elements.
 * @returns {number} The product of the sequence. Returns 1 if the sequence is empty.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const totalProduct = product(numbers);
 *      // totalProduct = 120 (1 * 2 * 3 * 4 * 5)
 *
 *      interface Item { value: number; }
 *      const items = [{ value: 2 }, { value: 5 }, { value: 10 }];
 *      const itemValueProduct = product(items, item => item.value);
 *      // itemValueProduct = 100 (2 * 5 * 10)
 *
 *      const emptyList = [] as number[];
 *      try {
 *          emptyList.product(); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 */
export const product = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).product(selector);
}

/**
 * Creates a range of numbers starting from the specified start value and containing the specified count of elements.
 * @param {number} start The start value of the range.
 * @param {number} count The number of elements in the range.
 * @returns {IEnumerable<number>} An enumerable range of numbers.
 */
export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};

/**
 * Repeats the specified element a specified number of times.
 *
 * @template TElement The type of the element to repeat.
 * @param {TElement} element The element to repeat.
 * @param {number} count The number of times to repeat the element.
 * @returns {IEnumerable<TElement>} An Iterable representing the repeated elements.
 */
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
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const reversedNumbers = toArray(reverse(numbers));
 *      // reversedNumbers = [5, 4, 3, 2, 1]
 *
 *      const letters = ['a', 'b', 'c'];
 *      const reversedLetters = toArray(reverse(letters));
 *      // reversedLetters = ['c', 'b', 'a']
 *
 *      const emptyList = [] as number[];
 *      const reversedEmpty = toArray(reverse(emptyList));
 *      // reversedEmpty = []
 */
export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
}

/**
 * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
 * If seed is specified, it is used as the initial value for the accumulator, but it is not included in the result sequence.
 * @template TAccumulate
 * @param source The source iterable.
 * @param accumulator The accumulator function that will be applied over the sequence.
 * @param seed The value that will be used as the initial value. If not specified, the first element of the sequence will be used as the seed value and also included as the first element of the result.
 * @returns {IEnumerable<TAccumulate>} A new enumerable sequence whose elements are the result of each intermediate computation.
 * @throws {NoElementsException} If the source is empty and seed is not provided.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *
 *      // Running sum without a seed (the first element is the initial value and first result)
 *      const runningSumNoSeed = toArray(scan(numbers, (acc, current) => acc + current));
 *      // runningSumNoSeed = [1, 3, 6, 10, 15]
 *
 *      // Running sum with seed (seed is initial value, but not in output)
 *      const runningSumWithSeed = toArray(scan(numbers, (acc, current) => acc + current, 100));
 *      // runningSumWithSeed = [101, 103, 106, 110, 115]
 *
 *      // Building intermediate strings
 *      const letters = ['a', 'b', 'c'];
 *      const intermediateStrings = toArray(scan(letters, (acc, current) => acc + current, ''));
 *      // intermediateStrings = ['a', 'ab', 'abc']
 *
 *      const emptyList = [] as number[];
 *      try {
 *          toArray(scan(emptyList, (a, b) => a + b)); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 *      const scanEmptyWithSeed = toArray(scan(emptyList, (a, b) => a + b, 0));
 *      // scanEmptyWithSeed = []
 */
export const scan = <TElement, TAccumulate = TElement>(
    source: Iterable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return from(source).scan(accumulator, seed);
}

/**
 * Projects each element of a sequence into a new form.
 * @template TResult
 * @param source The source iterable.
 * @param selector The selector function that will be used to project each element into a new form. The second parameter is the index.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the selector function.
 * @example
 *      const numbers = [1, 2, 3, 4];
 *      const squares = toArray(select(numbers, n => n * n));
 *      // squares = [1, 4, 9, 16]
 *
 *      interface Person { firstName: string; lastName: string; }
 *      const people = [
 *          { firstName: 'John', lastName: 'Doe' },
 *          { firstName: 'Jane', lastName: 'Smith' }
 *      ];
 *      const fullNames = toArray(select(people, p => `${p.firstName} ${p.lastName}`));
 *      // fullNames = ["John Doe", "Jane Smith"]
 *
 *      // Using the index
 *      const indexedValues = toArray(select(people, (p, index) => `${index}: ${p.firstName}`));
 *      // indexedValues = ["0: John", "1: Jane"]
 */
export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
}

/**
 * Projects each element of a sequence into a new form (which is an iterable) and flattens the resulting sequences into one sequence.
 * @template TResult
 * @param source The source iterable.
 * @param selector The selector function that will be used to project each element into a new iterable form. The second parameter is the index.
 * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the flattened result of the selector function.
 * @example
 *      interface Customer { name: string; orders: string[]; }
 *      const customers = [
 *          { name: 'Alice', orders: ['Apple', 'Banana'] },
 *          { name: 'Bob', orders: ['Cherry'] },
 *          { name: 'Charlie', orders: [] } // No orders
 *      ];
 *
 *      // Get a single list of all orders from all customers
 *      const allOrders = toArray(selectMany(customers, c => c.orders));
 *      // allOrders = ['Apple', 'Banana', 'Cherry']
 *
 *      // Example: splitting strings and flattening
 *      const sentences = ['Hello world', 'How are you'];
 *      const words = toArray(selectMany(sentences, s => split(s, ' ')));
 *      // words = ['Hello', 'world', 'How', 'are', 'you']
 *
 *      // Using index in selector
 *      const indexedFlatten = toArray(selectMany(customers, (c, index) => c.orders.map(o => `${index}-${o}`)));
 *      // indexedFlatten = ['0-Apple', '0-Banana', '1-Cherry']
 */
export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
}

/**
 * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
 * Compares elements pairwise in order. Sequences must have the same length and equal elements at corresponding positions.
 * @param source The source iterable.
 * @param other The iterable sequence to compare to the source sequence.
 * @param comparator The equality comparer that will be used to compare the elements. If not specified, the default equality comparer will be used.
 * @returns {boolean} true if the two source sequences are of equal length and their corresponding elements are equal, according to the specified equality comparer; otherwise, false.
 * @example
 *      const list1 = [1, 2, 3];
 *      const list2 = [1, 2, 3];
 *      const list3 = [1, 3, 2]; // Different order
 *      const list4 = [1, 2]; // Different length
 *      const array1 = [1, 2, 3]; // Can compare with other iterables
 *
 *      const isEqual12 = sequenceEqual(list1, list2);
 *      // isEqual12 = true
 *
 *      const isEqual13 = sequenceEqual(list1, list3);
 *      // isEqual13 = false
 *
 *      const isEqual14 = sequenceEqual(list1, list4);
 *      // isEqual14 = false
 *
 *      const isEqual1Array = sequenceEqual(list1, array1);
 *      // isEqual1Array = true
 *
 *      // Custom comparison for objects
 *      interface Item { id: number; }
 *      const items1 = [{ id: 1 }, { id: 2 }];
 *      const items2 = [{ id: 1 }, { id: 2 }];
 *      const items3 = [{ id: 1 }, { id: 3 }];
 *
 *      const areItemsEqualById = items1.sequenceEqual(items2, (a, b) => a.id === b.id);
 *      // areItemsEqualById = true
 *
 *      const areItems3EqualById = items1.sequenceEqual(items3, (a, b) => a.id === b.id);
 *      // areItems3EqualById = false
 */
export const sequenceEqual = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).sequenceEqual(other, comparator);
}

/**
 * Returns a new enumerable sequence whose elements are shuffled randomly.
 * Note: This method internally converts the sequence to an array to shuffle it.
 * @template TElement
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are shuffled.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const shuffledNumbers = toArray(shuffle(numbers));
 *      // shuffledNumbers will be a random permutation of [1, 2, 3, 4, 5], e.g., [3, 1, 5, 2, 4]
 *
 *      // Shuffling is not stable; subsequent calls will likely produce different orders
 *      const shuffledAgain = toArray(shuffle(numbers));
 *      // shuffledAgain will likely be different from shuffledNumbers
 */
export const shuffle = <TElement>(
    source: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).shuffle();
}

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
 * @example
 *      const singleItemList = [42];
 *      const theOnlyItem = single(singleItemList);
 *      // theOnlyItem = 42
 *
 *      const numbers = [10, 20, 30, 40];
 *      const theOnlyThirty = single(numbers, n => n === 30);
 *      // theOnlyThirty = 30
 *
 *      const emptyList = [] as number[];
 *      try {
 *          single(emptyList); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message);
 *      }
 *
 *      const multipleItems = [1, 2];
 *      try {
 *          single(multipleItems); // Throws MoreThanOneElementException
 *      } catch (e) {
 *          console.log(e.message);
 *      }
 *
 *      try {
 *          single(numbers, n => n > 50); // Throws NoMatchingElementException
 *      } catch (e) {
 *          console.log(e.message);
 *      }
 *
 *      try {
 *          single(numbers, n => n > 15); // Throws MoreThanOneMatchingElementException
 *      } catch (e) {
 *          console.log(e.message);
 *      }
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
 * @example
 *      const singleItemList = [42];
 *      const theOnlyItem = singleOrDefault(singleItemList);
 *      // theOnlyItem = 42
 *
 *      const numbers = [10, 20, 30, 40];
 *      const theOnlyThirty = singleOrDefault(numbers, n => n === 30);
 *      // theOnlyThirty = 30
 *
 *      const emptyList = [] as number[];
 *      const singleFromEmpty = singleOrDefault(emptyList);
 *      // singleFromEmpty = null
 *
 *      const singleNoMatch = singleOrDefault(numbers, n => n > 50);
 *      // singleNoMatch = null
 *
 *      const multipleItems = [1, 2];
 *      try {
 *          singleOrDefault(multipleItems); // Throws MoreThanOneElementException
 *      } catch (e) { console.log(e.message); }
 *
 *      try {
 *          singleOrDefault(numbers, n => n > 15); // Throws MoreThanOneMatchingElementException
 *      } catch (e) {
 *          console.log(e.message);
 *      }
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
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6];
 *      const skipFirstThree = toArray(skip(numbers, 3));
 *      // skipFirstThree = [4, 5, 6]
 *
 *      const skipZero = toArray(skip(numbers, 0));
 *      // skipZero = [1, 2, 3, 4, 5, 6]
 *
 *      const skipMoreThanAvailable = toArray(skip(numbers, 10));
 *      // skipMoreThanAvailable = []
 *
 *      const skipNegative = toArray(skip(numbers, -5)); // Negative count is treated as 0
 *      // skipNegative = [1, 2, 3, 4, 5, 6]
 */
export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
}

/**
 * Returns a new enumerable sequence that contains the elements from the source with the last count elements of the source sequence omitted.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to omit from the end of the collection. If the count is zero or negative, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from source with the last count elements omitted.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6];
 *      const skipLastTwo = toArray(skipLast(numbers, 2));
 *      // skipLastTwo = [1, 2, 3, 4]
 *
 *      const skipLastZero = toArray(skipLast(numbers, 0));
 *      // skipLastZero = [1, 2, 3, 4, 5, 6]
 *
 *      const skipLastMoreThanAvailable = toArray(skipLast(numbers, 10));
 *      // skipLastMoreThanAvailable = []
 *
 *      const skipLastNegative = toArray(skipLast(numbers, -3)); // Negative count is treated as 0
 *      // skipLastNegative = [1, 2, 3, 4, 5, 6]
 */
export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skipLast(count);
}

/**
 * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
 * The element that first fails the condition is included in the result.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function (accepting element and index) that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements starting from the first element that does not satisfy the predicate.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 1, 2];
 *
 *      // Skip while less than 4
 *      const skipWhileLessThan4 = toArray(skipWhile(numbers, n => n < 4));
 *      // skipWhileLessThan4 = [4, 5, 1, 2] (Stops skipping at 4)
 *
 *      // Skip based on index
 *      const skipWhileIndexLessThan3 = toArray(skipWhile(numbers, (n, index) => index < 3));
 *      // skipWhileIndexLessThan3 = [4, 5, 1, 2] (Skips elements at index 0, 1, 2)
 *
 *      // Condition never met
 *      const skipWhileAlwaysTrue = toArray(skipWhile(numbers, n => true));
 *      // skipWhileAlwaysTrue = []
 *
 *      // Condition immediately false
 *      const skipWhileAlwaysFalse = toArray(skipWhile(numbers, n => false));
 *      // skipWhileAlwaysFalse = [1, 2, 3, 4, 5, 1, 2]
 */
export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
}

/**
 * Splits the sequence into two sequences based on a predicate.
 * The first sequence contains the elements from the start of the input sequence that satisfy the predicate continuously.
 * The second sequence contains the remaining elements, starting from the first element that failed the predicate.
 * Note: This method iterates the source sequence immediately and stores the results.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function that will be used to test each element.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences.
 * @example
 *      const numbers = [1, 2, 3, 4, 1, 5, 6];
 *
 *      // Span while numbers are less than 4
 *      const [lessThan4, rest1] = span(numbers, n => n < 4);
 *      const lessThan4Array = toArray(lessThan4);
 *      // lessThan4Array = [1, 2, 3]
 *      const rest1Array = toArray(rest1);
 *      // rest1Array = [4, 1, 5, 6] (Starts from the first element failing the condition)
 *
 *      // Span while condition is always true
 *      const [allElements, rest2] = span(numbers, n => true);
 *      const allElementsArray = toArray(allElements);
 *      // allElementsArray = [1, 2, 3, 4, 1, 5, 6]
 *      const rest2Array = toArray(rest2);
 *      // rest2Array = []
 *
 *      // Span while the condition is initially false
 *      const [initialSpan, rest3] = span(numbers, n => n > 10);
 *      const initialSpanArray = toArray(initialSpan);
 *      // initialSpanArray = []
 *      const rest3Array = toArray(rest3);
 *      // rest3Array = [1, 2, 3, 4, 1, 5, 6]
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
 * @example
 *      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 *
 *      // Take every 2nd element (step = 2)
 *      const step2 = toArray(step(numbers, 2));
 *      // step2 = [0, 2, 4, 6, 8, 10]
 *
 *      // Take every 3rd element (step = 3)
 *      const step3 = toArray(step(numbers, 3));
 *      // step3 = [0, 3, 6, 9]
 *
 *      // Step = 1 includes all elements
 *      const step1 = toArray(step(numbers, 1));
 *      // step1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *
 *      try {
 *          step(numbers, 0); // Throws InvalidArgumentException
 *      } catch (e) {
 *          console.log(e.message); // Output: Step must be greater than 0.
 *      }
 */
export const step = <TElement>(
    source: Iterable<TElement>,
    step: number
): IEnumerable<TElement> => {
    return from(source).step(step);
}

/**
 * Returns the sum of the values in the sequence. Assumes elements are numbers or uses a selector to get numbers.
 * @param source The source iterable.
 * @param selector The selector function that will be used to select the numeric value to sum. If not specified, the element itself is used.
 * @returns {number} The sum of the values in the sequence. Returns 0 if the sequence is empty.
 * @throws {NoElementsException} If the source is empty.
 * @example
 *      const numbers = [1, 2, 3, 4, 5];
 *      const totalSum = sum(numbers);
 *      // totalSum = 15
 *
 *      interface Item { value: number; quantity: number; }
 *      const items = [
 *          { value: 10, quantity: 2 }, // Total value = 20
 *          { value: 5, quantity: 3 }  // Total value = 15
 *      ];
 *      const totalItemValue = sum(items, item => item.value * item.quantity);
 *      // totalItemValue = 35
 *
 *      const emptyList = [] as number[];
 *      try {
 *          sum(emptyList); // Throws NoElementsException
 *      } catch (e) {
 *          console.log(e.message); // Output: The sequence contains no elements.
 *      }
 */
export const sum = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).sum(selector);
}

/**
 * Returns a specified number of contiguous elements from the start of a sequence.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6];
 *
 *      const takeFirstThree = toArray(take(numbers, 3));
 *      // takeFirstThree = [1, 2, 3]
 *
 *      const takeZero = toArray(take(numbers, 0));
 *      // takeZero = []
 *
 *      const takeMoreThanAvailable = toArray(take(numbers, 10));
 *      // takeMoreThanAvailable = [1, 2, 3, 4, 5, 6]
 *
 *      const takeNegative = toArray(take(numbers, -2)); // Negative count is treated as 0
 *      // takeNegative = []
 */
export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
}

/**
 * Returns a specified number of contiguous elements from the end of a sequence.
 * @template TElement
 * @param source The source iterable.
 * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the end of the input sequence.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6];
 *
 *      const takeLastTwo = toArray(takeLast(numbers, 2));
 *      // takeLastTwo = [5, 6]
 *
 *      const takeLastZero = toArray(takeLast(numbers, 0));
 *      // takeLastZero = []
 *
 *      const takeLastMoreThanAvailable = toArray(takeLast(numbers, 10));
 *      // takeLastMoreThanAvailable = [1, 2, 3, 4, 5, 6] (Order is preserved)
 *
 *      const takeLastNegative = toArray(takeLast(numbers, -3)); // Negative count is treated as 0
 *      // takeLastNegative = []
 */
export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
}

/**
 * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function (accepting element and index) that will be used to test each element.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
 * @example
 *      const numbers = [1, 2, 3, 4, 1, 5, 6];
 *
 *      // Take while less than 4
 *      const takeWhileLessThan4 = toArray(takeWhile(numbers, n => n < 4));
 *      // takeWhileLessThan4 = [1, 2, 3] (Stops taking at 4)
 *
 *      // Take based on index
 *      const takeWhileIndexLessThan3 = toArray(takeWhile(numbers, (n, index) => index < 3));
 *      // takeWhileIndexLessThan3 = [1, 2, 3] (Takes elements at index 0, 1, 2)
 *
 *      // Condition never met (the first element fails)
 *      const takeWhileAlwaysFalse = toArray(takeWhile(numbers, n => n > 10));
 *      // takeWhileAlwaysFalse = []
 *
 *      // Condition always true
 *      const takeWhileAlwaysTrue = toArray(takeWhile(numbers, n => true));
 *      // takeWhileAlwaysTrue = [1, 2, 3, 4, 1, 5, 6]
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
 * Creates a new array from the elements of the sequence.
 * This forces evaluation of the entire sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {TElement[]} An array that contains the elements from the input sequence.
 * @example
 *      const numbers = [1, 2, 3];
 *      const numberArray = toArray(numbers);
 *      // numberArray = [1, 2, 3] (a standard JavaScript Array)
 *
 *      const squares = select(numbers, n => n * n); // squares is an IEnumerable
 *      const squaresArray = toArray(squares); // squaresArray forces evaluation
 *      // squaresArray = [1, 4, 9]
 */
export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
}

/**
 * Creates a new circular linked list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @template TElement The type of elements in the sequence.
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {CircularLinkedList<TElement>} A new circular linked list that contains the elements from the input sequence.
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const circularList = toCircularLinkedList(letters);
 *      // circularList is a CircularLinkedList instance containing 'a', 'b', 'c'
 */
export const toCircularLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularLinkedList<TElement> => {
    return from(source).toCircularLinkedList(comparator);
}

/**
 * Creates a new circular queue from the elements of the source sequence.
 * The queue retains only the most recent values up to the specified capacity, discarding older entries when full.
 * Forces evaluation of the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @param capacity Optional capacity for the resulting queue. If omitted, the queue's default capacity is used.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {CircularQueue<TElement>} A new circular queue that contains the retained elements from the input sequence.
 * @example
 *      const numbers = [1, 2, 3, 4];
 *      const circular = toCircularQueue(numbers, 3);
 *      // circular.toArray() === [2, 3, 4]
 *      // circular.capacity === 3
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
    if (typeof capacityOrComparator === 'number') {
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
 * @example
 *      interface Product { id: number; name: string; price: number; }
 *      const products = [
 *          { id: 1, name: 'Apple', price: 0.5 },
 *          { id: 2, name: 'Banana', price: 0.3 },
 *          { id: 3, name: 'Cherry', price: 1.0 }
 *      ];
 *
 *      // Create a dictionary mapping ID to Product Name
 *      const productDict = toDictionary(products, p => p.id, p => p.name);
 *      // productDict.get(2) === 'Banana'
 *      // productDict.size === 3
 *
 *      // Example with KeyValuePair source
 *      const pairs = [
 *          new KeyValuePair('one', 1),
 *          new KeyValuePair('two', 2)
 *      ];
 *      const dictFromPairs = toDictionary(pairs, kv => kv.key, kv => kv.value);
 *      // dictFromPairs.get('one') === 1
 *
 *      // Example causing error due to a duplicate key
 *      const duplicateKeys = [{ key: 'a', val: 1 }, { key: 'a', val: 2 }];
 *      try {
 *          toDictionary(duplicateKeys, item => item.key, item => item.val);
 *      } catch (e) {
 *          console.log(e.message); // Output likely: "An item with the same key has already been added."
 *      }
 */
export const toDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): Dictionary<TKey, TValue> => {
    return from(source).toDictionary(keySelector, valueSelector, valueComparator);
}

/**
 * Creates a new enumerable set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {EnumerableSet<TElement>} An enumerable set that contains the distinct elements from the input sequence.
 * @example
 *      const numbers = [1, 2, 2, 3, 1, 4, 5, 5];
 *      const numberSet = toEnumerableSet(numbers);
 *      // numberSet contains {1, 2, 3, 4, 5}
 *      // numberSet.size === 5
 *      // numberSet.contains(2) === true
 *      // toArray(numberSet) results in [1, 2, 3, 4, 5] (order depends on Set implementation)
 */
export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
}

/**
 * Creates a new immutable circular queue from the elements of the source sequence.
 * The queue keeps only the most recent values up to the specified capacity and discards older entries when the capacity is exceeded.
 * Forces evaluation of the source sequence.
 * @template TElement
 * @param source The source iterable.
 * @param capacity Optional capacity for the resulting queue. If omitted, the queue's default capacity is used.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableCircularQueue<TElement>} A new immutable circular queue that contains the retained elements from the input sequence.
 * @example
 *      const letters = ['a', 'b', 'c', 'd'];
 *      const queue = toImmutableCircularQueue(letters, 3);
 *      // queue.toArray() === ['b', 'c', 'd']
 *      // queue.capacity === 3
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
    if (typeof capacityOrComparator === 'number') {
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
 * @example
 *      interface Product { id: number; name: string; price: number; }
 *      const products = [
 *          { id: 1, name: 'Apple', price: 0.5 },
 *          { id: 2, name: 'Banana', price: 0.3 }
 *      ];
 *
 *      const immutableProductDict = toImmutableDictionary(products, p => p.id, p => p.name);
 *      // immutableProductDict.get(1) === 'Apple'
 *      // immutableProductDict.size === 2
 *      // Attempting immutableProductDict.add(3, 'Cherry') would throw an error or return a new dictionary.
 */
export const toImmutableDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableDictionary<TKey, TValue> => {
    return from(source).toImmutableDictionary(keySelector, valueSelector, valueComparator);
}

/**
 * Creates a new immutable list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableList<TElement>} A new immutable list that contains the elements from the input sequence.
 * @example
 *      const numbers = [1, 2, 3];
 *      const immutableList = toImmutableList(numbers);
 *      // immutableList contains [1, 2, 3]
 *      // immutableList.size === 3
 *      // immutableList.get(0) === 1
 *      // Attempting immutableList.add(4) would throw an error or return a new list.
 */
export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
}

/**
 * Creates a new immutable priority queue from the elements of the sequence.
 * Forces evaluation of the sequence. Elements are ordered based on the comparator.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used.
 * @returns {ImmutablePriorityQueue<TElement>} A new immutable priority queue that contains the elements from the input sequence.
 * @example
 *      const numbers = [5, 1, 3, 4, 2];
 *      // Default comparator assumes min-heap (smaller numbers have higher priority)
 *      const immutableMinQueue = toImmutablePriorityQueue(numbers);
 *      // immutableMinQueue.peek() === 1
 *
 *      // Custom comparator for max-heap
 *      const immutableMaxQueue = toImmutablePriorityQueue(numbers, (a, b) => b - a); // Larger numbers first
 *      // immutableMaxQueue.peek() === 5
 *
 *      // Attempting immutableMinQueue.enqueue(0) would return a new queue.
 */
export const toImmutablePriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutablePriorityQueue<TElement> => {
    return from(source).toImmutablePriorityQueue(comparator);
}

/**
 * Creates a new immutable queue from the elements of the sequence (FIFO).
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableQueue<TElement>} A new immutable queue that contains the elements from the input sequence.
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const immutableQueue = toImmutableQueue(letters);
 *      // immutableQueue.peek() === 'a'
 *      // immutableQueue.size === 3
 *      // Attempting immutableQueue.enqueue('d') would return a new queue.
 */
export const toImmutableQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableQueue<TElement> => {
    return from(source).toImmutableQueue(comparator);
}

/**
 * Creates a new immutable set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {ImmutableSet<TElement>} A new immutable set that contains the distinct elements from the input sequence.
 * @example
 *      const numbers = [1, 2, 2, 3, 1];
 *      const immutableSet = toImmutableSet(numbers);
 *      // immutableSet contains {1, 2, 3}
 *      // immutableSet.size === 3
 *      // immutableSet.contains(2) === true
 *      // Attempting immutableSet.add(4) would return a new set.
 */
export const toImmutableSet = <TElement>(
    source: Iterable<TElement>
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
}

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
 * @example
 *      interface Product { id: number; name: string; }
 *      const products = [
 *          { id: 3, name: 'Cherry' },
 *          { id: 1, name: 'Apple' },
 *          { id: 2, name: 'Banana' }
 *      ];
 *
 *      const immutableSortedDict = toImmutableSortedDictionary(products, p => p.id, p => p.name);
 *      // Keys will be sorted: 1, 2, 3
 *      // immutableSortedDict.get(2) === 'Banana'
 *      // toArray(immutableSortedDict.keys()) === [1, 2, 3]
 *      // Attempting immutableSortedDict.add(4, 'Date') would return a new dictionary.
 */
export const toImmutableSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableSortedDictionary<TKey, TValue> => {
    return from(source).toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
}

/**
 * Creates a new immutable sorted set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence. Elements are sorted.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
 * @returns {ImmutableSortedSet<TElement>} A new immutable sorted set that contains the distinct, sorted elements from the input sequence.
 * @example
 *      const numbers = [5, 1, 3, 1, 4, 2, 5];
 *      const immutableSortedSet = toImmutableSortedSet(numbers);
 *      // immutableSortedSet contains {1, 2, 3, 4, 5} in sorted order
 *      // toArray(immutableSortedSet) === [1, 2, 3, 4, 5]
 *      // immutableSortedSet.contains(3) === true
 *      // immutableSortedSet.size === 5
 *      // Attempting immutableSortedSet.add(0) would return a new set.
 */
export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
}

/**
 * Creates a new immutable stack from the elements of the sequence (LIFO).
 * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {ImmutableStack<TElement>} A new immutable stack that contains the elements from the input sequence.
 * @example
 *      const letters = ['a', 'b', 'c']; // 'c' is the last element
 *      const immutableStack = toImmutableStack(letters);
 *      // immutableStack.peek() === 'c'
 *      // immutableStack.size === 3
 *      // Attempting immutableStack.push('d') would return a new stack.
 */
export const toImmutableStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableStack<TElement> => {
    return from(source).toImmutableStack(comparator);
}

/**
 * Creates a new linked list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {LinkedList<TElement>} A new linked list that contains the elements from the input sequence.
 * @example
 *      const numbers = [10, 20, 30];
 *      const linkedList = toLinkedList(numbers);
 *      // linkedList is a LinkedList instance
 */
export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
}

/**
 * Creates a new list from the elements of the sequence.
 * Forces evaluation of the sequence.
 * @param source The source iterable.
 * @template TElement
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {List<TElement>} A new list that contains the elements from the input sequence.
 * @example
 *      const numbers = range(Enumerable, 1, 3); // Creates IEnumerable [1, 2, 3]
 *      const list = toList(numbers);
 *      // list is a List instance containing [1, 2, 3]
 *      // list.get(0) === 1
 *      // list.size() === 3
 *
 *      // Creates a copy of an existing list
 *      const originalList = ['a', 'b'];
 *      const newList = toList(originalList);
 *      // newList !== originalList (it's a new instance)
 *      // toArray(newList) results in ['a', 'b']
 */
export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
}

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
 * @example
 *      interface Pet { name: string; species: string; age: number; }
 *      const pets = [
 *          { name: 'Fluffy', species: 'Cat', age: 3 },
 *          { name: 'Buddy', species: 'Dog', age: 5 },
 *          { name: 'Whiskers', species: 'Cat', age: 2 },
 *          { name: 'Rex', species: 'Dog', age: 7 }
 *      ];
 *
 *      // Group pet names by species
 *      const lookup = toLookup(pets, pet => pet.species, pet => pet.name);
 *
 *      // lookup.count() === 2 (number of distinct keys: 'Cat', 'Dog')
 *      // lookup.contains('Cat') === true
 *
 *      const catNames = toArray(get(lookup, 'Cat'));
 *      // catNames = ['Fluffy', 'Whiskers']
 *
 *      const dogNames = toArray(get(lookup, 'Dog'));
 *      // dogNames = ['Buddy', 'Rex']
 *
 *      const fishNames = toArray(get(lookup, 'Fish')); // Key not present
 *      // fishNames = []
 */
export const toLookup = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>
): ILookup<TKey, TValue> => {
    return from(source).toLookup(keySelector, valueSelector, keyComparator);
}

/**
 * Converts this enumerable to a JavaScript Map.
 * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
 * @template TKey
 * @template TValue
 * @param source The source iterable.
 * @param keySelector The selector that will be used to select the property that will be used as the key of the map.
 * @param valueSelector The selector that will be used to select the property that will be used as the value of the map.
 * @returns {Map<TKey, TValue>} A Map representation of this sequence.
 * @example
 *      interface Product { id: number; name: string; price: number; }
 *      const products = [
 *          { id: 1, name: 'Apple', price: 0.5 },
 *          { id: 2, name: 'Banana', price: 0.3 },
 *          { id: 3, name: 'Cherry', price: 1.0 }
 *      ];
 *
 *      // Create a Map mapping ID to Product Name
 *      const productMap = toMap(products, p => p.id, p => p.name);
 *      // productMap instanceof Map === true
 *      // productMap.get(2) === 'Banana'
 *      // productMap.size === 3
 *
 *      // Example causing error due to a duplicate key
 *      const duplicateKeys = [{ key: 'a', val: 1 }, { key: 'a', val: 2 }];
 *      try {
 *          toMap(duplicateKeys, item => item.key, item => item.val);
 *      } catch (e) {
 *          console.log(e.message); // Map structure prevents duplicate keys by default. Behavior might depend on the underlying Map implementation if custom logic is used.
 *      }
 */
export const toMap = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Map<TKey, TValue> => {
    return from(source).toMap(keySelector, valueSelector);
}

/**
 * Converts this enumerable to a JavaScript object (Record).
 * Forces evaluation of the sequence. If duplicate keys are encountered, the last value for that key overwrites previous ones.
 * @template TKey
 * @template TValue
 * @param source The source iterable.
 * @param keySelector The selector that will be used to select the property that will be used as the key of the object. Must return string, number, or symbol.
 * @param valueSelector The selector that will be used to select the property that will be used as the value of the object.
 * @returns {Record<TKey, TValue>} An object that contains the elements of the sequence.
 * @example
 *      interface Product { id: string; name: string; price: number; }
 *      const products = [
 *          { id: 'A1', name: 'Apple', price: 0.5 },
 *          { id: 'B2', name: 'Banana', price: 0.3 },
 *          { id: 'C3', name: 'Cherry', price: 1.0 }
 *      ];
 *
 *      // Create an object mapping ID to Product Price
 *      const productObject = toObject(products, p => p.id, p => p.price);
 *      // productObject = { A1: 0.5, B2: 0.3, C3: 1.0 }
 *      // productObject['B2'] === 0.3
 *
 *      // Example with duplicate keys (last one wins)
 *      const duplicateKeys = [
 *          { key: 'a', val: 1 },
 *          { key: 'b', val: 2 },
 *          { key: 'a', val: 3 } // This value for 'a' will overwrite the first one
 *      ];
 *      const objectFromDups = toObject(duplicateKeys, item => item.key, item => item.val);
 *      // objectFromDups = { a: 3, b: 2 }
 */
export const toObject = <TElement, TKey extends string | number | symbol, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Record<TKey, TValue> => {
    return from(source).toObject(keySelector, valueSelector);
}

/**
 * Creates a new priority queue from the elements of the sequence.
 * Forces evaluation of the sequence. Elements are ordered based on the comparator.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used (min-heap).
 * @returns {PriorityQueue<TElement>} A new priority queue that contains the elements from the input sequence.
 * @example
 *      const numbers = [5, 1, 3, 4, 2];
 *      // Default comparator assumes min-heap (smaller numbers have higher priority)
 *      const minQueue = toPriorityQueue(numbers);
 *      // minQueue.peek() === 1
 *      // minQueue.dequeue() === 1
 *      // minQueue.peek() === 2
 *
 *      // Custom comparator for max-heap
 *      const maxQueue = toPriorityQueue(numbers, (a, b) => b - a); // Larger numbers first
 *      // maxQueue.peek() === 5
 *      // maxQueue.dequeue() === 5
 *      // maxQueue.peek() === 4
 */
export const toPriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): PriorityQueue<TElement> => {
    return from(source).toPriorityQueue(comparator);
}

/**
 * Creates a new queue from the elements of the sequence (FIFO).
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {Queue<TElement>} A new queue that contains the elements from the input sequence.
 * @example
 *      const letters = ['a', 'b', 'c'];
 *      const queue = toQueue(letters);
 *      // queue.peek() === 'a'
 *      // queue.size() === 3
 *      // queue.dequeue() === 'a'
 *      // queue.peek() === 'b'
 */
export const toQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Queue<TElement> => {
    return from(source).toQueue(comparator);
}

/**
 * Creates a new JavaScript Set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence.
 * @template TElement
 * @param source The source iterable.
 * @returns {Set<TElement>} A new Set that contains the distinct elements from the input sequence.
 * @example
 *      const numbers = [1, 2, 2, 3, 1, 4, 5, 5];
 *      const numberSet = toSet(numbers);
 *      // numberSet instanceof Set === true
 *      // numberSet contains {1, 2, 3, 4, 5}
 *      // numberSet.size === 5
 *      // numberSet.has(2) === true
 */
export const toSet = <TElement>(
    source: Iterable<TElement>
): Set<TElement> => {
    return from(source).toSet();
}

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
 * @example
 *      interface Product { id: number; name: string; }
 *      const products = [
 *          { id: 3, name: 'Cherry' },
 *          { id: 1, name: 'Apple' },
 *          { id: 2, name: 'Banana' }
 *      ];
 *
 *      const sortedDict = toSortedDictionary(products, p => p.id, p => p.name);
 *      // Keys will be sorted: 1, 2, 3
 *      // sortedDict.get(2) === 'Banana'
 *      // toArray(sortedDict.keys()) results in [1, 2, 3]
 *
 *      // Example causing error due to duplicate key
 *      const duplicateKeys = [{ key: 'a', val: 1 }, { key: 'a', val: 2 }];
 *      try {
 *          toSortedDictionary(duplicateKeys, item => item.key, item => item.val);
 *      } catch (e) {
 *          console.log(e.message); // Output likely: "An item with the same key has already been added."
 *      }
 */
export const toSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): SortedDictionary<TKey, TValue> => {
    return from(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
}

/**
 * Creates a new sorted set from the elements of the sequence. Duplicate elements are ignored.
 * Forces evaluation of the sequence. Elements are sorted.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
 * @returns {SortedSet<TElement>} A new sorted set that contains the distinct, sorted elements from the input sequence.
 * @example
 *      const numbers = [5, 1, 3, 1, 4, 2, 5];
 *      const sortedSet = toSortedSet(numbers);
 *      // sortedSet contains {1, 2, 3, 4, 5} in sorted order
 *      // toArray(sortedSet) results in [1, 2, 3, 4, 5]
 *      // sortedSet.contains(3) === true
 *      // sortedSet.size() === 5
 */
export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
}

/**
 * Creates a new stack from the elements of the sequence (LIFO).
 * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
 * @template TElement
 * @param source The source iterable.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {Stack<TElement>} A new stack that contains the elements from the input sequence.
 * @example
 *      const letters = ['a', 'b', 'c']; // 'c' is the last element
 *      const stack = toStack(letters);
 *      // stack.peek() === 'c'
 *      // stack.size() === 3
 *      // stack.pop() === 'c'
 *      // stack.peek() === 'b'
 */
export const toStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Stack<TElement> => {
    return from(source).toStack(comparator);
}

/**
 * Produces the set union of two sequences by using an equality comparer.
 * The result contains all unique elements from both sequences.
 * @template TElement
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding duplicates. Order is preserved from the original sequences, with elements from the first sequence appearing before elements from the second.
 * @example
 *      const numbers1 = [1, 2, 3, 3];
 *      const numbers2 = [3, 4, 5, 4];
 *      const unionResult = toArray(union(numbers1, numbers2));
 *      // unionResult = [1, 2, 3, 4, 5] (Order: elements from numbers1 first, then unique from numbers2)
 *
 *      // Using custom object comparison
 *      interface Item { id: number; value: string; }
 *      const items1 = [{ id: 1, value: 'A' }, { id: 2, value: 'B' }];
 *      const items2 = [{ id: 2, value: 'B_alt' }, { id: 3, value: 'C' }];
 *      const itemUnion = toArray(union(items1, items2, (a, b) => a.id === b.id));
 *      // itemUnion = [
 *      //   { id: 1, value: 'A' }, // From items1
 *      //   { id: 2, value: 'B' }, // From items1 (id=2 from items2 is considered duplicate by comparator)
 *      //   { id: 3, value: 'C' }  // From items2
 *      // ]
 */
export const union = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(other, comparator);
}

/**
 * Produces the set union of two sequences by using a key selector function.
 * The result contains all elements from both sequences whose selected keys are unique.
 * @template TElement, TKey
 * @param source The source iterable.
 * @param other The iterable sequence whose distinct elements form the second set for the union.
 * @param keySelector The key selector function that will be used to select the key for an element.
 * @param comparator The equality comparator function that will be used to compare two keys. If not specified, the default equality comparer will be used.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding elements with duplicate keys based on the selector. Order is preserved.
 * @example
 *      interface Product { code: string; name: string; }
 *      const store1Products = [
 *          { code: 'A1', name: 'Apple' },
 *          { code: 'B2', name: 'Banana' }
 *      ];
 *      const store2Products = [
 *          { code: 'B2', name: 'Banana V2' }, // Duplicate code 'B2'
 *          { code: 'C3', name: 'Cherry' }
 *      ];
 *
 *      // Union based on product code
 *      const allUniqueProducts = toArray(unionBy(
 *          store1Products,
 *          store2Products,
 *          p => p.code // Select code as the key for comparison
 *      ));
 *      // allUniqueProducts = [
 *      //   { code: 'A1', name: 'Apple' },   // From store1
 *      //   { code: 'B2', name: 'Banana' },  // From store1 (item with code 'B2' from store2 is ignored)
 *      //   { code: 'C3', name: 'Cherry' }    // From store2
 *      // ]
 *
 *      // Example with case-insensitive key comparison
 *      const listA = [{ val: 'a', id: 1 }, { val: 'b', id: 2 }];
 *      const listB = [{ val: 'B', id: 3 }, { val: 'c', id: 4 }]; // 'B' has same key as 'b' case-insensitively
 *      const unionCaseInsensitive = toArray(unionBy(
 *          listA,
 *          listB,
 *          item => item.val,
 *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase() // Case-insensitive comparator
 *      ));
 *      // unionCaseInsensitive = [
 *      //  { val: 'a', id: 1 }, // From listA
 *      //  { val: 'b', id: 2 }, // From listA ('B' from listB is ignored)
 *      //  { val: 'c', id: 4 }  // From listB
 *      // ]
 */
export const unionBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).unionBy(other, keySelector, comparator);
}

/**
 * Filters a sequence of values based on a predicate.
 * @template TElement
 * @param source The source iterable.
 * @param predicate The predicate function (accepting element and index) that will be used to test each element. Return true to keep the element, false to filter it out.
 * @returns {IEnumerable<TElement>} A new enumerable sequence that contains elements from the input sequence that satisfy the condition.
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
 *
 *      // Get only even numbers
 *      const evens = toArray(where(numbers, n => n % 2 === 0));
 *      // evens = [2, 4, 6, 8]
 *
 *      // Get numbers greater than 3 at an odd index
 *      const complexFilter = toArray(where(numbers, (n, index) => n > 3 && index % 2 !== 0));
 *      // Indices: 0, 1, 2, 3, 4, 5, 6, 7
 *      // Elements:1, 2, 3, 4, 5, 6, 7, 8
 *      // Filter checks:
 *      // - index 1 (value 2): 2 > 3 is false
 *      // - index 3 (value 4): 4 > 3 is true, index 3 is odd. Keep 4.
 *      // - index 5 (value 6): 6 > 3 is true, index 5 is odd. Keep 6.
 *      // - index 7 (value 8): 8 > 3 is true, index 7 is odd. Keep 8.
 *      // complexFilter = [4, 6, 8]
 *
 *      interface Product { name: string; price: number; }
 *      const products = [
 *          { name: 'Apple', price: 0.5 },
 *          { name: 'Banana', price: 0.3 },
 *          { name: 'Cherry', price: 1.0 }
 *      ];
 *      const cheapProducts = toArray(where(products, p => p.price < 0.6));
 *      // cheapProducts = [ { name: 'Apple', price: 0.5 }, { name: 'Banana', price: 0.3 } ]
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
 * @example
 *      const numbers = [1, 2, 3, 4, 5, 6];
 *
 *      // Get windows of size 3
 *      const windowsOf3 = toArray(select(
 *          windows(numbers, 3),
 *          window => toArray(window) // Convert each window IEnumerable to an array for clarity
 *      ));
 *      // windowsOf3 = [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
 *
 *      // Get windows of size 1
 *      const windowsOf1 = toArray(select(
 *          windows(numbers, 1),
 *          window => toArray(window)
 *      ));
 *      // windowsOf1 = [[1], [2], [3], [4], [5], [6]]
 *
 *      // Size larger than the list returns an empty sequence
 *      const windowsOf10 = toArray(windows(numbers, 10));
 *      // windowsOf10 = []
 *
 *      // Size equal to the list returns one window
 *      const windowsOf6 = toArray(select(
 *          windows(numbers, 6),
 *          window => toArray(window)
 *      ));
 *      // windowsOf6 = [[1, 2, 3, 4, 5, 6]]
 *
 *      try {
 *          windows(numbers, 0); // Throws InvalidArgumentException
 *      } catch (e) {
 *          console.log(e.message); // Output: Size must be greater than 0.
 *      }
 */
export const windows = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).windows(size);
}

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
 * @example
 *      const numbers = [1, 2, 3];
 *      const letters = ['A', 'B', 'C'];
 *
 *      // Combine numbers and letters into strings using the zipper
 *      const combinedStrings = toArray(zip(
 *          numbers,
 *          letters,
 *          (num, char) => `${num}-${char}` // Zipper function
 *      ));
 *      // combinedStrings = ["1-A", "2-B", "3-C"]
 *
 *      // Sum corresponding elements using the zipper
 *      const listA = [10, 20, 30];
 *      const listB = [5, 15, 25, 35]; // listB is longer
 *      const sums = toArray(zip(
 *          listA,
 *          listB,
 *          (a, b) => a + b // Zipper function
 *      ));
 *      // sums = [15, 35, 55] (Length limited by the shorter listA)
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
}



