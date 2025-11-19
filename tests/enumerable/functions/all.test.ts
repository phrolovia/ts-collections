import { describe, expect, test } from "vitest";
import { all } from "../../../src/enumerator/functions/all";

describe("#all()", () => {
    test("should not have any elements that are not even", () => {
        const allEven = all([2, 4, 6, 8, 10], n => n % 2 === 0);
        expect(allEven).to.be.true;
    });
    test("should have at least one element that is not even", () => {
        const allEven = all([1, 2, 3, 5, 7], n => n % 2 === 0);
        expect(allEven).to.be.false;
    });
});
