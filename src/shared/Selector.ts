export interface Selector<T, R> {
    (item: T): R;
}
