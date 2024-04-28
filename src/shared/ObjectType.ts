import { Class } from "./Class";

class PrimitiveNumber extends Number {
    static override readonly [Symbol.hasInstance] = (x: unknown) => typeof x === "number";
}

class PrimitiveString extends String {
    static override readonly [Symbol.hasInstance] = (x: unknown) => typeof x === "string";
}

class PrimitiveBoolean extends Boolean {
    static override readonly [Symbol.hasInstance] = (x: unknown) => typeof x === "boolean";
}

class PrimitiveObject extends Object {
    static override readonly [Symbol.hasInstance] = (x: unknown) => typeof x === "object";
}

class PrimitiveBigInt {
    static [Symbol.hasInstance] = (x: unknown) => typeof x === "bigint";
}

class PrimitiveSymbol {
    static [Symbol.hasInstance] = (x: unknown) => typeof x === 'symbol';
}

export type ObjectType<T = any> =
    PrimitiveObject | "object"
    | PrimitiveSymbol | "symbol"
    | PrimitiveString | "string"
    | PrimitiveNumber | "number"
    | PrimitiveBigInt | "bigint"
    | PrimitiveBoolean | "boolean"
    | Function | "function"
    | Class<T>;

export const ClassType = (type: ObjectType) => {
    const name = (type as Class<ObjectType>).name;
    if (name === "Number") {
        return PrimitiveNumber;
    } else if (name === "String") {
        return PrimitiveString;
    } else if (name === "Boolean") {
        return PrimitiveBoolean;
    } else if (name === "BigInt") {
        return PrimitiveBigInt;
    } else if (name === "Object") {
        return PrimitiveObject;
    } else if (name === "Symbol") {
        return PrimitiveSymbol;
    } else {
        return type;
    }
}