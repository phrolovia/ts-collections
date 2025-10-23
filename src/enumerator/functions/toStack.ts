import { EqualityComparator } from "../../shared/EqualityComparator";
import { Stack } from "../../stack/Stack";
import { from } from "./from";

/**
 * Materialises {@link source} into a stack (LIFO).
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting stack.
 * @returns {Stack<TElement>} A stack whose top element corresponds to the last element of {@link source}.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const stack = toStack(numbers);
 * console.log(stack.peek()); // 3
 * console.log(stack.pop().peek()); // 2
 * ```
 */
export const toStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Stack<TElement> => {
    return from(source).toStack(comparator);
};
