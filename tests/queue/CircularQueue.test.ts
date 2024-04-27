import {describe, test, expect} from "vitest";

import {CircularQueue} from "../../src/imports";

describe("CircularQueue", () => {
    describe("#addAll()", () => {
        test("should add last n of all elements to the queue (n >= capacity)", () => {
            const queue = new CircularQueue<number>(2);
            queue.addAll([1, 2, 3, 4, 5]);
            expect(queue.size()).to.equal(2);
            expect(queue.toArray()).to.deep.equal([4, 5]);
        });
    });
    describe("#enqueue()", () => {
        test("should add elements at the end of the queue", () => {
            const queue = new CircularQueue<number>(3);
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
            queue.add(4);
            expect(queue.toArray()).to.deep.equal([2, 3, 4]);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
            queue.enqueue(5);
            queue.add(6);
            queue.add(7);
            expect(queue.toArray()).to.deep.equal([5, 6, 7]);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
        });
    });
    describe("#isFull()", () => {
        test("should return true if the queue is full", () => {
            const queue = new CircularQueue<number>(3);
            expect(queue.isFull()).to.be.false;
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.isFull()).to.be.true;
        });
        test("should return false if the queue is not full", () => {
            const queue = new CircularQueue<number>(3);
            expect(queue.isFull()).to.be.false;
            queue.enqueue(1);
            queue.enqueue(2);
            expect(queue.isFull()).to.be.false;
        });
    });
});
