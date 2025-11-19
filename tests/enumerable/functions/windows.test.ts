import { describe, expect, test } from "vitest";
import { windows } from "../../../src/enumerator/functions/windows";

describe("#windows()", () => {
    test("should return a sequence of windows", () => {
        const sequence = [1, 2, 3, 4, 5];
        const windowsList = windows(sequence, 3).select(w => w.toArray()).toArray();
        expect(windowsList).to.deep.equal([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
    });
});
