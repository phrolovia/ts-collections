import { from } from "../../src/enumerator/functions/from";
import { range } from "../../src/enumerator/functions/range";
import { empty } from "../../src/enumerator/functions/empty";
import { ImmutableSet } from "../../src/set/ImmutableSet";

describe("ImmutableSet", () => {
    describe("#add()", () => {
        test("should return a new set with the given element added", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.add(4);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(4);
            expect(set.contains(4)).to.be.false;
            expect(newSet.contains(4)).to.be.true;
        });
    });
    describe("#addAll()", () => {
        test("should return a new set with the given elements added", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.addAll([4, 5, 6]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(6);
            expect(set.contains(4)).to.be.false;
            expect(newSet.contains(4)).to.be.true;
        });
    });
    describe("#clear()", () => {
        test("should return a new empty set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.clear();
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(0);
        });
    });
    describe("#contains()", () => {
        const setData = from(range(0, 1000000)).select(i => ({id: 1, name: i.toString()})).toArray();
        const set = ImmutableSet.create(setData);
        test("should return true if the set contains the given element", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.contains(1)).to.be.true;
            expect(set.contains(2)).to.be.true;
            expect(set.contains(3)).to.be.true;
        });
        test("should return false if the set does not contain the given element", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.contains(4)).to.be.false;
            expect(set.contains(5)).to.be.false;
            expect(set.contains(6)).to.be.false;
        });
        test("should return true for all elements in the given collection", () => {
            // should be fast
            expect(set.contains(setData[142857])).to.be.true;
            expect(set.contains(setData[666666])).to.be.true;
            expect(set.contains(setData[0])).to.be.true;
            expect(set.contains(setData[999999])).to.be.true;
        });
    });
    describe("#count()", () => {
        test("should return the number of elements in the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.count()).to.eq(3);
        });
        test("should return the number of elements in the set that match the given predicate", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.count(x => x % 2 === 0)).to.eq(1);
        });
    });
    describe("#exceptWith()", () => {
        test("should return a new set with the given elements removed", () => {
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
            const set = ImmutableSet.create();
            expect(set.isEmpty()).to.be.true;
        });
        test("should return false if the set is not empty", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isEmpty()).to.be.false;
        });
    });
    describe("#isProperSubsetOf()", () => {
        test("should return true if the set is a proper subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isProperSubsetOf(from([1, 2, 3, 4]))).to.be.true;
        });
        test("should return false if the set is not a proper subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isProperSubsetOf(from([1, 2, 3]))).to.be.false;
            expect(set.isProperSubsetOf(from([1]))).to.be.false;
            expect(set.isProperSubsetOf(empty())).to.be.false;
        });
    });
    describe("#isProperSupersetOf()", () => {
        test("should return true if the set is a proper superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3, 4]);
            expect(set.isProperSupersetOf(from([1, 2, 3]))).to.be.true;
        });
        test("should return false if the set is not a proper superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isProperSupersetOf(from([1, 2, 3]))).to.be.false;
            expect(set.isProperSupersetOf(from([1]))).to.be.true;
            expect(set.isProperSupersetOf(empty())).to.be.true;
        });
    });
    describe("#isSubsetOf()", () => {
        test("should return true if the set is a subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isSubsetOf(from([1, 2, 3, 4]))).to.be.true;
            expect(set.isSubsetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSubsetOf(from([1, 2]))).to.be.false;
            expect(set.isSubsetOf(from([1]))).to.be.false;
            expect(set.isSubsetOf(empty())).to.be.false;
        });
        test("should return false if the set is not a subset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isSubsetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSubsetOf(from([1]))).to.be.false;
            expect(set.isSubsetOf(empty())).to.be.false;
        });
    });
    describe("#isSupersetOf()", () => {
        test("should return true if the set is a superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3, 4]);
            expect(set.isSupersetOf(from([1, 2, 3]))).to.be.true;
            expect(set.isSupersetOf(from([1]))).to.be.true;
            expect(set.isSupersetOf(empty())).to.be.true;
        });
        test("should return false if the set is not a superset of the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.isSupersetOf(from([1, 2, 3, 4]))).to.be.false;
        });
    });
    describe("#overlaps()", () => {
        test("should return true if the set overlaps with the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.overlaps([1, 2, 3, 4])).to.be.true;
            expect(set.overlaps(from([1, 2, 3]))).to.be.true;
            expect(set.overlaps(from([1, 2]))).to.be.true;
            expect(set.overlaps(from([1]))).to.be.true;
            expect(set.overlaps(empty())).to.be.false;
        });
        test("should return false if the set does not overlap with the given collection", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.overlaps(from([4, 5, 6]))).to.be.false;
        });
    });
    describe("#remove()", () => {
        test("should return a new set with the given element removed", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.remove(2);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
        });
    });
    describe("#removeAll()", () => {
        test("should return a new set with the given elements removed", () => {
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
        test("should return a new set with the elements removed that match the given predicate", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.removeIf(x => x % 2 === 0);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(2);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
        });
    });
    describe("#reset()", () => {
        test("should return a new set with the elements from the given iterable", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            const newSet = set.reset([4, 5, 6]);
            expect(set.size()).to.eq(3);
            expect(newSet.size()).to.eq(3);
            expect(set.contains(2)).to.be.true;
            expect(newSet.contains(2)).to.be.false;
            expect(newSet.toArray()).to.deep.eq([4, 5, 6]);
        });
        test("should return the same instance when called with itself", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.reset(set)).to.eq(set);
        });
    });
    describe("#size()", () => {
        test("should return the number of elements in the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.size()).to.eq(3);
        });
    });
    describe("#toString()", () => {
        test("should return a string representation of the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.toString()).to.eq("1, 2, 3");
        });
        test("should empty string if the set is empty", () => {
            const set = ImmutableSet.create();
            expect(set.toString()).to.eq("");
        });
        test("should return a string representation of the set with the given separator", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.toString("; ")).to.eq("1; 2; 3");
        });
        test("should return a string representation of the set with the given separator and selector", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.toString("; ", e => String(e * 2))).to.eq("2; 4; 6");
        });
    });
    describe("get length()", () => {
        test("should return the number of elements in the set", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.length).to.eq(3);
        });
    });
    describe("persistence", () => {
        test("should match a Set for random operations while keeping every version intact", () => {
            let seed = 9876;
            const random = (max: number) => {
                seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
                return seed % max;
            };
            let set = ImmutableSet.create<number>();
            let model = new Set<number>();
            const snapshots: Array<[ImmutableSet<number>, Set<number>]> = [];
            for (let step = 0; step < 5000; ++step) {
                const element = random(800);
                if (random(3) === 0) {
                    set = set.remove(element);
                    model.delete(element);
                } else {
                    set = set.add(element);
                    model.add(element);
                }
                if (step % 500 === 0) {
                    snapshots.push([set, model]);
                    model = new Set(model);
                }
            }
            snapshots.push([set, model]);
            for (const [snapshot, expected] of snapshots) {
                expect(snapshot.size()).to.eq(expected.size);
                expect(Array.from(snapshot)).to.deep.equal(Array.from(expected));
                for (let element = 0; element < 800; ++element) {
                    expect(snapshot.contains(element)).to.eq(expected.has(element));
                }
            }
        });
        test("should keep insertion order after re-adding and removing elements", () => {
            const set = ImmutableSet.create(["a", "b", "c"]).add("a").remove("b").add("d").add("b");
            expect(set.toArray()).to.deep.equal(["a", "c", "d", "b"]);
        });
        test("should keep insertion order through removeAll, removeIf and retainAll", () => {
            const set = ImmutableSet.create(range(1, 100));
            expect(set.removeAll(range(1, 90)).toArray()).to.deep.equal(range(91, 10).toArray());
            expect(set.removeIf(n => n % 10 !== 0).toArray()).to.deep.equal([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
            expect(set.retainAll([50, 3, 1000, 7]).toArray()).to.deep.equal([3, 7, 50]);
            expect(set.intersectWith([2, 1]).toArray()).to.deep.equal([1, 2]);
            expect(set.exceptWith(range(2, 99)).toArray()).to.deep.equal([1]);
            expect(set.size()).to.eq(100);
        });
        test("should treat elements the same way as Set does", () => {
            const objectElement = { id: 1 };
            const set = ImmutableSet.create<unknown>([NaN, 0, objectElement, null, undefined, "1", 1]);
            expect(set.contains(NaN)).to.be.true;
            expect(set.contains(-0)).to.be.true;
            expect(set.contains(objectElement)).to.be.true;
            expect(set.contains({ id: 1 })).to.be.false;
            expect(set.contains(null)).to.be.true;
            expect(set.contains(undefined)).to.be.true;
            expect(set.size()).to.eq(7);
            expect(set.remove(NaN).contains(NaN)).to.be.false;
            expect(set.add(NaN).size()).to.eq(7);
        });
        test("should return the same instance when nothing changes", () => {
            const set = ImmutableSet.create([1, 2, 3]);
            expect(set.add(1)).to.eq(set);
            expect(set.addAll([2, 3])).to.eq(set);
            expect(set.remove(4)).to.eq(set);
            expect(set.removeAll([4, 5])).to.eq(set);
            expect(set.removeIf(n => n > 3)).to.eq(set);
            expect(set.retainAll([1, 2, 3, 4])).to.eq(set);
        });
        test("should be created from Enumerable#toImmutableSet", () => {
            const set = from([1, 2, 2, 3]).toImmutableSet();
            expect(set.size()).to.eq(3);
            expect(set.add(4).size()).to.eq(4);
            expect(set.size()).to.eq(3);
        });
    });
});
