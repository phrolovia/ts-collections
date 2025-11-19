import { describe, expect, test } from "vitest";
import { zipMany } from "../../../src/enumerator/functions/zipMany";

describe("#zipMany()", () => {
    test("should zip multiple arrays", () => {
        const list1 = [1, 2, 3];
        const list2 = ["a", "b", "c"];
        const list3 = [false, true, false];
        const zipped = zipMany(list1, list2, list3).toArray();
        expect(zipped).to.deep.equal(
            [
                [1, "a", false],
                [2, "b", true],
                [3, "c", false]
            ]
        );
    });
});
