import { describe, expect, test } from "vitest";
import { toSortedSet } from "../../../src/enumerator/functions/toSortedSet";
import { SortedSet } from "../../../src/set/SortedSet";

describe("#toSortedSet()", () => {
    test("should return a sorted set", () => {
        const sortedSet = toSortedSet([3, 5, 4, 2, 1]);
        expect(sortedSet instanceof SortedSet).to.be.true;
        expect(sortedSet.size()).to.eq(5);
        expect(sortedSet.length).to.eq(5);
        expect(sortedSet.elementAt(0)).to.eq(1);
        expect(sortedSet.elementAt(1)).to.eq(2);
        expect(sortedSet.elementAt(2)).to.eq(3);
        expect(sortedSet.elementAt(3)).to.eq(4);
        expect(sortedSet.elementAt(4)).to.eq(5);
    });
});
