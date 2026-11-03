import { describe, expect, test } from "vitest";
import { ImmutableHeap, ImmutableList, ImmutablePriorityQueue, ImmutableQueue, ImmutableSortedDictionary, ImmutableSortedSet, ImmutableStack } from "../../src";

const COUNT = 100000;

// Each update used to copy the whole collection, which made these loops quadratic.
const timed = (run: () => void): number => {
    const start = performance.now();
    run();
    return performance.now() - start;
};

describe("Immutable collection update performance", () => {
    test("should update ImmutableList one element at a time efficiently", () => {
        let list = ImmutableList.create<number>();
        const elapsed = timed(() => {
            for (let i = 0; i < COUNT; ++i) {
                list = list.add(i);
            }
            for (let i = 0; i < COUNT; ++i) {
                list = list.set(i, -i);
            }
        });
        expect(elapsed).toBeLessThan(1000);
        expect(list.get(COUNT - 1)).toBe(-(COUNT - 1));
    });
    test("should update ImmutableSortedSet one element at a time efficiently", () => {
        let set = ImmutableSortedSet.create<number>();
        const elapsed = timed(() => {
            for (let i = 0; i < COUNT; ++i) {
                set = set.add((i * 7919) % COUNT);
            }
            for (let i = 0; i < COUNT; i += 2) {
                set = set.remove(i);
            }
        });
        expect(elapsed).toBeLessThan(1000);
        expect(set.size()).toBe(COUNT / 2);
    });
    test("should update ImmutableSortedDictionary one key at a time efficiently", () => {
        let dictionary = ImmutableSortedDictionary.create<number, number>();
        const elapsed = timed(() => {
            for (let i = 0; i < COUNT; ++i) {
                dictionary = dictionary.put((i * 7919) % COUNT, i);
            }
            for (let i = 0; i < COUNT; i += 2) {
                dictionary = dictionary.remove(i);
            }
        });
        expect(elapsed).toBeLessThan(1000);
        expect(dictionary.size()).toBe(COUNT / 2);
    });
    test("should push and pop ImmutableStack efficiently", () => {
        let stack = ImmutableStack.create<number>();
        const elapsed = timed(() => {
            for (let i = 0; i < COUNT; ++i) {
                stack = stack.push(i);
            }
            for (let i = 0; i < COUNT / 2; ++i) {
                stack = stack.pop();
            }
        });
        expect(elapsed).toBeLessThan(500);
        expect(stack.peek()).toBe(COUNT / 2 - 1);
    });
    test("should enqueue and dequeue ImmutableQueue efficiently", () => {
        let queue = ImmutableQueue.create<number>();
        const elapsed = timed(() => {
            for (let i = 0; i < COUNT; ++i) {
                queue = queue.enqueue(i);
            }
            for (let i = 0; i < COUNT / 2; ++i) {
                queue = queue.dequeue();
            }
        });
        expect(elapsed).toBeLessThan(500);
        expect(queue.front()).toBe(COUNT / 2);
    });
    test("should add to and poll ImmutableHeap and ImmutablePriorityQueue efficiently", () => {
        let heap = ImmutableHeap.create<number>();
        let queue = ImmutablePriorityQueue.create<number>();
        const elapsed = timed(() => {
            for (let i = 0; i < COUNT; ++i) {
                const element = (i * 7919) % COUNT;
                heap = heap.add(element);
                queue = queue.enqueue(element);
            }
            for (let i = 0; i < COUNT / 10; ++i) {
                heap = heap.poll();
                queue = queue.dequeue();
            }
        });
        expect(elapsed).toBeLessThan(2000);
        expect(heap.peek()).toBe(COUNT / 10);
        expect(queue.front()).toBe(COUNT / 10);
    });
});
