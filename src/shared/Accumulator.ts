export interface Accumulator<TElement, TAccumulate> {
    (acc: TAccumulate, item: TElement): TAccumulate;
}
