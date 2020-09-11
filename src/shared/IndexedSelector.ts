export interface IndexedSelector<T, R> {
    (item: T, index?: number): R;
}
