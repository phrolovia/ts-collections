import { describe, expect, test } from "vitest";
import { toStack } from "../../../src/enumerator/functions/toStack";
import { Stack } from "../../../src/stack/Stack";

describe("#toStack()", () => {
    test("should return a stack", () => {
        const stack = toStack([1, 2, 3, 4, 5]);
        expect(stack instanceof Stack).to.be.true;
        expect(stack.size()).to.eq(5);
        expect(stack.length).to.eq(5);
        expect(stack.toArray()).to.deep.equal([5, 4, 3, 2, 1]);
    });
});
