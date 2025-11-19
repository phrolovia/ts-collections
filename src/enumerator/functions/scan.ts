import type { Accumulator } from "../../shared/Accumulator";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Accumulates the sequence and emits each intermediate result.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TAccumulate Accumulator type produced by {@link accumulator}; defaults to `TElement` when {@link seed} is omitted.
 * @param source The source iterable.
 * @param accumulator Function that merges the current accumulator value with the next element to produce the subsequent accumulator.
 * @param seed Optional initial accumulator. When omitted, the first element supplies the initial accumulator and is emitted as the first result.
 * @returns {IEnumerable<TAccumulate>} A deferred sequence containing every intermediate accumulator produced by {@link accumulator}.
 * @throws {NoElementsException} Thrown when {@link source} is empty and {@link seed} is not provided.
 * @remarks {@link source} is enumerated exactly once. Supplying {@link seed} prevents exceptions on empty sources but the seed itself is not emitted.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const runningTotal = scan(numbers, (acc, x) => acc + x).toArray();
 * console.log(runningTotal); // [1, 3, 6, 10, 15]
 * ```
 */
export const scan = <TElement, TAccumulate = TElement>(
    source: Iterable<TElement>,
    accumulator: Accumulator<TElement, TAccumulate>,
    seed?: TAccumulate
): IEnumerable<TAccumulate> => {
    return from(source).scan(accumulator, seed);
};
