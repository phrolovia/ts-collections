import { EqualityComparator } from "../../shared/EqualityComparator";
import { ImmutableStack } from "../../stack/ImmutableStack";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable stack (LIFO).
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting stack.
 * @returns {ImmutableStack<TElement>} An immutable stack whose top element corresponds to the last element of {@link source}.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableStack = toImmutableStack(numbers);
 * console.log(immutableStack.peek()); // 3
 * console.log(immutableStack.pop().peek()); // 2
 * ```
 */
export const toImmutableStack = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableStack<TElement> => {
    return from(source).toImmutableStack(comparator);
};
