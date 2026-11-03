import { describe, expect, test } from "vitest";
import { BiMap } from "../../src/dictionary/BiMap";
import { KeyValuePair } from "../../src/dictionary/KeyValuePair";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";
import { KeyNotFoundException } from "../../src/shared/KeyNotFoundException";

describe("BiMap", () => {
    const codes = (): BiMap<string, number> => new BiMap<string, number>([["one", 1], ["two", 2], ["three", 3]]);

    describe("#constructor()", () => {
        test("should accept tuples and key-value pairs", () => {
            expect(codes().size()).toBe(3);
            expect(new BiMap([new KeyValuePair("a", 1)]).get("a")).toBe(1);
        });
        test("should reject duplicate values", () => {
            expect(() => new BiMap([["a", 1], ["b", 1]])).toThrow(InvalidArgumentException);
        });
    });

    describe("lookups", () => {
        test("should look up in both directions", () => {
            const map = codes();
            expect(map.get("two")).toBe(2);
            expect(map.getKey(2)).toBe("two");
            expect(map.get("four")).toBeNull();
            expect(map.getKey(4)).toBeNull();
            expect(map.containsValue(3)).toBe(true);
            expect(map.containsValue(4)).toBe(false);
            expect(map.containsValue(4, (a, b) => a + 1 === b)).toBe(true);
        });
    });

    describe("#add() / #put() / #set()", () => {
        test("should reject a key or a value that is already mapped", () => {
            const map = codes();
            expect(() => map.add("one", 9)).toThrow(InvalidArgumentException);
            expect(() => map.add("uno", 1)).toThrow(InvalidArgumentException);
            expect(() => map.put("uno", 1)).toThrow(InvalidArgumentException);
            expect(() => map.set("one", 2)).toThrow(InvalidArgumentException);
            expect(() => map.set("four", 4)).toThrow(KeyNotFoundException);
            expect(map.size()).toBe(3);
        });
        test("should update both directions", () => {
            const map = codes();
            map.set("one", 10);
            expect(map.getKey(10)).toBe("one");
            expect(map.containsValue(1)).toBe(false);
            map.set("one", 10);
            expect(map.put("two", 20)).toBe(2);
            expect(map.getKey(2)).toBeNull();
            expect(map.put("four", 4)).toBeNull();
            expect(map.getKey(4)).toBe("four");
        });
    });

    describe("#forcePut()", () => {
        test("should replace the existing mappings of the key and the value", () => {
            const map = codes();
            expect(map.forcePut("uno", 1)).toBeNull();
            expect(map.containsKey("one")).toBe(false);
            expect(map.getKey(1)).toBe("uno");
            expect(map.forcePut("two", 3)).toBe(2);
            expect(map.containsKey("three")).toBe(false);
            expect(map.getKey(2)).toBeNull();
            expect(Array.from(map.entries())).toEqual([["uno", 1], ["two", 3]]);
        });
    });

    describe("#remove() / #removeValue()", () => {
        test("should remove both directions", () => {
            const map = codes();
            expect(map.remove("one")).toBe(1);
            expect(map.getKey(1)).toBeNull();
            expect(map.removeValue(2)).toBe("two");
            expect(map.containsKey("two")).toBe(false);
            expect(map.remove("one")).toBeNull();
            expect(map.removeValue(2)).toBeNull();
            expect(map.size()).toBe(1);
        });
    });

    describe("#inverse()", () => {
        test("should be a live view with keys and values swapped", () => {
            const map = codes();
            const inverse = map.inverse();
            expect(inverse.get(1)).toBe("one");
            expect(inverse.inverse()).toBe(map);
            expect(map.inverse()).toBe(inverse);
            inverse.add(4, "four");
            expect(map.get("four")).toBe(4);
            map.remove("one");
            expect(inverse.containsKey(1)).toBe(false);
            expect(inverse.size()).toBe(3);
        });
    });

    describe("enumeration", () => {
        test("should enumerate pairs in insertion order", () => {
            const map = codes();
            expect(map.select(p => `${p.key}=${p.value}`).toArray()).toEqual(["one=1", "two=2", "three=3"]);
            expect(map.keys().toArray()).toEqual(["one", "two", "three"]);
            expect(map.values().toArray()).toEqual([1, 2, 3]);
            map.clear();
            expect(map.isEmpty()).toBe(true);
            expect(map.inverse().isEmpty()).toBe(true);
        });
    });
});

describe("BiMap zero handling", () => {
    test("should treat 0 and -0 as the same value, as Map does", () => {
        const map = new BiMap<string, number>([["zero", 0]]);
        map.set("zero", -0);
        expect(map.getKey(0)).toBe("zero");
        expect(map.size()).toBe(1);
        expect(() => map.add("other", -0)).toThrow(InvalidArgumentException);
    });
});
