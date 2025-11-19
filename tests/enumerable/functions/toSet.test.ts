import { describe, expect, test } from "vitest";
import { toSet } from "../../../src/enumerator/functions/toSet";

describe("#toSet()", () => {
    test("should return a set", () => {
        const set = toSet([1, 2, 3, 4, 5]);
        expect(set instanceof Set).to.be.true;
        expect(set.size).to.eq(5);
        expect(set.has(1)).to.be.true;
        expect(set.has(2)).to.be.true;
        expect(set.has(3)).to.be.true;
        expect(set.has(4)).to.be.true;
        expect(set.has(5)).to.be.true;
    });
});
