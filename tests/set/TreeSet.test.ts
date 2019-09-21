
import { describe, it } from "mocha";
import { expect } from "chai";
import { Person } from "../models/Person";
import { ISet } from "../../src/set/ISet";
import { TreeSet } from "../../src/set/TreeSet";

describe("TreeSet", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    const ageComparator      = (p1: Person, p2: Person) => p1.Age - p2.Age;
    describe("#add()", () => {
        it("size should be equal to 1", () => {
            const set: ISet<Person> = new TreeSet<Person>(ageComparator);
            set.add(person);
            expect(set.size()).to.equal(1);
        });
    });
    describe("#clear()", () => {
        it("size should be equal to 0", () => {
            const set: ISet<Person> = new TreeSet<Person>(ageComparator);
            set.add(person);
            set.add(person2);
            set.clear();
            expect(set.size()).to.equal(0);
        });
    });
    describe("#contains()", () => {
        const set: ISet<Person> = new TreeSet<Person>(ageComparator);
        set.add(person);
        set.add(person2);
        it("should have person2", () => {
            var contains = set.contains(person2);
            expect(contains).to.eq(true);
        });
        it("should not have person3", () => {
            var contains = set.contains(person3);
            expect(contains).to.eq(false);
        });
    });
    describe("#remove()", () => {
        const set: ISet<Person> = new TreeSet<Person>(ageComparator);
        set.add(person);
        set.add(person3);
        set.add(person5);
        set.add(person);
        set.add(person2);
        
        const removed = set.remove(person5);
        it("should return true", () => {
            expect(removed).to.eq(true);
        });
        it("should have the count of 3", () => {
            expect(set.size()).to.eq(3);
        });
        it("should return false", () => {
            const r =set.remove(person4);
            expect(r).to.eq(false);
        });
    });
    describe("#toArray()", () => {
        const set: ISet<Person> = new TreeSet<Person>(ageComparator);
        set.add(person);
        set.add(person3);
        set.add(person5);
        const array = set.toArray();
        it("should have the same size as list", () => {
            expect(set.size()).to.eq(array.length);
        });
    });
});