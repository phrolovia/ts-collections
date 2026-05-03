import { describe, expect, test } from "vitest";
import { groupBy } from "../../src/enumerator/functions/groupBy";
import { toArray } from "../../src/enumerator/functions/toArray";

describe("#groupBy() Performance Tests", () => {
    test("should group 1,000,000 items efficiently", () => {
        const data = Array.from({length: 1000000}, (_, i) => i);
        const start = performance.now();
        const groups = toArray(groupBy(data, x => x % 100));
        const end = performance.now();
        expect(end - start).toBeLessThan(1000);
        expect(groups.length).toBe(100);
    });
});
