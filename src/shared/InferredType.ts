import {Class} from "./Class";

export type InferredType<T> = T extends Object
    ? Object : T extends "object" ? Object
    : T extends Number
        ? Number : T extends "number" ? Number
        : T extends String
            ? String : T extends "string" ? String
            : T extends Boolean
                ? Boolean : T extends "boolean" ? Boolean
                : T extends Symbol
                    ? Symbol : T extends "symbol" ? Symbol
                    : T extends BigInt
                        ? BigInt : T extends "bigint" ? BigInt
                        : T extends Function
                            ? Function : T extends "function" ? Function
                            : T extends Class<infer R> ? R : T;