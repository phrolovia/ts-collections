import type { ISet } from "../set/ISet";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { AbstractReadonlyDictionary } from "./AbstractReadonlyDictionary";
import type { IDictionary } from "./IDictionary";
import type { KeyValuePair } from "./KeyValuePair";
import type { IImmutableCollection } from "../core/IImmutableCollection";

export class ReadonlyDictionary<TKey, TValue> extends AbstractReadonlyDictionary<TKey, TValue> {
    readonly #dictionary: IDictionary<TKey, TValue>;

    public constructor(dictionary: IDictionary<TKey, TValue>) {
        super(dictionary.valueComparator, dictionary.keyValueComparator);
        this.#dictionary = dictionary;
    }

    * [Symbol.iterator](): Iterator<KeyValuePair<TKey, TValue>> {
        yield* this.#dictionary;
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

    public override size(): number {
        return this.#dictionary.size();
    }

    public values(): IImmutableCollection<TValue> {
        return this.#dictionary.values();
    }

    public override get length(): number {
        return this.#dictionary.length;
    }
}
