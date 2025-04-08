import { Class } from "./Class";

/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type BooleanType = boolean | Boolean | BooleanConstructor | "boolean";
export type SymbolType = symbol | Symbol | SymbolConstructor | "symbol";
export type BigIntType = bigint | BigInt | BigIntConstructor | "bigint";
export type NumberType = number | Number | NumberConstructor | "number";

export type StringType = string | String | StringConstructor;
export type ObjectType = object | Object | ObjectConstructor;
export type FunctionType = Function | FunctionConstructor;

export type InferredType<T> =
    T extends SymbolType ? symbol :
        T extends BooleanType ? boolean :
            T extends NumberType ? number :
                T extends BigIntType ? bigint :
                    T extends "object" ? object :
                        T extends "function" ? Function :
                            T extends StringType ? string :
                                T extends Class<infer R> ? R :
                                    T extends FunctionType ? Function :
                                        T extends ObjectType ? object : T;
