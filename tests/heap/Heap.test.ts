import { describe, expect, test } from "vitest";
import { Heap } from "../../src/heap/Heap";
import { Comparators } from "../../src/shared/Comparators";

describe("Heap", () => {
    describe("#add()", () => {
        test("should add elements to the heap", () => {
            const heap = new Heap<number>();
            heap.add(34);
            heap.add(55);
            heap.add(63);
            heap.add(69);
            heap.add(87);
            heap.add(28);
            heap.add(64);
            heap.add(15);
            expect(heap.size()).toBe(8);
            const array = [...heap]; // min heap
            expect(array).toEqual([15, 28, 34, 55, 87, 63, 64, 69]);
        });
        test("should add elements to the heap #2", () => {
            const heap = new Heap<number>();
            heap.add(98);
            heap.add(101);
            heap.add(12);
            heap.add(56);
            heap.add(48);
            heap.add(87);
            heap.add(77);
            heap.add(3);
            heap.add(58);
            heap.add(29);
            const expected = [3, 12, 77, 48, 29, 98, 87, 101, 58, 56];
            expect(heap.size()).toBe(10);
            const array = [...heap]; // min heap
            expect(array).toEqual(expected);
        });
        it("should add elements in descending order", () => {
            const heap = new Heap<number>(Comparators.reverseOrderComparator);
            heap.add(16);
            heap.add(1210);
            heap.add(1060);
            heap.add(438);
            heap.add(1219);
            const expected = [1219, 1210, 1060, 16, 438];
            expect(heap.size()).toBe(5);
            const array = [...heap]; // max heap
            expect(array).toEqual(expected);
            expect(heap.peek()).toBe(1219);
            expect(heap.first()).toBe(1219);
            expect(heap.last()).toBe(438);
        });
    });

    describe("#clear()", () => {
        const heap = new Heap<number>();
        heap.add(34);
        heap.add(55);
        heap.add(63);
        heap.clear();
        test("should clear the heap", () => {
            expect(heap.size()).toBe(0);
        });
    });

    describe("#contains()", () => {
        const heap = new Heap<number>();
        heap.add(34);
        heap.add(55);
        heap.add(63);
        test("should return true if the heap contains the element", () => {
            expect(heap.contains(55)).toBe(true);
        });
        test("should return false if the heap does not contain the element", () => {
            expect(heap.contains(100)).toBe(false);
        });
    });

    describe("#containsAll()", () => {
        const heap = new Heap<number>();
        heap.add(34);
        heap.add(55);
        heap.add(63);
        test("should return true if the heap contains all elements in the collection", () => {
            expect(heap.containsAll([55, 63])).toBe(true);
        });
        test("should return false if the heap does not contain all elements in the collection", () => {
            expect(heap.containsAll([55, 100])).toBe(false);
        });
    });

    describe("#constructor()", () => {
        test("should create a min heap from an iterable", () => {
            const heap = new Heap<number>(null, [88, 4, 26, 11, 8]);
            expect(heap.size()).toBe(5);
            const array = [...heap]; // min heap
            expect(array).toEqual([4, 8, 26, 88, 11]);
        });
        test("should create a max heap from an iterable", () => {
            const heap = new Heap<number>(Comparators.reverseOrderComparator, [88, 4, 26, 11, 8]);
            expect(heap.size()).toBe(5);
            const array = [...heap]; // max heap
            expect(array).toEqual([88, 11, 26, 4, 8]);
        });
    });

    describe("#isEmpty()", () => {
        const heap = new Heap<number>();
        test("should return true if the heap is empty", () => {
            expect(heap.isEmpty()).toBe(true);
        });
        test("should return false if the heap is not empty", () => {
            heap.add(34);
            expect(heap.isEmpty()).toBe(false);
        });
    });

    describe("#peek()", () => {
        const heap = new Heap<number>();
        heap.add(34);
        heap.add(55);
        heap.add(63);
        test("should return the root element of the heap", () => {
            expect(heap.peek()).toBe(34);
        });
        test("should not remove the root element of the heap", () => {
            const peeked = heap.peek();
            expect(peeked).toBe(34);
            expect(heap.size()).toBe(3);
        });
    });

    describe("#poll()", () => {
        test("should remove and return the root element of the heap", () => {
            const heap = new Heap<number>();
            heap.add(36);
            heap.add(42);
            heap.add(74);
            heap.add(11);
            heap.add(83);
            expect(heap.poll()).toBe(11);
            expect(heap.length).toBe(4);
            expect(heap.peek()).toBe(36);
        });
        test("should remove and return the root element of the heap", () => {
            const heap = new Heap<number>();
            heap.addAll([42, 25, 12, 86, 88, 75, 5, 66, 6, 104]);
            expect(heap.poll()).toBe(5);
            expect(heap.length).toBe(9);
        });
        test("should return null if the heap is empty", () => {
            const heap = new Heap<number>();
            expect(heap.poll()).toBe(null);
        });
    });

    describe("#remove()", () => {
        test("should remove the element from the max heap", () => {
            const heap = new Heap<number>(Comparators.reverseOrderComparator);
            heap.add(88);
            heap.add(4);
            heap.add(26);
            heap.add(11);
            heap.add(8);
            expect(heap.remove(26)).toBe(true);
            expect(heap.size()).toBe(4);
            expect(heap.contains(26)).toBe(false);
            expect(heap.toArray()).toEqual([88, 11, 8, 4]);
        });
        test("should remove the element from the min heap", () => {
            const heap = new Heap<number>();
            heap.add(88);
            heap.add(4);
            heap.add(26);
            heap.add(11);
            heap.add(8);
            expect(heap.toArray()).toEqual([4, 8, 26, 88, 11]);
            expect(heap.remove(26)).toBe(true);
            expect(heap.size()).toBe(4);
            expect(heap.contains(26)).toBe(false);
            expect(heap.toArray()).toEqual([4, 8, 11, 88]);
        });
        test("should remove the first instance of the element from the heap", () => {
            const heap = new Heap<number>(Comparators.reverseOrderComparator);
            heap.add(88);
            heap.add(4);
            heap.add(26);
            heap.add(26);
            heap.add(11);
            heap.add(8);
            expect(heap.toArray()).toEqual([88, 26, 26, 4, 11, 8]);
            expect(heap.remove(26)).toBe(true);
            expect(heap.size()).toBe(5);
            expect(heap.contains(26)).toBe(true);
            expect(heap.toArray()).toEqual([88, 11, 26, 4, 8]);
        });
        test("should remove the first element from the heap", () => {
            const heap = new Heap<string>();
            heap.add("z");
            heap.add("a");
            heap.add("n");
            heap.add("g");
            heap.add("c");
            expect(heap.toArray()).toEqual(["a", "c", "n", "z", "g"]);
            expect(heap.remove("a")).toBe(true);
            expect(heap.size()).toBe(4);
            expect(heap.contains("a")).toBe(false);
            expect(heap.toArray()).toEqual(["c", "g", "n", "z"]);
        });
    });
    describe("#removeAll()", () => {
        test("should remove all elements from the given iterable", () => {
            const heap = new Heap<number>(Comparators.reverseOrderComparator, [78, 3, 16, 16, 10, 7]);
            heap.removeAll([3, 16]);
            expect(heap.size()).toBe(3);
            expect(heap.toArray()).toEqual([78, 10, 7]);
        });
        test("should return true if the heap was modified", () => {
            const heap = new Heap<number>();
            heap.addAll([1, 2, 3, 4, 5, 6]);
            const result = heap.removeAll([3, 5]);
            expect(result).toBe(true);
            expect(heap.size()).toBe(4);
            expect(heap.toArray()).toEqual([1, 2, 4, 6]);
        });
    });
});