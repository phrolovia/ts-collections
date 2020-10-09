import {EqualityComparator} from "../shared/EqualityComparator";
import {ICollection} from "../../imports";

export interface IList<TElement> extends ICollection<TElement> {
    addAt(element: TElement, index: number): boolean;
    addAll<TSource extends TElement>(collection: ICollection<TSource>, index?: number): boolean;
    get(index: number): TElement;
    indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number;
    lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number;
    removeAt(index: number): TElement;
    set(index: number, element: TElement): TElement;
}
