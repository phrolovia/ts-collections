import {ErrorMessages} from "../shared/ErrorMessages";
import {IGrouping} from "./IGrouping";
import {Grouping} from "./Grouping";
import {IOrderedEnumerable} from "./IOrderedEnumerable";
import {EnumerableIterator} from "./EnumerableIterator";
import {IEnumerable} from "./IEnumerable";
import {Aggregator} from "../shared/Aggregator";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {Comparator} from "../shared/Comparator";
import {JoinSelector} from "../shared/JoinSelector";
import {IndexedSelector} from "../shared/IndexedSelector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Zipper} from "../shared/Zipper";
import {List} from "../list/List";

export class Enumerable<T> implements IOrderedEnumerable<T> {
    private readonly core: EnumerableCore<T>;
    private readonly iterator: EnumerableIterator<T>;

    public constructor(private data: Array<T> | IterableIterator<T>) {
        if (data instanceof Array) {
            this.iterator = function* () {
                for (const d of data) {
                    yield d;
                }
            };
        } else {
            this.iterator = () => data;
        }
        this.core = new EnumerableCore<T>(this.iterator);
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.iterator();
    }

    public static empty<S>(): IEnumerable<S> {
        return new Enumerable<S>([]);
    }

    public static from<S>(source: Array<S>): IEnumerable<S> {
        return new Enumerable<S>(source);
    }

    public static range(start: number, count: number): IEnumerable<number> {
        return new EnumerableCore(function* () {
            for (let ix = 0; ix < count; ++ix) {
                yield start + ix;
            }
        });
    }

    public static repeat<S>(item: S, count: number): IEnumerable<S> {
        return new EnumerableCore(function* () {
            for (let ix = 0; ix < count; ++ix) {
                yield item;
            }
        });
    }

    public aggregate<R, U = R>(aggregator: Aggregator<T, R>, seed?: R, resultSelector?: Selector<R, U>): R | U {
        return this.core.aggregate(aggregator, seed, resultSelector);
    }

    public all(predicate?: Predicate<T>): boolean {
        return this.core.all(predicate);
    }

    public any(predicate?: Predicate<T>): boolean {
        return this.core.any(predicate);
    }

    public append(item: T): IEnumerable<T> {
        return this.core.append(item);
    }

    public average(selector?: Selector<T, number>): number {
        return this.core.average(selector);
    }

    public concat(enumerable: IEnumerable<T>): IEnumerable<T> {
        return this.core.concat(enumerable);
    }

    public contains(item: T, comparator?: Comparator<T>): boolean {
        return this.core.contains(item, comparator);
    }

    public count(predicate?: Predicate<T>): number {
        return this.core.count(predicate);
    }

    public defaultIfEmpty(value?: T): IEnumerable<T> {
        return this.core.defaultIfEmpty(value);
    }

    public distinct(comparator?: Comparator<T>): IEnumerable<T> {
        return this.core.distinct(comparator);
    }

    public elementAt(index: number): T {
        return this.core.elementAt(index);
    }

    public elementAtOrDefault(index: number): T {
        return this.core.elementAtOrDefault(index);
    }

