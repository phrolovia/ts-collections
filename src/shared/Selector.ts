export interface Selector<TElement, TResult> {
    (item: TElement): TResult;
}
