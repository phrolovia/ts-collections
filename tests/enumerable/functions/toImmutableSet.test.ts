import { describe, expect, test } from "vitest";
import { toImmutableSet } from "../../../src/enumerator/functions/toImmutableSet";
import { ImmutableSet } from "../../../src/set/ImmutableSet";

describe("#toImmutableSet()", () => {
    test("should return an immutable set", () => {
        const immutableSet = toImmutableSet([1, 2, 3, 4, 5]);
        expect(immutableSet instanceof ImmutableSet).to.be.true;
        expect(immutableSet.size()).to.eq(5);
        expect(immutableSet.length).to.eq(5);
    });
});
