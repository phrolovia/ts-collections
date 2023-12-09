import {Predicate} from "../shared/Predicate";
import {IReadonlyCollection} from "./IReadonlyCollection";

export interface IImmutableCollection<TElement> extends IReadonlyCollection<TElement> {
    add(element: TElement): IImmutableCollection<TElement>;
    addAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
    clear(): IImmutableCollection<TElement>;
    remove(element: TElement): IImmutableCollection<TElement>;
    removeAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
    removeIf(predicate: Predicate<TElement>): IImmutableCollection<TElement>;
    retainAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
}