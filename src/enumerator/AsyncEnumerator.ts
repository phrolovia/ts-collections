import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    AsyncEnumerable,
    Collections,
    Enumerable,
    Group,
    IAsyncEnumerable,
    IEnumerable,
    IGroup,
    IOrderedAsyncEnumerable,
    List,
    OrderedAsyncEnumerator,
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
import { findGroupInStore, findOrCreateGroupEntry, GroupJoinLookup } from "./helpers/groupJoinHelpers";
import { buildGroupsAsync, processOuterElement } from "./helpers/joinHelpers";
import { permutationsGenerator } from "./helpers/permutationsGenerator";

export class AsyncEnumerator<TElement> implements IAsyncEnumerable<TElement> {
    private static readonly MORE_THAN_ONE_ELEMENT_EXCEPTION = new MoreThanOneElementException();
    private static readonly MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION = new MoreThanOneMatchingElementException();
    private static readonly NO_ELEMENTS_EXCEPTION = new NoElementsException();
    private static readonly NO_MATCHING_ELEMENT_EXCEPTION = new NoMatchingElementException();

    public constructor(private readonly iterable: () => AsyncIterable<TElement>) {
    }

    async* [Symbol.asyncIterator](): AsyncIterator<TElement> {
        yield* this.iterable();
    }

