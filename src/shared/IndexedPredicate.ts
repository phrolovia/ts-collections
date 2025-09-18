export interface IndexedPredicate<TElement> {
    (item: TElement, index: number): boolean;
}

export interface IndexedTypePredicate<TElement, TFiltered extends TElement> {
    (item: TElement, index: number): item is TFiltered;
}
