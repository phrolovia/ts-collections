import { describe } from "vitest";
import { Stack } from "../../src/stack/Stack";

describe("Stack", () => {
    describe("#add()", () => {
        test("should add an item to the stack", () => {
            const stack = new Stack<number>();
            stack.add(1);
            expect(stack.size()).to.equal(1);
            expect(stack.length).to.equal(1);
        });
        test("should add item on top of the stack", () => {
            const stack = new Stack<number>([1, 2, 3]);
            stack.add(4);
            expect(stack.size()).to.equal(4);
            expect(stack.length).to.equal(4);
            expect(stack.toArray()).to.deep.equal([4, 3, 2, 1]);
            expect(stack.pop()).to.equal(4);
        });
    });

    describe("#clear()", () => {
        test("should clear the stack", () => {
            const stack = new Stack<number>();
            stack.add(1);
            expect(stack.size()).to.equal(1);
            expect(stack.length).to.equal(1);
            stack.clear();
            expect(stack.size()).to.equal(0);
            expect(stack.length).to.equal(0);
        });
    });

    describe("#concat()", () => {
       test("should concatenate the stack and the array", () => {
           const array1 = [1, 2, 3];
           const array2 = [4, 5, 6];
           const stack = new Stack<number>(array1);
           const stack2 = stack.concat(array2).toList();
           expect(stack2.toArray()).to.deep.equal([3,2,1,4,5,6]);
       });
    });

    describe("#peek()", () => {
        test("should return null if stack is empty", () => {
            const stack = new Stack<number>();
            expect(stack.peek()).to.be.null;
        });
        test("should return the head of the stack but not remove it", () => {
            const stack = new Stack<number>([1, 2, 3]);
            const head = stack.peek();
            expect(head).to.eq(3);
            expect(stack.size()).to.eq(3);
            expect(stack.contains(1)).to.be.true;
            expect(stack.toArray()).to.deep.equal([3,2,1]);
        });
    });

    describe("#pop()", () => {
        test("should throw error if stack is empty", () => {
            const stack = new Stack<number>();
            expect(() => stack.pop()).to.throw();
        });
        test("should return the head of the stack and remove it", () => {
            const stack = new Stack<number>([1, 2, 3]);
            const head = stack.pop();
            expect(head).to.eq(3);
            expect(stack.size()).to.eq(2);
            expect(stack.length).to.eq(2);
            expect(stack.contains(3)).to.be.false;
            expect(stack.toArray()).to.deep.equal([2,1]);
        });
    });

    describe("#push()", () => {
        test("should add an item to the stack", () => {
            const stack = new Stack<number>();
            stack.push(1);
            expect(stack.size()).to.equal(1);
            expect(stack.length).to.equal(1);
            expect(stack.length).to.equal(1);
        });
        test("should add item on top of the stack", () => {
            const stack = new Stack<number>([1, 2, 3]);
            stack.push(4);
            expect(stack.size()).to.equal(4);
            expect(stack.length).to.equal(4);
            expect(stack.pop()).to.eq(4);
        });
    });

    describe("#top()", () => {
        test("should throw error if stack is empty", () => {
            const stack = new Stack<number>();
            expect(() => stack.top()).to.throw();
        });
        test("should return the head of the stack but not remove it", () => {
            const stack = new Stack<number>([1, 2, 3]);
            const head = stack.top();
            expect(head).to.eq(3);
            expect(stack.size()).to.eq(3);
            expect(stack.length).to.eq(3);
            expect(stack.toArray()).to.deep.equal([3,2,1]);
        });
    });
});
