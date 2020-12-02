import {IEnumerable} from "../enumerator/IEnumerable";
import {Enumerable, Grouping, IGrouping} from "../enumerator/Enumerable";
import {ILookup} from "./ILookup";
import {Accumulator} from "../shared/Accumulator";
import {JoinSelector} from "../shared/JoinSelector";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {IndexedSelector} from "../shared/IndexedSelector";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {Zipper} from "../shared/Zipper";
import {Selector} from "../shared/Selector";
import {Predicate} from "../shared/Predicate";
import {Dictionary, IOrderedEnumerable, List, RedBlackTree} from "../../imports";
import {Comparators} from "../shared/Comparators";

export class Lookup<TKey, TElement> implements ILookup<TKey, TElement> {
    private readonly keyComparator: OrderComparator<TKey>;
    private readonly lookupTree: RedBlackTree<IGrouping<TKey, TElement>>;

    private constructor(keyComparator?: OrderComparator<TKey>) {
        this.keyComparator = keyComparator;
        const lookupComparator = (g1: IGrouping<TKey, TElement>, g2: IGrouping<TKey, TElement>) => this.keyComparator(g1.key, g2.key);
        this.lookupTree = new RedBlackTree<IGrouping<TKey, TElement>>(lookupComparator);
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
            const group = lookup.lookupTree.find(p => keyComparator(keySelector(element), p.key) === 0);
            if (group) {
                (group.source as List<TValue>).add(valueSelector(element));
            } else {
                lookup.lookupTree.insert(new Grouping(keySelector(element), new List<TValue>([valueSelector(element)])));
            }
        }
        return lookup;
    }

    * [Symbol.iterator](): Iterator<IGrouping<TKey, TElement>> {
        yield* this.lookupTree;
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<IGrouping<TKey, TElement>, TAccumulate>,
                                                         seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return this.lookupTree.aggregate(accumulator, seed, resultSelector);
    }

    public all(predicate?: Predicate<IGrouping<TKey, TElement>>): boolean {
        return this.lookupTree.all(predicate);
    }

    public any(predicate?: Predicate<IGrouping<TKey, TElement>>): boolean {
        return this.lookupTree.any(predicate);
    }

    public append(element: IGrouping<TKey, TElement>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.append(element);
    }

    public average(selector?: Selector<IGrouping<TKey, TElement>, number>): number {
        return this.lookupTree.average(selector);
    }

    public concat(enumerable: IEnumerable<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.concat(enumerable);
    }

    public contains(element: IGrouping<TKey, TElement>, comparator?: EqualityComparator<IGrouping<TKey, TElement>>): boolean {
        return this.lookupTree.contains(element, comparator);
    }

    public count(predicate?: Predicate<IGrouping<TKey, TElement>>): number {
        return this.lookupTree.count(predicate);
    }

    public defaultIfEmpty(value?: IGrouping<TKey, TElement>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.defaultIfEmpty(value);
    }

    public distinct(comparator?: EqualityComparator<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.distinct(comparator);
    }

    public elementAt(index: number): IGrouping<TKey, TElement> {
        return this.lookupTree.elementAt(index);
    }

    public elementAtOrDefault(index: number): IGrouping<TKey, TElement> {
        return this.lookupTree.elementAtOrDefault(index);
    }

    public except(enumerable: IEnumerable<IGrouping<TKey, TElement>>, comparator?: EqualityComparator<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.except(enumerable, comparator);
    }

    public first(predicate?: Predicate<IGrouping<TKey, TElement>>): IGrouping<TKey, TElement> {
        return this.lookupTree.first(predicate);
    }

    public firstOrDefault(predicate?: Predicate<IGrouping<TKey, TElement>>): IGrouping<TKey, TElement> {
        return this.lookupTree.firstOrDefault(predicate);
    }

    public get(key: TKey): IEnumerable<TElement> {
        const value = this.lookupTree.findBy(key, g => g.key, this.keyComparator);
        return value ?? Enumerable.empty<TElement>();
    }

    public groupBy<TGroupKey>(keySelector: Selector<IGrouping<TKey, TElement>, TGroupKey>, keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<IGrouping<TGroupKey, IGrouping<TKey, TElement>>> {
        return this.lookupTree.groupBy(keySelector, keyComparator);
    }

    public groupJoin<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<IGrouping<TKey, TElement>, TGroupKey>,
                                                 innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<TGroupKey, IEnumerable<TInner>, TResult>,
                                                 keyComparator?: EqualityComparator<TGroupKey>): IEnumerable<TResult> {
        return this.lookupTree.groupJoin(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public hasKey(key: TKey): boolean {
        return !!this.lookupTree.findBy(key, g => g.key, this.keyComparator);
    }

    public intersect(enumerable: IEnumerable<IGrouping<TKey, TElement>>, comparator?: EqualityComparator<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.intersect(enumerable, comparator);
    }

    public join<TInner, TGroupKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<IGrouping<TKey, TElement>, TGroupKey>,
                                            innerKeySelector: Selector<TInner, TGroupKey>, resultSelector: JoinSelector<IGrouping<TKey, TElement>, TInner, TResult>,
                                            keyComparator?: EqualityComparator<TGroupKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return this.lookupTree.join(innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<IGrouping<TKey, TElement>>): IGrouping<TKey, TElement> {
        return this.lookupTree.last(predicate);
    }

    public lastOrDefault(predicate?: Predicate<IGrouping<TKey, TElement>>): IGrouping<TKey, TElement> {
        return this.lookupTree.lastOrDefault(predicate);
    }

    public max(selector?: Selector<IGrouping<TKey, TElement>, number>): number {
        return this.lookupTree.max(selector);
    }

    public min(selector?: Selector<IGrouping<TKey, TElement>, number>): number {
        return this.lookupTree.min(selector);
    }

    public orderBy<TOrderKey>(keySelector: Selector<IGrouping<TKey, TElement>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.orderBy(keySelector, comparator);
    }

    public orderByDescending<TOrderKey>(keySelector: Selector<IGrouping<TKey, TElement>, TOrderKey>, comparator?: OrderComparator<TOrderKey>): IOrderedEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.orderByDescending(keySelector, comparator);
    }

    public prepend(element: IGrouping<TKey, TElement>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.prepend(element);
    }

    public reverse(): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.reverse();
    }

    public select<TResult>(selector: Selector<IGrouping<TKey, TElement>, TResult>): IEnumerable<TResult> {
        return this.lookupTree.select(selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<IGrouping<TKey, TElement>, Iterable<TResult>>): IEnumerable<TResult> {
        return this.lookupTree.selectMany(selector);
    }

    public sequenceEqual(enumerable: IEnumerable<IGrouping<TKey, TElement>>, comparator?: EqualityComparator<IGrouping<TKey, TElement>>): boolean {
        return this.lookupTree.sequenceEqual(enumerable, comparator);
    }

    public single(predicate?: Predicate<IGrouping<TKey, TElement>>): IGrouping<TKey, TElement> {
        return this.lookupTree.single(predicate);
    }

    public singleOrDefault(predicate?: Predicate<IGrouping<TKey, TElement>>): IGrouping<TKey, TElement> {
        return this.lookupTree.singleOrDefault(predicate);
    }

    public size(): number {
        return this.lookupTree.size();
    }

    public skip(count: number): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.skip(count);
    }

    public skipLast(count: number): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.skipLast(count);
    }

    public skipWhile(predicate: IndexedPredicate<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.skipWhile(predicate);
    }

    public sum(selector?: Selector<IGrouping<TKey, TElement>, number>): number {
        return this.lookupTree.sum(selector);
    }

    public take(count: number): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.take(count);
    }

    public takeLast(count: number): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.takeLast(count);
    }

    public takeWhile(predicate: IndexedPredicate<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.takeWhile(predicate);
    }

    public toArray(): IGrouping<TKey, TElement>[] {
        return this.lookupTree.toArray();
    }

    public toDictionary<TDictKey, TDictValue>(keySelector?: Selector<IGrouping<TKey, TElement>, TDictKey>, valueSelector?: Selector<IGrouping<TKey, TElement>, TDictValue>,
                                              keyComparator?: OrderComparator<TDictKey>, valueComparator?: EqualityComparator<TDictValue>): Dictionary<TDictKey, TDictValue> {
        return this.lookupTree.toDictionary(keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toList(comparator?: EqualityComparator<IGrouping<TKey, TElement>>): List<IGrouping<TKey, TElement>> {
        return this.lookupTree.toList(comparator);
    }

    public toLookup<TLookupKey, TLookupValue>(keySelector: Selector<IGrouping<TKey, TElement>, TLookupKey>, valueSelector: Selector<IGrouping<TKey, TElement>, TLookupValue>,
                                              keyComparator?: OrderComparator<TLookupKey>): ILookup<TLookupKey, TLookupValue> {
        return this.lookupTree.toLookup(keySelector, valueSelector, keyComparator);
    }

    public union(enumerable: IEnumerable<IGrouping<TKey, TElement>>, comparator?: EqualityComparator<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.union(enumerable, comparator);
    }

    public where(predicate: IndexedPredicate<IGrouping<TKey, TElement>>): IEnumerable<IGrouping<TKey, TElement>> {
        return this.lookupTree.where(predicate);
    }

    public zip<TSecond, TResult = [IGrouping<TKey, TElement>, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<IGrouping<TKey, TElement>, TSecond, TResult>): IEnumerable<[IGrouping<TKey, TElement>, TSecond]> | IEnumerable<TResult> {
        return this.lookupTree.zip(enumerable, zipper);
    }

}
