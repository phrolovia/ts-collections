import { describe, expect, test } from "vitest";
import { select } from "../../../src/enumerator/functions/select";
import { List } from "../../../src/list/List";

describe("#select()", () => {
    test("should return an IEnumerable with elements [2,4,6,8,10]", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = select(list, n => n * 2).toList();
        expect(list2.size()).to.eq(5);
        expect(list2.get(0)).to.eq(2);
        expect(list2.get(1)).to.eq(4);
        expect(list2.get(2)).to.eq(6);
        expect(list2.get(3)).to.eq(8);
        expect(list2.get(4)).to.eq(10);
        expect(list2.length).to.eq(5);
    });
});
