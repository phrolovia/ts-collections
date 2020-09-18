import {IList} from "./IList";
import {IQueue} from "../queue/IQueue";
import {IDeque} from "../queue/IDeque";
import {AbstractCollection} from "../core/AbstractCollection";
import {IEnumerable} from "../enumerable/IEnumerable";
import {IOrderedEnumerable} from "../enumerable/IOrderedEnumerable";
import {Enumerable, IGrouping} from "../enumerable/Enumerable";
import {Aggregator} from "../shared/Aggregator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Comparator} from "../shared/Comparator";
import {JoinSelector} from "../shared/JoinSelector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Zipper} from "../shared/Zipper";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IndexedAction} from "../shared/IndexedAction";

export class List<T> extends AbstractCollection<T> implements IList<T>, IQueue<T>, IDeque<T> {
    private readonly enumerable: Enumerable<T>;
    private data: T[] = [];

    public constructor(data?: T[]) {
        super();
        if (data) {
            this.data = [...data];
        }
        this.enumerable = new Enumerable<T>(this.data);
    }

    public static from<S>(array: S[]): List<S> {
        return new List(array);
    }

    public add(item: T): boolean {
        this.data.push(item);
        return true;
    }

    public aggregate<R, U = R>(aggregator: Aggregator<T, R>, seed?: R, resultSelector?: Selector<R, U>): R | U {
        return this.enumerable.aggregate(aggregator, seed, resultSelector);
    }

    public all(predicate?: Predicate<T>): boolean {
        return this.enumerable.all(predicate);
    }

    public any(predicate?: Predicate<T>): boolean {
        return this.enumerable.any(predicate);
    }

    public append(item: T): IEnumerable<T> {
        return this.enumerable.append(item);
    }

    public asEnumerable(): IEnumerable<T> {
        return this.enumerable;
    }

    public average(selector?: IndexedSelector<T, number>): number {
        return this.enumerable.average(selector);
    }

    public clear() {
        this.data.length = 0;
    }

    public concat(enumerable: IEnumerable<T>): IEnumerable<T> {
        return this.enumerable.concat(enumerable);
    }

    public contains(item: T, comparator?: EqualityComparator<T>): boolean {
        return this.enumerable.contains(item, comparator);
    }

    public count(predicate?: Predicate<T>): number {
        return this.enumerable.count(predicate);
    }

    public defaultIfEmpty(value: T = null): IEnumerable<T> {
        return this.enumerable.defaultIfEmpty(value);
    }

