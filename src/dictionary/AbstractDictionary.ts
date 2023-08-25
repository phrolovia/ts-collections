import {EqualityComparator} from "../shared/EqualityComparator";
import {AbstractReadonlyDictionary} from "./AbstractReadonlyDictionary";
import {IDictionary} from "./IDictionary";
import {KeyValuePair} from "./KeyValuePair";

export abstract class AbstractDictionary<TKey, TValue> extends AbstractReadonlyDictionary<TKey, TValue> implements IDictionary<TKey, TValue> {
    protected constructor(valueComparator: EqualityComparator<TValue>, keyValueComparator: EqualityComparator<KeyValuePair<TKey, TValue>>) {
        super(valueComparator, keyValueComparator);
    }

    public put(key: TKey, value: TValue): TValue | null {
        if (this.containsKey(key)) {
            const oldValue = this.get(key);
            this.set(key, value);
            return oldValue;
        }
        this.add(key, value);
        return null;
    }

    public tryAdd(key: TKey, value: TValue): boolean {
        if (this.containsKey(key)) {
            return false;
        }
        this.add(key, value);
        this.updateLength();
        return true;
    }


    abstract add(key: TKey, value: TValue): TValue;
    abstract clear(): void;
    abstract remove(key: TKey): TValue | null;
    abstract set(key: TKey, value: TValue): void;
}