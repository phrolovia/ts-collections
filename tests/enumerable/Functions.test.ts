import {expect} from "chai";
import {describe, it} from "mocha";
import {empty, forEach, List, range, repeat, where} from "../../imports";

describe("Enumerable", () => {
    describe("#empty()", () => {
        it("should create an empty enumerable", () => {
            const enumerable = empty<number>();
            expect(enumerable.count()).to.eq(0);
        });
    });
    describe("#forEach()", () => {
        it("should loop over the enumerable", () => {
            const result: number[] = [];
            forEach(where([1, 2, 3, 4, 5, 6], n => n % 2 === 0), n => result.push(n));
            expect(result).to.deep.equal([2, 4, 6]);
        });
    });
    describe("#range()", () => {
        const enumerable = range(1, 5);
        it("should create a list of increasing numbers starting with 1", () => {
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const max = range(1, 10).select(n => Math.pow(n, 3)).max();
            expect(max).to.eq(1000);
        });
    });
    describe("#repeat()", () => {
        const arrayOfFives = repeat(5, 5).toArray();
        it("should create an array of 5s with the length of 5", () => {
            expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const sum = repeat(10, 10).sum(n => n);
            expect(sum).to.eq(100);
        });
    });
    describe("#where()", () => {
        it("should return an IEnumerable with elements [2,5]", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = where(list,n => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
    });
});
