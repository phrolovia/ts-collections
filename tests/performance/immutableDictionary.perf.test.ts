import { describe, expect, test } from "vitest";
import { ImmutableDictionary } from "../../src";

describe("ImmutableDictionary Performance Tests", () => {
    test("should put 100,000 keys one at a time efficiently", () => {
        let dictionary = ImmutableDictionary.create<number, number>();
        const start = performance.now();
        for (let i = 0; i < 100000; ++i) {
            dictionary = dictionary.put(i, i);
        }
        const end = performance.now();
        expect(end - start).toBeLessThan(1000);
        expect(dictionary.size()).toBe(100000);
        expect(dictionary.get(99999)).toBe(99999);
    });
    test("should remove 100,000 keys one at a time efficiently", () => {
        const dictionary = ImmutableDictionary.create<string, number>(Array.from({ length: 100000 }, (_, i) => [`key${i}`, i] as [string, number]));
        let current = dictionary;
        const start = performance.now();
        for (let i = 0; i < 100000; ++i) {
            current = current.remove(`key${i}`);
        }
        const end = performance.now();
        expect(end - start).toBeLessThan(1000);
        expect(current.size()).toBe(0);
        expect(dictionary.size()).toBe(100000);
    });
});
