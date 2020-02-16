import { ICollection } from "./ICollection";
import { Constructor } from "./Constructor";
import { ITransform } from "./ITransform";

export abstract class AbstractCollection<T> implements ICollection<T>, ITransform<T> {
	abstract add(item: T): boolean;
	abstract clear(): void;
	abstract contains(item: T): boolean;
	abstract isEmpty(): boolean;
	abstract remove(item: T): boolean;
	abstract size(): number;
	abstract toArray(): T[];
	transform<U extends ICollection<T>>(Collection: Constructor<U>, comparator?: (v1: T, v2: T) => number): U {
		const collection = new Collection(comparator);
		this.toArray().forEach(item => collection.add(item));
		return collection;
	}
}
