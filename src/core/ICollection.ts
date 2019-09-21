export interface ICollection<T> {
    add(item: T): boolean;
    clear(): void;
    contains(item: T): boolean;
    isEmpty(): boolean;
    size(): number;
    toArray(): T[];
}