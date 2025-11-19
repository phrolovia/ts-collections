import { describe, expect, test } from "vitest";
import { cartesian } from "../../../src/enumerator/functions/cartesian";

describe("#cartesian()", () => {
    test("should return cartesian product of two lists", () => {
        const list1 = [1, 2];
        const list2 = ["x", "y", "z"];
        const result = cartesian(list1, list2).toArray();
        const expected = [[1, "x"], [1, "y"], [1, "z"], [2, "x"], [2, "y"], [2, "z"]];
        expect(result).to.deep.equal(expected);
    });
    test("should return empty list if first list is empty", () => {
        const list1 = [] as never[];
        const list2 = ["x", "y", "z"];
        const result = cartesian(list1, list2).toArray();
        expect(result).to.deep.equal([]);
    });
    test("should return empty list if second list is empty", () => {
        const list1 = [1, 2];
        const list2 = [] as never[];
        const result = cartesian(list1, list2).toArray();
        expect(result).to.deep.equal([]);
    });
});
