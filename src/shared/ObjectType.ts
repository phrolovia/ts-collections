import {Class} from "./Class";

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

class PrimitiveSymbol {
    static [Symbol.hasInstance] = (x: unknown) => typeof x === 'symbol';
}

export type ObjectType<T = any> =
    PrimitiveObject | "object"
    | PrimitiveSymbol | "symbol"
    | PrimitiveString | "string"
    | PrimitiveNumber | "number"
    | PrimitiveBoolean | "boolean"
    | Function | "function"
    | Class<T>;

export const ClassType = (type: ObjectType) => {
    const name = (type as Class<ObjectType>).name;
    return name === "Number"
        ? PrimitiveNumber
        : name === "String"
            ? PrimitiveString
            : name === "Boolean"
                ? PrimitiveBoolean
                : name === "Object"
                    ? PrimitiveObject
                    : name === "Symbol"
                        ? PrimitiveSymbol
                        : type;
}