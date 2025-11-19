import { AbstractSet } from "./AbstractSet";
import { RedBlackTree } from "../tree/RedBlackTree";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { OrderComparator } from "../shared/OrderComparator";
import { Predicate } from "../shared/Predicate";
import { ISet } from "./ISet";
import { ITree } from "../tree/ITree";

export class SortedSet<TElement> extends AbstractSet<TElement> implements ISet<TElement> {
    readonly #orderComparator: OrderComparator<TElement>;
    readonly #tree: ITree<TElement>;

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator: OrderComparator<TElement> = Comparators.orderComparator
    ) {
        super((e1, e2) => comparator(e1, e2) === 0);
        this.#orderComparator = comparator;
        this.#tree = new RedBlackTree<TElement>(iterable, comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#tree;
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

    public headSet(toElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.#orderComparator(e, toElement) <= 0).skipLast(+!inclusive);
        return new SortedSet(enumerable, this.#orderComparator);
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
        const enumerable = this.where(e => this.#orderComparator(e, fromElement) >= 0 && this.#orderComparator(e, toElement) <= 0)
            .skip(+!fromInclusive).skipLast(+!toInclusive);
        return new SortedSet(enumerable, this.#orderComparator);
    }

    public tailSet(fromElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.#orderComparator(e, fromElement) >= 0).skip(+!inclusive);
        return new SortedSet(enumerable, this.#orderComparator);
    }

    public override get comparator(): OrderComparator<TElement> {
        return this.#orderComparator;
    }

    public override get length(): number {
        return this.#tree.length;
    }
}
