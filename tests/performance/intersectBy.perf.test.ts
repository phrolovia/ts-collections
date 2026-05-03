import { describe, expect, test } from "vitest";
import { intersectBy } from "../../src/enumerator/functions/intersectBy";

describe("#intersectBy() Performance Tests", () => {
    test("should handle 100,000 items efficiently", () => {
        const first = Array.from({length: 100000}, (_, i) => i);
        const second = Array.from({length: 100000}, (_, i) => i + 50000);
        const start = performance.now();
        const result = intersectBy(first, second, n => n).toArray();
        const end = performance.now();
        expect(end - start).toBeLessThan(500);
        expect(result.length).toBe(50000);
    });
});
