import { describe, expect, test } from "vitest";
import { scan } from "../../../src/enumerator/functions/scan";
import { List } from "../../../src/list/List";

describe("#scan()", () => {
    test("should create a sequence of increasing numbers starting with 1", () => {
        const result = scan([1, 2, 3, 4], (acc, n) => acc + n);
        expect(result.toArray()).to.deep.equal([1, 3, 6, 10]);
    });
    test("should create a sequence of increasing numbers starting with 3", () => {
        const result = scan([1, 2, 3, 4, 5], (acc, n) => acc + n, 2);
        expect(result.toArray()).to.deep.equal([3, 5, 8, 12, 17]);
    });
    test("should create a sequence of increasing numbers starting with 1 #2", () => {
        const result = scan(new Set([1, 3, 12, 19, 33]), (acc, n) => acc + n, 0);
        expect(result.toArray()).to.deep.equal([1, 4, 16, 35, 68]);
    });
    test("should throw an error if the sequence is empty", () => {
        expect(() => scan(new List<number>(), (acc, n) => acc + n).toArray()).to.throw();
    });
});
