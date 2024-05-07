import { Enumerable } from "../enumerator/Enumerable";
import { IEnumerable } from "../enumerator/IEnumerable";
import {
    Dictionary,
    EnumerableSet,
    Group,
    IGroup,
    ImmutableDictionary,
    ImmutableList,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    IOrderedEnumerable,
    LinkedList,
    List,
    RedBlackTree,
    SortedDictionary,
    SortedSet
} from "../imports.ts";
import { Accumulator } from "../shared/Accumulator";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { IndexedPredicate } from "../shared/IndexedPredicate";
import { IndexedSelector } from "../shared/IndexedSelector";
import { InferredType } from "../shared/InferredType";
import { JoinSelector } from "../shared/JoinSelector";
import { ObjectType } from "../shared/ObjectType";
import { OrderComparator } from "../shared/OrderComparator";
import { PairwiseSelector } from "../shared/PairwiseSelector";
import { Predicate } from "../shared/Predicate";
import { Selector } from "../shared/Selector";
import { Zipper } from "../shared/Zipper";
import { ILookup } from "./ILookup";

export class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {
    readonly #keyComparator: OrderComparator<TKey>;
    readonly #lookupTree: RedBlackTree<IGroup<TKey, TElement>>;

    private constructor(keyComparator: OrderComparator<TKey>) {
        this.#keyComparator = keyComparator;
        const lookupComparator = (g1: IGroup<TKey, TElement>, g2: IGroup<TKey, TElement>) => this.#keyComparator(g1.key, g2.key);
        this.#lookupTree = new RedBlackTree<IGroup<TKey, TElement>>([], lookupComparator);
    }

    public static create<TSource, TKey, TValue>(source: Iterable<TSource>, keySelector: Selector<TSource, TKey>,
                                                valueSelector: Selector<TSource, TValue>,
                                                keyComparator: OrderComparator<TKey> = Comparators.orderComparator): Lookup<TKey, TValue> {
        if (source == null) {
            throw new Error("source cannot be null.");
        }
        if (keySelector == null) {
            throw new Error("keySelector cannot be null.");
        }
        if (valueSelector == null) {
            throw new Error("valueSelector cannot be null.");
        }
        const lookup: Lookup<TKey, TValue> = new Lookup<TKey, TValue>(keyComparator);
        for (const element of source) {
            const group = lookup.#lookupTree.find(p => keyComparator(keySelector(element), p.key) === 0);
            if (group) {
                (group.source as List<TValue>).add(valueSelector(element));
            } else {
                lookup.#lookupTree.insert(new Group(keySelector(element), new List<TValue>([valueSelector(element)])));
            }
        }
        return lookup;
    }

    * [Symbol.iterator](): Iterator<IGroup<TKey, TElement>> {
        yield* this.#lookupTree;
    }

    public aggregate<TAccumulate = TElement, TResult = TAccumulate>(accumulator: Accumulator<IGroup<TKey, TElement>, TAccumulate>,
                                                                    seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return this.#lookupTree.aggregate(accumulator, seed, resultSelector);
    }

    public all(predicate: Predicate<IGroup<TKey, TElement>>): boolean {
        return this.#lookupTree.all(predicate);
    }

    public any(predicate?: Predicate<IGroup<TKey, TElement>>): boolean {
        return this.#lookupTree.any(predicate);
    }

    public append(element: IGroup<TKey, TElement>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.append(element);
    }

