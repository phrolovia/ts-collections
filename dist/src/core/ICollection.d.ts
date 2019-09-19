export interface ICollection<T> {
    clear(): void;
    contains(item: T): boolean;
    isEmpty(): boolean;
    toArray(): T[];
}
