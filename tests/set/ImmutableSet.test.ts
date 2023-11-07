import {expect} from "chai";
import {describe} from "mocha";
import {empty, from} from "../../imports";
import {ImmutableSet} from "../../src/set/ImmutableSet";

describe("ImmutableSet", () => {
    describe("#add()", () => {
        it("should return a new set with the given element added", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.add(4);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(4);
            expect(set.contains(4)).to.be.false;
            expect(newSet.contains(4)).to.be.true;
        });
    });
    describe("#addAll()", () => {
        it("should return a new set with the given elements added", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.addAll([4, 5, 6]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(6);
            expect(set.contains(4)).to.be.false;
            expect(newSet.contains(4)).to.be.true;
        });
    });
    describe("#clear()", () => {
        it("should return a new empty set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.clear();
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(0);
        });
    });
    describe("#contains()", () => {
        it("should return true if the set contains the given element", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
        });
        it("should return false if the set does not contain the given element", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.contains(4)).to.be.false;
            expect(set.contains(5)).to.be.false;
            expect(set.contains(6)).to.be.false;
        });
    });
    describe("#exceptWith()", () => {
        it("should return a new set with the given elements removed", () => {
            const set = ImmutableSet.create([1, 2, 3]);
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
    describe("#intersectWith()", () => {
        it("should return a new set that intersect with the given collection", () => {
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
        it("should return true if the set is empty", () => {
            const set = ImmutableSet.create();
            expect(set.isEmpty()).to.be.true;
        });
        it("should return false if the set is not empty", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isEmpty()).to.be.false;
        });
    });
    describe("#isProperSubsetOf()", () => {
        it("should return true if the set is a proper subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isProperSubsetOf(from([1, 2, 3, 4]))).to.be.true;
        });
        it("should return false if the set is not a proper subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isProperSubsetOf(from([1, 2, 3]))).to.be.false;
            expect(set.isProperSubsetOf(from([1]))).to.be.false;
            expect(set.isProperSubsetOf(empty())).to.be.false;
        });
    });
    describe("#isProperSupersetOf()", () => {
        it("should return true if the set is a proper superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3, 4]);
            expect(set.isProperSupersetOf(from([1, 2, 3]))).to.be.true;
        });
        it("should return false if the set is not a proper superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isProperSupersetOf(from([1, 2, 3]))).to.be.false;
            expect(set.isProperSupersetOf(from([1]))).to.be.true;
            expect(set.isProperSupersetOf(empty())).to.be.true;
        });
    });
    describe("#isSubsetOf()", () => {
        it("should return true if the set is a subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isSubsetOf(from([1, 2, 3, 4]))).to.be.true;
            expect(set.isSubsetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSubsetOf(from([1, 2]))).to.be.false;
            expect(set.isSubsetOf(from([1]))).to.be.false;
            expect(set.isSubsetOf(empty())).to.be.false;
        });
        it("should return false if the set is not a subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isSubsetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSubsetOf(from([1]))).to.be.false;
            expect(set.isSubsetOf(empty())).to.be.false;
        });
    });
    describe("#isSupersetOf()", () => {
        it("should return true if the set is a superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3, 4]);
            expect(set.isSupersetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSupersetOf(from([1]))).to.be.true;
            expect(set.isSupersetOf(empty())).to.be.true;
        });
        it("should return false if the set is not a superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isSupersetOf(from([1, 2, 3, 4]))).to.be.false;
        });
    });
    describe("#overlaps()", () => {
        it("should return true if the set overlaps with the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.overlaps([1, 2, 3, 4])).to.be.true;
            expect(set.overlaps(from([1, 2, 3]))).to.be.true;
            expect(set.overlaps(from([1, 2]))).to.be.true;
            expect(set.overlaps(from([1]))).to.be.true;
            expect(set.overlaps(empty())).to.be.false;
        });
        it("should return false if the set does not overlap with the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.overlaps(from([4, 5, 6]))).to.be.false;
        });
    });
    describe("#remove()", () => {
        it("should return a new set with the given element removed", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.remove(2);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
        });
    });
    describe("#removeAll()", () => {
        it("should return a new set with the given elements removed", () => {
            const set = ImmutableSet.create([1, 2, 3]);
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
        it("should return a new set with the elements removed that match the given predicate", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.removeIf(x => x % 2 === 0);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
        });
    });
    describe("#size()", () => {
        it("should return the number of elements in the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.size()).to.eq(3);
        });
    });
    describe("#toString()", () => {
        it("should return a string representation of the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.toString()).to.eq("1, 2, 3");
        });
        it("should empty string if the set is empty", () => {
            const set = ImmutableSet.create();
            expect(set.toString()).to.eq("");
        });
        it("should return a string representation of the set with the given separator", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.toString("; ")).to.eq("1; 2; 3");
        });
        it("should return a string representation of the set with the given separator and selector", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.toString("; ", e => String(e * 2))).to.eq("2; 4; 6");
        });
    });
    describe("get length()", () => {
        it("should return the number of elements in the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.length).to.eq(3);
        });
    });
});