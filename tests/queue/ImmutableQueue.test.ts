import { describe, expect, test } from "vitest";
import { ImmutableQueue } from "../../src/imports";
import { NoElementsException } from "../../src/shared/NoElementsException";

describe("ImmutableQueue", () => {
    describe("#add()", () => {
        test("should add an element to the queue", () => {
            const queue = ImmutableQueue.create<number>([]);
            const newQueue = queue.add(1);
            expect(newQueue).to.be.instanceof(ImmutableQueue);
            expect(newQueue.size()).to.equal(1);
            expect(newQueue).not.equals(queue);
            expect(queue.size()).to.equal(0);
        });
    });

    describe("#addAll()", () => {
        test("should add all elements to the queue", () => {
            const queue = ImmutableQueue.create<number>([55, 99]);
            const newQueue = queue.addAll([1, 2, 3]);
            expect(newQueue).to.be.instanceof(ImmutableQueue);
            expect(newQueue.size()).to.equal(5);
            expect(newQueue).not.equals(queue);
            expect(newQueue.toArray()).to.deep.equal([55, 99, 1, 2, 3]);
            expect(queue.size()).to.equal(2);
            expect(queue.toArray()).to.deep.equal([55, 99]);
        });
    });

    describe("#clear()", () => {
        test("should clear the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            const newQueue = queue.clear();
            expect(newQueue.size()).to.equal(0);
            expect(newQueue).not.equals(queue);
            expect(queue.size()).to.equal(3);
        });
    });
    describe("#dequeue()", () => {
        test("should remove the head of the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            const newQueue = queue.dequeue();
            expect(newQueue).to.be.instanceof(ImmutableQueue);
            expect(newQueue.size()).to.equal(2);
            expect(newQueue).not.equals(queue);
            expect(queue.size()).to.equal(3);
        });
        test("should throw error if queue is empty", () => {
            const queue = ImmutableQueue.create<number>([]);
            expect(() => queue.dequeue()).toThrow(new NoElementsException());
        });
    });
    describe("#enqueue()", () => {
        test("should add an element to the queue", () => {
            const queue = ImmutableQueue.create<number>([]);
            const newQueue = queue.enqueue(1);
            expect(newQueue).to.be.instanceof(ImmutableQueue);
            expect(newQueue.size()).to.equal(1);
            expect(newQueue).not.equals(queue);
            expect(queue.size()).to.equal(0);
        });
    });
    describe("#front()", () => {
        test("should return the head of the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            const head = queue.front();
            expect(head).to.equal(1);
        });
        test("should throw error if queue is empty", () => {
            const queue = ImmutableQueue.create<number>([]);
            expect(() => queue.front()).toThrow(new NoElementsException());
        });
    });
    describe("#isEmpty()", () => {
        test("should return true if the queue is empty", () => {
            const queue = ImmutableQueue.create<number>([]);
            expect(queue.isEmpty()).to.be.true;
        });
        test("should return false if the queue is not empty", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            expect(queue.isEmpty()).to.be.false;
        });
    });
    describe("#peek()", () => {
        test("should return the head of the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            const head = queue.peek();
            expect(head).to.equal(1);
        });
        test("should return null if the queue is empty", () => {
            const queue = ImmutableQueue.create<number>([]);
            const head = queue.peek();
            expect(head).to.be.null;
        });
    });
    describe("#poll()", () => {
        test("should remove the head of the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            const newQueue = queue.poll();
            expect(newQueue.size()).to.equal(2);
            expect(newQueue).not.equals(queue);
            expect(queue.size()).to.equal(3);
        });
        test("should return an empty ImmutableQueue if the queue is empty", () => {
            const queue = ImmutableQueue.create<number>([]);
            const newQueue = queue.poll();
            expect(newQueue).to.be.instanceof(ImmutableQueue);
            expect(newQueue.size()).to.equal(0);
            expect(newQueue).not.equals(queue);
            expect(queue.size()).to.equal(0);
        });
    });
    describe("#size()", () => {
        test("should return the size of the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            expect(queue.size()).to.equal(3);
        });
    });
    describe("#length", () => {
        test("should return the length of the queue", () => {
            const queue = ImmutableQueue.create<number>([1, 2, 3]);
            expect(queue.length).to.equal(3);
        });
    });
});