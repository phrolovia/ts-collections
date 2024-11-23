import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    Collections,
    Enumerable,
    EnumerableSet,
    Group,
    IAsyncEnumerable,
    IEnumerable,
    IGroup,
    IOrderedAsyncEnumerable,
    List,
    OrderedAsyncEnumerator,
    Queue,
    SortedSet
} from "../imports";
import { Accumulator } from "../shared/Accumulator";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { IndexOutOfBoundsException } from "../shared/IndexOutOfBoundsException";
import { InferredType } from "../shared/InferredType";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { JoinSelector } from "../shared/JoinSelector";
import { MoreThanOneElementException } from "../shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../shared/NoElementsException";
import { NoMatchingElementException } from "../shared/NoMatchingElementException";
import { NoSuchElementException } from "../shared/NoSuchElementException";
import { ClassType, ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";

export class AsyncEnumerator<TElement> implements IAsyncEnumerable<TElement> {

    public constructor(private readonly iterable: () => AsyncIterable<TElement>) {
    }

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* this.iterable();
    }

    public async aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>,
                                                                          seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        let accumulatedValue: TAccumulate | null = null;
        let count = 0;
        if (seed == null) {
            let index = 0;
            for await (const element of this) {
                if (index === 0) {
                    accumulatedValue = element as unknown as TAccumulate;
                } else {
                    accumulatedValue = accumulator(accumulatedValue as TAccumulate, element);
                }
                ++index;
                ++count;
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
                ++count;
            }
        }
        if (count === 0 && accumulatedValue == null) {
            throw new NoElementsException();
        }
        return resultSelector?.(accumulatedValue as TAccumulate) ?? accumulatedValue as TAccumulate;
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
            throw new NoElementsException();
        }
        return total / count;
    }

    public cast<TResult>(): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.castGenerator());
    }

    public chunk(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.chunkGenerator(size));
    }

    public combinations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 0) {
            throw new InvalidArgumentException("Size must be greater than or equal to 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.combinationsGenerator(size));
    }

    public concat(other: AsyncIterable<TElement>): IAsyncEnumerable<TElement> {
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

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, number>> {
        comparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, comparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.count()));
    }

    public cycle(count?: number): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.cycleGenerator(count));
    }

    public defaultIfEmpty(defaultValue?: TElement | null): IAsyncEnumerable<TElement | null> {
        return new AsyncEnumerator<TElement | null>(() => this.defaultIfEmptyGenerator(defaultValue));
    }

    public distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        const keyComparer = keyComparator ?? Comparators.equalityComparator;
        const keySelect = keySelector ?? ((element: TElement) => element as unknown as TKey);
        const asyncEnumerable = new AsyncEnumerator(async function* () {
            yield* [] as TElement[];
        });
        return new AsyncEnumerator<TElement>(() => this.unionGeneratorWithKeySelector(
            asyncEnumerable as IAsyncEnumerable<TElement>, keySelect, keyComparer));
    }

    public async elementAt(index: number): Promise<TElement> {
        if (index < 0) {
            throw new IndexOutOfBoundsException(index);
        }
        let count = 0;
        for await (const element of this) {
            if (count === index) {
                return element;
            }
            ++count;
        }
        if (index >= count) {
            throw new IndexOutOfBoundsException(index);
        }
        throw new NoSuchElementException();
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

    public except(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.exceptGenerator(iterable, comparator, orderComparator));
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
            throw new NoElementsException();
        }
        throw new NoMatchingElementException();
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
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<IGroup<TKey, TElement>>(() => this.groupByGenerator(keySelector, keyCompare));
    }

    public groupJoin<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TResult>(() => this.groupJoinGenerator(inner, outerKeySelector, innerKeySelector, resultSelector, keyCompare));
    }

    public index(): IAsyncEnumerable<[number, TElement]> {
        return new AsyncEnumerator<[number, TElement]>(() => this.indexGenerator());
    }

    public intersect(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): IAsyncEnumerable<TElement> {
        const compare = comparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.intersectGenerator(iterable, compare, orderComparator));
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IAsyncEnumerable<TElement | TSeparator> {
        return new AsyncEnumerator<TElement | TSeparator>(() => this.intersperseGenerator(separator));
    }

    public join<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IAsyncEnumerable<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TResult>(() => this.joinGenerator(inner, outerKeySelector, innerKeySelector, resultSelector, keyCompare, leftJoin ?? false));
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
            throw new NoElementsException();
        }
        if (last == null) {
            throw new NoMatchingElementException();
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
            throw new NoElementsException();
        }
        return max;
    }

    public async maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        let maxElement: TElement | null = null;
        let maxKey: TKey | null = null;
        for await (const element of this) {
            const key = keySelector(element);
            if (maxKey == null || (comparator?.(key, maxKey) ?? key) > maxKey) {
                maxKey = key;
                maxElement = element;
            }
        }
        if (maxElement == null) {
            throw new NoElementsException();
        }
        return maxElement;
    }

    public async min(selector?: Selector<TElement, number>): Promise<number> {
        let min: number | null = null;
        for await (const element of this) {
            const value = selector ? selector(element) : element as unknown as number;
            min = Math.min(min ?? Number.POSITIVE_INFINITY, value);
        }
        if (min == null) {
            throw new NoElementsException();
        }
        return min;
    }

    public async minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): Promise<TElement> {
        let minElement: TElement | null = null;
        let minKey: TKey | null = null;
        for await (const element of this) {
            const key = keySelector(element);
            if (minKey == null || (comparator?.(key, minKey) ?? key) < minKey) {
                minKey = key;
                minElement = element;
            }
        }
        if (minElement == null) {
            throw new NoElementsException();
        }
        return minElement;
    }

    public async none(predicate?: Predicate<TElement>): Promise<boolean> {
        return !await this.any(predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IAsyncEnumerable<InferredType<TResult>> {
        return new AsyncEnumerator<InferredType<TResult>>(() => this.ofTypeGenerator(type));
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

    public permutations(size?: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.permutationsGenerator(size));
    }

    public prepend(element: TElement): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.prependGenerator(element));
    }

    public async product(selector?: Selector<TElement, number>): Promise<number> {
        const elements: TElement[] = [];

        for await (const element of this) {
            elements.push(element);
        }

        if (elements.length === 0) {
            throw new NoElementsException();
        }

        let product = 1;
        for (const element of elements) {
            product *= selector?.(element) ?? element as unknown as number;
        }

        return product;
    }

    public reverse(): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.reverseGenerator());
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IAsyncEnumerable<TAccumulate> {
        return new AsyncEnumerator<TAccumulate>(() => this.scanGenerator(accumulator, seed));
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.selectGenerator(selector));
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.selectManyGenerator(selector));
    }

    public async sequenceEqual(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): Promise<boolean> {
        comparator ??= Comparators.equalityComparator;
        const iterator = this[Symbol.asyncIterator]();
        const otherIterator = iterable[Symbol.asyncIterator]();
        let first = await iterator.next();
        let second = await otherIterator.next();
        if (first.done && second.done) {
            return true;
        }
        while (!first.done && !second.done) {
            if (!comparator(first.value, second.value)) {
                return false;
            }
            first = await iterator.next();
            second = await otherIterator.next();
            if (first.done && second.done) {
                return true;
            }
        }
        return false;
    }

    public shuffle(): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.shuffleGenerator());
    }

    public async single(predicate?: Predicate<TElement>): Promise<TElement> {
        let single: TElement | null = null;
        let index = 0;
        let count = 0;
        if (!predicate) {
            for await (const element of this) {
                if (index !== 0) {
                    throw new MoreThanOneElementException();
                }
                single = element;
                ++index;
                ++count;
            }
        } else {
            for await (const element of this) {
                if (predicate(element)) {
                    if (index !== 0) {
                        throw new MoreThanOneMatchingElementException();
                    }
                    single = element;
                    ++index;
                }
                ++count;
            }
        }
        if (count === 0) {
            throw new NoElementsException();
        }
        if (single == null) {
            throw new NoMatchingElementException();
        }
        return single;
    }

    public async singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        let single: TElement | null = null;
        let index = 0;
        if (!predicate) {
            for await (const element of this) {
                if (index !== 0) {
                    throw new MoreThanOneElementException();
                }
                single = element;
                ++index;
            }
        } else {
            for await (const element of this) {
                if (predicate(element)) {
                    if (index !== 0) {
                        throw new MoreThanOneMatchingElementException();
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

    public async span(predicate: Predicate<TElement>): Promise<[IEnumerable<TElement>, IEnumerable<TElement>]> {
        const span = new List<TElement>();
        const rest = new List<TElement>();
        let found = false;

        for await (const item of this) {
            if (!found && predicate(item)) {
                span.add(item);
            } else {
                found = true;
                rest.add(item);
            }
        }
        return [new Enumerable(span), new Enumerable(rest)];
    }

    public step(step: number): IAsyncEnumerable<TElement> {
        if (step < 1) {
            throw new InvalidArgumentException("Step must be greater than 0.", "step");
        }
        return new AsyncEnumerator<TElement>(() => this.stepGenerator(step));
    }

    public async sum(selector?: Selector<TElement, number>): Promise<number> {
        let count = 0;
        let sum = 0;
        for await (const element of this) {
            sum += selector?.(element) ?? element as unknown as number;
            ++count;
        }
        if (count === 0) {
            throw new NoElementsException();
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

    public union(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.unionGenerator(iterable, comparator));
    }

    public where(predicate: IndexedPredicate<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.whereGenerator(predicate));
    }

    public windows(size: number): IAsyncEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new AsyncEnumerator<IEnumerable<TElement>>(() => this.windowsGenerator(size));
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, resultSelector?: Zipper<TElement, TSecond, TResult>): IAsyncEnumerable<TResult> {
        return new AsyncEnumerator<TResult>(() => this.zipGenerator(iterable, resultSelector));
    }

    private async* appendGenerator(element: TElement): AsyncIterable<TElement> {
        yield* this;
        yield element;
    }

    private async* castGenerator<TResult>(): AsyncIterable<TResult> {
        for await (const element of this) {
            yield element as unknown as TResult;
        }
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

    private async* combinationsGenerator(size?: number): AsyncIterable<IEnumerable<TElement>> {
        const items: TElement[] = [];

        for await (const item of this) {
            items.push(item);
        }

        const n = items.length;
        const totalCombinations = 1 << n;
        const seen = new Set<string>();

        for (let cx = 0; cx < totalCombinations; cx++) {
            const combination = new List<TElement>();

            for (let jx = 0; jx < n; jx++) {
                if (cx & (1 << jx)) {
                    combination.add(items[jx]);
                }
            }

            if (size === undefined || combination.length === size) {
                const key = combination.aggregate((acc, cur) => acc + cur, ","); // Join elements to create a string key
                if (!seen.has(key)) {
                    seen.add(key);
                    yield combination;
                }
            }
        }
    }

    private async* concatGenerator(other: AsyncIterable<TElement>): AsyncIterable<TElement> {
        yield* this;
        yield* other;
    }

    private async* cycleGenerator(count?: number): AsyncIterable<TElement> {
        const elements = [];
        for await (const item of this) {
            elements.push(item);
        }

        if (elements.length === 0) {
            throw new NoElementsException();
        }

        if (count == null) {
            while (true) {
                for (const element of elements) {
                    yield element;
                }
            }
        } else {
            for (let i = 0; i < count; ++i) {
                for (const element of elements) {
                    yield element;
                }
            }
        }
    }

    private async* defaultIfEmptyGenerator(defaultValue?: TElement | null): AsyncIterable<TElement | null> {
        let hasElements = false;
        for await (const element of this) {
            hasElements = true;
            yield element;
        }
        if (!hasElements) {
            yield defaultValue ?? null;
        }
    }

    private async* exceptGenerator(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): AsyncIterable<TElement> {
        const collection = orderComparator ? new SortedSet<TElement>([], orderComparator) : comparator ? new List<TElement>([], comparator) : new EnumerableSet<TElement>();
        for await (const element of iterable) {
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

    private async* indexGenerator(): AsyncIterable<[number, TElement]> {
        let index = 0;
        for await (const element of this) {
            yield [index++, element];
        }
    }

    private async* intersectGenerator(iterable: AsyncIterable<TElement>, comparator: EqualityComparator<TElement> | null, orderComparator?: OrderComparator<TElement> | null): AsyncIterable<TElement> {
        const collection = orderComparator ? new SortedSet<TElement>([], orderComparator) : comparator ? new List<TElement>([], comparator) : new EnumerableSet<TElement>();
        for await (const element of iterable) {
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

    private async* intersperseGenerator<TSeparator = TElement>(separator: TSeparator): AsyncIterable<TElement | TSeparator> {
        let index = 0;
        for await (const element of this) {
            if (index > 0) {
                yield separator;
            }
            yield element;
            ++index;
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

    private async* ofTypeGenerator<TResult extends ObjectType>(type: TResult): AsyncIterable<InferredType<TResult>> {
        const isOfType = typeof type === "string"
            ? ((item: unknown) => typeof item === type) as (item: unknown) => item is InferredType<TResult>
            : (item: unknown): item is InferredType<TResult> => item instanceof (ClassType(type) as any);
        for await (const item of this) {
            if (isOfType(item)) {
                yield item;
            }
        }
    }

    private async* pairwiseGenerator(resultSelector: PairwiseSelector<TElement, TElement>): AsyncIterable<[TElement, TElement]> {
        const iterator = this[Symbol.asyncIterator]();
        let next = await iterator.next();
        while (!next.done) {
            const previous = next;
            next = await iterator.next();
            if (!next.done) {
                yield resultSelector(previous.value, next.value);
            }
        }
    }

    private async* permutationsGenerator(size?: number): AsyncIterable<IEnumerable<TElement>> {
        type Permutation = { created: EnumerableSet<TElement>, remaining: EnumerableSet<TElement> };
        const elements = await this.distinct().toArray();
        const queue = new Queue<Permutation>();
        queue.add({ created: new EnumerableSet<TElement>(), remaining: new EnumerableSet<TElement>(elements) });

        while (queue.length > 0) {
            const current = queue.poll() as Permutation;

            if (size != null && current.created.length === size) {
                yield current.created;
                continue;
            }

            if (size == null && current.remaining.length === 0) {
                yield current.created;
                continue;
            }

            for (let ix = 0; ix < current.remaining.length; ++ix) {
                const newCurrent = new EnumerableSet([...current.created, current.remaining.elementAt(ix)]);
                const newRemaining = new EnumerableSet([...current.remaining.take(ix), ...current.remaining.skip(ix + 1)]);
                queue.add({ created: newCurrent, remaining: newRemaining });
            }
        }
    }

    private async* prependGenerator(element: TElement): AsyncIterable<TElement> {
        yield element;
        yield* this;
    }

    private async* reverseGenerator(): AsyncIterable<TElement> {
        yield* (await this.toArray()).reverse();
    }

    private async* scanGenerator<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): AsyncIterable<TAccumulate> {
        let accumulatedValue: TAccumulate | null = null;
        if (seed == null) {
            let index = 0;
            for await (const element of this) {
                if (index === 0) {
                    accumulatedValue = element as TAccumulate;
                    yield accumulatedValue;
                } else {
                    accumulatedValue = accumulator(accumulatedValue as TAccumulate, element);
                    yield accumulatedValue;
                }
                ++index;
            }
            if (index === 0) {
                throw new NoElementsException();
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

    private async* shuffleGenerator(): AsyncIterable<TElement> {
        const array = await this.toArray();
        Collections.shuffle(array);
        yield* array;
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
                    yield result.shift() as TElement;
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
            } else if (predicate(element, index)) {
                ++index;
            } else {
                skipEnded = true;
                yield element;
            }
        }
    }

    public async* stepGenerator(step: number): AsyncIterable<TElement> {
        let index = 0;
        for await (const element of this) {
            if (index % step === 0) {
                yield element;
            }
            ++index;
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

    private async* unionGenerator(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): AsyncIterable<TElement> {
        const collection = comparator ? new List<TElement>([], comparator) : new EnumerableSet<TElement>();
        for await (const element of this) {
            if (!collection.contains(element)) {
                collection.add(element);
                yield element;
            }
        }
        for await (const element of iterable) {
            if (!collection.contains(element)) {
                collection.add(element);
                yield element;
            }
        }
    }

    private async* unionGeneratorWithKeySelector<TKey>(enumerable: IAsyncEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): AsyncIterable<TElement> {
        const distinctList: TElement[] = [];
        comparator ??= Comparators.equalityComparator;
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

    private async* windowsGenerator(size: number): AsyncIterable<IEnumerable<TElement>> {
        const iterator = this[Symbol.asyncIterator]();
        const window = new List<TElement>();
        for (let item = await iterator.next(); !item.done; item = await iterator.next()) {
            window.add(item.value);
            if (window.length === size) {
                yield Enumerable.from([...window]);
                window.removeAt(0);
            }
        }
    }

    private async* zipGenerator<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): AsyncIterable<TResult> {
        const iterator1 = this[Symbol.asyncIterator]();
        const iterator2 = iterable[Symbol.asyncIterator]();
        let next1 = await iterator1.next();
        let next2 = await iterator2.next();
        while (!next1.done && !next2.done) {
            yield zipper?.(next1.value, next2.value) ?? [next1.value, next2.value] as TResult;
            next1 = await iterator1.next();
            next2 = await iterator2.next();
        }
    }
}
