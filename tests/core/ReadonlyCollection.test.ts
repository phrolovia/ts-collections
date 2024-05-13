import { ReadonlyCollection } from "../../src/core/ReadonlyCollection";
import { List } from "../../src/list/List"
import { SortedSet } from "../../src/set/SortedSet";
import { Person } from "../models/Person";

describe("ReadonlyCollection", () => {
    describe("#size()", () => {
        test("should return the number of elements in the collection", () => {
            const set = new SortedSet([1, 2, 3, 4, 5]);
            const collection = new ReadonlyCollection(set);
            expect(collection.size()).to.equal(5);
            expect(collection.length).to.equal(5);
        });
        test("should reflect changes in the underlying collection", () => {
            const set = new SortedSet([1, 2, 3, 4, 5]);
            const collection = new ReadonlyCollection(set);
            expect(collection.size()).to.equal(5);
            expect(collection.length).to.equal(5);
            set.add(6);
            expect(collection.size()).to.equal(6);
            expect(collection.length).to.equal(6);
        });
    });
    describe("#toString()", () => {
        const list = new List([Person.Alice, Person.Mirei, Person.Kaori]);
        const collection = new ReadonlyCollection(list);
        test("should return a string representation of the collection", () => {
            const str = collection.toString("|", p => p.name);
            expect(str).to.equal("Alice|Mirei|Kaori");
        });
        test("should return a string representation of the collection with default separator", () => {
            const str = collection.toString(undefined, p => p.name);
            expect(str).to.equal("Alice, Mirei, Kaori");
        });
    });
});