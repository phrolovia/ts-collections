export interface Zipper<T, R, U> {
    (item1: T, item2: R): U;
}
