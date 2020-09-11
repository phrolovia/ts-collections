export interface JoinSelector<T, E, R> {
    (firstItem: T, secondItem: E): R;
}
