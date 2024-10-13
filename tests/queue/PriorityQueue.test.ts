import { describe, test } from "vitest";
import { PriorityQueue } from "../../src/imports";
import { Comparators } from "../../src/shared/Comparators";
import { NoElementsException } from "../../src/shared/NoElementsException";

describe("PriorityQueue", () => {
    describe("#add()", () => {
        test("should add an element to the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.add(1);
            expect(queue.size()).toBe(1);
            expect(queue.length).toBe(1);
        });
        test("should form a min priority queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([70, 5, 0, 14, 20, 65, 12, 37]);
            expect(queue.toArray()).toEqual([0, 14, 5, 37, 20, 65, 12, 70]);
        });
        test("should form a max priority queue", () => {
            const queue = new PriorityQueue<number>([70, 5, 0, 14, 20, 65, 12, 37], Comparators.reverseOrderComparator);
            expect(queue.toArray()).toEqual([70, 37, 65, 20, 14, 0, 12, 5]);
        });
    });

    describe("#clear()", () => {
        test("should clear the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.add(1);
            expect(queue.size()).toBe(1);
            expect(queue.length).toBe(1);
            queue.clear();
            expect(queue.size()).toBe(0);
            expect(queue.length).toBe(0);
        });
    });

    describe("#dequeue()", () => {
        test("should throw error if queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(() => queue.dequeue()).toThrow(new NoElementsException());
        });
        test("should remove the head of the queue and return it", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            const head = queue.dequeue();
            expect(head).toBe(1);
            expect(queue.size()).toBe(2);
            expect(queue.length).toBe(2);
            expect(queue.contains(1)).toBe(false);
            expect(queue.toArray()).toEqual([2, 3]);
        });
    });

    describe("#enqueue()", () => {
        test("should add elements at the end of the queue", () => {
            const expectedResult = [1, 2, 3];
            const queue = new PriorityQueue<number>();
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.toArray()).toEqual(expectedResult);
            expect(queue.size()).toBe(3);
            expect(queue.length).toBe(3);
        });
    });

    describe("#front()", () => {
        test("should throw error if queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(() => queue.front()).toThrow(new NoElementsException());
        });
        test("should return the head of the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            expect(queue.front()).toBe(1);
        });
    });

    describe("#isEmpty()", () => {
        test("should return true if the queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(queue.isEmpty()).toBe(true);
        });
        test("should return false if the queue is not empty", () => {
            const queue = new PriorityQueue<number>();
            queue.add(1);
            expect(queue.isEmpty()).toBe(false);
        });
    });

    describe("#peek()", () => {
        test("should not throw error if queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(() => queue.peek()).not.toThrow(new NoElementsException());
        });
        test("should return the head of the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            expect(queue.peek()).toBe(1);
        });
        test("should return null if the queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(queue.peek()).toBe(null);
        });
    });

    describe("#poll()", () => {
        test("should not throw error if queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(() => queue.poll()).not.toThrow();
        });
        test("should remove and return the head of the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            expect(queue.poll()).toBe(1);
            expect(queue.size()).toBe(2);
        });
        test("should return null if the queue is empty", () => {
            const queue = new PriorityQueue<number>();
            expect(queue.poll()).toBe(null);
        });
    });

    describe("#size()", () => {
        test("should return the number of elements in the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            expect(queue.size()).toBe(3);
        });
    });

    describe("#toArray()", () => {
        test("should return an array representation of the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            expect(queue.toArray()).toEqual([1, 2, 3]);
        });
    });

    describe("#toString()", () => {
        test("should return a string representation of the queue", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            expect(queue.toString()).toBe("1, 2, 3");
        });
    });

    describe("#[Symbol.iterator]()", () => {
        test("should return an iterator", () => {
            const queue = new PriorityQueue<number>();
            queue.addAll([1, 2, 3]);
            const iterator = queue[Symbol.iterator]();
            expect(iterator.next().value).toBe(1);
            expect(iterator.next().value).toBe(2);
            expect(iterator.next().value).toBe(3);
            expect(iterator.next().done).toBe(true);
        });
    });
});
