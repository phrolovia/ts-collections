import type { IEnumerable } from "../IEnumerable";
import { InvalidArgumentException } from "../../shared/InvalidArgumentException";
import { Enumerator, List } from "../Enumerator";

/**
 * Generates the unique combinations that can be built from the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
 * @returns {IEnumerable<IEnumerable<TElement>>} A sequence of combinations built from the source elements.
 * @throws {InvalidArgumentException} Thrown when `size` is negative.
 * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const combs = combinations(numbers, 2);
 * console.log(combs.select(c => c.toArray()).toArray()); // [[1, 2], [1, 3], [2, 3]]
 * ```
 */
export const combinations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    if (size != null && size < 0) {
        throw new InvalidArgumentException("Size must be greater than or equal to 0.", "size");
    }
    return new Enumerator(() => combinationsGenerator(source, size));
};

function* combinationsGenerator<TElement>(source: Iterable<TElement>, size?: number): IterableIterator<IEnumerable<TElement>> {
    const iterator = source[Symbol.iterator]();

    let next = iterator.next();
    if (next.done) {
        return yield* [];
    }

    const items = new List<TElement>();
    while (!next.done) {
        items.add(next.value);
        next = iterator.next();
    }

    const combinationCount = 1 << items.length;
    const seen = new Set<string>();

    for (let cx = 0; cx < combinationCount; ++cx) {
        const combination = new List<TElement>();
        for (let vx = 0; vx < items.length; ++vx) {
            if ((cx & (1 << vx)) !== 0) {
                combination.add(items.elementAt(vx));
            }
        }
        if (size == null || combination.length === size) {
            const key = combination.aggregate((acc, cur) => acc + cur, ",");
            if (!seen.has(key)) {
                seen.add(key);
                yield combination;
            }
        }
    }
}
