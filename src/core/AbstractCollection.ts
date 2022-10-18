import {EqualityComparator} from "../shared/EqualityComparator";
import {AbstractReadonlyCollection} from "./AbstractReadonlyCollection";

export abstract class AbstractCollection<TElement> extends AbstractReadonlyCollection<TElement> {
    protected constructor(comparator?: EqualityComparator<TElement>) {
        super(comparator);
    }

    public addAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const oldSize = this.size();
        for (const element of collection) {
            this.add(element);
        }
        this.updateLength();
        return this.size() !== oldSize;
    }

    abstract add(element: TElement): boolean;
    abstract clear(): void;
}
