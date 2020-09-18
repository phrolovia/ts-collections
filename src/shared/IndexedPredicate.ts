export interface IndexedPredicate<T> {
    (item: T, index?: number): boolean;
}
