import { describe, expect, test } from "vitest";
import { ImmutableCircularQueue } from "../../src/imports";
import { NoElementsException } from "../../src/shared/NoElementsException";

describe("ImmutableCircularQueue", () => {
    describe("#create()", () => {
        test("should create from iterable and keep only the most recent elements", () => {
            const queue = ImmutableCircularQueue.create<number>(2, [1, 2, 3]);
            expect(queue.toArray()).to.deep.equal([2, 3]);
            expect(queue.capacity).to.equal(2);
        });

        test("should use default capacity when none is provided", () => {
            const queue = ImmutableCircularQueue.create<number>([1, 2, 3]);
            expect(queue.capacity).to.equal(32);
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        });
    });

    describe("#add()", () => {
        test("should add an element when the queue is not full", () => {
            const queue = ImmutableCircularQueue.create<number>(3);
            const newQueue = queue.add(1);
            expect(newQueue).to.be.instanceof(ImmutableCircularQueue);
            expect(newQueue.toArray()).to.deep.equal([1]);
            expect(queue.isEmpty()).to.be.true;
        });

        test("should drop the oldest element when capacity is reached", () => {
            const queue = ImmutableCircularQueue.create<number>(3, [1, 2, 3]);
            const newQueue = queue.add(4);
            expect(newQueue.toArray()).to.deep.equal([2, 3, 4]);
            expect(newQueue.size()).to.equal(3);
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        });
    });

    describe("#addAll()", () => {
        test("should keep only the most recent elements up to capacity", () => {
            const queue = ImmutableCircularQueue.create<number>(3);
            const newQueue = queue.addAll([1, 2, 3, 4, 5]);
            expect(newQueue.toArray()).to.deep.equal([3, 4, 5]);
            expect(newQueue.size()).to.equal(3);
            expect(queue.isEmpty()).to.be.true;
        });
    });

    describe("#clear()", () => {
        test("should clear the queue while preserving capacity", () => {
            const queue = ImmutableCircularQueue.create<number>(3, [1, 2, 3]);
            const newQueue = queue.clear();
            expect(newQueue.size()).to.equal(0);
            expect(newQueue.capacity).to.equal(3);
            expect(queue.size()).to.equal(3);
        });
    });

    describe("#dequeue()", () => {
        test("should remove the head of the queue", () => {
            const queue = ImmutableCircularQueue.create<number>(3, [1, 2, 3]);
            const newQueue = queue.dequeue();
            expect(newQueue.toArray()).to.deep.equal([2, 3]);
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        });

        test("should throw error if queue is empty", () => {
            const queue = ImmutableCircularQueue.create<number>(3);
            expect(() => queue.dequeue()).toThrow(new NoElementsException());
        });
    });

    describe("#enqueue()", () => {
        test("should add an element to the queue", () => {
            const queue = ImmutableCircularQueue.create<number>(2);
            const newQueue = queue.enqueue(1).enqueue(2).enqueue(3);
            expect(newQueue.toArray()).to.deep.equal([2, 3]);
            expect(queue.isEmpty()).to.be.true;
        });
    });

    describe("#front()", () => {
        test("should return the head of the queue", () => {
            const queue = ImmutableCircularQueue.create<number>([1, 2, 3]);
            expect(queue.front()).to.equal(1);
        });

        test("should throw error if the queue is empty", () => {
            const queue = ImmutableCircularQueue.create<number>();
            expect(() => queue.front()).toThrow(new NoElementsException());
        });
    });

    describe("#isEmpty()", () => {
        test("should return true if the queue is empty", () => {
            const queue = ImmutableCircularQueue.create<number>();
            expect(queue.isEmpty()).to.be.true;
        });

        test("should return false if the queue is not empty", () => {
            const queue = ImmutableCircularQueue.create<number>([1]);
            expect(queue.isEmpty()).to.be.false;
        });
    });

    describe("#isFull()", () => {
        test("should return true when the queue reached its capacity", () => {
            const queue = ImmutableCircularQueue.create<number>(2, [1, 2]);
            expect(queue.isFull()).to.be.true;
        });

        test("should return false when the queue has room", () => {
            const queue = ImmutableCircularQueue.create<number>(2, [1]);
            expect(queue.isFull()).to.be.false;
        });
    });

    describe("#peek()", () => {
        test("should return the head of the queue", () => {
            const queue = ImmutableCircularQueue.create<number>([1, 2, 3]);
            expect(queue.peek()).to.equal(1);
        });

        test("should return null if the queue is empty", () => {
            const queue = ImmutableCircularQueue.create<number>();
            expect(queue.peek()).to.be.null;
        });
    });

    describe("#poll()", () => {
        test("should remove the head of the queue", () => {
            const queue = ImmutableCircularQueue.create<number>([1, 2, 3]);
            const newQueue = queue.poll();
            expect(newQueue.toArray()).to.deep.equal([2, 3]);
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        });

        test("should return the same queue if it is empty", () => {
            const queue = ImmutableCircularQueue.create<number>();
            const newQueue = queue.poll();
            expect(newQueue).to.equal(queue);
        });
    });

    describe("#size()", () => {
        test("should return the size of the queue", () => {
            const queue = ImmutableCircularQueue.create<number>([1, 2, 3]);
            expect(queue.size()).to.equal(3);
        });
    });

    describe("#length", () => {
        test("should return the length of the queue", () => {
            const queue = ImmutableCircularQueue.create<number>([1, 2, 3]);
            expect(queue.length).to.equal(3);
        });
    });

    describe("#capacity", () => {
        test("should expose the configured capacity", () => {
            const queue = ImmutableCircularQueue.create<number>(5);
            expect(queue.capacity).to.equal(5);
        });
    });
});
