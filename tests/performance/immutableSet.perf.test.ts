import { describe, expect, test } from "vitest";
import { ImmutableSet } from "../../src";

describe("ImmutableSet Performance Tests", () => {
    test("should add 100,000 elements one at a time efficiently", () => {
        let set = ImmutableSet.create<number>();
        const start = performance.now();
        for (let i = 0; i < 100000; ++i) {
            set = set.add(i);
        }
        const end = performance.now();
        expect(end - start).toBeLessThan(1000);
        expect(set.size()).toBe(100000);
        expect(set.contains(99999)).toBe(true);
    });
    test("should remove 100,000 elements one at a time efficiently", () => {
        const set = ImmutableSet.create(Array.from({ length: 100000 }, (_, i) => `element${i}`));
        let current = set;
        const start = performance.now();
        for (let i = 0; i < 100000; ++i) {
            current = current.remove(`element${i}`);
        }
        const end = performance.now();
        expect(end - start).toBeLessThan(1000);
        expect(current.size()).toBe(0);
        expect(set.size()).toBe(100000);
    });
    test("should remove a large collection efficiently", () => {
        const set = ImmutableSet.create(Array.from({ length: 100000 }, (_, i) => i));
        const toRemove = Array.from({ length: 50000 }, (_, i) => i * 2);
        const start = performance.now();
        const result = set.removeAll(toRemove);
        const end = performance.now();
        expect(end - start).toBeLessThan(500);
        expect(result.size()).toBe(50000);
    });
});
