import {describe} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {Collections} from "../../src/core/Collections";
import {LinkedList} from "../../src/list/LinkedList";
import {Enumerable, List, RedBlackTree} from "../../imports";
import {ErrorMessages} from "../../src/shared/ErrorMessages";

describe("Collections", () => {
    const personAgeComparator = (p1: Person, p2: Person) => p1.age === p2.age;
    const personNameComparator = (p1: Person, p2: Person) => p1.name === p2.name;
    const personSurnameComparator = (p1: Person, p2: Person) => p1.surname === p2.surname;
    const peopleArray = [Person.Hanna, Person.Hanna2, Person.Noemi, Person.Noemi2, Person.Suzuha, Person.Suzuha2, Person.Suzuha3];

    describe("#addAll()", () => {
        it("should add the given elements to the collection", () => {
            const list = new LinkedList([1, 2]);
            Collections.addAll(list, 3, 4, 5);
            expect(list.size()).to.eq(5);
            for (let ix = 1; ix <= 5; ++ix) {
                expect(list.get(ix - 1)).to.eq(ix);
            }
        });
        it("should add the given elements to the collection #2", () => {
            const tree = new RedBlackTree(null, [1, 2]);
            Collections.addAll(tree, 3, 4, 5);
            expect(tree.size()).to.eq(5);
            expect(tree.search(1)).to.be.true;
            expect(tree.search(2)).to.be.true;
            expect(tree.search(3)).to.be.true;
            expect(tree.search(4)).to.be.true;
            expect(tree.search(5)).to.be.true;
        });
    });

    describe("#binarySearch()", () => {
        it("should search and find the index of given item", () => {
            const array = [1, 2, 3];
            const list = new List(array);
            expect(Collections.binarySearch(list, 1)).to.eq(0);
            expect(Collections.binarySearch(array, 1)).to.eq(0);
            expect(Collections.binarySearch(list, 2)).to.eq(1);
            expect(Collections.binarySearch(array, 2)).to.eq(1);
            expect(Collections.binarySearch(list, 3)).to.eq(2);
            expect(Collections.binarySearch(array, 3)).to.eq(2);
            expect(Collections.binarySearch(list, 4)).to.eq(-1);
            expect(Collections.binarySearch(array, 4)).to.eq(-1);
        });
        it("should search and find the index of given item #2", () => {
            const list = Enumerable.range(0, 100).toList();
            const array = list.toArray();
            expect(Collections.binarySearch(list, 0)).to.eq(0);
            expect(Collections.binarySearch(array, 0)).to.eq(0);
            expect(Collections.binarySearch(list, 50)).to.eq(50);
            expect(Collections.binarySearch(array, 50)).to.eq(50);
            expect(Collections.binarySearch(list, 99)).to.eq(99);
            expect(Collections.binarySearch(array, 99)).to.eq(99);
            for (let ix = 0; ix < 100; ++ix) {
                expect(Collections.binarySearch(list, ix)).to.eq(ix);
                expect(Collections.binarySearch(array, ix)).to.eq(ix);
            }
        });
        it("should search and find the index of given item #3", () => {
            const array = [0];
            const list = new List(array);
            expect(Collections.binarySearch(list, 0)).to.eq(0);
            expect(Collections.binarySearch(array, 0)).to.eq(0);
            expect(Collections.binarySearch(list, 1)).to.eq(-1);
            expect(Collections.binarySearch(array, 1)).to.eq(-1);
            list.clear();
            array.length = 0;
            expect(Collections.binarySearch(list, 0)).to.eq(-1);
            expect(Collections.binarySearch(array, 0)).to.eq(-1);
        });
        it("should search and find the index of given item #4", () => {
            const source: Person[] = [Person.Alice, Person.Bella, Person.Eliza, Person.Lenka, Person.Mel, Person.Priscilla];
            const list = new LinkedList(source);
            expect(Collections.binarySearch(list, Person.Priscilla, (p1, p2) => p1.name.localeCompare(p2.name))).to.eq(5);
            expect(Collections.binarySearch(source, Person.Priscilla, (p1, p2) => p1.name.localeCompare(p2.name))).to.eq(5);
        });
    });
    describe("#fill()", () => {
        it("should replace all elements in the list with the given element", () => {
            const list = new List(["a", "b", "c", "d", "e"]);
            Collections.fill(list, "v");
            for (const s of list) {
                expect(s).to.eq("v");
            }
        });
        it("should not affect empty list", () => {
            const list = new LinkedList<Person>();
            Collections.fill(list, Person.Lucrezia);
            expect(list.size()).to.eq(0);
        });
    });
    describe("#frequency()", () => {
        it("should find the frequency of the given element", () => {
            const array = ["A", "B", "F", "F", "R", "F", "T", "G", "N", "F"];
            const list = new List(array);
            const linkedList = new LinkedList(array);
            const listFrequency = Collections.frequency(list, "F");
            const linkedListFrequency = Collections.frequency(linkedList, "F");
            const arrayFrequency = Collections.frequency(array, "F");
            expect([arrayFrequency, linkedListFrequency, listFrequency]).to.deep.equal([4, 4, 4]);
        });
        it("should find the frequency of the given element #2", () => {
            const array = [Person.Alice, Person.Alice, Person.Lucrezia, Person.Priscilla, Person.Jisu, Person.Alice, Person.Lucrezia, Person.Noemi2];
            const list = new List(array);
            const frequencyA = Collections.frequency(list, Person.Alice, (p1, p2) => p1.name === p2.name);
            const frequencyL = Collections.frequency(list, Person.Lucrezia, (p1, p2) => p1.name === p2.name);
            const frequencyN = Collections.frequency(array, Person.Noemi, (p1, p2) => p1.name === p2.name);
            const frequencyP = Collections.frequency(array, Person.Priscilla, (p1, p2) => p1.name === p2.name);
            expect(frequencyA).to.eq(3);
            expect(frequencyL).to.eq(2);
            expect(frequencyN).to.eq(1);
            expect(frequencyP).to.eq(1);
        });
    });
    describe("#replaceAll()", () => {
        it("should replace old elements with new elements", () => {
            const list = new List([1, 2, 3, 3, 1, 5, 6, 7]);
            const array = list.toArray();
            const oldListSize = list.size();
            const oldArraySize = array.length;
            const listResult = Collections.replaceAll(list, 3, 0);
            const arrayResult = Collections.replaceAll(array, 1, -1);
            const listResult2 = Collections.replaceAll(list, 111, 555);
            expect(list.get(2)).to.eq(0);
            expect(list.get(3)).to.eq(0);
            expect(list.size()).to.eq(oldListSize);
            expect(array[0]).to.eq(-1);
            expect(array[4]).to.eq(-1);
            expect(array.length).to.eq(oldArraySize);
            expect(listResult).to.be.true;
            expect(arrayResult).to.be.true;
            expect(listResult2).to.be.false;
        });
    });
    describe("#swap()", () => {
        it("should throw error if indices are out of bounds", () => {
            const list = new List([1, 2]);
            expect(() => Collections.swap(list, 0, 3)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => Collections.swap(list, 0, -1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => Collections.swap(list, -1, 1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => Collections.swap(list, 4, 1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        });
        it("should swap elements at the given indices [List]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            Collections.swap(list, 1, 4);
            expect(list.get(1)).to.eq(5);
            expect(list.get(4)).to.eq(2);
        });
        it("should swap elements at the given indices [Array]", () => {
            const array = [1, 2, 3, 4, 5];
            Collections.swap(array, 1, 4);
            expect(array[1]).to.eq(5);
            expect(array[4]).to.eq(2);
        });
    });
});
