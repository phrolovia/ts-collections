import {describe, it} from "mocha";
import {expect} from "chai";
import {IDeque, IQueue, LinkedList} from "../../imports";
import {ErrorMessages} from "../../src/shared/ErrorMessages";

describe("Deque", () => {
    describe("#dequeueLast()", () => {
        it("should throw error if queue is empty", () => {
            const deque: IDeque<number> = new LinkedList<number>();
            expect(() => deque.dequeueLast()).to.throw(ErrorMessages.NoElements);
        });
        it("should remove the tail of the queue and return it", () => {
            const deque: IDeque<number> = LinkedList.from([1, 2, 3]);
            const head = deque.dequeueLast();
            expect(head).to.eq(3);
            expect(deque.size()).to.eq(2);
            expect(deque.contains(3)).to.be.false;
            expect(deque.toArray()).to.deep.equal([1, 2]);
        });
    });
    describe("#enqueueFirst()", () => {
        it("should add elements at the beginning of the queue", () => {
            const expectedResult = [3, 2, 1];
            const deque: IDeque<number> = new LinkedList<number>();
            deque.enqueueFirst(1);
            deque.enqueueFirst(2);
            deque.enqueueFirst(3);
            expect(deque.toArray()).to.deep.equal(expectedResult);
        });
    });
    describe("#peekLast()", () => {
        it("should not throw error if queue is empty", () => {
            const deque: IDeque<number> = new LinkedList<number>();
            expect(() => deque.peekLast()).to.not.throw;
        });
        it("should return the head of the queue but not remove it", () => {
            const deque: IDeque<number> = LinkedList.from([1, 2, 3]);
            const head = deque.peekLast();
            expect(head).to.eq(3);
            expect(deque.size()).to.eq(3);
            expect(deque.contains(3)).to.be.true;
            expect(deque.toArray()).to.deep.equal([1, 2, 3]);
        });
        it("should return null if queue is empty", () => {
            const deque: IDeque<number> = LinkedList.from([1, 2]);
            deque.removeIf(e => e < 3);
            expect(deque.isEmpty()).to.eq(true);
            expect(deque.peekLast()).to.be.null;
        });
    });
    describe("#pollLast()", () => {
        it("should not throw error if deque is empty", () => {
            const deque: IDeque<number> = new LinkedList<number>();
            expect(() => deque.pollLast()).to.not.throw;
        });
        it("should remove the head of the queue and return it", () => {
            const deque: IDeque<number> = LinkedList.from([1, 2, 3]);
            const head = deque.pollLast();
            expect(head).to.eq(3);
            expect(deque.size()).to.eq(2);
            expect(deque.contains(3)).to.be.false;
            expect(deque.toArray()).to.deep.equal([1, 2]);
        });
        it("should return null if deque is empty", () => {
            const deque: IDeque<number> = LinkedList.from([1, 2]);
            deque.remove(1);
            deque.remove(2);
            expect(deque.isEmpty()).to.eq(true);
            expect(deque.pollLast()).to.be.null;
        });
        it("should remove everything by polling from tail", () => {
            const deque: IDeque<number> = LinkedList.from([1, 2, 3]);
            deque.pollLast();
            deque.pollLast();
            deque.pollLast();
            expect(deque.isEmpty()).to.be.true;
        });
    });
});
