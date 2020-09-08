import {Enumerable} from "../../src/enumerable/Enumerable";
import {describe, it} from "mocha";
import {expect} from "chai";

describe("Enumerable", () => {
    describe("#average()", () => {
        const numbers = [1, 2, 3, 4, 5];
        const average = new Enumerable(numbers).average(n => n);
        it("should return the average value of the array", () => {
            expect(average).to.eq(3);
        });
    });
    describe("#concat()", () => {
        const numberList1 = [1, 2, 3, 4, 5];
        const numberList2 = [5, 6, 7, 8, 9];
        const concatEnumerable = new Enumerable(numberList1).concat(new Enumerable(numberList2));
        it("should concat two arrays", () => {
            expect(concatEnumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
        });
        it("should work with other methods", () => {
            const sum = concatEnumerable.append(10).select(n => n + 1).sum(n => n);
            expect(sum).to.eq(71);
        });
    });
    describe("#contains()", () => {
        const numList = [1, 2, 3, 45, 66, 77, 903];
        const contains = new Enumerable(numList).contains(77);
        it("should contain element [77]", () => {
            expect(contains).to.eq(true);
        });
    });
    describe("#distinct()", () => {
        const nonDistinctList = [1, 2, 3, 3, 2, 4, 5, 6, 5, 5, 5, 32, 11, 24, 11];
        const distinctList = Enumerable.from(nonDistinctList).distinct().toArray();
        it("should return a list of distinct numbers", () => {
            expect(distinctList).to.deep.equal([1, 2, 3, 4, 5, 6, 32, 11, 24]);
            expect(distinctList.length).to.eq(9);
        });
    });
    describe("#elementAt()", () => {
        const numList = [1, 2, 3, 45, 66, 77, 903];
        const enumerable = Enumerable.from(numList);
        it("should return the element at the index of 4", () => {
            expect(enumerable.elementAt(4)).to.eq(66);
        });
        it("should throw error if index is less than 0.", () => {
            expect(() => enumerable.elementAt(-1)).to.throw();
        });
    });
    describe("#elementAtOrDefault()", () => {
        const numList = [1, 2, 3, 45, 66, 77, 903];
        const enumerable = Enumerable.from(numList);
        it("should return the element at the index of 4", () => {
            expect(enumerable.elementAtOrDefault(4)).to.eq(66);
        });
        it("should return null if index is less than 0.", () => {
            expect(enumerable.elementAtOrDefault(-1)).to.eq(null);
        });
    });
    describe("#except()", () => {
        const numList1 = [1, 2, 3, 4, 5, 6];
        const numList2 = [5, 6, 22, 55];
        const exceptList = Enumerable.from(numList1).except(Enumerable.from(numList2)).toArray();
        it("should return numbers that do not exist in the second list", () => {
            expect(exceptList).to.deep.equal([1, 2, 3, 4]);
        });
    });
    describe("#first()", () => {
        const numList = [1, 11, 21, 2222, 3, 4, 5];
        const enumerable = Enumerable.from(numList);
        const emptyEnumerable = Enumerable.from([]);
        it("should return first even number", () => {
            const first = enumerable.first(p => p % 2 === 0);
            expect(first).to.eq(2222);
        });
        it("should throw error if the list is empty", () => {
            expect(() => emptyEnumerable.first(p => p % 2 === 0)).to.throw();
        });
    });
    describe("#firstOrDefault()", () => {
        const numList = [1, 11, 21, 2222, 3, 4, 5];
        const enumerable = Enumerable.from(numList);
        const emptyEnumerable = Enumerable.from([]);
        it("should return first even number", () => {
            const first = enumerable.firstOrDefault(p => p % 2 === 0);
            expect(first).to.eq(2222);
        });
        it("should return null if the list is empty", () => {
            expect(emptyEnumerable.firstOrDefault(p => p % 2 === 0)).to.eq(null);
        });
    });
    describe("#sum()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const sum = new Enumerable(numbers).sum(n => n);
        it("should return the sum of the list", () => {
            expect(sum).to.eq(55);
        });
    });
    describe("#union()", () => {
        const numberList1 = [1, 2, 3, 4, 5];
        const numberList2 = [4, 5, 6, 7, 8];
        const unionList = Enumerable.from(numberList1).union(Enumerable.from(numberList2)).toArray();
        it("should return a union set of two arrays (distinct values only)", () => {
            expect(unionList).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
        });
    });
    describe("#where()", () => {
        const numlist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = new Enumerable(numlist);
        // const evenNumberGen = enumerable.where(n => n % 2 === 0).select(n => Math.pow(n, 2));
        const biggerThan3 = enumerable.where(n => n % 2 === 0).append(12).select(n => Math.pow(n, 2)).any(n => n > 6);
        // const evenNumberArr = evenNumberGen.toArray();
        // console.log(evenNumberArr);
        console.log(biggerThan3);
        it("should be return an array with the square of the even numbers", () => {
            expect(biggerThan3).to.eq(true);
        });
    });
});
