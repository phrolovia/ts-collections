import { describe, expect, test } from "vitest";
import { cast } from "../../../src/enumerator/functions/cast";
import { where } from "../../../src/enumerator/functions/where";

describe("#cast()", () => {
    test("should cast the list to a new type", () => {
        const mixedSequence = [1, "2", 3, "4", 5];
        const numbers = cast<number>(where(mixedSequence, n => typeof n === "number"));
        const strings = cast<string>(where(mixedSequence, n => typeof n === "string"));
        expect(numbers.toArray()).to.deep.equal([1, 3, 5]);
        expect(strings.toArray()).to.deep.equal(["2", "4"]);
    });
});
