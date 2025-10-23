import { describe, expect, test } from "vitest";
import { product } from "../../../src/enumerator/functions/product";

describe("#product()", () => {
    test("should return the product of the sequence", () => {
        const result = product([1, 2, 3, 4, 5]);
        expect(result).to.eq(120);
    });
    test("should return the product of the sequence with a selector", () => {
        const result = product([1, 2, 3, 4, 5], n => n * 2);
        expect(result).to.eq(3840);
    });
    test("should throw error if the sequence is empty", () => {
        expect(() => product([])).to.throw();
    });
});
