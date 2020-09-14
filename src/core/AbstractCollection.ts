import {ICollection} from "./ICollection";
import {Comparator} from "../shared/Comparator";
import {EqualityComparator} from "../shared/EqualityComparator";

export abstract class AbstractCollection<T> implements ICollection<T> {
    public static readonly defaultComparator: Comparator<any> = <E>(i1: E, i2: E) => i1 < i2 ? -1 : i1 > i2 ? 1 : 0;
    public static readonly defaultEqualityComparator: EqualityComparator<any> = <E>(i1: E, i2: E) => Object.is(i1, i2);

    abstract add(item: T): boolean;
    abstract clear(): void;
    abstract includes(item: T): boolean;
    abstract isEmpty(): boolean;
    abstract remove(item: T): boolean;
    abstract size(): number;
    abstract toArray(): T[];

    public get Count(): number {
        return this.size();
    }

    * [Symbol.iterator](): Iterator<T> {
        const data: T[] = this.toArray();
        for (let item of data) {
            yield item;
        }
    };
}
