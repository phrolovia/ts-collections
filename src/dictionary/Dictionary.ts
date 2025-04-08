import { EnumerableSet, ICollection, ISet, List, select } from "../imports";
import { Comparators } from "../shared/Comparators";
import { EqualityComparator } from "../shared/EqualityComparator";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { KeyNotFoundException } from "../shared/KeyNotFoundException";
import { AbstractDictionary } from "./AbstractDictionary";
import { KeyValuePair } from "./KeyValuePair";

export class Dictionary<TKey, TValue> extends AbstractDictionary<TKey, TValue> {
    readonly #dictionary: Map<TKey, KeyValuePair<TKey, TValue>> = new Map<TKey, KeyValuePair<TKey, TValue>>();
    readonly #keyComparator: EqualityComparator<TKey> = Comparators.equalityComparator;

    public constructor();
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>>, valueComparator?: EqualityComparator<TValue>);
    public constructor(iterable: Iterable<[TKey, TValue]>, valueComparator?: EqualityComparator<TValue>);
    public constructor(iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]>, valueComparator?: EqualityComparator<TValue>);
    public constructor(
        iterable: Iterable<KeyValuePair<TKey, TValue>> | Iterable<[TKey, TValue]> = [] as Array<KeyValuePair<TKey, TValue>>,
        valueComparator?: EqualityComparator<TValue>
    ) {
        super(
            valueComparator ?? Comparators.equalityComparator,
            (p1: KeyValuePair<TKey, TValue>, p2: KeyValuePair<TKey, TValue>) => this.#keyComparator(p1.key, p2.key) && (valueComparator ?? Comparators.equalityComparator)(p1.value, p2.value)
        );
        for (const pair of iterable) {
            if (pair instanceof KeyValuePair) {
                this.add(pair.key, pair.value);
            } else {
                this.add(pair[0], pair[1]);
            }
        }
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        for (const element of this.#dictionary) {
            yield element[1];
        }
    }

    public add(key: TKey, value: TValue): TValue {
        if (this.containsKey(key)) {
            throw new InvalidArgumentException(`Key already exists: ${key}`);
        }
        this.#dictionary.set(key, new KeyValuePair(key, value));
        return value;
    }

    public clear(): void {
        this.#dictionary.clear();
    }

    public override containsKey(key: TKey): boolean {
        return this.#dictionary.has(key);
    }

    public override containsValue(value: TValue, comparator: EqualityComparator<TValue> = Comparators.equalityComparator): boolean {
        for (const pair of this.#dictionary) {
            if (comparator(pair[1].value, value)) {
                return true;
            }
        }
        return false;
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        for (const item of this.#dictionary) {
            yield [item[0], item[1].value];
        }
    }

    public get(key: TKey): TValue | null {
        const pair = this.#dictionary.get(key);
        if (pair) {
            return pair.value;
        }
        return null;
    }

    public keys(): ISet<TKey> {
        return new EnumerableSet<TKey>(this.#dictionary.keys());
    }

    public remove(key: TKey): TValue | null {
        if (this.containsKey(key)) {
            const oldValue = this.get(key);
            this.#dictionary.delete(key);
            return oldValue;
        }
        return null;
    }

    public set(key: TKey, value: TValue): void {
        const oldValue = this.get(key);
        if (oldValue === null) {
            throw new KeyNotFoundException(String(key));
        }
        this.#dictionary.set(key, new KeyValuePair(key, value));
    }

    public size(): number {
        return this.#dictionary.size;
    }

    public values(): ICollection<TValue> {
        return new List<TValue>(select(this.#dictionary.values(), x => x.value));
    }

    public override get length(): number {
        return this.#dictionary.size;
    }
}
