import { describe, expect, test } from "vitest";
import { CircularLinkedList, EnumerableSet, LinkedList, List, SortedSet } from "../../src";

const COUNT = 100000;
const elements = Array.from({ length: COUNT }, (_, i) => i);
const half = elements.filter(e => e % 2 === 0);

const timed = (run: () => void): number => {
    const start = performance.now();
    run();
    return performance.now() - start;
};

// Each of these used to compare every element against the whole argument or shift the list per removal.
describe("Bulk collection operation performance", () => {
    for (const [name, create] of [
        ["List", (): List<number> => new List(elements)],
        ["LinkedList", (): LinkedList<number> => new LinkedList(elements)],
        ["CircularLinkedList", (): CircularLinkedList<number> => new CircularLinkedList(elements)]
    ] as const) {
        test(`should run removeIf, removeAll and retainAll on a ${name} efficiently`, () => {
            const removedIf = create();
            const removedAll = create();
            const retained = create();
            const elapsed = timed(() => {
                removedIf.removeIf(e => e % 2 === 0);
                removedAll.removeAll(half);
                retained.retainAll(half);
            });
            expect(elapsed).toBeLessThan(1000);
            expect(removedIf.size()).toBe(COUNT / 2);
            expect(removedAll.toArray()).toEqual(removedIf.toArray());
            expect(retained.toArray()).toEqual(half);
        });
    }
    test("should check set relations against arrays efficiently", () => {
        const set = new EnumerableSet(elements);
        const sorted = new SortedSet(elements);
        let results: boolean[] = [];
        const elapsed = timed(() => {
            results = [set.isSubsetOf(elements), sorted.isSubsetOf(elements), set.isProperSubsetOf(half)];
        });
        expect(elapsed).toBeLessThan(1000);
        expect(results).toEqual([true, true, false]);
    });
    test("should retain elements of a SortedSet efficiently", () => {
        const sorted = new SortedSet(elements);
        const elapsed = timed(() => sorted.retainAll(half));
        expect(elapsed).toBeLessThan(1000);
        expect(sorted.toArray()).toEqual(half);
    });
});
