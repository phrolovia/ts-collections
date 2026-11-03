import { Comparators } from "../Comparators";
import type { EqualityComparator } from "../EqualityComparator";

const MINUS_ZERO = Symbol("-0");

/**
 * Maps a value to a Map or Set key with Object.is semantics. Maps and Sets use SameValueZero,
 * which treats -0 and 0 as equal, so -0 gets a key of its own.
 */
export const identityKey = (value: unknown): unknown => Object.is(value, -0) ? MINUS_ZERO : value;

/**
 * Returns a test for whether a candidate matches any element of the iterable, comparing as
 * comparator(candidate, element). The iterable is read once. With the default comparator the
 * elements are hashed, so each test takes O(1); other comparators scan the elements.
 */
export const membership = <TElement>(
    iterable: Iterable<TElement>,
    comparator: EqualityComparator<TElement>
): (candidate: TElement) => boolean => {
    if (comparator === Comparators.equalityComparator) {
        const keys = new Set<unknown>();
        for (const element of iterable) {
            keys.add(identityKey(element));
        }
        return candidate => keys.has(identityKey(candidate));
    }
    const elements = Array.from(iterable);
    return candidate => elements.some(element => comparator(candidate, element));
};
