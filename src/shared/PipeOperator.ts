export interface PipeOperator<TElement, TResult> {
    (iterable: Iterable<TElement>): TResult;
}

export interface AsyncPipeOperator<TElement, TResult> {
    (iterable: AsyncIterable<TElement>): Promise<TResult>;
}
