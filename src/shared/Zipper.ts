export interface Zipper<TFirst, TSecond, TResult> {
    (sequence1: TFirst, sequence2: TSecond): TResult;
}
