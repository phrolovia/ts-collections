export interface IndexedAction<TElement, TReturn = void> {
    (item: TElement, index?: number): TReturn;
}
