import { describe, expect, test } from "vitest";
import { pairwise } from "../../../src/enumerator/functions/pairwise";

describe("#pairwise()", () => {
    const sequence = ["a", "b", "c", "d", "e", "f"];
    test("should create pairs of elements", () => {
        const result = pairwise(sequence);
        expect(result.toArray()).to.deep.equal([["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"]]);
    });
    test("should create pairs of elements with a selector", () => {
        const result = pairwise(sequence, (a, b) => [`<${a}>`, `<${b}>`]);
        expect(result.toArray()).to.deep.equal([["<a>", "<b>"], ["<b>", "<c>"], ["<c>", "<d>"], ["<d>", "<e>"], ["<e>", "<f>"]]);
    });
});
