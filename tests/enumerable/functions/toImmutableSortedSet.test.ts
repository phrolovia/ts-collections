import { describe, expect, test } from "vitest";
import { toImmutableSortedSet } from "../../../src/enumerator/functions/toImmutableSortedSet";
import { ImmutableSortedSet } from "../../../src/set/ImmutableSortedSet";

describe("#toImmutableSortedSet()", () => {
    test("should return an immutable sorted set", () => {
        const immutableSortedSet = toImmutableSortedSet([3, 5, 4, 2, 1]);
        expect(immutableSortedSet instanceof ImmutableSortedSet).to.be.true;
        expect(immutableSortedSet.size()).to.eq(5);
        expect(immutableSortedSet.length).to.eq(5);
        expect(immutableSortedSet.elementAt(0)).to.eq(1);
        expect(immutableSortedSet.elementAt(1)).to.eq(2);
        expect(immutableSortedSet.elementAt(2)).to.eq(3);
        expect(immutableSortedSet.elementAt(3)).to.eq(4);
        expect(immutableSortedSet.elementAt(4)).to.eq(5);
        expect(immutableSortedSet.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
});
