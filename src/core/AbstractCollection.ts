import { ICollection } from "./ICollection";

export abstract class AbstractCollection<T> implements ICollection<T> {
	public static defaultComparator<E>(item1: E, item2: E): number {
		return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
	}
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
