export interface EqualityComparator<TFirst, TSecond = TFirst> {
    (e1: TFirst, e2: TSecond): boolean;
}
