import { describe, expect, test } from "vitest";
import { forEach } from "../../../src/enumerator/functions/forEach";
import { where } from "../../../src/enumerator/functions/where";

describe("#forEach()", () => {
    test("should loop over the enumerable", () => {
        const result: number[] = [];
        forEach(where([1, 2, 3, 4, 5, 6], n => n % 2 === 0), n => result.push(n));
        expect(result).to.deep.equal([2, 4, 6]);
    });
});
