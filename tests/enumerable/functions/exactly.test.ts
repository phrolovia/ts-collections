import { describe, expect, test } from "vitest";
import { exactly } from "../../../src/enumerator/functions/exactly";
import { InvalidArgumentException } from "../../../src/shared/InvalidArgumentException";

describe("#exactly()", () => {
    test("should return true if list has exactly 3 elements", () => {
        const list = [1, 2, 3];
        expect(exactly(list, 3)).to.be.true;
    });
    test("should return false if list does not have exactly 3 elements", () => {
        const list = [1, 2, 3, 4];
        expect(exactly(list, 3)).to.be.false;
    });
    test("should return true if list has exactly 0 elements", () => {
        const list = [] as never[];
        expect(exactly(list, 0)).to.be.true;
    });
    test("should return false if list does not have exactly 0 elements", () => {
        const list = [1];
        expect(exactly(list, 0)).to.be.false;
    });
    test("should return false if predicate does not match exactly 3 elements", () => {
        const list = [1, 2, 3, 4, 5];
        expect(exactly(list, 3, n => n % 2 === 0)).to.be.false;
    });
    test("should return true if predicate matches exactly 2 elements", () => {
        const list = [1, 2, 3, 4, 5];
        expect(exactly(list, 2, n => n % 2 === 0)).to.be.true;
    });
    test("should throw error if count is less than 0", () => {
        const list = [1, 2, 3];
        expect(() => exactly(list, -1)).toThrowError(
            new InvalidArgumentException("Count must be greater than or equal to 0.", "count")
        );
    });
});
