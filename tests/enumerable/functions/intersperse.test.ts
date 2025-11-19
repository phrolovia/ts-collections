import { describe, expect, test } from "vitest";
import { intersperse } from "../../../src/enumerator/functions/intersperse";
import { List } from "../../../src/list/List";

describe("#intersperse()", () => {
    test("should intersperse the list with a separator", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const result = intersperse(list, 0);
        expect(result.toArray()).to.deep.equal([1, 0, 2, 0, 3, 0, 4, 0, 5]);
    });
    test("should intersperse string with a separator", () => {
        const result = intersperse("ALICE", "-").aggregate((total, next) => total + next, "");
        expect(result).to.eq("A-L-I-C-E");
    });
});
