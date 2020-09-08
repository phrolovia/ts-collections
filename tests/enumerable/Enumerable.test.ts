import {Enumerable} from "../../src/enumerable/Enumerable";
import {describe, it} from "mocha";
import {expect} from "chai";
import {ErrorMessages} from "../../src/shared/ErrorMessages";

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
    describe("#intersect()", () => {
        const numList1 = [1, 2, 3, 4, 5, 6, 7];
        const numList2 = [5, 6, 7, 11, 22, 33, 44, 55];
        const intersectList = Enumerable.from(numList1).intersect(Enumerable.from(numList2)).toArray();
        it("should return the elements from numList1 only if they also exist in numList2", () => {
            expect(intersectList).to.deep.equal([5, 6, 7]);
        });
    });
    describe("#last", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should return the last number in the list", () => {
            const last = enumerable.last();
            expect(last).to.eq(10);
        });
        it("should return the last odd number in the list", () => {
            const lastOddNumber = enumerable.last(n => n % 2 !== 0);
            expect(lastOddNumber).to.eq(9);
        });
        it("should throw error if the list is empty", () => {
            expect(() => Enumerable.from([]).last()).to.throw();
        });
        it("should throw error if no matching element is found", () => {
            expect(() => enumerable.last(n => n > 10)).to.throw(ErrorMessages.NoMatchingElement);
        });
    });
    describe("#lastOrDefault()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should return the last number in the list", () => {
            const last = enumerable.lastOrDefault();
            expect(last).to.eq(10);
        });
        it("should return the last odd number in the list", () => {
            const lastOddNumber = enumerable.lastOrDefault(n => n % 2 !== 0);
            expect(lastOddNumber).to.eq(9);
        });
        it("should return null if the list is empty", () => {
            const last = Enumerable.from([]).lastOrDefault();
            expect(last).to.eq(null);
        });
        it("should return null if no matching element is found", () => {
            const last = enumerable.lastOrDefault(n => n > 10);
            expect(last).to.eq(null);
        });
    });
    describe("#max()", () => {
        const numbers = [6, 22, 11, 55, 234, 949, 12, 90];
        const enumerable = Enumerable.from(numbers);
        it("should return the greatest element in the list", () => {
            expect(enumerable.max()).to.eq(949);
        });
        it("should return the greatest element that is smaller than 100 in the list", () => {
            const max = enumerable.where(n => n < 100).max();
            expect(max).to.eq(90);
        });
    });
    describe("#min()", () => {
        const numbers = [6, 22, 11, 55, 234, 949, 12, 1, 90];
        const enumerable = Enumerable.from(numbers);
        it("should return the smallest element in the list", () => {
            expect(enumerable.min()).to.eq(1);
        });
        it("should return the smallest element that is greater than 100 in the list", () => {
            const max = enumerable.where(n => n > 100).min();
            expect(max).to.eq(234);
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
