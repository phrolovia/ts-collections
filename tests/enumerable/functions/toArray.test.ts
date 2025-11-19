import { describe, expect, test } from "vitest";
import { toArray } from "../../../src/enumerator/functions/toArray";
import { List } from "../../../src/list/List";

describe("#toArray()", () => {
    test("should return an array of numbers", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const array = toArray(list);
        expect(array instanceof Array).to.be.true;
        expect(array).to.deep.equal([1, 2, 3, 4, 5]);
    });
});
