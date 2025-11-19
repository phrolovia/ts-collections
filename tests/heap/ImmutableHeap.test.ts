import { describe, expect, it } from "vitest";
import { ImmutableHeap } from "../../src/heap/ImmutableHeap";
import { Comparators } from "../../src/shared/Comparators";

describe("ImmutableHeap", () => {
    describe("create", () => {
        it("should create an empty heap when no arguments are provided", () => {
            const heap = ImmutableHeap.create<number>();
            expect(heap.isEmpty()).toBe(true);
            expect(heap.size()).toBe(0);
            expect(heap.length).toBe(0);
            expect(heap.peek()).toBeNull();
            expect(heap.toArray()).toEqual([]);
        });

        it("should create a heap with initial elements (default comparator)", () => {
            const heap = ImmutableHeap.create([5, 1, 3]);
            expect(heap.isEmpty()).toBe(false);
            expect(heap.size()).toBe(3);
            expect(heap.peek()).toBe(1);
        });

        it("should create a heap with a custom comparator", () => {
            const maxComparator = Comparators.reverseOrderComparator as (a: number, b: number) => number;
            const heap = ImmutableHeap.create([5, 1, 3, 8], maxComparator);
            expect(heap.size()).toBe(4);
            expect(heap.peek()).toBe(8);
            expect(heap.comparator).toBe(maxComparator);
        });
    });

    describe("immutability", () => {
        const initialHeap = ImmutableHeap.create([5, 1, 9, 3]);

        it("add should return a new instance", () => {
            const next = initialHeap.add(0);
            expect(next).not.toBe(initialHeap);
            expect(initialHeap.size()).toBe(4);
            expect(initialHeap.peek()).toBe(1);
            expect(next.size()).toBe(5);
            expect(next.peek()).toBe(0);
        });

        it("addAll should return a new instance when collection has items", () => {
            const added = initialHeap.addAll([7, 2]);
            expect(added).not.toBe(initialHeap);
            expect(initialHeap.size()).toBe(4);
            expect(added.size()).toBe(6);
            expect(added.peek()).toBe(1); // 1 is still the smallest element
        });

        it("addAll with an empty collection should return the same instance", () => {
            const unchanged = initialHeap.addAll([]);
            expect(unchanged).toBe(initialHeap);
        });

        it("clear should return a new empty heap", () => {
            const cleared = initialHeap.clear();
            expect(cleared).not.toBe(initialHeap);
            expect(cleared.isEmpty()).toBe(true);
            expect(cleared.size()).toBe(0);
            expect(cleared.comparator).toBe(initialHeap.comparator);
        });

        it("clear on an empty heap should return the same instance", () => {
            const empty = ImmutableHeap.create<number>();
            expect(empty.clear()).toBe(empty);
        });

        it("poll should return a new heap and preserve the original", () => {
            const polled = initialHeap.poll();
            expect(polled).not.toBe(initialHeap);
            expect(initialHeap.peek()).toBe(1);
            expect(initialHeap.size()).toBe(4);
            expect(polled.size()).toBe(3);
            expect(polled.peek()).toBe(3);
        });

        it("poll on an empty heap should return the same instance", () => {
            const empty = ImmutableHeap.create<number>();
            expect(empty.poll()).toBe(empty);
        });

        it("remove should return a new heap when the element exists", () => {
            const updated = initialHeap.remove(3);
            expect(updated).not.toBe(initialHeap);
            expect(updated.contains(3)).toBe(false);
            expect(updated.size()).toBe(3);
        });

        it("remove should return the same instance when the element does not exist", () => {
            const unchanged = initialHeap.remove(42);
            expect(unchanged).toBe(initialHeap);
        });

        it("removeAll should return a new heap when something is removed", () => {
            const updated = initialHeap.removeAll([1, 9]);
            expect(updated).not.toBe(initialHeap);
            expect(updated.contains(1)).toBe(false);
            expect(updated.contains(9)).toBe(false);
            expect(updated.size()).toBe(2);
        });

        it("removeAll should return the same heap when nothing matches", () => {
            const unchanged = initialHeap.removeAll([100, 200]);
            expect(unchanged).toBe(initialHeap);
        });

        it("removeIf should return a new heap when items are removed", () => {
            const heapWithEven = initialHeap.add(2).add(4);
            const updated = heapWithEven.removeIf(value => value % 2 === 0);
            expect(updated).not.toBe(heapWithEven);
            expect(heapWithEven.contains(2)).toBe(true);
            expect(heapWithEven.contains(4)).toBe(true);
            expect(updated.contains(2)).toBe(false);
            expect(updated.contains(4)).toBe(false);
            expect(updated.contains(5)).toBe(true);
            expect(updated.contains(1)).toBe(true);
            expect(updated.contains(9)).toBe(true);
            expect(updated.contains(3)).toBe(true);
            expect(updated.size()).toBe(heapWithEven.size() - 2);
        });

        it("removeIf should return the same heap when predicate matches nothing", () => {
            const unchanged = initialHeap.removeIf(() => false);
            expect(unchanged).toBe(initialHeap);
        });
    });

    describe("behavior", () => {
        it("should maintain heap property across operations", () => {
            let heap = ImmutableHeap.create<number>();
            heap = heap.add(5).add(1).add(9).add(3).add(7);
            expect(heap.peek()).toBe(1);
            heap = heap.poll();
            expect(heap.peek()).toBe(3);
            heap = heap.add(2);
            expect(heap.peek()).toBe(2);
            heap = heap.poll();
            expect(heap.peek()).toBe(3);
            expect(heap.size()).toBe(4);
        });

        it("contains should reflect membership", () => {
            const heap = ImmutableHeap.create([4, 2, 7, 1]);
            expect(heap.contains(4)).toBe(true);
            expect(heap.contains(7)).toBe(true);
            expect(heap.contains(10)).toBe(false);
        });

        it("containsAll should validate multiple elements", () => {
            const heap = ImmutableHeap.create([4, 2, 7, 1]);
            expect(heap.containsAll([2, 4])).toBe(true);
            expect(heap.containsAll([2, 8])).toBe(false);
            expect(heap.containsAll([])).toBe(true);
        });

        it("should allow iteration", () => {
            const heap = ImmutableHeap.create([5, 1, 9, 3, 7]);
            const items = [...heap];
            expect(items.length).toBe(5);
            expect(items.sort(Comparators.orderComparator as (a: number, b: number) => number)).toEqual([1, 3, 5, 7, 9]);
            expect(heap.size()).toBe(5);
        });

        it("should support custom comparators (max-heap)", () => {
            const maxComparator = Comparators.reverseOrderComparator as (a: number, b: number) => number;
            let heap = ImmutableHeap.create([5, 1, 9, 3, 7], maxComparator);
            expect(heap.peek()).toBe(9);
            heap = heap.add(11);
            expect(heap.peek()).toBe(11);
            heap = heap.poll();
            expect(heap.peek()).toBe(9);
        });
    });
});



