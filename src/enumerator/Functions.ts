import {Dictionary} from "../dictionary/Dictionary";
import {SortedDictionary} from "../dictionary/SortedDictionary";
import {ILookup} from "../lookup/ILookup";
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
import {EnumerableStatic} from "./EnumerableStatic";
import {IEnumerable} from "./IEnumerable";
import {IGroup} from "./IGroup";
import {IOrderedEnumerable} from "./IOrderedEnumerable";

export const aggregate = <TElement, TAccumulate = TElement, TResult = TAccumulate>(
    source: IEnumerable<TElement>,
    accumulator: (accumulator: TAccumulate, element: TElement) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: (accumulator: TAccumulate) => TResult
): TAccumulate | TResult => {
    return EnumerableStatic.aggregate(source, accumulator, seed, resultSelector);
}

export const all = <TElement>(
    source: IEnumerable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return EnumerableStatic.all(source, predicate);
}

export const any = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return EnumerableStatic.any(source, predicate);
}

export const append = <TElement>(
    source: IEnumerable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return EnumerableStatic.append(source, element);
}

export const average = <TElement>(
    source: IEnumerable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return EnumerableStatic.average(source, selector);
}

export const cast = <TElement, TResult>(
    source: IEnumerable<TElement>
): IEnumerable<TResult> => {
    return EnumerableStatic.cast<TElement, TResult>(source);
}

export const chunk = <TElement>(
    source: IEnumerable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return EnumerableStatic.chunk(source, size);
}

export const concat = <TElement>(
    source: IEnumerable<TElement>,
    second: IEnumerable<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.concat(source, second);
}

export const contains = <TElement>(
    source: IEnumerable<TElement>,
    element: TElement
): boolean => {
    return EnumerableStatic.contains(source, element);
}

export const count = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    return EnumerableStatic.count(source, predicate);
}

export const defaultIfEmpty = <TElement>(
    source: IEnumerable<TElement>,
    defaultValue?: TElement | null
): IEnumerable<TElement | null> => {
    return EnumerableStatic.defaultIfEmpty(source, defaultValue);
}

export const distinct = <TElement>(
    source: IEnumerable<TElement>,
    selector?: (element: TElement) => any
): IEnumerable<TElement> => {
    return EnumerableStatic.distinct(source, selector);
}

export const elementAt = <TElement>(
    source: IEnumerable<TElement>,
    index: number
): TElement => {
    return EnumerableStatic.elementAt(source, index);
}

export const elementAtOrDefault = <TElement>(
    source: IEnumerable<TElement>,
    index: number
): TElement | null => {
    return EnumerableStatic.elementAtOrDefault(source, index);
}

export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};

export const except = <TElement>(
    source: IEnumerable<TElement>,
    second: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement> | null,
    orderComparator?: OrderComparator<TElement> | null
): IEnumerable<TElement> => {
    return EnumerableStatic.except(source, second, comparator, orderComparator);
}

export const first = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return EnumerableStatic.first(source, predicate);
}

export const firstOrDefault = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return EnumerableStatic.firstOrDefault(source, predicate);
}

export const forEach = <TElement>(
    source: IEnumerable<TElement>,
    action: IndexedAction<TElement>
): void => {
    return EnumerableStatic.forEach(source, action);
}

export const from = <TElement>(iterable: Iterable<TElement>): IEnumerable<TElement> => {
    return Enumerable.from(iterable);
};

export const groupBy = <TElement, TKey>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return EnumerableStatic.groupBy(source, keySelector, keyComparator);
}

export const groupJoin = <TElement, TInner, TKey, TResult>(
    source: IEnumerable<TElement>,
    inner: IEnumerable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TResult> => {
    return EnumerableStatic.groupJoin(source, inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
}

export const intersect = <TElement>(
    source: IEnumerable<TElement>,
    second: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement> | null,
    orderComparator?: OrderComparator<TElement> | null
): IEnumerable<TElement> => {
    return EnumerableStatic.intersect(source, second, comparator, orderComparator);
}

export const join = <TElement, TInner, TKey, TResult>(
    source: IEnumerable<TElement>,
    inner: IEnumerable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, TInner, TResult>,
    keyComparator?: EqualityComparator<TKey>,
    leftJoin?: boolean
): IEnumerable<TResult> => {
    return EnumerableStatic.join(source, inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
}

export const last = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return EnumerableStatic.last(source, predicate);
}

export const lastOrDefault = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return EnumerableStatic.lastOrDefault(source, predicate);
}

export const max = <TElement>(
    source: IEnumerable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return EnumerableStatic.max(source, selector);
}

export const min = <TElement>(
    source: IEnumerable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return EnumerableStatic.min(source, selector);
}

export const ofType = <TElement, TResult extends ObjectType>(
    source: IEnumerable<TElement>,
    type: TResult
): IEnumerable<InferredType<TResult>> => {
    return EnumerableStatic.ofType<TElement, TResult>(source, type);
}

export const orderBy = <TElement, TKey>(
    source: IEnumerable<TElement>,
    selector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return EnumerableStatic.orderBy(source, selector, comparator);
}

export const orderByDescending = <TElement, TKey>(
    source: IEnumerable<TElement>,
    selector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return EnumerableStatic.orderByDescending(source, selector, comparator);
}

export const pairwise = <TElement>(
    source: IEnumerable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return EnumerableStatic.pairwise(source, resultSelector);
}

export const partition = <TElement>(
    source: IEnumerable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>] => {
    return EnumerableStatic.partition(source, predicate);
}

export const prepend = <TElement>(
    source: IEnumerable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return EnumerableStatic.prepend(source, element);
}

export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};

