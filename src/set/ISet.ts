import {IEnumerable, IRandomAccessCollection} from "../../imports";

export interface ISet<TElement> extends IRandomAccessCollection<TElement> {
    exceptWith(other: IEnumerable<TElement>): void;
    intersectWith(other: IEnumerable<TElement>): void;
    isProperSubsetOf(other: IEnumerable<TElement>): boolean;
    isProperSupersetOf(other: IEnumerable<TElement>): boolean;
    isSubsetOf(other: IEnumerable<TElement>): boolean;
    isSupersetOf(other: IEnumerable<TElement>): boolean;
    overlaps(other: IEnumerable<TElement>): boolean;
}
