/**
 * A closed interval and the value stored with it.
 */
export interface Interval<TPoint, TValue> {
    /**
     * The last point of the interval. It belongs to the interval.
     */
    readonly end: TPoint;

    /**
     * The first point of the interval. It belongs to the interval.
     */
    readonly start: TPoint;

    /**
     * The value stored with the interval.
     */
    readonly value: TValue;
}
