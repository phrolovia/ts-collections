import { AbstractSet } from "./AbstractSet";
import { RedBlackTree } from "../tree/RedBlackTree";
import { Comparators } from "../shared/Comparators";
import type { EqualityComparator } from "../shared/EqualityComparator";
import type { OrderComparator } from "../shared/OrderComparator";
import { NoElementsException } from "../shared/NoElementsException";
import type { Predicate, TypePredicate } from "../shared/Predicate";
import type { ISet } from "./ISet";

export class SortedSet<TElement> extends AbstractSet<TElement> implements ISet<TElement> {
    readonly #orderComparator: OrderComparator<TElement>;
    readonly #tree: RedBlackTree<TElement>;

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator: OrderComparator<TElement> = Comparators.orderComparator
    ) {
        super((e1, e2) => comparator(e1, e2) === 0);
        this.#orderComparator = comparator;
        this.#tree = new RedBlackTree<TElement>(iterable, comparator);
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.#tree[Symbol.iterator]();
    }

    public add(element: TElement): boolean {
        return this.#tree.add(element);
    }

    public clear(): void {
        this.#tree.clear();
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.#tree.contains(element, comparator);
    }

    public override first<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public override first(predicate?: Predicate<TElement>): TElement;
    public override first<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        if (!predicate) {
            if (this.isEmpty()) {
                throw new NoElementsException();
            }
            return this.#tree.getMinData() as TElement;
        }
        return super.first(predicate as Predicate<TElement>);
    }

    public override firstOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public override firstOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public override firstOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        if (!predicate) {
            return this.isEmpty() ? null : this.#tree.getMinData();
        }
        return super.firstOrDefault(predicate as Predicate<TElement>);
    }

    public headSet(toElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const head: TElement[] = [];
        for (const element of this.#tree) {
            const order = this.#orderComparator(element, toElement);
            if (order > 0 || (order === 0 && !inclusive)) {
                break;
            }
            head.push(element);
        }
        return new SortedSet(head, this.#orderComparator);
    }

    public override last<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered;
    public override last(predicate?: Predicate<TElement>): TElement;
    public override last<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered {
        if (!predicate) {
            if (this.isEmpty()) {
                throw new NoElementsException();
            }
            return this.#tree.getMaxData() as TElement;
        }
        return super.last(predicate as Predicate<TElement>);
    }

    public override lastOrDefault<TFiltered extends TElement>(predicate: TypePredicate<TElement, TFiltered>): TFiltered | null;
    public override lastOrDefault(predicate?: Predicate<TElement>): TElement | null;
    public override lastOrDefault<TFiltered extends TElement>(predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>): TElement | TFiltered | null {
        if (!predicate) {
            return this.isEmpty() ? null : this.#tree.getMaxData();
        }
        return super.lastOrDefault(predicate as Predicate<TElement>);
    }

    public remove(element: TElement): boolean {
        return this.#tree.remove(element);
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.#tree.removeAll(collection);
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        return this.#tree.removeIf(predicate);
    }

    public override retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.#tree.retainAll(collection);
    }

    public size(): number {
        return this.#tree.size();
    }

    public subSet(fromElement: TElement, toElement: TElement, fromInclusive: boolean = true, toInclusive: boolean = false): ISet<TElement> {
        const sub: TElement[] = [];
        for (const element of this.#tree.ascendingFrom(fromElement, fromInclusive)) {
            const order = this.#orderComparator(element, toElement);
            if (order > 0 || (order === 0 && !toInclusive)) {
                break;
            }
            sub.push(element);
        }
        return new SortedSet(sub, this.#orderComparator);
    }

    public tailSet(fromElement: TElement, inclusive: boolean = false): ISet<TElement> {
        return new SortedSet(this.#tree.ascendingFrom(fromElement, inclusive), this.#orderComparator);
    }

    public override get comparator(): OrderComparator<TElement> {
        return this.#orderComparator;
    }

    public override get length(): number {
        return this.#tree.length;
    }
}
