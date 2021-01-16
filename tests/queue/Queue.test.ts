import {describe, it} from "mocha";
import {expect} from "chai";
import {IQueue, LinkedList} from "../../imports";
import {ErrorMessages} from "../../src/shared/ErrorMessages";

describe("Queue", () => {
    describe("#dequeue()", () => {
        it("should throw error if queue is empty", () => {
            const queue: IQueue<number> = new LinkedList<number>();
            expect(() => queue.dequeue()).to.throw(ErrorMessages.NoElements);
        });
        it("should remove the head of the queue and return it", () => {
            const queue: IQueue<number> = new LinkedList([1, 2, 3]);
            const head = queue.dequeue();
            expect(head).to.eq(1);
            expect(queue.size()).to.eq(2);
            expect(queue.contains(1)).to.be.false;
            expect(queue.toArray()).to.deep.equal([2, 3]);
        });
    });
    describe("#enqueue()", () => {
        it("should add elements at the end of the queue", () => {
            const expectedResult = [1, 2, 3];
            const queue: IQueue<number> = new LinkedList<number>();
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);
            expect(queue.toArray()).to.deep.equal(expectedResult);
        });
    });
    describe("#peek()", () => {
        it("should not throw error if queue is empty", () => {
            const queue: IQueue<number> = new LinkedList<number>();
            expect(() => queue.peek()).to.not.throw;
        });
        it("should return the head of the queue but not remove it", () => {
            const queue: IQueue<number> = new LinkedList([1, 2, 3]);
            const head = queue.peek();
            expect(head).to.eq(1);
            expect(queue.size()).to.eq(3);
            expect(queue.contains(1)).to.be.true;
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        });
        it("should return null if queue is empty", () => {
            const queue: IQueue<number> = new LinkedList([1, 2]);
            queue.removeIf(e => e < 3);
            expect(queue.isEmpty()).to.eq(true);
            expect(queue.peek()).to.be.null;
        });
    });
    describe("#poll()", () => {
        it("should not throw error if queue is empty", () => {
            const queue: IQueue<number> = new LinkedList<number>();
            expect(() => queue.poll()).to.not.throw;
        });
        it("should remove the head of the queue and return it", () => {
            const queue: IQueue<number> = new LinkedList([1, 2, 3]);
            const head = queue.poll();
            expect(head).to.eq(1);
            expect(queue.size()).to.eq(2);
            expect(queue.contains(1)).to.be.false;
            expect(queue.toArray()).to.deep.equal([2, 3]);
        });
        it("should return null if queue is empty", () => {
            const queue: IQueue<number> = new LinkedList([1, 2]);
            queue.remove(1);
            queue.remove(2);
            expect(queue.isEmpty()).to.eq(true);
            expect(queue.poll()).to.be.null;
        });
        it("should remove everything by polling", () => {
            const queue: IQueue<number> = new LinkedList([1, 2, 3]);
            queue.poll();
            queue.poll();
            queue.poll();
            expect(queue.isEmpty()).to.be.true;
        });
    });
});
