import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";
import { none } from "./none";
import { NoElementsException } from "../../shared/NoElementsException";

/**
 * Repeats the sequence the specified number of times, or indefinitely when no count is provided.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param count Optional number of times to repeat the sequence. When omitted, the sequence repeats without end.
 * @returns {IEnumerable<TElement>} A sequence that yields the original elements cyclically.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @remarks When `count` is `undefined`, consume the result with care because it represents an infinite sequence.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const cycled = cycle(numbers, 2).toArray();
 * console.log(cycled); // [1, 2, 3, 1, 2, 3]
 * ```
 */
export const cycle = <TElement>(
    source: Iterable<TElement>,
    count?: number
): IEnumerable<TElement> => {
    return new Enumerator(() => cycleGenerator(source, count));
};

function* cycleGenerator<TElement>(source: Iterable<TElement>, count?: number): IterableIterator<TElement> {
    if (none(source)) {
        throw new NoElementsException();
    }
    if (count == null) {
        while (true) {
            yield* source;
        }
    } else {
        for (let i = 0; i < count; ++i) {
            yield* source;
        }
    }
}
