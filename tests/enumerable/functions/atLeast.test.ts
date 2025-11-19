import { describe, expect, test } from "vitest";
import { atLeast } from "../../../src/enumerator/functions/atLeast";
import { InvalidArgumentException } from "../../../src/shared/InvalidArgumentException";

describe("#atLeast()", () => {
    test("should return true if there are at least 3 elements greater than 5", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atLeast(list, 3, n => n > 5);
        expect(result).to.eq(true);
    });
    test("should return false if there are not at least 5 elements greater than 5", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atLeast(list, 5, n => n > 5);
        expect(result).to.eq(false);
    });
    test("should return true if there are at least 1 element in the list", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atLeast(list, 1);
        expect(result).to.eq(true);
    });
    test("should return false if there are not at least 1 element in the list", () => {
        const list = [] as number[];
        const result = atLeast(list, 1);
        const result2 = atLeast(list, 0);
        expect(result).to.eq(false);
        expect(result2).to.eq(true);
    });
    test("should throw error if count is less than 0", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        expect(() => atLeast(list, -1)).toThrowError(
            new InvalidArgumentException("Count must be greater than or equal to 0.", "count")
        );
    });
});
