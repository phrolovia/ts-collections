
import {SortedSet} from "../../src/set/SortedSet";
import {Person} from "../models/Person";
import {ImmutableSortedSet, LinkedList} from "../../src/imports";
import {SimpleObject} from "../models/SimpleObject";

describe("SortedSet", () => {
    describe("#add()", () => {
        test("should skip adding if same element is already in the dictionary", () => {
            const set = new SortedSet<Person>([], (p1, p2) => p1.age - p2.age);
            set.add(Person.Bella);
            set.add(Person.Mel);
            set.add(Person.Olga);
            set.add(Person.Hanna);
            set.add(Person.Lucrezia); // should be skipped since Bella is already in the set (due to same age)
            set.add(Person.Jisu);
            expect(set.length).to.equal(5);
            expect(set.toArray()).to.deep.equal([Person.Mel, Person.Jisu, Person.Hanna, Person.Bella, Person.Olga]);
        });
    });

    describe("#clear()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.clear();
            expect(set.size()).to.eq(0);
            expect(set.length).to.eq(0);
        });
    });

    describe("#contains()", () => {
        test("should return true if the element is in the set", () => {
            const object1 = new SimpleObject(439329);
            const object2 = new SimpleObject(8338);
            const sortedSet = new SortedSet<SimpleObject>([], (o1: SimpleObject, o2: SimpleObject) => o1.id - o2.id);
            sortedSet.add(object1);
            expect(sortedSet.contains(object1)).to.be.true;
            expect(sortedSet.contains(object2)).to.be.false;
        });
        test("should return false", () => {
            const set = new SortedSet([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
            const item = {
                "text": "Yakisoba",
                "value": 22,
                "group": "Food",
                "active": true
            };
            const set2 = new SortedSet([item]);
            expect(set.contains(item as any)).to.be.false;
            expect(set2.contains(25 as any)).to.be.false;
        });
    });

    describe("#constructor()", () => {
        test("should initialize with an empty array if no elements are provided", () => {
            const set = new SortedSet<Person>();
            expect(set.length).to.eq(0);
        });
        test("should initialize with the given elements", () => {
            const set = new SortedSet<string>(["a", "b", "c", "a", "b", "c"]);
            expect(set.length).to.eq(3);
        });
        test("should initialize with the given comparator", () => {
            const set = new SortedSet<Person>([Person.Noemi], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            expect(set.length).to.eq(1);
            expect(set.contains(Person.Noemi2)).to.be.true; // compare by name
        });
    });

    describe("#exceptWith()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.exceptWith(new LinkedList([Person.Jisu]));
            expect(set.size()).to.eq(1);
            expect(set.length).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.false;
            expect(set.contains(Person.Amy)).to.be.true;
        });
    });

    describe("#headSet()", () => {
        const set = new SortedSet([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const headSet = set.headSet(4);
        const headSetInclusive = set.headSet(4, true);
        test("should create head set without the toElement included", () => {
            expect(headSet.size()).to.eq(3);
            expect(headSet.toArray()).to.deep.equal([1, 2, 3]);
            expect(headSet.length).to.eq(3);
        });
        test("should create headset with the toElement included if it is inclusive", () => {
            expect(headSetInclusive.size()).to.eq(4);
            expect(headSetInclusive.toArray()).to.deep.equal([1, 2, 3, 4]);
            expect(headSetInclusive.length).to.eq(4);
        });
    });

    describe("#intersectWith()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.intersectWith(new LinkedList([Person.Jisu, Person.Mel]));
            expect(set.size()).to.eq(1);
            expect(set.length).to.eq(1);
            expect(set.contains(Person.Jisu)).to.be.true;
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Mel)).to.be.false;
        });
    });

    describe("#isProperSubsetOf()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should return true if the set is a proper subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            otherSet.add(Person.Mel);
            expect(set.isProperSubsetOf(otherSet)).to.be.true;
        });
        test("should return false if the set is not a proper subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isProperSubsetOf(otherSet)).to.be.false;
        });
    });

    describe("#isProperSupersetOf()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should return true if the set is a proper superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            expect(set.isProperSupersetOf(otherSet)).to.be.true;
        });
        test("should return false if the set is not a proper superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isProperSupersetOf(otherSet)).to.be.false;
        });
    });

    describe("#isSubsetOf", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should return true if the set is a subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isSubsetOf(otherSet)).to.be.true;
        });
        test("should return false if the set is not a subset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            otherSet.add(Person.Senna);
            expect(set.isSubsetOf(otherSet)).to.be.false;
        });
        test("should return true if set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            otherSet.add(Person.Senna);
            expect(firstSet.isSubsetOf(otherSet)).to.be.true;
        });
        test("should return false if this set has more elements than other", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            firstSet.add(Person.Jisu);
            firstSet.add(Person.Mel);
            firstSet.add(Person.Senna);
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.isSubsetOf(otherSet)).to.be.false;
        });
    });

    describe("#isSupersetOf", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should return true if the set is a superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Amy);
            expect(set.isSupersetOf(otherSet)).to.be.true;
        });
        test("should return false if the set is not a superset of the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            otherSet.add(Person.Senna);
            expect(set.isSupersetOf(otherSet)).to.be.false;
        });
        test("should return false if the set is not a superset of the other set #2", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(set.isSupersetOf(otherSet)).to.be.false;
        });
        test("should return false if set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.isSupersetOf(otherSet)).to.be.false;
        });
        test("should return true if other set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            firstSet.add(Person.Jisu);
            firstSet.add(Person.Mel);
            expect(firstSet.isSupersetOf(otherSet)).to.be.true;
        });
        test("should return false if this set has less elements than other", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            firstSet.add(Person.Jisu);
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.isSupersetOf(otherSet)).to.be.false;
        });
    });

    describe("#overlaps", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should return true if the set overlaps with the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(set.overlaps(otherSet)).to.be.true;
        });
        test("should return false if the set does not overlap with the other set", () => {
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Vanessa);
            otherSet.add(Person.Rebecca);
            otherSet.add(Person.Megan);
            expect(set.overlaps(otherSet)).to.be.false;
        });
        test("should return false if set is empty", () => {
            const firstSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            const otherSet = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
            otherSet.add(Person.Jisu);
            otherSet.add(Person.Mel);
            expect(firstSet.overlaps(otherSet)).to.be.false;
        });
    });

    describe("#remove()", () => {
        const set = new SortedSet<Person>([], (p1: Person, p2: Person) => p1.name.localeCompare(p2.name));
        set.add(Person.Jisu);
        set.add(Person.Amy);
        set.add(Person.Bella);
        test("should remove the item from the set", () => {
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
        test("should remove all the items of the list from the set", () => {
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
        test("should remove all items that satisfy the predicate from the set", () => {
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
        test("should remove all the items of the list from the set", () => {
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
        const defaultSubset = set.subSet(3, 7); // same as incExcSubset
        test("should create a subset including fromElement and excluding toElement", () => {
            expect(incExcSubset.toArray()).to.deep.equal([3, 4, 5, 6]);
            expect(incExcSubset.length).to.eq(4);
        });
        test("should create a subset including fromElement and including toElement", () => {
            expect(incIncSubset.toArray()).to.deep.equal([3, 4, 5, 6, 7]);
            expect(incIncSubset.length).to.eq(5);
        });
        test("should create a subset excluding and including toElement", () => {
            expect(excIncSubset.toArray()).to.deep.equal([4, 5, 6, 7]);
            expect(excIncSubset.length).to.eq(4);
        });
        test("should create a subset excluding fromElement and excluding toElement", () => {
            expect(excExcSubset.toArray()).to.deep.equal([4, 5, 6]);
            expect(excExcSubset.length).to.eq(3);
        });
        test("should create a subset including fromElement and excluding toElement by default", () => {
            expect(defaultSubset.toArray()).to.deep.equal([3, 4, 5, 6]);
            expect(defaultSubset.length).to.eq(4);
        });
    });
    describe("#tailSet()", () => {
        const set = new SortedSet([1, 2, 3, 3, 3, 4, 5, 6, 7, 7, 8]);
        const tailSet = set.tailSet(4);
        const tailSetInclusive = set.tailSet(4, true);
        test("should create tail set without the fromElement included", () => {
            expect(tailSet.size()).to.eq(4);
            expect(tailSet.toArray()).to.deep.equal([5, 6, 7, 8]);
            expect(tailSet.length).to.eq(4);
            expect(tailSet.contains(4)).to.be.false;
        });
        test("should create tail set with the fromElement included if it is inclusive", () => {
            expect(tailSetInclusive.size()).to.eq(5);
            expect(tailSetInclusive.toArray()).to.deep.equal([4, 5, 6, 7, 8]);
            expect(tailSetInclusive.length).to.eq(5);
            expect(tailSetInclusive.contains(4)).to.be.true;
        });
    });
});
