import {IDictionary} from "./IDictionary";
import {ISet} from "../set/ISet";
import {TreeSet} from "../set/TreeSet";
import {AbstractCollection} from "../core/AbstractCollection";
import {IList} from "../list/IList";
import {List} from "../list/List";
import {KeyValuePair} from "./KeyValuePair";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IEnumerable} from "../enumerable/IEnumerable";
import {Zipper} from "../shared/Zipper";
import {Predicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {IOrderedEnumerable} from "../enumerable/IOrderedEnumerable";
import {Comparator} from "../shared/Comparator";
import {JoinSelector} from "../shared/JoinSelector";
import {IGrouping} from "../enumerable/Enumerable";
import {Aggregator} from "../shared/Aggregator";
import {ErrorMessages} from "../shared/ErrorMessages";

export class Dictionary<K, V> implements IDictionary<K, V>, IEnumerable<KeyValuePair<K, V>> {
    private readonly dictionary: Map<K, V> = new Map<K, V>();
    private readonly comparator: EqualityComparator<K>;
    private keyValuePairs = new List<KeyValuePair<K, V>>();

    public constructor(comparator?: EqualityComparator<K>) {
        this.comparator = comparator ?? AbstractCollection.defaultEqualityComparator;
    }

    [Symbol.iterator](): Iterator<KeyValuePair<K, V>> {
        return this.keyValuePairs[Symbol.iterator]();
    }

    public static from<TKey, TValue>(pairs: IEnumerable<KeyValuePair<TKey, TValue>>): Dictionary<TKey, TValue> {
        const dictionary = new Dictionary<TKey, TValue>();
        for (const p of pairs) {
            dictionary.add(p.key, p.value);
        }
        return dictionary;
    }

    public add(key: K, value: V): V {
        if (this.hasKey(key)) {
            throw new Error(`${ErrorMessages.KeyAlreadyAdded} Key: ${key}`);
        }
        this.dictionary.set(key, value);
        this.updateKeyValuePairList(key, value);
        return value;
    }

    public aggregate<R, U = R>(aggregator: Aggregator<KeyValuePair<K, V>, R>, seed?: R, resultSelector?: Selector<R, U>): R | U {
        return this.keyValuePairs.aggregate(aggregator, seed, resultSelector);
    }

    public all(predicate?: Predicate<KeyValuePair<K, V>>): boolean {
        return this.keyValuePairs.all(predicate);
    }

    public any(predicate?: Predicate<KeyValuePair<K, V>>): boolean {
        return this.keyValuePairs.any(predicate);
    }

    public append(item: KeyValuePair<K, V>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.append(item);
    }

    public average(selector?: Selector<KeyValuePair<K, V>, number>): number {
        return this.keyValuePairs.average(selector);
    }

    public clear(): void {
        this.dictionary.clear();
        this.keyValuePairs.clear();
    }

    public concat(enumerable: IEnumerable<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.concat(enumerable);
    }

    public contains(item: KeyValuePair<K, V>, comparator?: EqualityComparator<KeyValuePair<K, V>>): boolean {
        return this.keyValuePairs.contains(item, comparator);
    }

    public containsKey(key: K, comparator?: EqualityComparator<K>): boolean {
        comparator ??= this.comparator;
        return this.hasKey(key, comparator)
    }

    public containsValue(value: V, comparator?: EqualityComparator<V>): boolean {
        comparator ??= AbstractCollection.defaultEqualityComparator;
        return this.hasValue(value, comparator);
    }

    public count(predicate?: Predicate<KeyValuePair<K, V>>): number {
        return this.keyValuePairs.count(predicate);
    }

    public defaultIfEmpty(value?: KeyValuePair<K, V>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.defaultIfEmpty(value);
    }

    public distinct(comparator?: EqualityComparator<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.distinct(comparator);
    }

    public elementAt(index: number): KeyValuePair<K, V> {
        return this.keyValuePairs.elementAt(index);
    }

    public elementAtOrDefault(index: number): KeyValuePair<K, V> {
        return this.keyValuePairs.elementAtOrDefault(index);
    }

    public except(enumerable: IEnumerable<KeyValuePair<K, V>>, comparator?: EqualityComparator<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.except(enumerable, comparator ?? KeyValuePair.defaultEqualityComparator);
    }

    public first(predicate?: Predicate<KeyValuePair<K, V>>): KeyValuePair<K, V> {
        return this.keyValuePairs.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<KeyValuePair<K, V>>): KeyValuePair<K, V> {
        return this.keyValuePairs.firstOrDefault(predicate);
    }

    public get(key: K): V {
        return this.dictionary.get(key) ?? null;
    }

    public groupBy<TKey>(keySelector: Selector<KeyValuePair<K, V>, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGrouping<TKey, KeyValuePair<K, V>>> {
        return this.keyValuePairs.groupBy(keySelector, keyComparator);
    }

    public groupJoin<E, TKey, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<KeyValuePair<K, V>, TKey>, innerKeySelector: Selector<E, TKey>, resultSelector: JoinSelector<TKey, IEnumerable<E>, R>, keyComparator?: EqualityComparator<TKey>): IEnumerable<R> {
        return this.keyValuePairs.groupJoin(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public intersect(enumerable: IEnumerable<KeyValuePair<K, V>>, comparator?: EqualityComparator<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.intersect(enumerable, comparator ?? KeyValuePair.defaultEqualityComparator);
    }

    public isEmpty(): boolean {
        return this.dictionary.size === 0;
    }

    public join<E, TKey, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<KeyValuePair<K, V>, TKey>, innerKeySelector: Selector<E, TKey>, resultSelector: JoinSelector<KeyValuePair<K, V>, E, R>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<R> {
        return this.keyValuePairs.join(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public keys(): ISet<K> {
        const keySet = new TreeSet<K>(AbstractCollection.defaultComparator);
        for (const key of this.dictionary.keys()) {
            keySet.add(key);
        }
        return keySet;
    }

    public last(predicate?: Predicate<KeyValuePair<K, V>>): KeyValuePair<K, V> {
        return this.keyValuePairs.last(predicate);
    }

    public lastOrDefault(predicate?: Predicate<KeyValuePair<K, V>>): KeyValuePair<K, V> {
        return this.keyValuePairs.lastOrDefault(predicate);
    }

    public max(selector?: Selector<KeyValuePair<K, V>, number>): number {
        if (!selector) {
            throw new Error(ErrorMessages.CannotConvertToNumber);
        }
        return this.keyValuePairs.max(selector);
    }

    public min(selector?: Selector<KeyValuePair<K, V>, number>): number {
        if (!selector) {
            throw new Error(ErrorMessages.CannotConvertToNumber);
        }
        return this.keyValuePairs.min(selector);
    }

    public orderBy<TKey>(keySelector: Selector<KeyValuePair<K, V>, TKey>, comparator?: Comparator<TKey>): IOrderedEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.orderBy(keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<KeyValuePair<K, V>, TKey>, comparator?: Comparator<TKey>): IOrderedEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.orderByDescending(keySelector, comparator);
    }

    public prepend(item: KeyValuePair<K, V>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.prepend(item);
    }

    public remove(key: K): V {
        if (!this.dictionary.has(key)) {
            return null;
        }
        const value = this.dictionary.get(key);
        this.dictionary.delete(key);
        this.updateKeyValuePairList(key, null, true);
        return value;
    }

    public reverse(): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.reverse();
    }

    public select<R>(selector: Selector<KeyValuePair<K, V>, R>): IEnumerable<R> {
        return this.keyValuePairs.select(selector);
    }

    public selectMany<R>(selector: IndexedSelector<KeyValuePair<K, V>, Iterable<R>>): IEnumerable<R> {
        return this.keyValuePairs.selectMany(selector);
    }

    public sequenceEqual(enumerable: IEnumerable<KeyValuePair<K, V>>, comparator?: EqualityComparator<KeyValuePair<K, V>>): boolean {
        return this.keyValuePairs.sequenceEqual(enumerable, comparator ?? KeyValuePair.defaultEqualityComparator);
    }

    public single(predicate?: Predicate<KeyValuePair<K, V>>): KeyValuePair<K, V> {
        return this.keyValuePairs.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<KeyValuePair<K, V>>): KeyValuePair<K, V> {
        return this.keyValuePairs.singleOrDefault(predicate);
    }

    public size(): number {
        return this.dictionary.size;
    }

    public skip(count: number): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.skip(count);
    }

    public skipLast(count: number): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.skipWhile(predicate);
    }

    public sum(selector?: Selector<KeyValuePair<K, V>, number>): number {
        if (!selector) {
            throw new Error(ErrorMessages.CannotConvertToNumber);
        }
        return this.keyValuePairs.sum(selector);
    }

    public take(count: number): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.take(count);
    }

    public takeLast(count: number): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.takeLast(count);
    }

    public takeWhile(predicate: IndexedPredicate<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.takeWhile(predicate);
    }

    public toArray(): KeyValuePair<K, V>[] {
        return this.keyValuePairs.toArray();
    }

    public toDictionary<TKey, TValue>(keySelector?: Selector<KeyValuePair<K, V>, TKey>, valueSelector?: Selector<KeyValuePair<K, V>, TValue>, keyComparator?: EqualityComparator<TKey>): Dictionary<TKey, TValue> {
        return this.keyValuePairs.toDictionary(keySelector, valueSelector, keyComparator);
    }

    public toList(): List<KeyValuePair<K, V>> {
        return this.keyValuePairs.toList();
    }

    public tryAdd(key: K, value: V): boolean {
        if (this.hasKey(key)) {
            return false;
        }
        this.add(key, value);
        return true;
    }

    public union(enumerable: IEnumerable<KeyValuePair<K, V>>, comparator?: EqualityComparator<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.union(enumerable, comparator ?? KeyValuePair.defaultEqualityComparator);
    }

    public values(): IList<V> {
        return new List<V>(Array.from(this.dictionary.values()));
    }

    public where(predicate: Predicate<KeyValuePair<K, V>>): IEnumerable<KeyValuePair<K, V>> {
        return this.keyValuePairs.where(predicate)
    }

    public zip<R, U = [KeyValuePair<K, V>, R]>(enumerable: IEnumerable<R>, zipper?: Zipper<KeyValuePair<K, V>, R, U>): IEnumerable<[KeyValuePair<K, V>, R]> | IEnumerable<U> {
        return this.keyValuePairs.zip(enumerable, zipper);
    }

    private hasKey(key: K, comparator: EqualityComparator<K> = this.comparator): boolean {
        const pair = this.keyValuePairs.singleOrDefault(p => comparator(p.key, key));
        return !!pair;
    }

    private hasValue(value: V, comparator: EqualityComparator<V> = AbstractCollection.defaultEqualityComparator): boolean {
        for (const pair of this) {
            if (comparator(pair.value, value)) {
                return true;
            }
        }
        return false;
    }

    private updateKeyValuePairList(key: K, value: V, remove: boolean = false): void {
        const item = this.keyValuePairs.singleOrDefault(p => p.key === key);
        if (!item && !remove) {
            this.keyValuePairs.add(new KeyValuePair<K, V>(key, value));
            return;
        }
        if (item && remove) {
            const index = this.keyValuePairs.findIndex(p => p.key === key);
            this.keyValuePairs.removeAt(index);
        }
    }
}
