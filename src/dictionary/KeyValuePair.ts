export class KeyValuePair<K, V> {
    public static readonly defaultEqualityComparator
        = <K, V>(p1: KeyValuePair<K, V>, p2: KeyValuePair<K, V>) => Object.is(p1.key, p2.key) && Object.is(p1.value, p2.value);

    public readonly key: K;
    public value: V;

    public constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }

    public equals(other: KeyValuePair<K, V>): boolean {
        return KeyValuePair.defaultEqualityComparator(this, other);
    }
}
