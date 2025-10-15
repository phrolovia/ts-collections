export type UnpackAsyncIterableTuple<T extends readonly AsyncIterable<unknown>[]> = {
    [K in keyof T]: T[K] extends AsyncIterable<infer U> ? U : never;
};
