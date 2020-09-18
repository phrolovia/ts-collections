export interface IndexedAction<T, R = void> {
    (item: T, index?: number): R;
}
