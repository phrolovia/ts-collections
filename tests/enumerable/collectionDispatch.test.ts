import { describe, expect, test } from "vitest";
import { contains, count, elementAt, elementAtOrDefault, last, lastOrDefault } from "../../src/enumerator/functions/functions";
import { IndexOutOfBoundsException } from "../../src/shared/IndexOutOfBoundsException";
import { NoElementsException } from "../../src/shared/NoElementsException";
import { CircularLinkedList, EnumerableSet, ImmutableList, LinkedList, List, ReadonlyList, SortedSet, Stack } from "../../src";

describe("Standalone functions on library collections", () => {
    const lists = () => [
        new List([1, 2, 3]),
        new LinkedList([1, 2, 3]),
        new CircularLinkedList([1, 2, 3]),
        ImmutableList.create([1, 2, 3]),
        new ReadonlyList(new List([1, 2, 3]))
    ];
    test("should read positions from lists", () => {
        for (const list of lists()) {
            expect(elementAt(list, 1)).toBe(2);
            expect(elementAtOrDefault(list, 2)).toBe(3);
            expect(elementAtOrDefault(list, 3)).toBeNull();
            expect(elementAtOrDefault(list, -1)).toBeNull();
            expect(elementAtOrDefault(list, 1.5)).toBeNull();
            expect(() => elementAt(list, 3)).toThrow(IndexOutOfBoundsException);
            expect(() => elementAt(list, 1.5)).toThrow(IndexOutOfBoundsException);
            expect(last(list)).toBe(3);
            expect(lastOrDefault(list)).toBe(3);
            expect(last(list, x => x < 3)).toBe(2);
            expect(lastOrDefault(list, x => x > 3)).toBeNull();
            expect(count(list)).toBe(3);
            expect(count(list, x => x > 1)).toBe(2);
        }
    });
    test("should handle empty lists", () => {
        for (const list of [new List<number>(), new LinkedList<number>(), ImmutableList.create<number>()]) {
            expect(() => last(list)).toThrow(NoElementsException);
            expect(lastOrDefault(list)).toBeNull();
            expect(elementAtOrDefault(list, 0)).toBeNull();
            expect(count(list)).toBe(0);
        }
    });
    test("should count other collections by their size", () => {
        expect(count(new SortedSet([3, 1, 2]))).toBe(3);
        expect(count(new Stack([1, 2]))).toBe(2);
        expect(count(new EnumerableSet([1, 1, 2]))).toBe(2);
    });
    test("should answer contains on a hashed set with Object.is semantics", () => {
        const set = new EnumerableSet([1, -0, NaN]);
        expect(contains(set, 1)).toBe(true);
        expect(contains(set, 2)).toBe(false);
        expect(contains(set, NaN)).toBe(true);
        // A Set stores -0 as 0, so iterating it yields 0.
        expect(contains(set, 0)).toBe(true);
        expect(contains(set, -0)).toBe(false);
        // A custom comparator still scans the elements.
        const adjacent = (a: number, b: number): boolean => Math.abs(a - b) === 1;
        expect(contains(set, 2, adjacent)).toBe(true);
        expect(contains(set, 5, adjacent)).toBe(false);
    });
    test("should keep comparing a sorted set with Object.is", () => {
        const set = new SortedSet(["a", "b"], (x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));
        expect(set.contains("A")).toBe(true);
        expect(contains(set, "A")).toBe(false);
    });
});
