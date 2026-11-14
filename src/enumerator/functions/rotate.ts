import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";
import { asSized } from "../../shared/internal/collectionAccess";

/**
 * Returns a deferred sequence that rotates the elements by the specified offset while preserving length.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param shift Number of positions to rotate. Positive values move elements toward the end (left rotation); negative values move them toward the beginning (right rotation).
 * @returns {IEnumerable<TElement>} A sequence containing the same elements shifted by the requested amount.
 * @remarks The source is buffered sufficiently to honour the rotation. Rotation amounts larger than the length of {@link source} are normalised by that length, which may require buffering the full sequence.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const rotated = rotate(numbers, 2).toArray();
 * console.log(rotated); // [3, 4, 5, 1, 2]
 *
 * const rotatedNegative = rotate(numbers, -2).toArray();
 * console.log(rotatedNegative); // [4, 5, 1, 2, 3]
 * ```
 */
export const rotate = <TElement>(source: Iterable<TElement>, shift: number): IEnumerable<TElement> => {
    return new Enumerator(() => rotateIterable(source, shift));
};

// Rotates a finite source with slices: any source for a right rotation, which buffers everything
// anyway, and an array or library collection for a left one. Other left rotations stream.
// Enumerator's rotate calls this with the iterable it wraps, so an array behind it is sliced too.
export const rotateIterable = <TElement>(source: Iterable<TElement>, shift: number): Iterable<TElement> => {
    if (!Number.isInteger(shift) || shift === 0) {
        return rotateGenerator(source, shift);
    }
    if (shift > 0 && !Array.isArray(source) && asSized(source) == null) {
        return rotateLeftGenerator(source, shift);
    }
    const elements = Array.isArray(source) ? source as TElement[] : Array.from(source);
    if (elements.length === 0) {
        return elements;
    }
    const offset = ((shift % elements.length) + elements.length) % elements.length;
    return elements.slice(offset).concat(elements.slice(0, offset));
};

function* rotateGenerator<TElement>(source: Iterable<TElement>, shift: number): IterableIterator<TElement> {
    if (shift === 0) {
        return yield* source;
    }
    if (shift > 0) {
        return yield* rotateLeftGenerator(source, shift);
    }
    return yield* rotateRightGenerator(source, shift);
}

function* rotateLeftGenerator<TElement>(source: Iterable<TElement>, shift: number): IterableIterator<TElement> {
    const iterator = source[Symbol.iterator]() as IterableIterator<TElement, TElement, TElement>;
    const head: TElement[] = [];
    let taken = 0;
    while (taken < shift) {
        const next = iterator.next();
        if (next.done) {
            if (head.length === 0) {
                return;
            }
            const k = shift % head.length;
            for (let i = k; i < head.length; ++i) {
                yield head[i];
            }
            for (let i = 0; i < k; ++i) {
                yield head[i];
            }
            return;
        }
        head.push(next.value);
        taken++;
    }

    for (let next = iterator.next(); !next.done; next = iterator.next()) {
        yield next.value;
    }
    return yield* head;
}

function* rotateRightGenerator<TElement>(source: Iterable<TElement>, shift: number): IterableIterator<TElement> {
    const buffer: TElement[] = [];
    for (const item of source) {
        buffer.push(item);
    }
    if (buffer.length === 0) {
        return;
    }
    const r = (-shift) % buffer.length;
    const k = (buffer.length - r) % buffer.length;
    for (let i = 0; i < buffer.length; ++i) {
        yield buffer[(i + k) % buffer.length];
    }
}
