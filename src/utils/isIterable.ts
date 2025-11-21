export const isIterable = <T>(obj: T | Iterable<T>): obj is Iterable<T> => {
    return typeof (obj as Iterable<T>)[Symbol.iterator] === "function";
};
