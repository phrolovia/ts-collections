import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    CircularLinkedList,
    Dictionary,
    EnumerableSet,
    IGroup,
    ILookup,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
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
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";

export interface IEnumerable<TElement> extends Iterable<TElement> {

    /**
     * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
     * If the resultSelector function is specified, it will be used to select the result value.
     * @template TAccumulate
     * @template TResult
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, the first element of the sequence will be used as the seed value.
     * @param resultSelector The function that will be used to select the result value.
     * @returns {TAccumulate|TResult} The final accumulator value.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const sum = numbers.aggregate((acc, current) => acc + current); // sum = 15
     *      const productWithSeed = numbers.aggregate((acc, current) => acc * current, 10); // productWithSeed = 1200 (10 * 1 * 2 * 3 * 4 * 5)
     *      const sumAsString = numbers.aggregate(
     *          (acc, current) => acc + current, // Accumulator
     *          0,                             // Seed
     *          (finalResult) => `Sum: ${finalResult}` // Result selector
     *      ); // sumAsString = "Sum: 15"
     */
    aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;

    /**
     * Applies an accumulator function over the sequence, grouping the results by a key from the key selector function.
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param seedSelector Initial accumulator value or a function that will be used to select the initial accumulator value.
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @example
     *      interface Product { category: string; price: number; }
     *      const products = new List<Product>([
     *           { category: 'Electronics', price: 700 },
     *           { category: 'Books', price: 120 },
     *           { category: 'Electronics', price: 200 },
     *           { category: 'Books', price: 90 }
     *      ]);
     *      const totalValuePerCategory = products.aggregateBy(
     *           p => p.category, // keySelector: group by category
     *           0,               // seedSelector: start sum at 0 for each category
     *           (sum, p) => sum + p.price // accumulator: add product price to sum
     *      ).toArray();
     *      // totalValuePerCategory: [{ key: 'Electronics', value: 900 }, { key: 'Books', value: 210 }]
     */
    aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>>;

    /**
     * Determines if all elements of the sequence satisfy the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {boolean} true if all elements of the sequence satisfy the specified predicate; otherwise, false.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const allPositive = numbers.all(n => n > 0); // allPositive = true
     *      const allEven = numbers.all(n => n % 2 === 0); // allEven = false
     */
    all(predicate: Predicate<TElement>): boolean;

    /**
     * Determines if any element of the sequence satisfies the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * If not specified, it will return true if the sequence has elements, otherwise false.
     * @returns {boolean} true if any element of the sequence satisfies the specified predicate; otherwise, false.
     * @example
     *      const numbers = new List([1, 2, -3, 4, 5]);
     *      const hasNegative = numbers.any(n => n < 0); // hasNegative = true
     *      const hasGreaterThanTen = numbers.any(n => n > 10); // hasGreaterThanTen = false
     *      const isEmpty = new List<number>().any(); // isEmpty = false
     *      const isNotEmpty = numbers.any(); // isNotEmpty = true
     */
    any(predicate?: Predicate<TElement>): boolean;