    public dequeue(): T {
        if (this.isEmpty()) {
            throw new Error("queue is empty.");
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }

    public dequeueLast(): T {
        if (this.isEmpty()) {
            throw new Error("queue is empty.");
        }
        const item = this.data[this.data.length - 1];
        this.data.splice(this.data.length - 1, 1);
        return item;
    }

    public distinct(comparator?: EqualityComparator<T>): IEnumerable<T> {
        return this.enumerable.distinct(comparator);
    }

    public elementAt(index: number): T {
        return this.enumerable.elementAt(index);
    }

    public elementAtOrDefault(index: number): T {
        return this.enumerable.elementAtOrDefault(index);
    }

    public enqueue(item: T): void {
        this.add(item);
    }

    public enqueueFirst(item: T): void {
        this.insert(0, item);
    }

    public except(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): IEnumerable<T> {
        return this.enumerable.except(enumerable, comparator);
    }

    public exists(predicate: Predicate<T>): boolean {
        if (!predicate) {
            throw new Error("predicate is null.");
        }
        return this.data.some(predicate);
    }

    public find(predicate: Predicate<T>): T | null {
        const item = this.data.find(predicate);
        return item ?? null;
    }

    public findAll(predicate: Predicate<T>): List<T> {
        const foundData = this.data.filter(predicate);
        return new List<T>(foundData);
    }

    public findIndex(predicate: Predicate<T>, startIndex?: number, count?: number): number {
        if (!predicate) {
            throw new Error("predicate is null.");
        }

        startIndex = startIndex || 0;
        count = count || this.size() - 1;

        if (startIndex! < 0 || startIndex >= this.size()) {
            throw new Error("startIndex is not a valid index.");
        }
        if (count < 0) {
            throw new Error("count is less than 0.");
        }
        if (startIndex + count > this.size()) {
            throw new Error("startIndex and count do not specify a valid section in the list.");
        }

        let found = false;
        let foundIndex = -1;
        for (let ix = startIndex; ix < startIndex + count; ++ix) {
            found = predicate(this.data[ix]);
            if (found) {
                foundIndex = ix;
                break;
            }
        }
        return foundIndex;
    }

    public findLast(predicate: Predicate<T>): T {
        if (!predicate) {
            throw new Error("predicate is null.");
        }
        let found = false;
        let foundItem: T = null;
        for (let ix = this.data.length - 1; ix >= 0; --ix) {
            const elem = this.data[ix];
            found = predicate(elem);
            if (found) {
                foundItem = elem;
                break;
            }
        }
        return foundItem;
    }

    public findLastIndex(predicate: Predicate<T>, startIndex?: number, count?: number): number {
        if (!predicate) {
            throw new Error("predicate is null.");
        }
        if (startIndex < 0 || startIndex >= this.size()) {
            throw new Error("startIndex is not a valid index.");
        }
        if (count < 0) {
            throw new Error("count is less than 0.");
        }
        if (startIndex + count > this.size()) {
            throw new Error("startIndex and count do not specify a valid section in the list.");
        }
        startIndex = startIndex || 0;
        count = count || this.size();
        let found = false;
        let foundIndex = -1;
        for (let ix = startIndex + count - 1; ix >= startIndex; --ix) {
            found = predicate(this.data[ix]);
            if (found) {
                foundIndex = ix;
                break;
            }
        }
        return foundIndex;
    }

    public first(predicate?: Predicate<T>): T {
        return this.enumerable.first(predicate)
    }

    public firstOrDefault(predicate?: Predicate<T>): T {
        return this.enumerable.firstOrDefault(predicate);
    }

    public forEach(action: IndexedAction<T>): void {
        if (!action) {
            throw new Error("action is null.");
        }
        this.data.forEach((d, ix) => action(d, ix));
    }

    public get(index: number): T {
        if (index == null) {
            throw new Error("index is null.");
        }
        if (index < 0) {
            throw new Error("index is less than 0.");
        }
        if (index >= this.size()) {
            throw new Error(`index is greater than or equal to ${this.size()}.`);
        }
        return this.data[index];
    }

    public groupBy<K>(keySelector: Selector<T, K>, keyComparator?: EqualityComparator<K>): IEnumerable<IGrouping<K, T>> {
        return this.enumerable.groupBy(keySelector, keyComparator);
    }

    public groupJoin<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                              resultSelector: JoinSelector<K, IEnumerable<E>, R>, keyComparator?: EqualityComparator<K>): IEnumerable<R> {
        return this.enumerable.groupJoin(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public includes(item: T): boolean {
        return this.indexOf(item) > -1;
    }

    public indexOf(item: T): number {
        return this.data.findIndex(d => d === item);
    }

    public insert(index: number, item: T) {
        if (index < 0) {
            throw new Error("index is less than 0.");
        }
        if (index !== 0 && index >= this.size()) {
            throw new Error(`index is greater than or equal to ${this.size()}.`);
        }
        this.data.splice(index, 0, item);
    }

    public intersect(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): IEnumerable<any> {
        return this.enumerable.intersect(enumerable, comparator);
    }

    public isEmpty(): boolean {
        return this.data.length === 0;
    }

    public join<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                         resultSelector: JoinSelector<T, E, R>, keyComparator?: EqualityComparator<K>, leftJoin: boolean = false): IEnumerable<R> {
        return this.enumerable.join(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<T>): T {
        return this.enumerable.last(predicate);
    }

    public lastIndexOf(item: T): number {
        return this.data.lastIndexOf(item);
    }

    public lastOrDefault(predicate?: Predicate<T>): T {
        return this.enumerable.lastOrDefault(predicate);
    }

    public max(selector?: IndexedSelector<T, number>): number {
        return this.enumerable.max(selector);
    }

    public min(selector?: IndexedSelector<T, number>): number {
        return this.enumerable.min(selector);
    }

    public orderBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return this.enumerable.orderBy(keySelector, comparator);
    }

    public orderByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return this.enumerable.orderByDescending(keySelector, comparator);
    }

    public peek(): T {
        if (this.isEmpty()) {
            return null;
        }
        return this.get(0);
    }

