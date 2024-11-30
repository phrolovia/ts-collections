export interface IndexedSelector<TElement, TResult> {
    (item: TElement, index: number): TResult;
}
