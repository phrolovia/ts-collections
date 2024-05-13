import { IRandomAccessCollection } from "../imports";

export interface ISet<TElement> extends IRandomAccessCollection<TElement> {
    exceptWith(other: Iterable<TElement>): void;

    intersectWith(other: Iterable<TElement>): void;

    isProperSubsetOf(other: Iterable<TElement>): boolean;

    isProperSupersetOf(other: Iterable<TElement>): boolean;

    isSubsetOf(other: Iterable<TElement>): boolean;

    isSupersetOf(other: Iterable<TElement>): boolean;

    overlaps(other: Iterable<TElement>): boolean;
}
