import {AbstractImmutableCollection, contains, SortedSet} from "../../imports";
import {Comparators} from "../shared/Comparators";
import {OrderComparator} from "../shared/OrderComparator";
import {Predicate} from "../shared/Predicate";

export class ImmutableSortedSet<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #set: SortedSet<TElement>;

    private constructor(iterable: Iterable<TElement> = [] as TElement[],
                        comparator: OrderComparator<TElement> = Comparators.orderComparator) {
        super((e1, e2) => comparator(e1, e2) === 0);
        this.#set = new SortedSet(iterable, comparator);
        this.#comparator = comparator;
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#set;
    }

    public static create<TElement>(iterable?: Iterable<TElement>,
                                   comparator?: OrderComparator<TElement>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(iterable, comparator);
    }

    public add(element: TElement): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.append(element), this.#comparator);
    }

    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet([...this.#set, ...collection], this.#comparator);
    }

    public clear(): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet<TElement>([], this.#comparator);
    }

    public override contains(element: TElement): boolean {
        return this.#set.contains(element);
    }

    public override count(predicate?: Predicate<TElement>): number {
        return this.#set.count(predicate);
    }

    public exceptWith(other: Iterable<TElement>) {
        const set = this.#set.toEnumerableSet();
        set.exceptWith(other);
        return new ImmutableSortedSet(set, this.#comparator);
    }

    public headSet(toElement: TElement, inclusive: boolean = false): ImmutableSortedSet<TElement> {
        const headSet = this.#set.headSet(toElement, inclusive);
        return new ImmutableSortedSet(headSet, this.#comparator);
    }

    public intersectWith(other: Iterable<TElement>): ImmutableSortedSet<TElement> {
        const set = this.#set.toEnumerableSet();
        set.intersectWith(other);
        return new ImmutableSortedSet(set, this.#comparator);
    }

    public isProperSubsetOf(other: Iterable<TElement>): boolean {
        return this.#set.isProperSubsetOf(other);
    }

    public isProperSupersetOf(other: Iterable<TElement>): boolean {
        return this.#set.isProperSupersetOf(other);
    }

    public isSubsetOf(other: Iterable<TElement>): boolean {
        return this.#set.isSubsetOf(other);
    }

    public isSupersetOf(other: Iterable<TElement>): boolean {
        return this.#set.isSupersetOf(other);
    }

    public overlaps(other: Iterable<TElement>): boolean {
        return this.#set.overlaps(other);
    }

    public remove(element: TElement): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.where(e => e !== element), this.#comparator);
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.where(e => !contains(collection, e)), this.#comparator);
    }

    public removeIf(predicate: Predicate<TElement>): ImmutableSortedSet<TElement> {
        return new ImmutableSortedSet(this.#set.where(e => !predicate(e)), this.#comparator);
    }

    public retainAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSortedSet<TElement> {
        const set = this.#set.toEnumerableSet();
        set.retainAll(collection);
        return new ImmutableSortedSet(set, this.#comparator);
    }

    public size(): number {
        return this.#set.size();
    }

    public subSet(fromElement: TElement, toElement: TElement, fromInclusive: boolean = false, toInclusive: boolean = false): ImmutableSortedSet<TElement> {
        const subSet = this.#set.subSet(fromElement, toElement, fromInclusive, toInclusive);
        return new ImmutableSortedSet(subSet, this.#comparator);
    }

    public tailSet(fromElement: TElement, inclusive: boolean = false): ImmutableSortedSet<TElement> {
        const tailSet = this.#set.tailSet(fromElement, inclusive);
        return new ImmutableSortedSet(tailSet, this.#comparator);
    }

    public override get length(): number {
        return this.#set.length;
    }
}