import { IndexOutOfBoundsException } from "../../shared/IndexOutOfBoundsException";
import { asIndexed } from "../../shared/internal/collectionAccess";

/**
 * Retrieves the element at the specified zero-based index.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param index Zero-based position of the element to retrieve.
 * @returns {TElement} The element located at the requested index.
 * @throws {IndexOutOfBoundsException} Thrown when `index` is negative or greater than or equal to the number of elements in {@link source}.
 * @remarks Enumeration stops once the requested element is found; remaining elements are not evaluated.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const element = elementAt(numbers, 2);
 * console.log(element); // 3
 * ```
 */
export const elementAt = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement => {
    if (Array.isArray(source)) {
        if (!Number.isInteger(index) || index < 0 || index >= source.length) {
            throw new IndexOutOfBoundsException(index);
        }
        return source[index];
    }
    const indexed = asIndexed(source);
    if (indexed) {
        if (!Number.isInteger(index) || index < 0 || index >= indexed.size()) {
            throw new IndexOutOfBoundsException(index);
        }
        return indexed.get(index);
    }
    if (index < 0) {
        throw new IndexOutOfBoundsException(index);
    }
    let ix: number = 0;
    for (const item of source) {
        if (index === ix) {
            return item;
        }
        ++ix;
    }
    throw new IndexOutOfBoundsException(index);
};
