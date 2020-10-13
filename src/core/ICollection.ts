import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";

export interface ICollection<TElement> extends IEnumerable<TElement> {
    add(element: TElement): boolean;
    addAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;
    clear(): void;
    containsAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;
    forEach(action: IndexedAction<TElement>): void;
    isEmpty(): boolean;
    remove(element: TElement): boolean;
    removeAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;
    removeIf(predicate: Predicate<TElement>): boolean;
    retainAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;
    size(): number;
}
