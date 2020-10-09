import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";

export interface ICollection<TElement> extends IEnumerable<TElement> {
    add(element: TElement): boolean;
    addAll<TSource extends TElement>(collection: ICollection<TSource>): boolean;
    clear(): void;
    containsAll<TSource extends TElement>(collection: ICollection<TSource>, comparator?: EqualityComparator<TElement>): boolean;
    isEmpty(): boolean;
    remove(element: TElement, comparator?: EqualityComparator<TElement>): boolean;
    removeAll<TSource extends TElement>(collection: ICollection<TElement>, comparator?: EqualityComparator<TElement>): boolean;
    removeIf(predicate: Predicate<TElement>): boolean;
    retainAll<TSource extends TElement>(collection: ICollection<TSource>, comparator?: EqualityComparator<TElement>): boolean;
    size(): number;
}
