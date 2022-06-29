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
    Enumerable,
    IEnumerable,
    IGroup,
    ILookup,
    IOrderedEnumerable,
    List,
    Dictionary,
    IndexableList,
    EnumerableSet, SortedSet
} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";
import {PairwiseSelector} from "../shared/PairwiseSelector";

export abstract class EnumerableStatic {
    protected constructor() {
    }

    public static aggregate<TElement, TAccumulate, TResult>(source: IEnumerable<TElement>, accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return new Enumerable(source).aggregate(accumulator, seed, resultSelector);
    }

    public static all<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): boolean {
        return new Enumerable(source).all(predicate);
    }

    public static any<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): boolean {
        return new Enumerable(source).any(predicate);
    }

    public static append<TElement>(source: IEnumerable<TElement>, element: TElement): IEnumerable<TElement> {
        return new Enumerable(source).append(element);
    }

    public static average<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).average(selector);
    }

    public static chunk<TElement>(source: IEnumerable<TElement>, size: number): IEnumerable<IEnumerable<TElement>> {
        return new Enumerable(source).chunk(size);
    }

    public static concat<TElement>(source: IEnumerable<TElement>, enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).concat(enumerable);
    }

    public static contains<TElement>(source: IEnumerable<TElement>, element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return new Enumerable(source).contains(element, comparator);
    }

    public static count<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): number {
        return new Enumerable(source).count(predicate);
    }

    public static defaultIfEmpty<TElement>(source: IEnumerable<TElement>, value?: TElement): IEnumerable<TElement> {
        return new Enumerable(source).defaultIfEmpty(value);
    }

    public static distinct<TElement, TKey>(source: IEnumerable<TElement>, keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return new Enumerable(source).distinct(keySelector, keyComparator);
    }

    public static elementAt<TElement>(source: IEnumerable<TElement>, index: number): TElement {
        return new Enumerable(source).elementAt(index);
    }

    public static elementAtOrDefault<TElement>(source: IEnumerable<TElement>, index: number): TElement {
        return new Enumerable(source).elementAtOrDefault(index);
    }

    public static except<TElement>(source: IEnumerable<TElement>, enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).except(enumerable, comparator, orderComparator);
    }

    public static first<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).first(predicate);
    }

    public static firstOrDefault<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).firstOrDefault(predicate);
    }

    public static forEach<TElement>(source: IEnumerable<TElement>, action: IndexedAction<TElement>): void {
        new Enumerable(source).forEach(action);
    }

    public static groupBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>> {
        return new Enumerable(source).groupBy(keySelector, keyComparator);
    }

    public static groupJoin<TOuter, TInner, TKey, TResult>(source: IEnumerable<TOuter>, innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TOuter, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TOuter, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        return new Enumerable(source).groupJoin(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public static intersect<TElement>(source: IEnumerable<TElement>, enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).intersect(enumerable, comparator, orderComparator);
    }

    public static join<TOuter, TInner, TKey, TResult>(source: IEnumerable<TOuter>, innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TOuter, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TOuter, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return new Enumerable(source).join(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public static last<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).last(predicate);
    }

    public static lastOrDefault<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).lastOrDefault(predicate);
    }

    public static max<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).max(selector);
    }

    public static min<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).min(selector);
    }

    public static orderBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return new Enumerable(source).orderBy(keySelector, comparator);
    }

    public static orderByDescending<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return new Enumerable(source).orderByDescending(keySelector, comparator);
    }

    public static pairwise<TElement>(source: IEnumerable<TElement>, resultSelector: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return new Enumerable(source).pairwise(resultSelector);
    }

    public static prepend<TElement>(source: IEnumerable<TElement>, item: TElement): IEnumerable<TElement> {
        return new Enumerable(source).prepend(item);
    }

    public static reverse<TElement>(source: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).reverse();
    }

    public static scan<TElement, TAccumulate = TElement>(source: IEnumerable<TElement>,  accumulator: Accumulator<TElement, TAccumulate>, seed: TAccumulate): IEnumerable<TAccumulate> {
        return new Enumerable(source).scan(accumulator, seed);
    }

    public static select<TElement, TResult>(source: IEnumerable<TElement>, selector: Selector<TElement, TResult>): IEnumerable<TResult> {
        return new Enumerable(source).select(selector);
    }

    public static selectMany<TElement, TResult>(source: IEnumerable<TElement>, selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return new Enumerable(source).selectMany(selector);
    }

    public static sequenceEqual<TElement>(source: IEnumerable<TElement>, enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        return new Enumerable(source).sequenceEqual(enumerable, comparator);
    }

    public static single<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).single(predicate);
    }

    public static singleOrDefault<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).singleOrDefault(predicate);
    }

    public static skip<TElement>(source: IEnumerable<TElement>, count: number): IEnumerable<TElement> {
        return new Enumerable(source).skip(count);
    }

    public static skipLast<TElement>(source: IEnumerable<TElement>, count: number): IEnumerable<TElement> {
        return new Enumerable(source).skipLast(count);
    }

    public static skipWhile<TElement>(source: IEnumerable<TElement>, predicate?: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).skipWhile(predicate);
    }

    public static sum<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).sum(selector);
    }

    public static take<TElement>(source: IEnumerable<TElement>, count: number): IEnumerable<TElement> {
        return new Enumerable(source).take(count);
    }

    public static takeLast<TElement>(source: IEnumerable<TElement>, count: number): IEnumerable<TElement> {
        return new Enumerable(source).takeLast(count);
    }

    public static takeWhile<TElement>(source: IEnumerable<TElement>, predicate?: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).takeWhile(predicate);
    }

    public static toArray<TElement>(source: IEnumerable<TElement>): TElement[] {
        return new Enumerable(source).toArray();
    }

    public static toDictionary<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return new Enumerable(source).toDictionary(keySelector, valueSelector, valueComparator);
    }

    public static toEnumerableSet(source: IEnumerable<any>): EnumerableSet<any> {
        return new Enumerable(source).toEnumerableSet();
    }

    public static toIndexableList<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IndexableList<TElement> {
        return new Enumerable(source).toIndexableList(comparator);
    }

    public static toList<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): List<TElement> {
        return new Enumerable(source).toList(comparator);
    }

    public static toLookup<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return new Enumerable(source).toLookup(keySelector, valueSelector, keyComparator);
    }

    public static toSortedDictionary<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        return new Enumerable(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public static toSortedSet<TElement>(source: IEnumerable<TElement>, comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return new Enumerable(source).toSortedSet(comparator);
    }

    public static union<TElement>(source: IEnumerable<TElement>, enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).union(enumerable, comparator);
    }

    public static where<TElement>(source: IEnumerable<TElement>, predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).where(predicate);
    }

    public static zip<TElement, TSecond, TResult = [TElement, TSecond]>(source: IEnumerable<TElement>, enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return new Enumerable(source).zip(enumerable, zipper);
    }
}
