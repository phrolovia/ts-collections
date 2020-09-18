export interface Aggregator<T, R> {
    (acc: R, item: T): R;
}
