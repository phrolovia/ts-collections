export interface Predicate<TElement> {
    (element: TElement): boolean;
}

export interface TypePredicate<TElement, TFiltered extends TElement> {
    (element: TElement): element is TFiltered;
}
