import { describe, expect, test } from "vitest";
import { LruCache } from "../../src/dictionary/LruCache";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";
import { KeyNotFoundException } from "../../src/shared/KeyNotFoundException";

const keysOf = <TKey, TValue>(cache: LruCache<TKey, TValue>): TKey[] => cache.select(p => p.key).toArray();

describe("LruCache", () => {
    describe("#constructor()", () => {
        test("should require a positive integer capacity", () => {
            expect(() => new LruCache(0)).toThrow(InvalidArgumentException);
            expect(() => new LruCache(2.5)).toThrow(InvalidArgumentException);
            expect(new LruCache(3).capacity).toBe(3);
        });
    });

    describe("eviction", () => {
        test("should evict the least recently used entry", () => {
            const evicted: string[] = [];
            const cache = new LruCache<string, number>(2, (key, value) => evicted.push(`${key}=${value}`));
            cache.add("a", 1);
            cache.add("b", 2);
            expect(cache.get("a")).toBe(1);
            cache.add("c", 3);
            expect(evicted).toEqual(["b=2"]);
            expect(keysOf(cache)).toEqual(["a", "c"]);
            expect(cache.size()).toBe(2);
        });
        test("should count writes as uses", () => {
            const cache = new LruCache<string, number>(2);
            cache.add("a", 1);
            cache.add("b", 2);
            cache.put("a", 10);
            cache.put("c", 3);
            expect(keysOf(cache)).toEqual(["a", "c"]);
            expect(cache.get("a")).toBe(10);
            cache.set("c", 30);
            cache.add("d", 4);
            expect(keysOf(cache)).toEqual(["c", "d"]);
        });
        test("should not count peeks, lookups or enumeration as uses", () => {
            const cache = new LruCache<string, number>(2);
            cache.add("a", 1);
            cache.add("b", 2);
            expect(cache.peek("a")).toBe(1);
            expect(cache.containsKey("a")).toBe(true);
            expect(cache.toArray()).toHaveLength(2);
            cache.add("c", 3);
            expect(cache.containsKey("a")).toBe(false);
        });
        test("should not call onEvict for removals", () => {
            const evicted: string[] = [];
            const cache = new LruCache<string, number>(2, key => evicted.push(key));
            cache.add("a", 1);
            cache.remove("a");
            cache.add("b", 2);
            cache.clear();
            expect(evicted).toEqual([]);
        });
    });

    describe("dictionary behaviour", () => {
        test("should reject duplicate keys and missing keys", () => {
            const cache = new LruCache<string, number>(3);
            cache.add("a", 1);
            expect(() => cache.add("a", 2)).toThrow(InvalidArgumentException);
            expect(() => cache.set("z", 1)).toThrow(KeyNotFoundException);
            expect(cache.tryAdd("a", 2)).toBe(false);
            expect(cache.get("z")).toBeNull();
            expect(cache.peek("z")).toBeNull();
            expect(cache.remove("z")).toBeNull();
            expect(cache.remove("a")).toBe(1);
            expect(cache.isEmpty()).toBe(true);
        });
        test("should expose keys, values and entries from least to most recent", () => {
            const cache = new LruCache<string, number>(3);
            cache.add("a", 1);
            cache.add("b", 2);
            cache.add("c", 3);
            cache.get("a");
            expect(cache.keys().toArray()).toEqual(["b", "c", "a"]);
            expect(cache.values().toArray()).toEqual([2, 3, 1]);
            expect(Array.from(cache.entries())).toEqual([["b", 2], ["c", 3], ["a", 1]]);
            expect(cache.containsValue(3)).toBe(true);
            expect(cache.containsValue(4)).toBe(false);
        });
        test("should allow reading values while enumerating", () => {
            const cache = new LruCache<number, number>(3);
            cache.add(1, 1);
            cache.add(2, 2);
            let total = 0;
            for (const pair of cache) {
                total += cache.get(pair.key) as number;
            }
            expect(total).toBe(3);
            expect(cache.where(p => (cache.get(p.key) as number) > 1).count()).toBe(1);
        });
    });
});
