import {IDictionary} from "./IDictionary";
import {ErrorMessages} from "../shared/ErrorMessages";
import {KeyValuePair} from "./KeyValuePair";
import {Accumulator} from "../shared/Accumulator";
import {Selector} from "../shared/Selector";
import {EnumerableStatic} from "../enumerator/EnumerableStatic";
import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "../enumerator/IEnumerable";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {IndexedAction} from "../shared/IndexedAction";
import {IGroup} from "../enumerator/IGroup";
import {JoinSelector} from "../shared/JoinSelector";
import {ISet} from "../set/ISet";
import {IOrderedEnumerable} from "../enumerator/IOrderedEnumerable";
import {IndexedSelector} from "../shared/IndexedSelector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexableList} from "../list/IndexableList";
import {List} from "../list/List";
import {ILookup} from "../lookup/ILookup";
import {SortedDictionary} from "./SortedDictionary";
import {Zipper} from "../shared/Zipper";
import {Writable} from "../shared/Writable";
import {Dictionary} from "./Dictionary";
import {ICollection} from "../core/ICollection";
import {SortedSet} from "../set/SortedSet";
import {EnumerableSet} from "../set/EnumerableSet";
import {PairwiseSelector} from "../shared/PairwiseSelector";

export abstract class AbstractDictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    protected keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>;
    protected valueComparator: EqualityComparator<TValue>;
    public readonly length: number = 0;

    protected constructor(valueComparator: EqualityComparator<TValue>, keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>) {
        this.valueComparator = valueComparator;
        this.keyValueComparator = keyValueComparator;
    }

    public aggregate<TAccumulate = KeyValuePair<TKey, TValue>, TResult = TAccumulate>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return EnumerableStatic.aggregate(this, accumulator, seed, resultSelector);
    }

    public all(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
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

    public average(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.average(this, selector);
    }

    public chunk(size: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.chunk(this, size);
    }

    public concat(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.concat(this, enumerable);
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

    public defaultIfEmpty(value?: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.defaultIfEmpty(this, value);
    }

    public distinct<TDistinctKey>(keySelector?: Selector<KeyValuePair<TKey, TValue>, TDistinctKey>, comparator?: EqualityComparator<TDistinctKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.distinct(this, keySelector, comparator);
    }

    public elementAt(index: number): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.elementAt(this, index);
    }

    public elementAtOrDefault(index: number): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.elementAtOrDefault(this, index);
    }

    public except(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>, orderComparator?: OrderComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.except(this, enumerable, comparator, orderComparator);
    }

    public first(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.first(this, predicate);
    }

    public firstOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
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

    public intersect(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>, orderComparator?: OrderComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.intersect(this, enumerable, comparator, orderComparator);
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

    public lastOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.lastOrDefault(this, predicate);
    }

    public max(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.max(this, selector);
    }

    public min(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.min(this, selector);
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

    public prepend(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.prepend(this, element);
    }

    public put(key: TKey, value: TValue): TValue | null {
        if (this.containsKey(key)) {
            const oldValue = this.get(key);
            this.set(key, value);
            return oldValue;
        }
        this.add(key, value);
        return null;
    }

    public reverse(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.reverse(this);
    }

    public scan<TAccumulate = KeyValuePair<TKey, TValue>>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return EnumerableStatic.scan(this, accumulator, seed);
    }

    public select<TResult>(selector: Selector<KeyValuePair<TKey, TValue>, TResult>): IEnumerable<TResult> {
        return EnumerableStatic.select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<KeyValuePair<TKey, TValue>, Iterable<TResult>>): IEnumerable<TResult> {
        return EnumerableStatic.selectMany(this, selector);
    }

    public sequenceEqual(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.sequenceEqual(this, enumerable, comparator);
    }

    public single(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.single(this, predicate);
    }

    public singleOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
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

    public toIndexableList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IndexableList<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toIndexableList(this, comparator);
    }

    public toList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): List<KeyValuePair<TKey, TValue>> {
        return new List<KeyValuePair<TKey, TValue>>(this, comparator);
    }

    public toLookup<TLookupKey, TLookupValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TLookupKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TLookupValue>, keyComparator?: OrderComparator<TLookupKey>): ILookup<TLookupKey, TLookupValue> {
        return EnumerableStatic.toLookup(this, keySelector, valueSelector, keyComparator);
    }

    public toSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): SortedDictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): SortedSet<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toSortedSet(this, comparator);
    }

    public tryAdd(key: TKey, value: TValue): boolean {
        if (key == null) {
            throw new Error(ErrorMessages.NullKey);
        }
        if (this.containsKey(key)) {
            return false;
        }
        this.add(key, value);
        this.updateLength();
        return true;
    }

    public union(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.union(this, enumerable, comparator);
    }

    public where(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.where(this, predicate);
    }

    public zip<TSecond, TResult = [KeyValuePair<TKey, TValue>, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<KeyValuePair<TKey, TValue>, TSecond, TResult>): IEnumerable<[KeyValuePair<TKey, TValue>, TSecond]> | IEnumerable<TResult> {
        return EnumerableStatic.zip(this, enumerable, zipper);
    }

    protected updateLength(): void {
        (this.length as Writable<number>) = this.size();
    }

    abstract [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>>;
    abstract add(key: TKey, value: TValue): TValue;
    abstract clear(): void;
    abstract containsKey(key: TKey): boolean;
    abstract containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean;
    abstract entries(): IterableIterator<[TKey, TValue]>; // generator
    abstract get(key: TKey): TValue;
    abstract keys(): ISet<TKey>;
    abstract remove(key: TKey): TValue;
    abstract set(key: TKey, value: TValue): void;
    abstract size(): number;
    abstract values(): ICollection<TValue>;
}