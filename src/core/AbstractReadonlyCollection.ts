import {IReadonlyCollection} from "./IReadonlyCollection";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Selector} from "../shared/Selector";
import {Writable} from "../shared/Writable";
import {AbstractEnumerable} from "../enumerator/AbstractEnumerable";
import {Predicate} from "../shared/Predicate";

export abstract class AbstractReadonlyCollection<TElement> extends AbstractEnumerable<TElement> implements IReadonlyCollection<TElement> {
    protected readonly collectionLength: number = 0;

    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    public override any(predicate?: Predicate<TElement>): boolean {
        if (!predicate) {
            return !this.isEmpty();
        }
        return super.any(predicate);
    }

    public containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        for (const element of collection) {
            let found = false;
            for (const thisElement of this) {
                found ||= this.comparer(element, thisElement);
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    public override count(predicate?: Predicate<TElement>): number {
        if (!predicate) {
            return this.size();
        }
        return super.count(predicate);
    }

    public isEmpty(): boolean {
        return this.size() === 0;
    }

    public override toString(): string;
    public override toString(separator?: string): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string;
    public override toString(separator?: string, selector?: Selector<TElement, string>): string {
        if (this.isEmpty()) {
            return "";
        }
        separator ??= ", ";
        selector ??= (e: TElement) => e.toString();
        return this.select(selector).toArray().join(separator);
    }

    protected updateLength(): void {
        (this.collectionLength as Writable<number>) = this.size();
    }

    public get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public get length(): number {
        return this.collectionLength;
    }

    abstract [Symbol.iterator](): Iterator<TElement>;
    abstract size(): number;
}