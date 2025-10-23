import { describe, expect, test } from "vitest";
import { distinctUntilChanged } from "../../../src/enumerator/functions/distinctUntilChanged";

describe("#distinctUntilChanged()", () => {
    test("should return distinct contiguous elements", () => {
        const list = [1, 1, 2, 2, 2, 1, 3, 3];
        const distinct = distinctUntilChanged(list).toArray();
        expect(distinct).to.deep.equal([1, 2, 1, 3]);
    });
    test("should return empty list if source is empty", () => {
        const list = [] as string[];
        const distinct = distinctUntilChanged(list).toArray();
        expect(distinct).to.deep.equal([]);
    });
    test("should use provided comparator for key comparison", () => {
        const list = ["a", "a", "A", "b"];
        const distinctWithoutComparator = distinctUntilChanged(list).toArray();
        const distinctWithComparator = distinctUntilChanged(list, (e1, e2) => e1.toLowerCase().localeCompare(e2.toLowerCase()) === 0).toArray();
        expect(distinctWithoutComparator).to.deep.equal(["a", "A", "b"]);
        expect(distinctWithComparator).to.deep.equal(["a", "b"]);
    });
});
