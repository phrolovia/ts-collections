import type { IEnumerable } from "../IEnumerable";
import { InvalidArgumentException } from "../../shared/InvalidArgumentException";
import { Enumerator } from "../Enumerator";

/**
 * Returns every n-th element of the sequence, starting with the first.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param step Positive interval indicating how many elements to skip between yielded items.
 * @returns {IEnumerable<TElement>} A deferred sequence containing elements whose zero-based index is divisible by {@link step}.
 * @throws {InvalidArgumentException} Thrown when {@link step} is less than 1.
 * @remarks {@link source} is enumerated exactly once; elements that are not yielded are still visited to honour the stepping interval.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const stepped = step(numbers, 3).toArray();
 * console.log(stepped); // [1, 4, 7]
 * ```
 */
export const step = <TElement>(
    source: Iterable<TElement>,
    step: number
): IEnumerable<TElement> => {
    if (step < 1) {
        throw new InvalidArgumentException("Step must be greater than 0.", "step");
    }
    return new Enumerator(() => stepGenerator(source, step));
};

function* stepGenerator<TElement>(source: Iterable<TElement>, step: number): IterableIterator<TElement> {
    let index = 0;
    for (const item of source) {
        if (index % step === 0) {
            yield item;
        }
        ++index;
    }
}
