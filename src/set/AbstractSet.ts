import {AbstractCollection, ISet} from "../../imports";
import {OrderComparator} from "../shared/OrderComparator";
import {Comparators} from "../shared/Comparators";
import {EqualityComparator} from "../shared/EqualityComparator";

export abstract class AbstractSet<TElement> extends AbstractCollection<TElement> implements ISet<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super((e1: TElement, e2: TElement) => (comparator ?? Comparators.equalityComparator)(e1, e2));
    }

    abstract headSet(toElement: TElement, inclusive?: boolean): ISet<TElement>;
    abstract subSet(fromElement: TElement, toElement: TElement, fromInclusive?: boolean, toInclusive?: boolean): ISet<TElement>;
    abstract tailSet(fromElement: TElement, inclusive?: boolean): ISet<TElement>;
}
