import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import type { EqualityComparator } from "../shared/EqualityComparator";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Predicate } from "../shared/Predicate";
import type { Selector } from "../shared/Selector";
import type { IReadonlyCollection } from "./IReadonlyCollection";

export abstract class AbstractReadonlyCollection<TElement> extends AbstractEnumerable<TElement> implements IReadonlyCollection<TElement> {
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
        selector ??= (e: TElement) => String(e);
        return this.select(selector).aggregate((a, b) => `${a}${separator}${b}`);
    }

    public get comparator(): EqualityComparator<TElement> | OrderComparator<TElement> {
        return this.comparer;
    }

    abstract size(): number;

    abstract get length(): number;
}
