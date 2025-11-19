import { describe, expect, test } from "vitest";
import { step } from "../../../src/enumerator/functions/step";
import { List } from "../../../src/list/List";

describe("#step()", () => {
    test("should return an IEnumerable with elements [1,3,5]", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = step(list, 2).toList();
        expect(list2.size()).to.eq(3);
        expect(list2.get(0)).to.eq(1);
        expect(list2.get(1)).to.eq(3);
        expect(list2.get(2)).to.eq(5);
        expect(list2.length).to.eq(3);
    });
    test("should return an IEnumerable with only the first element", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = step(list, 10).toList();
        expect(list2.size()).to.eq(1);
        expect(list2.get(0)).to.eq(1);
    });
});
