import { Enumerable } from "../../src/imports";

describe("Enumerable", () => {
    describe("#empty()", () => {
        test("should create an empty enumerable", () => {
            const enumerable = Enumerable.empty<number>();
            expect(enumerable.count()).to.eq(0);
        });
    });
    describe("#forEach()", () => {
        test("should loop over the enumerable", () => {
            const enumerable = Enumerable.from([1, 2, 3, 4, 5, 6]);
            const enum2 = enumerable.where(n => n % 2 === 0);
            const result: number[] = [];
            enum2.forEach(n => result.push(n));
            expect(result).to.deep.equal([2, 4, 6]);
        });
    });
    describe("#range()", () => {
        const enumerable = Enumerable.range(1, 5);
        test("should create a list of increasing numbers starting with 1", () => {
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should create an enumerable that can be queried", () => {
            const max = Enumerable.range(1, 10).select(n => Math.pow(n, 3)).max();
            expect(max).to.eq(1000);
        });
    });
    describe("#repeat()", () => {
        const arrayOfFives = Enumerable.repeat(5, 5).toArray();
        test("should create an array of 5s with the length of 5", () => {
            expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
        });
        test("should create an enumerable that can be queried", () => {
            const sum = Enumerable.repeat(10, 10).sum(n => n);
            expect(sum).to.eq(100);
        });
    });
});
