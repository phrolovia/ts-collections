import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { List } from "../../../src/list/List";

describe("#count()", () => {
    test("should return the number of elements in the list", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(count(list)).to.eq(5);
    });
    test("should return the number of elements in the array", () => {
        const array = [1, 2, 3, 4, 5];
        expect(count(array)).to.eq(5);
    });
    test("should return the number of elements in the set with a predicate", () => {
        const set = new Set([1, 2, 3, 4, 5]);
        expect(count(set, n => n % 2 === 0)).to.eq(2);
    });
});
