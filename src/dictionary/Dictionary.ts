import {IDictionary} from "./IDictionary";
import {KeyValuePair} from "./KeyValuePair";
import {Accumulator} from "../shared/Accumulator";
import {JoinSelector} from "../shared/JoinSelector";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {Zipper} from "../shared/Zipper";
import {Predicate} from "../shared/Predicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Selector} from "../shared/Selector";
import {IEnumerable, IGrouping, IOrderedEnumerable, List, RedBlackTree} from "../../imports";
import {Comparators} from "../shared/Comparators";
import {ErrorMessages} from "../shared/ErrorMessages";
import {EnumerableStatic} from "../enumerator/EnumerableStatic";

export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    private readonly keyComparator: OrderComparator<TKey>;
    private readonly keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>;
    private readonly keyValueTree: RedBlackTree<KeyValuePair<TKey, TValue>>;
    private readonly valueComparator: EqualityComparator<TValue>;

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
        this.keyValueTree = new RedBlackTree<KeyValuePair<TKey, TValue>>(treeKeyComparator, iterable);
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        for (const pair of this.keyValueTree) {
            yield pair;
        }
    }

    public static from<TSourceKey, TSourceValue>(source: Iterable<KeyValuePair<TSourceKey, TSourceValue>>,
                                                 keyComparator?: OrderComparator<TSourceKey>,
                                                 valueComparator?: EqualityComparator<TSourceValue>): Dictionary<TSourceKey, TSourceValue> {
        return new Dictionary<TSourceKey, TSourceValue>(keyComparator, valueComparator, source);
    }

    add(key: TKey, value: TValue): TValue {
        if (this.hasKey(key)) {
            throw new Error(`${ErrorMessages.KeyAlreadyAdded} Key: ${key}`);
        }
        this.keyValueTree.add(new KeyValuePair<TKey, TValue>(key, value));
        return value;
    }

    aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return EnumerableStatic.aggregate(this, accumulator, seed, resultSelector);
    }

    all(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.all(this, predicate);
    }

    any(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.any(this, predicate);
    }

    append(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.append(this, element);
    }

    average(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.average(this, selector);
    }

    clear(): void {
        this.keyValueTree.clear();
    }

    concat(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.concat(this, enumerable);
    }

    contains(element: KeyValuePair<TKey, TValue>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        return EnumerableStatic.contains(this, element, comparator);
    }

    containsKey(key: TKey): boolean {
        return this.hasKey(key);
    }

    containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean {
        return this.hasValue(value, comparator);
    }

    count(predicate?: Predicate<KeyValuePair<TKey, TValue>>): number {
        return EnumerableStatic.count(this, predicate);
    }

    defaultIfEmpty(value?: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.defaultIfEmpty(this, value);
    }

    distinct(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.distinct(this, comparator);
    }

    elementAt(index: number): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.elementAt(this, index);
    }

    elementAtOrDefault(index: number): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.elementAtOrDefault(this, index);
    }

    except(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.except(this, enumerable, comparator);
    }

    first(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.first(this, predicate);
    }

    firstOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.firstOrDefault(this, predicate);
    }

    get(key: TKey): TValue {
        return this.firstOrDefault(pair => this.keyComparator(pair.key, key) === 0)?.value ?? null;
    }

    groupBy<TGroupKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<IGrouping<TGroupKey, KeyValuePair<TKey, TValue>>> {
        return EnumerableStatic.groupBy(this, keySelector, keyComparator);
    }

    groupJoin<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<TGroupKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<TResult> {
        return EnumerableStatic.groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    intersect(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.intersect(this, enumerable, comparator);
    }

    isEmpty(): boolean {
        return this.keyValueTree.isEmpty();
    }

    join<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<KeyValuePair<TKey, TValue>, TInner, TResult>, keyComparator?: EqualityComparator<TGroupKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return EnumerableStatic.join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    keys(): List<TKey> {
        return List.from(this.keyValueTree.toArray().map(p => p.key), (k1: TKey, k2: TKey) => this.keyComparator(k1, k2) === 0);
    }

    last(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.last(this, predicate);
    }

    lastOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.lastOrDefault(this, predicate);
    }

    max(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.max(this, selector);
    }

    min(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.min(this, selector);
    }

    orderBy<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.orderBy(this, keySelector, comparator);
    }

    orderByDescending<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.orderByDescending(this, keySelector, comparator);
    }

    prepend(item: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.prepend(this, item);
    }

    remove(key: TKey): TValue {
        const pair = Dictionary.pairWithNullValue<TKey, TValue>(key);
        const foundPair = this.keyValueTree.find(p => p.equalByKey(pair));
        if (!!foundPair) {
            this.keyValueTree.remove(Dictionary.pairWithNullValue(key));
            return foundPair.value;
        }
        return null;
    }

    reverse(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.reverse(this);
    }

    select<TResult>(selector: Selector<KeyValuePair<TKey, TValue>, TResult>): IEnumerable<TResult> {
        return EnumerableStatic.select(this, selector);
    }

    selectMany<TResult>(selector: IndexedSelector<KeyValuePair<TKey, TValue>, Iterable<TResult>>): IEnumerable<TResult> {
        return EnumerableStatic.selectMany(this, selector);
    }

    sequenceEqual(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        comparator ??= this.keyValueComparator;
        return EnumerableStatic.sequenceEqual(this, enumerable, comparator);
    }

    single(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.single(this, predicate);
    }

    singleOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> {
        return EnumerableStatic.singleOrDefault(this, predicate);
    }

    size(): number {
        return this.keyValueTree.size();
    }

    skip(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.skip(this, count);
    }

    skipLast(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.skipLast(this, count);
    }

    skipWhile(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.skipWhile(this, predicate);
    }

    sum(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return EnumerableStatic.sum(this, selector);
    }

    take(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.take(this, count);
    }

    takeLast(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.takeLast(this, count);
    }

    takeWhile(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.takeWhile(this, predicate);
    }

    toArray(): KeyValuePair<TKey, TValue>[] {
        return this.keyValueTree.toArray();
    }

    public toDictionary<TDictKey, TDictValue>(keySelector?: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector?: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>): Dictionary<TDictKey, TDictValue> {
        return EnumerableStatic.toDictionary(this, keySelector, valueSelector, keyComparator);
    }

    toList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): List<KeyValuePair<TKey, TValue>> {
        return this.keyValueTree.toList();
    }

    union(enumerable: IEnumerable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.union(this, enumerable, comparator);
    }

    values(): List<TValue> {
        return List.from(this.keyValueTree.toArray().map(p => p.value), this.valueComparator);
    }

    where(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return EnumerableStatic.where(this, predicate);
    }

    zip<TSecond, TResult = [KeyValuePair<TKey, TValue>, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<KeyValuePair<TKey, TValue>, TSecond, TResult>): IEnumerable<[KeyValuePair<TKey, TValue>, TSecond]> | IEnumerable<TResult> {
        return EnumerableStatic.zip(this, enumerable, zipper);
    }

    private static pairWithNullValue<TKey, TValue>(key: TKey): KeyValuePair<TKey, TValue> {
        return new KeyValuePair<TKey, TValue>(key, null);
    }

    private hasKey(key: TKey): boolean {
        // const pair = new KeyValuePair(key, null);
        return !!this.keyValueTree.firstOrDefault(pair => this.keyComparator(pair.key, key) === 0);
    }

    private hasValue(value: TValue, comparator: EqualityComparator<TValue> = Comparators.equalityComparator): boolean {
        for (const pair of this) {
            if (comparator(pair.value, value)) {
                return true;
            }
        }
        return false;
    }

}
