import {AbstractEnumerable, contains, IReadonlyList, List, ReadonlyList} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {ErrorMessages} from "../shared/ErrorMessages";
import {OrderComparator} from "../shared/OrderComparator";
import {Predicate} from "../shared/Predicate";
import {Selector} from "../shared/Selector";

export class ImmutableList<TElement> extends AbstractEnumerable<TElement> implements IReadonlyList<TElement> {
    readonly #data: ReadonlyList<TElement>;
    private constructor(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#data = new ReadonlyList(new List(iterable, comparator));
    }

    *[Symbol.iterator](): Iterator<TElement> {
        yield* this.#data;
    }

    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableList<TElement> {
        return new ImmutableList(iterable, comparator);
    }

    public add(element: TElement): ImmutableList<TElement> {
        return new ImmutableList([...this.#data, element], this.comparer);
    }

    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        return new ImmutableList([...this.#data, ...collection], this.comparer);
    }

    public override any(predicate?: Predicate<TElement>): boolean {
        return this.#data.any(predicate);
    }

    public clear(): ImmutableList<TElement> {
        return new ImmutableList([], this.comparer);
    }

    public containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.#data.containsAll(collection);
    }

    public override count(predicate?: Predicate<TElement>): number {
        return this.#data.count(predicate);
    }

    public override elementAt(index: number): TElement {
        return this.#data.elementAt(index);
    }

    public override elementAtOrDefault(index: number): TElement | null {
        return this.#data.elementAtOrDefault(index);
    }

    public* entries(): IterableIterator<[number, TElement]> {
        yield* this.#data.entries();
    }

    public override first(predicate?: Predicate<TElement>): TElement {
        return this.#data.first(predicate);
    }

    public override firstOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return this.#data.firstOrDefault(predicate);
    }

    public get(index: number): TElement {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return this.#data.get(index);
    }

    public getRange(index: number, count: number): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return new ImmutableList(this.#data.getRange(index, count), this.comparer);
    }

    public indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        return this.#data.indexOf(element, comparator);
    }

    public isEmpty(): boolean {
        return this.#data.isEmpty();
    }

    public override last(predicate?: Predicate<TElement>): TElement {
        return this.#data.last(predicate);
    }

    public lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number {
        return this.#data.lastIndexOf(element, comparator);
    }

    public override lastOrDefault(predicate?: Predicate<TElement>): TElement | null {
        return this.#data.lastOrDefault(predicate);
    }

    public remove(element: TElement): ImmutableList<TElement> {
        return new ImmutableList(this.#data.where(e => !this.comparer(element, e)), this.comparer);
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableList<TElement> {
        return new ImmutableList(this.#data.where(e => !contains(collection, e, this.comparer)), this.comparer);
    }

    public removeAt(index: number): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return new ImmutableList(this.#data.where((_, i) => i !== index), this.comparer);
    }

    public removeIf(predicate: Predicate<TElement>): ImmutableList<TElement> {
        return new ImmutableList(this.#data.where(e => !predicate(e)), this.comparer);
    }

    public set(index: number, element: TElement): ImmutableList<TElement> {
        if (index < 0 || index >= this.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        return new ImmutableList(this.#data.select((e, i) => i === index ? element : e), this.comparer);
    }

    public size(): number {
        return this.#data.size();
    }

    public sort(comparator?: OrderComparator<TElement>): ImmutableList<TElement> {
        return new ImmutableList(this.#data.toArray().sort(comparator), this.comparer);
    }

    public override toString(): string;
    public override toString(separator?: string): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string {
        if (this.isEmpty()) {
            return "";
        }
        separator ??= ", ";
        selector ??= (e: TElement) => String(e);
        return this.select(selector).aggregate((a, b) => `${a}${separator}${b}`);
    }

    public get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public get length(): number {
        return this.#data.length;
    }
}