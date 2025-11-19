import { Queue } from "../../src/queue/Queue";
import { NoElementsException } from "../../src/shared/NoElementsException";

describe("Queue", () => {
    describe("#add()", () => {
        test("should add an item to the queue", () => {
            const queue = new Queue<number>();
            queue.add(1);
            expect(queue.size()).to.equal(1);
            expect(queue.length).to.equal(1);
        });
    });

    describe("#clear()", () => {
        test("should clear the queue", () => {
            const queue = new Queue<number>();
            queue.add(1);
            expect(queue.size()).to.equal(1);
            expect(queue.length).to.equal(1);
            queue.clear();
            expect(queue.size()).to.equal(0);
            expect(queue.length).to.equal(0);
        });
    });


    describe("#dequeue()", () => {
        test("should throw error if queue is empty", () => {
            const queue = new Queue<number>();
            expect(() => queue.dequeue()).toThrow(new NoElementsException());
        });
        test("should remove the head of the queue and return it", () => {
            const queue = new Queue<number>([1, 2, 3]);
            const head = queue.dequeue();
            expect(head).to.eq(1);
            expect(queue.size()).to.eq(2);
            expect(queue.length).to.eq(2);
            expect(queue.contains(1)).to.be.false;
            expect(queue.toArray()).to.deep.equal([2, 3]);
        });
    });

    describe("#enqueue()", () => {
        test("should add elements at the end of the queue", () => {
            const expectedResult = [1, 2, 3];
            const queue = new Queue<number>();
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.toArray()).to.deep.equal(expectedResult);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
        });
    });

    describe("#front()", () => {
        test("should throw error if queue is empty", () => {
            const queue = new Queue<number>();
            expect(() => queue.front()).toThrow(new NoElementsException());
        });
        test("should return the head of the queue", () => {
            const queue = new Queue<number>([1, 2, 3]);
            const head = queue.front();
            expect(head).to.eq(1);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
        });
    });

    describe("#peek()", () => {
        test("should not throw error if queue is empty", () => {
            const queue = new Queue<number>();
            expect(() => queue.peek()).to.not.throw;
        });
        test("should return the head of the queue but not remove it", () => {
            const queue = new Queue<number>([1, 2, 3]);
            const head = queue.peek();
            expect(head).to.eq(1);
            expect(queue.size()).to.eq(3);
            expect(queue.contains(1)).to.be.true;
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        });
        test("should return null if queue is empty", () => {
            const queue = new Queue<number>([1, 2]);
            queue.clear();
            expect(queue.isEmpty()).to.eq(true);
            expect(queue.peek()).to.be.null;
        });
    });
    describe("#poll()", () => {
        test("should not throw error if queue is empty", () => {
            const queue = new Queue<number>();
            expect(() => queue.poll()).to.not.throw;
        });
        test("should remove the head of the queue and return it", () => {
            const queue = new Queue<number>([1, 2, 3]);
            const head = queue.poll();
            expect(head).to.eq(1);
            expect(queue.length).to.eq(2);
            expect(queue.size()).to.eq(2);
            expect(queue.contains(1)).to.be.false;
            expect(queue.toArray()).to.deep.equal([2, 3]);
        });
        test("should return null if queue is empty", () => {
            const queue = new Queue<number>([1, 2]);
            queue.dequeue();
            queue.dequeue();
            expect(queue.isEmpty()).to.eq(true);
            expect(queue.length).to.eq(0);
            expect(queue.poll()).to.be.null;
        });
        test("should remove everything by polling", () => {
            const queue = new Queue<number>([1, 2, 3]);
            queue.poll();
            queue.poll();
            queue.poll();
            expect(queue.isEmpty()).to.be.true;
            expect(queue.length).to.eq(0);
        });
    });
});
