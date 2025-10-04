import {
    aggregate,
    aggregateBy,
    all,
    any,
    append,
    average,
    cast,
    chunk,
    CircularLinkedList,
    CircularQueue,
    combinations,
    concat,
    contains,
    count,
    countBy,
    cycle,
    defaultIfEmpty,
    distinct,
    distinctBy,
    elementAt,
    elementAtOrDefault,
    EnumerableSet,
    except,
    exceptBy,
    first,
    firstOrDefault,
    forEach,
    groupBy,
    groupJoin,
    ICollection,
    IEnumerable,
    IGroup,
    ILookup,
    ImmutableCircularQueue,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    index,
    intersect,
    intersectBy,
    intersperse,
    IOrderedEnumerable,
    ISet,
    join,
    last,
    lastOrDefault,
    LinkedList,
    List,
    max,
    maxBy,
    min,
    minBy,
    none,
    ofType,
    orderBy,
    orderByDescending,
    pairwise,
    partition,
    permutations,
    prepend,
    PriorityQueue,
    product,
    Queue,
    reverse,
    scan,
    select,
    selectMany,
    sequenceEqual,
    shuffle,
    single,
    singleOrDefault,
    skip,
    skipLast,
    skipWhile,
    SortedSet,
    span,
    Stack,
    step,
    sum,
    take,
    takeLast,
    takeWhile,
    toArray,
    toCircularLinkedList,
    toCircularQueue,
    toDictionary,
    toEnumerableSet,
    toImmutableCircularQueue,
    toImmutableDictionary,
    toImmutableList,
    toImmutablePriorityQueue,
    toImmutableQueue,
    toImmutableSet,
    toImmutableSortedDictionary,
    toImmutableSortedSet,
    toImmutableStack,
    toLinkedList,
    toList,
    toLookup,
    toMap,
    toObject,
    toPriorityQueue,
    toQueue,
    toSet,
    toSortedDictionary,
    toSortedSet,
    toStack,
    union,
    unionBy,
    where,
    windows,
    zip
} from "../imports";
import {Accumulator} from "../shared/Accumulator";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IndexedAction} from "../shared/IndexedAction";
import {IndexedPredicate, IndexedTypePredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {InferredType} from "../shared/InferredType";
import {JoinSelector} from "../shared/JoinSelector";
import {ObjectType} from "../shared/ObjectType";
import {OrderComparator} from "../shared/OrderComparator";
import {PairwiseSelector} from "../shared/PairwiseSelector";
import {Predicate, TypePredicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";
import {Zipper} from "../shared/Zipper";
import {Dictionary} from "./Dictionary";
import {IReadonlyDictionary} from "./IReadonlyDictionary";
import {KeyValuePair} from "./KeyValuePair";
import {SortedDictionary} from "./SortedDictionary";

export abstract class AbstractReadonlyDictionary<TKey, TValue> implements IReadonlyDictionary<TKey, TValue> {
    protected readonly keyValueComparer: EqualityComparator<KeyValuePair<TKey, TValue>>;
    protected readonly valueComparer: EqualityComparator<TValue>;

    protected constructor(valueComparator: EqualityComparator<TValue>, keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>) {
        this.valueComparer = valueComparator;
        this.keyValueComparer = keyValueComparator;
    }

    public aggregate<TAccumulate = KeyValuePair<TKey, TValue>, TResult = TAccumulate>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return aggregate(this, accumulator, seed, resultSelector);
    }

    public aggregateBy<TAggregateKey, TAccumulate = KeyValuePair<TKey, TValue>>(keySelector: Selector<KeyValuePair<TKey, TValue>, TAggregateKey>, seedSelector: Selector<TAggregateKey, TAccumulate> | TAccumulate, accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, keyComparator?: EqualityComparator<TAggregateKey>): IEnumerable<KeyValuePair<TAggregateKey, TAccumulate>> {
        return aggregateBy(this, keySelector, seedSelector, accumulator, keyComparator);
    }

    public all(predicate: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return all(this, predicate);
    }

    public any(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        if (!predicate) {
            return !this.isEmpty();
        }
        return any(this, predicate);
    }

    public append(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return append(this, element);
    }

    public asObject<TObjectKey extends PropertyKey>(): Record<TObjectKey, TValue> {
        const keySelector = ((pair: KeyValuePair<TKey, TValue>) => {
            if (typeof pair.key === "string" || typeof pair.key === "number" || typeof pair.key === "symbol") {
                return pair.key as PropertyKey;
            }
            return String(pair.key);
        });
        const valueSelector = ((pair: KeyValuePair<TKey, TValue>) => pair.value);
        return this.toObject(keySelector, valueSelector);
    }

    public average(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return average(this, selector);
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return cast(this);
    }

    public chunk(size: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return chunk(this, size);
    }

    public combinations(size?: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return combinations(this, size);
    }

    public concat(iterable: Iterable<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return concat(this, iterable);
    }

    public contains(element: KeyValuePair<TKey, TValue>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        return contains(this, element, comparator);
    }

    public count(predicate?: Predicate<KeyValuePair<TKey, TValue>>): number {
        if (!predicate) {
            return this.size();
        }
        return count(this, predicate);
    }

    public countBy<TCountKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TCountKey>, comparator?: EqualityComparator<TCountKey>): IEnumerable<KeyValuePair<TCountKey, number>> {
        return countBy(this, keySelector, comparator);
    }

    public cycle(count?: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return cycle(this, count);
    }

    public defaultIfEmpty(value?: KeyValuePair<TKey, TValue> | null): IEnumerable<KeyValuePair<TKey, TValue> | null> {
        return defaultIfEmpty(this, value);
    }

    public distinct(keyComparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return distinct(this, keyComparator);
    }

    public distinctBy<TDistinctKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDistinctKey>, comparator?: EqualityComparator<TDistinctKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return distinctBy(this, keySelector, comparator);
    }

    public elementAt(index: number): KeyValuePair<TKey, TValue> {
        return elementAt(this, index);
    }

    public elementAtOrDefault(index: number): KeyValuePair<TKey, TValue> | null {
        return elementAtOrDefault(this, index);
    }

    public except(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>> | OrderComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparer;
        return except(this, iterable, comparator);
    }

    public exceptBy<TExceptKey>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keySelector: Selector<KeyValuePair<TKey, TValue>, TExceptKey>, keyComparator?: EqualityComparator<TExceptKey> | OrderComparator<TExceptKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return exceptBy(this, iterable, keySelector, keyComparator);
    }

    public first<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): TFiltered;
    public first(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue>;
    public first<TFiltered extends KeyValuePair<TKey, TValue>>(predicate?: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): KeyValuePair<TKey, TValue> | TFiltered {
        return first(this, predicate as Predicate<KeyValuePair<TKey, TValue>> | undefined);
    }

    public firstOrDefault<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): TFiltered | null;
    public firstOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> | null;
    public firstOrDefault<TFiltered extends KeyValuePair<TKey, TValue>>(predicate?: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): KeyValuePair<TKey, TValue> | TFiltered | null {
        return firstOrDefault(this, predicate as Predicate<KeyValuePair<TKey, TValue>> | undefined);
    }

    public forEach(action: IndexedAction<KeyValuePair<TKey, TValue>>): void {
        forEach(this, action);
    }

    public groupBy<TGroupKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<IGroup<TGroupKey, KeyValuePair<TKey, TValue>>> {
        return groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<KeyValuePair<TKey, TValue>, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<TResult> {
        return groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public index(): IEnumerable<[number, KeyValuePair<TKey, TValue>]> {
        return index(this);
    }

    public intersect(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>> | OrderComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        comparator ??= this.keyValueComparer;
        return intersect(this, iterable, comparator);
    }

    public intersectBy<TIntersectKey>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keySelector: Selector<KeyValuePair<TKey, TValue>, TIntersectKey>, keyComparator?: EqualityComparator<TIntersectKey> | OrderComparator<TIntersectKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return intersectBy(this, iterable, keySelector, keyComparator);
    }

    public intersperse<TSeparator = KeyValuePair<TKey, TValue>>(separator: TSeparator): IEnumerable<KeyValuePair<TKey, TValue> | TSeparator> {
        return intersperse(this, separator);
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public join<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<KeyValuePair<TKey, TValue>, TGroupKey>, innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<KeyValuePair<TKey, TValue>, TInner, TResult>, keyComparator?: EqualityComparator<TGroupKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): TFiltered;
    public last(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue>;
    public last<TFiltered extends KeyValuePair<TKey, TValue>>(predicate?: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): KeyValuePair<TKey, TValue> | TFiltered {
        return last(this, predicate as Predicate<KeyValuePair<TKey, TValue>> | undefined);
    }

    public lastOrDefault<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): TFiltered | null;
    public lastOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> | null;
    public lastOrDefault<TFiltered extends KeyValuePair<TKey, TValue>>(predicate?: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): KeyValuePair<TKey, TValue> | TFiltered | null {
        return lastOrDefault(this, predicate as Predicate<KeyValuePair<TKey, TValue>> | undefined);
    }

    public max(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return max(this, selector);
    }

    public maxBy<TMaxKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMaxKey>, comparator?: OrderComparator<TMaxKey>): KeyValuePair<TKey, TValue> {
        return maxBy(this, keySelector, comparator);
    }

    public min(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return min(this, selector);
    }

    public minBy<TMinKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMinKey>, comparator?: OrderComparator<TMinKey>): KeyValuePair<TKey, TValue> {
        return minBy(this, keySelector, comparator);
    }

    public none(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return none(this, predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return ofType(this, type);
    }

    public orderBy<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return orderByDescending(this, keySelector, comparator);
    }

    public pairwise(resultSelector?: PairwiseSelector<KeyValuePair<TKey, TValue>, KeyValuePair<TKey, TValue>>): IEnumerable<[KeyValuePair<TKey, TValue>, KeyValuePair<TKey, TValue>]> {
        return pairwise(this, resultSelector);
    }

    public partition<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<Exclude<KeyValuePair<TKey, TValue>, TFiltered>>];
    public partition(predicate: Predicate<KeyValuePair<TKey, TValue>>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>];
    public partition<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>] | [IEnumerable<TFiltered>, IEnumerable<Exclude<KeyValuePair<TKey, TValue>, TFiltered>>] {
        return partition(this, predicate as Predicate<KeyValuePair<TKey, TValue>>) as [IEnumerable<TFiltered>, IEnumerable<Exclude<KeyValuePair<TKey, TValue>, TFiltered>>] | [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>];
    }

    public permutations(size?: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return permutations(this, size);
    }

    public prepend(element: KeyValuePair<TKey, TValue>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return prepend(this, element);
    }

    public product(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return product(this, selector);
    }

    public reverse(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return reverse(this);
    }

    public scan<TAccumulate = KeyValuePair<TKey, TValue>>(accumulator: Accumulator<KeyValuePair<TKey, TValue>, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return scan(this, accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<KeyValuePair<TKey, TValue>, TResult>): IEnumerable<TResult> {
        return select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<KeyValuePair<TKey, TValue>, Iterable<TResult>>): IEnumerable<TResult> {
        return selectMany(this, selector);
    }

    public sequenceEqual(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        comparator ??= this.keyValueComparer;
        return sequenceEqual(this, iterable, comparator);
    }

    public shuffle(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return shuffle(this);
    }

    public single<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): TFiltered;
    public single(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue>;
    public single<TFiltered extends KeyValuePair<TKey, TValue>>(predicate?: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): KeyValuePair<TKey, TValue> | TFiltered {
        return single(this, predicate as Predicate<KeyValuePair<TKey, TValue>> | undefined);
    }

    public singleOrDefault<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): TFiltered | null;
    public singleOrDefault(predicate?: Predicate<KeyValuePair<TKey, TValue>>): KeyValuePair<TKey, TValue> | null;
    public singleOrDefault<TFiltered extends KeyValuePair<TKey, TValue>>(predicate?: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): KeyValuePair<TKey, TValue> | TFiltered | null {
        return singleOrDefault(this, predicate as Predicate<KeyValuePair<TKey, TValue>> | undefined);
    }

    public skip(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return skip(this, count);
    }

    public skipLast(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return skipLast(this, count);
    }

    public skipWhile(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return skipWhile(this, predicate);
    }

    public span<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<KeyValuePair<TKey, TValue>>];
    public span(predicate: Predicate<KeyValuePair<TKey, TValue>>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>];
    public span<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<KeyValuePair<TKey, TValue>>] | [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>] {
        return span(this, predicate as Predicate<KeyValuePair<TKey, TValue>>) as [IEnumerable<TFiltered>, IEnumerable<KeyValuePair<TKey, TValue>>] | [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>];
    }

    public step(stepNumber: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return step(this, stepNumber);
    }

    public sum(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return sum(this, selector);
    }

    public take(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return take(this, count);
    }

    public takeLast(count: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return takeLast(this, count);
    }

    public takeWhile<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: IndexedTypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): IEnumerable<TFiltered>;
    public takeWhile(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>>;
    public takeWhile<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>> | IndexedTypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): IEnumerable<KeyValuePair<TKey, TValue>> | IEnumerable<TFiltered> {
        return takeWhile(this, predicate as IndexedPredicate<KeyValuePair<TKey, TValue>>);
    }

    public toArray(): KeyValuePair<TKey, TValue>[] {
        return toArray(this);
    }

    public toCircularLinkedList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): CircularLinkedList<KeyValuePair<TKey, TValue>> {
        return toCircularLinkedList(this, comparator);
    }

    public toCircularQueue(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): CircularQueue<KeyValuePair<TKey, TValue>>;
    public toCircularQueue(capacity: number, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): CircularQueue<KeyValuePair<TKey, TValue>>;
    public toCircularQueue(
        capacityOrComparator?: number | EqualityComparator<KeyValuePair<TKey, TValue>>,
        comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>
    ): CircularQueue<KeyValuePair<TKey, TValue>> {
        if (typeof capacityOrComparator === "number") {
            comparator ??= this.keyValueComparator;
            return toCircularQueue(this, capacityOrComparator, comparator);
        }
        const comparer = capacityOrComparator ?? this.keyValueComparator;
        return toCircularQueue(this, comparer);
    }

    public toDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, valueComparator?: EqualityComparator<TDictValue>): Dictionary<TDictKey, TDictValue> {
        return toDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): EnumerableSet<KeyValuePair<TKey, TValue>> {
        return toEnumerableSet(this);
    }

    public toImmutableCircularQueue(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableCircularQueue<KeyValuePair<TKey, TValue>>;
    public toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableCircularQueue<KeyValuePair<TKey, TValue>>;
    public toImmutableCircularQueue(
        capacityOrComparator?: number | EqualityComparator<KeyValuePair<TKey, TValue>>,
        comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>
    ): ImmutableCircularQueue<KeyValuePair<TKey, TValue>> {
        if (typeof capacityOrComparator === "number") {
            comparator ??= this.keyValueComparator;
            return toImmutableCircularQueue(this, capacityOrComparator, comparator);
        }
        const comparer = capacityOrComparator ?? this.keyValueComparator;
        return toImmutableCircularQueue(this, comparer);
    }

    public toImmutableDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, valueComparator?: EqualityComparator<TDictValue>): ImmutableDictionary<TDictKey, TDictValue> {
        return toImmutableDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableList<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toImmutableList(this, keyValueComparator);
    }

    public toImmutablePriorityQueue(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): ImmutablePriorityQueue<KeyValuePair<TKey, TValue>> {
        return toImmutablePriorityQueue(this, comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableQueue<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toImmutableQueue(this, keyValueComparator);
    }

    public toImmutableSet(): ImmutableSet<KeyValuePair<TKey, TValue>> {
        return toImmutableSet(this);
    }

    public toImmutableSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): ImmutableSortedDictionary<TDictKey, TDictValue> {
        return toImmutableSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): ImmutableSortedSet<KeyValuePair<TKey, TValue>> {
        return toImmutableSortedSet(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): ImmutableStack<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toImmutableStack(this, keyValueComparator);
    }

    public toLinkedList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): LinkedList<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toLinkedList(this, keyValueComparator);
    }

    public toList(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): List<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toList(this, keyValueComparator);
    }

    public toLookup<TLookupKey, TLookupValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TLookupKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TLookupValue>, keyComparator?: OrderComparator<TLookupKey>): ILookup<TLookupKey, TLookupValue> {
        return toLookup(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TMapKey, TMapValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMapKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TMapValue>): Map<TMapKey, TMapValue> {
        return toMap(this, keySelector, valueSelector);
    }

    public toObject<TObjectKey extends PropertyKey, TObjectValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TObjectKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TObjectValue>): Record<TObjectKey, TObjectValue> {
        return toObject(this, keySelector, valueSelector);
    }

    public toPriorityQueue(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): PriorityQueue<KeyValuePair<TKey, TValue>> {
        return toPriorityQueue(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): Queue<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toQueue(this, keyValueComparator);
    }

    public toSet(): Set<KeyValuePair<TKey, TValue>> {
        return toSet(this);
    }

    public toSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDictKey>, valueSelector: Selector<KeyValuePair<TKey, TValue>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): SortedDictionary<TDictKey, TDictValue> {
        return toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): SortedSet<KeyValuePair<TKey, TValue>> {
        return toSortedSet(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): Stack<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return toStack(this, keyValueComparator);
    }

    public toString(): string;
    public toString(selector?: Selector<KeyValuePair<TKey, TValue>, string>): string;
    public toString(selector?: Selector<KeyValuePair<TKey, TValue>, string>): string {
        const buffer = new Array<string>();
        for (const pair of this) {
            buffer.push(selector?.(pair) ?? `${pair.key}: ${pair.value}`);
        }
        return `{ ${buffer.join(", ")} }`;
    }

    public union(iterable: Iterable<KeyValuePair<TKey, TValue>>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        const keyValueComparator = comparator ?? this.keyValueComparer;
        return union(this, iterable, keyValueComparator);
    }

    public unionBy<TUnionKey>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keySelector: Selector<KeyValuePair<TKey, TValue>, TUnionKey>, comparator?: EqualityComparator<TUnionKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return unionBy(this, iterable, keySelector, comparator);
    }

    public where<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: IndexedTypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): IEnumerable<TFiltered>;
    public where(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>>;
    public where<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: IndexedPredicate<KeyValuePair<TKey, TValue>> | IndexedTypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): IEnumerable<KeyValuePair<TKey, TValue>> | IEnumerable<TFiltered> {
        return where(this, predicate as IndexedPredicate<KeyValuePair<TKey, TValue>>);
    }

    public windows(size: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return windows(this, size);
    }

    public zip<TSecond, TResult = [KeyValuePair<TKey, TValue>, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<KeyValuePair<TKey, TValue>, TSecond, TResult>): IEnumerable<[KeyValuePair<TKey, TValue>, TSecond]> | IEnumerable<TResult> {
        return zip(this, iterable, zipper);
    }

    public get keyValueComparator(): EqualityComparator<KeyValuePair<TKey, TValue>> {
        return this.keyValueComparer;
    }

    public get valueComparator(): EqualityComparator<TValue> {
        return this.valueComparer;
    }

    abstract [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>>;

    abstract containsKey(key: TKey): boolean;

    abstract containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean;

    abstract entries(): IterableIterator<[TKey, TValue]>;

    abstract get(key: TKey): TValue | null;

    abstract keys(): ISet<TKey>;

    abstract size(): number;

    abstract values(): ICollection<TValue>;

    abstract get length(): number;
}
