import { describe, expect, test } from "vitest";
import { skipLast } from "../../../src/enumerator/functions/skipLast";
import { List } from "../../../src/list/List";

describe("#skipLast()", () => {
    test("should return an IEnumerable with elements [1,2,3,4]", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = skipLast(list, 1).toList();
        expect(list2.size()).to.eq(4);
        expect(list2.get(0)).to.eq(1);
        expect(list2.get(1)).to.eq(2);
        expect(list2.get(2)).to.eq(3);
        expect(list2.get(3)).to.eq(4);
        expect(list2.length).to.eq(4);
    });
    test("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = skipLast(list, 10).toList();
        expect(list2.size()).to.eq(0);
        expect(list2.length).to.eq(0);
    });
});
