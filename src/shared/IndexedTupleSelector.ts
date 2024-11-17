export interface IndexedTupleSelector<TElement> {
    (index: number, item: TElement): [number, TElement];
}
