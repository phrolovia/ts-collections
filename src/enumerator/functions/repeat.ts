import { Enumerable } from "../../imports";
import type { IEnumerable } from "../../enumerator/IEnumerable";

/**
 * Creates a sequence that repeats the specified element a fixed number of times.
 * @template TElement Type of the repeated element.
 * @param element Element to repeat.
 * @param count Number of repetitions to produce.
 * @returns {IEnumerable<TElement>} A sequence containing {@link element} repeated {@link count} times.
 * @remarks Enumeration is deferred. When {@link count} is zero or negative, the resulting sequence is empty.
 * @example
 * ```typescript
 * const repeated = repeat('a', 5).toArray();
 * console.log(repeated); // ['a', 'a', 'a', 'a', 'a']
 * ```
 */
export const repeat = <TElement>(element: TElement, count: number): IEnumerable<TElement> => {
    return Enumerable.repeat(element, count);
};
