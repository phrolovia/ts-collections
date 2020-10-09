export interface EqualityComparator<TElement> {
    (e1: TElement, e2: TElement): boolean;
}
