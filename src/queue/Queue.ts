import { ICollection } from "../core/ICollection";
import { InvalidOperationException } from "../exceptions/InvalidOperationException";

export class Queue<T> implements ICollection<T> {
    private data: T[] = [];
    public constructor(data?: T[]) {
        if (data) {
            this.data = [...data];
        }
    }
    public add(item: T): boolean {
        this.enqueue(item);
        return true;
    }
    public clear(): void {
        this.data.length = 0;
    }
    public contains(item: T): boolean {
        return this.data.findIndex(d => d === item) > -1;
    }
    public dequeue(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("queue is empty.");
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }
    public enqueue(item: T): void {
        this.data.push(item);
    }
    public isEmpty(): boolean {
        return this.data.length === 0;
    }
    public peek(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("queue is empty.");
        }
        return this.data[0];
    }
    public size(): number {
        return this.data.length;
    }
    public toArray(): T[] {
        return [...this.data];
    }
}