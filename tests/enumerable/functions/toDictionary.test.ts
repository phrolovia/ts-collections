import { describe, expect, test } from "vitest";
import { Dictionary } from "../../../src/dictionary/Dictionary";
import { toDictionary } from "../../../src/enumerator/functions/toDictionary";

describe("#toDictionary()", () => {
    test("should return a dictionary with keys [1,2,3,4,5] and values [1,4,9,16,25]", () => {
        const dictionary = toDictionary([1, 2, 3, 4, 5], n => n, n => n * n);
        expect(dictionary instanceof Dictionary).to.be.true;
        expect(dictionary.get(1)).to.eq(1);
        expect(dictionary.get(2)).to.eq(4);
        expect(dictionary.get(3)).to.eq(9);
        expect(dictionary.get(4)).to.eq(16);
        expect(dictionary.get(5)).to.eq(25);
    });
});
