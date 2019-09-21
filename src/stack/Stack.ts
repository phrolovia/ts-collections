import { ICollection } from "../core/ICollection";
import { InvalidOperationException } from "../exceptions/InvalidOperationException";

export class Stack<T> implements ICollection<T> {
    private data: T[] = [];
    public constructor(data?: T[]) {
        if (data) {
            this.data = [...data];
        }
    }
    public add(item: T): boolean {
        this.push(item);
        return true;
    }
    public clear(): void {
        this.data.length = 0;
    }
    public contains(item: T): boolean {
        return this.data.findIndex(d => d === item) > -1;
    }
    public isEmpty(): boolean {
        return this.data.length === 0;
    }
    public peek(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("stack is empty.");
        }
        return this.data[0];
    }
    public pop(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("stack is empty.");
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }
    public push(item: T): void {
        this.data.splice(0, 0, item);
    }
    public remove(item: T): boolean {
        throw("");
    }
    public size(): number {
        return this.data.length;
    }
    public toArray(): T[] {
        return [...this.data];
    }
}