import { describe, expect } from "vitest";
import { ImmutableStack } from "../../src/imports";

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

    describe("#peek()", () => {
        test("should return null if stack is empty", () => {
            const stack = ImmutableStack.create<number>([]);
            expect(stack.peek()).to.be.null;
        });
        test("should return the top of the stack but not remove it", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            const top = stack.peek();
            expect(top).to.eq(1);
            expect(stack.size()).to.eq(3);
            expect(stack.contains(1)).to.be.true;
            expect(stack.toArray()).to.deep.equal([1, 2, 3]);
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

    describe("#top()", () => {
        test("should return the top of the stack", () => {
            const stack = ImmutableStack.create<number>([1, 2, 3]);
            const top = stack.top();
            expect(top).to.equal(1);
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