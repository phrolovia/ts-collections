import { describe, expect, test } from "vitest";
import { ImmutableDictionary } from "../../../src/dictionary/ImmutableDictionary";
import { toImmutableDictionary } from "../../../src/enumerator/functions/toImmutableDictionary";

describe("#toImmutableDictionary()", () => {
    test("should return an immutable dictionary with keys [1,2,3,4,5] and values [1,4,9,16,25]", () => {
        const dictionary = toImmutableDictionary([1, 2, 3, 4, 5], n => n, n => n * n);
        expect(dictionary instanceof ImmutableDictionary).to.be.true;
        expect(dictionary.get(1)).to.eq(1);
        expect(dictionary.get(2)).to.eq(4);
        expect(dictionary.get(3)).to.eq(9);
        expect(dictionary.get(4)).to.eq(16);
        expect(dictionary.get(5)).to.eq(25);
    });
});
