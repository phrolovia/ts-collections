import { SortedDictionary } from "./SortedDictionary";
import type { EqualityComparator } from "../shared/EqualityComparator";
import type { OrderComparator } from "../shared/OrderComparator";
import { AbstractImmutableDictionary } from "./AbstractImmutableDictionary";
import type { KeyValuePair } from "./KeyValuePair";
import type { ISet } from "../set/ISet";
import { registerImmutableSortedDictionaryFactory } from "../enumerator/Enumerator";
import type { IImmutableCollection } from "../core/IImmutableCollection";

export class ImmutableSortedDictionary<TKey, TValue> extends AbstractImmutableDictionary<TKey, TValue> {
    readonly #dictionary: SortedDictionary<TKey, TValue>;

    private constructor(dictionary: SortedDictionary<TKey, TValue>) {
        super(dictionary.valueComparator, dictionary.keyValueComparator);
        this.#dictionary = dictionary;
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
        return new ImmutableSortedDictionary(new SortedDictionary(iterable, keyComparator, valueComparator));
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        yield* this.#dictionary;
    }

    public add(key: TKey, value: TValue): ImmutableSortedDictionary<TKey, TValue> {
        const dictionary = this.getCopiedDictionary();
        dictionary.add(key, value);
        return new ImmutableSortedDictionary(dictionary);
    }

    public override clear(): ImmutableSortedDictionary<TKey, TValue> {
        return new ImmutableSortedDictionary(new SortedDictionary([], this.#dictionary.keyComparator, this.valueComparator));
    }

    public containsKey(key: TKey): boolean {
        return this.#dictionary.containsKey(key);
    }

    public containsValue(value: TValue, comparator?: EqualityComparator<TValue>): boolean {
        return this.#dictionary.containsValue(value, comparator);
    }

    public* entries(): IterableIterator<[TKey, TValue]> {
        yield* this.#dictionary.entries();
    }

    public get(key: TKey): TValue | null {
        return this.#dictionary.get(key);
    }

    public keys(): ISet<TKey> {
        return this.#dictionary.keys();
    }

    public put(key: TKey, value: TValue): ImmutableSortedDictionary<TKey, TValue> {
        const dictionary = this.getCopiedDictionary();
        dictionary.put(key, value);
        return new ImmutableSortedDictionary(dictionary);
    }

    public remove(key: TKey): ImmutableSortedDictionary<TKey, TValue> {
        const dictionary = this.getCopiedDictionary();
        dictionary.remove(key);
        return new ImmutableSortedDictionary(dictionary);
    }

    public set(key: TKey, value: TValue): ImmutableSortedDictionary<TKey, TValue> {
        const dictionary = this.getCopiedDictionary();
        dictionary.set(key, value);
        return new ImmutableSortedDictionary(dictionary);
    }

    public size(): number {
        return this.#dictionary.size();
    }

    public values(): IImmutableCollection<TValue> {
        return this.#dictionary.values();
    }

    private getCopiedDictionary(): SortedDictionary<TKey, TValue> {
        return this.#dictionary.toSortedDictionary(p => p.key, p => p.value, this.#dictionary.keyComparator, this.valueComparator);
    }

    public override get length(): number {
        return this.#dictionary.length;
    }
}

registerImmutableSortedDictionaryFactory(<TKey, TValue>(dictionary: SortedDictionary<TKey, TValue>): ImmutableSortedDictionary<TKey, TValue> => {
    return ImmutableSortedDictionary.create(dictionary, dictionary.keyComparator, dictionary.valueComparator);
});
