import { describe, expect } from "vitest";
import { ImmutablePriorityQueue } from "../../src/queue/ImmutablePriorityQueue";
import { Comparators } from "../../src/shared/Comparators";
import { NoElementsException } from "../../src/shared/NoElementsException";

describe('ImmutablePriorityQueue', () => {
    // --- Creation Tests ---
    describe('create', () => {
        it('should create an empty queue when no arguments are provided', () => {
            const queue = ImmutablePriorityQueue.create<number>();
            expect(queue.isEmpty()).toBe(true);
            expect(queue.size()).toBe(0);
            expect(queue.length).toBe(0);
            expect(queue.toArray()).toEqual([]);
        });

        it('should create a queue with initial elements (default comparator)', () => {
            const queue = ImmutablePriorityQueue.create([5, 1, 3]);
            expect(queue.size()).toBe(3);
            expect(queue.length).toBe(3);
            expect(queue.peek()).toBe(1); // Default is min-heap
        });

        it('should create a queue with initial elements and a custom comparator', () => {
            // Max-heap comparator
            const maxComparator = Comparators.reverseOrderComparator;
            const queue = ImmutablePriorityQueue.create([5, 1, 3, 8], maxComparator);
            expect(queue.size()).toBe(4);
            expect(queue.peek()).toBe(8); // Max element should be at the front
            expect(queue.comparator).toBe(maxComparator);
        });
    });

    // --- Immutability Tests ---
    describe('Immutability', () => {
        const initialQueue = ImmutablePriorityQueue.create([5, 1, 3]);

        it('add should return a new instance', () => {
            const newQueue = initialQueue.add(0);
            expect(newQueue).not.toBe(initialQueue);
            expect(initialQueue.size()).toBe(3); // Original unchanged
            expect(initialQueue.peek()).toBe(1);
            expect(newQueue.size()).toBe(4);
            expect(newQueue.peek()).toBe(0);
        });

        it('addAll should return a new instance', () => {
            const newQueue = initialQueue.addAll([0, 4]);
            expect(newQueue).not.toBe(initialQueue);
            expect(initialQueue.size()).toBe(3); // Original unchanged
            expect(initialQueue.peek()).toBe(1);
            expect(newQueue.size()).toBe(5);
            expect(newQueue.peek()).toBe(0);
        });

        it('addAll with empty collection should return the same instance', () => {
            const newQueue = initialQueue.addAll([]);
            expect(newQueue).toBe(initialQueue);
        });

        it('clear should return a new empty instance', () => {
            const emptyQueue = initialQueue.clear();
            expect(emptyQueue).not.toBe(initialQueue);
            expect(initialQueue.size()).toBe(3); // Original unchanged
            expect(emptyQueue.isEmpty()).toBe(true);
            expect(emptyQueue.size()).toBe(0);
        });

        it('clear on an empty queue should return the same instance', () => {
            const emptyQueue = ImmutablePriorityQueue.create<number>();
            const clearedQueue = emptyQueue.clear();
            expect(clearedQueue).toBe(emptyQueue);
        });

        it('dequeue should return a new instance', () => {
            const newQueue = initialQueue.dequeue();
            expect(newQueue).not.toBe(initialQueue);
            expect(initialQueue.size()).toBe(3); // Original unchanged
            expect(initialQueue.peek()).toBe(1);
            expect(newQueue.size()).toBe(2);
            expect(newQueue.peek()).toBe(3);
        });

        it('poll should return a new instance', () => {
            const newQueue = initialQueue.poll();
            expect(newQueue).not.toBe(initialQueue);
            expect(initialQueue.size()).toBe(3); // Original unchanged
            expect(initialQueue.peek()).toBe(1);
            expect(newQueue.size()).toBe(2);
            expect(newQueue.peek()).toBe(3);
        });

        it('poll on an empty queue should return the same empty instance', () => {
            const emptyQueue = ImmutablePriorityQueue.create<number>();
            const polledQueue = emptyQueue.poll();
            expect(polledQueue).toBe(emptyQueue); // Should return the canonical empty instance
            expect(polledQueue.isEmpty()).toBe(true);
        });

        it('remove should return a new instance if element exists', () => {
            const queueWithRemoved = initialQueue.remove(3);
            expect(queueWithRemoved).not.toBe(initialQueue);
            expect(initialQueue.size()).toBe(3); // Original unchanged
            expect(queueWithRemoved.size()).toBe(2);
            expect(queueWithRemoved.contains(3)).toBe(false);
        });

        it('remove should return the same instance if element does not exist', () => {
            const queueWithRemoved = initialQueue.remove(10);
            expect(queueWithRemoved).toBe(initialQueue); // No change
            expect(queueWithRemoved.size()).toBe(3);
        });

        // Similar immutability checks for removeAll, removeIf...
    });

    // --- Functionality Tests ---
    describe('Functionality', () => {
        const queue = ImmutablePriorityQueue.create([5, 1, 9, 3, 7]); // Default min-heap

        it('should report correct size/length', () => {
            expect(queue.size()).toBe(5);
            expect(queue.length).toBe(5);
        });

        it('should correctly report isEmpty', () => {
            expect(queue.isEmpty()).toBe(false);
            expect(ImmutablePriorityQueue.create().isEmpty()).toBe(true);
        });

        it('peek should return the highest priority element without modifying', () => {
            expect(queue.peek()).toBe(1);
            expect(queue.size()).toBe(5); // Unchanged
        });

        it('peek on empty queue should return null', () => {
            expect(ImmutablePriorityQueue.create().peek()).toBeNull();
        });

        it('front should return the highest priority element without modifying', () => {
            expect(queue.front()).toBe(1);
            expect(queue.size()).toBe(5); // Unchanged
        });

        it('front on empty queue should throw NoElementsException', () => {
            expect(() => ImmutablePriorityQueue.create().front()).toThrow(NoElementsException);
        });

        it('dequeue should remove and return a queue without the highest priority element', () => {
            let currentQueue = queue; // 1, 3, 5, 7, 9 (logical order)
            currentQueue = currentQueue.dequeue(); // Remove 1 -> 3, 5, 7, 9
            expect(currentQueue.peek()).toBe(3);
            expect(currentQueue.size()).toBe(4);
            currentQueue = currentQueue.dequeue(); // Remove 3 -> 5, 7, 9
            expect(currentQueue.peek()).toBe(5);
            expect(currentQueue.size()).toBe(3);
            currentQueue = currentQueue.dequeue(); // Remove 5 -> 7, 9
            expect(currentQueue.peek()).toBe(7);
            expect(currentQueue.size()).toBe(2);
            currentQueue = currentQueue.dequeue(); // Remove 7 -> 9
            expect(currentQueue.peek()).toBe(9);
            expect(currentQueue.size()).toBe(1);
            currentQueue = currentQueue.dequeue(); // Remove 9 -> empty
            expect(currentQueue.isEmpty()).toBe(true);
        });

        it('dequeue on empty queue should throw NoElementsException', () => {
            expect(() => ImmutablePriorityQueue.create().dequeue()).toThrow(NoElementsException);
        });

        it('poll should remove and return a queue without the highest priority element', () => {
            let currentQueue = queue; // 1, 3, 5, 7, 9
            currentQueue = currentQueue.poll(); // Remove 1 -> 3, 5, 7, 9
            expect(currentQueue.peek()).toBe(3);
            expect(currentQueue.size()).toBe(4);
            // ... (similar checks as dequeue)
            currentQueue = currentQueue.poll().poll().poll().poll(); // Remove 3, 5, 7, 9
            expect(currentQueue.isEmpty()).toBe(true);
        });

        it('contains should check for element existence', () => {
            expect(queue.contains(7)).toBe(true);
            expect(queue.contains(9)).toBe(true);
            expect(queue.contains(1)).toBe(true);
            expect(queue.contains(10)).toBe(false);
            expect(queue.contains(0)).toBe(false);
        });

        it('containsAll should check for multiple elements', () => {
            expect(queue.containsAll([1, 5, 9])).toBe(true);
            expect(queue.containsAll([3, 7])).toBe(true);
            expect(queue.containsAll([1, 10])).toBe(false); // 10 doesn't exist
            expect(queue.containsAll([])).toBe(true); // Empty set is subset of everything
        });

        it('add/enqueue should maintain priority order', () => {
            const q1 = ImmutablePriorityQueue.create<number>();
            const q2 = q1.add(5);
            const q3 = q2.add(1);
            const q4 = q3.enqueue(3); // enqueue is alias for add

            expect(q1.isEmpty()).toBe(true);
            expect(q2.peek()).toBe(5);
            expect(q3.peek()).toBe(1);
            expect(q4.peek()).toBe(1);
            expect(q4.size()).toBe(3);
        });

        it('addAll should add multiple elements maintaining order', () => {
            const q1 = ImmutablePriorityQueue.create<number>();
            const q2 = q1.addAll([5, 1, 9, 3]);
            expect(q2.size()).toBe(4);
            expect(q2.peek()).toBe(1);
            const q3 = q2.addAll([0, 8]);
            expect(q3.size()).toBe(6);
            expect(q3.peek()).toBe(0);
        });

        it('remove should handle removing existing elements', () => {
            const initial = ImmutablePriorityQueue.create([5, 1, 9, 3, 7]); // Heap state depends on insertion, but peek is 1
            const afterRemove3 = initial.remove(3);
            expect(afterRemove3.size()).toBe(4);
            expect(afterRemove3.contains(3)).toBe(false);
            expect(afterRemove3.peek()).toBe(1); // Removing 3 shouldn't change peek

            const afterRemove1 = afterRemove3.remove(1);
            expect(afterRemove1.size()).toBe(3);
            expect(afterRemove1.contains(1)).toBe(false);
            expect(afterRemove1.peek()).toBe(5); // Peek changes after removing 1
        });

        it('removeAll should remove multiple elements', () => {
            const initial = ImmutablePriorityQueue.create([5, 1, 9, 3, 7, 2, 8]);
            const afterRemove = initial.removeAll([1, 7, 10, 3]); // 10 doesn't exist
            expect(afterRemove.size()).toBe(4); // 5, 9, 2, 8 remain
            expect(afterRemove.contains(1)).toBe(false);
            expect(afterRemove.contains(7)).toBe(false);
            expect(afterRemove.contains(3)).toBe(false);
            expect(afterRemove.contains(10)).toBe(false);
            expect(afterRemove.contains(5)).toBe(true);
            expect(afterRemove.peek()).toBe(2);
        });

        it('removeIf should remove based on predicate', () => {
            const initial = ImmutablePriorityQueue.create([5, 1, 9, 3, 7, 2, 8]);
            const evensRemoved = initial.removeIf(n => n % 2 === 0); // Remove 2, 8
            expect(evensRemoved.size()).toBe(5); // 1, 3, 5, 7, 9 remain
            expect(evensRemoved.contains(2)).toBe(false);
            expect(evensRemoved.contains(8)).toBe(false);
            expect(evensRemoved.contains(1)).toBe(true);
            expect(evensRemoved.peek()).toBe(1);
        });

        it('should allow iteration (order not guaranteed priority)', () => {
            const elements = queue.toArray(); // Gets elements based on internal heap array order
            expect(elements.length).toBe(5);
            // Cannot assert specific order easily, just that iteration works
            const iterated = [];
            for (const item of queue) {
                iterated.push(item);
            }
            // Sort both to compare content, ignoring heap order
            expect(iterated.sort(Comparators.orderComparator)).toEqual([1, 3, 5, 7, 9]);
            expect(queue.size()).toBe(5); // Iteration doesn't modify
        });

        it('should work with custom comparators (max-heap)', () => {
            const maxComparator = Comparators.reverseOrderComparator;
            let maxQueue = ImmutablePriorityQueue.create([5, 1, 9, 3, 7], maxComparator);

            expect(maxQueue.peek()).toBe(9);
            maxQueue = maxQueue.add(10);
            expect(maxQueue.peek()).toBe(10);
            maxQueue = maxQueue.dequeue(); // Removes 10
            expect(maxQueue.peek()).toBe(9);
            maxQueue = maxQueue.poll(); // Removes 9
            expect(maxQueue.peek()).toBe(7);
        });
    });
});
