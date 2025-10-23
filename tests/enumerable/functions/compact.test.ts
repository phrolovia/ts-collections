import { describe, expect, expectTypeOf, test } from "vitest";
import { compact } from "../../../src/enumerator/functions/compact";

describe("#compact()", () => {
    test("should filter out null and undefined elements", () => {
        const list = [1, "a", null, false, undefined];
        const result = compact(list).toArray();
        const expected = [1, "a", false];
        expect(result).to.deep.equal(expected);
        expectTypeOf(result).toEqualTypeOf<Array<number | string | boolean>>();
    });
});
