import { describe, test, expect } from "vitest";
import { takeUntil } from "../../../src/enumerator/functions/takeUntil";

describe("#takeUntil()", () => {
    test("should return a sequence with [1,2,3]", () => {
        const list = [1, 2, 3, 4, 5];
        const result = takeUntil(list, n => n === 4).toArray();
        expect(result).to.deep.equal([1, 2, 3]);
    });
    test("should return an empty sequence when predicate is always true", () => {
        const list = [1, 2, 3, 4, 5];
        const result = takeUntil(list, () => true).toArray();
        expect(result).to.deep.equal([]);
    });
    test("should return full sequence when predicate never matches", () => {
        const list = [1, 2, 3, 4, 5];
        const result = takeUntil(list, () => false).toArray();
        expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });
    test("should exclude only the last element when predicate matches only there", () => {
        const list = [1, 2, 3, 4, 5];
        const result = takeUntil(list, n => n === 5).toArray();
        expect(result).to.deep.equal([1, 2, 3, 4]);
    });
    test("should pass correct index to predicate", () => {
        const list = [10, 20, 30];
        const called: Array<[number, number]> = [];

        takeUntil(list, (value, index) => {
            called.push([value, index]);
            return value === 30;
        }).toArray();

        expect(called).to.deep.equal([
            [10, 0],
            [20, 1],
            [30, 2]
        ]);
    });
    test("should stop evaluating after predicate matches", () => {
        let calls = 0;
        const result = takeUntil([1, 2, 3, 4, 5], n => {
            calls++;
            return n === 3;
        }).toArray();

        expect(result).to.deep.equal([1, 2]);
        expect(calls).to.equal(3);
    });
});
