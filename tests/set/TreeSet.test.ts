
import { describe, it } from "mocha";
import { expect } from "chai";
import { Person } from "../models/Person";
import { ISet } from "../../src/set/ISet";
import { TreeSet } from "../../src/set/TreeSet";
import {BinaryTree} from "../../src/tree/BinaryTree";
import {IQueue} from "../../src/queue/IQueue";
import {List} from "../../src/list/List";

describe("TreeSet", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    const ageComparator      = (p1: Person, p2: Person) => p1.Age - p2.Age;
    describe("$constructor()", () => {
        it("should set comprator to a default one", () => {
            const set: ISet<number> = new TreeSet<number>();
            set.add(1);
            set.add(2);
            set.add(4);
            expect(set.includes(2)).to.eq(true);
        });
    }); 
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
    describe("#includes()", () => {
        const set: ISet<Person> = new TreeSet<Person>(ageComparator);
        set.add(person);
        set.add(person2);
        it("should have person2", () => {
            var contains = set.includes(person2);
            expect(contains).to.eq(true);
        });
        it("should not have person3", () => {
            var contains = set.includes(person3);
            expect(contains).to.eq(false);
        });
    });
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const set: ISet<Person> = new TreeSet<Person>(ageComparator);
            expect(set.isEmpty()).to.eq(true);
        });
        it("should return false", () => {
            const set: ISet<Person> = new TreeSet<Person>(ageComparator);
            set.add(person);
            expect(set.isEmpty()).to.eq(false);
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
    describe("#Count getter", () => {
        const set: ISet<string> = new TreeSet((s1: string, s2: string) => s1.localeCompare(s2));
        set.add("Alice");
        set.add("Rei");
        set.add("Misaki");
        it("should have the count of 3", () => {
            expect(set.Count).to.eq(3);
            expect(set.Count).to.eq(set.size());
        });
        it("should have the count of 2", () => {
            set.remove("Alice");
            expect(set.Count).to.eq(2);
            expect(set.Count).to.eq(set.size());
        });
        it("should have the count of 5", () => {
            set.add("Alice");
            set.add("Yuzuha");
            set.add("Megumi");
            expect(set.Count).to.eq(5);
            expect(set.Count).to.eq(set.size());
        });
        it("should throw an error if assigned", () => {
            // @ts-ignore
            expect(() => queue.Count = 10).to.throw();
        });
    });
    describe("#for-of iterator", () => {
        const set: ISet<number> = new TreeSet<number>((n1: number, n2: number) => n1-n2);
        set.add(50);
        set.add(20);
        set.add(10);
        set.add(22);
        const numArray: number[] = [];
        for (const num of set) {
            numArray.push(num);
        }
        it("should loop over the tree", () => {
            expect(numArray).to.include(10);
            expect(numArray).to.include(20);
            expect(numArray).to.include(50);
            expect(numArray).to.include(22);
            expect(numArray).to.not.include(-1)
        });
        it("should have four items", () => {
            expect(numArray.length).to.eq(4);
        });
        it("should loop over the tree inorder-ly", () => {
            expect(numArray[0]).to.eq(10);
            expect(numArray[1]).to.eq(20);
            expect(numArray[2]).to.eq(22);
            expect(numArray[3]).to.eq(50);
        });
    });
});
