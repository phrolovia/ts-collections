import { describe, expect, test } from "vitest";
import { toImmutableStack } from "../../../src/enumerator/functions/toImmutableStack";
import { ImmutableStack } from "../../../src/stack/ImmutableStack";

describe("#toImmutableStack()", () => {
    test("should return an immutable stack", () => {
        const immutableStack = toImmutableStack([1, 2, 3, 4, 5]);
        expect(immutableStack instanceof ImmutableStack).to.be.true;
        expect(immutableStack.size()).to.eq(5);
        expect(immutableStack.length).to.eq(5);
    });
});