export const repeat = <TElement>(element: TElement, count: number): IEnumerable<TElement> => {
    return Enumerable.repeat(element, count);
};

export const reverse = <TElement>(source: IEnumerable<TElement>): IEnumerable<TElement> => {
    return EnumerableStatic.reverse(source);
}

export const scan = <TElement, TAccumulate = TElement>(
    source: IEnumerable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return EnumerableStatic.scan(source, accumulator, seed);
}

export const select = <TElement, TResult>(
    source: IEnumerable<TElement>,
    selector: Selector<TElement, TResult>
): IEnumerable<TResult> => {
    return EnumerableStatic.select(source, selector);
}

export const selectMany = <TElement, TResult>(
    source: IEnumerable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return EnumerableStatic.selectMany(source, selector);
}

export const sequenceEqual = <TElement>(
    source: IEnumerable<TElement>,
    second: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement>
): boolean => {
    return EnumerableStatic.sequenceEqual(source, second, comparator);
}

export const single = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): TElement => {
    return EnumerableStatic.single(source, predicate);
}

export const singleOrDefault = <TElement>(
    source: IEnumerable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null => {
    return EnumerableStatic.singleOrDefault(source, predicate);
}

export const skip = <TElement>(
    source: IEnumerable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return EnumerableStatic.skip(source, count);
}

export const skipLast = <TElement>(
    source: IEnumerable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return EnumerableStatic.skipLast(source, count);
}

export const skipWhile = <TElement>(
    source: IEnumerable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.skipWhile(source, predicate);
}

export const sum = <TElement>(
    source: IEnumerable<TElement>,
    selector?: Selector<TElement, number>
): number => {
    return EnumerableStatic.sum(source, selector);
}

export const take = <TElement>(
    source: IEnumerable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return EnumerableStatic.take(source, count);
}

export const takeLast = <TElement>(
    source: IEnumerable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return EnumerableStatic.takeLast(source, count);
}

export const takeWhile = <TElement>(
    source: IEnumerable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.takeWhile(source, predicate);
}

export const toArray = <TElement>(source: IEnumerable<TElement>): TElement[] => {
    return EnumerableStatic.toArray(source);
}

export const toDictionary = <TElement, TKey, TValue>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): Dictionary<TKey, TValue> => {
    return EnumerableStatic.toDictionary(source, keySelector, valueSelector, valueComparator);
}

export const toEnumerableSet = <TElement>(
    source: IEnumerable<TElement>,
): IEnumerable<TElement> => {
    return EnumerableStatic.toEnumerableSet(source);
}

export const toIndexableList = <TElement>(
    source: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.toIndexableList(source, comparator);
}

export const toLinkedList = <TElement>(
    source: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.toLinkedList(source, comparator);
}

export const toList = <TElement>(
    source: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.toList(source, comparator);
}

export const toLookup = <TElement, TKey, TValue>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>
): ILookup<TKey, TValue> => {
    return EnumerableStatic.toLookup(source, keySelector, valueSelector, keyComparator);
}

export const toSortedDictionary = <TElement, TKey, TValue>(
    source: IEnumerable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): SortedDictionary<TKey, TValue> => {
    return EnumerableStatic.toSortedDictionary(source, keySelector, valueSelector, keyComparator, valueComparator);
}

export const toSortedSet = <TElement>(
    source: IEnumerable<TElement>,
    comparator?: OrderComparator<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.toSortedSet(source, comparator);
}

export const union = <TElement>(
    source: IEnumerable<TElement>,
    second: IEnumerable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.union(source, second, comparator);
}

export const where = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): IEnumerable<TElement> => {
    return EnumerableStatic.where(asEnumerable(source), predicate);
}

export const zip = <TElement, TSecond, TResult = [TElement, TSecond]>(
    source: IEnumerable<TElement>,
    second: IEnumerable<TSecond>,
    zipper?: Zipper<TElement, TSecond, TResult>
): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> => {
    return EnumerableStatic.zip(source, second, zipper);
}

const asEnumerable = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source);
}