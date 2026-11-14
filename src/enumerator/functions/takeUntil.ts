import { IndexedPredicate, IndexedTypePredicate } from "../../shared/IndexedPredicate";
import { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";

/**
 * Returns consecutive leading elements until a type guard predicate returns `true`, then stops.
 * @template TElement Type of elements within {@link source}.
 * @template TFiltered extends TElement Result type produced by {@link predicate}.
 * @param source The source iterable.
 * @param predicate Type guard invoked for each element and its zero-based index; iteration halts immediately when it returns `true`.
 * @returns {IEnumerable<TFiltered>} A deferred sequence containing the contiguous prefix produced before {@link predicate} succeeds.
 * @remarks Elements after the first element satisfying {@link predicate} are not inspected.
 * @example
 * ```typescript
 * const mixed: (number | string)[] = [1, 2, 'stop', 3];
 * const beforeStop = takeUntil(mixed, (x): x is string => typeof x === 'string').toArray();
 * console.log(beforeStop); // [1, 2]
 * ```
 */
export function takeUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

/**
 * Returns consecutive leading elements until a predicate returns `true`, then stops.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param predicate Predicate invoked for each element and its zero-based index; iteration halts immediately when it returns `true`.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the contiguous prefix produced before {@link predicate} succeeds.
 * @remarks Elements after the first element satisfying {@link predicate} are not inspected.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const taken = takeUntil(numbers, x => x > 3).toArray();
 * console.log(taken); // [1, 2, 3]
 * ```
 */
export function takeUntil<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;

export function takeUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return new Enumerator(() => takeUntilGenerator(source, predicate));
}

function* takeUntilGenerator<TElement>(source: Iterable<TElement>, predicate: IndexedPredicate<TElement>): IterableIterator<TElement> {
    let index = 0;
    for (const item of source) {
        if (predicate(item, index)) {
            break;
        }
        yield item;
        index++;
    }
}
