import {
    CircularLinkedList,
    CircularQueue,
    EnumerableSet,
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
    IOrderedEnumerable,
    ISet,
    LinkedList,
    List,
    PriorityQueue,
    Queue,
    SortedSet,
    Stack,
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
import { Zipper, ZipManyZipper } from "../shared/Zipper";
import {Dictionary} from "./Dictionary";
import {IReadonlyDictionary} from "./IReadonlyDictionary";
import {KeyValuePair} from "./KeyValuePair";
import {SortedDictionary} from "./SortedDictionary";
import {PipeOperator} from "../shared/PipeOperator";
import {UnpackIterableTuple} from "../shared/UnpackIterableTuple";
import {MedianTieStrategy} from "../shared/MedianTieStrategy";
import {PercentileStrategy} from "../shared/PercentileStrategy";
import { aggregate } from "../enumerator/functions/aggregate";
import { aggregateBy } from "../enumerator/functions/aggregateBy";
import { all } from "../enumerator/functions/all";
import { any } from "../enumerator/functions/any";
import { append } from "../enumerator/functions/append";
import { atLeast } from "../enumerator/functions/atLeast";
import { atMost } from "../enumerator/functions/atMost";
import { average } from "../enumerator/functions/average";
import { cartesian } from "../enumerator/functions/cartesian";
import { cast } from "../enumerator/functions/cast";
import { chunk } from "../enumerator/functions/chunk";
import { combinations } from "../enumerator/functions/combinations";
import { compact } from "../enumerator/functions/compact";
import { concat } from "../enumerator/functions/concat";
import { contains } from "../enumerator/functions/contains";
import { correlation } from "../enumerator/functions/correlation";
import { correlationBy } from "../enumerator/functions/correlationBy";
import { count } from "../enumerator/functions/count";
import { countBy } from "../enumerator/functions/countBy";
import { covariance } from "../enumerator/functions/covariance";
import { covarianceBy } from "../enumerator/functions/covarianceBy";
import { cycle } from "../enumerator/functions/cycle";
import { defaultIfEmpty } from "../enumerator/functions/defaultIfEmpty";
import { disjoint } from "../enumerator/functions/disjoint";
import { disjointBy } from "../enumerator/functions/disjointBy";
import { distinct } from "../enumerator/functions/distinct";
import { distinctBy } from "../enumerator/functions/distinctBy";
import { distinctUntilChanged } from "../enumerator/functions/distinctUntilChanged";
import { distinctUntilChangedBy } from "../enumerator/functions/distinctUntilChangedBy";
import { elementAt } from "../enumerator/functions/elementAt";
import { elementAtOrDefault } from "../enumerator/functions/elementAtOrDefault";
import { exactly } from "../enumerator/functions/exactly";
import { except } from "../enumerator/functions/except";
import { exceptBy } from "../enumerator/functions/exceptBy";
import { first } from "../enumerator/functions/first";
import { firstOrDefault } from "../enumerator/functions/firstOrDefault";
import { forEach } from "../enumerator/functions/forEach";
import { groupBy } from "../enumerator/functions/groupBy";
import { groupJoin } from "../enumerator/functions/groupJoin";
import { index } from "../enumerator/functions/index";
import { interleave } from "../enumerator/functions/interleave";
import { intersect } from "../enumerator/functions/intersect";
import { intersectBy } from "../enumerator/functions/intersectBy";
import { intersperse } from "../enumerator/functions/intersperse";
import { join } from "../enumerator/functions/join";
import { last } from "../enumerator/functions/last";
import { lastOrDefault } from "../enumerator/functions/lastOrDefault";
import { max } from "../enumerator/functions/max";
import { maxBy } from "../enumerator/functions/maxBy";
import { median } from "../enumerator/functions/median";
import { min } from "../enumerator/functions/min";
import { minBy } from "../enumerator/functions/minBy";
import { mode } from "../enumerator/functions/mode";
import { modeOrDefault } from "../enumerator/functions/modeOrDefault";
import { multimode } from "../enumerator/functions/multimode";
import { none } from "../enumerator/functions/none";
import { ofType } from "../enumerator/functions/ofType";
import { order } from "../enumerator/functions/order";
import { orderBy } from "../enumerator/functions/orderBy";
import { orderByDescending } from "../enumerator/functions/orderByDescending";
import { orderDescending } from "../enumerator/functions/orderDescending";
import { pairwise } from "../enumerator/functions/pairwise";
import { partition } from "../enumerator/functions/partition";
import { percentile } from "../enumerator/functions/percentile";
import { permutations } from "../enumerator/functions/permutations";
import { pipe } from "../enumerator/functions/pipe";
import { prepend } from "../enumerator/functions/prepend";
import { product } from "../enumerator/functions/product";
import { reverse } from "../enumerator/functions/reverse";
import { rotate } from "../enumerator/functions/rotate";
import { scan } from "../enumerator/functions/scan";
import { select } from "../enumerator/functions/select";
import { selectMany } from "../enumerator/functions/selectMany";
import { sequenceEqual } from "../enumerator/functions/sequenceEqual";
import { shuffle } from "../enumerator/functions/shuffle";
import { single } from "../enumerator/functions/single";
import { singleOrDefault } from "../enumerator/functions/singleOrDefault";
import { skip } from "../enumerator/functions/skip";
import { skipLast } from "../enumerator/functions/skipLast";
import { skipWhile } from "../enumerator/functions/skipWhile";
import { span } from "../enumerator/functions/span";
import { standardDeviation } from "../enumerator/functions/standardDeviation";
import { step } from "../enumerator/functions/step";
import { sum } from "../enumerator/functions/sum";
import { take } from "../enumerator/functions/take";
import { takeLast } from "../enumerator/functions/takeLast";
import { takeWhile } from "../enumerator/functions/takeWhile";
import { tap } from "../enumerator/functions/tap";
import { toArray } from "../enumerator/functions/toArray";
import { toCircularLinkedList } from "../enumerator/functions/toCircularLinkedList";
import { toCircularQueue } from "../enumerator/functions/toCircularQueue";
import { toDictionary } from "../enumerator/functions/toDictionary";
import { toEnumerableSet } from "../enumerator/functions/toEnumerableSet";
import { toImmutableCircularQueue } from "../enumerator/functions/toImmutableCircularQueue";
import { toImmutableDictionary } from "../enumerator/functions/toImmutableDictionary";
import { toImmutableList } from "../enumerator/functions/toImmutableList";
import { toImmutablePriorityQueue } from "../enumerator/functions/toImmutablePriorityQueue";
import { toImmutableQueue } from "../enumerator/functions/toImmutableQueue";
import { toImmutableSet } from "../enumerator/functions/toImmutableSet";
import { toImmutableSortedDictionary } from "../enumerator/functions/toImmutableSortedDictionary";
import { toImmutableSortedSet } from "../enumerator/functions/toImmutableSortedSet";
import { toImmutableStack } from "../enumerator/functions/toImmutableStack";
import { toLinkedList } from "../enumerator/functions/toLinkedList";
import { toList } from "../enumerator/functions/toList";
import { toLookup } from "../enumerator/functions/toLookup";
import { toMap } from "../enumerator/functions/toMap";
import { toObject } from "../enumerator/functions/toObject";
import { toPriorityQueue } from "../enumerator/functions/toPriorityQueue";
import { toQueue } from "../enumerator/functions/toQueue";
import { toSet } from "../enumerator/functions/toSet";
import { toSortedDictionary } from "../enumerator/functions/toSortedDictionary";
import { toSortedSet } from "../enumerator/functions/toSortedSet";
import { toStack } from "../enumerator/functions/toStack";
import { union } from "../enumerator/functions/union";
import { unionBy } from "../enumerator/functions/unionBy";
import { variance } from "../enumerator/functions/variance";
import { where } from "../enumerator/functions/where";
import { windows } from "../enumerator/functions/windows";
import { zip } from "../enumerator/functions/zip";
import { zipMany } from "../enumerator/functions/zipMany";

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

    public atLeast(count: number, predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return atLeast(this, count, predicate);
    }

    public atMost(count: number, predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return atMost(this, count, predicate);
    }

    public average(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return average(this, selector);
    }

    public cartesian<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[KeyValuePair<TKey, TValue>, TSecond]> {
        return cartesian(this, iterable);
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

    public compact(): IEnumerable<NonNullable<KeyValuePair<TKey, TValue>>> {
        return compact(this);
    }

    public concat(iterable: Iterable<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return concat(this, iterable);
    }

    public contains(element: KeyValuePair<TKey, TValue>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): boolean {
        return contains(this, element, comparator);
    }

    public correlation<TSecond>(iterable: Iterable<TSecond>, selector?: Selector<KeyValuePair<TKey, TValue>, number>, otherSelector?: Selector<TSecond, number>): number {
        return correlation(this, iterable, selector, otherSelector);
    }

    public correlationBy(leftSelector: Selector<KeyValuePair<TKey, TValue>, number>, rightSelector: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return correlationBy(this, leftSelector, rightSelector);
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

    public covariance<TSecond>(iterable: Iterable<TSecond>, selector?: Selector<KeyValuePair<TKey, TValue>, number>, otherSelector?: Selector<TSecond, number>, sample?: boolean): number {
        return covariance(this, iterable, selector, otherSelector, sample);
    }

    public covarianceBy(leftSelector: Selector<KeyValuePair<TKey, TValue>, number>, rightSelector: Selector<KeyValuePair<TKey, TValue>, number>, sample?: boolean): number {
        return covarianceBy(this, leftSelector, rightSelector, sample);
    }

    public cycle(count?: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return cycle(this, count);
    }

    public defaultIfEmpty(value?: KeyValuePair<TKey, TValue> | null): IEnumerable<KeyValuePair<TKey, TValue> | null> {
        return defaultIfEmpty(this, value);
    }

    public disjoint<TSecond>(iterable: Iterable<TSecond>, comparator?: EqualityComparator<KeyValuePair<TKey, TValue> | TSecond>): boolean {
        return disjoint(this, iterable, comparator);
    }

    public disjointBy<TSecond, TDisjointKey, TSecondDisjointKey>(iterable: Iterable<TSecond>, keySelector: Selector<KeyValuePair<TKey, TValue>, TDisjointKey>, otherKeySelector: Selector<TSecond, TSecondDisjointKey>, keyComparator?: EqualityComparator<TDisjointKey | TSecondDisjointKey>): boolean {
        return disjointBy(this, iterable, keySelector, otherKeySelector, keyComparator);
    }

    public distinct(keyComparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return distinct(this, keyComparator);
    }

    public distinctBy<TDistinctKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDistinctKey>, comparator?: EqualityComparator<TDistinctKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return distinctBy(this, keySelector, comparator);
    }

    public distinctUntilChanged(comparator?: EqualityComparator<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return distinctUntilChanged(this, comparator);
    }

    public distinctUntilChangedBy<TDistinctKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TDistinctKey>, keyComparator?: EqualityComparator<TDistinctKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return distinctUntilChangedBy(this, keySelector, keyComparator);
    }

    public elementAt(index: number): KeyValuePair<TKey, TValue> {
        return elementAt(this, index);
    }

    public elementAtOrDefault(index: number): KeyValuePair<TKey, TValue> | null {
        return elementAtOrDefault(this, index);
    }

    public exactly(count: number, predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return exactly(this, count, predicate);
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

    public interleave<TSecond>(iterable: Iterable<TSecond>): IEnumerable<KeyValuePair<TKey, TValue> | TSecond> {
        return interleave(this, iterable);
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

    public median(selector?: Selector<KeyValuePair<TKey, TValue>, number>, tie?: MedianTieStrategy): number {
        return median(this, selector, tie);
    }

    public min(selector?: Selector<KeyValuePair<TKey, TValue>, number>): number {
        return min(this, selector);
    }

    public minBy<TMinKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TMinKey>, comparator?: OrderComparator<TMinKey>): KeyValuePair<TKey, TValue> {
        return minBy(this, keySelector, comparator);
    }

    public mode<TModeKey>(keySelector?: Selector<KeyValuePair<TKey, TValue>, TModeKey>): KeyValuePair<TKey, TValue> {
        return mode(this, keySelector);
    }

    public modeOrDefault<TModeKey>(keySelector?: Selector<KeyValuePair<TKey, TValue>, TModeKey>): KeyValuePair<TKey, TValue> | null {
        return modeOrDefault(this, keySelector);
    }

    public multimode<TModeKey>(keySelector?: Selector<KeyValuePair<TKey, TValue>, TModeKey>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return multimode(this, keySelector);
    }

    public none(predicate?: Predicate<KeyValuePair<TKey, TValue>>): boolean {
        return none(this, predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return ofType(this, type);
    }

    public order(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return order(this, comparator);
    }

    public orderBy<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TOrderKey>(keySelector: Selector<KeyValuePair<TKey, TValue>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return orderByDescending(this, keySelector, comparator);
    }

    public orderDescending(comparator?: OrderComparator<KeyValuePair<TKey, TValue>>): IOrderedEnumerable<KeyValuePair<TKey, TValue>> {
        return orderDescending(this, comparator);
    }

    public pairwise(resultSelector?: PairwiseSelector<KeyValuePair<TKey, TValue>, KeyValuePair<TKey, TValue>>): IEnumerable<[KeyValuePair<TKey, TValue>, KeyValuePair<TKey, TValue>]> {
        return pairwise(this, resultSelector);
    }

    public partition<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<Exclude<KeyValuePair<TKey, TValue>, TFiltered>>];
    public partition(predicate: Predicate<KeyValuePair<TKey, TValue>>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>];
    public partition<TFiltered extends KeyValuePair<TKey, TValue>>(predicate: Predicate<KeyValuePair<TKey, TValue>> | TypePredicate<KeyValuePair<TKey, TValue>, TFiltered>): [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>] | [IEnumerable<TFiltered>, IEnumerable<Exclude<KeyValuePair<TKey, TValue>, TFiltered>>] {
        return partition(this, predicate as Predicate<KeyValuePair<TKey, TValue>>) as [IEnumerable<TFiltered>, IEnumerable<Exclude<KeyValuePair<TKey, TValue>, TFiltered>>] | [IEnumerable<KeyValuePair<TKey, TValue>>, IEnumerable<KeyValuePair<TKey, TValue>>];
    }

    public percentile(percent: number, selector?: Selector<KeyValuePair<TKey, TValue>, number>, strategy?: PercentileStrategy): number {
        return percentile(this, percent, selector, strategy);
    }

    public permutations(size?: number): IEnumerable<IEnumerable<KeyValuePair<TKey, TValue>>> {
        return permutations(this, size);
    }

    public pipe<TResult>(operator: PipeOperator<KeyValuePair<TKey, TValue>, TResult>): TResult {
        return pipe(this, operator);
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

    public rotate(shift: number): IEnumerable<KeyValuePair<TKey, TValue>> {
        return rotate(this, shift);
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

    public standardDeviation(selector?: Selector<KeyValuePair<TKey, TValue>, number>, sample?: boolean): number {
        return standardDeviation(this, selector, sample);
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

    public tap(action: IndexedAction<KeyValuePair<TKey, TValue>>): IEnumerable<KeyValuePair<TKey, TValue>> {
        return tap(this, action);
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

    public variance(selector?: Selector<KeyValuePair<TKey, TValue>, number>, sample?: boolean): number {
        return variance(this, selector, sample);
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

    public zipMany<TIterable extends readonly Iterable<unknown>[]>(
        ...iterables: [...TIterable]
    ): IEnumerable<[KeyValuePair<TKey, TValue>, ...UnpackIterableTuple<TIterable>]>;
    public zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable, ZipManyZipper<[KeyValuePair<TKey, TValue>, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<TResult>;
    public zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable] | [...TIterable, ZipManyZipper<[KeyValuePair<TKey, TValue>, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<[KeyValuePair<TKey, TValue>, ...UnpackIterableTuple<TIterable>]> | IEnumerable<TResult> {
        const lastArg = iterablesAndZipper[iterablesAndZipper.length - 1];
        const hasZipper = iterablesAndZipper.length > 0 && typeof lastArg === "function";
        if (hasZipper) {
            const iterables = iterablesAndZipper.slice(0, -1) as [...TIterable];
            const zipper = lastArg as ZipManyZipper<[KeyValuePair<TKey, TValue>, ...UnpackIterableTuple<TIterable>], TResult>;
            return zipMany(this, ...iterables, zipper);
        }
        const iterables = iterablesAndZipper as [...TIterable];
        return zipMany(this, ...iterables);
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
