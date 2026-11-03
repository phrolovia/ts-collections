import { describe, expect, test } from "vitest";
import { contains, count, elementAt, last } from "../../src/enumerator/functions/functions";
import { EnumerableSet, List, SortedDictionary, SortedSet } from "../../src";

const COUNT = 100000;
const values = Array.from({ length: COUNT }, (_, i) => i);

const timed = (run: () => void): number => {
    const start = performance.now();
    run();
    return performance.now() - start;
};

describe("Collection access performance", () => {
    test("should build a sorted set from sorted input in linear time", () => {
        const dictionary = new SortedDictionary<number, number>();
        for (const value of values) {
            dictionary.add(value, value);
        }
        let sizes: number[] = [];
        const elapsed = timed(() => {
            sizes = [new SortedSet(values).size(), dictionary.keys().size(), new SortedSet(values).headSet(COUNT / 2).size()];
        });
        expect(elapsed).toBeLessThan(300);
        expect(sizes).toEqual([COUNT, COUNT, COUNT / 2]);
    });
    test("should answer standalone calls from the collection", () => {
        const list = new List(values);
        const set = new EnumerableSet(values);
        let total = 0;
        const elapsed = timed(() => {
            for (let i = 0; i < 10000; ++i) {
                total += elementAt(list, i) + last(list) + count(list) + (contains(set, i) ? 1 : 0);
            }
        });
        expect(elapsed).toBeLessThan(200);
        expect(total).toBe((10000 * 9999) / 2 + 10000 * (COUNT - 1) + 10000 * COUNT + 10000);
    });
});
