import {Accumulator} from "../shared/Accumulator";
import {JoinSelector} from "../shared/JoinSelector";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {Zipper} from "../shared/Zipper";
import {Predicate} from "../shared/Predicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Selector} from "../shared/Selector";
import {
    IDictionary,
    IEnumerable,
    IGrouping, ILookup,
    IOrderedEnumerable,
    ISet,
    KeyValuePair,
    List,
    RedBlackTree,
    SortedSet,
    Dictionary,
    EnumerableArray
} from "../../imports";
import {Comparators} from "../shared/Comparators";
import {ErrorMessages} from "../shared/ErrorMessages";
import {EnumerableStatic} from "../enumerator/EnumerableStatic";
import {IndexedAction} from "../shared/IndexedAction";
import {Writable} from "../shared/Writable";

export class SortedDictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    private readonly keyComparator: OrderComparator<TKey>;
    private readonly keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>;
    private readonly keyValueTree: RedBlackTree<KeyValuePair<TKey, TValue>>;
    private readonly valueComparator: EqualityComparator<TValue>;
    public readonly length: number = 0;

    public constructor(
        keyComparator?: OrderComparator<TKey>,
        valueComparator?: EqualityComparator<TValue>,
        iterable: Iterable<KeyValuePair<TKey, TValue>> = [] as Array<KeyValuePair<TKey, TValue>>) {
        this.keyComparator = keyComparator ?? Comparators.orderComparator;
        this.valueComparator = valueComparator ?? Comparators.equalityComparator;
        this.keyValueComparator
            = (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => this.keyComparator(p1.key, p2.key) === 0
            && this.valueComparator(p1.value, p2.value);
        const treeKeyComparator = (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => this.keyComparator(p1.key, p2.key);
        this.keyValueTree = new RedBlackTree<KeyValuePair<TKey, TValue>>(treeKeyComparator, []);
        for (const pair of iterable) {
            this.keyValueTree.add(pair);
        }
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        yield* this.keyValueTree;
    }

    public add(key: TKey, value: TValue): TValue {
        if (key == null) {
            throw new Error(ErrorMessages.NullKey);
        }
        if (this.hasKey(key)) {
            throw new Error(`${ErrorMessages.KeyAlreadyAdded} Key: ${key}`);
        }
        this.keyValueTree.insert(new KeyValuePair<TKey, TValue>(key, value));
        this.updateLength();
        return value;
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return EnumerableStatic.aggregate(this, accumulator, seed, resultSelector);
    }

    public all(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.all(this, predicate);
    }

    public any(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.any(this, predicate);
    }

    public append(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.append(this, element);
    }

    public average(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.average(this, selector);
    }

    public clear(): void {
        this.keyValueTree.clear();
        this.updateLength();
    }

    public concat(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.concat(this, enumerable);
    }

    public contains(element: KeyValuePair<TKey, TValue>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.contains(this, element, comparator);
    }

    public containsKey(key: TKey): boolean {
        return this.hasKey(key);
    }

    public containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean {
        comparator ??= this.valueComparator;
        return this.hasValue(value, comparator);
    }

    public count(predicate?: Predicate<KeyValuePair<TKey, TValue>>): number {
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

    public* entries(): IterableIterator<[TKey, TValue]> {
        for (const pair of this) {
            yield [pair.key, pair.value];
        }
    };

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

    public get(key: TKey): TValue {
        return this.keyValueTree.findBy(key, p => p.key, this.keyComparator)?.value ?? null;
    }

    public groupBy<TGroupKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<IGrouping<TGroupKey, KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<TGroupKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<TResult> {
        return EnumerableStatic.groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public intersect(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>, orderComparator?: OrderComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.intersect(this, enumerable, comparator, orderComparator);
    }

    public isEmpty(): boolean {
        return this.keyValueTree.isEmpty();
    }

    public join<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<KeyValuePair<TKey, TValue>, TInner, TResult>, keyComparator?: EqualityComparator<TGroupKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return EnumerableStatic.join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public keys(): ISet<TKey> {
        return new SortedSet<TKey>(this.keyValueTree.toArray().map(p => p.key), this.keyComparator);
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

    public prepend(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.prepend(this, element);
    }

    public put(key: TKey, value: TValue): TValue | null {
        if (this.hasKey(key)) {
            const oldValue = this.get(key);
            this.set(key, value);
            return oldValue;
        }
        this.add(key, value);
        return null;
    }

    public remove(key: TKey): TValue {
        const result = this.keyValueTree.removeBy(key, p => p.key, this.keyComparator)?.value ?? null;
        this.updateLength();
        return result;
    }

    public reverse(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.reverse(this);
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

    public set(key: TKey, value: TValue): void {
        const pair = this.keyValueTree.findBy(key, p => p.key, this.keyComparator);
        if (!pair) {
            throw new Error(ErrorMessages.KeyNotFound);
        }
        pair.value = value;
    }

    public single(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.single(this, predicate);
    }

    public singleOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.singleOrDefault(this, predicate);
    }

    public size(): number {
        return this.keyValueTree.size();
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
        return this.keyValueTree.toArray();
    }

    public toDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, valueComparator?: EqualityComparator<TDictValue>): Dictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toEnumerableArray(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): EnumerableArray<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.toEnumerableArray(this, comparator);
    }

    public toList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): List<KeyValuePair<TKey, TValue>> {
        return this.keyValueTree.toList();
    }

    public toLookup<TLookupKey, TLookupValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TLookupKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TLookupValue>, keyComparator?: OrderComparator<TLookupKey>): ILookup<TLookupKey, TLookupValue> {
        return this.keyValueTree.toLookup(keySelector, valueSelector, keyComparator);
    }

    public toSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): SortedDictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public tryAdd(key: TKey, value: TValue): boolean {
        if (key == null) {
            throw new Error(ErrorMessages.NullKey);
        }
        if (this.hasKey(key)) {
            return false;
        }
        this.keyValueTree.insert(new KeyValuePair<TKey, TValue>(key, value));
        this.updateLength();
        return true;
    }

    public union(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.union(this, enumerable, comparator);
    }

    public values(): List<TValue> {
        return this.keyValueTree.select(p => p.value).toList(this.valueComparator);
    }

    public where(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.where(this, predicate);
    }

    public zip<TSecond, TResult = [KeyValuePair<TKey, TValue>, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<KeyValuePair<TKey, TValue>, TSecond, TResult>): IEnumerable<[KeyValuePair<TKey, TValue>, TSecond]> | IEnumerable<TResult> {
        return EnumerableStatic.zip(this, enumerable, zipper);
    }

    protected updateLength(): void {
        (this.length as Writable<number>) = this.keyValueTree.length;
    }

    private hasKey(key: TKey): boolean {
        return !!this.keyValueTree.findBy(key, p => p.key, this.keyComparator);
    }

    private hasValue(value: TValue, comparator: EqualityComparator<TValue> = this.valueComparator): boolean {
        for (const pair of this) {
            if (comparator(pair.value, value)) {
                return true;
            }
        }
        return false;
    }

}
