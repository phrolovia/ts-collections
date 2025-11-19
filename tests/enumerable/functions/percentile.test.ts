import { describe, expect, test } from "vitest";
import { percentile } from "../../../src/enumerator/functions/percentile";

describe("#percentile()", () => {
    test("should return percentile of the list for 0.25", () => {
        const list = [1, 2, 3, 4, 5];
        const result = percentile(list, 0.25);
        expect(result).to.equal(2.0);
    });
    test("should return percentile of the list for 0.5", () => {
        const list = [1, 2, 3, 4, 5];
        const result = percentile(list, 0.5);
        expect(result).to.equal(3);
    });
    test("should return percentile of the list for 0.75 with 'nearest' strategy", () => {
        const list = [1, 2, 3, 4, 5];
        const result = percentile(list, 0.75, x => x, "nearest");
        expect(result).to.equal(4);
    });
    test("should return percentile of the list for 0.5 with 'low' strategy", () => {
        const list = [1, 2, 3, 4];
        const result = percentile(list, 0.5, x => x, "low");
        expect(result).to.equal(2);
    });
    test("should return percentile of the list for 0.5 with 'high' strategy", () => {
        const list = [1, 2, 3, 4];
        const result = percentile(list, 0.5, x => x, "high");
        expect(result).to.equal(3);
    });
    test("should return percentile of the list for 0.5 with 'midpoint' strategy", () => {
        const list = [1, 2, 3, 10];
        const result = percentile(list, 0.5, x => x, "midpoint");
        expect(result).to.equal(2.5);
    });
    test("should use provided selector", () => {
        const list = [
            { value: 10 },
            { value: 20 },
            { value: 30 }
        ];
        const result = percentile(list, 0.9, x => x.value);
        expect(result).to.equal(28);
    });
});
