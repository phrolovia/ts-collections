import { describe, expect, test } from "vitest";
import { range } from "../../../src/enumerator/functions/range";
import { shuffle } from "../../../src/enumerator/functions/shuffle";

describe("#shuffle()", () => {
    test("should shuffle the sequence", () => {
        const sequence = range(1, 40);
        const shuffled = shuffle(sequence).toArray();
        expect(shuffled).to.not.deep.equal(sequence.toArray());
    });
});
