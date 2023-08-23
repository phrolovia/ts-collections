export interface JoinSelector<TFirst, TSecond, TResult> {
    (firstItem: TFirst, secondItem: TSecond | null): TResult;
}
