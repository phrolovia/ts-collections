import { describe, expect, test } from "vitest";
import { index } from "../../../src/enumerator/functions/index";
import { List } from "../../../src/list/List";

describe("#index()", () => {
    test("should return a list of tuples with the index and the element", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const indexedList = index(list);
        expect(indexedList.toArray()).to.deep.equal([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
    });
});
