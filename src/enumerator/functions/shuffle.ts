import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";
import { shuffleInPlace } from "../../utils/shuffleInPlace";

/**
 * Returns a deferred sequence whose elements appear in random order.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A sequence containing the same elements as {@link source} but shuffled.
 * @remarks The implementation materialises the entire sequence into an array before shuffling, making this unsuitable for infinite sequences.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(numbers).toArray();
 * console.log(shuffled); // e.g., [3, 1, 5, 2, 4]
 * ```
 */
export const shuffle = <TElement>(
    source: Iterable<TElement>
): IEnumerable<TElement> => {
    return new Enumerator(() => shuffleGenerator(source));
};

function* shuffleGenerator<TElement>(source: Iterable<TElement>): IterableIterator<TElement> {
    const array = Array.from(source);
    shuffleInPlace(array);
    yield* array;
}
