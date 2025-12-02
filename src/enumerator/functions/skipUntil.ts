import { IndexedPredicate, IndexedTypePredicate } from "../../shared/IndexedPredicate";
import { IEnumerable } from "../IEnumerable";
import { from } from "./from";

export function skipUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

export function skipUntil<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;

export function skipUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).skipUntil(predicate);
}
