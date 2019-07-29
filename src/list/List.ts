import { IList } from "./IList";
import { ArgumentNullException } from "../exceptions/ArgumentNullException";
import { ArgumentOutOfRangeException } from "../exceptions/ArgumentOutOfRangeException";
import { ArgumentException } from "../exceptions/ArgumentException";

export class List<T> implements IList<T>, IterableIterator<T> {
    private count: number = 0;
    private data: T[] = [];
    // private enumerator: IEnumerator<T> = null;
    private iteratorIndex: number = 0;
    public constructor(data?: T[]){
        if(data) {
            this.data = [...data];
            this.count = this.data.length;
        }
    }
    public add(item: T) {
        this.data.push(item);
        this.count++;
    }
    public clear() {
        this.data.length = 0;
        this.count = 0;
    }
    public contains(item: T): boolean {
        return  this.indexOf(item) > -1;
    }
    // public copyTo(array: T[], arrayIndex: number): void {
    //     if (!array) {
    //         throw new ArgumentNullException("array is null.");
    //     }
    //     if (arrayIndex < 0) {
    //         throw new ArgumentOutOfRangeException("array index is less than 0.");
    //     }
    //     let index = arrayIndex;
    //     for(const item of this.data) {
    //         array.splice(index, 0, item);
    //         index++;
    //     }
    // }
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
        count      = count || this.Count-1;

        if (startIndex! < 0 || startIndex >= this.Count) {
            throw new ArgumentOutOfRangeException("startIndex is not a valid index.");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0.");
        }
        if (startIndex+count > this.Count) {
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
        if (startIndex < 0 || startIndex >= this.Count) {
            throw new ArgumentOutOfRangeException("startIndex is not a valid index.");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0.");
        }
        if (startIndex+count > this.Count) {
            throw new ArgumentOutOfRangeException("startIndex and count do not specify a valid section in the list.");
        }
        startIndex = startIndex || 0;
        count      = count || this.Count;
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
        if (index >= this.Count) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.Count}.`);
        }
        return this.data[index];
    }
    // public getEnumerator(): IEnumerator<T> {
    //     return this.getListEnumerator();
    // }
    // private getListEnumerator(): IBaseEnumerator {
    //     return new ListEnum(this.data);
    // }
    public indexOf(item: T): number {
        return this.data.findIndex(d => d === item);
    }
    public insert(index: number, item: T) {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (index >= this.Count) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.Count}.`);
        }
        this.data.splice(index, 0, item);
        this.count++;
    }
    public lastIndexOf(item: T): number {
        return this.data.lastIndexOf(item);
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
        const preCount = this.Count;
        this.data = this.data.filter(d => !predicate(d));
        this.count = this.data.length;
        return preCount - this.count;
    }
    public removeAt(index: number): void {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (index >= this.Count) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.Count}.`);
        }
        this.data.splice(index, 1);
        this.count--;
    }
    public removeRange(index: number, count: number): void {
        if (index < 0) {
            throw new ArgumentOutOfRangeException("index is less than 0.");
        }
        if (count < 0) {
            throw new ArgumentOutOfRangeException("count is less than 0.");
        }
        if (index+count > this.Count) {
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
        if (index >= this.Count) {
            throw new ArgumentOutOfRangeException(`index is greater than or equal to ${this.Count}.`);
        }
        this.data[index] = item;
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

    public next(): IteratorResult<T> {
        if (this.iteratorIndex >= this.Count) {
            this.iteratorIndex = 0;
            return { done: true, value: null };
        }
        return { done: false, value: this.data[this.iteratorIndex++] };
        // if (!this.enumerator) {
        //     this.enumerator = this.getEnumerator();
        // }
        // if(this.enumerator.moveNext()) {
        //     return { done: false, value: this.enumerator.Current };
        // }
        // this.enumerator.reset();
        // return { done: true, value: null };
    }
    [Symbol.iterator](): IterableIterator<T> {
        return this;
    }

    public get Count() { return this.count; }
}

// class ListEnum<T> implements IBaseEnumerator {
//     private data: T[];
//     private position: number = -1;
//     public constructor(data: T[]){
//         this.data = data;
//     }
//     public moveNext(): boolean {
//         this.position++;
//         return this.position < this.data.length;
//     }
//     public reset(): void {
//         this.position = -1;
//     }
//     public get Current(): T {
//         return this.data[this.position];
//     }
// }