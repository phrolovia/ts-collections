import { describe, expect, test } from "vitest";
import { take } from "../../../src/enumerator/functions/take";
import { List } from "../../../src/list/List";

describe("#take()", () => {
    test("should return a sequence with elements [1,2,3]", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = take(list, 3).toList();
        expect(list2.size()).to.eq(3);
        expect(list2.get(0)).to.eq(1);
        expect(list2.get(1)).to.eq(2);
        expect(list2.get(2)).to.eq(3);
        expect(list2.length).to.eq(3);
    });
    test("should return an empty sequence", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = take(list, 0).toList();
        expect(list2.size()).to.eq(0);
        expect(list2.length).to.eq(0);
    });
    test("should return all elements if the take count is greater than the sequence size", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = take(list, 10).toList();
        expect(list2.size()).to.eq(5);
        expect(list2.length).to.eq(5);
    });
});
