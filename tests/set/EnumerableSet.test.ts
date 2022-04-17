import {describe, it} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {EnumerableSet} from "../../src/set/EnumerableSet";

describe("EnumerableSet", () => {
    describe("#add()", () => {
        it("should add an item to the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            expect(set.contains(Person.Bella)).to.be.true;
        });
    });
    describe("#clear()", () => {
        it("should clear the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.clear();
            expect(set.contains(Person.Bella)).to.be.false;
            expect(set.length).to.equal(0);
        });
    });
    describe("#contains()", () => {
        it("should return true if the set contains the item", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            expect(set.contains(Person.Bella)).to.be.true;
        });
        it("should return false if the set does not contain the item", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            expect(set.contains(Person.Senna)).to.be.false;
        });
    });
    describe("#remove()", () => {
        it("should remove the item from the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.remove(Person.Bella);
            expect(set.contains(Person.Bella)).to.be.false;
        });
    });
    describe("#removeAll()", () => {
        it("should remove all items from the set", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.add(Person.Reina);
            set.removeAll([Person.Bella, Person.Reina]);
            expect(set.contains(Person.Bella)).to.be.false;
            expect(set.contains(Person.Reina)).to.be.false;
            expect(set.contains(Person.Senna)).to.be.true;
        });
    });
    describe("#removeIf()", () => {
        it("should remove all items from the set that match the predicate", () => {
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
        it("should retain only the items in the set that match the predicate", () => {
            const set = new EnumerableSet<Person>();
            set.add(Person.Bella);
            set.add(Person.Senna);
            set.add(Person.Reina);
            set.retainAll([Person.Bella, Person.Reina]);
            expect(set.contains(Person.Bella)).to.be.true;
            expect(set.contains(Person.Reina)).to.be.true;
            expect(set.contains(Person.Senna)).to.be.false;
        });
    });
});
