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

export type ObjectType<T = unknown> =
    | PrimitiveSymbol | "symbol"
    | PrimitiveBoolean | "boolean"
    | PrimitiveNumber | "number"
    | PrimitiveBigInt | "bigint"
    | Class<T>
    // eslint-disable-next-line @typescript-eslint/ban-types
    | Function | "function"
    | PrimitiveObject | "object"
    | PrimitiveString | "string";

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
