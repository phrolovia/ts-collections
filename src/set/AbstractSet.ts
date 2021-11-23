import {AbstractCollection, ISet} from "../../imports";
import {OrderComparator} from "../shared/OrderComparator";
import {Comparators} from "../shared/Comparators";

export abstract class AbstractSet<TElement> extends AbstractCollection<TElement> implements ISet<TElement> {
    protected readonly orderComparator: OrderComparator<TElement>;
    protected constructor(comparator?: OrderComparator<TElement>) {
        super((e1: TElement, e2: TElement) => (comparator ?? Comparators.orderComparator)(e1, e2) === 0);
        this.orderComparator = comparator ?? Comparators.orderComparator;
    }

    abstract headSet(toElement: TElement, inclusive?: boolean): ISet<TElement>;
    abstract subSet(fromElement: TElement, toElement: TElement, fromInclusive?: boolean, toInclusive?: boolean): ISet<TElement>;
    abstract tailSet(fromElement: TElement, inclusive?: boolean): ISet<TElement>;
}
