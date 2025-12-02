import { IndexedPredicate, IndexedTypePredicate } from "../../shared/IndexedPredicate";
import { IEnumerable } from "../IEnumerable";
import { from } from "./from";

export function takeUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

export function takeUntil<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;

export function takeUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).takeUntil(predicate);
}
