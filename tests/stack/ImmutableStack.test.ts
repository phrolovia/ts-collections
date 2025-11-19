import { describe } from "vitest";
import { ImmutableStack } from "../../src/stack/ImmutableStack";
import { Stack } from "../../src/stack/Stack";

describe("ImmutableStack", () => {
    describe("#add()", () => {
        test("should add an element to the stack", () => {
            const stack = ImmutableStack.create<number>([]);
            const newStack = stack.add(1);
            expect(newStack).to.be.instanceof(ImmutableStack);
            expect(newStack.size()).to.equal(1);
            expect(newStack).not.equals(stack);
            expect(stack.size()).to.equal(0);
        });
    });

    describe("#addAll()", () => {
        test("should add all elements to the stack", () => {
            const stack = ImmutableStack.create<number>([]);
            const newStack = stack.addAll([1, 2, 3]);
            expect(newStack).to.be.instanceof(ImmutableStack);
            expect(newStack.size()).to.equal(3);
            expect(newStack).not.equals(stack);
            expect(newStack.toArray()).to.deep.equal([3, 2, 1]);
            expect(stack.size()).to.equal(0);
        });
        test("should add all elements from the provided collection to the stack", () => {
            const array1 = [1, 2, 3];
            const array2 = [4, 5, 6];
            const immutableStack1 = ImmutableStack.create(array1);
            const e = immutableStack1.concat(array2);
            const immutableStack2 = ImmutableStack.create(e);
            expect(immutableStack2.toArray()).to.deep.equal([6, 5, 4, 1, 2, 3]);
        });
    });

    describe("#clear()", () => {
        test("should clear the stack", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            const newStack = stack.clear();
            expect(newStack.size()).to.equal(0);
            expect(newStack).not.equals(stack);
            expect(stack.size()).to.equal(3);
        });
    });

    describe("#concat()", () => {
        test("should concatenate the stack and the array", () => {
            const array1 = [1, 2, 3];
            const array2 = [4, 5, 6];
            const stack1 = ImmutableStack.create<number>(array1);
            const stack2 = ImmutableStack.create(array2);
            const concatStack = stack1.concat(stack2)
            expect(concatStack.toArray()).to.deep.equal([3,2,1,6,5,4]);
        });
    });

    describe("#peek()", () => {
        test("should return null if stack is empty", () => {
            const stack = ImmutableStack.create<number>([]);
            expect(stack.peek()).to.be.null;
        });
        test("should return the top of the stack but not remove it", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            const top = stack.peek();
            expect(top).to.eq(3);
            expect(stack.size()).to.eq(3);
            expect(stack.contains(3)).to.be.true;
            expect(stack.toArray()).to.deep.equal([3, 2, 1]);
        });
    });

    describe("#pop()", () => {
        test("should return the stack without the top element", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            const newStack = stack.pop();
            expect(newStack).to.be.instanceof(ImmutableStack);
            expect(newStack.size()).to.equal(2);
            expect(newStack).not.equals(stack);
            expect(stack.size()).to.equal(3);
        });
    });

    describe("#push()", () => {
        test("should add an element to the stack", () => {
            const stack = ImmutableStack.create<number>([]);
            const newStack = stack.push(1);
            expect(newStack).to.be.instanceof(ImmutableStack);
            expect(newStack.size()).to.equal(1);
            expect(newStack).not.equals(stack);
            expect(stack.size()).to.equal(0);
        });
    });

    describe("#size()", () => {
        test("should return the size of the stack", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            expect(stack.size()).to.equal(3);
        });
    });

    describe("#toImmutableStack()", () => {
        const array = [1, 2, 3];
        const stack = new Stack<number>(array);
        test("should create an ImmutableStack", () => {
            const immutableStack = ImmutableStack.create(array);
            expect(immutableStack.toArray()).to.deep.equal([3,2,1]);
        });
        test("should create an ImmutableStack from the stack", () => {
            const immutableStack1 = ImmutableStack.create(stack);
            const immutableStack2 = stack.toImmutableStack();
            expect(immutableStack1.toArray()).to.deep.equal([1,2,3]);
            expect(immutableStack2.toArray()).to.deep.equal([1,2,3]);
        });
        test("should add an item to the ImmutableStack", () => {
            const immutableStack1 = ImmutableStack.create(array);
            const immutableStack1Added = immutableStack1.push(4);
            expect(immutableStack1Added.toArray()).to.deep.equal([4,3,2,1]);
        });
        test("should add an item to the stack and create an ImmutableStack", () => {
            const immutableStack = stack.toImmutableStack().push(4);
            expect(immutableStack.toArray()).to.deep.equal([4,1,2,3]);
        });
        test("should remove the top item from the ImmutableStack", () => {
            const immutableStack1 = ImmutableStack.create(array);
            const immutableStack1Removed = immutableStack1.pop();
            expect(immutableStack1Removed.toArray()).to.deep.equal([2,1]);
        });
        test("should remove the top item from the stack and create an ImmutableStack", () => {
            const immutableStack = stack.toImmutableStack().pop();
            expect(immutableStack.toArray()).to.deep.equal([2,3]);
        });
    });

    describe("#top()", () => {
        test("should return the top of the stack", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            const top = stack.top();
            expect(top).to.equal(3);
        });
        test("should throw error if stack is empty", () => {
            const stack = ImmutableStack.create<number>([]);
            expect(() => stack.top()).to.throw(Error);
        });
    });

    describe("length", () => {
        test("should return the length of the stack", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            expect(stack.length).to.equal(3);
        });
    });
});
