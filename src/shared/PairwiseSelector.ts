export interface PairwiseSelector<TFirst, TSecond = TFirst, TResult = [TFirst, TSecond]> {
    (first: TFirst, second: TSecond): TResult;
}