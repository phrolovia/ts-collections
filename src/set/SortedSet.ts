import {AbstractSet, ISet, ITree, RedBlackTree} from "../../imports";
import {Predicate} from "../shared/Predicate";
import {OrderComparator} from "../shared/OrderComparator";
import {Comparators} from "../shared/Comparators";
import {EqualityComparator} from "../shared/EqualityComparator";

export class SortedSet<TElement> extends AbstractSet<TElement> implements ISet<TElement> {
    private readonly orderComparator: OrderComparator<TElement>;
    private readonly tree: ITree<TElement>;

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator: OrderComparator<TElement> = Comparators.orderComparator
    ) {
        super((e1, e2) => comparator(e1, e2) === 0);
        this.orderComparator = comparator;
        this.tree = new RedBlackTree<TElement>(iterable, comparator);
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.tree;
    }

    public add(element: TElement): boolean {
        const result = this.tree.add(element);
        this.updateLength();
        return result;
    }

    public clear(): void {
        this.tree.clear();
        this.updateLength();
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.tree.contains(element, comparator);
    }

    public headSet(toElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.orderComparator(e, toElement) <= 0).skipLast(+!inclusive);
        return new SortedSet(enumerable, this.orderComparator);
    }

    public remove(element: TElement): boolean {
        const result = this.tree.remove(element);
        this.updateLength();
        return result;
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const result = this.tree.removeAll(collection);
        this.updateLength();
        return result;
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        const result = this.tree.removeIf(predicate);
        this.updateLength();
        return result;
    }

    public override retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const result = this.tree.retainAll(collection);
        this.updateLength();
        return result;
    }

    public size(): number {
        return this.tree.size();
    }

    public subSet(fromElement: TElement, toElement: TElement, fromInclusive: boolean = true, toInclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.orderComparator(e, fromElement) >= 0 && this.orderComparator(e, toElement) <= 0)
            .skip(+!fromInclusive).skipLast(+!toInclusive);
        return new SortedSet(enumerable, this.orderComparator);
    }

    public tailSet(fromElement: TElement, inclusive: boolean = false): ISet<TElement> {
        const enumerable = this.where(e => this.orderComparator(e, fromElement) >= 0).skip(+!inclusive);
        return new SortedSet(enumerable, this.orderComparator);
    }
}
