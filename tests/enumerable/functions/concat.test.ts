import { describe, expect, test } from "vitest";
import { concat } from "../../../src/enumerator/functions/concat";
import { toList } from "../../../src/enumerator/functions/toList";
import { List } from "../../../src/list/List";

describe("#concat()", () => {
    test("should concatenate two lists", () => {
        const list1 = new List([1, 2, 3]);
        const list2 = new List([4, 5, 6]);
        const list3 = toList(concat(list1, list2));
        expect(list3.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6]);
    });
});
