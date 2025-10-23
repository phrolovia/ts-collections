import { describe, expect, test } from "vitest";
import { skip } from "../../../src/enumerator/functions/skip";
import { List } from "../../../src/list/List";

describe("#skip()", () => {
    test("should return an IEnumerable with elements [4,5]", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = skip(list, 3).toList();
        expect(list2.size()).to.eq( 2);
        expect(list2.get(0)).to.eq(4);
        expect(list2.get(1)).to.eq(5);
        expect(list2.length).to.eq(2);
    });
    test("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = skip(list, 10).toList();
        expect(list2.size()).to.eq(0);
        expect(list2.length).to.eq(0);
    });
});
