import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {Predicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {IndexedPredicate} from "../shared/IndexedPredicate";
import {IndexedSelector} from "../shared/IndexedSelector";
import {Zipper} from "../shared/Zipper";
import {JoinSelector} from "../shared/JoinSelector";
import {OrderComparator} from "../shared/OrderComparator";
import {Dictionary, ICollection, IEnumerable, IGrouping, IOrderedEnumerable, List} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";
import {EnumerableStatic} from "../enumerator/EnumerableStatic";

export abstract class AbstractCollection<TElement> implements ICollection<TElement> {
    protected readonly comparator: EqualityComparator<TElement>;

    protected constructor(comparator?: EqualityComparator<TElement>) {
        this.comparator = comparator ?? Comparators.equalityComparator;
    }

    public addAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean {
        const oldSize = this.size();
        for (const element of collection) {
            this.add(element);
        }
        return this.size() !== oldSize;
    }

    public aggregate<TAccumulate, TResult = TAccumulate>(accumulator: Accumulator<TElement, TAccumulate>, seed?: TAccumulate, resultSelector?: Selector<TAccumulate, TResult>): TAccumulate | TResult {
        return EnumerableStatic.aggregate(this, accumulator, seed, resultSelector);
    }

    public all(predicate?: Predicate<TElement>): boolean {
        return EnumerableStatic.all(this, predicate);
    }

    public any(predicate?: Predicate<TElement>): boolean {
        return EnumerableStatic.any(this, predicate);
    }

    public append(item: TElement): IEnumerable<TElement> {
        return EnumerableStatic.append(this, item);
    }

    public average(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.average(this, selector);
    }

    public concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.concat(this, enumerable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparator;
        return EnumerableStatic.contains(this, element, comparator);
    }

    public containsAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean {
        const size = collection instanceof Array ? collection.length : collection.size();
        if (this.size() < size) {
            return false;
        }
        for (const element of collection) {
            let found = false;
            for (const thisElement of this) {
                found ||= this.comparator(element, thisElement);
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    public count(predicate?: Predicate<TElement>): number {
        return EnumerableStatic.count(this, predicate);
    }

    public defaultIfEmpty(value?: TElement): IEnumerable<TElement> {
        return EnumerableStatic.defaultIfEmpty(this, value);
    }

    public distinct(comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparator;
        return EnumerableStatic.distinct(this, comparator);
    }

    public elementAt(index: number): TElement {
        return EnumerableStatic.elementAt(this, index);
    }

    public elementAtOrDefault(index: number): TElement {
        return EnumerableStatic.elementAtOrDefault(this, index);
    }

    public except(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparator;
        return EnumerableStatic.except(this, enumerable, comparator);
    }

    public first(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.first(this, predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.firstOrDefault(this, predicate);
    }

    public forEach(action: IndexedAction<TElement>) {
        let index: number = 0;
        for (const element of this) {
            action(element, index++);
        }
    }

    public groupBy<TKey>(keySelector: Selector<TElement, TKey>, keyComparator?: EqualityComparator<TKey>): IEnumerable<IGrouping<TKey, TElement>> {
        return EnumerableStatic.groupBy(this, keySelector, keyComparator);
    }

    public groupJoin<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TKey, IEnumerable<TInner>, TResult>, keyComparator?: EqualityComparator<TKey>): IEnumerable<TResult> {
        return EnumerableStatic.groupJoin(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator);
    }

    public intersect(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparator;
        return EnumerableStatic.intersect(this, enumerable, comparator);
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public join<TInner, TKey, TResult>(innerEnumerable: IEnumerable<TInner>, outerKeySelector: Selector<TElement, TKey>, innerKeySelector: Selector<TInner, TKey>, resultSelector: JoinSelector<TElement, TInner, TResult>, keyComparator?: EqualityComparator<TKey>, leftJoin?: boolean): IEnumerable<TResult> {
        return EnumerableStatic.join(this, innerEnumerable, outerKeySelector, innerKeySelector, resultSelector, keyComparator, leftJoin);
    }

    public last(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.last(this, predicate);
    }

    public lastOrDefault(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.lastOrDefault(this, predicate);
    }

    public max(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.max(this, selector);
    }

    public min(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.min(this, selector);
    }

    public orderBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return EnumerableStatic.orderBy(this, keySelector, comparator);
    }

    public orderByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement> {
        return EnumerableStatic.orderByDescending(this, keySelector, comparator);
    }

    public prepend(item: TElement): IEnumerable<TElement> {
        return EnumerableStatic.prepend(this, item);
    }

    public reverse(): IEnumerable<TElement> {
        return EnumerableStatic.reverse(this);
    }

    public select<TResult>(selector: Selector<TElement, TResult>): IEnumerable<TResult> {
        return EnumerableStatic.select(this, selector);
    }

    public selectMany<TResult>(selector: IndexedSelector<TElement, Iterable<TResult>>): IEnumerable<TResult> {
        return EnumerableStatic.selectMany(this, selector);
    }

    public sequenceEqual(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparator;
        return EnumerableStatic.sequenceEqual(this, enumerable, comparator);
    }

    public single(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.single(this, predicate);
    }

    public singleOrDefault(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.singleOrDefault(this, predicate);
    }

    public skip(count: number): IEnumerable<TElement> {
        return EnumerableStatic.skip(this, count);
    }

    public skipLast(count: number): IEnumerable<TElement> {
        return EnumerableStatic.skipLast(this, count);
    }

    public skipWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.skipWhile(this, predicate);
    }

    public sum(selector?: Selector<TElement, number>): number {
        return EnumerableStatic.sum(this, selector);
    }

    public take(count: number): IEnumerable<TElement> {
        return EnumerableStatic.take(this, count);
    }

    public takeLast(count: number): IEnumerable<TElement> {
        return EnumerableStatic.takeLast(this, count);
    }

    public takeWhile(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.takeWhile(this, predicate);
    }

    public toArray(): TElement[] {
        return EnumerableStatic.toArray(this);
    }

    public toDictionary<TKey, TValue>(keySelector?: Selector<TElement, TKey>, valueSelector?: Selector<TElement, TValue>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): Dictionary<TKey, TValue> {
        return EnumerableStatic.toDictionary(this, keySelector, valueSelector, keyComparator, valueComparator);
    }

    public toList(comparator?: EqualityComparator<TElement>): List<TElement> {
        comparator ??= this.comparator;
        return EnumerableStatic.toList(this, comparator);
    }

    public union(enumerable: IEnumerable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> {
        comparator ??= this.comparator;
        return EnumerableStatic.union(this, enumerable, comparator);
    }

    public where(predicate: IndexedPredicate<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.where(this, predicate);
    }

    public zip<TSecond, TResult = [TElement, TSecond]>(enumerable: IEnumerable<TSecond>, zipper?: Zipper<TElement, TSecond, TResult>): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> {
        return EnumerableStatic.zip(this, enumerable, zipper);
    }

    abstract [Symbol.iterator](): Iterator<TElement>;

    abstract add(element: TElement): boolean;

    abstract clear(): void;

    abstract remove(element: TElement): boolean;

    abstract removeAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;

    abstract removeIf(predicate: Predicate<TElement>): boolean;

    abstract retainAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;

    abstract size(): number;
}
