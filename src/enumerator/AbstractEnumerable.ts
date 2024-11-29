import { Dictionary } from "../dictionary/Dictionary";
import { KeyValuePair } from "../dictionary/KeyValuePair";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import {
    from,
    IEnumerable,
    ImmutableDictionary,
    ImmutableList,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    PriorityQueue,
    Queue,
    Stack
} from "../imports";
import { LinkedList } from "../list/LinkedList";
import { List } from "../list/List";
import { ILookup } from "../lookup/ILookup";
import { EnumerableSet } from "../set/EnumerableSet";
import { SortedSet } from "../set/SortedSet";
import { Accumulator } from "../shared/Accumulator";
import { Comparators } from "../shared/Comparators";
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
import { EnumerableStatic } from "./EnumerableStatic";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

export abstract class AbstractEnumerable<TElement> implements IEnumerable<TElement> {
    protected readonly comparer: EqualityComparator<TElement>;

    protected constructor(comparator?: EqualityComparator<TElement>) {
        this.comparer = comparator ?? Comparators.equalityComparator;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return EnumerableStatic.aggregate(this, accumulator, seed, resultSelector);
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate>, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>> {
        return EnumerableStatic.aggregateBy(this, keySelector, seedSelector, accumulator, keyComparator);
    }

    public all(predicate: Predicate<TElement>): boolean {
        return EnumerableStatic.all(this, predicate);
    }

    public any(predicate?: Predicate<TElement>): boolean {
        return EnumerableStatic.any(this, predicate);
    }

    public append(element: TElement): IEnumerable<TElement> {
        return EnumerableStatic.append(this, element);
    }

    public asEnumerable(): IEnumerable<TElement> {
        return EnumerableStatic.asEnumerable(this);
    }

    public average(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.average(this, selector);
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return EnumerableStatic.cast(this);
    }

    public chunk(size: number): IEnumerable<IEnumerable<TElement>> {
        return EnumerableStatic.chunk(this, size);
    }

    public combinations(size?: number): IEnumerable<IEnumerable<TElement>> {
        return EnumerableStatic.combinations(this, size);
    }

    public concat(iterable: Iterable<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.concat(this, iterable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return EnumerableStatic.contains(this, element, comparator);
    }

    public count(predicate?: Predicate<TElement>): number {
        return EnumerableStatic.count(this, predicate);
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>> {
        return EnumerableStatic.countBy(this, keySelector, comparator);
    }

    public cycle(count?: number): IEnumerable<TElement> {
        return EnumerableStatic.cycle(this, count);
    }

    public defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null> {
        return EnumerableStatic.defaultIfEmpty(this as IEnumerable<TElement | null>, value);
    }

    public distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.distinct(this, keyComparator);
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return EnumerableStatic.distinctBy(this, keySelector, keyComparator);
    }

    public elementAt(index: number): TElement {
        return EnumerableStatic.elementAt(this, index);
    }

    public elementAtOrDefault(index: number): TElement | null {
        return EnumerableStatic.elementAtOrDefault(this, index);
    }

    public except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null): IEnumerable<TElement> {
        comparator = comparator ?? this.comparer;
        return EnumerableStatic.except(this, iterable, comparator);
    }

    public first(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.first(this, predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return EnumerableStatic.firstOrDefault(this, predicate);
    }

    public forEach(action: IndexedAction<TElement>) {
        let index: number = 0;
        for (const element of this) {
            action(element, index++);
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>> {
        return EnumerableStatic.groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        return EnumerableStatic.groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public index(): IEnumerable<[number, TElement]> {
        return EnumerableStatic.index(this);
    }

    public intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null): IEnumerable<TElement> {
        comparator = comparator ?? this.comparer;
        return EnumerableStatic.intersect(this, iterable, comparator);
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator> {
        return EnumerableStatic.intersperse(this, separator);
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return EnumerableStatic.join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.last(this, predicate);
    }

    public lastOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return EnumerableStatic.lastOrDefault(this, predicate);
    }

    public max(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.max(this, selector);
    }

    public maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return EnumerableStatic.maxBy(this, keySelector, comparator);
    }

    public min(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.min(this, selector);
    }

    public minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return EnumerableStatic.minBy(this, keySelector, comparator);
    }

    public none(predicate?: Predicate<TElement>): boolean {
        return EnumerableStatic.none(this, predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return EnumerableStatic.ofType(this, type);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return EnumerableStatic.orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return EnumerableStatic.orderByDescending(this, keySelector, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return EnumerableStatic.pairwise(this, resultSelector);
    }

    public partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>] {
        return EnumerableStatic.partition(this, predicate);
    }

    public permutations(size?: number): IEnumerable<IEnumerable<TElement>> {
        return EnumerableStatic.permutations(this, size);
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        return EnumerableStatic.prepend(this, element);
    }

    public product(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.product(this, selector);
    }

    public reverse(): IEnumerable<TElement> {
        return EnumerableStatic.reverse(this);
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return EnumerableStatic.scan(this, accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult> {
        return EnumerableStatic.select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return EnumerableStatic.selectMany(this, selector);
    }

    public sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return EnumerableStatic.sequenceEqual(this, iterable, comparator);
    }

    public shuffle(): IEnumerable<TElement> {
        return EnumerableStatic.shuffle(this);
    }

    public single(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.single(this, predicate);
    }

    public singleOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return EnumerableStatic.singleOrDefault(this, predicate);
    }

    public skip(count: number): IEnumerable<TElement> {
        return EnumerableStatic.skip(this, count);
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return EnumerableStatic.skipLast(this, count);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.skipWhile(this, predicate);
    }

    public span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>] {
        return EnumerableStatic.span(this, predicate);
    }

    public step(step: number): IEnumerable<TElement> {
        return EnumerableStatic.step(this, step);
    }

    public sum(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.sum(this, selector);
    }

    public take(count: number): IEnumerable<TElement> {
        return EnumerableStatic.take(this, count);
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return EnumerableStatic.takeLast(this, count);
    }

    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.takeWhile(this, predicate);
    }

    public toArray(): TElement[] {
        return EnumerableStatic.toArray(this);
    }

    public toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return EnumerableStatic.toDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): EnumerableSet<TElement> {
        return EnumerableStatic.toEnumerableSet(this);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        return EnumerableStatic.toImmutableDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return EnumerableStatic.toImmutableList(this, comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return EnumerableStatic.toImmutableQueue(this, comparator);
    }

    public toImmutableSet(): ImmutableSet<TElement> {
        return EnumerableStatic.toImmutableSet(this);
    }

    public toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue> {
        return EnumerableStatic.toImmutableSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return EnumerableStatic.toImmutableSortedSet(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return EnumerableStatic.toImmutableStack(this, comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        comparator ??= this.comparer;
        return EnumerableStatic.toLinkedList(this, comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        comparator ??= this.comparer;
        return EnumerableStatic.toList(this, comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return EnumerableStatic.toLookup(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue> {
        return EnumerableStatic.toMap(this, keySelector, valueSelector);
    }

    public toObject<TKey extends string | number | symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue> {
        return EnumerableStatic.toObject(this, keySelector, valueSelector);
    }

    public toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement> {
        return EnumerableStatic.toPriorityQueue(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement> {
        comparator ??= this.comparer;
        return EnumerableStatic.toQueue(this, comparator);
    }

    public toSet(): Set<TElement> {
        return EnumerableStatic.toSet(this);
    }

    public toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        return EnumerableStatic.toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return EnumerableStatic.toSortedSet(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Stack<TElement> {
        comparator ??= this.comparer;
        return EnumerableStatic.toStack(this, comparator);
    }

    public union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparer;
        return EnumerableStatic.union(this, iterable, comparator);
    }

    public unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return EnumerableStatic.unionBy(this, iterable, keySelector, comparator);
    }

    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.where(this, predicate);
    }

    public windows(size: number): IEnumerable<IEnumerable<TElement>> {
        return EnumerableStatic.windows(this, size);
    }

    public zip<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return EnumerableStatic.zip(this, iterable, zipper);
    }

    protected getIterableSize(iterable: Iterable<TElement>): number {
        if (iterable instanceof Array) {
            return iterable.length;
        }
        if (iterable instanceof Set) {
            return iterable.size;
        }
        if (iterable instanceof Map) {
            return iterable.size;
        }
        if (iterable instanceof AbstractEnumerable) {
            return iterable.count();
        }
        return from(iterable).count();
    }

    abstract [Symbol.iterator](): Iterator<TElement>;
}