    public async aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>,
                                                                          seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): Promise<TAccumulate | TResult> {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            const iterator = this[Symbol.asyncIterator]();
            const first = await iterator.next();
            if (first.done) {
                throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
            }
            accumulatedValue = first.value as unknown as TAccumulate;
            let next = await iterator.next();
            while (!next.done) {
                accumulatedValue = accumulator(accumulatedValue, next.value);
                next = await iterator.next();
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
            }
        }
        return resultSelector?.(accumulatedValue) ?? accumulatedValue;
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<KeyValuePair<TKey, TAccumulate>> {
        keyComparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, keyComparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.aggregate(accumulator, seedSelector instanceof Function ? seedSelector(g.key) : seedSelector)));
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
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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
        let count = 0;
        if (!predicate) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for await (const _ of this) {
                ++count;
            }
            return count;
        }
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

    public distinct(keyComparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        const keyComparer = keyComparator ?? Comparators.equalityComparator;
        const asyncEnumerable = new AsyncEnumerator(async function* () {
            yield* [] as TElement[];
        });
        return new AsyncEnumerator<TElement>(() => this.unionGenerator(
            asyncEnumerable as IAsyncEnumerable<TElement>, keyComparer));
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        keyComparator ??= Comparators.equalityComparator;
        const asyncEnumerable = new AsyncEnumerator(async function* () {
            yield* [] as TElement[];
        });
        return new AsyncEnumerator<TElement>(() => this.unionByGenerator(asyncEnumerable,keySelector, keyComparator));
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

    public except(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.exceptGenerator(iterable, comparator));
    }

    public exceptBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> |  OrderComparator<TKey>): IAsyncEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.exceptByGenerator(enumerable, keySelector, comparator));
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
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }
        throw AsyncEnumerator.NO_MATCHING_ELEMENT_EXCEPTION;
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

    public intersect(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement> |  OrderComparator<TElement>): IAsyncEnumerable<TElement> {
        const compare = comparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.intersectGenerator(iterable, compare));
    }

    public intersectBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey> |  OrderComparator<TKey>): IAsyncEnumerable<TElement> {
        const compare = comparator ?? Comparators.equalityComparator;
        return new AsyncEnumerator<TElement>(() => this.intersectByGenerator(enumerable, keySelector, compare));
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
        let found = false;

        for await (const element of this) {
            if (!predicate || predicate(element)) {
                last = element;
                found = true;
            }
        }

        if (!found) {
            throw predicate
                ? AsyncEnumerator.NO_MATCHING_ELEMENT_EXCEPTION
                : AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }

        return last as TElement;
    }

    public async lastOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        let last: TElement | null = null;
        for await (const element of this) {
            if (!predicate || predicate(element)) {
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
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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
        let product = 1;
        let count = 0;

        for await (const element of this) {
            product *= selector?.(element) ?? element as unknown as number;
            ++count;
        }

        if (count === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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
        let found = false;
        let count = 0;

        for await (const element of this) {
            count++;
            if (!predicate) {
                if (found) {
                    throw AsyncEnumerator.MORE_THAN_ONE_ELEMENT_EXCEPTION;
                }
                single = element;
                found = true;
            }
            if (predicate && predicate(element)) {
                if (found) {
                    throw AsyncEnumerator.MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION;
                }
                single = element;
                found = true;
            }
        }

        if (count === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
        }

        if (!found) {
            throw AsyncEnumerator.NO_MATCHING_ELEMENT_EXCEPTION;
        }

        return single as TElement;
    }

    public async singleOrDefault(predicate?: Predicate<TElement>): Promise<TElement | null> {
        let single: TElement | null = null;
        let index = 0;
        if (!predicate) {
            for await (const element of this) {
                if (index !== 0) {
                    throw AsyncEnumerator.MORE_THAN_ONE_ELEMENT_EXCEPTION;
                }
                single = element;
                ++index;
            }
        } else {
            for await (const element of this) {
                if (predicate(element)) {
                    if (index !== 0) {
                        throw AsyncEnumerator.MORE_THAN_ONE_MATCHING_ELEMENT_EXCEPTION;
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

    public async toObject<TKey extends string | number | symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Promise<Record<TKey, TValue>> {
        const obj: Record<TKey, TValue> = {} as Record<TKey, TValue>;
        for await (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            obj[key] = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
        }
        return obj;
    }

    public union(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.unionGenerator(iterable, comparator));
    }

    public unionBy<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IAsyncEnumerable<TElement> {
        return new AsyncEnumerator<TElement>(() => this.unionByGenerator(enumerable, keySelector, comparator));
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

    private async* appendGenerator(element: TElement): AsyncIterableIterator<TElement> {
        yield* this;
        yield element;
    }

    private async* castGenerator<TResult>(): AsyncIterableIterator<TResult> {
        for await (const element of this) {
            yield element as unknown as TResult;
        }
    }

    private async* chunkGenerator(size: number): AsyncIterableIterator<IEnumerable<TElement>> {
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

    private async* combinationsGenerator(size?: number): AsyncIterableIterator<IEnumerable<TElement>> {
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

    private async* concatGenerator(other: AsyncIterable<TElement>): AsyncIterableIterator<TElement> {
        yield* this;
        yield* other;
    }

    private async* cycleGenerator(count?: number): AsyncIterableIterator<TElement> {
        const elements = [];
        for await (const item of this) {
            elements.push(item);
        }

        if (elements.length === 0) {
            throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
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

    private async* defaultIfEmptyGenerator(defaultValue?: TElement | null): AsyncIterableIterator<TElement | null> {
        let hasElements = false;
        for await (const element of this) {
            hasElements = true;
            yield element;
        }
        if (!hasElements) {
            yield defaultValue ?? null;
        }
    }

    private async* exceptByGenerator<TKey>(iterable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey> | OrderComparator<TKey>): AsyncIterableIterator<TElement> {
        const keySet = new SortedSet<TKey>([], comparator as OrderComparator<TKey>);
        const keyList = new List<TKey>([], comparator as EqualityComparator<TKey>);

        const {value: first, done} = await new AsyncEnumerator(() => iterable)[Symbol.asyncIterator]().next();
        if (done) {
            return yield* this;
        }

        const firstKey = keySelector(first);
        const keyCollection = typeof comparator(firstKey, firstKey) === "number" ? keySet : keyList;

        keyCollection.add(firstKey);

        for await (const element of iterable) {
            const key = keySelector(element);
            keyCollection.add(key);
        }

        for await (const element of this) {
            const key = keySelector(element);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
                yield element;
            }
        }
    }

    private async* exceptGenerator(iterable: AsyncIterable<TElement>, comparator: EqualityComparator<TElement> |  OrderComparator<TElement>): AsyncIterableIterator<TElement> {
        return yield* this.exceptByGenerator(iterable, e => e, comparator);
    }

    private async* groupByGenerator<TKey>(
        keySelector: Selector<TElement, TKey>,
        keyComparator: EqualityComparator<TKey>
    ): AsyncIterableIterator<IGroup<TKey, TElement>> {

        const groupMap = new Map<TKey, IGroup<TKey, TElement>>();

        const findExistingKeyInMap = (targetKey: TKey): TKey | undefined => {
            for (const existingKey of groupMap.keys()) {
                if (keyComparator(existingKey, targetKey)) {
                    return existingKey;
                }
            }
            return undefined;
        };

        for await (const element of this) {
            const key = keySelector(element);
            let group: IGroup<TKey, TElement> | undefined;
            const existingMapKey = findExistingKeyInMap(key);

            if (existingMapKey !== undefined) {
                group = groupMap.get(existingMapKey);
                if (!group) {
                    throw new NoSuchElementException(`Group with key ${existingMapKey} not found.`);
                }
            }

            if (group) {
                (group.source as List<TElement>).add(element);
            } else {
                const newList = new List<TElement>([element]);
                const newGroup = new Group<TKey, TElement>(key, newList);
                groupMap.set(key, newGroup);
            }
        }
        yield* groupMap.values();
    }

    private async* groupJoinGenerator<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator: EqualityComparator<TKey>): AsyncIterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const lookupStore: Array<GroupJoinLookup<TKey, TInner>> = [];

        for await (const innerElement of inner) {
            const innerKey = innerKeySelector(innerElement);
            const group = findOrCreateGroupEntry(lookupStore, innerKey, keyCompare);
            group.push(innerElement);
        }

        for await (const element of this) {
            const outerKey = outerKeySelector(element);
            const joinedEntries = findGroupInStore(lookupStore, outerKey, keyCompare);
            yield resultSelector(element, Enumerable.from(joinedEntries ?? []));
        }
    }

    private async* indexGenerator(): AsyncIterableIterator<[number, TElement]> {
        let index = 0;
        for await (const element of this) {
            yield [index++, element];
        }
    }

    private async* intersectByGenerator<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey> | OrderComparator<TKey>): AsyncIterableIterator<TElement> {
        const keySet = new SortedSet<TKey>([], comparator as OrderComparator<TKey>);
        const keyList = new List<TKey>([], comparator as EqualityComparator<TKey>);

        const {value: first, done} = await new AsyncEnumerator(() => enumerable)[Symbol.asyncIterator]().next();
        if (done) {
            return yield* AsyncEnumerable.empty<TElement>();
        }

        const firstKey = keySelector(first);
        const keyCollection = typeof comparator(firstKey, firstKey) === "number" ? keySet : keyList;
        keyCollection.add(firstKey);

        for await (const element of enumerable) {
            const key = keySelector(element);
            if (!keyCollection.contains(key)) {
                keyCollection.add(key);
            }
        }
        for await (const element of this) {
            const key = keySelector(element);
            if (keyCollection.contains(key)) {
                keyCollection.remove(key);
                yield element;
            }
        }
    }

    private async* intersectGenerator(iterable: AsyncIterable<TElement>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): AsyncIterableIterator<TElement> {
        return yield* this.intersectByGenerator(iterable, e => e, comparator);
    }

    private async* intersperseGenerator<TSeparator = TElement>(separator: TSeparator): AsyncIterableIterator<TElement | TSeparator> {
        let index = 0;
        for await (const element of this) {
            if (index > 0) {
                yield separator;
            }
            yield element;
            ++index;
        }
    }

    private async* joinGenerator<TInner, TKey, TResult>(inner: IAsyncEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator: EqualityComparator<TKey>, leftJoin: boolean): AsyncIterableIterator<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        const effectiveLeftJoin = leftJoin ?? false;
        const groups = await buildGroupsAsync(inner, innerKeySelector, keyCompare);

        for await (const outerElement of this) {
            const outerKey = outerKeySelector(outerElement);
            yield* processOuterElement(
                outerElement,
                outerKey,
                groups,
                keyCompare,
                resultSelector,
                effectiveLeftJoin
            );
        }
    }

    private async* ofTypeGenerator<TResult extends ObjectType>(type: TResult): AsyncIterableIterator<InferredType<TResult>> {
        const isOfType = typeof type === "string"
            ? ((item: unknown) => typeof item === type) as (item: unknown) => item is InferredType<TResult>
            : (item: unknown): item is InferredType<TResult> => item instanceof (ClassType(type) as any);
        for await (const item of this) {
            if (isOfType(item)) {
                yield item;
            }
        }
    }

    private async* pairwiseGenerator(resultSelector: PairwiseSelector<TElement, TElement>): AsyncIterableIterator<[TElement, TElement]> {
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

    private async* permutationsGenerator(size?: number): AsyncIterableIterator<IEnumerable<TElement>> {
        const distinctElements = await this.distinct().toArray();
        yield* permutationsGenerator(distinctElements, size);
    }

    private async* prependGenerator(element: TElement): AsyncIterableIterator<TElement> {
        yield element;
        yield* this;
    }

    private async* reverseGenerator(): AsyncIterableIterator<TElement> {
        yield* (await this.toArray()).reverse();
    }

    private async* scanGenerator<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): AsyncIterableIterator<TAccumulate> {
        let accumulatedValue: TAccumulate | null = null;
        if (seed == null) {
            let index = 0;
            for await (const element of this) {
                if (index === 0) {
                    accumulatedValue = element as unknown as TAccumulate;
                    yield accumulatedValue;
                } else {
                    accumulatedValue = accumulator(accumulatedValue as TAccumulate, element);
                    yield accumulatedValue;
                }
                ++index;
            }
            if (index === 0) {
                throw AsyncEnumerator.NO_ELEMENTS_EXCEPTION;
            }
        } else {
            accumulatedValue = seed;
            for await (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
                yield accumulatedValue;
            }
        }
    }

    private async* selectGenerator<TResult>(selector: IndexedSelector<TElement, TResult>): AsyncIterableIterator<TResult> {
        let index = 0;
        for await (const element of this) {
            yield selector(element, index++);
        }
    }

    private async* selectManyGenerator<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): AsyncIterableIterator<TResult> {
        let index = 0;
        for await (const element of this) {
            yield* selector(element, index++);
        }
    }

    private async* shuffleGenerator(): AsyncIterableIterator<TElement> {
        const array = await this.toArray();
        Collections.shuffle(array);
        yield* array;
    }

    private async* skipGenerator(count: number): AsyncIterableIterator<TElement> {
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

    private async* skipLastGenerator(count: number): AsyncIterableIterator<TElement> {
        if (count <= 0) {
            return yield* this;
        }

        const buffer: TElement[] = new Array(count);
        let bufferSize = 0;
        let index = 0;

        for await (const item of this) {
            if (bufferSize === count) {
                yield buffer[index];
            }

            buffer[index] = item;
            index = (index + 1) % count;

            if (bufferSize < count) {
                bufferSize++;
            }
        }
    }

    private async* skipWhileGenerator(predicate: IndexedPredicate<TElement>): AsyncIterableIterator<TElement> {
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

    private async* stepGenerator(step: number): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const element of this) {
            if (index % step === 0) {
                yield element;
            }
            ++index;
        }
    }

    private async* takeGenerator(count: number): AsyncIterableIterator<TElement> {
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

    private async* takeLastGenerator(count: number): AsyncIterableIterator<TElement> {
        if (count <= 0) {
            return;
        }

        const buffer = new Array<TElement | undefined>(count);
        let startIndex = 0;
        let size = 0;

        for await (const element of this) {
            const nextIndex = (startIndex + size) % count;

            buffer[nextIndex] = element;

            if (size < count) {
                size++;
            } else {
                startIndex = (startIndex + 1) % count;
            }
        }

        for (let i = 0; i < size; i++) {
            const readIndex = (startIndex + i) % count;
            yield buffer[readIndex]!;
        }
    }

    private async* takeWhileGenerator(predicate: IndexedPredicate<TElement>): AsyncIterableIterator<TElement> {
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

    private async* unionByGenerator<TKey>(enumerable: AsyncIterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): AsyncIterableIterator<TElement> {
        const seenKeys = new Map<TKey, boolean>();
        comparator ??= Comparators.equalityComparator;

        const isDefaultComparator = comparator === Comparators.equalityComparator;
        for await (const source of [this, enumerable]) {
            for await (const element of source) {
                const key = keySelector(element);
                let exists = false;

                if (isDefaultComparator) {
                    exists = seenKeys.has(key);
                } else {
                    for (const seenKey of seenKeys.keys()) {
                        if (comparator(key, seenKey)) {
                            exists = true;
                            break;
                        }
                    }
                }

                if (!exists) {
                    yield element;
                    seenKeys.set(key, true);
                }
            }
        }
    }

    private async* unionGenerator(iterable: AsyncIterable<TElement>, comparator?: EqualityComparator<TElement>): AsyncIterableIterator<TElement> {
        yield* this.unionByGenerator(iterable, element => element, comparator);
    }

    private async* whereGenerator(predicate: IndexedPredicate<TElement>): AsyncIterableIterator<TElement> {
        let index = 0;
        for await (const d of this) {
            if (predicate(d, index)) {
                yield d;
            }
            ++index;
        }
    }

    private async* windowsGenerator(size: number): AsyncIterableIterator<IEnumerable<TElement>> {
        const window: TElement[] = new Array(size);
        let index = 0;
        let count = 0;
        
        for await (const element of this) {
            window[index] = element;
            index = (index + 1) % size;
            
            if (count < size) {
                count++;
            }
            
            if (count === size) {
                const result: TElement[] = [];
                for (let i = 0; i < size; i++) {
                    const readIndex = (index + i) % size;
                    result.push(window[readIndex]);
                }
                yield Enumerable.from(result);
            }
        }
    }

    private async* zipGenerator<TSecond, TResult = [TElement, TSecond]>(iterable: AsyncIterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): AsyncIterableIterator<TResult> {
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
