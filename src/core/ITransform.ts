import { Constructor } from "./Constructor";
import { ICollection } from "./ICollection";

export interface ITransform<T> {
	/**
	 * Transform a collection type into another collection type.
	 * A comparator is required if the target collection is of type ITree<T>
	 * @param Collection A class that implements ICollection interface.
	 * @param comparator A comparator function that compares collection items. Required for collections of ITree.
	 */
	transform<U extends ICollection<T>>(Collection: Constructor<U>, comparator?: (v1: T, v2: T) => number): U;
}
