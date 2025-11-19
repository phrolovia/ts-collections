import { describe, expect, test } from "vitest";
import { toObject } from "../../../src/enumerator/functions/toObject";

describe("#toObject()", () => {
    test("should return an object", () => {
        const obj = toObject([["a", 1], ["b", 2], ["c", 3]], t => t[0], t => t[1]);
        expect(obj).to.deep.equal({a: 1, b: 2, c: 3});
    });
});
