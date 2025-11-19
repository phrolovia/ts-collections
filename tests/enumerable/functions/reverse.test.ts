import { describe, expect, test } from "vitest";
import { reverse } from "../../../src/enumerator/functions/reverse";

describe("#reverse()", () => {
    const sequence = [1, 2, 3, 4, 5];
    test("should reverse the sequence", () => {
        const result = reverse(sequence);
        expect(sequence).to.deep.equal([1, 2, 3, 4, 5]);
        expect(result.toArray()).to.deep.equal([5, 4, 3, 2, 1]);
    });
});
