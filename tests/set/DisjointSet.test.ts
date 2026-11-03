import { describe, expect, test } from "vitest";
import { DisjointSet } from "../../src/set/DisjointSet";
import { NoSuchElementException } from "../../src/shared/NoSuchElementException";

describe("DisjointSet", () => {
    describe("#add()", () => {
        test("should add each element in a set of its own", () => {
            const sets = new DisjointSet([1, 2, 3]);
            expect(sets.add(4)).toBe(true);
            expect(sets.add(4)).toBe(false);
            expect(sets.size()).toBe(4);
            expect(sets.length).toBe(4);
            expect(sets.setCount()).toBe(4);
            expect(sets.find(3)).toBe(3);
            expect(sets.contains(4)).toBe(true);
            expect(sets.contains(5)).toBe(false);
        });
    });

    describe("#merge()", () => {
        test("should merge sets and report whether anything changed", () => {
            const sets = new DisjointSet<string>();
            expect(sets.merge("a", "b")).toBe(true);
            expect(sets.merge("c", "d")).toBe(true);
            expect(sets.merge("b", "a")).toBe(false);
            expect(sets.setCount()).toBe(2);
            expect(sets.merge("a", "d")).toBe(true);
            expect(sets.setCount()).toBe(1);
            expect(sets.setSize("c")).toBe(4);
            expect(sets.find("a")).toBe(sets.find("d"));
        });
        test("should add missing elements", () => {
            const sets = new DisjointSet<number>();
            sets.merge(1, 1);
            expect(sets.size()).toBe(1);
            expect(sets.setCount()).toBe(1);
        });
    });

    describe("#connected()", () => {
        test("should tell whether two elements share a set", () => {
            const sets = new DisjointSet([1, 2, 3, 4]);
            sets.merge(1, 2);
            sets.merge(3, 4);
            expect(sets.connected(1, 2)).toBe(true);
            expect(sets.connected(2, 3)).toBe(false);
            expect(sets.connected(1, 9)).toBe(false);
            expect(sets.connected(9, 9)).toBe(false);
            expect(sets.connected(1, 1)).toBe(true);
        });
    });

    describe("#find()", () => {
        test("should throw for a missing element", () => {
            expect(() => new DisjointSet<number>().find(1)).toThrow(NoSuchElementException);
        });
    });

    describe("#sets()", () => {
        test("should group elements in the order they were added", () => {
            const sets = new DisjointSet(["a", "b", "c", "d", "e"]);
            sets.merge("d", "a");
            sets.merge("c", "e");
            expect(sets.sets().toArray()).toEqual([["a", "d"], ["b"], ["c", "e"]]);
            expect(sets.toArray()).toEqual(["a", "b", "c", "d", "e"]);
        });
    });

    describe("#clear()", () => {
        test("should remove every element", () => {
            const sets = new DisjointSet([1, 2]);
            sets.merge(1, 2);
            sets.clear();
            expect(sets.size()).toBe(0);
            expect(sets.setCount()).toBe(0);
            expect(sets.sets().toArray()).toEqual([]);
            sets.merge(1, 2);
            expect(sets.connected(1, 2)).toBe(true);
        });
    });

    describe("scale", () => {
        test("should handle long chains of unions quickly", () => {
            const sets = new DisjointSet<number>();
            const count = 200000;
            for (let i = 1; i < count; ++i) {
                sets.merge(i - 1, i);
            }
            expect(sets.setCount()).toBe(1);
            expect(sets.connected(0, count - 1)).toBe(true);
            expect(sets.setSize(12345)).toBe(count);
        });
    });
});
