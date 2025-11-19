import { describe, expect } from "vitest";
import { reverseInPlace } from "../../src/utils/reverseInPlace";
import { List } from "../../src/list/List";

describe("#reverseInPlace", () => {
    test("should reverse elements in an array", () => {
        const arr = [1, 2, 3, 4, 5];
        reverseInPlace(arr);
        expect(arr).to.deep.equal([5, 4, 3, 2, 1]);
    });
    test("should reverse elements in an IList", () => {
        const list = new List([1, 2, 3, 4, 5]);
        reverseInPlace(list);
        expect(list.toArray()).to.deep.equal([5, 4, 3, 2, 1]);
    });
});
