import { Enumerable } from "../enumerator/Enumerable";
import { IEnumerable } from "../enumerator/IEnumerable";
import { IGroup } from "../enumerator/IGroup";
import { AbstractEnumerable, Group, List, RedBlackTree } from "../imports";
import { Comparators } from "../shared/Comparators";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";
import { ILookup } from "./ILookup";

export class Lookup<TKey, TElement> extends AbstractEnumerable<IGroup<TKey, TElement>> implements ILookup<TKey, TElement> {
    readonly #keyComparator: OrderComparator<TKey>;
    readonly #lookupTree: RedBlackTree<IGroup<TKey, TElement>>;

    private constructor(keyComparator: OrderComparator<TKey>) {
        super(((e1: IGroup<TKey, TElement>, e2: IGroup<TKey, TElement>) =>
            Object.is(e1.key, e2.key) || (keyComparator ?? Comparators.orderComparator)(e1.key, e2.key) === 0)
        );
        this.#keyComparator = keyComparator;
        const lookupComparator = (g1: IGroup<TKey, TElement>, g2: IGroup<TKey, TElement>) => this.#keyComparator(g1.key, g2.key);
        this.#lookupTree = new RedBlackTree<IGroup<TKey, TElement>>([], lookupComparator);
    }

    public static create<TSource, TKey, TValue>(source: Iterable<TSource>, keySelector: Selector<TSource, TKey>,
                                                valueSelector: Selector<TSource, TValue>,
                                                keyComparator: OrderComparator<TKey> = Comparators.orderComparator): Lookup<TKey, TValue> {
        if (source == null) {
            throw new Error("source cannot be null.");
        }
        if (keySelector == null) {
            throw new Error("keySelector cannot be null.");
        }
        if (valueSelector == null) {
            throw new Error("valueSelector cannot be null.");
        }
        const lookup: Lookup<TKey, TValue> = new Lookup<TKey, TValue>(keyComparator);
        for (const element of source) {
            const group = lookup.#lookupTree.find(p => keyComparator(keySelector(element), p.key) === 0);
            if (group) {
                (group.source as List<TValue>).add(valueSelector(element));
            } else {
                lookup.#lookupTree.insert(new Group(keySelector(element), new List<TValue>([valueSelector(element)])));
            }
        }
        return lookup;
    }

    * [Symbol.iterator](): Iterator<IGroup<TKey, TElement>> {
        yield* this.#lookupTree;
    }

    public get(key: TKey): IEnumerable<TElement> {
        const value = this.#lookupTree.findBy(key, g => g.key, this.#keyComparator);
        return value ?? Enumerable.empty<TElement>();
    }


    public hasKey(key: TKey): boolean {
        return !!this.#lookupTree.findBy(key, g => g.key, this.#keyComparator);
    }

    public size(): number {
        return this.#lookupTree.size();
    }

    public get length(): number {
        return this.#lookupTree.length;
    }
}
