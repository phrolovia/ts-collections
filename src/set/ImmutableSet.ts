import {AbstractEnumerable, EnumerableSet, contains, IEnumerable} from "../../imports";
import {Predicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";

export class ImmutableSet<TElement> extends AbstractEnumerable<TElement> {
    readonly #set: EnumerableSet<TElement>;
    private constructor(iterable?: Iterable<TElement>) {
        super();
        this.#set = new EnumerableSet(iterable);
    }

    *[Symbol.iterator](): Iterator<TElement> {
        yield* this.#set;
    }

    public static create<TElement>(iterable?: Iterable<TElement>): ImmutableSet<TElement> {
        return new ImmutableSet(iterable);
    }

    public add(element: TElement): ImmutableSet<TElement> {
        return new ImmutableSet([...this.#set, element]);
    }

    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet([...this.#set, ...collection]);
    }

    public clear(): ImmutableSet<TElement> {
        return new ImmutableSet<TElement>([]);
    }

    public override contains(element: TElement): boolean {
        return this.#set.contains(element);
    }

    public override count(predicate?: Predicate<TElement>): number {
        return this.#set.count(predicate);
    }

    public exceptWith<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => !contains(collection, x)));
    }

    public intersectWith<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => contains(collection, x)));
    }

    public isEmpty(): boolean {
        return this.#set.isEmpty();
    }

    public isProperSubsetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isProperSubsetOf(collection);
    }

    public isProperSupersetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isProperSupersetOf(collection);
    }

    public isSubsetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isSubsetOf(collection);
    }

    public isSupersetOf(collection: Iterable<TElement>): boolean {
        return this.#set.isSupersetOf(collection);
    }

    public overlaps(collection: Iterable<TElement>): boolean {
        return this.#set.overlaps(collection);
    }

    public remove(element: TElement): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => x !== element));
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => !contains(collection, x)));
    }

    public removeIf(predicate: Predicate<TElement>): ImmutableSet<TElement> {
        return new ImmutableSet(this.#set.where(x => !predicate(x)));
    }

    public size(): number {
        return this.#set.size();
    }

    public override toString(): string;
    public override toString(separator?: string): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string {
        return this.#set.toString(separator, selector);
    }

    public get length(): number {
        return this.#set.length;
    }
}