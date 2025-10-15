export type UnpackIterableTuple<T extends readonly Iterable<unknown>[]> = {
    [K in keyof T]: T[K] extends Iterable<infer U> ? U : never;
}
