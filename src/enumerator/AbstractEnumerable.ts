import { Dictionary } from "../dictionary/Dictionary";
import { KeyValuePair } from "../dictionary/KeyValuePair";
import { SortedDictionary } from "../dictionary/SortedDictionary";
import {
    CircularLinkedList,
    CircularQueue,
    ImmutableCircularQueue,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    PriorityQueue,
    Queue,
    Stack
} from "../imports";
import { LinkedList } from "../list/LinkedList";
import { List } from "../list/List";
import { ILookup } from "../lookup/ILookup";
import { EnumerableSet } from "../set/EnumerableSet";
import { SortedSet } from "../set/SortedSet";
import { Accumulator } from "../shared/Accumulator";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate, IndexedTypePredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { MedianTieStrategy } from "../shared/MedianTieStrategy";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { PercentileStrategy } from "../shared/PercentileStrategy";
import { PipeOperator } from "../shared/PipeOperator";
import { Predicate, TypePredicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { UnpackIterableTuple } from "../shared/UnpackIterableTuple";
import { ZipManyZipper, Zipper } from "../shared/Zipper";

import { aggregate } from "./functions/aggregate";
import { aggregateBy } from "./functions/aggregateBy";
import { all } from "./functions/all";
import { any } from "./functions/any";
import { append } from "./functions/append";
import { atLeast } from "./functions/atLeast";
import { atMost } from "./functions/atMost";
import { average } from "./functions/average";
import { cartesian } from "./functions/cartesian";
import { cast } from "./functions/cast";
import { chunk } from "./functions/chunk";
import { combinations } from "./functions/combinations";
import { compact } from "./functions/compact";
import { concat } from "./functions/concat";
import { contains } from "./functions/contains";
import { correlation } from "./functions/correlation";
import { correlationBy } from "./functions/correlationBy";
import { count } from "./functions/count";
import { countBy } from "./functions/countBy";
import { covariance } from "./functions/covariance";
import { covarianceBy } from "./functions/covarianceBy";
import { cycle } from "./functions/cycle";
import { defaultIfEmpty } from "./functions/defaultIfEmpty";
import { disjoint } from "./functions/disjoint";
import { disjointBy } from "./functions/disjointBy";
import { distinct } from "./functions/distinct";
import { distinctBy } from "./functions/distinctBy";
import { distinctUntilChanged } from "./functions/distinctUntilChanged";
import { distinctUntilChangedBy } from "./functions/distinctUntilChangedBy";
import { elementAt } from "./functions/elementAt";
import { elementAtOrDefault } from "./functions/elementAtOrDefault";
import { exactly } from "./functions/exactly";
import { except } from "./functions/except";
import { exceptBy } from "./functions/exceptBy";
import { first } from "./functions/first";
import { firstOrDefault } from "./functions/firstOrDefault";
import { from } from "./functions/from";
import { groupBy } from "./functions/groupBy";
import { groupJoin } from "./functions/groupJoin";
import { index } from "./functions/index";
import { interleave } from "./functions/interleave";
import { intersect } from "./functions/intersect";
import { intersectBy } from "./functions/intersectBy";
import { intersperse } from "./functions/intersperse";
import { join } from "./functions/join";
import { last } from "./functions/last";
import { lastOrDefault } from "./functions/lastOrDefault";
import { max } from "./functions/max";
import { maxBy } from "./functions/maxBy";
import { median } from "./functions/median";
import { min } from "./functions/min";
import { minBy } from "./functions/minBy";
import { mode } from "./functions/mode";
import { modeOrDefault } from "./functions/modeOrDefault";
import { multimode } from "./functions/multimode";
import { none } from "./functions/none";
import { ofType } from "./functions/ofType";
import { order } from "./functions/order";
import { orderBy } from "./functions/orderBy";
import { orderByDescending } from "./functions/orderByDescending";
import { orderDescending } from "./functions/orderDescending";
import { pairwise } from "./functions/pairwise";
import { partition } from "./functions/partition";
import { percentile } from "./functions/percentile";
import { permutations } from "./functions/permutations";
import { pipe } from "./functions/pipe";
import { prepend } from "./functions/prepend";
import { product } from "./functions/product";
import { reverse } from "./functions/reverse";
import { rotate } from "./functions/rotate";
import { scan } from "./functions/scan";
import { select } from "./functions/select";
import { selectMany } from "./functions/selectMany";
import { sequenceEqual } from "./functions/sequenceEqual";
import { shuffle } from "./functions/shuffle";
import { single } from "./functions/single";
import { singleOrDefault } from "./functions/singleOrDefault";
import { skip } from "./functions/skip";
import { skipLast } from "./functions/skipLast";
import { skipWhile } from "./functions/skipWhile";
import { span } from "./functions/span";
import { standardDeviation } from "./functions/standardDeviation";
import { step } from "./functions/step";
import { sum } from "./functions/sum";
import { take } from "./functions/take";
import { takeLast } from "./functions/takeLast";
import { takeWhile } from "./functions/takeWhile";
import { tap } from "./functions/tap";
import { toArray } from "./functions/toArray";
import { toCircularLinkedList } from "./functions/toCircularLinkedList";
import { toCircularQueue } from "./functions/toCircularQueue";
import { toDictionary } from "./functions/toDictionary";
import { toEnumerableSet } from "./functions/toEnumerableSet";
import { toImmutableCircularQueue } from "./functions/toImmutableCircularQueue";
import { toImmutableDictionary } from "./functions/toImmutableDictionary";
import { toImmutableList } from "./functions/toImmutableList";
import { toImmutablePriorityQueue } from "./functions/toImmutablePriorityQueue";
import { toImmutableQueue } from "./functions/toImmutableQueue";
import { toImmutableSet } from "./functions/toImmutableSet";
import { toImmutableSortedDictionary } from "./functions/toImmutableSortedDictionary";
import { toImmutableSortedSet } from "./functions/toImmutableSortedSet";
import { toImmutableStack } from "./functions/toImmutableStack";
import { toLinkedList } from "./functions/toLinkedList";
import { toList } from "./functions/toList";
import { toLookup } from "./functions/toLookup";
import { toMap } from "./functions/toMap";
import { toObject } from "./functions/toObject";
import { toPriorityQueue } from "./functions/toPriorityQueue";
import { toQueue } from "./functions/toQueue";
import { toSet } from "./functions/toSet";
import { toSortedDictionary } from "./functions/toSortedDictionary";
import { toSortedSet } from "./functions/toSortedSet";
import { toStack } from "./functions/toStack";
import { union } from "./functions/union";
import { unionBy } from "./functions/unionBy";
import { variance } from "./functions/variance";
import { where } from "./functions/where";
import { windows } from "./functions/windows";
import { zip } from "./functions/zip";
import { zipMany } from "./functions/zipMany";
import { IEnumerable } from "./IEnumerable";
import { IGroup } from "./IGroup";
import { IOrderedEnumerable } from "./IOrderedEnumerable";

export abstract class AbstractEnumerable<TElement> implements IEnumerable<TElement> {
    protected readonly comparer: EqualityComparator<TElement>;

    protected constructor(comparator?: EqualityComparator<TElement>) {
        this.comparer = comparator ?? Comparators.equalityComparator;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return aggregate(this, accumulator, seed, resultSelector);
    }

    public aggregateBy<TKey, TAccumulate = TElement>(keySelector: Selector<TElement, TKey>, seedSelector: Selector<TKey, TAccumulate> | TAccumulate, accumulator: Accumulator<TElement, TAccumulate>, keyComparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, TAccumulate>> {
        return aggregateBy(this, keySelector, seedSelector, accumulator, keyComparator);
    }

    public all(predicate: Predicate<TElement>): boolean {
        return all(this, predicate);
    }

    public any(predicate?: Predicate<TElement>): boolean {
        return any(this, predicate);
    }

    public append(element: TElement): IEnumerable<TElement> {
        return append(this, element);
    }

    public atLeast(count: number, predicate?: Predicate<TElement>): boolean {
        return atLeast(this, count, predicate);
    }

    public atMost(count: number, predicate?: Predicate<TElement>): boolean {
        return atMost(this, count, predicate);
    }

    public average(selector?: Selector<TElement, number>): number {
        return average(this, selector);
    }

    public cartesian<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]> {
        return cartesian(this, iterable);
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return cast(this);
    }

    public chunk(size: number): IEnumerable<IEnumerable<TElement>> {
        return chunk(this, size);
    }

    public combinations(size?: number): IEnumerable<IEnumerable<TElement>> {
        return combinations(this, size);
    }

    public compact(): IEnumerable<NonNullable<TElement>> {
        return compact(this);
    }

    public concat(iterable: Iterable<TElement>): IEnumerable<TElement> {
        return concat(this, iterable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return contains(this, element, comparator);
    }

    public correlation<TSecond>(iterable: Iterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>): number {
        return correlation(this, iterable, selector, otherSelector);
    }

    public correlationBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>): number {
        return correlationBy(this, leftSelector, rightSelector);
    }

    public count(predicate?: Predicate<TElement>): number {
        return count(this, predicate);
    }

    public countBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<KeyValuePair<TKey, number>> {
        return countBy(this, keySelector, comparator);
    }

    public covariance<TSecond>(iterable: Iterable<TSecond>, selector?: Selector<TElement, number>, otherSelector?: Selector<TSecond, number>, sample?: boolean): number {
        return covariance(this, iterable, selector, otherSelector, sample);
    }

    public covarianceBy(leftSelector: Selector<TElement, number>, rightSelector: Selector<TElement, number>, sample?: boolean): number {
        return covarianceBy(this, leftSelector, rightSelector, sample);
    }

    public cycle(count?: number): IEnumerable<TElement> {
        return cycle(this, count);
    }

    public defaultIfEmpty(value?: TElement | null): IEnumerable<TElement | null> {
        return defaultIfEmpty(this as IEnumerable<TElement | null>, value);
    }

    public disjoint<TSecond>(iterable: Iterable<TSecond>, comparator?: EqualityComparator<TElement | TSecond>): boolean {
        return disjoint(this, iterable, comparator);
    }

    public disjointBy<TSecond, TKey, TSecondKey>(iterable: Iterable<TSecond>, keySelector: Selector<TElement, TKey>, otherKeySelector: Selector<TSecond, TSecondKey>, keyComparator?: EqualityComparator<TKey | TSecondKey>): boolean {
        return disjointBy(this, iterable, keySelector, otherKeySelector, keyComparator);
    }

    public distinct(keyComparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return distinct(this, keyComparator);
    }

    public distinctBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return distinctBy(this, keySelector, keyComparator);
    }

    public distinctUntilChanged(comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        return distinctUntilChanged(this, comparator);
    }

    public distinctUntilChangedBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return distinctUntilChangedBy(this, keySelector, keyComparator);
    }

    public elementAt(index: number): TElement {
        return elementAt(this, index);
    }

    public elementAtOrDefault(index: number): TElement | null {
        return elementAtOrDefault(this, index);
    }

    public exactly(count: number, predicate?: Predicate<TElement>): boolean {
        return exactly(this, count, predicate);
    }

    public except(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        comparator = comparator ?? this.comparer;
        return except(this, iterable, comparator);
    }

    public exceptBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        return exceptBy(this, iterable, keySelector, keyComparator);
    }

    public first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public first(predicate?: Predicate<TElement>): TElement;
    public first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        return first(this, predicate as Predicate<TElement> | undefined);
    }

    public firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public firstOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        return firstOrDefault(this, predicate as Predicate<TElement> | undefined);
    }

    public forEach(action: IndexedAction<TElement>) {
        let index: number = 0;
        for (const element of this) {
            action(element, index++);
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGroup<TKey, TElement>> {
        return groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        return groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public index(): IEnumerable<[number, TElement]> {
        return index(this);
    }

    public interleave<TSecond>(iterable: Iterable<TSecond>): IEnumerable<TElement | TSecond> {
        return interleave(this, iterable);
    }

    public intersect(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement> | OrderComparator<TElement>): IEnumerable<TElement> {
        comparator = comparator ?? this.comparer;
        return intersect(this, iterable, comparator);
    }

    public intersectBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>): IEnumerable<TElement> {
        return intersectBy(this, iterable, keySelector, keyComparator);
    }

    public intersperse<TSeparator = TElement>(separator: TSeparator): IEnumerable<TElement | TSeparator> {
        return intersperse(this, separator);
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public last(predicate?: Predicate<TElement>): TElement;
    public last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        return last(this, predicate as Predicate<TElement> | undefined);
    }

    public lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public lastOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        return lastOrDefault(this, predicate as Predicate<TElement> | undefined);
    }

    public max(selector?: Selector<TElement, number>): number {
        return max(this, selector);
    }

    public maxBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return maxBy(this, keySelector, comparator);
    }

    public median(selector?: Selector<TElement, number>, tie?: MedianTieStrategy): number {
        return median(this, selector, tie);
    }

    public min(selector?: Selector<TElement, number>): number {
        return min(this, selector);
    }

    public minBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        return minBy(this, keySelector, comparator);
    }

    public mode<TKey>(keySelector?: Selector<TElement, TKey>): TElement {
        return mode(this, keySelector);
    }

    public modeOrDefault<TKey>(keySelector?: Selector<TElement, TKey>): TElement | null {
        return modeOrDefault(this, keySelector);
    }

    public multimode<TKey>(keySelector?: Selector<TElement, TKey>): IEnumerable<TElement> {
        return multimode(this, keySelector);
    }

    public none(predicate?: Predicate<TElement>): boolean {
        return none(this, predicate);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return ofType(this, type);
    }

    public order(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement> {
        return order(this, comparator);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return orderByDescending(this, keySelector, comparator);
    }

    public orderDescending(comparator?: OrderComparator<TElement>): IOrderedEnumerable<TElement> {
        return orderDescending(this, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<TElement, TElement>): IEnumerable<[TElement, TElement]> {
        return pairwise(this, resultSelector);
    }

    public partition<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];
    public partition(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];
    public partition<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): [IEnumerable<TElement>, IEnumerable<TElement>] | [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] {
        return partition(this, predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public percentile(percent: number, selector?: Selector<TElement, number>, strategy?: PercentileStrategy): number {
        return percentile(this, percent, selector, strategy);
    }

    public permutations(size?: number): IEnumerable<IEnumerable<TElement>> {
        return permutations(this, size);
    }

    public pipe<TResult>(operator: PipeOperator<TElement, TResult>): TResult {
        return pipe(this, operator);
    }

    public prepend(element: TElement): IEnumerable<TElement> {
        return prepend(this, element);
    }

    public product(selector?: Selector<TElement, number>): number {
        return product(this, selector);
    }

    public reverse(): IEnumerable<TElement> {
        return reverse(this);
    }

    public rotate(shift: number): IEnumerable<TElement> {
        return rotate(this, shift);
    }

    public scan<TAccumulate = TElement>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return scan(this, accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<TElement, TResult>): IEnumerable<TResult> {
        return select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return selectMany(this, selector);
    }

    public sequenceEqual(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparer;
        return sequenceEqual(this, iterable, comparator);
    }

    public shuffle(): IEnumerable<TElement> {
        return shuffle(this);
    }

    public single<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public single(predicate?: Predicate<TElement>): TElement;
    public single<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        return single(this, predicate as Predicate<TElement> | undefined);
    }

    public singleOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public singleOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public singleOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        return singleOrDefault(this, predicate as Predicate<TElement> | undefined);
    }

    public skip(count: number): IEnumerable<TElement> {
        return skip(this, count);
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return skipLast(this, count);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return skipWhile(this, predicate);
    }

    public span<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>];
    public span(predicate: Predicate<TElement>): [IEnumerable<TElement>, IEnumerable<TElement>];
    public span<TFiltered extends TElement>(predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>): [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
        return span(this, predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>];
    }

    public standardDeviation(selector?: Selector<TElement, number>, sample?: boolean): number {
        return standardDeviation(this, selector, sample);
    }

    public step(stepNumber: number): IEnumerable<TElement> {
        return step(this, stepNumber);
    }

    public sum(selector?: Selector<TElement, number>): number {
        return sum(this, selector);
    }

    public take(count: number): IEnumerable<TElement> {
        return take(this, count);
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return takeLast(this, count);
    }

    public takeWhile<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public takeWhile<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return takeWhile(this, predicate as IndexedPredicate<TElement>);
    }

    public tap(action: IndexedAction<TElement>): IEnumerable<TElement> {
        return tap(this, action);
    }

    public toArray(): TElement[] {
        return toArray(this);
    }

    public toCircularLinkedList(comparator?: EqualityComparator<TElement, TElement>): CircularLinkedList<TElement> {
        return toCircularLinkedList(this, comparator);
    }

    public toCircularQueue(comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;
    public toCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): CircularQueue<TElement>;
    public toCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): CircularQueue<TElement> {
        if (typeof capacityOrComparator === "number") {
            comparator ??= this.comparer;
            return toCircularQueue(this, capacityOrComparator, comparator);
        }
        const comparer = capacityOrComparator ?? this.comparer;
        return toCircularQueue(this, comparer);
    }

    public toDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return toDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): EnumerableSet<TElement> {
        return toEnumerableSet(this);
    }

    public toImmutableCircularQueue(comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public toImmutableCircularQueue(capacity: number, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public toImmutableCircularQueue(
        capacityOrComparator?: number | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): ImmutableCircularQueue<TElement> {
        if (typeof capacityOrComparator === "number") {
            comparator ??= this.comparer;
            return toImmutableCircularQueue(this, capacityOrComparator, comparator);
        }
        const comparer = capacityOrComparator ?? this.comparer;
        return toImmutableCircularQueue(this, comparer);
    }

    public toImmutableDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, valueComparator?: EqualityComparator<TValue>): ImmutableDictionary<TKey, TValue> {
        return toImmutableDictionary(this, keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return toImmutableList(this, comparator);
    }

    public toImmutablePriorityQueue(comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement> {
        return toImmutablePriorityQueue(this, comparator);
    }

    public toImmutableQueue(comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return toImmutableQueue(this, comparator);
    }

    public toImmutableSet(): ImmutableSet<TElement> {
        return toImmutableSet(this);
    }

    public toImmutableSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue> {
        return toImmutableSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return toImmutableSortedSet(this, comparator);
    }

    public toImmutableStack(comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return toImmutableStack(this, comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<TElement>): LinkedList<TElement> {
        comparator ??= this.comparer;
        return toLinkedList(this, comparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        comparator ??= this.comparer;
        return toList(this, comparator);
    }

    public toLookup<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>): ILookup<TKey, TValue> {
        return toLookup(this, keySelector, valueSelector, keyComparator);
    }

    public toMap<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Map<TKey, TValue> {
        return toMap(this, keySelector, valueSelector);
    }

    public toObject<TKey extends PropertyKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>): Record<TKey, TValue> {
        return toObject(this, keySelector, valueSelector);
    }

    public toPriorityQueue(comparator?: OrderComparator<TElement>): PriorityQueue<TElement> {
        return toPriorityQueue(this, comparator);
    }

    public toQueue(comparator?: EqualityComparator<TElement>): Queue<TElement> {
        comparator ??= this.comparer;
        return toQueue(this, comparator);
    }

    public toSet(): Set<TElement> {
        return toSet(this);
    }

    public toSortedDictionary<TKey, TValue>(keySelector: Selector<TElement, TKey>, valueSelector: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): SortedDictionary<TKey, TValue> {
        return toSortedDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<TElement>): SortedSet<TElement> {
        return toSortedSet(this, comparator);
    }

    public toStack(comparator?: EqualityComparator<TElement>): Stack<TElement> {
        comparator ??= this.comparer;
        return toStack(this, comparator);
    }

    public union(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparer;
        return union(this, iterable, comparator);
    }

    public unionBy<TKey>(iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, comparator?: EqualityComparator<TKey>): IEnumerable<TElement> {
        return unionBy(this, iterable, keySelector, comparator);
    }

    public variance(selector?: Selector<TElement, number>, sample?: boolean): number {
        return variance(this, selector, sample);
    }

    public where<TFiltered extends TElement>(predicate: IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TFiltered>;
    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement>;
    public where<TFiltered extends TElement>(predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>): IEnumerable<TElement> | IEnumerable<TFiltered> {
        return where(this, predicate as IndexedPredicate<TElement>);
    }

    public windows(size: number): IEnumerable<IEnumerable<TElement>> {
        return windows(this, size);
    }

    public zip<TSecond>(iterable: Iterable<TSecond>): IEnumerable<[TElement, TSecond]>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<TResult>;
    public zip<TSecond, TResult = [TElement, TSecond]>(iterable: Iterable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return zip(this, iterable, zipper);
    }

    public zipMany<TIterable extends readonly Iterable<unknown>[]>(
        ...iterables: [...TIterable]
    ): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]>;
    public zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<TResult>;
    public zipMany<TIterable extends readonly Iterable<unknown>[], TResult>(
        ...iterablesAndZipper: [...TIterable] | [...TIterable, ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>]
    ): IEnumerable<[TElement, ...UnpackIterableTuple<TIterable>]> | IEnumerable<TResult> {
        const lastArg = iterablesAndZipper[iterablesAndZipper.length - 1];
        const hasZipper = iterablesAndZipper.length > 0 && typeof lastArg === "function";
        if (hasZipper) {
            const iterables = iterablesAndZipper.slice(0, -1) as [...TIterable];
            const zipper = lastArg as ZipManyZipper<[TElement, ...UnpackIterableTuple<TIterable>], TResult>;
            return zipMany(this, ...iterables, zipper);
        }
        const iterables = iterablesAndZipper as [...TIterable];
        return zipMany(this, ...iterables);
    }

    protected getIterableSize(iterable: Iterable<TElement>): number {
        if (iterable instanceof Array) {
            return iterable.length;
        }
        if (iterable instanceof Set) {
            return iterable.size;
        }
        if (iterable instanceof Map) {
            return iterable.size;
        }
        if (iterable instanceof AbstractEnumerable) {
            return iterable.count();
        }
        return from(iterable).count();
    }

    abstract [Symbol.iterator](): Iterator<TElement>;
}
