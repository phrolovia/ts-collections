import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";

/**
 * Omits a specified number of elements from the end of the sequence.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param count Number of trailing elements to exclude. Values less than or equal to zero leave the sequence unchanged.
 * @returns {IEnumerable<TElement>} A deferred sequence excluding the last {@link count} elements.
 * @remarks The implementation buffers up to {@link count} elements to determine which items to drop, which can increase memory usage for large counts.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const skipped = skipLast(numbers, 2).toArray();
 * console.log(skipped); // [1, 2, 3]
 * ```
 */
export const skipLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return new Enumerator(() => skipLastGenerator(source, count));
};

function* skipLastGenerator<TElement>(source: Iterable<TElement>, count: number): IterableIterator<TElement> {
    if (count <= 0) {
        yield* source;
        return;
    }

    const buffer: TElement[] = new Array(count);
    let bufferSize = 0;
    let index = 0;

    for (const item of source) {
        if (bufferSize === count) {
            yield buffer[index];
        }
        buffer[index] = item;
        index = (index + 1) % count;
        if (bufferSize < count) {
            bufferSize++;
        }
    }
}
