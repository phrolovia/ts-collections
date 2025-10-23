import { describe, expect, test } from "vitest";
import { orderDescending } from "../../../src/enumerator/functions/orderDescending";

describe("#orderDescending()", () => {
    test("should order numbers", () => {
        const unsorted = [4, 2, 3, 1, 5];
        const sorted = orderDescending(unsorted).toArray();
        expect(sorted).to.deep.equal([5, 4, 3, 2, 1]);
    });
    test("should use provided comparator", () => {
        const source = ["b", "a"];
        const sorted1 = orderDescending(source, (e1, e2) => e1.localeCompare(e2)).toArray();
        const sorted2 = orderDescending(source, (e1, e2) => -(e1.localeCompare(e2))).toArray();
        expect(sorted1).to.deep.equal(["b", "a"])
        expect(sorted2).to.deep.equal(["a", "b"]);
    });
});
