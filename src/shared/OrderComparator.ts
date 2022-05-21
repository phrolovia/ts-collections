export interface OrderComparator<TFirst, TSecond = TFirst> {
    (e1: TFirst, e2: TSecond): number;
}