    public peekLast(): T {
        if (this.isEmpty()) {
            return null;
        }
        return this.get(this.size() - 1);
    }

    public poll(): T {
        if (this.isEmpty()) {
            return null;
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }

    public pollLast(): T {
        if (this.isEmpty()) return null;
        const item = this.data[this.size() - 1];
        this.data.splice(this.size() - 1, 1);
        return item;
    }

    public prepend(item: T): IEnumerable<T> {
        return this.enumerable.prepend(item);
    }

    public remove(item: T): boolean {
        const index = this.findIndex(d => d === item);
        if (index === -1) return false;
        this.removeAt(index);
        return true;
    }

    public removeAll(predicate: (value: T) => boolean): number {
        if (!predicate) {
            throw new Error("predicate is null.");
        }
        const preCount = this.data.length;
        this.data = this.data.filter(d => !predicate(d));
        return preCount - this.data.length;
    }

    public removeAt(index: number): void {
        if (index < 0) {
            throw new Error("index is less than 0.");
        }
        if (index >= this.size()) {
            throw new Error(`index is greater than or equal to ${this.size()}.`);
        }
        this.data.splice(index, 1);
    }

    public removeRange(index: number, count: number): void {
        if (index < 0) {
            throw new Error("index is less than 0.");
        }
        if (count < 0) {
            throw new Error("count is less than 0.");
        }
        if (index + count > this.size()) {
            throw new Error("index and count do not denote a valid range of elements in the list.");
        }
        let removedCount = 0;
        while (removedCount < count) {
            this.removeAt(index);
            removedCount++;
        }
    }

    public reverse(): IEnumerable<T> {
        return this.enumerable.reverse();
    }

    public select<R>(selector: IndexedSelector<T, R>): IEnumerable<R> {
        return this.enumerable.select(selector);
    }

    public selectMany<R>(selector: IndexedSelector<T, Iterable<R>>): IEnumerable<R> {
        return this.enumerable.selectMany(selector);
    }

    public sequenceEqual(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): boolean {
        return this.enumerable.sequenceEqual(enumerable, comparator);
    }

    public set(index: number, item: T): void {
        if (index < 0) {
            throw new Error("index is less than 0.");
        }
        if (index >= this.size()) {
            throw new Error(`index is greater than or equal to ${this.size()}.`);
        }
        this.data[index] = item;
    }

    public single(predicate?: Predicate<T>): T {
        return this.enumerable.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<T>): T {
        return this.enumerable.singleOrDefault(predicate);
    }

    public size(): number {
        return this.data.length;
    }

    public skip(count: number): IEnumerable<T> {
        return this.enumerable.skip(count);
    }

    public skipLast(count: number): IEnumerable<T> {
        return this.enumerable.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<T>): IEnumerable<T> {
        return this.enumerable.skipWhile(predicate);
    }

    public sort(comparator?: Comparator<T>): void {
        if (!comparator) {
            comparator = AbstractCollection.defaultComparator;
        }
        this.data.sort(comparator);
    }

    public sum(predicate: Selector<T, number>): number {
        return this.enumerable.sum(predicate);
    }

    public take(count: number): IEnumerable<T> {
        return this.enumerable.take(count);
    }

    public takeEvery(step: number): IEnumerable<T> {
        return this.enumerable.takeEvery(step);
    }

    public takeLast(count: number): IEnumerable<T> {
        return this.enumerable.takeLast(count);
    }

    public takeWhile(predicate: IndexedPredicate<T>): IEnumerable<T> {
        return this.enumerable.takeWhile(predicate);
    }

    public toArray(): T[] {
        return [...this.data];
    }

    public toList(): List<T> {
        return new List<T>(this.data);
    }

    public union(enumerable: IEnumerable<T>, comparator?: EqualityComparator<T>): IEnumerable<T> {
        return this.enumerable.union(enumerable, comparator);
    }

    public where(predicate: Predicate<T>): IEnumerable<T> {
        return this.enumerable.where(predicate);
    }

    public zip<R, U = [T, R]>(enumerable: IEnumerable<R>, zipper?: Zipper<T, R, U>): IEnumerable<U> | IEnumerable<[T, R]> {
        return this.enumerable.zip(enumerable, zipper);
    }

    * [Symbol.iterator](): Iterator<T> {
        for (let item of this.data) {
            yield item;
        }
    }
}
