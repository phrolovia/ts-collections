export interface Comparator<T> {
    (item1: T, item2: T): number;
}
