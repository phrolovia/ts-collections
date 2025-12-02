import { describe, test, expect } from "vitest";
import { skipUntil } from "../../../src/enumerator/functions/skipUntil";

describe("#skipUntil()", () => {
    test("should skip elements until predicate matches and include matching and following elements", () => {
        const list = [1, 2, 3, 4, 5];
        const result = skipUntil(list, n => n === 3).toArray();
        expect(result).to.deep.equal([3, 4, 5]);
    });

    test("should return the full sequence when predicate matches on the first element", () => {
        const list = [1, 2, 3, 4, 5];
        const result = skipUntil(list, () => true).toArray();
        expect(result).to.deep.equal([1, 2, 3, 4, 5]);
    });

    test("should return an empty sequence when predicate never matches", () => {
        const list = [1, 2, 3, 4, 5];
        const result = skipUntil(list, () => false).toArray();
        expect(result).to.deep.equal([]);
    });

    test("should return only the last element when predicate matches only on the last element", () => {
        const list = [1, 2, 3, 4, 5];
        const result = skipUntil(list, n => n === 5).toArray();
        expect(result).to.deep.equal([5]);
    });

    test("should pass correct value and index to predicate", () => {
        const list = [10, 20, 30];
        const calls: Array<[number, number]> = [];

        skipUntil(list, (value, index) => {
            calls.push([value, index]);
            return value === 20;
        }).toArray();

        expect(calls).to.deep.equal([
            [10, 0],
            [20, 1]
        ]);
    });

    test("should stop evaluating predicate after the first match", () => {
        const list = [1, 2, 3, 4, 5];
        let callCount = 0;

        const result = skipUntil(list, n => {
            callCount++;
            return n === 3;
        }).toArray();

        expect(result).to.deep.equal([3, 4, 5]);
        expect(callCount).to.equal(3); // predicate evaluated only for 1, 2, 3
    });

    test("should return an empty sequence when source is empty", () => {
        const list: number[] = [];
        const result = skipUntil(list, n => n === 1).toArray();
        expect(result).to.deep.equal([]);
    });
});
