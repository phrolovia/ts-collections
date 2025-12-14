import { describe, test, expect } from "vitest";
import { infiniteSequence } from "../../../src";

describe("#infiniteSequence()", () => {
    test("should return an infinite sequence", () => {
        const sequence = infiniteSequence(1, 1);
        for (let ix = 0; ix < 10; ix++) {
            const item = sequence.elementAt(ix);
            expect(item).toBe(ix + 1);
            if (item === 10) break;
        }
    });
    test("should return an infinite sequence #2", () => {
        const sequence = infiniteSequence(1, 2);
        for (let ix = 0; ix < 10; ix++) {
            const item = sequence.elementAt(ix);
            expect(item).toBe(ix * 2 + 1);
            if (item === 20) break;
        }
    });
    test("should return an infinite sequence with a negative increment", () => {
        const sequence = infiniteSequence(10, -1);
        for (let ix = 0; ix < 10; ix++) {
            const item = sequence.elementAt(ix);
            expect(item).toBe(10 - ix);
            if (item === 1) break;
        }
    });
});
