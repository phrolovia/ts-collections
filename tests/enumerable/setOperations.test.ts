import { describe, expect, test } from "vitest";
import { AsyncEnumerable } from "../../src/enumerator/AsyncEnumerable";
import { Enumerable } from "../../src/enumerator/Enumerable";

const numbers = function* (...values: number[]): Generator<number> {
    yield* values;
};
const asyncNumbers = async function* (...values: number[]): AsyncGenerator<number> {
    yield* values;
};
const byValue = (x: number, y: number): boolean => x === y;
const inOrder = (x: number, y: number): number => x - y;
const isMinusZero = (values: number[]): boolean[] => values.map(value => Object.is(value, -0));

describe("except, intersect, distinct and union", () => {
    describe("with a one-shot argument", () => {
        test.each([["an equality", byValue], ["an order", inOrder]])("should read every element with %s comparator", (_, comparator) => {
            const source = Enumerable.from([1, 2, 3, 4]);
            expect(source.except(numbers(1, 2, 3), comparator).toArray()).toEqual([4]);
            expect(source.exceptBy(numbers(1, 2, 3), x => x, comparator).toArray()).toEqual([4]);
            expect(source.intersect(numbers(1, 2, 3), comparator).toArray()).toEqual([1, 2, 3]);
            expect(source.intersectBy(numbers(1, 2, 3), x => x, comparator).toArray()).toEqual([1, 2, 3]);
        });
        test.each([["an equality", byValue], ["an order", inOrder]])("should read every element asynchronously with %s comparator", async (_, comparator) => {
            const source = () => AsyncEnumerable.from(asyncNumbers(1, 2, 3, 4));
            expect(await source().except(asyncNumbers(1, 2, 3), comparator).toArray()).toEqual([4]);
            expect(await source().intersect(asyncNumbers(1, 2, 3), comparator).toArray()).toEqual([1, 2, 3]);
        });
    });

    describe("with an empty argument", () => {
        test("should still remove duplicates from the source", async () => {
            expect(Enumerable.from([1, 1, 2]).except([], byValue).toArray()).toEqual([1, 2]);
            expect(Enumerable.from([1, 1, 2]).except([], inOrder).toArray()).toEqual([1, 2]);
            expect(await AsyncEnumerable.from(asyncNumbers(1, 1, 2)).except(asyncNumbers()).toArray()).toEqual([1, 2]);
            expect(await AsyncEnumerable.from(asyncNumbers(1, 1, 2)).except(asyncNumbers(), byValue).toArray()).toEqual([1, 2]);
        });
        test("should intersect to nothing", () => {
            expect(Enumerable.from([1, 2]).intersect([], byValue).toArray()).toEqual([]);
        });
    });

    describe("with the default comparator", () => {
        test("should keep 0 and -0 apart, as Object.is does", async () => {
            expect(isMinusZero(Enumerable.from([0, -0, 0]).distinct().toArray())).toEqual([false, true]);
            expect(isMinusZero(Enumerable.from([0]).union([-0]).toArray())).toEqual([false, true]);
            expect(isMinusZero(Enumerable.from([0, -0]).distinctBy(x => x).toArray())).toEqual([false, true]);
            expect(isMinusZero(await AsyncEnumerable.from(asyncNumbers(0, -0)).distinct().toArray())).toEqual([false, true]);
            expect(isMinusZero(Enumerable.from([0, -0]).except([-0]).toArray())).toEqual([false]);
            expect(isMinusZero(Enumerable.from([0, -0]).intersect([-0]).toArray())).toEqual([true]);
        });
        test("should treat NaN as equal to itself", () => {
            expect(Enumerable.from([NaN, NaN, 1]).distinct().toArray()).toEqual([NaN, 1]);
            expect(Enumerable.from([NaN, 1]).except([NaN]).toArray()).toEqual([1]);
        });
        test("should treat Object.is like the default comparator", () => {
            expect(isMinusZero(Enumerable.from([0, -0, 0]).distinct(Object.is).toArray())).toEqual([false, true]);
            expect(Enumerable.from([1, 2, 3, 2]).except([1], Object.is).toArray()).toEqual([2, 3]);
            expect(Enumerable.from([1, 2, 3]).intersect([3, 1], Object.is).toArray()).toEqual([1, 3]);
            const groups = Enumerable.from([0, -0, 1, 0]).groupBy(x => x, Object.is).select(g => g.count()).toArray();
            expect(groups).toEqual([2, 1, 1]);
        });
    });

    describe("with a custom comparator", () => {
        test("should compare as comparator(element key, seen key)", () => {
            const calls: Array<[string, string]> = [];
            const comparator = (x: string, y: string): boolean => {
                calls.push([x, y]);
                return x.toLowerCase() === y.toLowerCase();
            };
            expect(Enumerable.from(["a", "B"]).except(["b"], comparator).toArray()).toEqual(["a"]);
            // The first call compares a key with itself to tell an equality comparator from an order comparator.
            expect(calls).toEqual([["b", "b"], ["a", "b"], ["B", "b"]]);
        });
        test("should keep an undefined key in union", () => {
            const result = Enumerable.from([undefined, undefined, 1]).union([1], (x, y) => x === y).toArray();
            expect(result).toEqual([undefined, 1]);
        });
        test("should remove each matched key once in intersect", () => {
            const result = Enumerable.from(["a", "A", "b"]).intersect(["A", "b"], (x, y) => x.toLowerCase() === y.toLowerCase()).toArray();
            expect(result).toEqual(["a", "b"]);
        });
    });
});
