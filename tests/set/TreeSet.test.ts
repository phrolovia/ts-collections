import {describe, it} from "mocha";
import {expect} from "chai";
import {TreeSet} from "../../src/set/TreeSet";
import {Person} from "../models/Person";
import {LinkedList} from "../../imports";

describe("TreeSet", () => {
    describe("#clear()", () => {
        const set = new TreeSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should remove all items from the set", () => {
            set.clear();
            expect(set.size()).to.eq(0);
        });
    });
    describe("#headSet()", () => {
        const set = TreeSet.from([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const headSet = set.headSet(4);
        const headSetInclusive = set.headSet(4, true);
        it("should create head set without the toElement included", () => {
            expect(headSet.size()).to.eq(3);
            expect(headSet.toArray()).to.deep.equal([1, 2, 3]);
        });
        it("should create headset with the toElement included if it is inclusive", () => {
            expect(headSetInclusive.size()).to.eq(4);
            expect(headSetInclusive.toArray()).to.deep.equal([1, 2, 3, 4]);
        });
    });
    describe("#remove()", () => {
        const set = new TreeSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        it("should remove the item from the set", () => {
            set.remove(Person.Amy);
            expect(set.size()).to.eq(2);
            expect(set.contains(Person.Amy)).to.be.false;
        });
    });
    describe("#removeAll()", () => {
        const set = new TreeSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        const list = LinkedList.from([Person.Amy, Person.Jisu]);
        it("should remove all the items of the list from the set", () => {
            set.removeAll(list);
            expect(set.size()).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.false;
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Bella)).to.be.true;
        });
    });
    describe("#removeIf()", () => {
        const set = new TreeSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        it("should remove all items that satisfy the predicate from the set", () => {
            set.removeIf(p => p.name.length < 5);
            expect(set.size()).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.false;
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Bella)).to.be.true;
        });
    });
    describe("#retainAll()", () => {
        const set = new TreeSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        const list = LinkedList.from([Person.Amy, Person.Jisu]);
        it("should remove all the items of the list from the set", () => {
            set.retainAll(list);
            expect(set.size()).to.eq(2);
            expect(set.contains(Person.Jisu)).to.be.true;
            expect(set.contains(Person.Amy)).to.be.true;
            expect(set.contains(Person.Bella)).to.be.false;
        });
    });
    describe("#subSet()", () => {
        const set = TreeSet.from([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const incExcSubset = set.subSet(3, 7, true, false);
        const incIncSubset = set.subSet(3, 7, true, true);
        const excIncSubset = set.subSet(3, 7, false, true);
        const excExcSubset = set.subSet(3, 7, false, false);
        it("should create a subset including fromElement and excluding toElement", () => {
            expect(incExcSubset.toArray()).to.deep.equal([3, 4, 5, 6]);
        });
        it("should create a subset including fromElement and including toElement", () => {
            expect(incIncSubset.toArray()).to.deep.equal([3, 4, 5, 6, 7]);
        });
        it("should create a subset excluding and including toElement", () => {
            expect(excIncSubset.toArray()).to.deep.equal([4, 5, 6, 7]);
        });
        it("should create a subset excluding fromElement and excluding toElement", () => {
            expect(excExcSubset.toArray()).to.deep.equal([4, 5, 6]);
        });
    });
    describe("#tailSet()", () => {
        const set = TreeSet.from([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const tailSet = set.tailSet(4);
        const tailSetInclusive = set.tailSet(4, true);
        it("should create tail set without the toElement included", () => {
            expect(tailSet.size()).to.eq(4);
            expect(tailSet.toArray()).to.deep.equal([5, 6, 7, 8]);
        });
        it("should create tail set with the toElement included if it is inclusive", () => {
            expect(tailSetInclusive.size()).to.eq(5);
            expect(tailSetInclusive.toArray()).to.deep.equal([4, 5, 6, 7, 8]);
        });
    });
});
