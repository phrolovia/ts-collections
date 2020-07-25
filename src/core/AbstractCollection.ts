import { ICollection } from "./ICollection";

export abstract class AbstractCollection<T> implements ICollection<T> {
	abstract add(item: T): boolean;
	abstract clear(): void;
	abstract contains(item: T): boolean;
	abstract isEmpty(): boolean;
	abstract remove(item: T): boolean;
	abstract size(): number;
	abstract toArray(): T[];
	public get Count(): number {
		return this.size();
	}
	*[Symbol.iterator](): Iterator<T> {
		const data: T[] = this.toArray();
		for (let item of data) {
			yield item;
		}
	};
}
