import { EnumerableStatic } from "../enumerator/EnumerableStatic";
import {
    EnumerableSet,
    ICollection,
    IEnumerable,
    IGroup,
    ILookup,
    ImmutableDictionary,
    ImmutableList,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    IOrderedEnumerable,
    ISet,
    LinkedList,
    List,
    PriorityQueue,
    Queue,
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
import { Dictionary } from "./Dictionary";
import { IReadonlyDictionary } from "./IReadonlyDictionary";
import { KeyValuePair } from "./KeyValuePair";
import { SortedDictionary } from "./SortedDictionary";

export abstract class AbstractReadonlyDictionary<TKey, TValue> implements IReadonlyDictionary<TKey, TValue> {
    protected readonly keyValueComparer: EqualityComparator<KeyValuePair<TKey, TValue>>;
    protected readonly valueComparer: EqualityComparator<TValue>;

    protected constructor(valueComparator: EqualityComparator<TValue>, keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>) {
        this.valueComparer = valueComparator;
        this.keyValueComparer = keyValueComparator;
    }

    public aggregate<TAccumulate = KeyValuePair<TKey, TValue>, TResult = TAccumulate>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return EnumerableStatic.aggregate(this, accumulator, seed, resultSelector);
    }

    public aggregateBy<TAggregateKey, TAccumulate = KeyValuePair<TKey, TValue>>(keySelector: Selector<KeyValuePair<TKey, TValue>, TAggregateKey>, seedSelector: Selector<TAggregateKey, TAccumulate> | TAccumulate, accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, keyComparator?: EqualityComparator<TAggregateKey>): IEnumerable<KeyValuePair<TAggregateKey, TAccumulate>> {
        return EnumerableStatic.aggregateBy(this, keySelector, seedSelector, accumulator, keyComparator);
    }

    public all(predicate: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.all(this, predicate);
    }

    public any(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        if (!predicate) {
            return !this.isEmpty();
        }
        return EnumerableStatic.any(this, predicate);
    }

    public append(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.append(this, element);
    }

    public asEnumerable(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.asEnumerable(this);
    }

    public asObject<TObjectKey extends string | number | symbol>(): Record<TObjectKey, TValue> {
        const keySelector = ((pair: KeyValuePair<TKey, TValue>) => {
            if (typeof pair.key === 'string' || typeof pair.key === 'number' || typeof pair.key === 'symbol') {
                return pair.key as string | number | symbol;
            }
            return String(pair.key);
        });
        const valueSelector = ((pair: KeyValuePair<TKey, TValue>) => pair.value);
        return this.toObject(keySelector, valueSelector);
    }

    public average(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.average(this, selector);
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return EnumerableStatic.cast(this);
    }

    public chunk(size: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.chunk(this, size);
    }

    public combinations(size?: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.combinations(this, size);
    }

    public concat(iterable: Iterable<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.concat(this, iterable);
    }

    public contains(element: KeyValuePair<TKey, TValue>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.contains(this, element, comparator);
    }

    public count(predicate?: Predicate<KeyValuePair<TKey, TValue>>): number {
        if (!predicate) {
            return this.size();
        }
        return EnumerableStatic.count(this, predicate);
    }

    public countBy<TCountKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TCountKey>, comparator?: EqualityComparator<TCountKey>): IEnumerable<KeyValuePair<TCountKey, number>> {
        return EnumerableStatic.countBy(this, keySelector, comparator);
    }

    public cycle(count?: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.cycle(this, count);
    }

    public defaultIfEmpty(value?: KeyValuePair<TKey, TValue> | null): IEnumerable<KeyValuePair<TKey, TValue> | null> {
        return EnumerableStatic.defaultIfEmpty(this, value);
    }

    public distinct(keyComparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.distinct(this, keyComparator);
    }

    public distinctBy<TDistinctKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDistinctKey>, comparator?: EqualityComparator<TDistinctKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.distinctBy(this, keySelector, comparator);
    }

    public elementAt(index: number): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.elementAt(this, index);
    }

    public elementAtOrDefault(index: number): KeyValuePair<TKey, TValue> | null {
        return EnumerableStatic.elementAtOrDefault(this, index);
    }

    public except(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>> | OrderComparator<KeyValuePair<TKey, TValue>> | null): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparer;
        return EnumerableStatic.except(this, iterable, comparator);
    }

    public exceptBy<TExceptKey>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keySelector: Selector<KeyValuePair<TKey, TValue>, TExceptKey>, keyComparator?: EqualityComparator<TExceptKey> | OrderComparator<TExceptKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.exceptBy(this, iterable, keySelector, keyComparator);
    }

    public first(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.first(this, predicate);
    }

    public firstOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> | null {
        return EnumerableStatic.firstOrDefault(this, predicate);
    }

    public forEach(action: IndexedAction<KeyValuePair<TKey, TValue>>): void {
        EnumerableStatic.forEach(this, action);
    }

    public groupBy<TGroupKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<IGroup<TGroupKey, KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<KeyValuePair<TKey, TValue>, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<TResult> {
        return EnumerableStatic.groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public index(): IEnumerable<[number, KeyValuePair<TKey, TValue>]> {
        return EnumerableStatic.index(this);
    }

    public intersect(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>> | OrderComparator<KeyValuePair<TKey, TValue>> | null): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparer;
        return EnumerableStatic.intersect(this, iterable, comparator);
    }

    public intersectBy<TIntersectKey>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keySelector: Selector<KeyValuePair<TKey, TValue>, TIntersectKey>, keyComparator?: EqualityComparator<TIntersectKey> | OrderComparator<TIntersectKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.intersectBy(this, iterable, keySelector, keyComparator);
    }

    public intersperse<TSeparator = KeyValuePair<TKey, TValue>>(separator: TSeparator): IEnumerable<KeyValuePair<TKey, TValue> | TSeparator> {
        return EnumerableStatic.intersperse(this, separator);
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public join<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<KeyValuePair<TKey, TValue>, TInner, TResult>, keyComparator?: EqualityComparator<TGroupKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return EnumerableStatic.join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.last(this, predicate);
    }

    public lastOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> | null {
        return EnumerableStatic.lastOrDefault(this, predicate);
    }

    public max(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.max(this, selector);
    }

    public maxBy<TMaxKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMaxKey>, comparator?: OrderComparator<TMaxKey>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.maxBy(this, keySelector, comparator);
    }

    public min(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.min(this, selector);
    }

    public minBy<TMinKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMinKey>, comparator?: OrderComparator<TMinKey>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.minBy(this, keySelector, comparator);
    }

    public none(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.none(this, predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return EnumerableStatic.ofType(this, type);
    }

    public orderBy<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.orderByDescending(this, keySelector, comparator);
    }

    public pairwise(resultSelector?: PairwiseSelector<KeyValuePair<TKey, TValue>, KeyValuePair<TKey, TValue>>): IEnumerable<[KeyValuePair<TKey, TValue>, KeyValuePair<TKey, TValue>]> {
        return EnumerableStatic.pairwise(this, resultSelector);
    }

    public partition(predicate: Predicate<KeyValuePair<TKey, TValue>>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>] {
        return EnumerableStatic.partition(this, predicate);
    }

    public permutations(size?: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.permutations(this, size);
    }

    public prepend(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.prepend(this, element);
    }

    public product(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.product(this, selector);
    }

    public reverse(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.reverse(this);
    }

    public scan<TAccumulate = KeyValuePair<TKey, TValue>>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return EnumerableStatic.scan(this, accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<KeyValuePair<TKey, TValue>, TResult>): IEnumerable<TResult> {
        return EnumerableStatic.select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<KeyValuePair<TKey, TValue>, Iterable<TResult>>): IEnumerable<TResult> {
        return EnumerableStatic.selectMany(this, selector);
    }

    public sequenceEqual(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        comparator ??= this.keyValueComparer;
        return EnumerableStatic.sequenceEqual(this, iterable, comparator);
    }

    public shuffle(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.shuffle(this);
    }

    public single(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.single(this, predicate);
    }

    public singleOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> | null {
        return EnumerableStatic.singleOrDefault(this, predicate);
    }

    public skip(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.skip(this, count);
    }

    public skipLast(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.skipLast(this, count);
    }

    public skipWhile(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.skipWhile(this, predicate);
    }

    public span(predicate: Predicate<KeyValuePair<TKey, TValue>>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>] {
        return EnumerableStatic.span(this, predicate);
    }

    public step(step: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.step(this, step);
    }

    public sum(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.sum(this, selector);
    }

    public take(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.take(this, count);
    }

    public takeLast(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.takeLast(this, count);
    }

    public takeWhile(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.takeWhile(this, predicate);
    }

    public toArray(): KeyValuePair<TKey, TValue>[] {
        return Array.from(this);
    }

    public toDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, valueComparator?: EqualityComparator<TDictValue>): Dictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): EnumerableSet<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toEnumerableSet(this);
    }

    public toImmutableDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, valueComparator?: EqualityComparator<TDictValue>): ImmutableDictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toImmutableDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableList<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return EnumerableStatic.toImmutableList(this, keyValueComparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableQueue<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return EnumerableStatic.toImmutableQueue(this, keyValueComparator);
    }

    public toImmutableSet(): ImmutableSet<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toImmutableSet(this);
    }

    public toImmutableSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): ImmutableSortedDictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toImmutableSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): ImmutableSortedSet<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toImmutableSortedSet(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableStack<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return EnumerableStatic.toImmutableStack(this, keyValueComparator);
    }

    public toLinkedList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): LinkedList<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return new LinkedList<KeyValuePair<TKey, TValue>>(this, keyValueComparator);
    }

    public toList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): List<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return new List<KeyValuePair<TKey, TValue>>(this, keyValueComparator);
    }

    public toLookup<TLookupKey, TLookupValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TLookupKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TLookupValue>, keyComparator?: OrderComparator<TLookupKey>): ILookup<TLookupKey, TLookupValue> {
        return EnumerableStatic.toLookup(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TMapKey, TMapValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMapKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TMapValue>): Map<TMapKey, TMapValue> {
        return EnumerableStatic.toMap(this, keySelector, valueSelector);
    }

    public toObject<TObjectKey extends string | number | symbol, TObjectValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TObjectKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TObjectValue>): Record<TObjectKey, TObjectValue> {
        return EnumerableStatic.toObject(this, keySelector, valueSelector);
    }

    public toPriorityQueue(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): PriorityQueue<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toPriorityQueue(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): Queue<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return EnumerableStatic.toQueue(this, keyValueComparator);
    }

    public toSet(): Set<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toSet(this);
    }

    public toSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): SortedDictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): SortedSet<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toSortedSet(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): Stack<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return EnumerableStatic.toStack(this, keyValueComparator);
    }

    public toString(): string;
    public toString(selector?: Selector<KeyValuePair<TKey, TValue>, string>): string;
    public toString(selector?: Selector<KeyValuePair<TKey, TValue>, string>): string {
        const buffer = new Array<string>();
        for (const pair of this) {
            buffer.push(selector?.(pair) ?? `${pair.key}: ${pair.value}`);
        }
        return `{ ${buffer.join(", ")} }`;
    }

    public union(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return EnumerableStatic.union(this, iterable, keyValueComparator);
    }

    public unionBy<TUnionKey>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keySelector: Selector<KeyValuePair<TKey, TValue>, TUnionKey>, comparator?: EqualityComparator<TUnionKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.unionBy(this, iterable, keySelector, comparator);
    }

    public where(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.where(this, predicate);
    }

    public windows(size: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.windows(this, size);
    }

    public zip<TSecond, TResult = [KeyValuePair<TKey, TValue>, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<KeyValuePair<TKey, TValue>, TSecond, TResult>): IEnumerable<[KeyValuePair<TKey, TValue>, TSecond]> | IEnumerable<TResult> {
        return EnumerableStatic.zip(this, iterable, zipper);
    }

    public get keyValueComparator(): EqualityComparator<KeyValuePair<TKey, TValue>> {
        return this.keyValueComparer;
    }

    public get valueComparator(): EqualityComparator<TValue> {
        return this.valueComparer;
    }

    abstract [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>>;

    abstract containsKey(key: TKey): boolean;

    abstract containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean;

    abstract entries(): IterableIterator<[TKey, TValue]>;

    abstract get(key: TKey): TValue | null;

    abstract keys(): ISet<TKey>;

    abstract size(): number;

    abstract values(): ICollection<TValue>;

    abstract get length(): number;
}
