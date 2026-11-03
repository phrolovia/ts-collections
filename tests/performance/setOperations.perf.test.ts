import { describe, expect, test } from "vitest";
import { AsyncEnumerable } from "../../src/enumerator/AsyncEnumerable";
import { Enumerable } from "../../src/enumerator/Enumerable";

const COUNT = 50000;

// Every key is distinct, so scanning the seen keys for each element would be quadratic.
const values = Array.from({ length: COUNT }, (_, i) => i);
const half = values.filter(value => value % 2 === 0);

const asyncValues = async function* (source: number[]): AsyncGenerator<number> {
    yield* source;
};

const timed = async (run: () => unknown): Promise<number> => {
    const start = performance.now();
    await run();
    return performance.now() - start;
};

describe("Set operation performance with many distinct keys", () => {
    test("should treat Object.is as the default comparator", async () => {
        let sizes: number[] = [];
        const elapsed = await timed(() => {
            sizes = [
                Enumerable.from(values).except(half, Object.is).count(),
                Enumerable.from(values).intersect(half, Object.is).count(),
                Enumerable.from(values).distinct(Object.is).count(),
                Enumerable.from(values).groupBy(value => value, Object.is).count()
            ];
        });
        expect(elapsed).toBeLessThan(1000);
        expect(sizes).toEqual([COUNT / 2, COUNT / 2, COUNT, COUNT]);
    });
    test("should hash keys in asynchronous set operations", async () => {
        let sizes: number[] = [];
        const elapsed = await timed(async () => {
            sizes = [
                await AsyncEnumerable.from(asyncValues(values)).except(asyncValues(half)).count(),
                await AsyncEnumerable.from(asyncValues(values)).intersect(asyncValues(half)).count(),
                await AsyncEnumerable.from(asyncValues(values)).union(asyncValues(half)).count()
            ];
        });
        expect(elapsed).toBeLessThan(2000);
        expect(sizes).toEqual([COUNT / 2, COUNT / 2, COUNT]);
    });
});
