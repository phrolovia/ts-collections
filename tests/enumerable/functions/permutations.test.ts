import { describe, expect, test } from "vitest";
import { permutations } from "../../../src/enumerator/functions/permutations";

describe("#permutations()", () => {
    test("should return all permutations of the sequence", () => {
        const result = permutations([1, 2, 3]);
        expect(result.select(p => p.toArray()).toArray()).to.deep.equal([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]);
    });
    test("should return all permutations of the string", () => {
        const result = permutations("RUI");
        const perms = result.select(p => p.toArray().join(""));
        expect(perms.toArray()).to.deep.equal(["RUI", "RIU", "URI", "UIR", "IRU", "IUR"]);
    });
});
