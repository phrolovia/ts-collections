import { describe, expect, test } from "vitest";
import { elementAt } from "../../../src/enumerator/functions/elementAt";
import { List } from "../../../src/list/List";

describe("#elementAt()", () => {
    test("should return the element at the index", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(elementAt(list, 2)).to.eq(3);
    });
    test("should throw an error if the index is out of bounds", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(() => elementAt(list, 5)).to.throw();
    });
});
