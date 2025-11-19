import { describe, expect, test } from "vitest";
import { interleave } from "../../../src/enumerator/functions/interleave";
import { Queue } from "../../../src/queue/Queue";

describe("#interleave()", () => {
    test("should return an interleaved list", () => {
        const set = new Set([1, 2, 3]);
        const queue = new Queue([false, true, false]);
        const result = interleave(set, queue).toArray();
        const expected = [1, false, 2, true, 3, false];
        expect(result).to.deep.equal(expected);
    });
})
