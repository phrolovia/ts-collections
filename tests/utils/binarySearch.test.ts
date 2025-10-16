import { describe, test } from "vitest";
import { binarySearch, elementAt, List } from "../../src/imports";

describe("#binarySearch", () => {
    test("should perform binary search on a sorted array", () => {
        const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        const index1 = binarySearch(array, 7);
        const index2 = binarySearch(array, 4);
        const index3 = binarySearch(array, 20);
        const index4 = binarySearch(array, 1);
        const index5 = binarySearch(array, 19);
        expect(index1).toBe(3); // 7 is at index 3
        expect(index4).toBe(0); // 1 is at index 0
        expect(index5).toBe(9); // 19 is at index 9
        expect(index2).toBe(-1);
        expect(index3).toBe(-1);
    });
    test("should perform binary search on a List", () => {
        const list = new List(["apple", "banana", "cherry", "date", "fig", "grape"]);
        const index1 = binarySearch(list, "cherry");
        const index2 = binarySearch(list, "kiwi");
        const index3 = binarySearch(list, "apple");
        const index4 = binarySearch(list, "grape");
        const index5 = binarySearch(list, "avocado");
        expect(index1).toBe(2); // "cherry" is at index 2
        expect(index3).toBe(0); // "apple" is at index 0
        expect(index4).toBe(5); // "grape" is at index 5
        expect(index2).toBe(-1);
        expect(index5).toBe(-1);
    });
    test("should perform binary search on a Set", () => {
        const set = new Set([10, 20, 30, 40, 50]);
        const index1 = binarySearch(set, 30);
        const index2 = binarySearch(set, 25);
        const index3 = binarySearch(set, 10);
        const index4 = binarySearch(set, 50);
        const index5 = binarySearch(set, 60);
        expect(index1).toBe(2); // 30 is at index 2
        expect(index3).toBe(0); // 10 is at index 0
        expect(index4).toBe(4); // 50 is at index 4
        expect(index2).toBe(-1);
        expect(index5).toBe(-1);
        expect(elementAt(set, index1)).toBe(30);
    });
    test("should perform binary search on a Map", () => {
        const map = new Map<number, string>([
            [1, "one"],
            [2, "two"],
            [3, "three"],
            [4, "four"],
            [5, "five"]
        ]);
        const comparator = (a: [number, string], b: [number, string]) => a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1;
        const index1 = binarySearch(map, [3, "three"], comparator);
        const index2 = binarySearch(map, [6, "six"], comparator);
        const index3 = binarySearch(map, [1, "one"], comparator);
        const index4 = binarySearch(map, [5, "five"], comparator);
        const index5 = binarySearch(map, [0, "zero"], comparator);
        expect(index1).toBe(2); // key 3 is at index 2
        expect(index3).toBe(0); // key 1 is at index 0
        expect(index4).toBe(4); // key 5 is at index 4
        expect(index2).toBe(-1);
        expect(index5).toBe(-1);
        expect(elementAt(map, index1)[0]).toBe(3); // key at index 2 is 3
    });
    test("should return -1 for empty collections", () => {
        const emptyArray: number[] = [];
        const emptyList = new List<number>();
        expect(binarySearch(emptyArray, 10)).toBe(-1);
        expect(binarySearch(emptyList, 10)).toBe(-1);
    });
});