    /**
     * Appends the specified element to the end of the sequence.
     * @template TElement
     * @param element The element that will be appended to the end of the sequence
     * @returns {IEnumerable<TElement>} A new enumerable sequence that ends with the specified element.
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const appended = numbers.append(4).toArray(); // appended = [1, 2, 3, 4]
     */
    append(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
     * @param selector The selector function that will select a numeric value from the sequence elements.
     * @returns {number} The average of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const avg = numbers.average(); // avg = 3
     *
     *      interface Item { value: number; }
     *      const items = new List<Item>([{ value: 10 }, { value: 20 }, { value: 60 }]);
     *      const avgValue = items.average(item => item.value); // avgValue = 30
     */
    average(selector?: Selector<TElement, number>): number;

    /**
     * Casts the elements of the sequence to the specified type.
     * @template TResult
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
     * @example
     *      const mixedList = new List([1, 'two', 3, 'four', 5]);
     *      const numbersOnly = mixedList
     *          .where(item => typeof item === 'number')
     *          .cast<number>();
     *      // numbersOnly = [1, 3, 5]
     *
     *      // Note: Cast doesn't perform type conversion, only type assertion.
     *      // If an element cannot be cast, it may lead to runtime errors later.
     *      // Example of a potential issue (if not pre-filtered):
     *      // const potentialError = mixedList.cast<number>();
     *      // Iterating potentialError might throw errors when 'two' or 'four' are accessed as numbers.
     */
    cast<TResult>(): IEnumerable<TResult>;

    /**
     * Splits the elements of the sequence into chunks of size at most the specified size.
     * @template TElement
     * @param size The maximum size of each chunk.
     * @return {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are chunks of the original sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6, 7, 8]);
     *      const chunks = numbers.chunk(3).select(chunk => chunk.toArray()).toArray();
     *      // chunks = [[1, 2, 3], [4, 5, 6], [7, 8]]
     */
    chunk(size: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Returns all combinations of the elements of the sequence.
     * The outputs will not include duplicate combinations.
     * @template TElement
     * @param size The size of the combinations. If not specified, it will return all possible combinations.
     * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence whose elements are combinations of the source sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const combinationsOfTwo = letters.combinations(2)
     *          .select(c => c.toArray())
     *          .toArray();
     *      // combinationsOfTwo = [['a', 'b'], ['a', 'c'], ['b', 'c']]
     *
     *      const allCombinations = letters.combinations()
     *          .select(c => c.toArray())
     *          .toArray();
     *      // allCombinations = [['a'], ['b'], ['c'], ['a', 'b'], ['a', 'c'], ['b', 'c'], ['a', 'b', 'c']]
     */
    combinations(size?: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Concatenates two sequences.
     * @template TElement
     * @param iterable The iterable sequence that will be concatenated to the first sequence.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements of both sequences.
     * @example
     *      const list1 = new List([1, 2]);
     *      const list2 = new List([3, 4]);
     *      const concatenated = list1.concat(list2).toArray();
     *      // concatenated = [1, 2, 3, 4]
     */
    concat(iterable: Iterable<TElement>): IEnumerable<TElement>;

    /**
     * Determines whether the sequence contains the specified element.
     * @param element The element whose existence will be checked.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, the default equality comparison is used.
     * @returns {boolean} true if the sequence contains the specified element; otherwise, false.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const hasThree = numbers.contains(3);
     *      // hasThree = true
     *      const hasTen = numbers.contains(10);
     *      // hasTen = false
     *
     *      // Using a custom comparator for objects
     *      interface Person { id: number; name: string; }
     *      const people = new List<Person>([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
     *      const bob = { id: 2, name: 'Bob' };
     *      const hasBobById = people.contains(bob, (p1, p2) => p1.id === p2.id);
     *      // hasBobById = true
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns the number of elements in the sequence.
     *
     * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {number} The number of elements in the sequence.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6]);
     *      const totalCount = numbers.count();
     *      // totalCount = 6
     *
     *      const evenCount = numbers.count(n => n % 2 === 0);
     *      // evenCount = 3
     */
    count(predicate?: Predicate<TElement>): number;

    /**
     * Returns an enumerable sequence of key value pair objects that contain the key and the number of occurrences of the key in the source sequence.
     * @template TKey
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param comparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<KeyValuePair<TKey, number>>} A new enumerable sequence that contains key value pair objects.
     * @example
     *      const fruits = new List(['apple', 'banana', 'apple', 'orange', 'banana', 'apple']);
     *      const fruitCounts = fruits.countBy(fruit => fruit).toArray();
     *      // fruitCounts = [
     *      //   { key: 'apple', value: 3 },
     *      //   { key: 'banana', value: 2 },
     *      //   { key: 'orange', value: 1 }
     *      // ]
     *
     *      // Example with objects and key selector
     *      interface Item { type: string; }
     *      const items = new List<Item>([{ type: 'A' }, { type: 'B' }, { type: 'A' }]);
     *      const typeCounts = items.countBy(item => item.type).toArray();
     *      // typeCounts = [ { key: 'A', value: 2 }, { key: 'B', value: 1 } ]
     */
    countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>>;

    /**
     * Returns a new enumerable sequence that repeats the elements of the source sequence a specified number of times.
     * If the count is not specified, the sequence will be repeated indefinitely.
     * If the sequence is empty, an error will be thrown.
     * @template TElement
     * @param count The number of times the source sequence will be repeated.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that repeats the elements of the source sequence.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      const pattern = new List([1, 2]);
     *      const repeatedFinite = pattern.cycle(3).toArray();
     *      // repeatedFinite = [1, 2, 1, 2, 1, 2]
     *
     *      // Infinite cycle (use with caution, typically with take)
     *      // const repeatedInfinite = pattern.cycle();
     *      // const firstTen = repeatedInfinite.take(10).toArray();
     *      // firstTen = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2]
     *
     *      // Throws error if the source is empty
     *      // new List<number>().cycle(); // Throws NoElementsException
     */
    cycle(count?: number): IEnumerable<TElement>;

    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
     * @template TElement
     * @param value The value to return if the sequence is empty. Defaults to null if not provided.
     * @returns {IEnumerable<TElement | null>} The specified sequence or the specified value in a singleton collection if the sequence is empty.
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const resultNotEmpty = numbers.defaultIfEmpty(0).toArray();
     *      // resultNotEmpty = [1, 2, 3]
     *
     *      const emptyList = new List<number>();
     *      const resultEmptyWithDefault = emptyList.defaultIfEmpty(0).toArray();
     *      // resultEmptyWithDefault = [0]
     *
     *      const resultEmptyNull = emptyList.defaultIfEmpty().toArray(); // No value specified, defaults to null
     *      // resultEmptyNull = [null]
     */
    defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null>;

    /**
     * Returns distinct elements from the sequence.
     * @template TElement
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
     * @example
     *      const numbers = new List([1, 2, 2, 3, 1, 4, 5, 5]);
     *      const distinctNumbers = numbers.distinct().toArray();
     *      // distinctNumbers = [1, 2, 3, 4, 5]
     *
     *      // Using a custom comparator for objects (compares based on id)
     *      interface Item { id: number; value: string; }
     *      const items = new List<Item>([
     *          { id: 1, value: 'A' },
     *          { id: 2, value: 'B' },
     *          { id: 1, value: 'C' }
     *      ]);
     *      const distinctItemsById = items.distinct((a, b) => a.id === b.id).toArray();
     *      // distinctItemsById = [{ id: 1, value: 'A' }, { id: 2, value: 'B' }]
     */
    distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement>;

    /**
     * Returns distinct elements from the sequence based on a key selector.
     * @template TElement, TKey
     * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains distinct elements from the source sequence.
     * @example
     *      interface Product { category: string; name: string; }
     *      const products = new List<Product>([
     *          { category: 'Electronics', name: 'Laptop' },
     *          { category: 'Books', name: 'TypeScript Guide' },
     *          { category: 'Electronics', name: 'Mouse' },
     *          { category: 'Books', name: 'Another Book' }
     *      ]);
     *
     *      // Get one product from each distinct category
     *      const distinctByCategory = products.distinctBy(p => p.category).toArray();
     *      // distinctByCategory might be:
     *      // [
     *      //   { category: 'Electronics', name: 'Laptop' },
     *      //   { category: 'Books', name: 'TypeScript Guide' }
     *      // ]
     *      // (The specific element kept from duplicates is the first one encountered)
     *
     *      // Using a custom key comparator (case-insensitive category)
     *      const productsMixedCase = new List<Product>([
     *          { category: 'Electronics', name: 'Laptop' },
     *          { category: 'electronics', name: 'Keyboard' },
     *          { category: 'Books', name: 'Guide' }
     *      ]);
     *      const distinctCaseInsensitive = productsMixedCase.distinctBy(
     *          p => p.category,
     *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase()
     *      ).toArray();
     *      // distinctCaseInsensitive might be:
     *      // [
     *      //   { category: 'Electronics', name: 'Laptop' },
     *      //   { category: 'Books', name: 'Guide' }
     *      // ]
     */
    distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Returns the element at the specified index in the sequence.
     * @template TElement
     * @param index The index of the element that will be returned.
     * @returns {TElement} The element at the specified index in the sequence.
     * @throws {IndexOutOfBoundsException} If index is less than 0 or greater than or equal to the number of elements in the sequence.
     * @example
     *      const letters = new List(['a', 'b', 'c', 'd']);
     *      const secondLetter = letters.elementAt(1);
     *      // secondLetter = 'b'
     *
     *      try {
     *          letters.elementAt(4); // Throws IndexOutOfBoundsException
     *      } catch (e) {
     *          console.log(e.message); // Output: Index was outside the bounds of the sequence.
     *      }
     *
     *      try {
     *          letters.elementAt(-1); // Throws IndexOutOfBoundsException
     *      } catch (e) {
     *          console.log(e.message); // Output: Index was outside the bounds of the sequence.
     *      }
     */
    elementAt(index: number): TElement;

    /**
     * Returns the element at the specified index in the sequence or a default value if the index is out of range.
     * @template TElement
     * @param index The index of the element that will be returned.
     * @returns {TElement|null} The element at the specified index in the sequence or null if the index is out of range.
     * @example
     *      const letters = new List(['a', 'b', 'c', 'd']);
     *      const secondLetter = letters.elementAtOrDefault(1);
     *      // secondLetter = 'b'
     *
     *      const fifthLetter = letters.elementAtOrDefault(4);
     *      // fifthLetter = null
     *
     *      const negativeIndex = letters.elementAtOrDefault(-1);
     *      // negativeIndex = null
     */
    elementAtOrDefault(index: number): TElement | null;

    /**
     * Produces the set difference of two sequences by using the specified equality comparer or order comparer to compare values.
     * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
     * @param comparator The comparator function that will be used for item comparison. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set difference of the two sequences.
     * @example
     *      const numbers1 = new List([1, 2, 3, 4, 5]);
     *      const numbers2 = new List([3, 5, 6, 7]);
     *      const difference = numbers1.except(numbers2).toArray();
     *      // difference = [1, 2, 4]
     *
     *      // Using custom object comparison
     *      interface Item { id: number; }
     *      const items1 = new List<Item>([{ id: 1 }, { id: 2 }, { id: 3 }]);
     *      const items2 = new List<Item>([{ id: 2 }, { id: 4 }]);
     *      const itemDifference = items1.except(items2, (a, b) => a.id === b.id).toArray();
     *      // itemDifference = [{ id: 1 }, { id: 3 }]
     */
    except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement>;

    /**
     * Produces the set difference of two sequences by using the specified key selector function to compare elements.
     * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
     * @template TElement, TKey
     * @typeParam TElement The type of the elements in the source sequence.
     * @typeParam TKey The type of the key that will be used for comparison.
     * @param iterable The iterable sequence whose distinct elements that also appear in the first sequence will be removed.
     * @param keySelector The key selector function that will be used for selecting a key which will be used for comparison.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set difference of the two sequences.
     * @example
     *      interface Product { code: string; name: string; }
     *      const store1Products = new List<Product>([
     *          { code: 'A1', name: 'Apple' },
     *          { code: 'B2', name: 'Banana' },
     *          { code: 'C3', name: 'Cherry' }
     *      ]);
     *      const store2Products = new List<Product>([
     *          { code: 'B2', name: 'Banana' }, // Same code as store1
     *          { code: 'D4', name: 'Date' }
     *      ]);
     *
     *      // Find products in store1 whose codes are not in store2
     *      const uniqueToStore1 = store1Products.exceptBy(
     *          store2Products,
     *          p => p.code // Compare based on the 'code' property
     *      ).toArray();
     *      // uniqueToStore1 = [ { code: 'A1', name: 'Apple' }, { code: 'C3', name: 'Cherry' } ]
     *
     *      // Example with case-insensitive key comparison
     *      const listA = new List([{ val: 'a' }, { val: 'b' }]);
     *      const listB = new List([{ val: 'B' }, { val: 'c' }]);
     *      const diffCaseInsensitive = listA.exceptBy(
     *          listB,
     *          item => item.val,
     *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase() // Case-insensitive comparator
     *      ).toArray();
     *      // diffCaseInsensitive = [ { val: 'a' } ]
     */
    exceptBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement>;

    /**
     * Gets the first element of the sequence.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @returns {TElement} The first element of the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @throws {NoMatchingElementException} If no element satisfies the condition.
     * @example
     *      const numbers = new List([10, 20, 30, 40]);
     *      const firstElement = numbers.first();
     *      // firstElement = 10
     *
     *      const firstGreaterThan25 = numbers.first(n => n > 25);
     *      // firstGreaterThan25 = 30
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.first(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     *
     *      try {
     *          numbers.first(n => n > 50); // Throws NoMatchingElementException
     *      } catch (e) {
     *          console.log(e.message); // Output: No element satisfies the condition.
     *      }
     */
    first(predicate?: Predicate<TElement>): TElement;

    /**
     * Gets the first element of the sequence or a default value if the no element satisfies the condition.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the first element of the sequence will be returned.
     * @returns {TElement|null} The first element of the sequence or null if no element satisfies the condition or the sequence is empty.
     * @example
     *      const numbers = new List([10, 20, 30, 40]);
     *      const firstElement = numbers.firstOrDefault();
     *      // firstElement = 10
     *
     *      const firstGreaterThan25 = numbers.firstOrDefault(n => n > 25);
     *      // firstGreaterThan25 = 30
     *
     *      const firstGreaterThan50 = numbers.firstOrDefault(n => n > 50);
     *      // firstGreaterThan50 = null
     *
     *      const emptyList = new List<number>();
     *      const firstFromEmpty = emptyList.firstOrDefault();
     *      // firstFromEmpty = null
     */
    firstOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Iterates over the sequence and performs the specified action on each element.
     * @param action The action function that will be performed on each element. The second parameter of the action is the index.
     * @example
     *      const names = new List(['Alice', 'Bob', 'Charlie']);
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
    forEach(action: IndexedAction<TElement>): void;

    /**
     * Groups the elements of the sequence according to a specified key selector function.
     * @template TKey, TElement
     * @param keySelector The key selector function that will be used for grouping.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<IGroup<TKey, TElement>>} A new enumerable sequence whose elements are groups that contain the elements of the source sequence.
     * @example
     *      interface Pet { name: string; species: string; age: number; }
     *      const pets = new List<Pet>([
     *          { name: 'Fluffy', species: 'Cat', age: 3 },
     *          { name: 'Buddy', species: 'Dog', age: 5 },
     *          { name: 'Whiskers', species: 'Cat', age: 2 },
     *          { name: 'Rex', species: 'Dog', age: 7 }
     *      ]);
     *
     *      // Group pets by species
     *      const groupsBySpecies = pets.groupBy(pet => pet.species).toArray();
     *      // groupsBySpecies will contain IGroup objects. Example structure:
     *      // [
     *      //   { key: 'Cat', source: Enumerable containing Fluffy and Whiskers },
     *      //   { key: 'Dog', source: Enumerable containing Buddy and Rex }
     *      // ]
     *
     *      // To get results as arrays:
     *      const speciesArrays = pets
     *          .groupBy(pet => pet.species)
     *          .select(group => ({ species: group.key, pets: group.source.toArray() }))
     *          .toArray();
     *      // speciesArrays = [
     *      //   { species: 'Cat', pets: [{ name: 'Fluffy', ... }, { name: 'Whiskers', ... }] },
     *      //   { species: 'Dog', pets: [{ name: 'Buddy', ... }, { name: 'Rex', ... }] }
     *      // ]
     *
     *      // Using a custom comparator (e.g., grouping ages into ranges)
     *      const ageGroups = pets.groupBy(
     *          pet => pet.age, // Temporary key selector
     *          (age1, age2) => Math.floor(age1 / 3) === Math.floor(age2 / 3) // Comparator: group by age range (0-2, 3-5, 6-8, etc.)
     *      )
     *          .select(group => ({ ageRangeKey: group.key, pets: group.source.toArray() })) // Note: group.key will be the first age encountered in that range
     *          .toArray();
     *      // ageGroups might look like:
     *      // [
     *      //   { ageRangeKey: 3, pets: [Fluffy, Whiskers] }, // Ages 3 and 2 fall in the same range (key is 3 as it was encountered first)
     *      //   { ageRangeKey: 5, pets: [Buddy, Rex] }      // Ages 5 and 7 fall in the same range (key is 5)
     *      // ]
     */
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>>;

    /**
     * Correlates the elements of two sequences based on equality of keys and groups the results.
     * The result contains elements from the first (outer) sequence and a collection of matching elements from the second (inner) sequence.
     * @template TInner, TKey, TResult, TElement
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
     *      const departments = new List<Department>([
     *          { id: 1, name: 'HR' },
     *          { id: 2, name: 'Engineering' },
     *          { id: 3, name: 'Sales' }
     *      ]);
     *
     *      const employees = new List<Employee>([
     *          { name: 'Alice', deptId: 2 },
     *          { name: 'Bob', deptId: 1 },
     *          { name: 'Charlie', deptId: 2 },
     *          { name: 'David', deptId: 4 } // Belongs to a non-listed department
     *      ]);
     *
     *      // Group employees by department
     *      const departmentEmployees = departments.groupJoin(
     *          employees,
     *          dept => dept.id, // Outer key selector (department ID)
     *          emp => emp.deptId, // Inner key selector (employee department ID)
     *          (dept, emps) => ({ // Result selector
     *              departmentName: dept.name,
     *              employees: emps.select(e => e.name).toArray() // Project employee names
     *          })
     *      ).toArray();
     *
     *      // departmentEmployees = [
     *      //   { departmentName: 'HR', employees: ['Bob'] },
     *      //   { departmentName: 'Engineering', employees: ['Alice', 'Charlie'] },
     *      //   { departmentName: 'Sales', employees: [] } // Sales has no matching employees
     *      // ]
     *      // Note: Employees in non-listed departments (David) are ignored as they don't match an outer key.
     */
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                                     resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;

    /**
     * Returns an enumerable of tuples, each containing the index and the element from the source sequence.
     * @template TElement
     * @returns {IEnumerable<[number, TElement]>} A new enumerable sequence whose elements are tuples of the index and the element.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const indexedLetters = letters.index().toArray();
     *      // indexedLetters = [[0, 'a'], [1, 'b'], [2, 'c']]
     */
    index(): IEnumerable<[number, TElement]>;

    /**
     * Produces the set intersection of two sequences by using the specified equality comparer or order comparer to compare values.
     * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
     * @param comparator The comparator function that will be used for item comparison. If not provided, a default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set intersection of the two sequences.
     * @throws {Error} If the iterable is null or undefined.
     * @example
     *      const numbers1 = new List([1, 2, 3, 4, 5, 5]); // Source has duplicates
     *      const numbers2 = new List([3, 5, 6, 7, 5]); // Other has duplicates
     *      const intersection = numbers1.intersect(numbers2).toArray();
     *      // intersection = [3, 5] (Order matches source, duplicates removed)
     *
     *      // Using custom object comparison
     *      interface Item { id: number; value: string; }
     *      const items1 = new List<Item>([{ id: 1, value: 'A' }, { id: 2, value: 'B' }]);
     *      const items2 = new List<Item>([{ id: 2, value: 'Different B' }, { id: 3, value: 'C' }]);
     *      const itemIntersection = items1.intersect(items2, (a, b) => a.id === b.id).toArray();
     *      // itemIntersection = [{ id: 2, value: 'B' }] (Keeps the element from the first list)
     */
    intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement>;

    /**
     * Produces the set intersection of two sequences by using the specified key selector function to compare elements.
     * If the elements of the iterable can be sorted, it is advised to use an order comparator for better performance.
     * @template TElement, TKey
     * @typeParam TElement The type of the elements in the source sequence.
     * @typeParam TKey The type of the key that will be used for comparison.
     * @param iterable The iterable sequence whose distinct elements that also appear in the first sequence will be returned.
     * @param keySelector The key selector function that will be used for selecting a key which will be used for comparison.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, the default equality comparison is used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are the set intersection of the two sequences.
     * @example
     *      interface Product { code: string; name: string; }
     *      const store1Products = new List<Product>([
     *          { code: 'A1', name: 'Apple' },
     *          { code: 'B2', name: 'Banana' },
     *          { code: 'C3', name: 'Cherry' }
     *      ]);
     *      const store2Products = new List<Product>([
     *          { code: 'B2', name: 'Banana V2' }, // Same code as store1
     *          { code: 'D4', name: 'Date' }
     *      ]);
     *
     *      // Find products in store1 whose codes also exist in store2
     *      const commonProducts = store1Products.intersectBy(
     *          store2Products,
     *          p => p.code // Compare based on the 'code' property
     *      ).toArray();
     *      // commonProducts = [ { code: 'B2', name: 'Banana' } ] (Takes the element from store1)
     *
     *      // Example with case-insensitive key comparison
     *      const listA = new List([{ val: 'a' }, { val: 'b' }]);
     *      const listB = new List([{ val: 'B' }, { val: 'c' }]);
     *      const intersectCaseInsensitive = listA.intersectBy(
     *          listB,
     *          item => item.val,
     *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase() // Case-insensitive comparator
     *      ).toArray();
     *      // intersectCaseInsensitive = [ { val: 'b' } ] (Keeps 'b' from listA as it matches 'B')
     */
    intersectBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement>;

    /**
     * Intersperses a specified element between each element of the sequence.
     * @template TElement, TSeparator
     * @param separator The element that will be interspersed between each element of the sequence.
     * @returns {IEnumerable<TElement|TSeparator>} A new enumerable sequence whose elements are the elements of the source sequence interspersed with the specified element.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const interspersedLetters = letters.intersperse('-').toArray();
     *      // interspersedLetters = ['a', '-', 'b', '-', 'c']
     *
     *      const numbers = new List([1, 2, 3]);
     *      const interspersedNumbers = numbers.intersperse(0).toArray();
     *      // interspersedNumbers = [1, 0, 2, 0, 3]
     *
     *      const emptyList = new List<string>();
     *      const interspersedEmpty = emptyList.intersperse('-').toArray();
     *      // interspersedEmpty = []
     *
     *      const singleItemList = new List(['a']);
     *      const interspersedSingle = singleItemList.intersperse('-').toArray();
     *      // interspersedSingle = ['a']
     */
    intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator>;

    /**
     * Correlates the elements of two sequences based on equality of keys.
     * @template TInner, TKey, TResult, TElement
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
     *      const departments = new List<Department>([
     *          { id: 1, name: 'HR', location: 'Building A' },
     *          { id: 2, name: 'Engineering', location: 'Building B' },
     *          { id: 3, name: 'Marketing', location: 'Building A' } // No employees here
     *      ]);
     *
     *      const employees = new List<Employee>([
     *          { name: 'Alice', deptId: 2, role: 'Developer' },
     *          { name: 'Bob', deptId: 1, role: 'Manager' },
     *          { name: 'Charlie', deptId: 2, role: 'Tester' },
     *          { name: 'David', deptId: 4, role: 'Intern' } // Department 4 not in departments list
     *      ]);
     *
     *      // Inner Join (default: leftJoin = false)
     *      const innerJoinResult = departments.join(
     *          employees,
     *          dept => dept.id,           // Outer key: department ID
     *          emp => emp.deptId,         // Inner key: employee department ID
     *          (dept, emp) => ({          // Result selector
     *              employeeName: emp.name,
     *              departmentName: dept.name
     *          })
     *      ).toArray();
     *      // innerJoinResult = [
     *      //   { employeeName: 'Bob', departmentName: 'HR' },
     *      //   { employeeName: 'Alice', departmentName: 'Engineering' },
     *      //   { employeeName: 'Charlie', departmentName: 'Engineering' }
     *      // ]
     *      // Note: Marketing dept and David (dept 4) are excluded.
     *
     *      // Left Join (leftJoin = true)
     *      const leftJoinResult = departments.join(
     *          employees,
     *          dept => dept.id,
     *          emp => emp.deptId,
     *          (dept, emp) => ({
     *              departmentName: dept.name,
     *              employeeName: emp?.name ?? 'N/A' // Use nullish coalescing for unmatched employees
     *          }),
     *          Comparators.equalityComparator, // Default comparator can be explicit or omitted
     *          true                       // Set leftJoin to true
     *      ).toArray();
     *      // leftJoinResult = [
     *      //   { departmentName: 'HR', employeeName: 'Bob' },
     *      //   { departmentName: 'Engineering', employeeName: 'Alice' },
     *      //   { departmentName: 'Engineering', employeeName: 'Charlie' },
     *      //   { departmentName: 'Marketing', employeeName: 'N/A' } // Marketing included, no matching employee
     *      // ]
     *      // Note: David (dept 4) is still excluded as the join starts from departments.
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
     * @example
     *      const numbers = new List([10, 20, 30, 25, 40]);
     *      const lastElement = numbers.last();
     *      // lastElement = 40
     *
     *      const lastLessThan30 = numbers.last(n => n < 30);
     *      // lastLessThan30 = 25
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.last(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     *
     *      try {
     *          numbers.last(n => n > 50); // Throws NoMatchingElementException
     *      } catch (e) {
     *          console.log(e.message); // Output: No element satisfies the condition.
     *      }
     */
    last(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the last element of the sequence or a default value if the no element satisfies the condition.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, the last element of the sequence will be returned.
     * @returns {TElement|null} The last element of the sequence or null if the sequence is empty or no element satisfies the condition.
     * @example
     *      const numbers = new List([10, 20, 30, 25, 40]);
     *      const lastElement = numbers.lastOrDefault();
     *      // lastElement = 40
     *
     *      const lastLessThan30 = numbers.lastOrDefault(n => n < 30);
     *      // lastLessThan30 = 25
     *
     *      const lastGreaterThan50 = numbers.lastOrDefault(n => n > 50);
     *      // lastGreaterThan50 = null
     *
     *      const emptyList = new List<number>();
     *      const lastFromEmpty = emptyList.lastOrDefault();
     *      // lastFromEmpty = null
     */
    lastOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Returns the maximum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @returns {number} The maximum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      const numbers = new List([10, 50, 20, 45, 30]);
     *      const maxNumber = numbers.max();
     *      // maxNumber = 50
     *
     *      interface Item { value: number; }
     *      const items = new List<Item>([{ value: 100 }, { value: 50 }, { value: 200 }]);
     *      const maxValue = items.max(item => item.value);
     *      // maxValue = 200
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.max(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     */
    max(selector?: Selector<TElement, number>): number;

    /**
     * Returns the element with the maximum value that is obtained by applying the key selector function to each element in the sequence.
     * @template TElement
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
     * @returns {TElement} The element with the maximum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      interface Product { name: string; price: number; }
     *      const products = new List<Product>([
     *          { name: 'Laptop', price: 1200 },
     *          { name: 'Mouse', price: 25 },
     *          { name: 'Keyboard', price: 75 },
     *          { name: 'Monitor', price: 300 }
     *      ]);
     *
     *      // Find the most expensive product
     *      const mostExpensive = products.maxBy(p => p.price);
     *      // mostExpensive = { name: 'Laptop', price: 1200 }
     *
     *      // Using a custom comparator (e.g., longest name)
     *      const productWithLongestName = products.maxBy(
     *          p => p.name.length // Key is the length of the name
     *      );
     *      // productWithLongestName = { name: 'Keyboard', price: 75 }
     *
     *      const emptyList = new List<Product>();
     *      try {
     *          emptyList.maxBy(p => p.price); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     */
    maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement;

    /**
     * Returns the minimum value in the sequence.
     * @param selector The selector function that will be used to select the value to compare. If not specified, the value itself will be used.
     * @returns {number} The minimum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      const numbers = new List([10, 50, 20, 45, 30]);
     *      const minNumber = numbers.min();
     *      // minNumber = 10
     *
     *      interface Item { value: number; }
     *      const items = new List<Item>([{ value: 100 }, { value: 50 }, { value: 200 }]);
     *      const minValue = items.min(item => item.value);
     *      // minValue = 50
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.min(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     */
    min(selector?: Selector<TElement, number>): number;

    /**
     * Returns the element with the minimum value that is obtained by applying the key selector function to each element in the sequence.
     * @template TElement
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
     * @returns {TElement} The element with the minimum value in the sequence.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      interface Product { name: string; price: number; }
     *      const products = new List<Product>([
     *          { name: 'Laptop', price: 1200 },
     *          { name: 'Mouse', price: 25 },
     *          { name: 'Keyboard', price: 75 },
     *          { name: 'Monitor', price: 300 }
     *      ]);
     *
     *      // Find the cheapest product
     *      const cheapest = products.minBy(p => p.price);
     *      // cheapest = { name: 'Mouse', price: 25 }
     *
     *      // Using a custom comparator (e.g., the shortest name)
     *      const productWithShortestName = products.minBy(
     *          p => p.name.length // Key is the length of the name
     *      );
     *      // productWithShortestName = { name: 'Mouse', price: 25 }
     *
     *      const emptyList = new List<Product>();
     *      try {
     *          emptyList.minBy(p => p.price); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     */
    minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement;

    /**
     * Determines whether no elements of the sequence satisfy the specified predicate.
     * If no predicate is specified, it returns true if the sequence is empty, and false otherwise.
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {boolean} true if no elements satisfy the predicate, or if the sequence is empty and no predicate is provided; otherwise, false.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *
     *      // Check if none are negative
     *      const noneNegative = numbers.none(n => n < 0);
     *      // noneNegative = true
     *
     *      // Check if none are greater than 10
     *      const noneGreaterThan10 = numbers.none(n => n > 10);
     *      // noneGreaterThan10 = true
     *
     *      // Check if none are even (this will be false)
     *      const noneEven = numbers.none(n => n % 2 === 0);
     *      // noneEven = false
     *
     *      // Check if an empty list has no elements (no predicate)
     *      const emptyList = new List<number>();
     *      const emptyNone = emptyList.none();
     *      // emptyNone = true
     *
     *      // Check if a non-empty list has no elements (no predicate)
     *      const nonEmptyNone = numbers.none();
     *      // nonEmptyNone = false
     */
    none(predicate?: Predicate<TElement>): boolean;

    /**
     * Returns the elements that are of the specified type.
     * The type can be specified either as a constructor function or as a string representing a primitive type.
     * @template TResult
     * @param type The type to filter the elements of the sequence with (e.g., 'string', 'number', Boolean, Date, MyCustomClass).
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are of the specified type.
     * @example
     *      // --- Basic Usage with Primitives (string type name) ---
     *      const mixedList = new List<any>([1, 'apple', true, 2.5, 'banana', false, null, undefined]);
     *
     *      const stringsOnly = mixedList.ofType('string').toArray();
     *      // stringsOnly = ['apple', 'banana']
     *
     *      const numbersOnly = mixedList.ofType('number').toArray();
     *      // numbersOnly = [1, 2.5]
     *
     *      const booleansOnly = mixedList.ofType('boolean').toArray();
     *      // booleansOnly = [true, false]
     *
     *      // Note: 'object' will match non-null objects, including arrays, dates, custom objects, etc.
     *      const objectsOnly = mixedList.ofType('object').toArray();
     *      // objectsOnly = [] (in this specific list, as null is considered object but often filtered implicitly)
     *
     *      const listWithObject = new List<any>([1, { name: 'obj' }, new Date(), [1,2] ]);
     *      const objectsInList = listWithObject.ofType('object').toArray();
     *      // objectsInList = [ { name: 'obj' }, Date(...), [1, 2] ]
     *
     *      // --- Usage with Constructor Functions ---
     *      class Animal { constructor(public name: string) {} }
     *      class Dog extends Animal { constructor(name: string, public breed: string) { super(name); } }
     *      class Cat extends Animal { constructor(name: string, public lives: number) { super(name); } }
     *
     *      const animals = new List<Animal | string>([
     *          new Dog('Buddy', 'Golden Retriever'),
     *          new Cat('Whiskers', 9),
     *          'Not an animal',
     *          new Dog('Rex', 'German Shepherd'),
     *          null // Will be filtered out
     *      ]);
     *
     *      // Get only Dog instances
     *      const dogs = animals.ofType(Dog).toArray();
     *      // dogs = [ Dog { name: 'Buddy', breed: 'Golden Retriever' }, Dog { name: 'Rex', breed: 'German Shepherd' } ]
     *      // TypeScript knows `dogs` is of type Dog[]
     *
     *      // Get only Cat instances
     *      const cats = animals.ofType(Cat).toArray();
     *      // cats = [ Cat { name: 'Whiskers', lives: 9 } ]
     *      // TypeScript knows `cats` is of type Cat[]
     *
     *      // --- Inheritance Handling ---
     *      // Get all instances of Animal (includes Dogs and Cats)
     *      const allAnimals = animals.ofType(Animal).toArray();
     *      // allAnimals = [
     *      //   Dog { name: 'Buddy', breed: 'Golden Retriever' },
     *      //   Cat { name: 'Whiskers', lives: 9 },
     *      //   Dog { name: 'Rex', breed: 'German Shepherd' }
     *      // ]
     *      // TypeScript knows `allAnimals` is of type Animal[]
     *
     *      // --- Using with built-in constructors ---
     *      const variousData = new List<any>([new Date(), 123, "hello", new Date(0), true]);
     *      const datesOnly = variousData.ofType(Date).toArray();
     *      // datesOnly = [ Date(...), Date(0) ] // Contains the two Date objects
     *
     *      const numbersFromAny = variousData.ofType(Number).toArray();
     *      // numbersFromAny = [ 123 ]
     *
     *      // --- Edge Cases ---
     *      const nullsAndUndefined = new List<any>([null, undefined, 0, '']);
     *      const objects = nullsAndUndefined.ofType('object').toArray(); // 'object' typically matches non-null objects
     *      // objects = []
     *
     *      const undefinedOnly = nullsAndUndefined.ofType('undefined').toArray();
     *      // undefinedOnly = [undefined]
     */
    ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>>;

    /**
     * Sorts the elements of a sequence in ascending order by using a specified comparer.
     * @template TElement
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
     * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in ascending order.
     * @example
     *      const numbers = new List([50, 10, 40, 30, 20]);
     *      const sortedNumbers = numbers.orderBy(n => n).toArray();
     *      // sortedNumbers = [10, 20, 30, 40, 50]
     *
     *      interface Person { name: string; age: number; }
     *      const people = new List<Person>([
     *          { name: 'Charlie', age: 30 },
     *          { name: 'Alice', age: 25 },
     *          { name: 'Bob', age: 35 }
     *      ]);
     *
     *      // Order by age (ascending)
     *      const peopleByAge = people.orderBy(p => p.age).toArray();
     *      // peopleByAge = [
     *      //   { name: 'Alice', age: 25 },
     *      //   { name: 'Charlie', age: 30 },
     *      //   { name: 'Bob', age: 35 }
     *      // ]
     *
     *      // Order by name (string comparison, ascending)
     *      const peopleByName = people.orderBy(p => p.name).toArray();
     *      // peopleByName = [
     *      //   { name: 'Alice', age: 25 },
     *      //   { name: 'Bob', age: 35 },
     *      //   { name: 'Charlie', age: 30 }
     *      // ]
     *
     *      // Using a custom comparator (e.g., sort numbers as strings)
     *      const numbersToSortAsString = new List([1, 10, 2, 20]);
     *      const sortedAsString = numbersToSortAsString.orderBy(
     *          n => n,
     *          (a, b) => String(a).localeCompare(String(b)) // String comparison
     *      ).toArray();
     *      // sortedAsString = [1, 10, 2, 20] (standard numeric sort would be [1, 2, 10, 20])
     */
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Sorts the elements of a sequence in descending order by using a specified comparer.
     * @template TElement
     * @param keySelector The key selector function that will be used for selecting the key for an element.
     * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
     * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in descending order.
     * @example
     *      const numbers = new List([50, 10, 40, 30, 20]);
     *      const sortedNumbersDesc = numbers.orderByDescending(n => n).toArray();
     *      // sortedNumbersDesc = [50, 40, 30, 20, 10]
     *
     *      interface Person { name: string; age: number; }
     *      const people = new List<Person>([
     *          { name: 'Charlie', age: 30 },
     *          { name: 'Alice', age: 25 },
     *          { name: 'Bob', age: 35 }
     *      ]);
     *
     *      // Order by age (descending)
     *      const peopleByAgeDesc = people.orderByDescending(p => p.age).toArray();
     *      // peopleByAgeDesc = [
     *      //   { name: 'Bob', age: 35 },
     *      //   { name: 'Charlie', age: 30 },
     *      //   { name: 'Alice', age: 25 }
     *      // ]
     *
     *      // Order by name (string comparison, descending)
     *      const peopleByNameDesc = people.orderByDescending(p => p.name).toArray();
     *      // peopleByNameDesc = [
     *      //   { name: 'Charlie', age: 30 },
     *      //   { name: 'Bob', age: 35 },
     *      //   { name: 'Alice', age: 25 }
     *      // ]
     */
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Produces a sequence of tuples containing the element and the following element.
     * @template TElement, TResult
     * @param resultSelector The optional function to create a result element from the current and the next element. Defaults to creating a tuple `[current, next]`.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of applying the `resultSelector` to adjacent elements.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *
     *      // Default behavior: creates tuples
     *      const pairs = numbers.pairwise().toArray();
     *      // pairs = [[1, 2], [2, 3], [3, 4], [4, 5]]
     *
     *      // Custom result selector: calculate differences
     *      const differences = numbers.pairwise((current, next) => next - current).toArray();
     *      // differences = [1, 1, 1, 1]
     *
     *      // Custom result selector: create strings
     *      const pairStrings = numbers.pairwise((current, next) => `${current}-${next}`).toArray();
     *      // pairStrings = ["1-2", "2-3", "3-4", "4-5"]
     *
     *      const shortList = new List([10]);
     *      const noPairs = shortList.pairwise().toArray();
     *      // noPairs = []
     *
     *      const emptyList = new List<number>();
     *      const emptyPairs = emptyList.pairwise().toArray();
     *      // emptyPairs = []
     */
    pairwise(resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]>;


    /**
     * Produces a tuple of two enumerable sequences, the first one containing the elements that satisfy the condition, and the second one containing the rest of the elements.
     * Note: This method iterates the source sequence immediately and stores the results.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition.
     * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing two enumerable sequences: the first for elements satisfying the predicate, the second for the rest.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     *
     *      const [evens, odds] = numbers.partition(n => n % 2 === 0);
     *
     *      const evensArray = evens.toArray();
     *      // evensArray = [2, 4, 6, 8, 10]
     *
     *      const oddsArray = odds.toArray();
     *      // oddsArray = [1, 3, 5, 7, 9]
     *
     *      interface Person { name: string; age: number; }
     *      const people = new List<Person>([
     *          { name: 'Alice', age: 25 },
     *          { name: 'Bob', age: 17 },
     *          { name: 'Charlie', age: 30 },
     *          { name: 'Diana', age: 15 }
     *      ]);
     *
     *      const [adults, minors] = people.partition(p => p.age >= 18);
     *
     *      const adultNames = adults.select(p => p.name).toArray();
     *      // adultNames = ['Alice', 'Charlie']
     *
     *      const minorNames = minors.select(p => p.name).toArray();
     *      // minorNames = ['Bob', 'Diana']
     */
    partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Returns an enumerable sequence of permutations, each containing a permutation of the elements of the source sequence.
     * Note: This method first extracts distinct elements from the source before generating permutations.
     * @template TElement
     * @param size If specified, it will return only the permutations of the specified size. If not specified, it will return permutations of the size of the distinct elements in the source sequence.
     * @returns {IEnumerable<IEnumerable<TElement>>} An enumerable of enumerable sequences, each containing a permutation of the distinct elements of the source sequence.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const allPermutations = letters.permutations()
     *          .select(p => p.toArray().join('')) // Convert each permutation sequence to a string
     *          .toArray();
     *      // allPermutations = ["abc", "acb", "bac", "bca", "cab", "cba"]
     *
     *      const permutationsOfTwo = letters.permutations(2)
     *          .select(p => p.toArray().join(''))
     *          .toArray();
     *      // permutationsOfTwo = ["ab", "ac", "ba", "bc", "ca", "cb"]
     *
     *      // With duplicates in source - only distinct elements are permuted
     *      const lettersWithDuplicates = new List(['a', 'a', 'b']);
     *      const permsFromDup = lettersWithDuplicates.permutations() // Equivalent to permutations of ['a', 'b']
     *          .select(p => p.toArray().join(''))
     *          .toArray();
     *      // permsFromDup = ["ab", "ba"]
     *
     *      const permsOfOne = letters.permutations(1)
     *          .select(p => p.toArray().join(''))
     *          .toArray();
     *      // permsOfOne = ["a", "b", "c"]
     *
     *      try {
     *          letters.permutations(0); // Throws InvalidArgumentException
     *      } catch (e) {
     *          console.log(e.message); // Output: Size must be greater than 0.
     *      }
     */
    permutations(size?: number): IEnumerable<IEnumerable<TElement>>;

    /**
     * Adds a value to the beginning of the sequence.
     * @template TElement
     * @param element The element to add to the sequence.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that starts with the specified element.
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const prepended = numbers.prepend(0).toArray();
     *      // prepended = [0, 1, 2, 3]
     *
     *      const emptyList = new List<string>();
     *      const prependedToEmpty = emptyList.prepend("first").toArray();
     *      // prependedToEmpty = ["first"]
     */
    prepend(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the product of the sequence. Assumes elements are numbers or uses a selector to get numbers.
     * @param selector The selector function that will be used to select a numeric value from the sequence elements.
     * @returns {number} The product of the sequence. Returns 1 if the sequence is empty.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const totalProduct = numbers.product();
     *      // totalProduct = 120 (1 * 2 * 3 * 4 * 5)
     *
     *      interface Item { value: number; }
     *      const items = new List<Item>([{ value: 2 }, { value: 5 }, { value: 10 }]);
     *      const itemValueProduct = items.product(item => item.value);
     *      // itemValueProduct = 100 (2 * 5 * 10)
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.product(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     */
    product(selector?: Selector<TElement, number>): number;

    /**
     * Inverts the order of the elements in the sequence.
     *
     * Note: This method internally converts the sequence to an array to reverse it.
     * @template TElement
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are in the reverse order of the source sequence.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const reversedNumbers = numbers.reverse().toArray();
     *      // reversedNumbers = [5, 4, 3, 2, 1]
     *
     *      const letters = new List(['a', 'b', 'c']);
     *      const reversedLetters = letters.reverse().toArray();
     *      // reversedLetters = ['c', 'b', 'a']
     *
     *      const emptyList = new List<number>();
     *      const reversedEmpty = emptyList.reverse().toArray();
     *      // reversedEmpty = []
     */
    reverse(): IEnumerable<TElement>;

    /**
     * Applies an accumulator function over the sequence and yields the result of each intermediate computation.
     * If seed is specified, it is used as the initial value for the accumulator, but it is not included in the result sequence.
     * @template TAccumulate
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, the first element of the sequence will be used as the seed value and also included as the first element of the result.
     * @returns {IEnumerable<TAccumulate>} A new enumerable sequence whose elements are the result of each intermediate computation.
     * @throws {NoElementsException} If the source is empty and seed is not provided.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *
     *      // Running sum without a seed (the first element is the initial value and first result)
     *      const runningSumNoSeed = numbers.scan((acc, current) => acc + current).toArray();
     *      // runningSumNoSeed = [1, 3, 6, 10, 15]
     *
     *      // Running sum with seed (seed is initial value, but not in output)
     *      const runningSumWithSeed = numbers.scan((acc, current) => acc + current, 100).toArray();
     *      // runningSumWithSeed = [101, 103, 106, 110, 115]
     *
     *      // Building intermediate strings
     *      const letters = new List(['a', 'b', 'c']);
     *      const intermediateStrings = letters.scan((acc, current) => acc + current, '').toArray();
     *      // intermediateStrings = ['a', 'ab', 'abc']
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.scan((a, b) => a + b).toArray(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     *      const scanEmptyWithSeed = emptyList.scan((a, b) => a + b, 0).toArray();
     *      // scanEmptyWithSeed = []
     */
    scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate>;

    /**
     * Projects each element of a sequence into a new form.
     * @template TResult
     * @param selector The selector function that will be used to project each element into a new form. The second parameter is the index.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the result of the selector function.
     * @example
     *      const numbers = new List([1, 2, 3, 4]);
     *      const squares = numbers.select(n => n * n).toArray();
     *      // squares = [1, 4, 9, 16]
     *
     *      interface Person { firstName: string; lastName: string; }
     *      const people = new List<Person>([
     *          { firstName: 'John', lastName: 'Doe' },
     *          { firstName: 'Jane', lastName: 'Smith' }
     *      ]);
     *      const fullNames = people.select(p => `${p.firstName} ${p.lastName}`).toArray();
     *      // fullNames = ["John Doe", "Jane Smith"]
     *
     *      // Using the index
     *      const indexedValues = people.select((p, index) => `${index}: ${p.firstName}`).toArray();
     *      // indexedValues = ["0: John", "1: Jane"]
     */
    select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult>;

    /**
     * Projects each element of a sequence into a new form (which is an iterable) and flattens the resulting sequences into one sequence.
     * @template TResult
     * @param selector The selector function that will be used to project each element into a new iterable form. The second parameter is the index.
     * @returns {IEnumerable<TResult>} A new enumerable sequence whose elements are the flattened result of the selector function.
     * @example
     *      interface Customer { name: string; orders: string[]; }
     *      const customers = new List<Customer>([
     *          { name: 'Alice', orders: ['Apple', 'Banana'] },
     *          { name: 'Bob', orders: ['Cherry'] },
     *          { name: 'Charlie', orders: [] } // No orders
     *      ]);
     *
     *      // Get a single list of all orders from all customers
     *      const allOrders = customers.selectMany(c => c.orders).toArray();
     *      // allOrders = ['Apple', 'Banana', 'Cherry']
     *
     *      // Example: splitting strings and flattening
     *      const sentences = new List(['Hello world', 'How are you']);
     *      const words = sentences.selectMany(s => s.split(' ')).toArray();
     *      // words = ['Hello', 'world', 'How', 'are', 'you']
     *
     *      // Using index in selector
     *      const indexedFlatten = customers.selectMany((c, index) => c.orders.map(o => `${index}-${o}`)).toArray();
     *      // indexedFlatten = ['0-Apple', '0-Banana', '1-Cherry']
     */
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;

    /**
     * Determines whether two sequences are equal by comparing the elements by using an equality comparer for their type.
     * Compares elements pairwise in order. Sequences must have the same length and equal elements at corresponding positions.
     * @param iterable The iterable sequence to compare to the source sequence.
     * @param comparator The equality comparer that will be used to compare the elements. If not specified, the default equality comparer will be used.
     * @returns {boolean} true if the two source sequences are of equal length and their corresponding elements are equal, according to the specified equality comparer; otherwise, false.
     * @example
     *      const list1 = new List([1, 2, 3]);
     *      const list2 = new List([1, 2, 3]);
     *      const list3 = new List([1, 3, 2]); // Different order
     *      const list4 = new List([1, 2]); // Different length
     *      const array1 = [1, 2, 3]; // Can compare with other iterables
     *
     *      const isEqual12 = list1.sequenceEqual(list2);
     *      // isEqual12 = true
     *
     *      const isEqual13 = list1.sequenceEqual(list3);
     *      // isEqual13 = false
     *
     *      const isEqual14 = list1.sequenceEqual(list4);
     *      // isEqual14 = false
     *
     *      const isEqual1Array = list1.sequenceEqual(array1);
     *      // isEqual1Array = true
     *
     *      // Custom comparison for objects
     *      interface Item { id: number; }
     *      const items1 = new List<Item>([{ id: 1 }, { id: 2 }]);
     *      const items2 = new List<Item>([{ id: 1 }, { id: 2 }]);
     *      const items3 = new List<Item>([{ id: 1 }, { id: 3 }]);
     *
     *      const areItemsEqualById = items1.sequenceEqual(items2, (a, b) => a.id === b.id);
     *      // areItemsEqualById = true
     *
     *      const areItems3EqualById = items1.sequenceEqual(items3, (a, b) => a.id === b.id);
     *      // areItems3EqualById = false
     */
    sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns a new enumerable sequence whose elements are shuffled randomly.
     * Note: This method internally converts the sequence to an array to shuffle it.
     * @template TElement
     * @returns {IEnumerable<TElement>} A new enumerable sequence whose elements are shuffled.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const shuffledNumbers = numbers.shuffle().toArray();
     *      // shuffledNumbers will be a random permutation of [1, 2, 3, 4, 5], e.g., [3, 1, 5, 2, 4]
     *
     *      // Shuffling is not stable; subsequent calls will likely produce different orders
     *      const shuffledAgain = numbers.shuffle().toArray();
     *      // shuffledAgain will likely be different from shuffledNumbers
     */
    shuffle(): IEnumerable<TElement>;

    /**
     * Returns the only element of a sequence and throws an exception if there is not exactly one element in the sequence.
     * Can optionally apply a predicate to filter the sequence first.
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, checks the entire sequence.
     * @returns {TElement} The single element of the sequence (or the single element satisfying the predicate).
     * @throws {NoElementsException} If the source (or filtered sequence) is empty.
     * @throws {MoreThanOneElementException} If the source (or filtered sequence) contains more than one element.
     * @throws {NoMatchingElementException} If a predicate is specified and no element satisfies the condition.
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.
     * @example
     *      const singleItemList = new List([42]);
     *      const theOnlyItem = singleItemList.single();
     *      // theOnlyItem = 42
     *
     *      const numbers = new List([10, 20, 30, 40]);
     *      const theOnlyThirty = numbers.single(n => n === 30);
     *      // theOnlyThirty = 30
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.single(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message);
     *      }
     *
     *      const multipleItems = new List([1, 2]);
     *      try {
     *          multipleItems.single(); // Throws MoreThanOneElementException
     *      } catch (e) {
     *          console.log(e.message);
     *      }
     *
     *      try {
     *          numbers.single(n => n > 50); // Throws NoMatchingElementException
     *      } catch (e) {
     *          console.log(e.message);
     *      }
     *
     *      try {
     *          numbers.single(n => n > 15); // Throws MoreThanOneMatchingElementException
     *      } catch (e) {
     *          console.log(e.message);
     *      }
     */
    single(predicate?: Predicate<TElement>): TElement;

    /**
     * Returns the only element of a sequence, or a default value (null) if the sequence is empty.
     * Throws an exception if there is more than one element in the sequence (or more than one matching the predicate).
     * @template TElement
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, checks the entire sequence.
     * @returns {TElement|null} The single element of the sequence (or the single element satisfying the predicate), or null if the sequence (or filtered sequence) is empty.
     * @throws {MoreThanOneElementException} If the source contains more than one element (and no predicate is used).
     * @throws {MoreThanOneMatchingElementException} If a predicate is specified and more than one element satisfies the condition.
     * @example
     *      const singleItemList = new List([42]);
     *      const theOnlyItem = singleItemList.singleOrDefault();
     *      // theOnlyItem = 42
     *
     *      const numbers = new List([10, 20, 30, 40]);
     *      const theOnlyThirty = numbers.singleOrDefault(n => n === 30);
     *      // theOnlyThirty = 30
     *
     *      const emptyList = new List<number>();
     *      const singleFromEmpty = emptyList.singleOrDefault();
     *      // singleFromEmpty = null
     *
     *      const singleNoMatch = numbers.singleOrDefault(n => n > 50);
     *      // singleNoMatch = null
     *
     *      const multipleItems = new List([1, 2]);
     *      try {
     *          multipleItems.singleOrDefault(); // Throws MoreThanOneElementException
     *      } catch (e) { console.log(e.message); }
     *
     *      try {
     *          numbers.singleOrDefault(n => n > 15); // Throws MoreThanOneMatchingElementException
     *      } catch (e) {
     *          console.log(e.message);
     *      }
     */
    singleOrDefault(predicate?: Predicate<TElement>): TElement | null;

    /**
     * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
     * @template TElement
     * @param count The number of elements to skip before returning the remaining elements. If the count is zero or negative, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements that occur after the specified number of skipped elements.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6]);
     *      const skipFirstThree = numbers.skip(3).toArray();
     *      // skipFirstThree = [4, 5, 6]
     *
     *      const skipZero = numbers.skip(0).toArray();
     *      // skipZero = [1, 2, 3, 4, 5, 6]
     *
     *      const skipMoreThanAvailable = numbers.skip(10).toArray();
     *      // skipMoreThanAvailable = []
     *
     *      const skipNegative = numbers.skip(-5).toArray(); // Negative count is treated as 0
     *      // skipNegative = [1, 2, 3, 4, 5, 6]
     */
    skip(count: number): IEnumerable<TElement>;

    /**
     * Returns a new enumerable sequence that contains the elements from the source with the last count elements of the source sequence omitted.
     * @template TElement
     * @param count The number of elements to omit from the end of the collection. If the count is zero or negative, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from source with the last count elements omitted.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6]);
     *      const skipLastTwo = numbers.skipLast(2).toArray();
     *      // skipLastTwo = [1, 2, 3, 4]
     *
     *      const skipLastZero = numbers.skipLast(0).toArray();
     *      // skipLastZero = [1, 2, 3, 4, 5, 6]
     *
     *      const skipLastMoreThanAvailable = numbers.skipLast(10).toArray();
     *      // skipLastMoreThanAvailable = []
     *
     *      const skipLastNegative = numbers.skipLast(-3).toArray(); // Negative count is treated as 0
     *      // skipLastNegative = [1, 2, 3, 4, 5, 6]
     */
    skipLast(count: number): IEnumerable<TElement>;

    /**
     * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
     * The element that first fails the condition is included in the result.
     * @template TElement
     * @param predicate The predicate function (accepting element and index) that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements starting from the first element that does not satisfy the predicate.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 1, 2]);
     *
     *      // Skip while less than 4
     *      const skipWhileLessThan4 = numbers.skipWhile(n => n < 4).toArray();
     *      // skipWhileLessThan4 = [4, 5, 1, 2] (Stops skipping at 4)
     *
     *      // Skip based on index
     *      const skipWhileIndexLessThan3 = numbers.skipWhile((n, index) => index < 3).toArray();
     *      // skipWhileIndexLessThan3 = [4, 5, 1, 2] (Skips elements at index 0, 1, 2)
     *
     *      // Condition never met
     *      const skipWhileAlwaysTrue = numbers.skipWhile(n => true).toArray();
     *      // skipWhileAlwaysTrue = []
     *
     *      // Condition immediately false
     *      const skipWhileAlwaysFalse = numbers.skipWhile(n => false).toArray();
     *      // skipWhileAlwaysFalse = [1, 2, 3, 4, 5, 1, 2]
     */
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Splits the sequence into two sequences based on a predicate.
     * The first sequence contains the elements from the start of the input sequence that satisfy the predicate continuously.
     * The second sequence contains the remaining elements, starting from the first element that failed the predicate.
     * Note: This method iterates the source sequence immediately and stores the results.
     * @template TElement
     * @param predicate The predicate function that will be used to test each element.
     * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple of two enumerable sequences.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 1, 5, 6]);
     *
     *      // Span while numbers are less than 4
     *      const [lessThan4, rest1] = numbers.span(n => n < 4);
     *      const lessThan4Array = lessThan4.toArray();
     *      // lessThan4Array = [1, 2, 3]
     *      const rest1Array = rest1.toArray();
     *      // rest1Array = [4, 1, 5, 6] (Starts from the first element failing the condition)
     *
     *      // Span while condition is always true
     *      const [allElements, rest2] = numbers.span(n => true);
     *      const allElementsArray = allElements.toArray();
     *      // allElementsArray = [1, 2, 3, 4, 1, 5, 6]
     *      const rest2Array = rest2.toArray();
     *      // rest2Array = []
     *
     *      // Span while the condition is initially false
     *      const [initialSpan, rest3] = numbers.span(n => n > 10);
     *      const initialSpanArray = initialSpan.toArray();
     *      // initialSpanArray = []
     *      const rest3Array = rest3.toArray();
     *      // rest3Array = [1, 2, 3, 4, 1, 5, 6]
     */
    span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];

    /**
     * Selects elements from a sequence at regular intervals (steps).
     * Includes the first element (index 0) and then every 'step'-th element after that.
     * @template TElement
     * @param step The number of elements to skip between included elements. Must be 1 or greater.
     * @returns {IEnumerable<TElement>} A new enumerable sequence containing elements at the specified step intervals.
     * @throws {InvalidArgumentException} If the step is less than 1.
     * @example
     *      const numbers = new List([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
     *
     *      // Take every 2nd element (step = 2)
     *      const step2 = numbers.step(2).toArray();
     *      // step2 = [0, 2, 4, 6, 8, 10]
     *
     *      // Take every 3rd element (step = 3)
     *      const step3 = numbers.step(3).toArray();
     *      // step3 = [0, 3, 6, 9]
     *
     *      // Step = 1 includes all elements
     *      const step1 = numbers.step(1).toArray();
     *      // step1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
     *
     *      try {
     *          numbers.step(0); // Throws InvalidArgumentException
     *      } catch (e) {
     *          console.log(e.message); // Output: Step must be greater than 0.
     *      }
     */
    step(step: number): IEnumerable<TElement>;

    /**
     * Returns the sum of the values in the sequence. Assumes elements are numbers or uses a selector to get numbers.
     * @param selector The selector function that will be used to select the numeric value to sum. If not specified, the element itself is used.
     * @returns {number} The sum of the values in the sequence. Returns 0 if the sequence is empty.
     * @throws {NoElementsException} If the source is empty.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5]);
     *      const totalSum = numbers.sum();
     *      // totalSum = 15
     *
     *      interface Item { value: number; quantity: number; }
     *      const items = new List<Item>([
     *          { value: 10, quantity: 2 }, // Total value = 20
     *          { value: 5, quantity: 3 }  // Total value = 15
     *      ]);
     *      const totalItemValue = items.sum(item => item.value * item.quantity);
     *      // totalItemValue = 35
     *
     *      const emptyList = new List<number>();
     *      try {
     *          emptyList.sum(); // Throws NoElementsException
     *      } catch (e) {
     *          console.log(e.message); // Output: The sequence contains no elements.
     *      }
     */
    sum(selector?: Selector<TElement, number>): number;

    /**
     * Returns a specified number of contiguous elements from the start of a sequence.
     * @template TElement
     * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the start of the input sequence.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6]);
     *
     *      const takeFirstThree = numbers.take(3).toArray();
     *      // takeFirstThree = [1, 2, 3]
     *
     *      const takeZero = numbers.take(0).toArray();
     *      // takeZero = []
     *
     *      const takeMoreThanAvailable = numbers.take(10).toArray();
     *      // takeMoreThanAvailable = [1, 2, 3, 4, 5, 6]
     *
     *      const takeNegative = numbers.take(-2).toArray(); // Negative count is treated as 0
     *      // takeNegative = []
     */
    take(count: number): IEnumerable<TElement>;

    /**
     * Returns a specified number of contiguous elements from the end of a sequence.
     * @template TElement
     * @param count The number of elements to return. If the count is zero or negative, an empty sequence is returned. If the count is greater than the number of elements, all elements are returned.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the specified number of elements from the end of the input sequence.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6]);
     *
     *      const takeLastTwo = numbers.takeLast(2).toArray();
     *      // takeLastTwo = [5, 6]
     *
     *      const takeLastZero = numbers.takeLast(0).toArray();
     *      // takeLastZero = []
     *
     *      const takeLastMoreThanAvailable = numbers.takeLast(10).toArray();
     *      // takeLastMoreThanAvailable = [1, 2, 3, 4, 5, 6] (Order is preserved)
     *
     *      const takeLastNegative = numbers.takeLast(-3).toArray(); // Negative count is treated as 0
     *      // takeLastNegative = []
     */
    takeLast(count: number): IEnumerable<TElement>;

    /**
     * Returns elements from a sequence as long as a specified condition is true and then skips the remaining elements.
     * @template TElement
     * @param predicate The predicate function (accepting element and index) that will be used to test each element.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from the input sequence that occur before the element at which the test no longer passes.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 1, 5, 6]);
     *
     *      // Take while less than 4
     *      const takeWhileLessThan4 = numbers.takeWhile(n => n < 4).toArray();
     *      // takeWhileLessThan4 = [1, 2, 3] (Stops taking at 4)
     *
     *      // Take based on index
     *      const takeWhileIndexLessThan3 = numbers.takeWhile((n, index) => index < 3).toArray();
     *      // takeWhileIndexLessThan3 = [1, 2, 3] (Takes elements at index 0, 1, 2)
     *
     *      // Condition never met (the first element fails)
     *      const takeWhileAlwaysFalse = numbers.takeWhile(n => n > 10).toArray();
     *      // takeWhileAlwaysFalse = []
     *
     *      // Condition always true
     *      const takeWhileAlwaysTrue = numbers.takeWhile(n => true).toArray();
     *      // takeWhileAlwaysTrue = [1, 2, 3, 4, 1, 5, 6]
     */
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Creates a new array from the elements of the sequence.
     * This forces evaluation of the entire sequence.
     * @template TElement
     * @returns {TElement[]} An array that contains the elements from the input sequence.
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const numberArray = numbers.toArray();
     *      // numberArray = [1, 2, 3] (a standard JavaScript Array)
     *
     *      const squares = numbers.select(n => n * n); // squares is an IEnumerable
     *      const squaresArray = squares.toArray(); // squaresArray forces evaluation
     *      // squaresArray = [1, 4, 9]
     */
    toArray(): TElement[];

    /**
     * Creates a new circular linked list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement The type of elements in the sequence.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {CircularLinkedList<TElement>} A new circular linked list that contains the elements from the input sequence.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const circularList = letters.toCircularLinkedList();
     *      // circularList is a CircularLinkedList instance containing 'a', 'b', 'c'
     *      // circularList.firstNode?.value === 'a'
     *      // circularList.lastNode?.value === 'c'
     *      // circularList.lastNode?.next === circularList.firstNode // Circular nature
     */
    toCircularLinkedList(comparator?: EqualityComparator<TElement>): CircularLinkedList<TElement>;

    /**
     * Creates a new dictionary from the elements of the sequence.
     * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
     * @returns {Dictionary<TKey, TValue>} A new dictionary that contains the elements from the input sequence.
     * @example
     *      interface Product { id: number; name: string; price: number; }
     *      const products = new List<Product>([
     *          { id: 1, name: 'Apple', price: 0.5 },
     *          { id: 2, name: 'Banana', price: 0.3 },
     *          { id: 3, name: 'Cherry', price: 1.0 }
     *      ]);
     *
     *      // Create a dictionary mapping ID to Product Name
     *      const productDict = products.toDictionary(p => p.id, p => p.name);
     *      // productDict.get(2) === 'Banana'
     *      // productDict.size === 3
     *
     *      // Example with KeyValuePair source
     *      const pairs = new List([
     *          new KeyValuePair('one', 1),
     *          new KeyValuePair('two', 2)
     *      ]);
     *      const dictFromPairs = pairs.toDictionary(kv => kv.key, kv => kv.value);
     *      // dictFromPairs.get('one') === 1
     *
     *      // Example causing error due to a duplicate key
     *      const duplicateKeys = new List([{ key: 'a', val: 1 }, { key: 'a', val: 2 }]);
     *      try {
     *          duplicateKeys.toDictionary(item => item.key, item => item.val);
     *      } catch (e) {
     *          console.log(e.message); // Output likely: "An item with the same key has already been added."
     *      }
     */
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;

    /**
     * Creates a new enumerable set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence.
     * @template TElement
     * @returns {EnumerableSet<TElement>} An enumerable set that contains the distinct elements from the input sequence.
     * @example
     *      const numbers = new List([1, 2, 2, 3, 1, 4, 5, 5]);
     *      const numberSet = numbers.toEnumerableSet();
     *      // numberSet contains {1, 2, 3, 4, 5}
     *      // numberSet.size === 5
     *      // numberSet.contains(2) === true
     *      // numberSet.toArray() results in [1, 2, 3, 4, 5] (order depends on Set implementation)
     */
    toEnumerableSet(): EnumerableSet<TElement>;

    /**
     * Creates a new immutable dictionary from the elements of the sequence.
     * Forces evaluation of the sequence. Throws if duplicate keys are encountered.
     * @template TKey, TValue
     * @param keySelector The key selector function that will be used to select the key for an element.
     * @param valueSelector The value selector function that will be used to select the value for an element.
     * @param valueComparator The value comparator function that will be used to compare two values. If not specified, the default equality comparer will be used.
     * @returns {ImmutableDictionary<TKey, TValue>} A new immutable dictionary that contains the elements from the input sequence.
     * @example
     *      interface Product { id: number; name: string; price: number; }
     *      const products = new List<Product>([
     *          { id: 1, name: 'Apple', price: 0.5 },
     *          { id: 2, name: 'Banana', price: 0.3 }
     *      ]);
     *
     *      const immutableProductDict = products.toImmutableDictionary(p => p.id, p => p.name);
     *      // immutableProductDict.get(1) === 'Apple'
     *      // immutableProductDict.size === 2
     *      // Attempting immutableProductDict.add(3, 'Cherry') would throw an error or return a new dictionary.
     */
    toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue>;

    /**
     * Creates a new immutable list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableList<TElement>} A new immutable list that contains the elements from the input sequence.
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const immutableList = numbers.toImmutableList();
     *      // immutableList contains [1, 2, 3]
     *      // immutableList.size === 3
     *      // immutableList.get(0) === 1
     *      // Attempting immutableList.add(4) would throw an error or return a new list.
     */
    toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement>;

    /**
     * Creates a new immutable priority queue from the elements of the sequence.
     * Forces evaluation of the sequence. Elements are ordered based on the comparator.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used.
     * @returns {ImmutablePriorityQueue<TElement>} A new immutable priority queue that contains the elements from the input sequence.
     * @example
     *      const numbers = new List([5, 1, 3, 4, 2]);
     *      // Default comparator assumes min-heap (smaller numbers have higher priority)
     *      const immutableMinQueue = numbers.toImmutablePriorityQueue();
     *      // immutableMinQueue.peek() === 1
     *
     *      // Custom comparator for max-heap
     *      const immutableMaxQueue = numbers.toImmutablePriorityQueue((a, b) => b - a); // Larger numbers first
     *      // immutableMaxQueue.peek() === 5
     *
     *      // Attempting immutableMinQueue.enqueue(0) would return a new queue.
     */
    toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement>;

    /**
     * Creates a new immutable queue from the elements of the sequence (FIFO).
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableQueue<TElement>} A new immutable queue that contains the elements from the input sequence.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const immutableQueue = letters.toImmutableQueue();
     *      // immutableQueue.peek() === 'a'
     *      // immutableQueue.size === 3
     *      // Attempting immutableQueue.enqueue('d') would return a new queue.
     */
    toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement>;

    /**
     * Creates a new immutable set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence.
     * @template TElement
     * @returns {ImmutableSet<TElement>} A new immutable set that contains the distinct elements from the input sequence.
     * @example
     *      const numbers = new List([1, 2, 2, 3, 1]);
     *      const immutableSet = numbers.toImmutableSet();
     *      // immutableSet contains {1, 2, 3}
     *      // immutableSet.size === 3
     *      // immutableSet.contains(2) === true
     *      // Attempting immutableSet.add(4) would return a new set.
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
     * @example
     *      interface Product { id: number; name: string; }
     *      const products = new List<Product>([
     *          { id: 3, name: 'Cherry' },
     *          { id: 1, name: 'Apple' },
     *          { id: 2, name: 'Banana' }
     *      ]);
     *
     *      const immutableSortedDict = products.toImmutableSortedDictionary(p => p.id, p => p.name);
     *      // Keys will be sorted: 1, 2, 3
     *      // immutableSortedDict.get(2) === 'Banana'
     *      // immutableSortedDict.keys().toArray() === [1, 2, 3]
     *      // Attempting immutableSortedDict.add(4, 'Date') would return a new dictionary.
     */
    toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;

    /**
     * Creates a new immutable sorted set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence. Elements are sorted.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
     * @returns {ImmutableSortedSet<TElement>} A new immutable sorted set that contains the distinct, sorted elements from the input sequence.
     * @example
     *      const numbers = new List([5, 1, 3, 1, 4, 2, 5]);
     *      const immutableSortedSet = numbers.toImmutableSortedSet();
     *      // immutableSortedSet contains {1, 2, 3, 4, 5} in sorted order
     *      // immutableSortedSet.toArray() === [1, 2, 3, 4, 5]
     *      // immutableSortedSet.contains(3) === true
     *      // immutableSortedSet.size === 5
     *      // Attempting immutableSortedSet.add(0) would return a new set.
     */
    toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement>;

    /**
     * Creates a new immutable stack from the elements of the sequence (LIFO).
     * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {ImmutableStack<TElement>} A new immutable stack that contains the elements from the input sequence.
     * @example
     *      const letters = new List(['a', 'b', 'c']); // 'c' is the last element
     *      const immutableStack = letters.toImmutableStack();
     *      // immutableStack.peek() === 'c'
     *      // immutableStack.size === 3
     *      // Attempting immutableStack.push('d') would return a new stack.
     */
    toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement>;

    /**
     * Creates a new linked list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {LinkedList<TElement>} A new linked list that contains the elements from the input sequence.
     * @example
     *      const numbers = new List([10, 20, 30]);
     *      const linkedList = numbers.toLinkedList();
     *      // linkedList is a LinkedList instance
     *      // linkedList.firstNode?.value === 10
     *      // linkedList.lastNode?.value === 30
     *      // linkedList.size() === 3
     */
    toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement>;

    /**
     * Creates a new list from the elements of the sequence.
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {List<TElement>} A new list that contains the elements from the input sequence.
     * @example
     *      const numbers = Enumerable.range(1, 3); // Creates IEnumerable [1, 2, 3]
     *      const list = numbers.toList();
     *      // list is a List instance containing [1, 2, 3]
     *      // list.get(0) === 1
     *      // list.size() === 3
     *
     *      // Creates a copy of an existing list
     *      const originalList = new List(['a', 'b']);
     *      const newList = originalList.toList();
     *      // newList !== originalList (it's a new instance)
     *      // newList.toArray() results in ['a', 'b']
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
     * @example
     *      interface Pet { name: string; species: string; age: number; }
     *      const pets = new List<Pet>([
     *          { name: 'Fluffy', species: 'Cat', age: 3 },
     *          { name: 'Buddy', species: 'Dog', age: 5 },
     *          { name: 'Whiskers', species: 'Cat', age: 2 },
     *          { name: 'Rex', species: 'Dog', age: 7 }
     *      ]);
     *
     *      // Group pet names by species
     *      const lookup = pets.toLookup(pet => pet.species, pet => pet.name);
     *
     *      // lookup.count() === 2 (number of distinct keys: 'Cat', 'Dog')
     *      // lookup.contains('Cat') === true
     *
     *      const catNames = lookup.get('Cat').toArray();
     *      // catNames = ['Fluffy', 'Whiskers']
     *
     *      const dogNames = lookup.get('Dog').toArray();
     *      // dogNames = ['Buddy', 'Rex']
     *
     *      const fishNames = lookup.get('Fish').toArray(); // Key not present
     *      // fishNames = []
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
     * @example
     *      interface Product { id: number; name: string; price: number; }
     *      const products = new List<Product>([
     *          { id: 1, name: 'Apple', price: 0.5 },
     *          { id: 2, name: 'Banana', price: 0.3 },
     *          { id: 3, name: 'Cherry', price: 1.0 }
     *      ]);
     *
     *      // Create a Map mapping ID to Product Name
     *      const productMap = products.toMap(p => p.id, p => p.name);
     *      // productMap instanceof Map === true
     *      // productMap.get(2) === 'Banana'
     *      // productMap.size === 3
     *
     *      // Example causing error due to a duplicate key
     *      const duplicateKeys = new List([{ key: 'a', val: 1 }, { key: 'a', val: 2 }]);
     *      try {
     *          duplicateKeys.toMap(item => item.key, item => item.val);
     *      } catch (e) {
     *          console.log(e.message); // Map structure prevents duplicate keys by default. Behavior might depend on the underlying Map implementation if custom logic is used.
     *      }
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
     * @example
     *      interface Product { id: string; name: string; price: number; }
     *      const products = new List<Product>([
     *          { id: 'A1', name: 'Apple', price: 0.5 },
     *          { id: 'B2', name: 'Banana', price: 0.3 },
     *          { id: 'C3', name: 'Cherry', price: 1.0 }
     *      ]);
     *
     *      // Create an object mapping ID to Product Price
     *      const productObject = products.toObject(p => p.id, p => p.price);
     *      // productObject = { A1: 0.5, B2: 0.3, C3: 1.0 }
     *      // productObject['B2'] === 0.3
     *
     *      // Example with duplicate keys (last one wins)
     *      const duplicateKeys = new List([
     *          { key: 'a', val: 1 },
     *          { key: 'b', val: 2 },
     *          { key: 'a', val: 3 } // This value for 'a' will overwrite the first one
     *      ]);
     *      const objectFromDups = duplicateKeys.toObject(item => item.key, item => item.val);
     *      // objectFromDups = { a: 3, b: 2 }
     */
    toObject<TKey extends string|number|symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue>;

    /**
     * Creates a new priority queue from the elements of the sequence.
     * Forces evaluation of the sequence. Elements are ordered based on the comparator.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements. If not specified, the default order comparer will be used (min-heap).
     * @returns {PriorityQueue<TElement>} A new priority queue that contains the elements from the input sequence.
     * @example
     *      const numbers = new List([5, 1, 3, 4, 2]);
     *      // Default comparator assumes min-heap (smaller numbers have higher priority)
     *      const minQueue = numbers.toPriorityQueue();
     *      // minQueue.peek() === 1
     *      // minQueue.dequeue() === 1
     *      // minQueue.peek() === 2
     *
     *      // Custom comparator for max-heap
     *      const maxQueue = numbers.toPriorityQueue((a, b) => b - a); // Larger numbers first
     *      // maxQueue.peek() === 5
     *      // maxQueue.dequeue() === 5
     *      // maxQueue.peek() === 4
     */
    toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement>;

    /**
     * Creates a new queue from the elements of the sequence (FIFO).
     * Forces evaluation of the sequence.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {Queue<TElement>} A new queue that contains the elements from the input sequence.
     * @example
     *      const letters = new List(['a', 'b', 'c']);
     *      const queue = letters.toQueue();
     *      // queue.peek() === 'a'
     *      // queue.size() === 3
     *      // queue.dequeue() === 'a'
     *      // queue.peek() === 'b'
     */
    toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement>;

    /**
     * Creates a new JavaScript Set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence.
     * @template TElement
     * @returns {Set<TElement>} A new Set that contains the distinct elements from the input sequence.
     * @example
     *      const numbers = new List([1, 2, 2, 3, 1, 4, 5, 5]);
     *      const numberSet = numbers.toSet();
     *      // numberSet instanceof Set === true
     *      // numberSet contains {1, 2, 3, 4, 5}
     *      // numberSet.size === 5
     *      // numberSet.has(2) === true
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
     * @example
     *      interface Product { id: number; name: string; }
     *      const products = new List<Product>([
     *          { id: 3, name: 'Cherry' },
     *          { id: 1, name: 'Apple' },
     *          { id: 2, name: 'Banana' }
     *      ]);
     *
     *      const sortedDict = products.toSortedDictionary(p => p.id, p => p.name);
     *      // Keys will be sorted: 1, 2, 3
     *      // sortedDict.get(2) === 'Banana'
     *      // sortedDict.keys().toArray() results in [1, 2, 3]
     *
     *      // Example causing error due to duplicate key
     *      const duplicateKeys = new List([{ key: 'a', val: 1 }, { key: 'a', val: 2 }]);
     *      try {
     *          duplicateKeys.toSortedDictionary(item => item.key, item => item.val);
     *      } catch (e) {
     *          console.log(e.message); // Output likely: "An item with the same key has already been added."
     *      }
     */
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue>;

    /**
     * Creates a new sorted set from the elements of the sequence. Duplicate elements are ignored.
     * Forces evaluation of the sequence. Elements are sorted.
     * @template TElement
     * @param comparator The order comparator function that will be used to compare two elements for sorting. If not specified, the default order comparer will be used.
     * @returns {SortedSet<TElement>} A new sorted set that contains the distinct, sorted elements from the input sequence.
     * @example
     *      const numbers = new List([5, 1, 3, 1, 4, 2, 5]);
     *      const sortedSet = numbers.toSortedSet();
     *      // sortedSet contains {1, 2, 3, 4, 5} in sorted order
     *      // sortedSet.toArray() results in [1, 2, 3, 4, 5]
     *      // sortedSet.contains(3) === true
     *      // sortedSet.size() === 5
     */
    toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement>;

    /**
     * Creates a new stack from the elements of the sequence (LIFO).
     * Forces evaluation of the sequence. The last element of the source sequence becomes the top of the stack.
     * @template TElement
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {Stack<TElement>} A new stack that contains the elements from the input sequence.
     * @example
     *      const letters = new List(['a', 'b', 'c']); // 'c' is the last element
     *      const stack = letters.toStack();
     *      // stack.peek() === 'c'
     *      // stack.size() === 3
     *      // stack.pop() === 'c'
     *      // stack.peek() === 'b'
     */
    toStack(comparator?: EqualityComparator<TElement>): Stack<TElement>;

    /**
     * Produces the set union of two sequences by using an equality comparer.
     * The result contains all unique elements from both sequences.
     * @template TElement
     * @param iterable The iterable sequence whose distinct elements form the second set for the union.
     * @param comparator The equality comparator function that will be used to compare two elements. If not specified, the default equality comparer will be used.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains the elements from both input sequences, excluding duplicates. Order is preserved from the original sequences, with elements from the first sequence appearing before elements from the second.
     * @example
     *      const numbers1 = new List([1, 2, 3, 3]);
     *      const numbers2 = new List([3, 4, 5, 4]);
     *      const unionResult = numbers1.union(numbers2).toArray();
     *      // unionResult = [1, 2, 3, 4, 5] (Order: elements from numbers1 first, then unique from numbers2)
     *
     *      // Using custom object comparison
     *      interface Item { id: number; value: string; }
     *      const items1 = new List<Item>([{ id: 1, value: 'A' }, { id: 2, value: 'B' }]);
     *      const items2 = new List<Item>([{ id: 2, value: 'B_alt' }, { id: 3, value: 'C' }]);
     *      const itemUnion = items1.union(items2, (a, b) => a.id === b.id).toArray();
     *      // itemUnion = [
     *      //   { id: 1, value: 'A' }, // From items1
     *      //   { id: 2, value: 'B' }, // From items1 (id=2 from items2 is considered duplicate by comparator)
     *      //   { id: 3, value: 'C' }  // From items2
     *      // ]
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
     * @example
     *      interface Product { code: string; name: string; }
     *      const store1Products = new List<Product>([
     *          { code: 'A1', name: 'Apple' },
     *          { code: 'B2', name: 'Banana' }
     *      ]);
     *      const store2Products = new List<Product>([
     *          { code: 'B2', name: 'Banana V2' }, // Duplicate code 'B2'
     *          { code: 'C3', name: 'Cherry' }
     *      ]);
     *
     *      // Union based on product code
     *      const allUniqueProducts = store1Products.unionBy(
     *          store2Products,
     *          p => p.code // Select code as the key for comparison
     *      ).toArray();
     *      // allUniqueProducts = [
     *      //   { code: 'A1', name: 'Apple' },   // From store1
     *      //   { code: 'B2', name: 'Banana' },  // From store1 (item with code 'B2' from store2 is ignored)
     *      //   { code: 'C3', name: 'Cherry' }    // From store2
     *      // ]
     *
     *      // Example with case-insensitive key comparison
     *      const listA = new List([{ val: 'a', id: 1 }, { val: 'b', id: 2 }]);
     *      const listB = new List([{ val: 'B', id: 3 }, { val: 'c', id: 4 }]); // 'B' has same key as 'b' case-insensitively
     *      const unionCaseInsensitive = listA.unionBy(
     *          listB,
     *          item => item.val,
     *          (keyA, keyB) => keyA.toLowerCase() === keyB.toLowerCase() // Case-insensitive comparator
     *      ).toArray();
     *      // unionCaseInsensitive = [
     *      //  { val: 'a', id: 1 }, // From listA
     *      //  { val: 'b', id: 2 }, // From listA ('B' from listB is ignored)
     *      //  { val: 'c', id: 4 }  // From listB
     *      // ]
     */
    unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement>;

    /**
     * Filters a sequence of values based on a predicate.
     * @template TElement
     * @param predicate The predicate function (accepting element and index) that will be used to test each element. Return true to keep the element, false to filter it out. When the predicate acts as a type guard, the resulting sequence is narrowed to the guarded type.
     * @returns {IEnumerable<TElement>} A new enumerable sequence that contains elements from the input sequence that satisfy the condition.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6, 7, 8]);
     *
     *      // Get only even numbers
     *      const evens = numbers.where(n => n % 2 === 0).toArray();
     *      // evens = [2, 4, 6, 8]
     *
     *      // Get numbers greater than 3 at an odd index
     *      const complexFilter = numbers.where((n, index) => n > 3 && index % 2 !== 0).toArray();
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
     *      const products = new List<Product>([
     *          { name: 'Apple', price: 0.5 },
     *          { name: 'Banana', price: 0.3 },
     *          { name: 'Cherry', price: 1.0 }
     *      ]);
     *      const cheapProducts = products.where(p => p.price < 0.6).toArray();
     *      // cheapProducts = [ { name: 'Apple', price: 0.5 }, { name: 'Banana', price: 0.3 } ]
     */
    where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;

    /**
     * Returns an enumerable sequence of sliding windows of the specified size over the source sequence.
     * Each window is an IEnumerable itself.
     * @template TElement
     * @param size The size of the windows. Must be 1 or greater.
     * @returns {IEnumerable<IEnumerable<TElement>>} A new enumerable sequence where each element is a window (as an IEnumerable) of the specified size.
     * @throws {InvalidArgumentException} If size is less than or equal to 0.
     * @example
     *      const numbers = new List([1, 2, 3, 4, 5, 6]);
     *
     *      // Get windows of size 3
     *      const windowsOf3 = numbers.windows(3)
     *          .select(window => window.toArray()) // Convert each window IEnumerable to an array for clarity
     *          .toArray();
     *      // windowsOf3 = [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
     *
     *      // Get windows of size 1
     *      const windowsOf1 = numbers.windows(1)
     *          .select(window => window.toArray())
     *          .toArray();
     *      // windowsOf1 = [[1], [2], [3], [4], [5], [6]]
     *
     *      // Size larger than the list returns an empty sequence
     *      const windowsOf10 = numbers.windows(10).toArray();
     *      // windowsOf10 = []
     *
     *      // Size equal to the list returns one window
     *      const windowsOf6 = numbers.windows(6)
     *          .select(window => window.toArray())
     *          .toArray();
     *      // windowsOf6 = [[1, 2, 3, 4, 5, 6]]
     *
     *      try {
     *          numbers.windows(0); // Throws InvalidArgumentException
     *      } catch (e) {
     *          console.log(e.message); // Output: Size must be greater than 0.
     *      }
     */
    windows(size: number): IEnumerable<IEnumerable<TElement>>;


    /**
     * Applies a specified function to the corresponding elements of two sequences, producing a sequence of tuples.
     * If the two sequences are of different lengths, the resulting sequence will have the length of the shorter sequence.
     * @template TElement The type of elements in the first sequence.
     * @template TSecond The type of elements in the second sequence.
     * @param iterable The iterable sequence to merge with the first sequence.
     * @returns {IEnumerable<[TElement, TSecond]>} A new enumerable sequence that contains tuples [TElement, TSecond] of the merged elements.
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const letters = new List(['A', 'B', 'C', 'D']); // Longer than numbers
     *      const symbols = new List(['!', '?']); // Shorter than numbers
     *
     *      // Zip with the longer second sequence (result length = shorter sequence length)
     *      const zippedNumbersLetters = numbers.zip(letters).toArray();
     *      // zippedNumbersLetters = [[1, 'A'], [2, 'B'], [3, 'C']]
     *
     *      // Zip with the shorter second sequence (result length = shorter sequence length)
     *      const zippedNumbersSymbols = numbers.zip(symbols).toArray();
     *      // zippedNumbersSymbols = [[1, '!'], [2, '?']]
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
     * @example
     *      const numbers = new List([1, 2, 3]);
     *      const letters = new List(['A', 'B', 'C']);
     *
     *      // Combine numbers and letters into strings using the zipper
     *      const combinedStrings = numbers.zip(
     *      letters,
     *          (num, char) => `${num}-${char}` // Zipper function
     *      ).toArray();
     *      // combinedStrings = ["1-A", "2-B", "3-C"]
     *
     *      // Sum corresponding elements using the zipper
     *      const listA = new List([10, 20, 30]);
     *      const listB = new List([5, 15, 25, 35]); // listB is longer
     *      const sums = listA.zip(
     *      listB,
     *          (a, b) => a + b // Zipper function
     *      ).toArray();
     *      // sums = [15, 35, 55] (Length limited by the shorter listA)
     */
    zip<TSecond, TResult>(iterable: Iterable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;
}
