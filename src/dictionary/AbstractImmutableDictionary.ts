import { EqualityComparator } from "../shared/EqualityComparator";
import { AbstractReadonlyDictionary } from "./AbstractReadonlyDictionary";
import { IImmutableDictionary } from "./IImmutableDictionary";
import { KeyValuePair } from "./KeyValuePair";

export abstract class AbstractImmutableDictionary<TKey, TValue> extends AbstractReadonlyDictionary<TKey, TValue> implements IImmutableDictionary<TKey, TValue> {
    protected constructor(valueComparator: EqualityComparator<TValue>, keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>) {
        super(valueComparator, keyValueComparator);
    }

    abstract add(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;

    abstract clear(): IImmutableDictionary<TKey, TValue>;

    abstract put(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;

    abstract remove(key: TKey): IImmutableDictionary<TKey, TValue>;

    abstract set(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;

    abstract override get length(): number;
}