import { describe, expect, test } from "vitest";
import { zip } from "../../../src/enumerator/functions/zip";

describe("#zip()", () => {
    const numbers = [1, 2, 3, 4];
    const strings = ["one", "two", "three"];
    test("should return array of tuples if predicate is not specified", () => {
        const zipped = zip(numbers, strings);
        expect(zipped.toArray()).to.deep.equal([[1, "one"], [2, "two"], [3, "three"]]);
    });
    test("should return array of strings if predicate is specified", () => {
        const zipped = zip(numbers, strings, (n, s) => `${n} ${s}`);
        expect(zipped.toArray()).to.deep.equal(["1 one", "2 two", "3 three"]);
    });
});
