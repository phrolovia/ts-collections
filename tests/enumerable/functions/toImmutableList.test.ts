import { describe, expect, test } from "vitest";
import { toImmutableList } from "../../../src/enumerator/functions/toImmutableList";
import { ImmutableList } from "../../../src/list/ImmutableList";

describe("#toImmutableList()", () => {
    test("should return an immutable list", () => {
        const immutableList = toImmutableList([1, 2, 3, 4, 5]);
        expect(immutableList instanceof ImmutableList).to.be.true;
        expect(immutableList.size()).to.eq(5);
        expect(immutableList.length).to.eq(5);
    });
});
