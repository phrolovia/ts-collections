import {EqualityComparator} from "../shared/EqualityComparator";
import {Accumulator} from "../shared/Accumulator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Zipper} from "../shared/Zipper";
import {JoinSelector} from "../shared/JoinSelector";
import {OrderComparator} from "../shared/OrderComparator";
import {
    SortedDictionary,
    IGroup,
    ILookup,
    IOrderedEnumerable,
    List,
    Dictionary,
    EnumerableArray
} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";

export interface IEnumerable<TElement> extends Iterable<TElement> {

    /**
     * Applies an accumulator function over the sequence. If seed is specified, it is used as the initial value.
     * If resultSelector function is specified, it will be used to select the result value.
     * @param accumulator The accumulator function that will be applied over the sequence.
     * @param seed The value that will be used as the initial value. If not specified, first element of the sequence will be used as seed value.
     * @param resultSelector The function that will be used to select the result value.
     */
    aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult;

    /**
     * Determines if all elements of the sequence satisfy the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
     */
    all(predicate?: Predicate<TElement>): boolean;

    /**
     * Determines if any element of the sequence satisfies the specified predicate.
     * @param predicate The predicate function that will be used to check each element for a condition. If not specified, it will return true if sequence has elements, otherwise false.
     */
    any(predicate?: Predicate<TElement>): boolean;

    /**
     * Appends the specified element to the end of the sequence.
     * @param element The element that will be appended to the end of the sequence
     */
    append(element: TElement): IEnumerable<TElement>;

    /**
     * Computes the average of the sequence. The sequence should be either a sequence consisting of numbers, or an appropriate selector function should be provided.
     * @param selector The selector function that will select a numeric value from the sequence elements.
     */
    average(selector?: Selector<TElement, number>): number;

    /**
     * Concatenates two sequences.
     * @param enumerable The enumerable sequence that will be concatenated to the first sequence.
     */
    concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement>;

    /**
     * Determines where the sequence contains the specified element.
     * @param element The element whose existence will be checked.
     * @param comparator The comparator function that will be used for equality comparison. If not provided, default equality comparison is used.
     */
    contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean;

    /**
     * Returns the number of elements in the sequence.
     *
     * <b>Note:</b> If you want to check whether a sequence contains any elements, do not use <code>sequence.count() > 0</code>. Use <code>sequence.any()</code> instead.
     * @param predicate The predicate function that will be used to check each element for a condition.
     */
    count(predicate?: Predicate<TElement>): number;

    /**
     * Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
     * @param value The value to return if the sequence is empty.
     */
    defaultIfEmpty(value?: TElement): IEnumerable<TElement>;

    /**
     * Returns distinct elements from the sequence.
     * @param keySelector The key selector function that will be used for selecting a key which will be used for distinctness comparison. If not provided, the item itself will be used.
     * @param keyComparator The comparator function that will be used for equality comparison of selected keys. If not provided, default equality comparison is used.
     */
    distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement>;
    elementAt(index: number): TElement;
    elementAtOrDefault(index: number): TElement;
    except(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IEnumerable<TElement>;
    first(predicate?: Predicate<TElement>): TElement;
    firstOrDefault(predicate?: Predicate<TElement>): TElement;
    forEach(action: IndexedAction<TElement>): void;
    groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>>;
    groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                       resultSelector: JoinSelector<TKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult>;
    intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IEnumerable<TElement>;
    join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>,
                  resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult>;
    last(predicate?: Predicate<TElement>): TElement;
    lastOrDefault(predicate?: Predicate<TElement>): TElement;
    max(selector?: Selector<TElement, number>): number;
    min(selector?: Selector<TElement, number>): number;
    orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
    orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
    prepend(element: TElement): IEnumerable<TElement>;
    reverse(): IEnumerable<TElement>;
    select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult>;
    selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult>;
    sequenceEqual(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean;
    single(predicate?: Predicate<TElement>): TElement;
    singleOrDefault(predicate?: Predicate<TElement>): TElement;
    skip(count: number): IEnumerable<TElement>;
    skipLast(count: number): IEnumerable<TElement>;
    skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    sum(selector?: Selector<TElement, number>): number;
    take(count: number): IEnumerable<TElement>;
    takeLast(count: number): IEnumerable<TElement>;
    takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    toArray(): TElement[];
    toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue>;
    toEnumerableArray(comparator?: EqualityComparator<TElement>): EnumerableArray<TElement>;
    toList(comparator?: EqualityComparator<TElement>): List<TElement>;
    toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue>;
    toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue>;
    union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement>;
    where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    zip<TSecond, TResult=[TElement, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult>;
}
