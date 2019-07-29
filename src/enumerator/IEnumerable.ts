import { IEnumerator, IBaseEnumerator } from "./IEnumerator";

export interface IBaseEnumerable {
    getEnumerator(): IBaseEnumerator;
}

export interface IEnumerable<T> extends IBaseEnumerable {
    getEnumerator(): IEnumerator<T>;
}