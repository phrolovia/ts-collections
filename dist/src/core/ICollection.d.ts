export interface ICollection<T> {
    /**
     * Adds an item to the {(ICollection<T>)}
     * @param {(T)} item item to be added to the collection.
     */
    add(item: T): void;
    clear(): void;
    contains(item: T): boolean;
    remove(item: T): boolean;
}
