import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {ErrorMessages} from "../shared/ErrorMessages";
import {Predicate} from "../shared/Predicate";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Zipper} from "../shared/Zipper";
import {JoinSelector} from "../shared/JoinSelector";
import {OrderComparator} from "../shared/OrderComparator";
import {Dictionary, IEnumerable, ILookup, IOrderedEnumerable, KeyValuePair, List} from "../../imports";
import {Lookup} from "../lookup/Lookup";
import {IndexedAction} from "../shared/IndexedAction";

export class Enumerable<TElement> implements IEnumerable<TElement> {
    private readonly enumerator: Enumerator<TElement>;

    public constructor(private readonly iterable: Iterable<TElement>) {
        this.enumerator = new Enumerator<TElement>(() => iterable);
    }

    public static empty<TSource>(): IEnumerable<TSource> {
        return new Enumerable<TSource>([]);
    }

    public static from<TSource>(source: IEnumerable<TSource> | Array<TSource>): IEnumerable<TSource> {
        return new Enumerable(source);
    }

    public static range(start: number, count: number): IEnumerable<number> {
        return new Enumerator(function* () {
            for (let ix = 0; ix < count; ++ix) {
                yield start + ix;
            }
        });
    }

    public static repeat<TSource>(element: TSource, count: number): IEnumerable<TSource> {
        return new Enumerator(function* () {
            for (let ix = 0; ix < count; ++ix) {
                yield element;
            }
        });
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.iterable[Symbol.iterator]();
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return this.enumerator.aggregate(accumulator, seed, resultSelector);
    }

    public all(predicate?: Predicate<TElement>): boolean {
        return this.enumerator.all(predicate);
    }

    public any(predicate?: Predicate<TElement>): boolean {
        return this.enumerator.any(predicate);
    }

    public append(element: TElement): IEnumerable<TElement> {
        return this.enumerator.append(element);
    }

    public average(selector?: Selector<TElement, number>): number {
        return this.enumerator.average(selector);
    }

    public concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return this.enumerator.concat(enumerable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.enumerator.contains(element, comparator);
    }

    public count(predicate?: Predicate<TElement>): number {
        return this.enumerator.count(predicate);
    }

    public defaultIfEmpty(value?: TElement): IEnumerable<TElement> {
        return this.enumerator.defaultIfEmpty(value);
    }

    public distinct(comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return this.enumerator.distinct(comparator);
    }

    public elementAt(index: number): TElement {
        return this.enumerator.elementAt(index);
    }

    public elementAtOrDefault(index: number): TElement {
        return this.enumerator.elementAtOrDefault(index);
    }

    public except(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return this.enumerator.except(enumerable, comparator);
    }

    public first(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.firstOrDefault(predicate);
    }

