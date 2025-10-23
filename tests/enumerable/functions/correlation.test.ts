import { describe, expect, test } from "vitest";
import { correlation } from "../../../src/enumerator/functions/correlation";
import { DimensionMismatchException } from "../../../src/shared/DimensionMismatchException";
import { InsufficientElementException } from "../../../src/shared/InsufficientElementException";

describe("#correlation()", () => {
    test("should return correlation of two lists", () => {
        const list1 = [1, 2, 3, 4, 5];
        const list2 = [2, 4, 6, 8, 10];
        const result = correlation(list1, list2);
        expect(result).to.eq(1);
    });
    test("should return correlation of two lists #2", () => {
        const list1 = [3,28,10,15];
        const list2 = [2,0,2,5];
        const result = correlation(list1, list2);
        expect(result).to.be.closeTo(-0.3831, 0.0001);
    });
    test("should return 1 for identical lists", () => {
        const list1 = [1, 2, 3, 4, 5];
        const list2 = [1, 2, 3, 4, 5];
        const result = correlation(list1, list2);
        expect(result).to.eq(1);
    });
    test("should throw error if lists have different sizes", () => {
        const list1 = [1, 2, 3, 4, 5];
        const list2 = [2, 4, 6, 8];
        expect(() => correlation(list1, list2)).toThrowError(
            new DimensionMismatchException()
        );
    });
    test("should throw error if lists are empty", () => {
        const list1 = [] as number[];
        const list2 = [] as number[];
        expect(() => correlation(list1, list2)).toThrowError(
            new InsufficientElementException("Correlation requires at least two pairs of elements.")
        );
    });
    test("should throw error if lists have only one element", () => {
        const list1 = [1];
        const list2 = [2];
        expect(() => correlation(list1, list2)).toThrowError(
            new InsufficientElementException("Correlation requires at least two pairs of elements.")
        );
    });
});
