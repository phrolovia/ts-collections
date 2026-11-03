import { describe, expect, test } from "vitest";
import { MultiSet } from "../../src/multiset/MultiSet";
import { contains, count } from "../../src/enumerator/functions/functions";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";

describe("MultiSet", () => {
    const words = (): MultiSet<string> => new MultiSet("the cat and the hat and the bat".split(" "));

    describe("#constructor()", () => {
        test("should count the given elements", () => {
            const bag = words();
            expect(bag.size()).toBe(8);
            expect(bag.length).toBe(8);
            expect(bag.distinctCount()).toBe(5);
            expect(bag.occurrences("the")).toBe(3);
            expect(bag.occurrences("dog")).toBe(0);
        });
    });

    describe("#add()", () => {
        test("should add one or more occurrences", () => {
            const bag = new MultiSet<number>();
            expect(bag.add(1)).toBe(true);
            expect(bag.add(1, 3)).toBe(true);
            expect(bag.add(2, 0)).toBe(false);
            expect(bag.occurrences(1)).toBe(4);
            expect(bag.contains(2)).toBe(false);
            expect(bag.size()).toBe(4);
        });
        test("should reject invalid counts", () => {
            const bag = new MultiSet<number>();
            expect(() => bag.add(1, -1)).toThrow(InvalidArgumentException);
            expect(() => bag.add(1, 1.5)).toThrow(InvalidArgumentException);
            expect(() => bag.remove(1, NaN)).toThrow(InvalidArgumentException);
            expect(() => bag.setOccurrences(1, -2)).toThrow(InvalidArgumentException);
        });
    });

    describe("#remove()", () => {
        test("should remove occurrences down to zero", () => {
            const bag = words();
            expect(bag.remove("the")).toBe(true);
            expect(bag.occurrences("the")).toBe(2);
            expect(bag.remove("the", 10)).toBe(true);
            expect(bag.contains("the")).toBe(false);
            expect(bag.remove("the")).toBe(false);
            expect(bag.size()).toBe(5);
        });
    });

    describe("#removeAll() / #removeIf() / #retainAll()", () => {
        test("should remove every occurrence of the given elements", () => {
            const bag = words();
            expect(bag.removeAll(["the", "dog"])).toBe(true);
            expect(bag.removeAll(["dog"])).toBe(false);
            expect(bag.size()).toBe(5);
        });
        test("should test each distinct element once", () => {
            const bag = words();
            const tested: string[] = [];
            expect(bag.removeIf(w => {
                tested.push(w);
                return w.endsWith("at");
            })).toBe(true);
            expect(tested).toEqual(["the", "cat", "and", "hat", "bat"]);
            expect(bag.toArray()).toEqual(["the", "the", "the", "and", "and"]);
        });
        test("should retain only the given elements", () => {
            const bag = words();
            expect(bag.retainAll(["and"])).toBe(true);
            expect(bag.toArray()).toEqual(["and", "and"]);
        });
    });

    describe("#setOccurrences()", () => {
        test("should set the count and return the old one", () => {
            const bag = words();
            expect(bag.setOccurrences("cat", 4)).toBe(1);
            expect(bag.setOccurrences("dog", 2)).toBe(0);
            expect(bag.setOccurrences("and", 0)).toBe(2);
            expect(bag.size()).toBe(3 + 4 + 1 + 1 + 2);
            expect(bag.contains("and")).toBe(false);
        });
    });

    describe("#entries() / #mostCommon()", () => {
        test("should list counts in first-added order", () => {
            expect(words().entries().select(p => `${p.key}:${p.value}`).toArray())
                .toEqual(["the:3", "cat:1", "and:2", "hat:1", "bat:1"]);
        });
        test("should order by frequency, keeping ties in first-added order", () => {
            const bag = words();
            expect(bag.mostCommon(2).select(p => p.key).toArray()).toEqual(["the", "and"]);
            expect(bag.mostCommon().select(p => p.key).toArray()).toEqual(["the", "and", "cat", "hat", "bat"]);
        });
    });

    describe("enumeration", () => {
        test("should yield each element as often as it occurs", () => {
            const bag = new MultiSet([3, 1, 3, 2, 1, 3]);
            expect(bag.toArray()).toEqual([3, 3, 3, 1, 1, 2]);
            expect(bag.where(x => x > 1).count()).toBe(4);
            expect(count(bag)).toBe(6);
            expect(contains(bag, 2)).toBe(true);
        });
        test("should be empty after clear", () => {
            const bag = words();
            bag.clear();
            expect(bag.isEmpty()).toBe(true);
            expect(bag.distinctCount()).toBe(0);
            expect(bag.toArray()).toEqual([]);
        });
    });
});
