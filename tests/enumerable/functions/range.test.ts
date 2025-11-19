import { describe, expect, test } from "vitest";
import { range } from "../../../src/enumerator/functions/range";

describe("#range()", () => {
    const enumerable = range(1, 5);
    test("should create a list of increasing numbers starting with 1", () => {
        expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
    test("should create an enumerable that can be queried", () => {
        const max = range(1, 10).select(n => Math.pow(n, 3)).max();
        expect(max).to.eq(1000);
    });
});
