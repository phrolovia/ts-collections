import { Dictionary } from "../dictionary/Dictionary";
import { KeyValuePair } from "../dictionary/KeyValuePair";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import {
    aggregate,
    aggregateBy,
    all,
    any,
    append,
    average,
    cast,
    chunk,
    CircularLinkedList,
    combinations,
    concat,
    contains,
    count,
    countBy,
    cycle,
    defaultIfEmpty,
    distinct,
    distinctBy,
    elementAt,
    elementAtOrDefault,
    except,
    exceptBy,
    first,
    firstOrDefault,
    from,
    groupBy,
    groupJoin,
    IEnumerable,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    index,
    intersect,
    intersectBy,
    intersperse,
    join,
    last,
    lastOrDefault,
    max,
    maxBy,
    min,
    minBy,
    none,
    ofType,
    orderBy,
    orderByDescending,
    pairwise,
    partition,
    permutations,
    prepend,
    PriorityQueue,
    product,
    Queue,
    reverse,
    scan,
    select,
    selectMany,
    sequenceEqual,
    shuffle,
    single,
    singleOrDefault,
    skip,
    skipLast,
    skipWhile,
    span,
    Stack,
    step,
    sum,
    take,
    takeLast,
    takeWhile,
    toArray,
    toCircularLinkedList,
    toDictionary,
    toEnumerableSet,
    toImmutableDictionary,
    toImmutableList,
    toImmutablePriorityQueue,
    toImmutableQueue,
    toImmutableSet,
    toImmutableSortedDictionary,
    toImmutableSortedSet,
    toImmutableStack,
    toLinkedList,
    toList,
    toLookup,
    toMap,
    toObject,
    toPriorityQueue,
    toQueue,
    toSet,
    toSortedDictionary,
    toSortedSet,
    toStack,
    union,
    unionBy,
    where,
    windows,
    zip
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
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

export abstract class AbstractEnumerable<TElement> implements IEnumerable<TElement> {
    protected readonly comparer: EqualityComparator<TElement>;

    protected constructor(comparator?: EqualityComparator<TElement>) {
        this.comparer = comparator ?? Comparators.equalityComparator;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return aggregate(this, accumulator, seed, resultSelector);
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>> {
        return aggregateBy(this, keySelector, seedSelector, accumulator, keyComparator);
    }

    public all(predicate: Predicate<TElement>): boolean {
        return all(this, predicate);
    }

    public any(predicate?: Predicate<TElement>): boolean {
        return any(this, predicate);
    }

    public append(element: TElement): IEnumerable<TElement> {
        return append(this, element);
    }

    public average(selector?: Selector<TElement, number>): number {
        return average(this, selector);
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return cast(this);
    }

    public chunk(size: number): IEnumerable<IEnumerable<TElement>> {
        return chunk(this, size);
    }

    public combinations(size?: number): IEnumerable<IEnumerable<TElement>> {
        return combinations(this, size);
    }

    public concat(iterable: Iterable<TElement>): IEnumerable<TElement> {
        return concat(this, iterable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return contains(this, element, comparator);
    }

    public count(predicate?: Predicate<TElement>): number {
        return count(this, predicate);
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>> {
        return countBy(this, keySelector, comparator);
    }

    public cycle(count?: number): IEnumerable<TElement> {
        return cycle(this, count);
    }

    public defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null> {
        return defaultIfEmpty(this as IEnumerable<TElement | null>, value);
    }

    public distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return distinct(this, keyComparator);
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return distinctBy(this, keySelector, keyComparator);
    }

    public elementAt(index: number): TElement {
        return elementAt(this, index);
    }

    public elementAtOrDefault(index: number): TElement | null {
        return elementAtOrDefault(this, index);
    }

    public except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        comparator = comparator ?? this.comparer;
        return except(this, iterable, comparator);
    }

    public exceptBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        return exceptBy(this, iterable, keySelector, keyComparator);
    }

    public first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public first(predicate?: Predicate<TElement>): TElement;
    public first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        return first(this, predicate as Predicate<TElement> | undefined);
    }

    public firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public firstOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        return firstOrDefault(this, predicate as Predicate<TElement> | undefined);
    }

    public forEach(action: IndexedAction<TElement>) {
        let index: number = 0;
        for (const element of this) {
            action(element, index++);
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>> {
        return groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        return groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public index(): IEnumerable<[number, TElement]> {
        return index(this);
    }

    public intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        comparator = comparator ?? this.comparer;
        return intersect(this, iterable, comparator);
    }

    public intersectBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        return intersectBy(this, iterable, keySelector, keyComparator);
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator> {
        return intersperse(this, separator);
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public last(predicate?: Predicate<TElement>): TElement;
    public last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        return last(this, predicate as Predicate<TElement> | undefined);
    }

    public lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public lastOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        return lastOrDefault(this, predicate as Predicate<TElement> | undefined);
    }

    public max(selector?: Selector<TElement, number>): number {
        return max(this, selector);
    }

    public maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return maxBy(this, keySelector, comparator);
    }

    public min(selector?: Selector<TElement, number>): number {
        return min(this, selector);
    }

    public minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return minBy(this, keySelector, comparator);
    }

    public none(predicate?: Predicate<TElement>): boolean {
        return none(this, predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return ofType(this, type);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return orderByDescending(this, keySelector, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return pairwise(this, resultSelector);
    }

    public partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];
    public partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];
    public partition<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): [IEnumerable<TElement>, IEnumerable<TElement>] | [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] {
        return partition(this, predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public permutations(size?: number): IEnumerable<IEnumerable<TElement>> {
        return permutations(this, size);
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        return prepend(this, element);
    }

    public product(selector?: Selector<TElement, number>): number {
        return product(this, selector);
    }

    public reverse(): IEnumerable<TElement> {
        return reverse(this);
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return scan(this, accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult> {
        return select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return selectMany(this, selector);
    }

    public sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return sequenceEqual(this, iterable, comparator);
    }

    public shuffle(): IEnumerable<TElement> {
        return shuffle(this);
    }

    public single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public single(predicate?: Predicate<TElement>): TElement;
    public single<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        return single(this, predicate as Predicate<TElement> | undefined);
    }

    public singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public singleOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public singleOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        return singleOrDefault(this, predicate as Predicate<TElement> | undefined);
    }

    public skip(count: number): IEnumerable<TElement> {
        return skip(this, count);
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return skipLast(this, count);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return skipWhile(this, predicate);
    }

    public span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>];
    public span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];
    public span<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
        return span(this, predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public step(stepNumber: number): IEnumerable<TElement> {
        return step(this, stepNumber);
    }

    public sum(selector?: Selector<TElement, number>): number {
        return sum(this, selector);
    }

    public take(count: number): IEnumerable<TElement> {
        return take(this, count);
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return takeLast(this, count);
    }

    public takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public takeWhile<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return takeWhile(this, predicate as IndexedPredicate<TElement>);
    }

    public toArray(): TElement[] {
        return toArray(this);
    }

    public toCircularLinkedList(comparator?: EqualityComparator<TElement, TElement>): CircularLinkedList<TElement> {
        return toCircularLinkedList(this, comparator);
    }

    public toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return toDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): EnumerableSet<TElement> {
        return toEnumerableSet(this);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        return toImmutableDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return toImmutableList(this, comparator);
    }

    public toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement> {
        return toImmutablePriorityQueue(this, comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return toImmutableQueue(this, comparator);
    }

    public toImmutableSet(): ImmutableSet<TElement> {
        return toImmutableSet(this);
    }

    public toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue> {
        return toImmutableSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return toImmutableSortedSet(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return toImmutableStack(this, comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        comparator ??= this.comparer;
        return toLinkedList(this, comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        comparator ??= this.comparer;
        return toList(this, comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return toLookup(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue> {
        return toMap(this, keySelector, valueSelector);
    }

    public toObject<TKey extends string | number | symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue> {
        return toObject(this, keySelector, valueSelector);
    }

    public toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement> {
        return toPriorityQueue(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement> {
        comparator ??= this.comparer;
        return toQueue(this, comparator);
    }

    public toSet(): Set<TElement> {
        return toSet(this);
    }

    public toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        return toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return toSortedSet(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Stack<TElement> {
        comparator ??= this.comparer;
        return toStack(this, comparator);
    }

    public union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparer;
        return union(this, iterable, comparator);
    }

    public unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return unionBy(this, iterable, keySelector, comparator);
    }

    public where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public where<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return where(this, predicate as IndexedPredicate<TElement>);
    }

    public windows(size: number): IEnumerable<IEnumerable<TElement>> {
        return windows(this, size);
    }

    public zip<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return zip(this, iterable, zipper);
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
