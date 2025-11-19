import { describe, expect, test } from "vitest";
import { any } from "../../../src/enumerator/functions/any";

describe("#any()", () => {
    test("should have at least one element that is even", () => {
        const anyEven = any([1, 2, 3, 5, 7], n => n % 2 === 0);
        expect(anyEven).to.be.true;
    });
    test("should not have any elements that are even", () => {
        const anyEven = any([1, 3, 5, 7, 9], n => n % 2 === 0);
        expect(anyEven).to.be.false;
    });
    test("should return true if no predicate is provided and the sequence is not empty", () => {
        const anyEven = any([1, 3, 5, 7, 9]);
        expect(anyEven).to.be.true;
    });
    test("should return false if no predicate is provided and the sequence is empty", () => {
        const anyEven = any([]);
        expect(anyEven).to.be.false;
    });
});
