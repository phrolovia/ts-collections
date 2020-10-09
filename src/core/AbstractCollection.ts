import {ICollection} from "./ICollection";
import {IEnumerable} from "../enumerator/IEnumerable";
import {EnumerableStatic} from "../enumerator/EnumerableStatic";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {Predicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";
import {Accumulator} from "../shared/Accumulator";
import {List} from "../list/List";

export abstract class AbstractCollection<TElement> implements ICollection<TElement> {

    public addAll<TSource extends TElement>(collection: ICollection<TSource>): boolean {
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

    public concat(enumerable: IEnumerable<TElement>): IEnumerable<TElement> {
        return EnumerableStatic.concat(this, enumerable);
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return EnumerableStatic.contains(this, element, comparator);
    }

    public containsAll<TSource extends TElement>(collection: ICollection<TSource>, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        if (this.size() < collection.size()) {
            return false;
        }
        for (const element of collection) {
            let found = false;
            for (const thisElement of this) {
                found ||= comparator(element, thisElement);
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    public first(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.first(this, predicate);
    }

    public firstOrDefault(predicate?: Predicate<TElement>): TElement {
        return EnumerableStatic.firstOrDefault(this, predicate);
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public skip(count: number): IEnumerable<TElement> {
        return EnumerableStatic.skip(this, count);
    }

    public toArray(): TElement[] {
        return EnumerableStatic.toArray(this);
    }

    public toList(): List<TElement> {
        return EnumerableStatic.toList(this);
    }

    abstract [Symbol.iterator](): Iterator<TElement>;
    abstract add(element: TElement): boolean;
    abstract clear(): void;
    abstract remove(element: TElement, comparator?: EqualityComparator<TElement>): boolean;
    abstract removeAll<TSource extends TElement>(collection: ICollection<TElement>, comparator?: EqualityComparator<TElement>): boolean;
    abstract removeIf(predicate: Predicate<TElement>): boolean;
    abstract retainAll<TSource extends TElement>(collection: ICollection<TSource>, comparator?: EqualityComparator<TElement>): boolean;
    abstract size(): number;
}
