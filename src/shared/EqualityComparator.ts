export interface EqualityComparator<T> {
    (item1: T, item2: T): boolean;
}
