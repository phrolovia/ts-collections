import { describe, expect, test } from "vitest";
import { ImmutableSortedDictionary } from "../../../src/dictionary/ImmutableSortedDictionary";
import { toImmutableSortedDictionary } from "../../../src/enumerator/functions/toImmutableSortedDictionary";

describe("#toImmutableSortedDictionary()", () => {
    test("should return an immutable sorted dictionary", () => {
        const immutableSortedDictionary = toImmutableSortedDictionary([3, 5, 4, 2, 1], n => n, n => n * n);
        expect(immutableSortedDictionary instanceof ImmutableSortedDictionary).to.be.true;
        expect(immutableSortedDictionary.get(1)).to.eq(1);
        expect(immutableSortedDictionary.get(2)).to.eq(4);
        expect(immutableSortedDictionary.get(3)).to.eq(9);
        expect(immutableSortedDictionary.get(4)).to.eq(16);
        expect(immutableSortedDictionary.get(5)).to.eq(25);
        expect(immutableSortedDictionary.keys().toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
});