    public forEach(action: IndexedAction<TElement>): void {
        this.enumerator.forEach(action);
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.enumerator.groupBy(keySelector, keyComparator);
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        return this.enumerator.groupJoin(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return this.enumerator.intersect(enumerable, comparator);
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return this.enumerator.join(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.last(predicate);
    }

    public lastOrDefault(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.lastOrDefault(predicate);
    }

    public max(selector?: Selector<TElement, number>): number {
        return this.enumerator.max(selector);
    }

    public min(selector?: Selector<TElement, number>): number {
        return this.enumerator.min(selector);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return this.enumerator.orderBy(keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return this.enumerator.orderByDescending(keySelector, comparator);
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        return this.enumerator.prepend(element);
    }

    public reverse(): IEnumerable<TElement> {
        return this.enumerator.reverse();
    }

    public select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult> {
        return this.enumerator.select(selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return this.enumerator.selectMany(selector);
    }

    public sequenceEqual(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        return this.enumerator.sequenceEqual(enumerable, comparator);
    }

    public single(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<TElement>): TElement {
        return this.enumerator.singleOrDefault(predicate);
    }

    public skip(count: number): IEnumerable<TElement> {
        return this.enumerator.skip(count);
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return this.enumerator.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return this.enumerator.skipWhile(predicate);
    }

    public sum(selector?: Selector<TElement, number>): number {
        return this.enumerator.sum(selector);
    }

    public take(count: number): IEnumerable<TElement> {
        return this.enumerator.take(count);
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return this.enumerator.takeLast(count);
    }

    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return this.enumerator.takeWhile(predicate);
    }

    public toArray(): TElement[] {
        return this.enumerator.toArray();
    }

    public toDictionary<TKey, TValue>(keySelector?: Selector<TElement, TKey>, valueSelector?: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return this.enumerator.toDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        return this.enumerator.toList(comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return this.enumerator.toLookup(keySelector, valueSelector, keyComparator);
    }

    public union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return this.enumerator.union(enumerable, comparator);
    }

    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return this.enumerator.where(predicate);
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return this.enumerator.zip(enumerable, zipper);
    }
}

class Enumerator<TElement> implements IOrderedEnumerable<TElement> {
    public constructor(private readonly iterable: () => Iterable<TElement>) {
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.iterable();
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        if (!accumulator) {
            throw new Error(ErrorMessages.NoAccumulatorProvided);
        }
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            if (!this.any()) {
                throw new Error(ErrorMessages.NoElements);
            }
            accumulatedValue = this.first() as unknown as TAccumulate;
            for (const element of this.skip(1)) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        } else {
            accumulatedValue = seed;
            for (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        }
        if (resultSelector) {
            return resultSelector(accumulatedValue);
        } else {
            return accumulatedValue;
        }
    }

    public all(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !this[Symbol.iterator]().next().done;
        }
        for (const d of this) {
            if (!predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public any(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !this[Symbol.iterator]().next().done;
        }
        for (const element of this) {
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }

    public append(element: TElement): IEnumerable<TElement> {
        return new Enumerator(() => this.appendGenerator(element));
    }

    public average(selector?: Selector<TElement, number>): number {
        if (!this.any()) {
            throw new Error(ErrorMessages.NoElements);
        }
        let total: number = 0;
        let count: number = 0;
        for (const d of this) {
            total += selector?.(d) ?? d as unknown as number;
            count++;
        }
        return total / count;
    }

    public concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return new Enumerator(() => this.concatGenerator(enumerable));
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        for (const e of this) {
            if (comparator(e, element)) {
                return true;
            }
        }
        return false;
    }

    public count(predicate?: Predicate<TElement>): number {
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

    public defaultIfEmpty(value?: TElement): IEnumerable<TElement> {
        return new Enumerator(() => this.defaultIfEmptyGenerator(value));
    }

    public distinct(comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionGenerator(Enumerable.empty(), comparator));
    }

    public elementAt(index: number): TElement {
        if (index < 0) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        throw new Error(ErrorMessages.IndexOutOfBoundsException);
    }

    public elementAtOrDefault(index: number): TElement {
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        return null;
    }

    public except(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.exceptGenerator(enumerable, comparator));
    }

    public first(predicate?: Predicate<TElement>): TElement {
        if (!this.any()) {
            throw new Error(ErrorMessages.NoElements);
        }
        const item = this.firstOrDefault(predicate);
        if (!item) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return item;
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement {
        if (!predicate) {
            return this[Symbol.iterator]().next().value ?? null;
        } else {
            let first: TElement = null;
            for (const item of this) {
                if (predicate(item)) {
                    first = item;
                    break;
                }
            }
            return first;
        }
    }

    public forEach(action: IndexedAction<TElement>): void {
        let index = 0;
        for (const item of this) {
            action(item, index++);
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGrouping<TKey, TElement>> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.groupByGenerator(keySelector, keyComparator));
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.groupJoinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator));
    }

    public intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.intersectGenerator(enumerable, comparator));
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.joinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin));
    }

    public last(predicate?: Predicate<TElement>): TElement {
        let last: TElement = null;
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

    public lastOrDefault(predicate?: Predicate<TElement>): TElement {
        let last: TElement = null;
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

    public max(selector?: Selector<TElement, number>): number {
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

    public min(selector?: Selector<TElement, number>): number {
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

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, true, false, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, false, false, comparator);
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        return new Enumerator(() => this.prependGenerator(element));
    }

    public reverse(): IEnumerable<TElement> {
        return new Enumerator(() => this.reverseGenerator());
    }

    public select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult> {
        if (!selector) {
            throw new Error(ErrorMessages.NoSelectorProvided);
        }
        return new Enumerator<TResult>(() => this.selectGenerator(selector));
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        if (!selector) {
            throw new Error(ErrorMessages.NoSelectorProvided);
        }
        return new Enumerator(() => this.selectManyGenerator(selector));
    }

    public sequenceEqual(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        const iterator = this[Symbol.iterator]();
        const otherIterator = enumerable[Symbol.iterator]();
        let first = iterator.next();
        let second = otherIterator.next();
        while (!first.done && !second.done) {
            if (!comparator(first.value, second.value)) {
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

    public single(predicate?: Predicate<TElement>): TElement {
        let single: TElement = null;
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

    public singleOrDefault(predicate?: Predicate<TElement>): TElement {
        let single: TElement = null;
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

    public skip(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.skipGenerator(count));
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.skipLastGenerator(count));
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        if (!predicate) {
            throw new Error(ErrorMessages.NoPredicateProvided);
        }
        return new Enumerator(() => this.skipWhileGenerator(predicate));
    }

    public sum(selector?: Selector<TElement, number>): number {
        if (!this.any()) {
            throw new Error(ErrorMessages.NoElements);
        }
        let total: number = 0;
        for (const d of this) {
            total += selector?.(d) ?? d as unknown as number;
        }
        return total;
    }

    public take(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.takeGenerator(count));
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return new Enumerator(() => this.takeLastGenerator(count));
    }

    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        if (!predicate) {
            throw new Error(ErrorMessages.NoPredicateProvided);
        }
        return new Enumerator(() => this.takeWhileGenerator(predicate));
    }

    public thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, true, true, comparator);
    }

    public thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, false, true, comparator);
    }

    public toArray(): TElement[] {
        const array: TElement[] = [];
        for (const element of this) {
            array.push(element);
        }
        return array;
    }

    public toDictionary<TKey, TValue>(keySelector?: Selector<TElement, TKey>, valueSelector?: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        const dictionary = new Dictionary<TKey, TValue>(keyComparator, valueComparator, Enumerable.empty());
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            if (!dictionary.containsKey(key) || !dictionary.containsValue(value, valueComparator)) {
                dictionary.add(key, value);
            }
        }
        return dictionary;
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        return new List<TElement>(this, comparator);
    }

    public toLookup<TKey, TValue>(keySelector?: Selector<TElement, TKey>, valueSelector?: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return Lookup.create(this, keySelector, valueSelector, keyComparator);
    }

    public union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionGenerator(enumerable, comparator));
    }

    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        if (!predicate) {
            throw new Error(ErrorMessages.NoPredicateProvided);
        }
        return new Enumerator<TElement>(() => this.whereGenerator(predicate));
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        if (!zipper) {
            return new Enumerator(() => this.zipTupleGenerator(enumerable));
        } else {
            return new Enumerator(() => this.zipGenerator(enumerable, zipper));
        }
    }

    private* appendGenerator(element: TElement): Iterable<TElement> {
        yield* this;
        yield element;
    }

    private* concatGenerator(enumerable: IEnumerable<TElement>): Iterable<TElement> {
        yield* this;
        yield* enumerable;
    }

    private* defaultIfEmptyGenerator(value?: TElement): Iterable<TElement> {
        if (this.any()) {
            yield* this;
        } else {
            yield value;
            yield* this;
        }
    }

    private* exceptGenerator(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Iterable<TElement> {
        const list = new List<TElement>([], comparator);
        for (const item of enumerable) {
            if (list.indexOf(item) === -1) {
                list.add(item);
            }
        }
        for (const item of this) {
            if (list.indexOf(item) === -1) {
                list.add(item);
                yield item;
            }
        }
    }

    private* groupByGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): Iterable<IGrouping<TKey, TElement>> {
        const groupedEnumerable = this.select(keySelector).distinct(keyComparator)
            .select(k => new Grouping(k, this.where(d => keyComparator(k, keySelector(d)))));
        yield* groupedEnumerable;
    }

    private* groupJoinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): Iterable<TResult> {
        for (const element of this) {
            const joinedEntries = innerEnumerable.where(innerElement => keyComparator(outerKeySelector(element), innerKeySelector(innerElement)));
            yield resultSelector(outerKeySelector(element), joinedEntries);
        }
    }

    private* intersectGenerator(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Iterable<TElement> {
        const list = new List<TElement>([], comparator);
        for (const item of enumerable) {
            if (list.indexOf(item) === -1) {
                list.add(item);
            }
        }
        for (const item of this) {
            if (list.remove(item)) {
                yield item;
            }
        }
    }

    private* joinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): Iterable<TResult> {
        for (const element of this) {
            const innerItems = innerEnumerable.where(innerElement => keyComparator(outerKeySelector(element), innerKeySelector(innerElement)));
            if (leftJoin && !innerItems.any()) {
                yield resultSelector(element, null);
            } else {
                for (const innerItem of innerItems) {
                    yield resultSelector(element, innerItem);
                }
            }
        }
    }

    private* prependGenerator(item: TElement): Iterable<TElement> {
        yield item;
        yield* this;
    }

    private* reverseGenerator(): Iterable<TElement> {
        yield* Array.from(this).reverse();
    }

    private* selectGenerator<TResult>(selector: Selector<TElement, TResult>): Iterable<TResult> {
        for (const d of this) {
            yield selector(d);
        }
    }

    private* selectManyGenerator<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): Iterable<TResult> {
        let index = 0;
        for (const item of this) {
            yield* selector(item, index);
            ++index;
        }
    }

    private* skipGenerator(count: number): Iterable<TElement> {
        let index = 0;
        for (const item of this) {
            if (index >= count) {
                yield item;
            }
            ++index;
        }
    }

    private* skipLastGenerator(count: number): IterableIterator<TElement> {
        const result: Array<TElement> = [];
        for (const item of this) {
            result.push(item);
            if (result.length > count) {
                yield result.shift();
            }
        }
    }

    private* skipWhileGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
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

    private* takeGenerator(count: number): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            if (index < count) {
                yield item;
                index++;
            }
        }
    }

    private* takeLastGenerator(count: number): IterableIterator<TElement> {
        const result: Array<TElement> = [];
        for (const item of this) {
            result.push(item);
            if (result.length > count) {
                result.shift();
            }
        }
        yield* result;
    }

    private* takeWhileGenerator(predicate: IndexedPredicate<TElement>): Iterable<TElement> {
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

    private* unionGenerator(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Iterable<TElement> {
        const distinctList: Array<TElement> = [];
        for (const source of [this, enumerable]) {
            for (const item of source) {
                let exists = false;
                for (const existingItem of distinctList) {
                    if (comparator(item, existingItem)) {
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

    private* whereGenerator(predicate: IndexedPredicate<TElement>): Iterable<TElement> {
        let index = 0;
        for (const d of this) {
            if (predicate(d, index)) {
                yield d;
            }
            ++index;
        }
    }

    private* zipGenerator<TSecond, TResult>(enumerable: IEnumerable<TSecond>, zipper: Zipper<TElement, TSecond, TResult>): Iterable<TResult> {
        const iterator = this[Symbol.iterator]();
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

    private* zipTupleGenerator<TSecond>(enumerable: IEnumerable<TSecond>): Iterable<[TElement, TSecond]> {
        const iterator = this[Symbol.iterator]();
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

class OrderedEnumerator<TElement> extends Enumerator<TElement> implements IOrderedEnumerable<TElement> {
    public constructor(public readonly orderedValueGroups: () => Iterable<Iterable<TElement>>) {
        super(function* () {
            for (const group of orderedValueGroups()) {
                yield* group;
            }
        });
    }

    public static createOrderedEnumerable<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, viaThenBy?: boolean, comparator?: OrderComparator<TKey>) {
        const keyValueGenerator = function* <TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>, ascending: boolean, comparator?: OrderComparator<TKey>): Iterable<Iterable<TElement>> {
            comparator ??= Comparators.orderComparator;
            const sortMap = OrderedEnumerator.createKeyValueMap(source, keySelector);
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
        if (source instanceof OrderedEnumerator && viaThenBy) {
            return new OrderedEnumerator(function* () {
                for (const group of source.orderedValueGroups()) {
                    yield* keyValueGenerator(group, keySelector, ascending, comparator);
                }
            });
        } else {
            return new OrderedEnumerator<TElement>(() => keyValueGenerator(source, keySelector, ascending, comparator));
        }
    }

    private static createKeyValueMap<TElement, TKey>(source: Iterable<TElement>, keySelector: Selector<TElement, TKey>): Map<TKey, Iterable<TElement>> {
        const sortMap: Map<TKey, TElement[]> = new Map<TKey, TElement[]>();
        for (const element of source) {
            const key = keySelector(element);
            const value = sortMap.get(key);
            if (value) {
                value.push(element);
            } else {
                sortMap.set(key, [element]);
            }
        }
        return sortMap;
    }
}

export interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
    readonly key: TKey;
    readonly source: IEnumerable<TElement>;
}

export class Grouping<TKey, TElement> extends Enumerable<TElement> implements IGrouping<TKey, TElement> {
    readonly key: TKey;
    readonly source: IEnumerable<TElement>;

    public constructor(key: TKey, source: IEnumerable<TElement>) {
        super(source);
        this.key = key;
        this.source = source;
    }
}