    public except(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IEnumerable<T> {
        return this.core.except(enumerable, comparator);
    }

    public first(predicate?: Predicate<T>): T {
        return this.core.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<T>): T {
        return this.core.firstOrDefault(predicate);
    }

    public groupBy<R>(keySelector: Selector<T, R>, keyComparator?: Comparator<R>): IEnumerable<IGrouping<R, T>> {
        return this.core.groupBy(keySelector, keyComparator);
    }

    public groupJoin<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                              resultSelector: JoinSelector<K, IEnumerable<E>, R>, keyComparator?: Comparator<K>): IEnumerable<R> {
        return this.core.groupJoin(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public intersect(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IEnumerable<T> {
        return this.core.intersect(enumerable, comparator);
    }

    public join<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                         resultSelector: JoinSelector<T, E, R>, keyComparator?: Comparator<K>, leftJoin?: boolean): IEnumerable<R> {
        return this.core.join(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<T>): T {
        return this.core.last(predicate);
    }

    public lastOrDefault(predicate?: Predicate<T>): T {
        return this.core.lastOrDefault(predicate);
    }

    public max(selector?: Selector<T, number>): number {
        return this.core.max(selector);
    }

    public min(selector?: Selector<T, number>): number {
        return this.core.min(selector);
    }

    public orderBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return this.core.orderBy(keySelector, comparator);
    }

    public orderByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return this.core.orderByDescending(keySelector, comparator);
    }

    public prepend(item: T): IEnumerable<T> {
        return this.core.prepend(item);
    }

    public reverse(): IEnumerable<T> {
        return this.core.reverse();
    }

    public select<R>(selector: Selector<T, R>): IEnumerable<R> {
        return this.core.select(selector);
    }

    public selectMany<R>(selector: IndexedSelector<T, Iterable<R>>): IEnumerable<R> {
        return this.core.selectMany(selector);
    }

    public sequenceEqual(enumerable: IEnumerable<T>, comparator?: Comparator<T>): boolean {
        return this.core.sequenceEqual(enumerable, comparator);
    }

    public single(predicate?: Predicate<T>): T {
        return this.core.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<T>): T {
        return this.core.singleOrDefault(predicate);
    }

    public skip(count: number): IEnumerable<T> {
        return this.core.skip(count);
    }

    public skipLast(count: number): IEnumerable<T> {
        return this.core.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<T>): IEnumerable<T> {
        return this.core.skipWhile(predicate);
    }

    public sum(selector: Selector<T, number>): number {
        return this.core.sum(selector);
    }

    public take(count: number): IEnumerable<T> {
        return this.core.take(count);
    }

    public takeLast(count: number): IEnumerable<T> {
        return this.core.takeLast(count);
    }

    public takeWhile(predicate: IndexedPredicate<T>): IEnumerable<T> {
        return this.core.takeWhile(predicate);
    }

    public thenBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return this.core.thenBy(keySelector, comparator);
    }

    public thenByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return this.core.thenByDescending(keySelector, comparator);
    }

    public toArray(): T[] {
        return this.core.toArray();
    }

    public toList(): List<T> {
        return this.core.toList();
    }

    public union(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IEnumerable<T> {
        return this.core.union(enumerable, comparator);
    }

    public where(predicate: Predicate<T>): IEnumerable<T> {
        return this.core.where(predicate);
    }

    public zip<R, U>(enumerable: IEnumerable<R>, zipper?: Zipper<T, R, U>): IEnumerable<[T, R]> | IEnumerable<U> {
        return this.core.zip(enumerable, zipper);
    }
}

class EnumerableCore<T> implements IOrderedEnumerable<T> {
    public static readonly defaultComparator: Comparator<any> = <E>(i1: E, i2: E) => i1 < i2 ? -1 : i1 > i2 ? 1 : 0;

    public constructor(private readonly iterator: EnumerableIterator<T>) {
    }

    public [Symbol.iterator](): IterableIterator<T> {
        return this.iterator();
    }

    public aggregate<R, U = R>(aggregator: Aggregator<T, R>, seed?: R, resultSelector?: Selector<R, U>): R | U {
        if (!aggregator) {
            throw new Error(ErrorMessages.NoAggregatorProvided);
        }
        let aggregatedValue: R;
        if (seed == null) {
            aggregatedValue = this.first() as unknown as R;
            for (const item of this.skip(1)) {
                aggregatedValue = aggregator(aggregatedValue, item);
            }
        } else {
            aggregatedValue = seed;
            for (const item of this) {
                aggregatedValue = aggregator(aggregatedValue, item);
            }
        }
        if (resultSelector) {
            return resultSelector(aggregatedValue);
        } else {
            return aggregatedValue;
        }
    }

