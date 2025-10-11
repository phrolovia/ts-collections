export interface Zipper<TFirst, TSecond, TResult> {
    (sequence1: TFirst, sequence2: TSecond): TResult;
}

export interface ZipperMany<TInputs extends readonly unknown[], TResult> {
    (values: readonly [...TInputs]): TResult;
}