    public asEnumerable(): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.asEnumerable();
    }

    public average(selector?: Selector<IGroup<TKey, TElement>, number>): number {
        return this.#lookupTree.average(selector);
    }

    public cast<TResult>(): IEnumerable<TResult> {
        return this.#lookupTree.cast<TResult>();
    }

    public chunk(size: number): IEnumerable<IEnumerable<IGroup<TKey, TElement>>> {
        return this.#lookupTree.chunk(size);
    }

    public concat(enumerable: IEnumerable<IGroup<TKey, TElement>>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.concat(enumerable);
    }

    public contains(element: IGroup<TKey, TElement>, comparator?: EqualityComparator<IGroup<TKey, TElement>>): boolean {
        return this.#lookupTree.contains(element, comparator);
    }

    public count(predicate?: Predicate<IGroup<TKey, TElement>>): number {
        return this.#lookupTree.count(predicate);
    }

    public defaultIfEmpty(value?: IGroup<TKey, TElement>): IEnumerable<IGroup<TKey, TElement> | null> {
        return this.#lookupTree.defaultIfEmpty(value);
    }

    public distinct<TDistinctKey>(keySelector: Selector<IGroup<TKey, TElement>, TDistinctKey>, comparator?: EqualityComparator<TDistinctKey>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.distinct(keySelector, comparator);
    }

    public elementAt(index: number): IGroup<TKey, TElement> {
        return this.#lookupTree.elementAt(index);
    }

    public elementAtOrDefault(index: number): IGroup<TKey, TElement> | null {
        return this.#lookupTree.elementAtOrDefault(index);
    }

    public except(enumerable: IEnumerable<IGroup<TKey, TElement>>, comparator?: EqualityComparator<IGroup<TKey, TElement>> | null, orderComparator?: OrderComparator<IGroup<TKey, TElement>> | null): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.except(enumerable, comparator, orderComparator);
    }

    public first(predicate?: Predicate<IGroup<TKey, TElement>>): IGroup<TKey, TElement> {
        return this.#lookupTree.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<IGroup<TKey, TElement>>): IGroup<TKey, TElement> | null {
        return this.#lookupTree.firstOrDefault(predicate);
    }

    public forEach(action: IndexedAction<IGroup<TKey, TElement>>): void {
        this.#lookupTree.forEach(action);
    }

    public get(key: TKey): IEnumerable<TElement> {
        const value = this.#lookupTree.findBy(key, g => g.key, this.#keyComparator);
        return value ?? Enumerable.empty<TElement>();
    }

    public groupBy<TGroupKey>(keySelector: Selector<IGroup<TKey, TElement>, TGroupKey>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<IGroup<TGroupKey, IGroup<TKey, TElement>>> {
        return this.#lookupTree.groupBy(keySelector, keyComparator);
    }

    public groupJoin<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<IGroup<TKey, TElement>, TGroupKey>,
                                                 innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<IGroup<TKey, TElement>, IEnumerable<TInner>, TResult>,
                                                 keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<TResult> {
        return this.#lookupTree.groupJoin(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public hasKey(key: TKey): boolean {
        return !!this.#lookupTree.findBy(key, g => g.key, this.#keyComparator);
    }

    public intersect(enumerable: IEnumerable<IGroup<TKey, TElement>>, comparator?: EqualityComparator<IGroup<TKey, TElement>> | null, orderComparator?: OrderComparator<IGroup<TKey, TElement>> | null): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.intersect(enumerable, comparator, orderComparator);
    }

    public join<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<IGroup<TKey, TElement>, TGroupKey>,
                                            innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<IGroup<TKey, TElement>, TInner, TResult>,
                                            keyComparator?: EqualityComparator<TGroupKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return this.#lookupTree.join(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<IGroup<TKey, TElement>>): IGroup<TKey, TElement> {
        return this.#lookupTree.last(predicate);
    }

    public lastOrDefault(predicate?: Predicate<IGroup<TKey, TElement>>): IGroup<TKey, TElement> | null {
        return this.#lookupTree.lastOrDefault(predicate);
    }

    public max(selector?: Selector<IGroup<TKey, TElement>, number>): number {
        return this.#lookupTree.max(selector);
    }

    public min(selector?: Selector<IGroup<TKey, TElement>, number>): number {
        return this.#lookupTree.min(selector);
    }

    public ofType<TResult extends ObjectType>(type: TResult): IEnumerable<InferredType<TResult>> {
        return this.#lookupTree.ofType<TResult>(type);
    }

    public orderBy<TOrderKey>(keySelector: Selector<IGroup<TKey, TElement>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.orderBy(keySelector, comparator);
    }

    public orderByDescending<TOrderKey>(keySelector: Selector<IGroup<TKey, TElement>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.orderByDescending(keySelector, comparator);
    }

    public pairwise(resultSelector: PairwiseSelector<IGroup<TKey, TElement>, IGroup<TKey, TElement>>): IEnumerable<[IGroup<TKey, TElement>, IGroup<TKey, TElement>]> {
        return this.#lookupTree.pairwise(resultSelector);
    }

    public partition(predicate: Predicate<IGroup<TKey, TElement>>): [IEnumerable<IGroup<TKey, TElement>>, IEnumerable<IGroup<TKey, TElement>>] {
        return this.#lookupTree.partition(predicate);
    }

    public prepend(element: IGroup<TKey, TElement>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.prepend(element);
    }

    public reverse(): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.reverse();
    }

    public scan<TAccumulate = IGroup<TKey, TElement>>(accumulator: Accumulator<IGroup<TKey, TElement>, TAccumulate>, seed?: TAccumulate): IEnumerable<TAccumulate> {
        return this.#lookupTree.scan(accumulator, seed);
    }

    public select<TResult>(selector: IndexedSelector<IGroup<TKey, TElement>, TResult>): IEnumerable<TResult> {
        return this.#lookupTree.select(selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<IGroup<TKey, TElement>, Iterable<TResult>>): IEnumerable<TResult> {
        return this.#lookupTree.selectMany(selector);
    }

    public sequenceEqual(enumerable: IEnumerable<IGroup<TKey, TElement>>, comparator?: EqualityComparator<IGroup<TKey, TElement>>): boolean {
        return this.#lookupTree.sequenceEqual(enumerable, comparator);
    }

    public shuffle(): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.shuffle();
    }

    public single(predicate?: Predicate<IGroup<TKey, TElement>>): IGroup<TKey, TElement> {
        return this.#lookupTree.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<IGroup<TKey, TElement>>): IGroup<TKey, TElement> | null {
        return this.#lookupTree.singleOrDefault(predicate);
    }

    public size(): number {
        return this.#lookupTree.size();
    }

    public skip(count: number): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.skip(count);
    }

    public skipLast(count: number): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<IGroup<TKey, TElement>>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.skipWhile(predicate);
    }

    public sum(selector?: Selector<IGroup<TKey, TElement>, number>): number {
        return this.#lookupTree.sum(selector);
    }

    public take(count: number): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.take(count);
    }

    public takeLast(count: number): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.takeLast(count);
    }

    public takeWhile(predicate: IndexedPredicate<IGroup<TKey, TElement>>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.takeWhile(predicate);
    }

    public toArray(): IGroup<TKey, TElement>[] {
        return this.#lookupTree.toArray();
    }

    public toDictionary<TDictKey, TDictValue>(keySelector: Selector<IGroup<TKey, TElement>, TDictKey>, valueSelector: Selector<IGroup<TKey, TElement>, TDictValue>,
                                              valueComparator?: EqualityComparator<TDictValue>): Dictionary<TDictKey, TDictValue> {
        return this.#lookupTree.toDictionary(keySelector, valueSelector, valueComparator);
    }

    public toEnumerableSet(): EnumerableSet<IGroup<TKey, TElement>> {
        return this.#lookupTree.toEnumerableSet();
    }

    public toImmutableDictionary<TDictKey, TDictValue>(keySelector: Selector<IGroup<TKey, TElement>, TDictKey>, valueSelector: Selector<IGroup<TKey, TElement>, TDictValue>, valueComparator?: EqualityComparator<TDictValue>): ImmutableDictionary<TDictKey, TDictValue> {
        return this.#lookupTree.toImmutableDictionary(keySelector, valueSelector, valueComparator);
    }

    public toImmutableList(comparator?: EqualityComparator<IGroup<TKey, TElement>>): ImmutableList<IGroup<TKey, TElement>> {
        return this.#lookupTree.toImmutableList(comparator);
    }

    public toImmutableSet(): ImmutableSet<IGroup<TKey, TElement>> {
        return this.#lookupTree.toImmutableSet();
    }

    public toImmutableSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<IGroup<TKey, TElement>, TDictKey>, valueSelector: Selector<IGroup<TKey, TElement>, TDictValue>, keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): ImmutableSortedDictionary<TDictKey, TDictValue> {
        return this.#lookupTree.toImmutableSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toImmutableSortedSet(comparator?: OrderComparator<IGroup<TKey, TElement>>): ImmutableSortedSet<IGroup<TKey, TElement>> {
        return this.#lookupTree.toImmutableSortedSet(comparator);
    }

    public toLinkedList(comparator?: EqualityComparator<IGroup<TKey, TElement>>): LinkedList<IGroup<TKey, TElement>> {
        return this.#lookupTree.toLinkedList(comparator);
    }

    public toList(comparator?: EqualityComparator<IGroup<TKey, TElement>>): List<IGroup<TKey, TElement>> {
        return this.#lookupTree.toList(comparator);
    }

    public toLookup<TLookupKey, TLookupValue>(keySelector: Selector<IGroup<TKey, TElement>, TLookupKey>, valueSelector: Selector<IGroup<TKey, TElement>, TLookupValue>,
                                              keyComparator?: OrderComparator<TLookupKey>): ILookup<TLookupKey, TLookupValue> {
        return this.#lookupTree.toLookup(keySelector, valueSelector, keyComparator);
    }

    public toSortedDictionary<TDictKey, TDictValue>(keySelector: Selector<IGroup<TKey, TElement>, TDictKey>, valueSelector: Selector<IGroup<TKey, TElement>, TDictValue>,
                                                    keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): SortedDictionary<TDictKey, TDictValue> {
        return this.#lookupTree.toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toSortedSet(comparator?: OrderComparator<IGroup<TKey, TElement>>): SortedSet<IGroup<TKey, TElement>> {
        return this.#lookupTree.toSortedSet(comparator);
    }

    public union(enumerable: IEnumerable<IGroup<TKey, TElement>>, comparator?: EqualityComparator<IGroup<TKey, TElement>>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.union(enumerable, comparator);
    }

    public where(predicate: IndexedPredicate<IGroup<TKey, TElement>>): IEnumerable<IGroup<TKey, TElement>> {
        return this.#lookupTree.where(predicate);
    }

    public zip<TSecond, TResult = [IGroup<TKey, TElement>, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<IGroup<TKey, TElement>, TSecond, TResult>): IEnumerable<[IGroup<TKey, TElement>, TSecond]> | IEnumerable<TResult> {
        return this.#lookupTree.zip(enumerable, zipper);
    }

    public get length(): number {
        return this.#lookupTree.length;
    }
}
