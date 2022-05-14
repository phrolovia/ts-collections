import {AbstractCollection, ICollection, IRandomAccessCollection} from "../../imports";
import {Predicate} from "../shared/Predicate";

export abstract class AbstractRandomAccessCollection<TElement> extends AbstractCollection<TElement> implements IRandomAccessCollection<TElement> {
    abstract remove(element: TElement): boolean;
    abstract removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;
    abstract removeIf(predicate: Predicate<TElement>): boolean;
    abstract retainAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;
}