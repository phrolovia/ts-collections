import { describe, expect, test } from "vitest";
import { toList } from "../../../src/enumerator/functions/toList";
import { List } from "../../../src/list/List";

describe("#toList()", () => {
    test("should return a list", () => {
        const list = toList([1, 2, 3, 4, 5]);
        expect(list instanceof List).to.be.true;
        expect(list.size()).to.eq(5);
        expect(list.length).to.eq(5);
    });
});
