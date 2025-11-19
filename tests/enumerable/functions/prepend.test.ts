import { describe, expect, test } from "vitest";
import { prepend } from "../../../src/enumerator/functions/prepend";

describe("#prepend()", () => {
    const sequence = [1, 2, 3, 4, 5];
    test("should prepend 0 to the sequence", () => {
        const result = prepend(sequence, 0);
        expect(sequence).to.deep.equal([1, 2, 3, 4, 5]);
        expect(result.toArray()).to.deep.equal([0, 1, 2, 3, 4, 5]);
    });
});
