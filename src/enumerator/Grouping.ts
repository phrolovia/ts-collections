import {IEnumerable} from "./IEnumerable";
import {Enumerable} from "./Enumerable";
import {IGrouping} from "./IGrouping";

export class Grouping<TKey, TElement> extends Enumerable<TElement> implements IGrouping<TKey, TElement> {
    public readonly key: TKey;
    public readonly source: IEnumerable<TElement>;

    public constructor(key: TKey, source: IEnumerable<TElement>) {
        super(source);
        this.key = key;
        this.source = source;
    }
}