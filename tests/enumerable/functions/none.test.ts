import { describe, expect, test } from "vitest";
import { none } from "../../../src/enumerator/functions/none";

describe("#none()", () => {
    test("should not have any elements that are not even", () => {
        const noneEven = none([1, 3, 5, 7, 9], n => n % 2 === 0);
        expect(noneEven).to.be.true;
    });
    test("should have at least one element that is not even", () => {
        const noneEven = none([1, 2, 3, 5, 7], n => n % 2 === 0);
        expect(noneEven).to.be.false;
    });
    test("should return true if sequence is empty", () => {
        const noneEven = none([]);
        expect(noneEven).to.be.true;
    });
});
