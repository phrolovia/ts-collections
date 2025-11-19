import { describe, expect, test } from "vitest";
import { order } from "../../../src/enumerator/functions/order";
import "../../../src/enumerator/OrderedEnumerator";

describe("#order()", () => {
    test("should order numbers", () => {
        const unsorted =[4, 2, 3, 1, 5];
        const sorted = order(unsorted).toArray();
        expect(sorted).to.deep.equal([1, 2, 3, 4, 5]);
    });
    test("should use provided comparator", () => {
        const source = ["b", "a"];
        const sorted1 = order(source, (e1, e2) => e1.localeCompare(e2)).toArray();
        const sorted2 = order(source, (e1, e2) => -(e1.localeCompare(e2))).toArray();
        expect(sorted1).to.deep.equal(["a", "b"])
        expect(sorted2).to.deep.equal(["b", "a"]);
    });
});
