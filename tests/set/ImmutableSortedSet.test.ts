

import {empty, from, ImmutableSet, ImmutableSortedSet} from "../../src/imports";

describe("ImmutableSortedSet", () => {
    describe("#add()", () => {
        test("should return a new set with the given element added", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.add(4);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(4);
            expect(set.contains(4)).to.be.false;
            expect(newSet.contains(4)).to.be.true;
        });
    });
    describe("#addAll()", () => {
        test("should return a new set with the given elements added", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.addAll([4, 5, 6]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(6);
            expect(set.contains(4)).to.be.false;
            expect(newSet.contains(4)).to.be.true;
        });
    });
    describe("#clear()", () => {
        test("should return a new empty set", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.clear();
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(0);
        });
    });
    describe("#contains()", () => {
        test("should return true if the set contains the given element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
        });
        test("should return false if the set does not contain the given element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.contains(4)).to.be.false;
            expect(set.contains(5)).to.be.false;
            expect(set.contains(6)).to.be.false;
        });
        test("should return false", () => {
            const set = ImmutableSortedSet.create([25]);
            const item = {
                "text": "Yakisoba",
                "value": 22,
                "group": "Food",
                "active": true
            };
            const set2 = ImmutableSortedSet.create([item]);
            expect(set.contains(item as any)).to.be.false;
            expect(set2.contains(25 as any)).to.be.false;
        });
    });
    describe("#count()", () => {
        test("should return the number of elements in the set", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.count()).to.eq(3);
        });
        test("should return the number of elements in the set that match the given predicate", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.count(x => x % 2 === 0)).to.eq(1);
        });
    });
    describe("#exceptWith()", () => {
        test("should return a new set with the given elements removed", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.exceptWith([2, 3, 4]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(1);
            expect(set.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
            expect(newSet.contains(1)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
            expect(newSet.contains(3)).to.be.false;
        });
    });
    describe("#headSet()", () => {
        test("should return a new set with the elements less than the given element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.headSet(2);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(1);
            expect(set.contains(1)).to.be.true;
            expect(newSet.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
        });
        test("should return a new set with the elements that also include the given element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.headSet(2, true);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(1)).to.be.true;
            expect(newSet.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.true;
            expect(newSet.contains(3)).to.be.false;
        });
    });
    describe("#intersectWith()", () => {
        test("should return a new set that intersect with the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.intersectWith([2, 3, 4]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
            expect(newSet.contains(1)).to.be.false;
            expect(newSet.contains(2)).to.be.true;
            expect(newSet.contains(3)).to.be.true;
        });
    });
    describe("#isEmpty()", () => {
        test("should return true if the set is empty", () => {
            const set = ImmutableSortedSet.create();
            expect(set.isEmpty()).to.be.true;
        });
        test("should return false if the set is not empty", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isEmpty()).to.be.false;
        });
    });
    describe("#isProperSubsetOf()", () => {
        test("should return true if the set is a proper subset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isProperSubsetOf(from([1, 2, 3, 4]))).to.be.true;
        });
        test("should return false if the set is not a proper subset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isProperSubsetOf(from([1, 2, 3]))).to.be.false;
            expect(set.isProperSubsetOf(from([1]))).to.be.false;
            expect(set.isProperSubsetOf(empty())).to.be.false;
        });
    });
    describe("#isProperSupersetOf()", () => {
        test("should return true if the set is a proper superset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3, 4]);
            expect(set.isProperSupersetOf(from([1, 2, 3]))).to.be.true;
        });
        test("should return false if the set is not a proper superset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isProperSupersetOf(from([1, 2, 3]))).to.be.false;
            expect(set.isProperSupersetOf(from([1]))).to.be.true;
            expect(set.isProperSupersetOf(empty())).to.be.true;
        });
    });
    describe("#isSubsetOf()", () => {
        test("should return true if the set is a subset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isSubsetOf(from([1, 2, 3, 4]))).to.be.true;
            expect(set.isSubsetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSubsetOf(from([1, 2]))).to.be.false;
            expect(set.isSubsetOf(from([1]))).to.be.false;
            expect(set.isSubsetOf(empty())).to.be.false;
        });
        test("should return false if the set is not a subset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isSubsetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSubsetOf(from([1]))).to.be.false;
            expect(set.isSubsetOf(empty())).to.be.false;
        });
    });
    describe("#isSupersetOf()", () => {
        test("should return true if the set is a superset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3, 4]);
            expect(set.isSupersetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSupersetOf(from([1]))).to.be.true;
            expect(set.isSupersetOf(empty())).to.be.true;
        });
        test("should return false if the set is not a superset of the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.isSupersetOf(from([1, 2, 3, 4]))).to.be.false;
        });
    });
    describe("#overlaps()", () => {
        test("should return true if the set overlaps with the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.overlaps([1, 2, 3, 4])).to.be.true;
            expect(set.overlaps(from([1, 2, 3]))).to.be.true;
            expect(set.overlaps(from([1, 2]))).to.be.true;
            expect(set.overlaps(from([1]))).to.be.true;
            expect(set.overlaps(empty())).to.be.false;
        });
        test("should return false if the set does not overlap with the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.overlaps(from([4, 5, 6]))).to.be.false;
        });
    });
    describe("#remove()", () => {
        test("should return a new set with the given element removed", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.remove(2);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
        });
    });
    describe("#removeAll()", () => {
        test("should return a new set with the given elements removed", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.removeAll([2, 3, 4]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(1);
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
            expect(newSet.contains(3)).to.be.false;
        });
    });
    describe("#removeIf()", () => {
        test("should return a new set with the elements removed that match the given predicate", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.removeIf(x => x % 2 === 0);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
        });
    });
    describe("#retainAll()", () => {
        test("should return a new set with the elements that match the given collection", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.retainAll([2, 3, 4]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
            expect(newSet.contains(2)).to.be.true;
            expect(newSet.contains(3)).to.be.true;
        });
    });
    describe("#size()", () => {
        test("should return the number of elements in the set", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.size()).to.eq(3);
        });
    });
    describe("#subSet()", () => {
        test("should return a new set with that does not include the from and to elements", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.subSet(1, 3);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(1);
            expect(newSet.toArray()).to.deep.eq([2]);
        });
        test("should return a new set with that does include the from and to elements", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.subSet(1, 3, true, true);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(3);
            expect(newSet.toArray()).to.deep.eq([1, 2, 3]);
        });
        test("should return a new set with that does include the from element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.subSet(1, 3, true, false);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(newSet.toArray()).to.deep.eq([1, 2]);
        });
        test("should return a new set with that does include the to element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.subSet(1, 3, false, true);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(newSet.toArray()).to.deep.eq([2, 3]);
        });
    });
    describe("#tailSet()", () => {
        test("should return a new set with the elements greater than the given element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.tailSet(2);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(1);
            expect(set.toArray()).to.deep.eq([1, 2, 3]);
            expect(newSet.toArray()).to.deep.eq([3]);
        });
        test("should return a new set with the elements that also include the given element", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            const newSet = set.tailSet(2, true);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.toArray()).to.deep.eq([1, 2, 3]);
            expect(newSet.toArray()).to.deep.eq([2, 3]);
        });
    });
    describe("#toString()", () => {
        test("should return a string representation of the set", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.toString()).to.eq("1, 2, 3");
        });
        test("should empty string if the set is empty", () => {
            const set = ImmutableSortedSet.create();
            expect(set.toString()).to.eq("");
        });
        test("should return a string representation of the set with the given separator", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.toString("; ")).to.eq("1; 2; 3");
        });
        test("should return a string representation of the set with the given separator and selector", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.toString("; ", e => String(e * 2))).to.eq("2; 4; 6");
        });
    });
    describe("get length()", () => {
        test("should return the number of elements in the set", () => {
            const set = ImmutableSortedSet.create([1, 2, 3]);
            expect(set.length).to.eq(3);
        });
    });
});