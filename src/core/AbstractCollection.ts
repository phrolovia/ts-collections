import { ICollection } from "./ICollection";
import { Constructor } from "./Constructor";

export abstract class AbstractCollection<T> implements ICollection<T> {
	abstract add(item: T): boolean;
	abstract clear(): void;
	abstract contains(item: T): boolean;
	abstract isEmpty(): boolean;
	abstract remove(item: T): boolean;
	abstract size(): number;
	abstract toArray(): T[];
}
