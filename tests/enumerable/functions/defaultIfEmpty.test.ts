import { describe, expect, test } from "vitest";
import { defaultIfEmpty } from "../../../src/enumerator/functions/defaultIfEmpty";
import { toList } from "../../../src/enumerator/functions/toList";
import { List } from "../../../src/list/List";

describe("#defaultIfEmpty()", () => {
    test("should return the list if it is not empty", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = toList(defaultIfEmpty(list, 6));
        expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
    test("should return the default value if the list is empty", () => {
        const list = new List([]);
        const list2 = toList(defaultIfEmpty(list, 6));
        expect(list2.toArray()).to.deep.equal([6]);
    });
});
