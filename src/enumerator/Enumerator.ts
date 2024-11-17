import { KeyValuePair } from "../dictionary/KeyValuePair";
import {
    Collections,
    Dictionary,
    Enumerable,
    EnumerableSet,
    Group,
    IEnumerable,
    IGroup,
    ILookup,
    ImmutableDictionary,
    ImmutableList,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    IOrderedEnumerable,
    LinkedList,
    List,
    OrderedEnumerator,
    PriorityQueue,
    Queue,
    SortedDictionary,
    SortedSet,
    Stack
} from "../imports";
import { Lookup } from "../lookup/Lookup";
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
import { ClassType, ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";

export class Enumerator<TElement> implements IOrderedEnumerable<TElement> {

    public constructor(private readonly iterable: () => Iterable<TElement>) {
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.iterable();
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            if (!this.any()) {
                throw new NoElementsException();
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

    public all(predicate: Predicate<TElement>): boolean {
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

    public asEnumerable(): IEnumerable<TElement> {
        return this;
    }

    public average(selector?: Selector<TElement, number>): number {
        if (!this.any()) {
            throw new NoElementsException();
        }
        let total: number = 0;
        let count: number = 0;
        for (const d of this) {
            total += selector?.(d) ?? d as unknown as number;
            count++;
        }
        return total / count;
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return new Enumerator<TResult>(() => this.castGenerator());
    }

    public chunk(size: number): IEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new Enumerator(() => this.chunkGenerator(size));
    }

    public combinations(size?: number): IEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 0) {
            throw new InvalidArgumentException("Size must be greater than or equal to 0.", "size");
        }
        return new Enumerator(() => this.combinationsGenerator(size));
    }

    public concat(iterable: Iterable<TElement>): IEnumerable<TElement> {
        return new Enumerator(() => this.concatGenerator(iterable));
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
            for (const {} of this) {
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

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>> {
        comparator ??= Comparators.equalityComparator;
        const groups = this.groupBy(keySelector, comparator);
        return groups.select(g => new KeyValuePair(g.key, g.source.count()));
    }

    public cycle(count?: number): IEnumerable<TElement> {
        return new Enumerator(() => this.cycleGenerator(count));
    }

    public defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null> {
        return new Enumerator(() => this.defaultIfEmptyGenerator(value));
    }

    public distinct<TKey>(keySelector?: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        const keySelect = keySelector ?? ((item: TElement) => item as unknown as TKey);
        const keyCompare = keyComparator ?? Comparators.equalityComparator as EqualityComparator<TKey>;
        return new Enumerator(() => this.unionGeneratorWithKeySelector(Enumerable.empty(), keySelect, keyCompare));
    }

    public elementAt(index: number): TElement {
        if (index < 0) {
            throw new IndexOutOfBoundsException(index);
        }
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        throw new IndexOutOfBoundsException(index);
    }

    public elementAtOrDefault(index: number): TElement | null {
        let ix: number = 0;
        for (const item of this) {
            if (index === ix) {
                return item;
            }
            ++ix;
        }
        return null;
    }

    public except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.exceptGenerator(iterable, comparator));
    }

    public first(predicate?: Predicate<TElement>): TElement {
        if (!this.any()) {
            throw new NoElementsException();
        }
        const item = this.firstOrDefault(predicate);
        if (!item) {
            throw new NoMatchingElementException();
        }
        return item;
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement | null {
        if (!predicate) {
            return this[Symbol.iterator]().next().value ?? null;
        } else {
            let first: TElement | null = null;
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

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.groupByGenerator(keySelector, keyComparator));
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.groupJoinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator));
    }

    public index(): IEnumerable<[number, TElement]> {
        return new Enumerator<[number, TElement]>(() => this.indexGenerator());
    }

    public intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement> | null): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.intersectGenerator(iterable, comparator));
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator> {
        return new Enumerator(() => this.intersperseGenerator(separator));
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        keyComparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.joinGenerator(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin));
    }

    public last(predicate?: Predicate<TElement>): TElement {
        let last: TElement | null = null;
        if (!predicate) {
            for (const item of this) {
                last = item;
            }
            if (!last) {
                throw new NoElementsException();
            }
            return last;
        }
        for (const item of this) {
            if (predicate(item)) {
                last = item;
            }
        }
        if (!last) {
            throw new NoMatchingElementException();
        }
        return last;
    }

    public lastOrDefault(predicate?: Predicate<TElement>): TElement | null {
        let last: TElement | null = null;
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
        let max: number | null = null;
        if (!selector) {
            for (const item of this) {
                max = Math.max(max ?? Number.NEGATIVE_INFINITY, item as unknown as number);
            }
            if (max == null) {
                throw new NoElementsException();
            }
            return max;
        } else {
            for (const item of this) {
                max = Math.max(max ?? Number.NEGATIVE_INFINITY, selector(item));
            }
            if (max == null) {
                throw new NoElementsException();
            }
            return max;
        }
    }

    public min(selector?: Selector<TElement, number>): number {
        let min: number | null = null;
        if (!selector) {
            for (const item of this) {
                min = Math.min(min ?? Number.POSITIVE_INFINITY, item as unknown as number);
            }
            if (min == null) {
                throw new NoElementsException();
            }
            return min;
        } else {
            for (const item of this) {
                min = Math.min(min ?? Number.POSITIVE_INFINITY, selector(item));
            }
            if (min == null) {
                throw new NoElementsException();
            }
            return min;
        }
    }

    public none(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !!this[Symbol.iterator]().next().done;
        }
        for (const d of this) {
            if (predicate(d)) {
                return false;
            }
        }
        return true;
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return new Enumerator<InferredType<TResult>>(() => this.ofTypeGenerator(type));
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, true, false, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, false, false, comparator);
    }

    public pairwise(resultSelector?: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return new Enumerator(() => this.pairwiseGenerator(resultSelector ??= (first, second) => [first, second]));
    }

    public partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>] {
        const trueItems = new List<TElement>();
        const falseItems = new List<TElement>();
        for (const item of this) {
            if (predicate(item)) {
                trueItems.add(item);
            } else {
                falseItems.add(item);
            }
        }
        return [new Enumerable(trueItems), new Enumerable(falseItems)];
    }

    public permutations(size?: number): IEnumerable<IEnumerable<TElement>> {
        if (size != null && size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new Enumerator(() => this.permutationsGenerator(size));
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        return new Enumerator(() => this.prependGenerator(element));
    }

    public product(selector?: Selector<TElement, number>): number {
        if (!this.any()) {
            throw new NoElementsException();
        }
        let total: number = 1;
        for (const d of this) {
            total *= selector?.(d) ?? d as unknown as number;
        }
        return total;
    }

    public reverse(): IEnumerable<TElement> {
        return new Enumerator(() => this.reverseGenerator());
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return new Enumerator(() => this.scanGenerator(accumulator, seed));
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult> {
        return new Enumerator<TResult>(() => this.selectGenerator(selector));
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return new Enumerator(() => this.selectManyGenerator(selector));
    }

    public sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        const iterator = this[Symbol.iterator]();
        const otherIterator = iterable[Symbol.iterator]();
        let first = iterator.next();
        let second = otherIterator.next();
        if (first.done && second.done) {
            return true;
        }
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

    public shuffle(): IEnumerable<TElement> {
        return new Enumerator(() => this.shuffleGenerator());
    }

    public single(predicate?: Predicate<TElement>): TElement {
        let single: TElement | null = null;
        let index: number = 0;

        if (!predicate) {
            if (!this.any()) {
                throw new NoElementsException();
            }
            for (const item of this) {
                if (index !== 0) {
                    throw new MoreThanOneElementException();
                } else {
                    single = item;
                    index++;
                }
            }
        } else {
            if (!this.any()) {
                throw new NoElementsException();
            }
            for (const item of this) {
                if (predicate(item)) {
                    if (index !== 0) {
                        throw new MoreThanOneMatchingElementException();
                    } else {
                        single = item;
                        index++;
                    }
                }
            }
        }
        if (index === 0 || single == null) {
            throw new NoMatchingElementException();
        }
        return single;
    }

    public singleOrDefault(predicate?: Predicate<TElement>): TElement | null {
        let single: TElement | null = null;
        let index: number = 0;
        if (!predicate) {
            for (const item of this) {
                if (index !== 0) {
                    throw new MoreThanOneElementException();
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
                        throw new MoreThanOneMatchingElementException();
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
        return new Enumerator(() => this.skipWhileGenerator(predicate));
    }

    public span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>] {
        const span = new List<TElement>();
        const rest = new List<TElement>();
        let found = false;
        for (const item of this) {
            if (found) {
                rest.add(item);
            } else if (predicate(item)) {
                span.add(item);
            } else {
                found = true;
                rest.add(item);
            }
        }
        return [new Enumerable(span), new Enumerable(rest)];
    }

    public step(step: number): IEnumerable<TElement> {
        if (step < 1) {
            throw new InvalidArgumentException("Step must be greater than 0.", "step");
        }
        return new Enumerator(() => this.stepGenerator(step));
    }

    public sum(selector?: Selector<TElement, number>): number {
        if (!this.any()) {
            throw new NoElementsException();
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
        return new Enumerator(() => this.takeWhileGenerator(predicate));
    }

    public thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, true, true, comparator);
    }

    public thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return OrderedEnumerator.createOrderedEnumerable(this, keySelector, false, true, comparator);
    }

    public toArray(): TElement[] {
        return Array.from(this);
    }

    public toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        const dictionary = new Dictionary<TKey, TValue>(Enumerable.empty(), valueComparator);
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            dictionary.add(key, value);
        }
        return dictionary;
    }

    public toEnumerableSet(): EnumerableSet<TElement> {
        return new EnumerableSet<TElement>(this);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        const dictionary = this.toDictionary(keySelector, valueSelector, valueComparator);
        const pairs = dictionary.keys().zip(dictionary.values()).select(x => new KeyValuePair(x[0], x[1]));
        return ImmutableDictionary.create(pairs);
    }

    public toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return ImmutableList.create(this, comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return ImmutableQueue.create(this, comparator);
    }

    public toImmutableSet(): ImmutableSet<TElement> {
        return ImmutableSet.create(this);
    }

    public toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue> {
        const dictionary = this.toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
        const pairs = dictionary.keys().zip(dictionary.values()).select(x => new KeyValuePair(x[0], x[1]));
        return ImmutableSortedDictionary.create(pairs);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return ImmutableSortedSet.create(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return ImmutableStack.create(this, comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        return new LinkedList<TElement>(this, comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        return new List<TElement>(this, comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return Lookup.create(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue> {
        const map = new Map<TKey, TValue>();
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            map.set(key, value);
        }
        return map;
    }

    public toObject<TKey extends string | number | symbol, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue> {
        const obj: Record<TKey, TValue> = {} as Record<TKey, TValue>;
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            obj[key] = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
        }
        return obj;
    }

    public toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement> {
        return new PriorityQueue<TElement>(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement> {
        return new Queue<TElement>(this, comparator);
    }

    public toSet(): Set<TElement> {
        return new Set(this);
    }

    public toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        const dictionary = new SortedDictionary<TKey, TValue>([], keyComparator, valueComparator);
        for (const item of this) {
            const key = item instanceof KeyValuePair ? keySelector?.(item) ?? item.key : keySelector(item);
            const value = item instanceof KeyValuePair ? valueSelector?.(item) ?? item.value : valueSelector(item);
            dictionary.add(key, value);
        }
        return dictionary;
    }

    public toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return new SortedSet<TElement>(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Stack<TElement> {
        return new Stack<TElement>(this, comparator);
    }

    public union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= Comparators.equalityComparator;
        return new Enumerator(() => this.unionGenerator(iterable, comparator));
    }

    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return new Enumerator<TElement>(() => this.whereGenerator(predicate));
    }

    public windows(size: number): IEnumerable<IEnumerable<TElement>> {
        if (size < 1) {
            throw new InvalidArgumentException("Size must be greater than 0.", "size");
        }
        return new Enumerator<IEnumerable<TElement>>(() => this.windowsGenerator(size));
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return new Enumerator(() => this.zipGenerator(iterable, zipper));
    }

    private* appendGenerator(element: TElement): Iterable<TElement> {
        yield* this;
        yield element;
    }

    private* castGenerator<TResult>(): Iterable<TResult> {
        for (const item of this) {
            yield item as unknown as TResult;
        }
    }

    private* chunkGenerator(size: number): Iterable<IEnumerable<TElement>> {
        const iterator = this[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done) {
            const chunk = new List<TElement>();
            for (let index = 0; index < size; ++index) {
                if (next.done) {
                    break;
                }
                chunk.add(next.value);
                next = iterator.next();
            }
            yield chunk;
        }
    }

    private* combinationsGenerator(size?: number): Iterable<IEnumerable<TElement>> {
        const iterator = this[Symbol.iterator]();

        let next = iterator.next();
        if (next.done) {
            return yield* [];
        }

        const items = new List<TElement>();
        while (!next.done) {
            items.add(next.value);
            next = iterator.next();
        }

        const combinationCount = 1 << items.length;
        const seen = new Set<string>();

        for (let cx = 0; cx < combinationCount; ++cx) {
            const combination = new List<TElement>();
            for (let vx = 0; vx < items.length; ++vx) {
                if ((cx & (1 << vx)) !== 0) {
                    combination.add(items.elementAt(vx));
                }
            }
            if (size == null || combination.length === size) {
                const key = combination.aggregate((acc, cur) => acc + cur, ",");
                if (!seen.has(key)) {
                    seen.add(key);
                    yield combination;
                }
            }
        }
    }

    private* concatGenerator(enumerable: Iterable<TElement>): Iterable<TElement> {
        yield* this;
        yield* enumerable;
    }

    private* cycleGenerator(count?: number): Iterable<TElement> {
        if (this.none()) {
            throw new NoElementsException();
        }
        if (count == null) {
            while (true) {
                yield* this;
            }
        } else {
            for (let i = 0; i < count; ++i) {
                yield* this;
            }
        }
    }

    private* defaultIfEmptyGenerator(value?: TElement | null): Iterable<TElement | null> {
        if (this.any()) {
            yield* this;
        } else {
            yield value ?? null;
            yield* this;
        }
    }

    private* exceptGenerator(iterable: Iterable<any>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): Iterable<TElement> {
        const set = new SortedSet(iterable, comparator as OrderComparator<TElement>);
        const list = new List<TElement>([], comparator as EqualityComparator<TElement>);
        const firstOrDefault = new Enumerator<TElement>(() => iterable).firstOrDefault();
        if (!firstOrDefault) {
            return yield* this;
        } else {
            const collection = typeof comparator(firstOrDefault, firstOrDefault) === "number" ? set : list;
            for (const item of iterable) {
                if (!collection.contains(item)) {
                    collection.add(item);
                }
            }
            for (const item of this) {
                if (!collection.contains(item)) {
                    collection.add(item);
                    yield item;
                }
            }
        }
    }

    private* groupByGenerator<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): Iterable<IGroup<TKey, TElement>> {
        const groups: Array<IGroup<TKey, TElement>> = [];
        for (const item of this) {
            const key = keySelector(item);
            const group = groups.find(g => keyComparator?.(g.key, key));
            if (group) {
                (group.source as List<TElement>).add(item);
            } else {
                const newGroup = new Group(key, new List([item]));
                groups.push(newGroup);
            }
        }
        yield* groups;
    }

    private* groupJoinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): Iterable<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        for (const element of this) {
            const joinedEntries = innerEnumerable.where(innerElement => keyCompare(outerKeySelector(element), innerKeySelector(innerElement)));
            yield resultSelector(element, joinedEntries);
        }
    }

    private* indexGenerator(): Iterable<[number, TElement]> {
        let index = 0;
        for (const item of this) {
            yield [index++, item];
        }
    }

    private* intersectGenerator(iterable: Iterable<TElement>, comparator: EqualityComparator<TElement> | OrderComparator<TElement>): Iterable<TElement> {
        const set = new SortedSet(iterable, comparator as OrderComparator<TElement>);
        const list = new List<TElement>([], comparator as EqualityComparator<TElement>);
        const firstOrDefault = new Enumerator<TElement>(() => iterable).firstOrDefault();
        if (!firstOrDefault) {
            return yield* this;
        } else {
            const collection = typeof comparator(firstOrDefault, firstOrDefault) === "number" ? set : list;
            for (const item of iterable) {
                if (!collection.contains(item)) {
                    collection.add(item);
                }
            }
            for (const item of this) {
                if (collection.remove(item)) {
                    yield item;
                }
            }
        }
    }

    private* intersperseGenerator<TSeparator = TElement>(separator: TSeparator): Iterable<TElement | TSeparator> {
        let index = 0;
        for (const item of this) {
            if (index !== 0) {
                yield separator;
            }
            yield item;
            ++index;
        }
    }

    private* joinGenerator<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): Iterable<TResult> {
        const keyCompare = keyComparator ?? Comparators.equalityComparator;
        for (const element of this) {
            const innerItems = innerEnumerable.where(innerElement => keyCompare(outerKeySelector(element), innerKeySelector(innerElement)));
            if (leftJoin && !innerItems.any()) {
                yield resultSelector(element, null);
            } else {
                for (const innerItem of innerItems) {
                    yield resultSelector(element, innerItem);
                }
            }
        }
    }

    private* ofTypeGenerator<TResult extends ObjectType>(type: TResult): Iterable<InferredType<TResult>> {
        const isOfType = typeof type === "string"
            ? ((item: unknown): boolean => typeof item === type) as (item: unknown) => item is InferredType<TResult>
            : (item: unknown): item is InferredType<TResult> => item instanceof (ClassType(type) as Function);
        for (const item of this) {
            if (isOfType(item)) {
                yield item;
            }
        }
    }

    private* pairwiseGenerator(resultSelector: PairwiseSelector<TElement, TElement>): Iterable<[TElement, TElement]> {
        const iterator = this[Symbol.iterator]();
        let next = iterator.next();
        while (!next.done) {
            const previous = next;
            next = iterator.next();
            if (!next.done) {
                yield resultSelector(previous.value, next.value);
            }
        }
    }

    private* permutationsGenerator(size?: number): Iterable<IEnumerable<TElement>> {
        type Permutation = { processed: EnumerableSet<TElement>, remaining: EnumerableSet<TElement> };
        const elements = this.distinct();
        const queue = new Queue<Permutation>();
        queue.add({processed: new EnumerableSet<TElement>(), remaining: new EnumerableSet<TElement>(elements)});
        while (queue.length > 0) {
            const current = queue.poll() as Permutation;
            if (size != null && current.processed.length === size) {
                yield current.processed;
                continue;
            }
            if (size == null && current.remaining.length === 0) {
                yield current.processed;
                continue;
            }
            for (let ix = 0; ix < current.remaining.length; ++ix) {
                const newCurrent = new EnumerableSet([...current.processed, current.remaining.elementAt(ix)]);
                const newRemaining = new EnumerableSet([...current.remaining.take(ix), ...current.remaining.skip(ix + 1)]);
                queue.add({processed: newCurrent, remaining: newRemaining});
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

    private* scanGenerator<TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): Iterable<TAccumulate> {
        let accumulatedValue: TAccumulate;
        if (seed == null) {
            if (!this.any()) {
                throw new NoElementsException();
            }
            accumulatedValue = this.first() as unknown as TAccumulate;
            yield accumulatedValue;
            for (const element of this.skip(1)) {
                accumulatedValue = accumulator(accumulatedValue, element);
                yield accumulatedValue;
            }
        } else {
            accumulatedValue = seed;
            for (const element of this) {
                accumulatedValue = accumulator(accumulatedValue, element);
                yield accumulatedValue;
            }
        }
    }

    private* selectGenerator<TResult>(selector: IndexedSelector<TElement, TResult>): Iterable<TResult> {
        let index = 0;
        for (const d of this) {
            yield selector(d, index++);
        }
    }

    private* selectManyGenerator<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): Iterable<TResult> {
        let index = 0;
        for (const item of this) {
            yield* selector(item, index);
            ++index;
        }
    }

    private* shuffleGenerator(): Iterable<TElement> {
        const array = Array.from(this);
        Collections.shuffle(array);
        yield* array;
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
                yield result.shift() as TElement;
            }
        }
    }

    private* skipWhileGenerator(predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
        let index = 0;
        let skipEnded = false;
        for (const item of this) {
            if (skipEnded) {
                yield item;
            } else if (predicate(item, index)) {
                index++;
            } else {
                skipEnded = true;
                yield item;
            }
        }
    }

    private* stepGenerator(step: number): Iterable<TElement> {
        let index = 0;
        for (const item of this) {
            if (index % step === 0) {
                yield item;
            }
            ++index;
        }
    }

    private* takeGenerator(count: number): IterableIterator<TElement> {
        let index = 0;
        for (const item of this) {
            if (index < count) {
                yield item;
                index++;
            } else {
                break;
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
            } else {
                break;
            }
        }
    }

    private* unionGenerator(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): Iterable<TElement> {
        const distinctList: Array<TElement> = [];
        comparator ??= Comparators.equalityComparator;
        for (const source of [this, iterable]) {
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

    private* unionGeneratorWithKeySelector<TKey>(enumerable: IEnumerable<TElement>, keySelector: Selector<TElement, TKey>, comparator: EqualityComparator<TKey>): Iterable<TElement> {
        const distinctList: Array<TElement> = [];
        for (const source of [this, enumerable]) {
            for (const item of source) {
                let exist = false;
                for (const existingItem of distinctList) {
                    if (comparator(keySelector(item), keySelector(existingItem))) {
                        exist = true;
                        break;
                    }
                }
                if (!exist) {
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

    private* windowsGenerator(size: number): Iterable<IEnumerable<TElement>> {
        const iterator = this[Symbol.iterator]();
        const window = new List<TElement>();
        for (let item = iterator.next(); !item.done; item = iterator.next()) {
            window.add(item.value);
            if (window.size() === size) {
                yield window.toImmutableList();
                window.removeAt(0);
            }
        }
    }

    private* zipGenerator<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): Iterable<TResult> {
        const iterator = this[Symbol.iterator]();
        const otherIterator = iterable[Symbol.iterator]();
        while (true) {
            let first = iterator.next();
            let second = otherIterator.next();
            if (first.done || second.done) {
                break;
            } else {
                yield zipper?.(first.value, second.value) ?? [first.value, second.value] as TResult;
            }
        }
    }
}
