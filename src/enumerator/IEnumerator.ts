export interface IBaseEnumerator {
    readonly Current: any;
    moveNext(): boolean;
    reset(): void;
}

export interface IEnumerator<T> extends IBaseEnumerator {
    readonly Current: T;
}