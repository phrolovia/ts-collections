import {Dictionary} from "../dictionary/Dictionary";
import {ImmutableDictionary} from "../dictionary/ImmutableDictionary";
import {ImmutableSortedDictionary} from "../dictionary/ImmutableSortedDictionary";
import {SortedDictionary} from "../dictionary/SortedDictionary";
import {ImmutableList} from "../list/ImmutableList";
import {IndexableList} from "../list/IndexableList";
import {LinkedList} from "../list/LinkedList";
import {List} from "../list/List";
import {ILookup} from "../lookup/ILookup";
import {EnumerableSet} from "../set/EnumerableSet";
import {ImmutableSet} from "../set/ImmutableSet";
import {ImmutableSortedSet} from "../set/ImmutableSortedSet";
import {SortedSet} from "../set/SortedSet";
import {Accumulator} from "../shared/Accumulator";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IndexedAction} from "../shared/IndexedAction";
import {IndexedSelector} from "../shared/IndexedSelector";
import {InferredType} from "../shared/InferredType";
import {JoinSelector} from "../shared/JoinSelector";
import {ObjectType} from "../shared/ObjectType";
import {OrderComparator} from "../shared/OrderComparator";
import {PairwiseSelector} from "../shared/PairwiseSelector";
import {Predicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";
import {Zipper} from "../shared/Zipper";
import {Enumerable} from "./Enumerable";
import {IEnumerable} from "./IEnumerable";
import {IGroup} from "./IGroup";
import {IOrderedEnumerable} from "./IOrderedEnumerable";

export const aggregate = <TElement, TAccumulate = TElement, TResult = TAccumulate>(
    source: Iterable<TElement>,
    accumulator: (accumulator: TAccumulate, element: TElement) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: (accumulator: TAccumulate) => TResult
): TAccumulate | TResult => {
    return from(source).aggregate(accumulator, seed, resultSelector);
}

export const all = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return from(source).all(predicate);
}

export const any = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).any(predicate);
}

export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
}

export const average = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).average(selector);
}

export const cast = <TElement, TResult>(
    source: Iterable<TElement>
): IEnumerable<TResult> => {
    return from(source).cast<TResult>();
}

export const chunk = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).chunk(size);
}

export const concat = <TElement>(
    source: Iterable<TElement>,
    second: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).concat(from(second));
}

export const contains = <TElement>(
    source: Iterable<TElement>,
    element: TElement,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).contains(element, comparator);
}

export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    return from(source).count(predicate);
}

export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    defaultValue?: TElement | null
): IEnumerable<TElement | null> => {
    return from(source).defaultIfEmpty(defaultValue);
}

export const distinct = <TElement, TKey>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).distinct(selector, keyComparator);
}

export const elementAt = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement => {
    return from(source).elementAt(index);
}

export const elementAtOrDefault = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement | null => {
    return from(source).elementAtOrDefault(index);
}

export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};

export const except = <TElement>(
    source: Iterable<TElement>,
    second: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | null,
    orderComparator?: OrderComparator<TElement> | null
): IEnumerable<TElement> => {
    return from(source).except(from(second), comparator, orderComparator);
}

export const first = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return from(source).first(predicate);
}

export const firstOrDefault = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return from(source).firstOrDefault(predicate);
}

export const forEach = <TElement>(
    source: Iterable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return from(source).forEach(action);
}

export const from = <TElement>(iterable: Iterable<TElement>): IEnumerable<TElement> => {
    return Enumerable.from(iterable);
};

export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return from(source).groupBy(keySelector, keyComparator);
}

export const groupJoin = <TElement, TInner, TKey, TResult>(
    source: Iterable<TElement>,
    inner: Iterable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TResult> => {
    return from(source).groupJoin(from(inner), outerKeySelector, innerKeySelector, resultSelector, keyComparator);
}

export const intersect = <TElement>(
    source: Iterable<TElement>,
    second: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | null,
    orderComparator?: OrderComparator<TElement> | null
): IEnumerable<TElement> => {
    return from(source).intersect(from(second), comparator, orderComparator);
}

export const join = <TElement, TInner, TKey, TResult>(
    source: Iterable<TElement>,
    inner: Iterable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, TInner, TResult>,
    keyComparator?: EqualityComparator<TKey>,
    leftJoin?: boolean
): IEnumerable<TResult> => {
    return from(source).join(from(inner), outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
}

export const last = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return from(source).last(predicate);
}

export const lastOrDefault = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return from(source).lastOrDefault(predicate);
}

export const max = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).max(selector);
}

export const min = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).min(selector);
}

export const ofType = <TElement, TResult extends ObjectType>(
    source: Iterable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return from(source).ofType(type);
}

export const orderBy = <TElement, TKey>(
    source: Iterable<TElement>,
    selector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderBy(selector, comparator);
}

export const orderByDescending = <TElement, TKey>(
    source: Iterable<TElement>,
    selector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderByDescending(selector, comparator);
}

export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
}

export const partition = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>] => {
    return from(source).partition(predicate);
}

export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
}

export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};

export const repeat = <TElement>(element: TElement, count: number): IEnumerable<TElement> => {
    return Enumerable.repeat(element, count);
};

export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
}

export const scan = <TElement, TAccumulate = TElement>(
    source: Iterable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return from(source).scan(accumulator, seed);
}

export const select = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: Selector<TElement, TResult>
): IEnumerable<TResult> => {
    return from(source).select(selector);
}

export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
}

export const sequenceEqual = <TElement>(
    source: Iterable<TElement>,
    second: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return from(source).sequenceEqual(from(second), comparator);
}

export const single = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return from(source).single(predicate);
}

export const singleOrDefault = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return from(source).singleOrDefault(predicate);
}

export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
}

export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skipLast(count);
}

export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
}

export const sum = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return from(source).sum(selector);
}

export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
}

export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
}

export const takeWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).takeWhile(predicate);
}

export const toArray = <TElement>(source: Iterable<TElement>): TElement[] => {
    return from(source).toArray();
}

export const toDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): Dictionary<TKey, TValue> => {
    return from(source).toDictionary(keySelector, valueSelector, valueComparator);
}

export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>,
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
}

export const toImmutableDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableDictionary<TKey, TValue> => {
    return from(source).toImmutableDictionary(keySelector, valueSelector, valueComparator);
}

export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
}

export const toImmutableSet = <TElement>(
    source: Iterable<TElement>,
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
}

export const toImmutableSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): ImmutableSortedDictionary<TKey, TValue> => {
    return from(source).toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
}

export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
}

export const toIndexableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IndexableList<TElement> => {
    return from(source).toIndexableList(comparator);
}

export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
}

export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
}

export const toLookup = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>
): ILookup<TKey, TValue> => {
    return from(source).toLookup(keySelector, valueSelector, keyComparator);
}

export const toSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): SortedDictionary<TKey, TValue> => {
    return from(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
}

export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
}

export const union = <TElement>(
    source: Iterable<TElement>,
    second: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(from(second), comparator);
}

export const where = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return from(source).where(predicate);
}

export const zip = <TElement, TSecond, TResult = [TElement, TSecond]>(
    source: Iterable<TElement>,
    second: Iterable<TSecond>,
    zipper?: Zipper<TElement, TSecond, TResult>
): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> => {
    return from(source).zip(from(second), zipper);
}
