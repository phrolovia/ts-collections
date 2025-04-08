import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    CircularLinkedList,
    Dictionary,
    Enumerable,
    EnumerableSet,
    IEnumerable,
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
import { IndexedPredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";

export abstract class EnumerableStatic {

    /* istanbul ignore next */
    private constructor() {
    }

    public static aggregate<TElement, TAccumulate = TElement, TResult = TAccumulate>(source: IEnumerable<TElement>, accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return new Enumerable(source).aggregate(accumulator, seed, resultSelector);
    }

    public static aggregateBy<TElement, TKey, TAccumulate = TElement>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>> {
        return new Enumerable(source).aggregateBy(keySelector, seedSelector, accumulator, keyComparator);
    }

    public static all<TElement>(source: IEnumerable<TElement>, predicate: Predicate<TElement>): boolean {
        return new Enumerable(source).all(predicate);
    }

    public static any<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): boolean {
        return new Enumerable(source).any(predicate);
    }

    public static append<TElement>(source: IEnumerable<TElement>, element: TElement): IEnumerable<TElement> {
        return new Enumerable(source).append(element);
    }

    public static asEnumerable<TElement>(source: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).asEnumerable();
    }

    public static average<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).average(selector);
    }

    public static cast<TElement, TResult>(source: IEnumerable<TElement>): IEnumerable<TResult> {
        return new Enumerable(source).cast<TResult>();
    }

    public static chunk<TElement>(source: IEnumerable<TElement>, size: number): IEnumerable<IEnumerable<TElement>> {
        return new Enumerable(source).chunk(size);
    }

    public static combinations<TElement>(source: IEnumerable<TElement>, size?: number): IEnumerable<IEnumerable<TElement>> {
        return new Enumerable(source).combinations(size);
    }

    public static concat<TElement>(source: Iterable<TElement>, other: Iterable<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).concat(other);
    }

    public static contains<TElement>(source: IEnumerable<TElement>, element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return new Enumerable(source).contains(element, comparator);
    }

    public static count<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): number {
        return new Enumerable(source).count(predicate);
    }

    public static countBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>> {
        return new Enumerable(source).countBy(keySelector, keyComparator);
    }

    public static cycle<TElement>(source: IEnumerable<TElement>, count?: number): IEnumerable<TElement> {
        return new Enumerable(source).cycle(count);
    }

    public static defaultIfEmpty<TElement>(source: IEnumerable<TElement>, value?: TElement | null): IEnumerable<TElement | null> {
        return new Enumerable(source).defaultIfEmpty(value);
    }

    public static distinct<TElement>(source: IEnumerable<TElement>, keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).distinct(keyComparator);
    }

    public static distinctBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return new Enumerable(source).distinctBy(keySelector, keyComparator);
    }

    public static elementAt<TElement>(source: IEnumerable<TElement>, index: number): TElement {
        return new Enumerable(source).elementAt(index);
    }

    public static elementAtOrDefault<TElement>(source: IEnumerable<TElement>, index: number): TElement | null {
        return new Enumerable(source).elementAtOrDefault(index);
    }

    public static except<TElement>(source: IEnumerable<TElement>, other: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).except(other, comparator);
    }

    public static exceptBy<TElement, TKey>(source: IEnumerable<TElement>, other: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        return new Enumerable(source).exceptBy(other, keySelector, keyComparator);
    }

    public static first<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).first(predicate);
    }

    public static firstOrDefault<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement | null {
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

    public static index<TElement>(source: IEnumerable<TElement>): IEnumerable<[number, TElement]> {
        return new Enumerable(source).index();
    }

    public static intersect<TElement>(source: IEnumerable<TElement>, other: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).intersect(other, comparator);
    }

    public static intersectBy<TElement, TKey>(source: IEnumerable<TElement>, other: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        return new Enumerable(source).intersectBy(other, keySelector, keyComparator);
    }

    public static intersperse<TElement, TSeparator = TElement>(source: IEnumerable<TElement>, separator: TSeparator): IEnumerable<TElement | TSeparator> {
        return new Enumerable(source).intersperse(separator);
    }

    public static join<TOuter, TInner, TKey, TResult>(source: IEnumerable<TOuter>, innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TOuter, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TOuter, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return new Enumerable(source).join(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public static last<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).last(predicate);
    }

    public static lastOrDefault<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement | null {
        return new Enumerable(source).lastOrDefault(predicate);
    }

    public static max<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).max(selector);
    }

    public static maxBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return new Enumerable(source).maxBy(keySelector, comparator);
    }

    public static min<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).min(selector);
    }

    public static minBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return new Enumerable(source).minBy(keySelector, comparator);
    }

    public static none<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): boolean {
        return new Enumerable(source).none(predicate);
    }

    public static ofType<TElement, TResult extends ObjectType>(source: IEnumerable<TElement>, type: TResult): IEnumerable<InferredType<TResult>> {
        return new Enumerable<TElement>(source).ofType<TResult>(type);
    }

    public static orderBy<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return new Enumerable(source).orderBy(keySelector, comparator);
    }

    public static orderByDescending<TElement, TKey>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return new Enumerable(source).orderByDescending(keySelector, comparator);
    }

    public static pairwise<TElement>(source: IEnumerable<TElement>, resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return new Enumerable(source).pairwise(resultSelector);
    }

    public static partition<TElement>(source: IEnumerable<TElement>, predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>] {
        return new Enumerable(source).partition(predicate);
    }

    public static permutations<TElement>(source: IEnumerable<TElement>, size?: number): IEnumerable<IEnumerable<TElement>> {
        return new Enumerable(source).permutations(size);
    }

    public static prepend<TElement>(source: IEnumerable<TElement>, item: TElement): IEnumerable<TElement> {
        return new Enumerable(source).prepend(item);
    }

    public static product<TElement>(source: IEnumerable<TElement>, selector?: Selector<TElement, number>): number {
        return new Enumerable(source).product(selector);
    }

    public static reverse<TElement>(source: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).reverse();
    }

    public static scan<TElement, TAccumulate = TElement>(source: IEnumerable<TElement>, accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return new Enumerable(source).scan(accumulator, seed);
    }

    public static select<TElement, TResult>(source: IEnumerable<TElement>, selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult> {
        return new Enumerable(source).select(selector);
    }

    public static selectMany<TElement, TResult>(source: IEnumerable<TElement>, selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return new Enumerable(source).selectMany(selector);
    }

    public static sequenceEqual<TElement>(source: IEnumerable<TElement>, other: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        return new Enumerable(source).sequenceEqual(other, comparator);
    }

    public static shuffle<TElement>(source: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).shuffle();
    }

    public static single<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement {
        return new Enumerable(source).single(predicate);
    }

    public static singleOrDefault<TElement>(source: IEnumerable<TElement>, predicate?: Predicate<TElement>): TElement | null {
        return new Enumerable(source).singleOrDefault(predicate);
    }

    public static skip<TElement>(source: IEnumerable<TElement>, count: number): IEnumerable<TElement> {
        return new Enumerable(source).skip(count);
    }

    public static skipLast<TElement>(source: IEnumerable<TElement>, count: number): IEnumerable<TElement> {
        return new Enumerable(source).skipLast(count);
    }

    public static skipWhile<TElement>(source: IEnumerable<TElement>, predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).skipWhile(predicate);
    }

    public static span<TElement>(source: IEnumerable<TElement>, predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>] {
        return new Enumerable(source).span(predicate);
    }

    public static step<TElement>(source: IEnumerable<TElement>, step: number): IEnumerable<TElement> {
        return new Enumerable(source).step(step);
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

    public static takeWhile<TElement>(source: IEnumerable<TElement>, predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).takeWhile(predicate);
    }

    public static toArray<TElement>(source: IEnumerable<TElement>): TElement[] {
        return new Enumerable(source).toArray();
    }

    public static toCircularLinkedList<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): CircularLinkedList<TElement> {
        return new Enumerable(source).toCircularLinkedList(comparator);
    }

    public static toDictionary<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return new Enumerable(source).toDictionary(keySelector, valueSelector, valueComparator);
    }

    public static toEnumerableSet(source: IEnumerable<any>): EnumerableSet<any> {
        return new Enumerable(source).toEnumerableSet();
    }

    public static toImmutableDictionary<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        return new Enumerable(source).toImmutableDictionary(keySelector, valueSelector, valueComparator);
    }

    public static toImmutableList<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return new Enumerable(source).toImmutableList(comparator);
    }

    public static toImmutablePriorityQueue<TElement>(source: IEnumerable<TElement>, comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement> {
        return new Enumerable(source).toImmutablePriorityQueue(comparator);
    }

    public static toImmutableQueue<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return new Enumerable(source).toImmutableQueue(comparator);
    }

    public static toImmutableSet<TElement>(source: IEnumerable<TElement>): ImmutableSet<TElement> {
        return new Enumerable(source).toImmutableSet();
    }

    public static toImmutableSortedDictionary<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue> {
        return new Enumerable(source).toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public static toImmutableSortedSet<TElement>(source: IEnumerable<TElement>, comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return new Enumerable(source).toImmutableSortedSet(comparator);
    }

    public static toImmutableStack<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return new Enumerable(source).toImmutableStack(comparator);
    }

    public static toLinkedList<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        return new Enumerable(source).toLinkedList(comparator);
    }

    public static toList<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): List<TElement> {
        return new Enumerable(source).toList(comparator);
    }

    public static toLookup<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return new Enumerable(source).toLookup(keySelector, valueSelector, keyComparator);
    }

    public static toMap<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue> {
        return new Enumerable(source).toMap(keySelector, valueSelector);
    }

    public static toObject<TElement, TKey extends string | number | symbol, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue> {
        return new Enumerable(source).toObject(keySelector, valueSelector);
    }

    public static toPriorityQueue<TElement>(source: IEnumerable<TElement>, comparator?: OrderComparator<TElement>): PriorityQueue<TElement> {
        return new Enumerable(source).toPriorityQueue(comparator);
    }

    public static toQueue<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Queue<TElement> {
        return new Enumerable(source).toQueue(comparator);
    }

    public static toSet<TElement>(source: IEnumerable<TElement>): Set<TElement> {
        return new Enumerable(source).toSet();
    }

    public static toSortedDictionary<TElement, TKey, TValue>(source: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        return new Enumerable(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public static toSortedSet<TElement>(source: IEnumerable<TElement>, comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return new Enumerable(source).toSortedSet(comparator);
    }

    public static toStack<TElement>(source: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Stack<TElement> {
        return new Enumerable(source).toStack(comparator);
    }

    public static union<TElement>(source: IEnumerable<TElement>, other: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).union(other, comparator);
    }

    public static unionBy<TElement, TKey>(source: IEnumerable<TElement>, other: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return new Enumerable(source).unionBy(other, keySelector, keyComparator);
    }

    public static where<TElement>(source: IEnumerable<TElement>, predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerable(source).where(predicate);
    }

    public static windows<TElement>(source: IEnumerable<TElement>, size: number): IEnumerable<IEnumerable<TElement>> {
        return new Enumerable(source).windows(size);
    }

    public static zip<TElement, TSecond, TResult = [TElement, TSecond]>(source: IEnumerable<TElement>, other: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return new Enumerable(source).zip(other, zipper);
    }
}
