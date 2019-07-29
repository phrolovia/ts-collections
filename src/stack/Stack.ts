import { ICollection } from "../core/ICollection";
import { InvalidOperationException } from "../exceptions/InvalidOperationException";

export class Stack<T> {
    private count: number = 0;
    private data: T[] = [];
    public constructor(data?: T[]) {
        if (data) {
            this.data = [...data];
        }
    }
    public clear(): void {
        this.data.length = 0;
        this.count = 0;
    }
    public contains(item: T): boolean {
        return this.data.findIndex(d => d === item) > -1;
    }
    public peek(): T {
        if (this.Count === 0) {
            throw new InvalidOperationException("stack is empty.");
        }
        return this.data[0];
    }
    public pop(): T {
        if (this.count === 0) {
            throw new InvalidOperationException("stack is empty.");
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        this.count--;
        return item;
    }
    public push(item: T): void {
        this.data.splice(0, 0, item);
        this.count++;
    }
    public toArray(): T[] {
        return [...this.data];
    }
    public get Count() { return this.count; }
}