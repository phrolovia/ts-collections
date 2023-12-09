import {IReadonlyDictionary} from "./IReadonlyDictionary";

export interface IImmutableDictionary<TKey, TValue> extends IReadonlyDictionary<TKey, TValue> {
    readonly length: number;
    add(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;
    clear(): IImmutableDictionary<TKey, TValue>;
    put(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;
    remove(key: TKey): IImmutableDictionary<TKey, TValue>;
    set(key: TKey, value: TValue): IImmutableDictionary<TKey, TValue>;
}