import { IList } from "./IList";
import { ArgumentNullException } from "../exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../exceptions/ArgumentOutOfRangeException";
import { ArgumentException } from "../exceptions/ArgumentException";
import { InvalidOperationException } from "../exceptions/InvalidOperationException";
import { IQueue } from "../queue/IQueue";
import { IDeque } from "../queue/IDeque";

export class List<T> implements IList<T>, IQueue<T>, IDeque<T> {
    private data: T[] = [];
    public constructor(data?: T[]) {
        if(data) {
            this.data = [...data];
        }
    }
    public add(item: T): boolean {
        this.data.push(item);
        return true;
    }
    public clear() {
        this.data.length = 0;
    }
    public contains(item: T): boolean {
        return  this.indexOf(item) > -1;
    }
    public dequeue(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("queue is empty.");
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }
    public dequeueLast(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("queue is empty.");
        }
        const item = this.data[this.data.length - 1];
        this.data.splice(this.data.length-1, 1);
        return item;
    }
    public enqueue(item: T): void {
        this.add(item);
    }
    public enqueueFirst(item: T): void {
        this.insert(0, item);
    }
    public exists(predicate: (item: T) => boolean): boolean {
        if (!predicate) {
            throw new ArgumentNullException("predicate is null.");
        }
        return this.data.some(predicate);
    }
    public find(predicate: (item: T) => boolean): T|null {
        const item = this.data.find(predicate);
        return item || null;
    }
    public findAll(predicate: (item: T) => boolean): List<T> {
        const foundData = this.data.filter(predicate);
        return new List<T>(foundData);
    }
    public findIndex(predicate: (item: T) => boolean, startIndex?: number, count?: number): number {
        if (!predicate) {
            throw new ArgumentNullException("predicate is null.");
        }
        
        startIndex = startIndex || 0;
        count      = count || this.size()-1;

        if (startIndex! < 0 || startIndex >= this.size()) {
            throw new ArgumentOutOfRangeException("startIndex is not a valid index.");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0.");
        }
        if (startIndex+count > this.size()) {
            throw new ArgumentOutOfRangeException("startIndex and count do not specify a valid section in the list.");
        }
        
        let found  = false;
        let foundIndex = -1;
        for (let ix = startIndex; ix < startIndex+count; ++ix) {
            found = predicate(this.data[ix]);
            if (found) {
                foundIndex = ix;
                break;
            }
        }
        return foundIndex;
    }
    public findLast(predicate: (item: T) => boolean): T {
        if (!predicate) {
            throw new ArgumentNullException("predicate is null.");
        }
        let found = false;
        let foundItem: T = null;
        for (let ix = this.data.length - 1; ix >= 0; --ix) {
            const elem = this.data[ix];
            found = predicate(elem);
            if (found) {
                foundItem = elem;
                break;
            }
        }
        return foundItem;
    }
    public findLastIndex(predicate: (item: T) => boolean, startIndex?: number, count?: number): number {
        if (!predicate) {
            throw new ArgumentNullException("predicate is null.");
        }
        if (startIndex < 0 || startIndex >= this.size()) {
            throw new ArgumentOutOfRangeException("startIndex is not a valid index.");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0.");
        }
        if (startIndex+count > this.size()) {
            throw new ArgumentOutOfRangeException("startIndex and count do not specify a valid section in the list.");
        }
        startIndex = startIndex || 0;
        count      = count || this.size();
        let found  = false;
        let foundIndex = -1;
        for (let ix = startIndex+count-1; ix >= startIndex; --ix) {
            found = predicate(this.data[ix]);
            if (found) {
                foundIndex = ix;
                break;
            }
        }
        return foundIndex;
    }
    public forEach(action: (item: T) => void): void {
        if (!action) {
            throw new ArgumentNullException("action is null.");
        }
        this.data.forEach(d => d ? action(d) : void 0);
    }
    public get(index: number): T {
        if (index == null) {
            throw new ArgumentNullException("index is null.");
        }
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (index >= this.size()) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.size()}.`);
        }
        return this.data[index];
    }
    public indexOf(item: T): number {
        return this.data.findIndex(d => d === item);
    }
    public insert(index: number, item: T) {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (index !== 0 && index >= this.size()) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.size()}.`);
        }
        this.data.splice(index, 0, item);
    }
    public isEmpty(): boolean {
        return this.data.length === 0;
    }
    public lastIndexOf(item: T): number {
        return this.data.lastIndexOf(item);
    }
    public peek(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("queue is empty.");
        }
        return this.get(0);
    }
    public peekLast(): T {
        if (this.isEmpty()) {
            throw new InvalidOperationException("queue is empty.");
        }
        return this.get(this.size() - 1);
    }
    public poll(): T {
        if (this.isEmpty()) {
            return null;
        }
        const item = this.data[0];
        this.data.splice(0, 1);
        return item;
    }
    public pollLast(): T {
        if (this.isEmpty()) return null;
        const item = this.data[this.size() - 1];
        this.data.splice(this.size() - 1, 1);
        return item;
    }
    public remove(item: T): boolean {
        const index = this.findIndex(d => d === item);
        if (index === -1) return false;
        this.removeAt(index);
        return true;
    }
    public removeAll(predicate: (value: T) => boolean): number {
        if (!predicate) {
            throw new ArgumentNullException("predicate is null.");
        }
        const preCount = this.data.length;
        this.data = this.data.filter(d => !predicate(d));
        return preCount - this.data.length;
    }
    public removeAt(index: number): void {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (index >= this.size()) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.size()}.`);
        }
        this.data.splice(index, 1);
    }
    public removeRange(index: number, count: number): void {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0.");
        }
        if (index+count > this.size()) {
            throw new ArgumentException("index and count do not denote a valid range of elements in the list.");
        }
        let removedCount = 0;
        while(removedCount < count) {
            this.removeAt(index);
            removedCount++;
        }
    }
    public reverse(): void {
        this.data.reverse();
    }
    public set(index: number, item: T): void {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (index >= this.size()) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.size()}.`);
        }
        this.data[index] = item;
    }
    public size(): number {
        return this.data.length;
    }
    public sort(comparer?: (e1: T, e2: T) => number): void {
        if (!comparer) {
            comparer = (e1: T, e2: T) => e1 > e2 ? 1 : -1;
        }
        this.data.sort(comparer);
    }
    public toArray(): T[] {
        return [...this.data];
    }
}