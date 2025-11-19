import { from } from "./from";

/**
 * Combines the elements of the sequence by applying an accumulator to each element and optionally projecting the final result.
 * @template TElement Type of elements within the `source` iterable.
 * @template TAccumulate Type of the intermediate accumulator. Defaults to `TElement` when no seed is provided.
 * @template TResult Type returned when a `resultSelector` is supplied.
 * @param source The source iterable.
 * @param accumulator Function that merges the running accumulator with the next element.
 * @param seed Optional initial accumulator value. When omitted, the first element is used as the starting accumulator.
 * @param resultSelector Optional projection applied to the final accumulator before it is returned.
 * @returns {TAccumulate|TResult} The final accumulator (or its projection).
 * @throws {NoElementsException} Thrown when `source` has no elements and no `seed` is provided.
 * @remarks The source sequence is enumerated exactly once. Supply a `seed` to avoid exceptions on empty sequences and to control the accumulator type.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const sum = aggregate(numbers, (acc, x) => acc + x);
 * console.log(sum); // 15
 *
 * const product = aggregate(numbers, (acc, x) => acc * x, 1);
 * console.log(product); // 120
 * ```
 */
export const aggregate = <TElement, TAccumulate = TElement, TResult = TAccumulate>(
    source: Iterable<TElement>,
    accumulator: (accumulator: TAccumulate, element: TElement) => TAccumulate,
    seed?: TAccumulate,
    resultSelector?: (accumulator: TAccumulate) => TResult
): TAccumulate | TResult => {
    return from(source).aggregate(accumulator, seed, resultSelector);
};
