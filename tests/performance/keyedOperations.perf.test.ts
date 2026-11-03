import { describe, expect, test } from "vitest";
import { Lookup } from "../../src";
import { aggregateBy, countBy, from, groupJoin, join, leftJoin, rightJoin } from "../../src/enumerator/functions/functions";

const COUNT = 50000;

// Every key is distinct, so a linear scan of the groups for each element would be quadratic.
const rows = Array.from({ length: COUNT }, (_, i) => ({ id: i, key: i }));

const timed = (run: () => void): number => {
    const start = performance.now();
    run();
    return performance.now() - start;
};

describe("Keyed operation performance with many distinct keys", () => {
    test("should join on distinct keys efficiently", () => {
        let sizes: number[] = [];
        const elapsed = timed(() => {
            sizes = [
                join(rows, from(rows), r => r.key, r => r.key, (a, b) => a.id + b.id).count(),
                leftJoin(rows, from(rows), r => r.key, r => r.key, (a, b) => a.id + (b?.id ?? 0)).count(),
                rightJoin(rows, from(rows), r => r.key, r => r.key, (a, b) => (a?.id ?? 0) + b.id).count(),
                groupJoin(rows, from(rows), r => r.key, r => r.key, (a, bs) => bs.count()).count()
            ];
        });
        expect(elapsed).toBeLessThan(1000);
        expect(sizes).toEqual([COUNT, COUNT, COUNT, COUNT]);
    });
    test("should count and aggregate by distinct keys efficiently", () => {
        let sizes: number[] = [];
        const elapsed = timed(() => {
            sizes = [
                countBy(rows, r => r.key).count(),
                aggregateBy(rows, r => r.key, 0, (sum, r) => sum + r.id).count()
            ];
        });
        expect(elapsed).toBeLessThan(1000);
        expect(sizes).toEqual([COUNT, COUNT]);
    });
    test("should build a lookup with distinct keys efficiently", () => {
        let lookup: Lookup<number, number> | null = null;
        const elapsed = timed(() => {
            lookup = Lookup.create(rows, r => r.key, r => r.id);
        });
        expect(elapsed).toBeLessThan(1000);
        expect(lookup!.size()).toBe(COUNT);
    });
});
