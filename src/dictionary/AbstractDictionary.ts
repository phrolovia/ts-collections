import {ErrorMessages} from "../shared/ErrorMessages";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IDictionary, KeyValuePair} from "../../imports";
import {AbstractReadonlyDictionary} from "./AbstractReadonlyDictionary";

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
        if (key == null) {
            throw new Error(ErrorMessages.NullKey);
        }
        if (this.containsKey(key)) {
            return false;
        }
        this.add(key, value);
        this.updateLength();
        return true;
    }


    abstract add(key: TKey, value: TValue): TValue;

    abstract clear(): void;

    abstract remove(key: TKey): TValue;

    abstract set(key: TKey, value: TValue): void;

}