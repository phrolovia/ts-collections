import { IndexOutOfBoundsException } from "../../../src/shared/IndexOutOfBoundsException";
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
    test("should index arrays directly and reject positions outside them", () => {
        const array = [10, 20, 30];
        expect(elementAt(array, 2)).to.equal(30);
        expect(() => elementAt(array, 3)).toThrow(IndexOutOfBoundsException);
        expect(() => elementAt(array, -1)).toThrow(IndexOutOfBoundsException);
        expect(() => elementAt(array, 1.5)).toThrow(IndexOutOfBoundsException);
    });
});
