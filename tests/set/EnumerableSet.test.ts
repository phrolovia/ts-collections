import { describe, expect, test } from "vitest";
import { range } from "../../src/enumerator/functions/range";
import { LinkedList } from "../../src/list/LinkedList";
import { EnumerableSet } from "../../src/set/EnumerableSet";
import { Person } from "../models/Person";

describe("EnumerableSet", () => {
    describe("#add()", () => {
        test("should add an item to the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            expect(set.contains(Person.Bella)).to.be.true;
        });
    });
    describe("#clear()", () => {
        test("should clear the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.clear();
            expect(set.contains(Person.Bella)).to.be.false;
            expect(set.length).to.equal(0);
        });
    });
    describe("#contains()", () => {
        test("should return true if the set contains the item", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            expect(set.contains(Person.Bella)).to.be.true;
        });
        test("should return false if the set does not contain the item", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            expect(set.contains(Person.Senna)).to.be.false;
        });
    });

    describe("#except()", () => {
        test("should return a new set with the elements that are not in the provided collection", () => {
            const set = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Reina]);
            const result = set.except([Person.Bella, Person.Mel]);
            expect(result.toArray()).to.eql([Person.Senna, Person.Reina]);
        });
        test("should return a new set with the elements that are not in the provided collection #2", () => {
            const set = new EnumerableSet(new Set([1, 3, 5, 7, 9]));
            const result = set.except(new Set([1, 4, 9]));
            expect(result.toArray()).to.eql([3, 5, 7]);
        });
        test("should return an empty set if the provided collection contains all elements", () => {
            const set = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Reina]);
            const result = set.except([Person.Bella, Person.Senna, Person.Reina]);
            expect(result.toArray()).to.eql([]);
        });
        test("should return an empty set if the provided collection is empty", () => {
            const set = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Reina]);
            const result = set.except([]);
            expect(result.toArray()).to.eql([Person.Bella, Person.Senna, Person.Reina]);
        });
        test("should return an empty set if the set is empty", () => {
            const set = new EnumerableSet<Person>();
            const result = set.except([Person.Bella, Person.Senna, Person.Reina]);
            expect(result.toArray()).to.eql([]);
        });
        test("should use the provided comparator to determine equality", () => {
            const set = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Noemi]);
            const result = set.except([Person.Mel, Person.Noemi2], (a, b) => a.name === b.name);
            expect(result.toArray()).to.eql([Person.Bella, Person.Senna]);
        });
    });

    describe("#intersect()", () => {
        test("should return a new set with the intersection of the two sets", () => {
            const set1 = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Reina]);
            const set2 = new EnumerableSet<Person>([Person.Senna, Person.Reina, Person.Mel]);
            const result = set1.intersect(set2);
            expect(result.toArray()).to.eql([Person.Senna, Person.Reina]);
        });
        test("should return a new set with the intersection of the two sets #2", () => {
            const set1 = new EnumerableSet([1, 3, 5, 7, 9]);
            const set2 = new EnumerableSet([1, 4, 9]);
            const result = set1.intersect(set2);
            expect(result.toArray()).to.eql([1, 9]);
        });
        test("should return an empty set if there is no intersection", () => {
            const set1 = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Reina]);
            const set2 = new EnumerableSet<Person>([Person.Mel, Person.Jisu]);
            const result = set1.intersect(set2);
            expect(result.toArray()).to.eql([]);
        });
        test("should use the provided comparator to determine equality", () => {
            const set1 = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Noemi]);
            const set2 = new EnumerableSet<Person>([Person.Mel, Person.Noemi2]);

            const set3 = new EnumerableSet<Person>([Person.Bella, Person.Senna, Person.Noemi]);
            const set4 = new EnumerableSet<Person>([Person.Mel, Person.Noemi2]);

            const result1 = set1.intersect(set2, (a, b) => a.name === b.name);
            const result2 = set3.intersect(set4);
            expect(result1.toArray()).to.eql([Person.Noemi]);
            expect(result2.toArray()).to.eql([]);
        });
    });

    describe("#intersectWith()", () => {
        const set = new EnumerableSet<Person>([]);
        set.add(Person.Jisu);
        set.add(Person.Amy);
        test("should remove all items from the set", () => {
            expect(set.length).to.eq(2);
            set.intersectWith(new LinkedList([Person.Jisu, Person.Mel]));
            expect(set.size()).to.eq(1);
            expect(set.length).to.eq(1);
            expect(set.contains(Person.Amy)).to.be.false;
            expect(set.contains(Person.Mel)).to.be.false;
            expect(set.contains(Person.Jisu)).to.be.true;
        });
    });

    describe("#remove()", () => {
        test("should remove the item from the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.remove(Person.Bella);
            expect(set.contains(Person.Bella)).to.be.false;
        });
    });
    describe("#removeAll()", () => {
        test("should remove all items from the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.add(Person.Reina);
            set.removeAll([Person.Bella, Person.Reina]);
            expect(set.contains(Person.Bella)).to.be.false;
            expect(set.contains(Person.Reina)).to.be.false;
            expect(set.contains(Person.Senna)).to.be.true;
        });
        test("should return true if the set was modified", () => {
            const set = new EnumerableSet<string>();
            set.add("z");
            set.add("c");
            set.add("p");
            set.add("p"); // duplicate
            set.add("e");
            set.add("d");
            const result = set.removeAll(["p", "c", "d"]);
            expect(result).to.be.true;
            expect(set.size()).to.equal(2);
            expect(set.contains("p")).to.be.false;
            expect(set.contains("c")).to.be.false;
            expect(set.contains("d")).to.be.false;
            expect(set.toArray()).to.eql(["z", "e"]);
        });
    });
    describe("#removeIf()", () => {
        test("should remove all items from the set that match the predicate", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.add(Person.Reina);
            set.removeIf(p => p.name === "Bella");
            expect(set.contains(Person.Bella)).to.be.false;
            expect(set.contains(Person.Reina)).to.be.true;
            expect(set.contains(Person.Senna)).to.be.true;
        });
    });
    describe("#retainAll()", () => {
        test("should retain only the items in the given iterable", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.add(Person.Reina);
            set.retainAll([Person.Bella, Person.Reina]);
            expect(set.contains(Person.Bella)).to.be.true;
            expect(set.contains(Person.Reina)).to.be.true;
            expect(set.contains(Person.Senna)).to.be.false;
        });
        test("should measure performance of retainAll", () => {
            const set1 = range(1, 10000).toEnumerableSet();
            const set2 = range(5000, 10000).toEnumerableSet();
            const startTime = performance.now();
            set1.retainAll(set2);
            const endTime = performance.now();
            console.log(`Time taken to retainAll: ${endTime - startTime} ms`);
        });
    });
    describe("#toString()", () => {
        test("should return empty string if set is empty", () => {
            const set = new EnumerableSet<Person>();
            expect(set.toString()).to.equal("");
        });
        test("should return the string representation of the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.add(Person.Reina);
            set.add(Person.Senna);
            expect(set.toString()).to.equal("Bella Rivera, Senna Hikaru, Reina Karuizawa");
        });
    });
});
