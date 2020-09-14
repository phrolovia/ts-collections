export interface Action<T, R = void> {
    (item: T): R;
}
