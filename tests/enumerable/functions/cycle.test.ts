import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { cycle } from "../../../src/enumerator/functions/cycle";

describe("#cycle()", () => {
    test("should cycle through the list 3 times", () => {
        const list = cycle([1, 2, 3], 3);
        expect(count(list)).to.eq(9);
        expect(list.toArray()).to.deep.equal([1, 2, 3, 1, 2, 3, 1, 2, 3]);
    });
    test("should cycle through string 2 times", () => {
        const list = cycle("abc", 2);
        expect(list.toArray()).to.deep.equal(["a", "b", "c", "a", "b", "c"]);
    });
});
