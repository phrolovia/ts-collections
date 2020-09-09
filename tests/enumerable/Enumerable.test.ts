import {Enumerable} from "../../src/enumerable/Enumerable";
import {describe, it} from "mocha";
import {expect} from "chai";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {List} from "../../src/list/List";
import {Person} from "../models/Person";
import {IList} from "../../src/list/IList";

describe("Enumerable", () => {
    const alice: Person = new Person("Alice", "Rivermist", 23);
    const jane: Person = new Person("Jane", "Green", 16);
    const jisu = new Person("Jisu", "", 14);
    const karen = new Person("Karen", "Furuya", 10);
    const lenka: Person = new Person("Lenka", "Polakova", 16);
    const mel: Person = new Person("Mel", "Bluesky", 9);
    const rebecca = new Person("Rebecca", "Ringale", 17);
    const reina = new Person("Reina", "Karuizawa", 23);
    const senna: Person = new Person("Senna", "Hikaru", 10);
    const vanessa = new Person("Vanessa", "Bloodboil", 20);
    const viola = new Person("Viola", "Ringale", 28);
    const amy = new Person("Amy", "Rivera", 32);
    const bella = new Person("Bella", "Rivera", 21);
    const emily = new Person("Emily", "Redridge", 25);
    const eliza = new Person("Elizabeth", "Jackson", 19);
    const hanna = new Person("Hanna", "Jackson", 20);
    const hanna2 = new Person("Hanna", "Jackson", 19);
    const julia = new Person("Julia", "Watson", 44);
    const lucrezia = new Person("Lucrezia", "Volpe", 21);
    const megan = new Person("Megan", "Watson", 44);
    const noemi = new Person("Noemi", "Waterfox", 29);
    const noemi2 = new Person("Noemi", "Waterfox", 43);
    const olga = new Person("Olga", "Byakova", 77);
    const priscilla = new Person("Priscilla", "Necci", 9);
    const reika = new Person("Reika", "Kurohana", 37);
    const suzuha = new Person("Suzuha", "Suzuki", 22);
    const suzuha2 = new Person("Suzuha", "Mizuki", 22);
    const suzuha3 = new Person("Suzuha", "Mizuki", 26);
    describe("#append()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should append -888 to the end of list", () => {
            const result = enumerable.append(-888).toArray();
            expect(result[result.length - 1]).to.eq(-888);
        });
    });
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
    describe("#prepend()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should prepend the list with -999", () => {
            const result = enumerable.prepend(-999).toArray();
            expect(result[0]).to.eq(-999);
        });
    });
    describe("#range()", () => {
        const enumerable = Enumerable.range(1, 5);
        it("should create a list of increasing numbers starting with 1", () => {
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const max = Enumerable.range(1, 10).select(n => Math.pow(n, 3)).max();
            expect(max).to.eq(1000);
        });
    });
    describe("#repeat()", () => {
        const arrayOfFives = Enumerable.repeat(5, 5).toArray();
        it("should create an array of 5s with the length of 5", () => {
            expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const sum = Enumerable.repeat(10, 10).sum(n => n);
            expect(sum).to.eq(100);
        });
    });
    describe("#sequenceEqual()", () => {
        it("should return false for lists with different sizes", () => {
            const list1 = Enumerable.from([1, 2]);
            const list2 = Enumerable.from([1, 2, 3]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        it("should return false if lists don't have members in the same order", () => {
            const list1 = Enumerable.from([1, 2]);
            const list2 = Enumerable.from([2, 1]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        it("should return true if lists have members in the same order", () => {
            const list1 = Enumerable.from([1, 2]);
            const list2 = Enumerable.from([1, 2]);
            expect(list1.sequenceEqual(list2)).to.eq(true);
        });
        it("should return true if lists have members in the same order", () => {
            const list1 = Enumerable.from([alice, mel, lenka]);
            const list2 = Enumerable.from([alice, mel, lenka]);
            expect(list1.sequenceEqual(list2, (p1, p2) => p1.Name.localeCompare(p2.Name))).to.eq(true);
        });
    });
    describe("#single()", () => {
        it("should throw error if list is empty.", () => {
            const list = Enumerable.from([]);
            expect(() => list.single()).to.throw(ErrorMessages.NoElements);
        });
        it("should throw error if list has more than two elements", () => {
            const list = Enumerable.from([alice, senna, jane]);
            expect(() => list.single()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return the only element in the list", () => {
            const list = Enumerable.from([alice]);
            const single = list.single();
            expect(single).to.eq(alice);
        });
        it("should throw error if no matching element is found.", () => {
            const list = Enumerable.from([alice, senna, jane]);
            expect(() => list.single(p => p.Name === "Lenka")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return person with name 'Alice'.", () => {
            const list = Enumerable.from([alice, senna, jane]);
            const single = list.single(p => p.Name === "Alice");
            expect(single.Name).to.eq("Alice");
            expect(single).to.eq(alice);
        });

    });
    describe("#singleOrDefault()", () => {
        const list = Enumerable.from([1, 2, 3]);
        it("should return null if the list is empty", () => {
            const list2 = Enumerable.from<number>([]);
            const sod1 = list2.singleOrDefault();
            const sod2 = list2.singleOrDefault(n => n > 0);
            expect(sod1).to.eq(null);
            expect(sod2).to.eq(null);
        });
        it("should return 3", () => {
            const item = list.singleOrDefault(n => n === 3);
            expect(item).to.eq(3);
        });
        it("should throw error ['Sequence contains more than one matching element.']", () => {
            expect(() => list.append(3).singleOrDefault(n => n === 3)).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        it("should return the only element in the list", () => {
            const list2 = Enumerable.from(["Suzuha"]);
            const sod = list2.singleOrDefault();
            expect(sod).to.eq("Suzuha");
        });
        it("should throw error ['Sequence contains more than one element.']", () => {
            const list2 = Enumerable.from(["Suzuha", "Suzuri"]);
            expect(() => list2.singleOrDefault()).to.throw("Sequence contains more than one element.");
        });
        it("should return default value [null] if no matching element is found.", () => {
            const sod = list.singleOrDefault(n => n < 0);
            expect(sod).to.eq(null);
        });
    });
    describe("#skip()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return a list with elements [5,6,7]", () => {
            const list2 = list.skip(4).toArray();
            expect(list2).to.deep.equal([5, 6, 7]);
        });
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skip(100).toArray();
            expect(list2.length).to.eq(0);
        });
    });
    describe("#skipLast()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return a list with elements [1,2,3]", () => {
            const list2 = list.skipLast(4).toArray();
            expect(list2).to.deep.equal([1, 2, 3]);
        });
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skipLast(100).toArray();
            expect(list2.length).to.eq(0);
        });
    });
    describe("#skipWhile()", () => {
        const list = Enumerable.from([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500]);
        // it("should throw error ['predicate is null.]", () => {
        //     expect(() => list.skipWhile(null)).to.throw("predicate is null.");
        // });
        it("should return an IEnumerable with elements [4000, 1500, 5500]", () => {
            const list2 = list.skipWhile((n, nx) => n > nx * 1000).toArray();
            expect(list2).to.deep.equal([4000,1500,5500]);
        });
    });
    describe("#sum()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const sum = new Enumerable(numbers).sum(n => n);
        it("should return the sum of the list", () => {
            expect(sum).to.eq(55);
        });
    });
    describe("#take()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return an empty IEnumerable", () => {
            const list2 = list.take(0).toArray();
            const list3 = list.take(-1).toArray();
            expect(list2.length).to.eq(0);
            expect(list3.length).to.eq(0);
        });
        it("should return a list with elements [1,2,3]", () => {
            const list2 = list.take(3).toArray();
            expect(list2.length).to.eq(3);
            expect(list2).to.deep.equal([1,2,3]);
        });
        it("should return all elements if count is bigger than list size", () => {
            const list2 = list.take(100).toArray();
            expect(list2.length).to.eq(list.count());
            expect(list2[0]).to.eq(list.elementAt(0));
            expect(list2[1]).to.eq(list.elementAt(1));
            expect(list2[2]).to.eq(list.elementAt(2));
            expect(list2[3]).to.eq(list.elementAt(3));
            expect(list2[4]).to.eq(list.elementAt(4));
            expect(list2[5]).to.eq(list.elementAt(5));
            expect(list2[6]).to.eq(list.elementAt(6));
        });
    });
    describe("#takeLast()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return an empty IEnumerable", () => {
            const list2 = list.takeLast(0).toArray();
            const list3 = list.takeLast(-1).toArray();
            expect(list2.length).to.eq(0);
            expect(list3.length).to.eq(0);
        });
        it("should return a list with elements [5,6,7]", () => {
            const list2 = list.takeLast(3).toArray();
            expect(list2.length).to.eq(3);
            expect(list2[0]).to.eq(5);
            expect(list2[1]).to.eq(6);
            expect(list2[2]).to.eq(7);
        });
        it("should return all elements if count is bigger than list size", () => {
            const list2 = list.takeLast(100).toArray();
            expect(list2.length).to.eq(list.count());
            expect(list2[0]).to.eq(list.elementAt(0));
            expect(list2[1]).to.eq(list.elementAt(1));
            expect(list2[2]).to.eq(list.elementAt(2));
            expect(list2[3]).to.eq(list.elementAt(3));
            expect(list2[4]).to.eq(list.elementAt(4));
            expect(list2[5]).to.eq(list.elementAt(5));
            expect(list2[6]).to.eq(list.elementAt(6));
        });
    });
    describe("#takeWhile()", () => {
        const list = Enumerable.from(["apple", "banana", "mango", "orange", "plum", "grape"]);
        // it("should throw error ['predicate is null.]", () => {
        //     expect(() => list.takeWhile(null)).to.throw("predicate is null.");
        // });
        it("should return an array with elements [apple, banana, mango]", () => {
            const list2 = list.takeWhile(f => f.localeCompare("orange") !== 0).toArray();
            expect(list2).to.deep.equal(["apple", "banana", "mango"]);
        });
    });
    describe("#union()", () => {
        const numberList1 = [1, 2, 3, 4, 5];
        const numberList2 = [4, 5, 6, 7, 8];
        const unionList = Enumerable.from(numberList1).union(Enumerable.from(numberList2)).toArray();
        it("should return a union set of two arrays (distinct values only)", () => {
            expect(unionList).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
        });
        it("should use default comparator if no comparator is provided", () => {
            const list1 = Enumerable.from(["Alice", "Misaki", "Megumi", "Misaki"]);
            const list2 = Enumerable.from(["Alice", "Rei", "Vanessa", "Vanessa", "Yuzuha"]);
            const union = list1.union(list2);
            expect(union.toArray()).to.deep.equal(["Alice", "Misaki", "Megumi", "Rei", "Vanessa", "Yuzuha"]);
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
    describe("#zip()", () => {
        const numberEnumerable = Enumerable.from([1, 2, 3, 4]);
        const stringEnumerable = Enumerable.from(["one", "two", "three"]);
        it("should return a zipped list with size of 3", () => {
            const numStrList = numberEnumerable.zip(stringEnumerable);
            const expectedResult = [[1, "one"], [2, "two"], [3, "three"]];
            expect(numStrList.toArray()).to.deep.equal(expectedResult);
        });
        it("should return a zipped list with size of 2", () => {
            const zippedList = numberEnumerable.takeLast(2)
                .zip(stringEnumerable.append("four").append("five").takeLast(2), (first: number, second: string) => `${second} ${first}`).toArray();
            expect(zippedList.length).to.eq(2);
            expect(zippedList[0]).to.eq("four 3");
            expect(zippedList[1]).to.eq("five 4");
        });
    });
});
