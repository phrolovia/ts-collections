import { describe, expect, test } from "vitest";
import { exceptBy } from "../../src/enumerator/functions/exceptBy";

describe("#exceptBy()", () => {
    test("should handle 100,000 items efficiently", () => {
        const first = Array.from({ length: 100000 }, (_, i) => i);
        const second = Array.from({ length: 50000 }, (_, i) => i * 2);
        const start = performance.now();
        const result = exceptBy(first, second, n => n).toArray();
        const end = performance.now();
        expect(end - start).toBeLessThan(500);
        expect(result.length).toBe(50000);
    });
});
