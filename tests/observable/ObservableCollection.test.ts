import {describe, test, expect} from "vitest";

import {Person} from "../models/Person";
import {ObservableCollection} from "../../src/observable/ObservableCollection";
import {CollectionChangedAction} from "../../src/observable/ICollectionChangedEventArgs";
import {Enumerable} from "../../src/imports";

describe("ObservableCollection", () => {
    describe("#add()", () => {
       test("should add an element to the collection", () => {
          const collection = new ObservableCollection<Person>();
          collection.add(Person.Alice);
          expect(collection.size()).to.equal(1);
          expect(collection.length).to.equal(1);
       });
       test("should add multiple elements to the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.size()).to.equal(2);
            expect(collection.length).to.equal(2);
       });
       test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.add(Person.Alice);
            expect(eventRaised).to.be.true;
       });
       test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Add);
                expect(args.newItems.toArray()).to.deep.equal([Person.Alice]);
            };
            collection.add(Person.Alice);
            expect(eventRaised).to.be.true;
       });
    });
    describe("#clear()", () => {
        test("should clear the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            collection.clear();
            expect(collection.size()).to.equal(0);
            expect(collection.length).to.equal(0);
        });
        test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.clear();
            expect(eventRaised).to.be.true;
        });
        test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Reset);
                expect(args.oldItems.toArray()).to.deep.equal([Person.Alice, Person.Mirei]);
            };
            collection.clear();
            expect(eventRaised).to.be.true;
        });
    });
    describe("#contains()", () => {
        test("should return true if the collection contains the element", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            expect(collection.contains(Person.Alice)).to.be.true;
        });
        test("should return false if the collection does not contain the element", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Noemi);
            expect(collection.contains(Person.Noemi2)).to.be.false;
        });
        test("should use the collection's equalityComparer to determine if the collection contains the element", () => {
            const collection = new ObservableCollection<Person>([], (a, b) => a.name === b.name);
            collection.add(Person.Noemi);
            expect(collection.contains(Person.Noemi2)).to.be.true;
        });
        test("should use the comparer to determine if the collection contains the element", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Noemi);
            expect(collection.contains(Person.Noemi2, (a, b) => a.name === b.name)).to.be.true;
        });
    });
    describe("#containsAll()", () => {
        test("should return true if the collection contains all elements", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.containsAll([Person.Alice, Person.Mirei])).to.be.true;
        });
        test("should return false if the collection does not contain all elements", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.containsAll([Person.Alice, Person.Noemi])).to.be.false;
        });
        test("should use the collection's equalityComparer to determine if the collection contains all elements", () => {
            const collection = new ObservableCollection<Person>([], (a, b) => a.name === b.name);
            collection.add(Person.Noemi);
            expect(collection.containsAll([Person.Noemi2])).to.be.true;
        });
    });
    describe("#get()", () => {
        test("should return the element at the specified index", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.get(0)).to.equal(Person.Alice);
            expect(collection.get(1)).to.equal(Person.Mirei);
        });
        test("should throw an error if the index is out of bounds", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            expect(() => collection.get(1)).to.throw();
        });
    });
    describe("#insert()", () => {
        test("should insert an element at the specified index", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            collection.insert(1, Person.Hanyuu);
            expect(collection.size()).to.equal(3);
            expect(collection.length).to.equal(3);
            expect(collection.contains(Person.Hanyuu)).to.be.true;
        });
        test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.insert(1, Person.Hanyuu);
            expect(eventRaised).to.be.true;
        });
        test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Add);
                expect(args.newItems.toArray()).to.deep.equal([Person.Hanyuu]);
            };
            collection.insert(1, Person.Hanyuu);
            expect(eventRaised).to.be.true;
        });
    });
    describe("#isEmpty()", () => {
        test("should return true if the collection is empty", () => {
            const collection = new ObservableCollection<Person>();
            expect(collection.isEmpty()).to.be.true;
        });
        test("should return false if the collection is not empty", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            expect(collection.isEmpty()).to.be.false;
        });
    });
    describe("#move()", () => {
        test("should move an element to the specified index", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            collection.move(0, 1);
            expect(collection.get(0)).to.equal(Person.Mirei);
            expect(collection.get(1)).to.equal(Person.Alice);
        });
        test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.move(0, 1);
            expect(eventRaised).to.be.true;
        });
        test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Move);
                expect(args.newItems.toArray()).to.deep.equal([Person.Alice]);
                expect(args.oldItems.toArray()).to.deep.equal([Person.Alice]);
            };
            collection.move(0, 1);
            expect(eventRaised).to.be.true;
        });
    });
    describe("#remove()", () => {
        test("should remove an element from the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            collection.remove(Person.Alice);
            expect(collection.size()).to.equal(1);
            expect(collection.length).to.equal(1);
            expect(collection.contains(Person.Alice)).to.be.false;
        });
        test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.remove(Person.Alice);
            expect(eventRaised).to.be.true;
        });
        test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Remove);
                expect(args.oldItems.toArray()).to.deep.equal([Person.Alice]);
            };
            collection.remove(Person.Alice);
            expect(eventRaised).to.be.true;
        });
        test("should return false if the element was not in the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.remove(Person.Hanyuu)).to.be.false;
        });
    });
    describe("#removeAt()", () => {
        test("should remove an element from the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            collection.removeAt(0);
            expect(collection.size()).to.equal(1);
            expect(collection.length).to.equal(1);
            expect(collection.contains(Person.Alice)).to.be.false;
        });
        test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.removeAt(0);
            expect(eventRaised).to.be.true;
        });
        test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Remove);
                expect(args.oldItems.toArray()).to.deep.equal([Person.Alice]);
            };
            collection.removeAt(0);
            expect(eventRaised).to.be.true;
        });
    });
    describe("#set()", () => {
        test("should set an element at the specified index", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            collection.set(0, Person.Hanyuu);
            expect(collection.get(0)).to.equal(Person.Hanyuu);
        });
        test("should raise the collectionChanged event", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
            };
            collection.set(0, Person.Hanyuu);
            expect(eventRaised).to.be.true;
        });
        test("should raise the collectionChanged event with the correct arguments", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            let eventRaised = false;
            collection.collectionChanged = (sender, args) => {
                eventRaised = true;
                expect(args.action).to.equal(CollectionChangedAction.Replace);
                expect(args.newItems.toArray()).to.deep.equal([Person.Hanyuu]);
                expect(args.oldItems.toArray()).to.deep.equal([Person.Alice]);
            };
            collection.set(0, Person.Hanyuu);
            expect(eventRaised).to.be.true;
        });
    });
    describe("#size()", () => {
        test("should return the number of elements in the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.size()).to.equal(2);
            expect(collection.length).to.equal(2);
            expect(collection.count()).to.equal(2);
        });
    });
    describe("#get comparator()", () => {
        test("should return the comparator", () => {
            const comparator = (a: Person, b: Person) => a.age === b.age;
            const collection = new ObservableCollection<Person>(Enumerable.empty(), comparator);
            expect(collection.comparator).to.equal(comparator);
        });
    });
    describe("#get length", () => {
        test("should return the number of elements in the collection", () => {
            const collection = new ObservableCollection<Person>();
            collection.add(Person.Alice);
            collection.add(Person.Mirei);
            expect(collection.length).to.equal(2);
            expect(collection.size()).to.equal(2);
            expect(collection.count()).to.equal(2);
        });
    });
});
