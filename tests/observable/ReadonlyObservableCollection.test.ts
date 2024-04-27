

import {Person} from "../models/Person";
import {ReadonlyObservableCollection} from "../../src/observable/ReadonlyObservableCollection";
import {ObservableCollection} from "../../src/observable/ObservableCollection";
import {IndexableList} from "../../src/list/IndexableList";

describe("ReadonlyObservableCollection", () => {
    describe("#contains()", () => {
        test("should return true if the collection contains the element", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.contains(Person.Alice)).to.be.true;
        });
        test("should return false if the collection does not contain the element", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.contains(Person.Hanyuu)).to.be.false;
        });
        test("should reflect changes to the underlying collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.contains(Person.Alice)).to.be.true;
            collection.removeAt(0);
            expect(readonlyCollection.contains(Person.Alice)).to.be.false;
        });
    });
    describe("#containsAll()", () => {
        test("should return true if the collection contains all elements", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Hanyuu);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.containsAll([Person.Alice, Person.Hanyuu])).to.be.true;
        });
        test("should return false if the collection does not contain all elements", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.containsAll([Person.Alice, Person.Hanyuu])).to.be.false;
        });
        test("should reflect changes to the underlying collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Hanyuu);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.containsAll([Person.Alice, Person.Hanyuu])).to.be.true;
            collection.removeAt(0);
            expect(readonlyCollection.containsAll([Person.Alice, Person.Hanyuu])).to.be.false;
            expect(readonlyCollection.containsAll([Person.Hanyuu])).to.be.true;
        });
    });
    describe("#get()", () => {
        test("should return the element at the specified index", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.get(0)).to.equal(Person.Alice);
        });
        test("should throw an error if the index is out of bounds", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(() => readonlyCollection.get(1)).to.throw();
        });
        test("should reflect changes to the underlying collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.get(0)).to.equal(Person.Alice);
            collection.removeAt(0);
            expect(() => readonlyCollection.get(0)).to.throw();
        });
    });
    describe("#isEmpty()", () => {
        test("should return true if the collection is empty", () => {
            const collection = new ObservableCollection<Person>();
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.isEmpty()).to.be.true;
        });
        test("should return false if the collection is not empty", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.isEmpty()).to.be.false;
        });
        test("should reflect changes to the underlying collection", () => {
            const collection = new ObservableCollection<Person>();
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.isEmpty()).to.be.true;
            collection.add(Person.Alice);
            expect(readonlyCollection.isEmpty()).to.be.false;
        });
    });
    describe("#size()", () => {
        test("should return the number of elements in the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Hanyuu);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.size()).to.equal(2);
            expect(readonlyCollection.length).to.equal(2);
            expect(readonlyCollection.count()).to.equal(2);
        });
        test("should reflect changes to the underlying collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.size()).to.equal(1);
            expect(readonlyCollection.length).to.equal(1);
            expect(readonlyCollection.count()).to.equal(1);
            collection.add(Person.Hanyuu);
            expect(readonlyCollection.size()).to.equal(2);
            expect(readonlyCollection.length).to.equal(2);
            expect(readonlyCollection.count()).to.equal(2);
        });
    });
    describe("#get comparator()", () => {
        test("should return the comparator", () => {
            const comparator = (a: Person, b: Person) => a.age === b.age;
            const collection = new ObservableCollection<Person>(new IndexableList(), comparator);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.comparator).to.equal(comparator);
        });
    });
    describe("#get length", () => {
        test("should return the number of elements in the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.length).to.equal(2);
            expect(readonlyCollection.size()).to.equal(2);
            expect(readonlyCollection.count()).to.equal(2);
        });
        test("should reflect changes to the underlying collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            expect(readonlyCollection.length).to.equal(1);
            expect(readonlyCollection.size()).to.equal(1);
            expect(readonlyCollection.count()).to.equal(1);
            collection.add(Person.Mirei);
            expect(readonlyCollection.length).to.equal(2);
            expect(readonlyCollection.size()).to.equal(2);
            expect(readonlyCollection.count()).to.equal(2);
        });
    });
    describe("collectionChanged event", () => {
        test("should be emitted when the collection is changed", () => {
            const collection = new ObservableCollection<Person>();
            const readonlyCollection = new ReadonlyObservableCollection(collection);
            let eventCount = 0;
            readonlyCollection.collectionChanged = (sender, args) => {
                eventCount++;
                expect(sender).to.equal(readonlyCollection);
            };
            collection.add(Person.Alice);
            expect(eventCount).to.equal(1);
            collection.add(Person.Hanyuu);
            expect(eventCount).to.equal(2);
            collection.move(0, 1);
            expect(eventCount).to.equal(3);
            collection.removeAt(0);
            expect(eventCount).to.equal(4);
        });
    });
});
