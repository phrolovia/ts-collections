
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
    const person: Person     = new Person("Ryouta", "Kazehaya", 23);
    const person2: Person    = new Person("Hana", "Kazehaya", 9);
    const person3: Person    = new Person("Shiroe", "Kazehaya", 10);
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
});