import {IGrouping} from "./IGrouping";

export class Grouping<R, T> implements IGrouping<R, T> {
    data: Array<T>;
    key: R;
    public constructor(key: R, data: Array<T>) {
        this.key = key;
        this.data = data;
    }
}
