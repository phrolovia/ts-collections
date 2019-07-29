
import { List } from "../../src/list/List";
import { describe, it } from "mocha";
import { expect } from "chai";
import { ArgumentNullException } from "../../src/exceptions/ArgumentNullException";

class Person {
    Name: string;
    Surname: string;
    Age: number;
    constructor(name: string, surname: string, age: number) {
        this.Name = name;
        this.Surname = surname;
        this.Age = age;
    }
}

describe("List", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    describe("#add()", () => {
        it("should add element to the list", () => {
            const list: List<Person> = new List<Person>();
            list.add(person);
            expect(list.get(0)).to.equal(person);
        });
        it("'Count' should be equal to 1", () => {
            const list: List<Person> = new List<Person>();
            list.add(person);
            expect(list.Count).to.equal(1);
        });
    });
    describe("#clear()", () => {
        it("'Count' should be equal to 0", () => {
            const list: List<Person> = new List<Person>();
            list.add(person);
            list.add(person2);
            list.clear();
            expect(list.Count).to.equal(0);
        });
    });
    describe("#contains()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(null);
        it("should have person2", () => {
            var contains = list.contains(person2);
            expect(contains).to.eq(true);
        });
        it("should not have person3", () => {
            var contains = list.contains(person3);
            expect(contains).to.eq(false);
        });
        it("should have null", () => {
            var contains = list.contains(null);
            expect(contains).to.eq(true);
        });
    });
    describe("#exists()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(null);
        it("should have person with age 9", () => {
            var exists = list.exists(p => p && p.Age === 9);
            expect(exists).to.eq(true);
        });
        it("should not have person with age 99", () => {
            var exists = list.exists(p => p && p.Age === 99);
            expect(exists).to.eq(false);
        });
        it("should throw ArgumentNullException ['predicate is null.]", () => {
            expect(() => list.exists(null)).to.throw("predicate is null.");
        });
    });
    describe("#find()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(null);
        it("should be person with age 9", () => {
            var foundPerson = list.find(p => p && p.Age === 9);
            expect(foundPerson.Age).to.eq(person2.Age);
        });
        it("should not have person with age 99", () => {
            var foundPerson = list.find(p => p && p.Age === 99);
            expect(foundPerson).to.eq(null);
        });
    });
    describe("#findAll()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(null);
        it("should return a List<T> object", () => {
            var foundPersonsList = list.findAll(p => p && p.Age > 9);
            expect(foundPersonsList instanceof List).to.eq(true);
        });
        it("should have 2 people", () => {
            var foundPersonsList = list.findAll(p => p && p.Age > 9);
            expect(foundPersonsList.Count).to.eq(2);
        });
    });
    describe("#findIndex()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person4);
        list.add(person3);
        list.add(person3);
        list.add(person5);
        list.add(null);
        it("should throw ArgumentNullException ['predicate is null.]", () => {
            expect(() => list.findIndex(null)).to.throw("predicate is null.");
        });
        it("should throw ArgumentOutOfRangeException ['startIndex is not a valid index.]", () => {
            expect(() => list.findIndex(p => p.Age > 9, -1)).to.throw("startIndex is not a valid index.");
        });
        it("should throw ArgumentOutOfRangeException ['count is less than 0.]", () => {
            expect(() => list.findIndex(p => p.Age > 9, 1, -7)).to.throw("count is less than 0.");
        });
        it("should throw ArgumentOutOfRangeException ['startIndex and count do not specify a valid section in the list.]", () => {
            expect(() => list.findIndex(p => p.Age > 9, 2, 5)).to.throw("startIndex and count do not specify a valid section in the list.");
        });
        it("should return 2", () => {
            const index = list.findIndex(p => p.Age === 10);
            expect(index).to.eq(2);
        });
        it("should return 1 with startIndex=1", () => {
            const index = list.findIndex(p => p.Age === 16, 1);
            expect(index).to.eq(1);
        });
        it("should return 4 with startIndex=2 and count=3", () => {
            const index = list.findIndex(p => p.Age === 16, 2, 3);
            expect(index).to.eq(4);
        });
        it("should return 4 with startIndex=4 and count=2", () => {
            const index = list.findIndex(p => p.Age === 16, 4, 2);
            expect(index).to.eq(4);
        });
    });
    describe("#findLast()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person4);
        list.add(null);
        list.add(person3);
        list.add(person2);
        list.add(null);
        list.add(person5);
        it("should throw ArgumentNullException ['predicate is null.]", () => {
            expect(() => list.findLast(null)).to.throw("predicate is null.");
        });
        it("should be person with name Jane", () => {
            var foundPerson = list.findLast(p => p && p.Age === 16);
            expect(foundPerson.Name).to.eq("Jane");
        });
        it("should be null", () => {
            var foundPerson = list.find(p => p && p.Age === 99);
            expect(foundPerson).to.eq(null);
        });
        it("should be null with null item", () => {
            var foundPerson = list.find(p => p === null);
            expect(foundPerson).to.eq(null);
        });
    });
    describe("#findLastIndex()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person4);
        list.add(person2);
        list.add(person3);
        list.add(person5);
        list.add(null);
        it("should throw ArgumentNullException ['predicate is null.]", () => {
            expect(() => list.findLastIndex(null)).to.throw("predicate is null.");
        });
        it("should throw ArgumentOutOfRangeException ['startIndex is not a valid index.]", () => {
            expect(() => list.findLastIndex(p => p.Age > 9, -1)).to.throw("startIndex is not a valid index.");
        });
        it("should throw ArgumentOutOfRangeException ['count is less than 0.]", () => {
            expect(() => list.findLastIndex(p => p.Age > 9, 1, -7)).to.throw("count is less than 0.");
        });
        it("should throw ArgumentOutOfRangeException ['startIndex and count do not specify a valid section in the list.]", () => {
            expect(() => list.findLastIndex(p => p.Age > 9, 2, 5)).to.throw("startIndex and count do not specify a valid section in the list.");
        });
        it("should return 3", () => {
            const index = list.findLastIndex(p => p && p.Age === 10);
            expect(index).to.eq(3);
        });
        it("should return -1 with startIndex=1", () => {
            const index = list.findLastIndex(p => p && p.Age === 23, 1);
            expect(index).to.eq(-1);
        });
        it("should return 4 with startIndex=1 and count=4", () => {
            const index = list.findLastIndex(p => p && p.Age === 16, 1, 4);
            expect(index).to.eq(4);
        });
        it("should return 1 with startIndex=1 and count=3", () => {
            const index = list.findLastIndex(p => p && p.Age === 16, 1, 3);
            expect(index).to.eq(1);
        });
        it("should return -1 with startIndex=2 and count=2", () => {
            const index = list.findLastIndex(p => p && p.Age === 16, 2, 2);
            expect(index).to.eq(-1);
        });
        it("should return 5 with null value", () => {
            const index = list.findLastIndex(p => p == null);
            expect(index).to.eq(5);
        });
    });
    describe("#forEach()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(null);
        list.add(person4);
        list.add(person5);
        it("should throw ArgumentNullException ['predicate is null.]", () => {
            expect(() => list.forEach(null)).to.throw("action is null.");
        });
        it("should have age of 0 for non-null elements", () => {
            list.forEach(p => p.Age = 0);
            const ages = list.toArray().filter(p => !!p).map(p => p.Age);
            expect(ages).deep.equal([0, 0, 0, 0, 0]);
        });
    });
});