    public all(predicate?: Predicate<T>): boolean {
        if (!predicate) {
            return !this.iterator().next().done;
        }
        for (const d of this) {
            if (!predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public any(predicate?: Predicate<T>): boolean {
        if (!predicate) {
            return !this.iterator().next().done;
        }
        for (const item of this) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    }

    public append(item: T): IEnumerable<T> {
        return new EnumerableCore(() => this.appendGenerator(item));
    }

    public average(selector?: Selector<T, number>): number {
        let total: number = 0;
        let count: number = 0;
        for (const d of this) {
            total += selector(d);
            count++;
        }
        return total / count;
    }

    public concat(enumerable: IEnumerable<T>): IEnumerable<T> {
        return new EnumerableCore(() => this.concatGenerator(enumerable));
    }

    public contains(item: T, comparator?: Comparator<T>): boolean {
        comparator = comparator ?? EnumerableCore.defaultComparator;
        for (const d of this) {
            if (comparator(d, item) === 0) {
                return true;
            }
        }
        return false;
    }

    public count(predicate?: Predicate<T>): number {
        let count: number = 0;
        if (!predicate) {
            for (const item of this) {
                ++count;
            }
            return count;
        }
        for (const item of this) {
            if (predicate(item)) {
                ++count;
            }
        }
        return count;
    }

    public defaultIfEmpty(value?: T): IEnumerable<T> {
        return new EnumerableCore(() => this.defaultIfEmptyGenerator(value));
    }

    public distinct(comparator?: Comparator<T>): IEnumerable<T> {
        comparator = comparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.unionGenerator(Enumerable.from([]), comparator));
    }

    public elementAt(index: number): T {
        if (index < 0) {
            throw new Error("index is smaller than 0.");
        }
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
    }

    public elementAtOrDefault(index: number): T {
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        return null;
    }

    public except(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IEnumerable<T> {
        comparator = comparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.exceptGenerator(enumerable, comparator));
    }

    public first(predicate?: Predicate<T>): T {
        if (!this.any()) {
            throw new Error(ErrorMessages.NoElements);
        }
        const item = this.firstOrDefault(predicate);
        if (!item) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return item;
    }

    public firstOrDefault(predicate?: Predicate<T>): T {
        if (!predicate) {
            return this.iterator().next().value ?? null;
        } else {
            let first: T = null;
            for (const item of this) {
                if (predicate(item)) {
                    first = item;
                    break;
                }
            }
            return first;
        }
    }

    public groupBy<R>(keySelector: Selector<T, R>, keyComparator?: Comparator<R>): IEnumerable<IGrouping<R, T>> {
        keyComparator = keyComparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.groupByGenerator(keySelector, keyComparator));
    }

    public groupJoin<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                              resultSelector: JoinSelector<K, IEnumerable<E>, R>, keyComparator?: Comparator<K>): IEnumerable<R> {
        keyComparator = keyComparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.groupJoinGenerator(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator));
    }

    public join<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                         resultSelector: JoinSelector<T, E, R>, keyComparator?: Comparator<K>, leftJoin?: boolean): IEnumerable<R> {
        keyComparator = keyComparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.joinGenerator(enumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin));
    }

    public intersect(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IEnumerable<T> {
        comparator = comparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.intersectGenerator(enumerable, comparator));
    }

    public last(predicate?: Predicate<T>): T {
        let last: T = null;
        if (!predicate) {
            for (const item of this) {
                last = item;
            }
            if (!last) {
                throw new Error(ErrorMessages.NoElements);
            }
            return last;
        }
        for (const item of this) {
            if (predicate(item)) {
                last = item;
            }
        }
        if (!last) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return last;
    }

    public lastOrDefault(predicate?: Predicate<T>): T {
        let last: T = null;
        if (!predicate) {
            for (const item of this) {
                last = item;
            }
            return last;
        }
        for (const item of this) {
            if (predicate(item)) {
                last = item;
            }
        }
        return last;
    }

    public max(selector?: Selector<T, number>): number {
        let max: number = null;
        if (!selector) {
            for (const item of this) {
                max = Math.max(max ?? Number.NEGATIVE_INFINITY, item as unknown as number);
            }
            if (max == null) {
                throw new Error(ErrorMessages.NoElements);
            }
            return max;
        } else {
            for (const item of this) {
                max = Math.max(max ?? Number.NEGATIVE_INFINITY, selector(item));
            }
            if (max == null) {
                throw new Error(ErrorMessages.NoElements);
            }
            return max;
        }
    }

    public min(selector?: Selector<T, number>): number {
        let min: number = null;
        if (!selector) {
            for (const item of this) {
                min = Math.min(min ?? Number.POSITIVE_INFINITY, item as unknown as number);
            }
            if (min == null) {
                throw new Error(ErrorMessages.NoElements);
            }
            return min;
        } else {
            for (const item of this) {
                min = Math.min(min ?? Number.POSITIVE_INFINITY, selector(item));
            }
            if (min == null) {
                throw new Error(ErrorMessages.NoElements);
            }
            return min;
        }
    }

    public orderBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return OrderedEnumerableCore.createOrderedEnumerable(this, keySelector, true, false, comparator);
    }

    public orderByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return OrderedEnumerableCore.createOrderedEnumerable(this, keySelector, false, false, comparator);
    }

    public prepend(item: T): IEnumerable<T> {
        return new EnumerableCore(() => this.prependGenerator(item));
    }

    public reverse(): IEnumerable<T> {
        return new EnumerableCore(() => this.reverseGenerator());
    }

    public select<R>(selector: Selector<T, R>): IEnumerable<R> {
        if (!selector) {
            throw new Error(ErrorMessages.NoSelectorProvided);
        }
        return new EnumerableCore<R>(() => this.selectGenerator(selector));
    }

    public selectMany<R>(selector: IndexedSelector<T, Iterable<R>>): IEnumerable<R> {
        if (!selector) {
            throw new Error(ErrorMessages.NoSelectorProvided);
        }
        return new EnumerableCore(() => this.selectManyGenerator(selector));
    }

    public sequenceEqual(enumerable: IEnumerable<T>, comparator?: Comparator<T>): boolean {
        comparator = comparator ?? EnumerableCore.defaultComparator;
        const iterator = this.iterator();
        const otherIterator = enumerable[Symbol.iterator]();
        let first = iterator.next();
        let second = otherIterator.next();
        while (!first.done && !second.done) {
            if (comparator(first.value, second.value) !== 0) {
                return false;
            }
            first = iterator.next();
            second = otherIterator.next();
            if (first.done && second.done) {
                return true;
            }
        }
        return false;
    }

    public single(predicate?: Predicate<T>): T {
        let single: T = null;
        let index: number = 0;

        if (!predicate) {
            if (!this.any()) {
                throw new Error(ErrorMessages.NoElements);
            }
            for (const item of this) {
                if (index !== 0) {
                    throw new Error(ErrorMessages.MoreThanOneElement);
                } else {
                    single = item;
                    index++;
                }
            }
        } else {
            if (!this.any()) {
                throw new Error(ErrorMessages.NoElements);
            }
            for (const item of this) {
                if (predicate(item)) {
                    if (index !== 0) {
                        throw new Error(ErrorMessages.MoreThanOneMatchingElement);
                    } else {
                        single = item;
                        index++;
                    }
                }
            }
        }
        if (index === 0) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return single;
    }

    public singleOrDefault(predicate?: Predicate<T>): T {
        let single: T = null;
        let index: number = 0;
        if (!predicate) {
            for (const item of this) {
                if (index !== 0) {
                    throw new Error(ErrorMessages.MoreThanOneElement);
                } else {
                    single = item;
                    index++;
                }
            }
            return single;
        } else {
            for (const item of this) {
                if (predicate(item)) {
                    if (index !== 0) {
                        throw new Error(ErrorMessages.MoreThanOneMatchingElement);
                    } else {
                        single = item;
                        index++;
                    }
                }
            }
            return single;
        }
    }

    public skip(count: number): IEnumerable<T> {
        return new EnumerableCore(() => this.skipGenerator(count));
    }

    public skipLast(count: number): IEnumerable<T> {
        return new EnumerableCore(() => this.skipLastGenerator(count));
    }

    public skipWhile(predicate: IndexedPredicate<T>): IEnumerable<T> {
        return new EnumerableCore(() => this.skipWhileGenerator(predicate));
    }

    public sum(selector: Selector<T, number>): number {
        let total: number = 0;
        for (const d of this) {
            total += selector(d);
        }
        return total;
    }

    public take(count: number): IEnumerable<T> {
        return new EnumerableCore(() => this.takeGenerator(count));
    }

    public takeLast(count: number): IEnumerable<T> {
        return new EnumerableCore(() => this.takeLastGenerator(count));
    }

    public takeWhile(predicate: IndexedPredicate<T>): IEnumerable<T> {
        return new EnumerableCore(() => this.takeWhileGenerator(predicate));
    }

    public thenBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return OrderedEnumerableCore.createOrderedEnumerable(this, keySelector, true, true, comparator);
    }

    public thenByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T> {
        return OrderedEnumerableCore.createOrderedEnumerable(this, keySelector, false, true, comparator);
    }

    public toArray(): Array<T> {
        return Array.from(this);
    }

    public toList(): List<T> {
        return new List<T>(Array.from(this));
    }

    public union(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IEnumerable<T> {
        comparator = comparator ?? EnumerableCore.defaultComparator;
        return new EnumerableCore(() => this.unionGenerator(enumerable, comparator));
    }

    public where(predicate: Predicate<T>): IEnumerable<T> {
        return new EnumerableCore<T>(() => this.whereGenerator(predicate));
    }

    public zip<R, U>(enumerable: IEnumerable<R>, zipper?: Zipper<T, R, U>): IEnumerable<[T, R]> | IEnumerable<U> {
        if (!zipper) {
            return new EnumerableCore(() => this.zipTupleGenerator(enumerable));
        } else {
            return new EnumerableCore(() => this.zipGenerator(enumerable, zipper));
        }
    }

    private* appendGenerator(item: T): IterableIterator<T> {
        yield* this;
        yield item;
    }

    private* concatGenerator(enumerable: IEnumerable<T>): IterableIterator<T> {
        yield* this;
        yield* enumerable;
    }

    private* defaultIfEmptyGenerator(value?: T): IterableIterator<T> {
        if (this.any()) {
            yield* this;
        } else {
            yield value;
            yield* this;
        }
    }

    private* exceptGenerator(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IterableIterator<T> {
        for (const item of this) {
            if (!enumerable.contains(item, comparator)) {
                yield item
            }
        }
    }

    private* groupByGenerator<R>(keySelector: Selector<T, R>, keyComparator?: Comparator<R>): IterableIterator<IGrouping<R, T>> {
        const groupedEnumerable = this.select(keySelector).distinct(keyComparator)
            .select(k => new Grouping(k, this.where(d => keyComparator(k, keySelector(d)) === 0).toArray()));
        yield* groupedEnumerable;
    }

    private* groupJoinGenerator<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                                         resultSelector: JoinSelector<K, IEnumerable<E>, R>, keyComparator?: Comparator<K>): IterableIterator<R> {
        for (let item of this) {
            const joinedEntries = enumerable.where(innerData => keyComparator(outerKeySelector(item), innerKeySelector(innerData)) === 0);
            yield resultSelector(outerKeySelector(item), joinedEntries);
        }
    }

    private* intersectGenerator(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IterableIterator<T> {
        const intersectList: Array<T> = []
        for (const item of this) {
            if (enumerable.contains(item, comparator)) {
                const exists = intersectList.find(d => comparator(item, d) === 0);
                if (!exists) {
                    yield item;
                    intersectList.push(item);
                }
            }
        }
    }

    private* joinGenerator<E, K, R>(enumerable: IEnumerable<E>, outerKeySelector: Selector<T, K>, innerKeySelector: Selector<E, K>,
                                    resultSelector: JoinSelector<T, E, R>, keyComparator?: Comparator<K>, leftJoin?: boolean): IterableIterator<R> {
        for (const item of this) {
            const outerItems = enumerable.where(innerData => keyComparator(outerKeySelector(item), innerKeySelector(innerData)) === 0);
            if (leftJoin && !outerItems.any()) {
                yield resultSelector(item, null);
            } else {
                for (const outerItem of outerItems) {
                    yield resultSelector(item, outerItem);
                }
            }
        }
    }

    private* prependGenerator(item: T): IterableIterator<T> {
        yield item;
        yield* this;
    }

    private* reverseGenerator(): IterableIterator<T> {
        yield* Array.from(this).reverse();
    }

    private* selectGenerator<R>(selector: Selector<T, R>): IterableIterator<R> {
        for (const d of this) {
            yield selector(d);
        }
    }

    private* selectManyGenerator<R>(selector: IndexedSelector<T, Iterable<R>>): IterableIterator<R> {
        let index = 0;
        for (const item of this) {
            for (const subItem of selector(item, index)) {
                yield subItem;
            }
            ++index;
        }
    }

    private* skipGenerator(count: number): IterableIterator<T> {
        let index = 0;
        for (const item of this) {
            if (index >= count) {
                yield item;
            }
            ++index;
        }
    }

    private* skipLastGenerator(count: number): IterableIterator<T> {
        const result: Array<T> = [];
        for (const item of this) {
            result.push(item);
            if (result.length > count) {
                yield result.shift();
            }
        }
    }

    private* skipWhileGenerator(predicate: IndexedPredicate<T>): IterableIterator<T> {
        let index = 0;
        let skipEnded = false;
        for (const item of this) {
            if (skipEnded) {
                yield item;
            } else {
                if (predicate(item, index)) {
                    index++;
                } else {
                    skipEnded = true;
                    yield item;
                }
            }
        }
    }

    private* takeGenerator(count: number): IterableIterator<T> {
        let index = 0;
        for (const item of this) {
            if (index < count) {
                yield item;
                index++;
            }
        }
    }

    private* takeLastGenerator(count: number): IterableIterator<T> {
        const result: Array<T> = [];
        for (const item of this) {
            result.push(item);
            if (result.length > count) {
                result.shift();
            }
        }
        yield* result;
    }

    private* takeWhileGenerator(predicate: IndexedPredicate<T>): IterableIterator<T> {
        let index = 0;
        let takeEnded = false;
        for (const item of this) {
            if (!takeEnded) {
                if (predicate(item, index)) {
                    yield item;
                    ++index;
                } else {
                    takeEnded = true;
                }
            }
        }
    }

    private* unionGenerator(enumerable: IEnumerable<T>, comparator?: Comparator<T>): IterableIterator<T> {
        const distinctList: Array<T> = [];
        for (const source of [this, enumerable]) {
            for (const item of source) {
                let exists = false;
                for (const existingItem of distinctList) {
                    if (comparator(item, existingItem) === 0) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    yield item;
                    distinctList.push(item);
                }
            }
        }
    }

    private* whereGenerator(predicate: Predicate<T>): IterableIterator<T> {
        for (const d of this) {
            if (predicate(d)) {
                yield d;
            }
        }
    }

    private* zipGenerator<R, U>(enumerable: IEnumerable<R>, zipper: Zipper<T, R, U>): IterableIterator<U> {
        const iterator = this.iterator();
        const otherIterator = enumerable[Symbol.iterator]();
        while (true) {
            let first = iterator.next();
            let second = otherIterator.next();
            if (first.done || second.done) {
                break;
            } else {
                yield zipper(first.value, second.value);
            }
        }
    }

    private* zipTupleGenerator<R>(enumerable: IEnumerable<R>): IterableIterator<[T, R]> {
        const iterator = this.iterator();
        const otherIterator = enumerable[Symbol.iterator]();
        while (true) {
            let first = iterator.next();
            let second = otherIterator.next();
            if (first.done || second.done) {
                break;
            } else {
                yield [first.value, second.value];
            }
        }
    }
}

class OrderedEnumerableCore<T> extends EnumerableCore<T> implements IOrderedEnumerable<T>{
    public constructor(public readonly orderedValueGroups: () => IterableIterator<T[]>) {
        super(function* () {
            for (const group of orderedValueGroups()) {
                yield* group;
            }
        });
    }

    public static createOrderedEnumerable<T, K>(source: Iterable<T> | IOrderedEnumerable<T>, keySelector: Selector<T, K>, ascending: boolean, viaThenBy?: boolean, comparator?: Comparator<K>) {
        const keyValueGenerator = function* <K>(source: Iterable<T> | IOrderedEnumerable<T>, keySelector: Selector<T, K>, ascending: boolean, comparator?: Comparator<K>): IterableIterator<T[]> {
            comparator = comparator ?? EnumerableCore.defaultComparator;
            const sortMap = OrderedEnumerableCore.createKeyValueMap(source, keySelector);
            const sortedKeys = Array.from(sortMap.keys()).sort(comparator);
            if (ascending) {
                for (const key of sortedKeys) {
                    yield sortMap.get(key);
                }
            } else {
                for (const key of sortedKeys.reverse()) {
                    yield sortMap.get(key);
                }
            }
        }
        if (source instanceof OrderedEnumerableCore && viaThenBy) {
            return new OrderedEnumerableCore(function* () {
                for (const group of source.orderedValueGroups()) {
                    yield* keyValueGenerator(group, keySelector, ascending, comparator);
                }
            })
        } else {
            return new OrderedEnumerableCore<T>(() => keyValueGenerator(source, keySelector, ascending, comparator));
        }
    }

    private static createKeyValueMap<T, K>(source: Iterable<T> | IEnumerable<T>, keySelector: Selector<T, K>): Map<K, T[]> {
        const sortMap: Map<K, T[]> = new Map<K, T[]>();
        for (const item of source) {
            const key = keySelector(item);
            const value = sortMap.get(key);
            if (value) {
                value.push(item);
            } else {
                sortMap.set(key, [item]);
            }
        }
        return sortMap;
    }
}
