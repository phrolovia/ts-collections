import {IAsyncEnumerable} from "./IAsyncEnumerable";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {ErrorMessages} from "../shared/ErrorMessages";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {Predicate} from "../shared/Predicate";
import {
    Enumerable,
    EnumerableSet,
    Group,
    IEnumerable,
    IGroup,
    IOrderedAsyncEnumerable,
    List,
    OrderedAsyncEnumerator,
    SortedSet
} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {OrderComparator} from "../shared/OrderComparator";
import {IndexedAction} from "../shared/IndexedAction";
import {JoinSelector} from "../shared/JoinSelector";
import {PairwiseSelector} from "../shared/PairwiseSelector";
import {AsyncEnumerable} from "./AsyncEnumerable";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Zipper} from "../shared/Zipper";

export class AsyncEnumerator<TElement> implements IAsyncEnumerable<TElement> {

    public constructor(private readonly iterable: () => AsyncIterable<TElement>) {
    }

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* await this.iterable();
    }

    public async aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            let index = 0;
            for await (const element of this) {
                if (index === 0) {
                    accumulatedValue = element as unknown as TAccumulate;
                } else {
                    accumulatedValue = accumulator(accumulatedValue, element);
                }
                ++index;
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        }
        return resultSelector?.(accumulatedValue) ?? accumulatedValue;
    }

    public async all(predicate: Predicate<TElement>): Promise<boolean> {
        for await (const element of this) {
            if (!predicate(element)) {
                return false;
            }
        }
        return true;
    }

    public async any(predicate?: Predicate<TElement>): Promise<boolean> {
        if (!predicate) {
            return this[Symbol.asyncIterator]().next().then(result => !result.done);
        }
        for await (const element of this) {
            if (predicate(element)) {
                return true;
            }
        }
        return false;
    }

    public append(element: TElement): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.appendGenerator(element));
    }

    public async average(selector?: Selector<TElement, number>): Promise<number> {
        let total = 0;
        let count = 0;
        for await (const element of this) {
            total += selector?.(element) ?? element as number;
            ++count;
        }
        if (count === 0) {
            throw new Error(ErrorMessages.NoElements);
        }
        return total / count;
    }

    public chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new Error(ErrorMessages.InvalidChunkSize);
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.chunkGenerator(size));
    }

    public concat(other: IAsyncEnumerable<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.concatGenerator(other));
    }

    public async contains(element: TElement, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        comparator ??= Comparators.equalityComparator;
        for await (const e of this) {
            if (comparator(e, element)) {
                return true;
            }
        }
        return false;
    }

    public async count(predicate?: Predicate<TElement>): Promise<number> {
        if (!predicate) {
            return this.toArray().then(array => array.length);
        }
        let count = 0;
        for await (const element of this) {
            if (predicate(element)) {
                ++count;
            }
        }
        return count;
    }

    public defaultIfEmpty(defaultValue?: TElement): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.defaultIfEmptyGenerator(defaultValue));
    }

    public distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        keyComparator ??= Comparators.equalityComparator;
        keySelector ??= (element: TElement) => element as unknown as TKey;
        return new AsyncEnumerator<TElement>(() => this.unionGeneratorWithKeySelector(
            new AsyncEnumerator(async function* () {
                yield* [];
            }), keySelector, keyComparator));
    }

    public async elementAt(index: number): Promise<TElement> {
        if (index < 0) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        let count = 0;
        for await (const element of this) {
            if (count === index) {
                return element;
            }
            ++count;
        }
        throw new Error(ErrorMessages.NoSuchElement);
    }

    public async elementAtOrDefault(index: number): Promise<TElement | null> {
        if (index < 0) {
            return null;
        }
        let count = 0;
        for await (const element of this) {
            if (count === index) {
                return element;
            }
            ++count;
        }
        return null;
    }

    public except(enumerable: IAsyncEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.exceptGenerator(enumerable, comparator, orderComparator));
    }

    public async first(predicate?: Predicate<TElement>): Promise<TElement> {
        let count = 0;
        for await (const element of this) {
            ++count;
            if (!predicate) {
                return element;
            }
            if (predicate(element)) {
                return element;
            }
        }
        if (count === 0) {
            throw new Error(ErrorMessages.NoElements);
        }
        throw new Error(ErrorMessages.NoMatchingElement);
    }

    public async firstOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        for await (const element of this) {
            if (!predicate) {
                return element;
            }
            if (predicate(element)) {
                return element;
            }
        }
        return null;
    }

    public async forEach(action: IndexedAction<TElement>): Promise<void> {
        let index = 0;
        for await (const element of this) {
            action(element, index);
            ++index;
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<IGroup<TKey, TElement>> {
        keyComparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<IGroup<TKey, TElement>>(() => this.groupByGenerator(keySelector, keyComparator));
    }

    public groupJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TResult>(() => this.groupJoinGenerator(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator));
    }

    public intersect(enumerable: IAsyncEnumerable<TElement>, comparator?: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.intersectGenerator(enumerable, comparator, orderComparator));
    }

    public join<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IAsyncEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TResult>(() => this.joinGenerator(inner, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin));
    }

    public async last(predicate?: Predicate<TElement>): Promise<TElement> {
        let last: TElement | null = null;
        let count = 0;
        for await (const element of this) {
            ++count;
            if (!predicate) {
                last = element;
            } else if (predicate(element)) {
                last = element;
            }
        }
        if (count === 0) {
            throw new Error(ErrorMessages.NoElements);
        }
        if (last == null) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return last;
    }

    public async lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        let last: TElement | null = null;
        for await (const element of this) {
            if (!predicate) {
                last = element;
            } else if (predicate(element)) {
                last = element;
            }
        }
        return last;
    }

    public async max(selector?: Selector<TElement, number>): Promise<number> {
        let max: number | null = null;
        for await (const element of this) {
            const value = selector ? selector(element) : element as unknown as number;
            max = Math.max(max ?? Number.NEGATIVE_INFINITY, value);
        }
        if (max == null) {
            throw new Error(ErrorMessages.NoElements);
        }
        return max;
    }

    public async min(selector?: Selector<TElement, number>): Promise<number> {
        let min: number | null = null;
        for await (const element of this) {
            const value = selector ? selector(element) : element as unknown as number;
            min = Math.min(min ?? Number.POSITIVE_INFINITY, value);
        }
        if (min == null) {
            throw new Error(ErrorMessages.NoElements);
        }
        return min;
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, true, false, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, false, false, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IAsyncEnumerable<[TElement, TElement]> {
        return new AsyncEnumerator<[TElement, TElement]>(() => this.pairwiseGenerator(resultSelector));
    }

    public async partition(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]> {
        const trueElements: TElement[] = [];
        const falseElements: TElement[] = [];
        for await (const element of this) {
            if (predicate(element)) {
                trueElements.push(element);
            } else {
                falseElements.push(element);
            }
        }
        return [Enumerable.from(trueElements), Enumerable.from(falseElements)];
    }

    public prepend(element: TElement): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.prependGenerator(element));
    }

    public reverse(): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.reverseGenerator());
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IAsyncEnumerable<TAccumulate> {
        return new AsyncEnumerator<TAccumulate>(() => this.scanGenerator(accumulator, seed));
    }

    public select<TResult>(selector: Selector<TElement, TResult>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.selectGenerator(selector));
    }

    public selectMany<TResult>(selector: Selector<TElement, Iterable<TResult>>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.selectManyGenerator(selector));
    }

    public async sequenceEqual(enumerable: IAsyncEnumerable<TElement>, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        comparator ??= Comparators.equalityComparator;
        const iterator = this[Symbol.asyncIterator]();
        const otherIterator = enumerable[Symbol.asyncIterator]();
        let first = iterator.next();
        let second = otherIterator.next();
        while (!(await first).done && !(await second).done) {
            if (!comparator((await first).value, (await second).value)) {
                return false;
            }
            first = iterator.next();
            second = otherIterator.next();
            if((await first).done && (await second).done) {
                return true;
            }
        }
        return false;
    }

    public async single(predicate?: Predicate<TElement>): Promise<TElement> {
        const result = await this.singleOrDefault(predicate);
        if (result === null) {
            throw new Error(ErrorMessages.NoMatchingElement);
        }
        return result;
    }

    public async singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        let single: TElement | null = null;
        let index = 0;
        if (!predicate) {
            for await (const element of this) {
                if (index !== 0) {
                    throw new Error(ErrorMessages.MoreThanOneElement);
                }
                single = element;
                ++index;
            }
        } else {
            for await (const element of this) {
                if (predicate(element)) {
                    if (index !== 0) {
                        throw new Error(ErrorMessages.MoreThanOneMatchingElement);
                    }
                    single = element;
                    ++index;
                }
            }
        }
        return single;
    }

    public skip(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.skipGenerator(count));
    }

    public skipLast(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.skipLastGenerator(count));
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.skipWhileGenerator(predicate));
    }

    public async sum(selector?: Selector<TElement, number>): Promise<number> {
        let count = 0;
        let sum = 0;
        for await (const element of this) {
            sum += selector?.(element) ?? element as unknown as number;
            ++count;
        }
        if (count === 0) {
            throw new Error(ErrorMessages.NoElements);
        }
        return sum;
    }

    public take(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.takeGenerator(count));
    }

    public takeLast(count: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.takeLastGenerator(count));
    }

    public takeWhile(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.takeWhileGenerator(predicate));
    }

    public thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, true, true, comparator);
    }

    public thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement> {
        return OrderedAsyncEnumerator.createOrderedEnumerable(this, keySelector, false, true, comparator);
    }

    public async toArray(): Promise<TElement[]> {
        const result: TElement[] = [];
        for await (const element of this) {
            result.push(element);
        }
        return result;
    }

    public union(enumerable: IAsyncEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.unionGenerator(enumerable, comparator));
    }

    public where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.whereGenerator(predicate));
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(enumerable: IAsyncEnumerable<TSecond>, resultSelector: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.zipGenerator(enumerable, resultSelector));
    }

    private async* appendGenerator(element: TElement): AsyncIterable<TElement> {
        yield* await this;
        yield element;
    }

    private async* chunkGenerator(size: number): AsyncIterable<IEnumerable<TElement>> {
        const buffer: TElement[] = [];
        for await (const element of this) {
            buffer.push(element);
            if (buffer.length === size) {
                yield Enumerable.from([...buffer]);
                buffer.length = 0;
            }
        }
        if (buffer.length > 0) {
            yield Enumerable.from([...buffer]);
        }
    }

    private async* concatGenerator(other: IAsyncEnumerable<TElement>): AsyncIterable<TElement> {
        yield* await this;
        yield* await other;
    }

    private async* defaultIfEmptyGenerator(defaultValue?: TElement): AsyncIterable<TElement> {
        let hasElements = false;
        for await (const element of this) {
            hasElements = true;
            yield element;
        }
        if (!hasElements) {
            yield defaultValue;
        }
    }

    private async* exceptGenerator(enumerable: IAsyncEnumerable<TElement>, comparator: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): AsyncIterable<TElement> {
        const collection = orderComparator ? new SortedSet<TElement>([], orderComparator) : comparator ? new List<TElement>([], comparator) : new EnumerableSet<TElement>();
        for await (const element of enumerable) {
            if (!collection.contains(element)) {
                collection.add(element);
            }
        }
        for await (const element of this) {
            if (!collection.contains(element)) {
                collection.add(element);
                yield element;
            }
        }
    }

    private async* groupByGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey>): AsyncIterable<IGroup<TKey, TElement>> {
        const groups: Array<IGroup<TKey, TElement>> = [];
        for await (const element of this) {
            const key = keySelector(element);
            const group = groups.find(g => keyComparator(g.key, key));
            if (group) {
                (group.source as List<TElement>).add(element);
            } else {
                const newGroup = new Group<TKey, TElement>(key, new List<TElement>([element]));
                groups.push(newGroup);
            }
        }
        yield* groups;
    }

    private async* groupJoinGenerator<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator: EqualityComparator<TKey>): AsyncIterable<TResult> {
        const innerGroups = await inner.groupBy(innerKeySelector, keyComparator).toArray();
        for await (const outerElement of this) {
            const outerKey = outerKeySelector(outerElement);
            const innerGroup = innerGroups.find(g => keyComparator(g.key, outerKey));
            yield resultSelector(outerElement, innerGroup?.source ?? Enumerable.empty<TInner>());
        }
    }

    private async* intersectGenerator(enumerable: IAsyncEnumerable<TElement>, comparator: EqualityComparator<TElement>, orderComparator?: OrderComparator<TElement>): AsyncIterable<TElement> {
        const collection = orderComparator ? new SortedSet<TElement>([], orderComparator) : comparator ? new List<TElement>([], comparator) : new EnumerableSet<TElement>();
        for await (const element of enumerable) {
            if (!collection.contains(element)) {
                collection.add(element);
            }
        }
        for await (const element of this) {
            if (collection.remove(element)) {
                yield element;
            }
        }
    }

    private async* joinGenerator<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator: EqualityComparator<TKey>, leftJoin: boolean): AsyncIterable<TResult> {
        const innerArrayEnumerable = Enumerable.from(await inner.toArray());
        for await (const element of this) {
            const innerElements = innerArrayEnumerable.where(e => keyComparator(innerKeySelector(e), outerKeySelector(element)));
            if (leftJoin && !innerElements.any()) {
                yield resultSelector(element, null);
            } else {
                for await (const innerElement of innerElements) {
                    yield resultSelector(element, innerElement);
                }
            }
        }
    }

    private async* pairwiseGenerator(resultSelector: PairwiseSelector<TElement, TElement>): AsyncIterable<[TElement, TElement]> {
        const iterator = await this[Symbol.asyncIterator]();
        let next = await iterator.next();
        while (!next.done) {
            const previous = next;
            next = await iterator.next();
            if (!next.done) {
                yield resultSelector(previous.value, next.value);
            }
        }
    }

    private async* prependGenerator(element: TElement): AsyncIterable<TElement> {
        yield element;
        yield* await this;
    }

    private async* reverseGenerator(): AsyncIterable<TElement> {
        yield* (await this.toArray()).reverse();
    }

    private async* scanGenerator<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): AsyncIterable<TAccumulate> {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            let index = 0;
            for await (const element of this) {
                if (index === 0) {
                    accumulatedValue = element as TAccumulate;
                    yield accumulatedValue;
                } else {
                    accumulatedValue = accumulator(accumulatedValue, element);
                    yield accumulatedValue;
                }
                ++index;
            }
            if (index === 0) {
                throw new Error(ErrorMessages.NoElements);
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
                yield accumulatedValue;
            }
        }
    }

    private async* selectGenerator<TResult>(selector: Selector<TElement, TResult>): AsyncIterable<TResult> {
        for await (const element of this) {
            yield selector(element);
        }
    }

    private async* selectManyGenerator<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): AsyncIterable<TResult> {
        let index = 0;
        for await (const element of this) {
            yield* selector(element, index++);
        }
    }

    private async* skipGenerator(count: number): AsyncIterable<TElement> {
        let index = 0;
        if (count <= 0) {
            yield* this;
        } else {
            for await (const d of this) {
                if (index >= count) {
                    yield d;
                }
                ++index;
            }
        }
    }

    private async* skipLastGenerator(count: number): AsyncIterable<TElement> {
        const result: TElement[] = [];
        if (count <= 0) {
            yield* this;
        } else {
            for await (const element of this) {
                result.push(element);
                if (result.length > count) {
                    yield result.shift();
                }
            }
        }
    }

    private async* skipWhileGenerator(predicate: IndexedPredicate<TElement>): AsyncIterable<TElement> {
        let index = 0;
        let skipEnded = false;
        for await (const element of this) {
            if (skipEnded) {
                yield element;
            } else {
                if (predicate(element, index)) {
                    ++index;
                } else {
                    skipEnded = true;
                    yield element;
                }
            }
        }
    }

    private async* takeGenerator(count: number): AsyncIterable<TElement> {
        let index = 0;
        for await (const element of this) {
            if (index < count) {
                yield element;
            } else {
                break;
            }
            ++index;
        }
    }

    private async* takeLastGenerator(count: number): AsyncIterable<TElement> {
        const result: TElement[] = [];
        for await (const element of this) {
            result.push(element);
            if (result.length > count) {
                result.shift();
            }
        }
        yield* result;
    }

    private async* takeWhileGenerator(predicate: IndexedPredicate<TElement>): AsyncIterable<TElement> {
        let index = 0;
        for await (const element of this) {
            if (predicate(element, index)) {
                yield element;
            } else {
                break;
            }
            ++index;
        }
    }

    private async* unionGenerator(enumerable: IAsyncEnumerable<TElement>, comparator?: EqualityComparator<TElement>): AsyncIterable<TElement> {
        const collection = comparator ? new List<TElement>([], comparator) : new EnumerableSet<TElement>();
        for await (const element of this) {
            if (!collection.contains(element)) {
                collection.add(element);
                yield element;
            }
        }
        for await (const element of enumerable) {
            if (!collection.contains(element)) {
                collection.add(element);
                yield element;
            }
        }
    }

    private async* unionGeneratorWithKeySelector<TKey>(enumerable: IAsyncEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey>): AsyncIterable<TElement> {
        const distinctList: TElement[] = [];
        for await (const source of [this, enumerable]) {
            for await (const element of source) {
                let exist = false;
                for (const existingItem of distinctList) {
                    if (comparator(keySelector(element), keySelector(existingItem))) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
                    yield element;
                    distinctList.push(element);
                }
            }
        }
    }

    private async* whereGenerator(predicate: IndexedPredicate<TElement>): AsyncIterable<TElement> {
        let index = 0;
        for await (const d of this) {
            if (predicate(d, index)) {
                yield d;
            }
            ++index;
        }
    }

    private async* zipGenerator<TSecond, TResult=[TElement,TSecond]>(enumerable: IAsyncEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): AsyncIterable<TResult> {
        const iterator1 = await this[Symbol.asyncIterator]();
        const iterator2 = await enumerable[Symbol.asyncIterator]();
        let next1 = await iterator1.next();
        let next2 = await iterator2.next();
        while (!next1.done && !next2.done) {
            yield zipper?.(next1.value, next2.value) ?? [next1.value, next2.value] as TResult;
            next1 = await iterator1.next();
            next2 = await iterator2.next();
        }
    }
}