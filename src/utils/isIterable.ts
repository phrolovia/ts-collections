export const isIterable = <T>(obj: T | Iterable<T>): obj is Iterable<T> => {
    return obj != null && typeof (obj as Iterable<T>)[Symbol.iterator] === "function";
};
