import { describe, expect, test } from "vitest";
import { correlationBy } from "../../../src/enumerator/functions/correlationBy";

describe("#correlationBy()", () => {
    test("should return correlation of two lists based on selectors", () => {
        const list1 = [
            { value: 1, amount: 11 },
            { value: 2, amount: 22 },
            { value: 3, amount: 33 },
            { value: 4, amount: 44 },
            { value: 5, amount: 55 },
        ];
        const correlation = correlationBy(list1, x => x.value, x => x.amount);
        expect(correlation).to.eq(1);
    });
});
