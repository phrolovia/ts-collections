import { describe, expect, test } from "vitest";
import { rotate } from "../../../src/enumerator/functions/rotate";

describe("#rotate", () => {
    const sequence = [1, 2, 3, 4, 5];
    test("should left rotate the sequence by 2", () => {
        const result = rotate(sequence, 2).toArray();
        expect(result).to.deep.equal([3, 4, 5, 1, 2]);
    });
    test("should right rotate the sequence by 2", () => {
        const result = rotate(sequence, -2).toArray();
        expect(result).to.deep.equal([4, 5, 1, 2, 3]);
    });
});
