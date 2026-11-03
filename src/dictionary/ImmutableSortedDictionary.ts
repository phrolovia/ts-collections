import type { SortedDictionary } from "./SortedDictionary";
import type { EqualityComparator } from "../shared/EqualityComparator";
import type { OrderComparator } from "../shared/OrderComparator";
import { AbstractImmutableDictionary } from "./AbstractImmutableDictionary";
import { KeyValuePair } from "./KeyValuePair";
import type { ISet } from "../set/ISet";
import { SortedSet } from "../set/SortedSet";
import { registerImmutableSortedDictionaryFactory } from "../enumerator/Enumerator";
import type { IImmutableCollection } from "../core/IImmutableCollection";
import { Comparators } from "../shared/Comparators";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { KeyNotFoundException } from "../shared/KeyNotFoundException";
import { select } from "../enumerator/functions/select";
import { find, fromSorted, insert, lastChange, nodes, remove, type Tree } from "../shared/internal/SortedTree";

/**
 * Immutable sorted dictionary backed by a persistent weight-balanced tree.
 * `add`, `put`, `remove` and `set` copy only the O(log n) nodes on the path to the key and share
 * the rest with the original dictionary. Iteration follows the key order.
 */
export class ImmutableSortedDictionary<TKey, TValue> extends AbstractImmutableDictionary<TKey, TValue> {
    readonly #keyComparator: OrderComparator<TKey>;
    readonly #tree: Tree<TKey, TValue>;

    private constructor(tree: Tree<TKey, TValue>, keyComparator: OrderComparator<TKey>, valueComparator: EqualityComparator<TValue>) {
        super(
            valueComparator,
            (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => keyComparator(p1.key, p2.key) === 0 && valueComparator(p1.value, p2.value)
        );
        this.#tree = tree;
        this.#keyComparator = keyComparator;
    }

    public static create<TKey, TValue>(): ImmutableSortedDictionary<TKey, TValue>;
    public static create<TKey, TValue>(iterable: Iterable<KeyValuePair<TKey, TValue>>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;
    public static create<TKey, TValue>(iterable: Iterable<[TKey, TValue]>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;
    public static create<TKey, TValue>(iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>): ImmutableSortedDictionary<TKey, TValue>;
    public static create<TKey, TValue>(
        iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]> = [] as Array<KeyValuePair<TKey, TValue>>,
        keyComparator?: OrderComparator<TKey>,
        valueComparator?: EqualityComparator<TValue>
    ): ImmutableSortedDictionary<TKey, TValue> {
        const order = keyComparator ?? Comparators.orderComparator;
        const pairs: Array<[TKey, TValue]> = [];
        for (const pair of iterable) {
            pairs.push(pair instanceof KeyValuePair ? [pair.key, pair.value] : [pair[0], pair[1]]);
        }
        // A stable sort keeps duplicate keys adjacent, so a single pass finds them.
        pairs.sort((p1, p2) => order(p1[0], p2[0]));
        for (let index = 1; index < pairs.length; ++index) {
            if (order(pairs[index - 1][0], pairs[index][0]) === 0) {
                throw new InvalidArgumentException(`Key already exists: ${String(pairs[index][0])}`);
            }
        }
        const tree = fromSorted(pairs.map(p => p[0]), pairs.map(p => p[1]));
        return new ImmutableSortedDictionary(tree, order, valueComparator ?? Comparators.equalityComparator);
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        for (const node of nodes(this.#tree)) {
            yield new KeyValuePair(node.key, node.value);
        }
    }

    public add(key: TKey, value: TValue): ImmutableSortedDictionary<TKey, TValue> {
        const tree = insert(this.#tree, key, value, this.#keyComparator, false);
        if (lastChange.found !== null) {
            throw new InvalidArgumentException(`Key already exists: ${String(key)}`);
        }
        return this.#with(tree);
    }

    public override clear(): ImmutableSortedDictionary<TKey, TValue> {
        return this.#with(null);
    }

    public containsKey(key: TKey): boolean {
        return find(this.#tree, key, this.#keyComparator) !== null;
    }

    public containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean {
        comparator ??= this.valueComparator;
        for (const node of nodes(this.#tree)) {
            if (comparator(node.value, value)) {
                return true;
            }
        }
        return false;
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        for (const node of nodes(this.#tree)) {
            yield [node.key, node.value];
        }
    }

    public get(key: TKey): TValue | null {
        const node = find(this.#tree, key, this.#keyComparator);
        return node === null ? null : node.value;
    }

    public keys(): ISet<TKey> {
        return new SortedSet<TKey>(select(nodes(this.#tree), n => n.key), this.#keyComparator);
    }

    public put(key: TKey, value: TValue): ImmutableSortedDictionary<TKey, TValue> {
        return this.#with(insert(this.#tree, key, value, this.#keyComparator, true));
    }

    public remove(key: TKey): ImmutableSortedDictionary<TKey, TValue> {
        return this.#with(remove(this.#tree, key, this.#keyComparator));
    }

    public set(key: TKey, value: TValue): ImmutableSortedDictionary<TKey, TValue> {
        if (find(this.#tree, key, this.#keyComparator) === null) {
            throw new KeyNotFoundException(String(key));
        }
        return this.#with(insert(this.#tree, key, value, this.#keyComparator, true));
    }

    public size(): number {
        return this.#tree === null ? 0 : this.#tree.size;
    }

    public values(): IImmutableCollection<TValue> {
        return select(nodes(this.#tree), n => n.value).toImmutableList(this.valueComparator);
    }

    // Returns this dictionary when an operation left the tree unchanged.
    #with(tree: Tree<TKey, TValue>): ImmutableSortedDictionary<TKey, TValue> {
        return tree === this.#tree ? this : new ImmutableSortedDictionary(tree, this.#keyComparator, this.valueComparator);
    }

    public override get length(): number {
        return this.size();
    }
}

registerImmutableSortedDictionaryFactory(<TKey, TValue>(dictionary: SortedDictionary<TKey, TValue>): ImmutableSortedDictionary<TKey, TValue> => {
    return ImmutableSortedDictionary.create(dictionary, dictionary.keyComparator, dictionary.valueComparator);
});
