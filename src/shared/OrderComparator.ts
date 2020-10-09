export interface OrderComparator<TElement> {
    (e1: TElement, e2: TElement): number;
}
