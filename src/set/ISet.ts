import {ICollection} from "../core/ICollection";

export interface ISet<TElement> extends ICollection<TElement> {
    headSet(toElement: TElement, inclusive?: boolean): ISet<TElement>;
    subSet(fromElement: TElement, toElement: TElement, fromInclusive?: boolean, toInclusive?: boolean): ISet<TElement>;
    tailSet(fromElement: TElement, inclusive?: boolean): ISet<TElement>;
}
