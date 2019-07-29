import { ICollection } from "../core/ICollection";
import { InvalidOperationException } from "../exceptions/InvalidOperationException";

export class Queue<T> {
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
    public dequeue(): T {
        if (this.Count === 0) {
            throw new InvalidOperationException("queue is empty.");
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        this.count--;
        return item;
    }
    public enqueue(item: T): void {
        this.data.push(item);
        this.count++;
    }
    public peek(): T {
        if (this.Count === 0) {
            throw new InvalidOperationException("queue is empty.");
        }
        return this.data[0];
    }
    public toArray(): T[] {
        return [...this.data];
    }
    public get Count() { return this.count; }
}