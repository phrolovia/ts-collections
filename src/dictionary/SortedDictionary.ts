import { RedBlackTree } from "../tree/RedBlackTree";
import { SortedSet } from "../set/SortedSet";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { KeyNotFoundException } from "../shared/KeyNotFoundException";
import { OrderComparator } from "../shared/OrderComparator";
import { AbstractDictionary } from "./AbstractDictionary";
import { KeyValuePair } from "./KeyValuePair";
import { ICollection } from "../core/ICollection";
import { ISet } from "../set/ISet";

export class SortedDictionary<TKey, TValue> extends AbstractDictionary<TKey, TValue> {
    readonly #keyComparer: OrderComparator<TKey>;
    readonly #keyValueTree: RedBlackTree<KeyValuePair<TKey, TValue>>;

    public constructor();
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>);
    public constructor(iterable: Iterable<[TKey, TValue]>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>);
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]>, keyComparator?: OrderComparator<TKey>, valueComparator?: EqualityComparator<TValue>);
    public constructor(
        iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]> = [] as Array<KeyValuePair<TKey, TValue>>,
        keyComparator?: OrderComparator<TKey>,
        valueComparator?: EqualityComparator<TValue>
    ) {
        super(
            valueComparator ?? Comparators.equalityComparator,
            (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => this.keyComparator(p1.key, p2.key) === 0
                && (valueComparator ?? Comparators.equalityComparator)(p1.value, p2.value)
        )
        this.#keyComparer = keyComparator ?? Comparators.orderComparator;
        const treeKeyComparator = (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => this.keyComparator(p1.key, p2.key);
        this.#keyValueTree = new RedBlackTree<KeyValuePair<TKey, TValue>>([], treeKeyComparator);
        for (const pair of iterable) {
            if (pair instanceof KeyValuePair) {
                this.add(pair.key, pair.value)
            } else {
                this.add(pair[0], pair[1]);
            }
        }
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        yield* this.#keyValueTree;
    }

    public add(key: TKey, value: TValue): TValue {
        if (this.containsKey(key)) {
            throw new InvalidArgumentException(`Key already exists: ${key}`);
        }
        this.#keyValueTree.insert(new KeyValuePair<TKey, TValue>(key, value));
        return value;
    }

    public clear(): void {
        this.#keyValueTree.clear();
    }


    public containsKey(key: TKey): boolean {
        return !!this.#keyValueTree.findBy(key, p => p.key, this.#keyComparer);
    }

    public containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean {
        comparator ??= this.valueComparer;
        for (const pair of this) {
            if (comparator(pair.value, value)) {
                return true;
            }
        }
        return false;
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        for (const pair of this) {
            yield [pair.key, pair.value];
        }
    }

    public get(key: TKey): TValue | null {
        return this.#keyValueTree.findBy(key, p => p.key, this.#keyComparer)?.value ?? null;
    }

    public keys(): ISet<TKey> {
        return new SortedSet<TKey>(this.#keyValueTree.toArray().map(p => p.key), this.#keyComparer);
    }

    public remove(key: TKey): TValue | null {
        return this.#keyValueTree.removeBy(key, p => p.key, this.#keyComparer)?.value ?? null;
    }

    public set(key: TKey, value: TValue): void {
        const pair = this.#keyValueTree.findBy(key, p => p.key, this.#keyComparer);
        if (pair == null) {
            throw new KeyNotFoundException(String(key));
        }
        pair.value = value;
    }

    public size(): number {
        return this.#keyValueTree.size();
    }

    public values(): ICollection<TValue> {
        return this.#keyValueTree.select(p => p.value).toList(this.valueComparer);
    }

    public get keyComparator(): OrderComparator<TKey> {
        return this.#keyComparer;
    }

    public override get length(): number {
        return this.#keyValueTree.length;
    }
}
