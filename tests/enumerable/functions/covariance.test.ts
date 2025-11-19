import { describe, expect, test } from "vitest";
import { covariance } from "../../../src/enumerator/functions/covariance";
import { DimensionMismatchException } from "../../../src/shared/DimensionMismatchException";
import { InsufficientElementException } from "../../../src/shared/InsufficientElementException";

describe("#covariance", () => {
    test("should return covariance of two lists", () => {
        const list1 = [1, 2, 3, 4, 5];
        const list2 = [2, 4, 6, 8, 10];
        const sampleCovariance = covariance(list1, list2);
        const populationCovariance = covariance(list1, list2, x => x, y => y, false);
        expect(sampleCovariance).to.eq(5);
        expect(populationCovariance).to.eq(4);
    });
    test("should throw error if lists have different sizes", () => {
        const list1 = [1, 2, 3, 4, 5];
        const list2 = [2, 4, 6, 8];
        expect(() => covariance(list1, list2)).toThrowError(
            new DimensionMismatchException()
        );
    });
    test("should throw error if lists are empty", () => {
        const list1 = [] as number[];
        const list2 = [] as number[];
        expect(() => covariance(list1, list2)).toThrowError(
            new InsufficientElementException("Covariance requires at least two pairs of elements.")
        );
    });
    test("should throw error if lists have only one element", () => {
        const list1 = [1];
        const list2 = [2];
        expect(() => covariance(list1, list2)).toThrowError(
            new InsufficientElementException("Covariance requires at least two pairs of elements.")
        );
    });
    test("should return 0 if one list has no variance", () => {
        const list1 = [3, 3, 3, 3, 3];
        const list2 = [2, 4, 6, 8, 10];
        const result = covariance(list1, list2);
        expect(result).to.eq(0);
    });
    test("should return 0 if both lists have no variance", () => {
        const list1 = [3, 3, 3, 3, 3];
        const list2 = [7, 7, 7, 7, 7];
        const result = covariance(list1, list2);
        expect(result).to.eq(0);
    });
    test("should return negative covariance", () => {
        const list1 = [1, 2, 3, 4, 5];
        const list2 = [10, 8, 6, 4, 2];
        const result = covariance(list1, list2);
        expect(result).to.eq(-5);
    });
    test("should use selectors", () => {
        const list1 = [
            { value: 1 },
            { value: 2 },
            { value: 3 },
            { value: 4 },
            { value: 5 }
        ];
        const list2 = [
            { value: 2 },
            { value: 4 },
            { value: 6 },
            { value: 8 },
            { value: 10 }
        ];
        const result = covariance(list1, list2, x => x.value, y => y.value);
        expect(result).to.eq(5);
    });
});
