import {describe, it} from "mocha";
import {expect} from "chai";
import {SortedSet} from "../../src/set/SortedSet";
import {Person} from "../models/Person";
import {LinkedList} from "../../imports";

describe("SortedSet", () => {
    describe("#clear()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.clear();
            expect(set.size()).to.eq(0);
            expect(set.length).to.eq(0);
        });
    });

    describe("#exceptWith()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.exceptWith(new LinkedList([Person.Jisu]));
            expect(set.size()).to.eq(1);
            expect(set.length).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.false;
            expect(set.contains(Person.Amy)).to.be.true;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.exceptWith(null)).to.throw(Error);
            expect(() => set.exceptWith(undefined)).to.throw(Error);
        });
    });

    describe("#headSet()", () => {
        const set = new SortedSet([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const headSet = set.headSet(4);
        const headSetInclusive = set.headSet(4, true);
        it("should create head set without the toElement included", () => {
            expect(headSet.size()).to.eq(3);
            expect(headSet.toArray()).to.deep.equal([1, 2, 3]);
            expect(headSet.length).to.eq(3);
        });
        it("should create headset with the toElement included if it is inclusive", () => {
            expect(headSetInclusive.size()).to.eq(4);
            expect(headSetInclusive.toArray()).to.deep.equal([1, 2, 3, 4]);
            expect(headSetInclusive.length).to.eq(4);
        });
    });

    describe("#intersectWith()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.intersectWith(new LinkedList([Person.Jisu, Person.Mel]));
            expect(set.size()).to.eq(1);
            expect(set.length).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.true;
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Mel)).to.be.false;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.intersectWith(null)).to.throw(Error);
            expect(() => set.intersectWith(undefined)).to.throw(Error);
        });
    });

    describe("#isProperSubsetOf()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should return true if the set is a proper subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            otherSet.add(Person.Mel);
            expect(set.isProperSubsetOf(otherSet)).to.be.true;
        });
        it("should return false if the set is not a proper subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isProperSubsetOf(otherSet)).to.be.false;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.isProperSubsetOf(null)).to.throw(Error);
            expect(() => set.isProperSubsetOf(undefined)).to.throw(Error);
        });
    });

    describe("#isProperSupersetOf()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should return true if the set is a proper superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            expect(set.isProperSupersetOf(otherSet)).to.be.true;
        });
        it("should return false if the set is not a proper superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isProperSupersetOf(otherSet)).to.be.false;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.isProperSupersetOf(null)).to.throw(Error);
            expect(() => set.isProperSupersetOf(undefined)).to.throw(Error);
        });
    });

    describe("#isSubsetOf", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should return true if the set is a subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isSubsetOf(otherSet)).to.be.true;
        });
        it("should return false if the set is not a subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            otherSet.add(Person.Senna);
            expect(set.isSubsetOf(otherSet)).to.be.false;
        });
        it("should return true if set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            otherSet.add(Person.Senna);
            expect(firstSet.isSubsetOf(otherSet)).to.be.true;
        });
        it("should return false if this set has more elements than other", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            firstSet.add(Person.Jisu);
            firstSet.add(Person.Mel);
            firstSet.add(Person.Senna);
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.isSubsetOf(otherSet)).to.be.false;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.isSubsetOf(null)).to.throw(Error);
            expect(() => set.isSubsetOf(undefined)).to.throw(Error);
        });
    });

    describe("#isSupersetOf", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should return true if the set is a superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isSupersetOf(otherSet)).to.be.true;
        });
        it("should return false if the set is not a superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            otherSet.add(Person.Senna);
            expect(set.isSupersetOf(otherSet)).to.be.false;
        });
        it("should return false if the set is not a superset of the other set #2", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(set.isSupersetOf(otherSet)).to.be.false;
        });
        it("should return false if set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.isSupersetOf(otherSet)).to.be.false;
        });
        it("should return true if other set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            firstSet.add(Person.Jisu);
            firstSet.add(Person.Mel);
            expect(firstSet.isSupersetOf(otherSet)).to.be.true;
        });
        it("should return false if this set has less elements than other", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            firstSet.add(Person.Jisu);
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.isSupersetOf(otherSet)).to.be.false;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.isSupersetOf(null)).to.throw(Error);
            expect(() => set.isSupersetOf(undefined)).to.throw(Error);
        });
    });

    describe("#overlaps", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        it("should return true if the set overlaps with the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(set.overlaps(otherSet)).to.be.true;
        });
        it("should return false if the set does not overlap with the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Vanessa);
            otherSet.add(Person.Rebecca);
            otherSet.add(Person.Megan);
            expect(set.overlaps(otherSet)).to.be.false;
        });
        it("should return false if set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.overlaps(otherSet)).to.be.false;
        });
        it("should throw error if set is null or undefined", () => {
            expect(() => set.overlaps(null)).to.throw(Error);
            expect(() => set.overlaps(undefined)).to.throw(Error);
        });
    });

    describe("#remove()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        it("should remove the item from the set", () => {
            set.remove(Person.Amy);
            expect(set.size()).to.eq(2);
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.length).to.eq(2);
        });
    });
    describe("#removeAll()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        const list = new LinkedList([Person.Amy, Person.Jisu]);
        it("should remove all the items of the list from the set", () => {
            set.removeAll(list);
            expect(set.size()).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.false;
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Bella)).to.be.true;
            expect(set.length).to.eq(1);
        });
    });
    describe("#removeIf()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        it("should remove all items that satisfy the predicate from the set", () => {
            set.removeIf(p => p.name.length < 5);
            expect(set.size()).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.false;
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Bella)).to.be.true;
            expect(set.length).to.eq(1);
        });
    });
    describe("#retainAll()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        const list = new LinkedList([Person.Amy, Person.Jisu]);
        it("should remove all the items of the list from the set", () => {
            set.retainAll(list);
            expect(set.size()).to.eq(2);
            expect(set.contains(Person.Jisu)).to.be.true;
            expect(set.contains(Person.Amy)).to.be.true;
            expect(set.contains(Person.Bella)).to.be.false;
            expect(set.length).to.eq(2);
        });
    });
    describe("#subSet()", () => {
        const set = new SortedSet([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const incExcSubset = set.subSet(3, 7, true, false);
        const incIncSubset = set.subSet(3, 7, true, true);
        const excIncSubset = set.subSet(3, 7, false, true);
        const excExcSubset = set.subSet(3, 7, false, false);
        it("should create a subset including fromElement and excluding toElement", () => {
            expect(incExcSubset.toArray()).to.deep.equal([3, 4, 5, 6]);
            expect(incExcSubset.length).to.eq(4);
        });
        it("should create a subset including fromElement and including toElement", () => {
            expect(incIncSubset.toArray()).to.deep.equal([3, 4, 5, 6, 7]);
            expect(incIncSubset.length).to.eq(5);
        });
        it("should create a subset excluding and including toElement", () => {
            expect(excIncSubset.toArray()).to.deep.equal([4, 5, 6, 7]);
            expect(excIncSubset.length).to.eq(4);
        });
        it("should create a subset excluding fromElement and excluding toElement", () => {
            expect(excExcSubset.toArray()).to.deep.equal([4, 5, 6]);
            expect(excExcSubset.length).to.eq(3);
        });
    });
    describe("#tailSet()", () => {
        const set = new SortedSet([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const tailSet = set.tailSet(4);
        const tailSetInclusive = set.tailSet(4, true);
        it("should create tail set without the toElement included", () => {
            expect(tailSet.size()).to.eq(4);
            expect(tailSet.toArray()).to.deep.equal([5, 6, 7, 8]);
            expect(tailSet.length).to.eq(4);
        });
        it("should create tail set with the toElement included if it is inclusive", () => {
            expect(tailSetInclusive.size()).to.eq(5);
            expect(tailSetInclusive.toArray()).to.deep.equal([4, 5, 6, 7, 8]);
            expect(tailSetInclusive.length).to.eq(5);
        });
    });
});
