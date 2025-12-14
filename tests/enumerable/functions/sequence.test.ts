import { describe, test, expect } from "vitest";
import { sequence } from "../../../src/enumerator/functions/sequence";
import { InvalidArgumentException } from "../../../src/shared/InvalidArgumentException";

describe("#sequence()", () => {
    test("should create a sequence with given constraints", () => {
        const list = sequence(1, 10, 1);
        expect(list.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("should work with negative step", () => {
        const list = sequence(5, 1, -1);
        expect(list.toArray()).toEqual([5, 4, 3, 2, 1]);
    });
    test("should include end", () => {
        const list1 = sequence(1, 10, 2);
        const list2 = sequence(1, 11, 2);
        expect(list1.toArray()).toEqual([1, 3, 5, 7, 9]);
        expect(list2.toArray()).toEqual([1, 3, 5, 7, 9, 11]);
    });
    test("should include end with negative step", () => {
        const list1 = sequence(11, 2, -2);
        const list2 = sequence(11, 1, -2);
        expect(list1.toArray()).toEqual([11, 9, 7, 5, 3]);
        expect(list2.toArray()).toEqual([11, 9, 7, 5, 3, 1]);
    });
    test("should throw error if start is NaN", () => {
        expect(() => sequence(Number.NaN, 11, 2)).toThrow(InvalidArgumentException);
    });
    test("should throw error if end is NaN", () => {
        expect(() => sequence(1, Number.NaN, 1)).toThrow(InvalidArgumentException);
    });
    test("should throw error if step is NaN", () => {
        expect(() => sequence(1, 11, Number.NaN)).toThrow(InvalidArgumentException);
    });
    test("should throw error if step is greater than 0 and end is smaller than start", () => {
        expect(() => sequence(10, 2, 1)).toThrow(InvalidArgumentException);
    });
    test("should throw error if step is less than 0 and end is greater than start", () => {
        expect(() => sequence(1, 10, -1)).toThrow(InvalidArgumentException);
    });
    test("should throw error if step is 0 and end is not equal to start", () => {
        expect(() => sequence(1, 10, 0)).toThrow(InvalidArgumentException);
    });
    test("should return start if start is equal to end and step is 0", () => {
        const list = sequence(1, 1, 0);
        expect(list.toArray()).toEqual([1]);
    });
});
