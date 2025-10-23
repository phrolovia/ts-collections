import { describe, expect, test } from "vitest";
import { atMost } from "../../../src/enumerator/functions/atMost";
import { InvalidArgumentException } from "../../../src/shared/InvalidArgumentException";

describe("#atMost()", () => {
    test("should return true if there are at most 3 elements greater than 6", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atMost(list, 3, n => n > 6);
        expect(result).to.eq(true);
    });
    test("should return false if there are not at most 2 elements greater than 5", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atMost(list, 2, n => n > 5);
        expect(result).to.eq(false);
    });
    test("should return true if there are at most 10 element in the list", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atMost(list, 10);
        expect(result).to.eq(true);
    });
    test("should return false if there are not at most 0 element in the list", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        const result = atMost(list, 0);
        expect(result).to.eq(false);
    });
    test("should throw error if count is less than 0", () => {
        const list = [1, 2, 3, 6, 7, 8, 9];
        expect(() => atMost(list, -1)).toThrowError(
            new InvalidArgumentException("Count must be greater than or equal to 0.", "count")
        );
    });
});
