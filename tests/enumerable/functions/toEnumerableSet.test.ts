import { describe, expect, test } from "vitest";
import { toEnumerableSet } from "../../../src/enumerator/functions/toEnumerableSet";
import { EnumerableSet } from "../../../src/set/EnumerableSet";

describe("#toEnumerableSet()", () => {
    test("should return an enumerable set", () => {
        const enumerableSet = toEnumerableSet([1, 2, 3, 4, 5]);
        expect(enumerableSet instanceof EnumerableSet).to.be.true;
        expect(enumerableSet.size()).to.eq(5);
        expect(enumerableSet.length).to.eq(5);
    });
});
