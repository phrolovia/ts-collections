import { describe, expect, test } from "vitest";
import { SortedDictionary } from "../../../src/dictionary/SortedDictionary";
import { toSortedDictionary } from "../../../src/enumerator/functions/toSortedDictionary";

describe("#toSortedDictionary()", () => {
    test("should return a sorted dictionary", () => {
        const sortedDictionary = toSortedDictionary([3, 5, 4, 2, 1], n => n, n => n * n);
        expect(sortedDictionary instanceof SortedDictionary).to.be.true;
        expect(sortedDictionary.get(1)).to.eq(1);
        expect(sortedDictionary.get(2)).to.eq(4);
        expect(sortedDictionary.get(3)).to.eq(9);
        expect(sortedDictionary.get(4)).to.eq(16);
        expect(sortedDictionary.get(5)).to.eq(25);
    });
});
