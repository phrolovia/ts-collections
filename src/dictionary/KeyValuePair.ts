import { Comparators } from "../shared/Comparators";
import type { EqualityComparator } from "../shared/EqualityComparator";

export class KeyValuePair<TKey, TValue> {
    public readonly key: TKey;
    public value: TValue;

    public constructor(key: TKey, value: TValue) {
        this.key = key;
        this.value = value;
    }

    public equals(pair: KeyValuePair<TKey, TValue>,
                  keyComparator?: EqualityComparator<TKey>,
                  valueComparator?: EqualityComparator<TValue>): boolean {
        keyComparator ??= Comparators.equalityComparator;
        valueComparator ??= Comparators.equalityComparator
        return keyComparator(this.key, pair.key) && valueComparator(this.value, pair.value);
    }
}
