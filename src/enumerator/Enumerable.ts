import {IEnumerable} from "./IEnumerable";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {ErrorMessages} from "../shared/ErrorMessages";
import {Predicate} from "../shared/Predicate";
import {List} from "../list/List";
import {IndexedPredicate} from "../shared/IndexedPredicate";

export class Enumerable<TElement> implements IEnumerable<TElement> {
    private readonly enumerator: Enumerator<TElement>;

    public constructor(private readonly iterable: Iterable<TElement>) {
        this.enumerator = new Enumerator<TElement>(() => iterable);
    }

    public static from<TSource>(source: IEnumerable<TSource> | Array<TSource>): IEnumerable<TSource> {
        return new Enumerable(source);
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

    public intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return this.enumerator.intersect(enumerable, comparator);
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

    public prepend(item: TElement): IEnumerable<TElement> {
        return this.enumerator.prepend(item);
    }

    public reverse(): IEnumerable<TElement> {
        return this.enumerator.reverse();
    }

    public select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult> {
        return this.enumerator.select(selector);
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

    public toList(): List<TElement> {
        return this.enumerator.toList();
    }

    public union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return this.enumerator.union(enumerable, comparator);
    }

    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return this.enumerator.where(predicate);
    }
}

class Enumerator<TElement> implements IEnumerable<TElement> {
    public constructor(private readonly iterable: () => Iterable<TElement>) {
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.iterable()[Symbol.iterator]();
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
        return new Enumerator(() => this.unionGenerator(Enumerable.from([]), comparator));
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

    public intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.intersectGenerator(enumerable, comparator));
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

    public prepend(item: TElement): IEnumerable<TElement> {
        return new Enumerator(() => this.prependGenerator(item));
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

    public toArray(): TElement[] {
        const array: TElement[] = [];
        for (const element of this) {
            array.push(element);
        }
        return array;
    }

    public toList(): List<TElement> {
        return List.from(this);
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
        for (const item of this) {
            if (!enumerable.contains(item, comparator)) {
                yield item
            }
        }
    }

    private* intersectGenerator(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Iterable<TElement> {
        const intersectList: Array<TElement> = []
        for (const item of this) {
            if (enumerable.contains(item, comparator)) {
                const exists = intersectList.find(d => comparator(item, d));
                if (!exists) {
                    yield item;
                    intersectList.push(item);
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

    private* selectGenerator<TResult>(selector: Selector<TElement, TResult>): IterableIterator<TResult> {
        for (const d of this) {
            yield selector(d);
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

    private* takeWhileGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
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

    private* whereGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        for (const d of this) {
            if (predicate(d, index)) {
                yield d;
            }
            ++index;
        }
    }
}
