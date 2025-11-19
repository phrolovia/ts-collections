import { describe, expect, test } from "vitest";
import { repeat } from "../../../src/enumerator/functions/repeat";

describe("#repeat()", () => {
    const arrayOfFives = repeat(5, 5).toArray();
    test("should create an array of 5s with the length of 5", () => {
        expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
    });
    test("should create an enumerable that can be queried", () => {
        const sum = repeat(10, 10).sum(n => n);
        expect(sum).to.eq(100);
    });
});
