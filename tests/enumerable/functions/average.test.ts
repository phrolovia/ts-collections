import { describe, expect, test } from "vitest";
import { average } from "../../../src/enumerator/functions/average";
import { List } from "../../../src/list/List";

describe("#average()", () => {
    test("should return the average of the list", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const avg = average(list);
        expect(avg).to.eq(3);
    });
    test("should return the average of the array with a selector", () => {
        const avg = average([{n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}], n => n.n);
        expect(avg).to.eq(3);
    });
    test("should throw an error if the list is empty", () => {
        const list = new List([]);
        expect(() => average(list)).to.throw();
    });
});
