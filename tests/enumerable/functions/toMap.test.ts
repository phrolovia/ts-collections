import { describe, expect, test } from "vitest";
import { toMap } from "../../../src/enumerator/functions/toMap";

describe("#toMap()", () => {
    test("should return a map", () => {
        const map = toMap([["a", 1], ["b", 2], ["c", 3]], t => t[0], t => t[1]);
        expect(map instanceof Map).to.be.true;
        expect(map.size).to.eq(3);
        expect(map.get("a")).to.eq(1);
        expect(map.get("b")).to.eq(2);
        expect(map.get("c")).to.eq(3);
    });
});
