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
            const list = new List([1, 2, 3]);
            expect(Collections.binarySearch(list, 1)).to.eq(0);
            expect(Collections.binarySearch(list, 2)).to.eq(1);
            expect(Collections.binarySearch(list, 3)).to.eq(2);
            expect(Collections.binarySearch(list, 4)).to.eq(-1);
        });
        it("should search and find the index of given item #2", () => {
            const list = Enumerable.range(0, 100).toList();
            expect(Collections.binarySearch(list, 0)).to.eq(0);
            expect(Collections.binarySearch(list, 50)).to.eq(50)
            expect(Collections.binarySearch(list, 99)).to.eq(99);
            for (let ix = 0; ix < 100; ++ix) {
                expect(Collections.binarySearch(list, ix)).to.eq(ix);
            }
        });
        it("should search and find the index of given item #3", () => {
            const list = new List([0]);
            expect(Collections.binarySearch(list, 0)).to.eq(0);
            expect(Collections.binarySearch(list, 1)).to.eq(-1);
            list.clear();
            expect(Collections.binarySearch(list, 0)).to.eq(-1);
        });
        it("should search and find the index of given item #4", () => {
            const source: Person[] = [Person.Alice, Person.Bella, Person.Eliza, Person.Lenka, Person.Mel, Person.Priscilla];
            const list = new LinkedList(source);
            expect(Collections.binarySearch(list, Person.Priscilla, (p1, p2) => p1.name.localeCompare(p2.name))).to.eq(5);
        });
    });
    describe("#fill()", () => {
        it("should replace all elements in the list with the given element", () => {
            const list = new List(["a", "b", "c", "d", "e"]);
            Collections.fill(list, "x");
            for (const s of list) {
                expect(s).to.eq("x");
            }
        });
        it("should not affect empty list", () => {
            const list = new LinkedList<Person>();
            Collections.fill(list, Person.Lucrezia);
            expect(list.size()).to.eq(0);
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
        it("should swap elements at the given indices", () => {
            const list = new List([1, 2, 3, 4, 5]);
            Collections.swap(list, 1, 4);
            expect(list.get(1)).to.eq(5);
            expect(list.get(4)).to.eq(2);
        })
    });
});
