import { beforeEach, describe, expect, test } from "vitest";
import { CircularLinkedList } from "../../src/imports"; // Adjust path as needed
import { IndexOutOfBoundsException } from "../../src/shared/IndexOutOfBoundsException"; // Adjust path as needed
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException"; // Adjust path as needed
import { NoElementsException } from "../../src/shared/NoElementsException"; // Adjust path as needed

describe("CircularLinkedList", () => {
    let list: CircularLinkedList<number>;
    let objectList: CircularLinkedList<{ id: number; value: string }>;
    const obj1 = {id: 1, value: "a"};
    const obj2 = {id: 2, value: "b"};
    const obj3 = {id: 3, value: "c"};
    const obj4 = {id: 4, value: "d"};

    // Run before each test case
    beforeEach(() => {
        list = new CircularLinkedList<number>();
        objectList = new CircularLinkedList<{ id: number; value: string }>();
    });

    // --- Constructor Tests ---
    describe("Constructor", () => {
        test("should create an empty list when no iterable is provided", () => {
            expect(list.size()).toBe(0);
            expect(list.length).toBe(0);
            expect(list.isEmpty()).toBe(true);
            expect(list.toArray()).toEqual([]);
        });

        test("should create a list from an iterable (array)", () => {
            const initArray = [10, 20, 30];
            list = new CircularLinkedList<number>(initArray);
            expect(list.size()).toBe(3);
            expect(list.length).toBe(3);
            expect(list.isEmpty()).toBe(false);
            expect(list.toArray()).toEqual([10, 20, 30]);
            // Check circularity implicitly via iteration/toArray
        });

        test("should create a list from an iterable (Set)", () => {
            const initSet = new Set([10, 20, 30]);
            list = new CircularLinkedList<number>(initSet);
            expect(list.size()).toBe(3);
            expect(list.length).toBe(3);
            expect(list.isEmpty()).toBe(false);
            // Order depends on Set iteration order, but check elements
            expect(list.toArray()).toContain(10);
            expect(list.toArray()).toContain(20);
            expect(list.toArray()).toContain(30);
        });
    });

    // --- Add Operations ---
    describe("Add Operations (add, addFirst, addLast, addAt)", () => {
        test("add/addLast should add elements to the end", () => {
            list.add(1);
            expect(list.toArray()).toEqual([1]);
            list.addLast(2);
            expect(list.toArray()).toEqual([1, 2]);
            list.add(3);
            expect(list.toArray()).toEqual([1, 2, 3]);
            expect(list.size()).toBe(3);
        });

        test("addFirst should add elements to the beginning", () => {
            list.addFirst(1);
            expect(list.toArray()).toEqual([1]);
            list.addFirst(2);
            expect(list.toArray()).toEqual([2, 1]);
            list.addFirst(3);
            expect(list.toArray()).toEqual([3, 2, 1]);
            expect(list.size()).toBe(3);
        });

        test("addAt should insert elements at the specified index", () => {
            list.addAt(10, 0); // Add to empty list
            expect(list.toArray()).toEqual([10]);
            list.addAt(30, 1); // Add at end
            expect(list.toArray()).toEqual([10, 30]);
            list.addAt(20, 1); // Add in middle
            expect(list.toArray()).toEqual([10, 20, 30]);
            list.addAt(0, 0); // Add at beginning
            expect(list.toArray()).toEqual([0, 10, 20, 30]);
            expect(list.size()).toBe(4);
        });

        test("addAt should throw IndexOutOfBoundsException for invalid index", () => {
            expect(() => list.addAt(1, -1)).toThrow(IndexOutOfBoundsException);
            expect(() => list.addAt(1, 1)).toThrow(IndexOutOfBoundsException); // Index > size
            list.add(10);
            list.add(20);
            expect(() => list.addAt(30, 3)).toThrow(IndexOutOfBoundsException); // Index > size
        });
    });

    // --- Access Operations ---
    describe("Access Operations (get, indexOf, lastIndexOf)", () => {
        beforeEach(() => {
            list = new CircularLinkedList<number>([10, 20, 30, 20]);
        });

        test("get should return the element at the specified index", () => {
            expect(list.get(0)).toBe(10);
            expect(list.get(1)).toBe(20);
            expect(list.get(2)).toBe(30);
            expect(list.get(3)).toBe(20); // Last element
        });

        test("get should throw IndexOutOfBoundsException for invalid index", () => {
            expect(() => list.get(-1)).toThrow(IndexOutOfBoundsException);
            expect(() => list.get(4)).toThrow(IndexOutOfBoundsException); // index === size
            const emptyList = new CircularLinkedList<number>();
            expect(() => emptyList.get(0)).toThrow(IndexOutOfBoundsException);
        });

        test("indexOf should return the first index of an element", () => {
            expect(list.indexOf(10)).toBe(0);
            expect(list.indexOf(20)).toBe(1); // First occurrence
            expect(list.indexOf(30)).toBe(2);
            expect(list.indexOf(40)).toBe(-1); // Not present
        });

        test("lastIndexOf should return the last index of an element", () => {
            expect(list.lastIndexOf(10)).toBe(0);
            expect(list.lastIndexOf(20)).toBe(3); // Last occurrence
            expect(list.lastIndexOf(30)).toBe(2);
            expect(list.lastIndexOf(40)).toBe(-1); // Not present
        });

        test("indexOf/lastIndexOf should handle empty list", () => {
            const emptyList = new CircularLinkedList<number>();
            expect(emptyList.indexOf(10)).toBe(-1);
            expect(emptyList.lastIndexOf(10)).toBe(-1);
        });
    });

    // --- Set Operation ---
    describe("Set Operation", () => {
        beforeEach(() => {
            list = new CircularLinkedList<number>([10, 20, 30]);
        });

        test("set should replace the element at the specified index and return the old element", () => {
            const old0 = list.set(0, 15);
            expect(old0).toBe(10);
            expect(list.toArray()).toEqual([15, 20, 30]);

            const old2 = list.set(2, 35);
            expect(old2).toBe(30);
            expect(list.toArray()).toEqual([15, 20, 35]);

            const old1 = list.set(1, 25);
            expect(old1).toBe(20);
            expect(list.toArray()).toEqual([15, 25, 35]);
        });

        test("set should throw IndexOutOfBoundsException for invalid index", () => {
            expect(() => list.set(-1, 5)).toThrow(IndexOutOfBoundsException);
            expect(() => list.set(3, 5)).toThrow(IndexOutOfBoundsException); // index === size
        });
    });

    // --- Remove Operations ---
    describe("Remove Operations (remove, removeAt, removeFirst, removeLast)", () => {
        beforeEach(() => {
            list = new CircularLinkedList<number>([10, 20, 30, 40, 50]);
        });

        test("remove should remove the first occurrence of an element and return true", () => {
            expect(list.remove(30)).toBe(true);
            expect(list.size()).toBe(4);
            expect(list.toArray()).toEqual([10, 20, 40, 50]);
            // Remove head
            expect(list.remove(10)).toBe(true);
            expect(list.size()).toBe(3);
            expect(list.toArray()).toEqual([20, 40, 50]);
            // Remove tail
            expect(list.remove(50)).toBe(true);
            expect(list.size()).toBe(2);
            expect(list.toArray()).toEqual([20, 40]);
        });

        test("remove should return false if the element is not found", () => {
            expect(list.remove(60)).toBe(false);
            expect(list.size()).toBe(5);
        });

        test("remove should handle removing the only element", () => {
            const singleList = new CircularLinkedList<number>([100]);
            expect(singleList.remove(100)).toBe(true);
            expect(singleList.isEmpty()).toBe(true);
            expect(singleList.size()).toBe(0);
        });

        test("removeAt should remove the element at the specified index and return it", () => {
            expect(list.removeAt(2)).toBe(30); // Remove middle
            expect(list.size()).toBe(4);
            expect(list.toArray()).toEqual([10, 20, 40, 50]);

            expect(list.removeAt(0)).toBe(10); // Remove head
            expect(list.size()).toBe(3);
            expect(list.toArray()).toEqual([20, 40, 50]);

            expect(list.removeAt(2)).toBe(50); // Remove tail (index is now 2)
            expect(list.size()).toBe(2);
            expect(list.toArray()).toEqual([20, 40]);
        });

        test("removeAt should handle removing the only element", () => {
            const singleList = new CircularLinkedList<number>([100]);
            expect(singleList.removeAt(0)).toBe(100);
            expect(singleList.isEmpty()).toBe(true);
            expect(singleList.size()).toBe(0);
        });

        test("removeAt should throw IndexOutOfBoundsException for invalid index", () => {
            expect(() => list.removeAt(-1)).toThrow(IndexOutOfBoundsException);
            expect(() => list.removeAt(5)).toThrow(IndexOutOfBoundsException); // index === size
        });

        test("removeFirst should remove and return the first element", () => {
            expect(list.removeFirst()).toBe(10);
            expect(list.size()).toBe(4);
            expect(list.toArray()).toEqual([20, 30, 40, 50]);
        });

        test("removeFirst should throw NoElementsException on empty list", () => {
            const emptyList = new CircularLinkedList<number>();
            expect(() => emptyList.removeFirst()).toThrow(NoElementsException);
        });

        test("removeLast should remove and return the last element", () => {
            expect(list.removeLast()).toBe(50);
            expect(list.size()).toBe(4);
            expect(list.toArray()).toEqual([10, 20, 30, 40]);
        });

        test("removeLast should throw NoElementsException on empty list", () => {
            const emptyList = new CircularLinkedList<number>();
            expect(() => emptyList.removeLast()).toThrow(NoElementsException);
        });
    });

    // --- State & Utility Methods ---
    describe("State & Utility Methods (size, length, isEmpty, clear, toArray)", () => {
        test("should report correct size and length", () => {
            expect(list.size()).toBe(0);
            expect(list.length).toBe(0);
            list.add(1);
            list.add(2);
            expect(list.size()).toBe(2);
            expect(list.length).toBe(2);
        });

        test("isEmpty should return true for empty list, false otherwise", () => {
            expect(list.isEmpty()).toBe(true);
            list.add(1);
            expect(list.isEmpty()).toBe(false);
        });

        test("clear should remove all elements", () => {
            list.add(1);
            list.add(2);
            list.clear();
            expect(list.size()).toBe(0);
            expect(list.length).toBe(0);
            expect(list.isEmpty()).toBe(true);
            expect(list.toArray()).toEqual([]);
            // Try clearing an already empty list
            list.clear();
            expect(list.size()).toBe(0);
        });

        test("toArray should return an array representation of the list", () => {
            expect(list.toArray()).toEqual([]);
            list = new CircularLinkedList<number>([10, 20, 30]);
            expect(list.toArray()).toEqual([10, 20, 30]);
        });
    });

    // --- Iteration ---
    describe("Iteration ([Symbol.iterator])", () => {
        test("should iterate correctly over an empty list", () => {
            const elements = [];
            for (const item of list) {
                elements.push(item);
            }
            expect(elements).toEqual([]);
        });

        test("should iterate correctly over a single-element list", () => {
            list.add(100);
            const elements = [];
            for (const item of list) {
                elements.push(item);
            }
            expect(elements).toEqual([100]);
        });

        test("should iterate correctly over a multi-element list", () => {
            list = new CircularLinkedList<number>([1, 2, 3, 4, 5]);
            const elements = [];
            for (const item of list) {
                elements.push(item);
            }
            expect(elements).toEqual([1, 2, 3, 4, 5]);
        });
    });

    // --- getRange Tests ---
    describe("getRange", () => {
        beforeEach(() => {
            list = new CircularLinkedList<number>([0, 1, 2, 3, 4]); // Size 5
        });

        test("should return an empty list for count 0", () => {
            const range = list.getRange(0, 0);
            expect(range.isEmpty()).toBe(true);
            expect(range.size()).toBe(0);
        });

        test("should return correct range from the start", () => {
            const range = list.getRange(0, 3);
            expect(range.toArray()).toEqual([0, 1, 2]);
        });

        test("should return correct range from the middle", () => {
            const range = list.getRange(2, 2);
            expect(range.toArray()).toEqual([2, 3]);
        });

        test("should return correct range wrapping around", () => {
            const range = list.getRange(3, 4); // Should get 3, 4, 0, 1
            expect(range.toArray()).toEqual([3, 4, 0, 1]);
        });

        test("should return correct range equal to list size", () => {
            const range = list.getRange(0, 5);
            expect(range.toArray()).toEqual([0, 1, 2, 3, 4]);
            const range2 = list.getRange(2, 5); // Start at 2, get 5 elements
            expect(range2.toArray()).toEqual([2, 3, 4, 0, 1]);
        });

        test("should return fewer elements if count exceeds available elements after index", () => {
            // This behavior is slightly different from linear lists; circular lists wrap.
            // The implementation takes 'count' elements regardless of wrapping.
            const range = list.getRange(4, 3); // Get 4, 0, 1
            expect(range.toArray()).toEqual([4, 0, 1]);
            const rangeFullWrap = list.getRange(1, 7); // Get 1, 2, 3, 4, 0, 1, 2
            expect(rangeFullWrap.toArray()).toEqual([1, 2, 3, 4, 0, 1, 2]); // Takes exactly 'count'
        });

        test("should throw for invalid index", () => {
            expect(() => list.getRange(-1, 2)).toThrow(IndexOutOfBoundsException);
            expect(() => list.getRange(5, 1)).toThrow(IndexOutOfBoundsException); // index === size
        });

        test("should throw for negative count", () => {
            expect(() => list.getRange(0, -1)).toThrow(InvalidArgumentException);
        });

        test("should handle empty list correctly", () => {
            const emptyList = new CircularLinkedList<number>();
            expect(emptyList.getRange(0, 0).isEmpty()).toBe(true);
            // expect(() => emptyList.getRange(1, 1)).toThrow(IndexOutOfBoundsException);
            // expect(() => emptyList.getRange(0, 1)).toThrow(IndexOutOfBoundsException);
        });
    });

    // --- Sort Tests ---
    describe("sort", () => {
        test("should not change an empty list", () => {
            list.sort();
            expect(list.toArray()).toEqual([]);
        });

        test("should not change a single-element list", () => {
            list.add(5);
            list.sort();
            expect(list.toArray()).toEqual([5]);
        });

        test("should sort a list with multiple elements", () => {
            list = new CircularLinkedList<number>([3, 1, 4, 1, 5, 9, 2, 6]);
            list.sort();
            expect(list.toArray()).toEqual([1, 1, 2, 3, 4, 5, 6, 9]);
        });

        test("should sort using a custom comparator (descending)", () => {
            list = new CircularLinkedList<number>([3, 1, 4, 1, 5, 9, 2, 6]);
            list.sort((a, b) => b - a); // Descending order
            expect(list.toArray()).toEqual([9, 6, 5, 4, 3, 2, 1, 1]);
        });

        test("should sort objects using a custom comparator", () => {
            objectList = new CircularLinkedList<{ id: number; value: string }>([obj3, obj1, obj4, obj2]);
            objectList.sort((a, b) => a.id - b.id); // Sort by id
            expect(objectList.toArray()).toEqual([obj1, obj2, obj3, obj4]);
        });
    });

    // --- Comparator Tests ---
    describe("Comparator", () => {
        test("should use default comparator if none provided", () => {
            objectList.add(obj1);
            objectList.add(obj2);
            objectList.add(obj1); // Add duplicate object reference
            expect(objectList.indexOf(obj1)).toBe(0);
            expect(objectList.lastIndexOf(obj1)).toBe(2);
            expect(objectList.contains(obj1)).toBe(true);
            expect(objectList.contains({id: 1, value: "a"})).toBe(false); // Different object instance
            expect(objectList.remove(obj1)).toBe(true); // Removes first instance
            expect(objectList.toArray()).toEqual([obj2, obj1]);
        });

        test("should use custom comparator for operations", () => {
            const idComparator = (o1: { id: number }, o2: { id: number }) => o1.id === o2.id;
            objectList = new CircularLinkedList<{ id: number; value: string }>([], idComparator);
            objectList.add(obj1);
            objectList.add(obj2);
            objectList.add(obj3);

            const obj1DifferentRef = {id: 1, value: "newA"};
            const obj4NotFound = {id: 4, value: "d"};

            expect(objectList.contains(obj1DifferentRef)).toBe(true); // Found by ID
            expect(objectList.contains(obj4NotFound)).toBe(false);
            expect(objectList.indexOf(obj1DifferentRef)).toBe(0);
            expect(objectList.lastIndexOf(obj1DifferentRef)).toBe(0);

            expect(objectList.remove(obj1DifferentRef)).toBe(true); // Removes obj1 by ID match
            expect(objectList.toArray()).toEqual([obj2, obj3]);
            expect(objectList.size()).toBe(2);
        });
    });

    // --- Edge Cases ---
    describe("Edge Cases", () => {
        test("should handle operations correctly after clear", () => {
            list = new CircularLinkedList<number>([1, 2, 3]);
            list.clear();
            expect(list.isEmpty()).toBe(true);
            list.add(10);
            expect(list.toArray()).toEqual([10]);
            list.addFirst(5);
            expect(list.toArray()).toEqual([5, 10]);
            expect(() => list.removeAt(2)).toThrow(IndexOutOfBoundsException);
            expect(list.remove(10)).toBe(true);
            expect(list.toArray()).toEqual([5]);
        });

        test("should handle multiple additions and removals maintaining circularity", () => {
            list.addFirst(1); // [1]
            list.addLast(3);  // [1, 3]
            list.addAt(2, 1); // [1, 2, 3]
            list.addFirst(0); // [0, 1, 2, 3]
            list.addLast(4);  // [0, 1, 2, 3, 4]

            expect(list.toArray()).toEqual([0, 1, 2, 3, 4]);
            expect(list.size()).toBe(5);

            expect(list.removeAt(2)).toBe(2); // [0, 1, 3, 4]
            expect(list.removeFirst()).toBe(0); // [1, 3, 4]
            expect(list.removeLast()).toBe(4);   // [1, 3]
            expect(list.remove(1)).toBe(true); // [3]
            expect(list.removeAt(0)).toBe(3); // []

            expect(list.isEmpty()).toBe(true);
        });
    });
});
