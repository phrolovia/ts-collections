import { describe, expect, test } from "vitest";
import { IntervalTree } from "../../src/tree/IntervalTree";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";

const valuesOf = <TPoint, TValue>(intervals: Iterable<{ value: TValue; start: TPoint }>): TValue[] => Array.from(intervals, i => i.value);

describe("IntervalTree", () => {
    const meetings = (): IntervalTree<number, string> => new IntervalTree<number, string>([
        [9, 10, "standup"], [13, 15, "review"], [10, 12, "design"], [14, 14, "call"], [8, 18, "on call"]
    ]);

    describe("#add()", () => {
        test("should enumerate intervals ordered by start, then end, then insertion", () => {
            const tree = meetings();
            tree.add(9, 10, "standup 2");
            tree.add(9, 9, "early");
            expect(valuesOf(tree)).toEqual(["on call", "early", "standup", "standup 2", "design", "review", "call"]);
            expect(tree.size()).toBe(7);
            expect(tree.length).toBe(7);
        });
        test("should reject an end before the start", () => {
            expect(() => new IntervalTree<number>().add(5, 4)).toThrow(InvalidArgumentException);
        });
        test("should store intervals without values", () => {
            const tree = new IntervalTree<number>([[1, 2]]);
            expect(tree.first()).toEqual({ end: 2, start: 1, value: undefined });
        });
    });

    describe("#overlapping() / #containing()", () => {
        test("should find intervals that share a point with the range", () => {
            const tree = meetings();
            expect(valuesOf(tree.overlapping(12, 13))).toEqual(["on call", "design", "review"]);
            expect(valuesOf(tree.overlapping(19, 20))).toEqual([]);
            expect(valuesOf(tree.containing(14))).toEqual(["on call", "review", "call"]);
            expect(valuesOf(tree.containing(8))).toEqual(["on call"]);
        });
        test("should treat intervals as closed", () => {
            const tree = new IntervalTree<number, string>([[1, 3, "a"], [3, 5, "b"], [6, 7, "c"]]);
            expect(valuesOf(tree.containing(3))).toEqual(["a", "b"]);
            expect(valuesOf(tree.overlapping(5, 6))).toEqual(["b", "c"]);
        });
        test("should reject an inverted range", () => {
            expect(() => meetings().overlapping(3, 2)).toThrow(InvalidArgumentException);
        });
        test("should be deferred", () => {
            const tree = meetings();
            const now = tree.containing(11);
            tree.add(11, 11, "lunch");
            expect(valuesOf(now)).toEqual(["on call", "design", "lunch"]);
        });
    });

    describe("#remove()", () => {
        test("should remove one matching interval", () => {
            const tree = meetings();
            tree.add(9, 10, "standup");
            expect(tree.remove(9, 10, "standup")).toBe(true);
            expect(tree.size()).toBe(5);
            expect(valuesOf(tree.containing(9))).toEqual(["on call", "standup"]);
            expect(tree.remove(9, 10, "standup")).toBe(true);
            expect(tree.remove(9, 10, "standup")).toBe(false);
            expect(tree.remove(9, 11, "design")).toBe(false);
            expect(tree.remove(3, 2, "x")).toBe(false);
        });
        test("should match values with the value comparator", () => {
            const tree = new IntervalTree<number, { id: number }>([[1, 2, { id: 7 }]], undefined, (a, b) => a.id === b.id);
            expect(tree.remove(1, 2, { id: 7 })).toBe(true);
            expect(tree.size()).toBe(0);
        });
    });

    describe("#clear()", () => {
        test("should remove every interval", () => {
            const tree = meetings();
            tree.clear();
            expect(tree.size()).toBe(0);
            expect(tree.toArray()).toEqual([]);
            expect(tree.containing(9).toArray()).toEqual([]);
        });
    });

    describe("other point types", () => {
        test("should order dates and strings", () => {
            const day = (d: number): Date => new Date(2026, 0, d);
            const bookings = new IntervalTree<Date, string>([[day(1), day(5), "a"], [day(4), day(8), "b"], [day(10), day(12), "c"]]);
            expect(valuesOf(bookings.containing(day(4)))).toEqual(["a", "b"]);
            const ranges = new IntervalTree<string, number>([["apple", "cherry", 1], ["melon", "peach", 2]]);
            expect(valuesOf(ranges.containing("banana"))).toEqual([1]);
        });
    });

    describe("scale", () => {
        test("should stay balanced for sorted input", () => {
            // An unbalanced tree would overflow the stack in its recursive insert at this size.
            const tree = new IntervalTree<number, number>();
            for (let i = 0; i < 100000; ++i) {
                tree.add(i, i + 2, i);
            }
            expect(valuesOf(tree.containing(50000))).toEqual([49998, 49999, 50000]);
            for (let i = 0; i < 100000; i += 2) {
                tree.remove(i, i + 2, i);
            }
            expect(tree.size()).toBe(50000);
            expect(valuesOf(tree.containing(50000))).toEqual([49999]);
        });
    });

    describe("against a brute-force model", () => {
        test("should agree after random additions and removals", () => {
            let seed = 42;
            const random = (limit: number): number => {
                seed = (seed * 1103515245 + 12345) % 2147483648;
                return seed % limit;
            };
            const tree = new IntervalTree<number, number>();
            const model: Array<{ start: number; end: number; value: number }> = [];
            for (let step = 0; step < 3000; ++step) {
                if (model.length > 0 && random(3) === 0) {
                    const [removed] = model.splice(random(model.length), 1);
                    expect(tree.remove(removed.start, removed.end, removed.value)).toBe(true);
                } else {
                    const start = random(1000);
                    const interval = { start, end: start + random(50), value: step };
                    model.push(interval);
                    tree.add(interval.start, interval.end, interval.value);
                }
                if (step % 100 === 0) {
                    const from = random(1000);
                    const to = from + random(100);
                    const expected = model.filter(i => i.start <= to && i.end >= from).map(i => i.value).sort((a, b) => a - b);
                    expect(valuesOf(tree.overlapping(from, to)).sort((a, b) => a - b)).toEqual(expected);
                }
            }
            expect(tree.size()).toBe(model.length);
            const sorted = [...model].sort((a, b) => a.start - b.start || a.end - b.end || a.value - b.value);
            expect(valuesOf(tree)).toEqual(sorted.map(i => i.value));
        });
    });
});
