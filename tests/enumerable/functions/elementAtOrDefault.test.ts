import { describe, expect, test } from "vitest";
import { elementAtOrDefault } from "../../../src/enumerator/functions/elementAtOrDefault";
import { List } from "../../../src/list/List";

describe("#elementAtOrDefault()", () => {
    test("should return the element at the index", () => {
        const result = elementAtOrDefault([1, 2, 3, 4, 5], 2);
        expect(result).to.eq(3);
    });
    test("should return null if the index is out of bounds", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(elementAtOrDefault(list, 5)).to.be.null;
    });
    test("should index arrays directly and return null outside them", () => {
        const array = [10, 20, 30];
        expect(elementAtOrDefault(array, 0)).to.equal(10);
        expect(elementAtOrDefault(array, 3)).to.be.null;
        expect(elementAtOrDefault(array, -1)).to.be.null;
        expect(elementAtOrDefault(array, 0.5)).to.be.null;
    });
});
