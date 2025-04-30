/**
 * @remarks
 * For the type of args, do not use `unknown[]` since it breaks the return type of `ofType` methods.
 * Since I did not use this anywhere in a situation where it requires a parameter,
 * I've opted for the ` never ` type, but in a situation where it requires a parameter, this should be changed to `any[]`.
 */
export type Class<T> = new(...args: never[]) => T;
