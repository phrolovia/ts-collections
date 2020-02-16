
import { List } from "../../src/list/List";
import { describe, it } from "mocha";
import { expect } from "chai";
import { Person } from "../models/Person";
import { IList } from "../../src/list/IList";
import { BinarySearchTree } from "../../src/tree/BinarySearchTree";
import { ITree } from "../../src/tree/ITree";
import { BinaryTree } from "../../src/tree/BinaryTree";
import { IDeque } from "../../src/queue/IDeque";

describe("List", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    describe("#add()", () => {
        it("should add element to the list", () => {
            const list: IList<Person> = new List<Person>();
            list.add(person);
            expect(list.get(0)).to.equal(person);
        });
        it("size should be equal to 1", () => {
            const list: List<Person> = new List<Person>();
            list.add(person);
            expect(list.size()).to.equal(1);
        });
    });
    describe("#clear()", () => {
        it("size should be equal to 0", () => {
            const list: IList<Person> = new List<Person>();
            list.add(person);
            list.add(person2);
            list.clear();
            expect(list.size()).to.equal(0);
        });
    });
    describe("#contains()", () => {
        const list: IList<Person> = new List<Person>();
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
            expect(foundPersonsList.size()).to.eq(2);
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
            var foundPerson = list.findLast(p => p && p.Age === 99);
            expect(foundPerson).to.eq(null);
        });
        it("should be null with null item", () => {
            var foundPerson = list.findLast(p => p === null);
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
        it("should increase the age of all people by 1", () => {
            list.forEach(p => p.Age += 1);
            const ages = list.toArray().filter(p => !!p).map(p => p.Age);
            expect(ages).deep.equal([24, 10, 11, 17, 17]);
            list.forEach(p => p.Age -= 1); //restore ages
        });
    });
    describe("#get()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(null);
        list.add(person4);
        list.add(person5);
        it("should throw ArgumentNullException ['index is null.]", () => {
            expect(() => list.get(null)).to.throw("index is null.");
        });
        it("should throw ArgumentOutOfRangeException ['index is less than 0.]", () => {
            expect(() => list.get(-1)).to.throw("index is less than 0.");
        });
        it(`should throw ArgumentOutOfRangeException ['index is greater than ${list.size()}.]`, () => {
            expect(() => list.get(list.size())).to.throw(`index is greater than or equal to ${list.size()}.`);
        });
        it("should equal to a person with name Mel", () => {
            const p = list.get(1);
            expect(p.Name).to.eq("Mel");
        });
        it("should equal to null", () => {
            const p = list.get(3);
            expect(p).to.eq(null);
        });
    });
    describe("#indexOf()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(null);
        list.add(person4);
        it("should return 1", () => {
            const p = list.indexOf(person2);
            expect(p).to.eq(1);
        });
        it("should return 3", () => {
            const p = list.indexOf(null);
            expect(p).to.eq(3);
        });
        it("should return -1", () => {
            const p = list.indexOf(person5);
            expect(p).to.eq(-1);
        });
    });
    describe("#insert()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        it("should throw ArgumentOutOfRangeException ['index is less than 0.]", () => {
            expect(() => list.insert(-1, person2)).to.throw("index is less than 0.");
        });
        it(`should throw ArgumentOutOfRangeException ['index is greater than ${list.size()}.]`, () => {
            expect(() => list.insert(list.size(), person2)).to.throw(`index is greater than or equal to ${list.size()}.`);
        });
        it("should equal to a person with name Mel", () => {
            list.insert(1, person2);
            const p = list.get(1);
            expect(p.Name).to.eq("Mel");
        });
        it("should equal to null", () => {
            list.insert(4, null);
            const p = list.get(4);
            expect(p).to.eq(null);
        });
        it("should have the count of 6", () => {
            expect(list.size()).to.eq(6);
        });
    });
    describe("#lastIndexOf()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        list.add(null);
        list.add(person);
        list.add(person2);
        it("should return 5", () => {
            expect(list.lastIndexOf(person)).to.eq(5);
        });
        it("should return 4", () => {
            expect(list.lastIndexOf(null)).to.eq(4);
        });
    });
    describe("#remove()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        list.add(null);
        list.add(person);
        list.add(person2);
        
        const removed = list.remove(person5);
        it("should return true", () => {
            expect(removed).to.eq(true);
        });
        it("should have the count of 6", () => {
            expect(list.size()).to.eq(6);
        });
        it("should return false", () => {
            const r =list.remove(person4);
            expect(r).to.eq(false);
        });
        it("should return true with null", () => {
            const r = list.remove(null);
            expect(r).to.eq(true);
        });
        it("should have person with name Alice at index 3", () => {
            const p = list.get(3);
            expect(p.Name).to.eq("Alice");
        });
    });
    describe("#removeAll()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person4);
        list.add(null);
        list.add(person3);
        list.add(person2);
        list.add(null);
        list.add(person5);
        it("should throw ArgumentNullException ['predicate is null.]", () => {
            expect(() => list.removeAll(null)).to.throw("predicate is null.");
        });
        var removedCount = list.removeAll(p => p && p.Age < 16);
        it("should remove all people with Age < 16", () => {
            const ages = list.toArray().filter(p => !!p).map(p => p.Age); 
            expect(ages).deep.equal([23, 16, 16]);
        });
        it("should return 2", () => {
            expect(removedCount).to.eq(2);
        });
    });
    describe("#removeAt()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        it("should throw ArgumentOutOfRangeException ['index is less than 0.]", () => {
            expect(() => list.removeAt(-1)).to.throw("index is less than 0.");
        });
        it(`should throw ArgumentOutOfRangeException ['index is greater than ${list.size()}.]`, () => {
            expect(() => list.removeAt(list.size())).to.throw(`index is greater than or equal to ${list.size()}.`);
        });
        it("should equal to a person with name Jane at index 2", () => {
            list.removeAt(2);
            const p = list.get(2);
            expect(p.Name).to.eq("Jane");
        });
        it("should set the count to 2 after remove", () => {
            list.removeAt(2);
            expect(list.size()).to.eq(2);
        });
    });
    describe("#removeRange()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        it("should throw ArgumentOutOfRangeException ['index is less than 0.]", () => {
            expect(() => list.removeRange(-1, 2)).to.throw("index is less than 0.");
        });
        it("should throw ArgumentOutOfRangeException ['index is less than 0.]", () => {
            expect(() => list.removeRange(1, -1)).to.throw("count is less than 0.");
        });
        it(`should throw ArgumentException ['index and count do not denote a valid range of elements in the list.']`, () => {
            expect(() => list.removeRange(1,4)).to.throw(`index and count do not denote a valid range of elements in the list.`);
        });
        it("should set the count to 2 after remove", () => {
            list.removeRange(1,2);
            expect(list.size()).to.eq(2);
        });
        it("should equal to a person with name Jane at index 1", () => {
            const p = list.get(1);
            expect(p.Name).to.eq("Jane");
        });
        it("should not contain a person with name Senna", () => {
            const p = list.find(p => p.Name === "Senna");
            expect(p).to.eq(null);
        });
    });
    describe("#reverse()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person4);
        list.add(null);
        list.add(person3);
        list.add(person2);
        list.add(null);
        list.add(person5);
        it("should have a person with the surname 'Rivermist' at the end.", () => {
            list.reverse();
            const last = list.get(list.size()-1);
            expect(last.Surname).to.eq("Rivermist");
        });
    });
    describe("#set()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        it("should throw ArgumentOutOfRangeException ['index is less than 0.]", () => {
            expect(() => list.set(-1, person2)).to.throw("index is less than 0.");
        });
        it(`should throw ArgumentOutOfRangeException ['index is greater than or equal to ${list.size()}.]`, () => {
            expect(() => list.set(list.size(), person2)).to.throw(`index is greater than or equal to ${list.size()}.`);
        });
        it("should equal to a person with surname Bluesky at index 2", () => {
            list.set(2, person2);
            const p = list.get(2);
            expect(p.Surname).to.eq("Bluesky");
        });
        it("should not change the count", () => {
            const fc = list.size();
            list.set(0, person4);
            expect(list.size()).to.eq(fc);
        });
    });
    describe("#sort()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person2);
        list.add(person4);
        list.add(null);
        list.add(person);
        it("should have Alice at the end", () => {
            list.sort((p1, p2) => !p1 || !p2 ? 1 : p1.Age > p2.Age ? 1 : -1 );            
            expect(list.get(list.size()-1).Name).to.eq("Alice");
        });
        it("should set the comprarer to default one", () => {
            const numlist: List<number> = new List<number>();
            numlist.add(6);
            numlist.add(-5);
            numlist.add(11);
            numlist.sort();
            expect(numlist.get(0)).to.eq(-5);
            expect(numlist.get(1)).to.eq(6);
            expect(numlist.get(2)).to.eq(11);
        });
    });
    describe("#toArray()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person3);
        list.add(null);
        list.add(person5);
        const array = list.toArray();
        it("should have the same size as list", () => {
            expect(list.size()).to.eq(array.length);
        });
        const personComparer = (ix: number) => {
            it(`should have same person at the index: ${ix}`, () => {
                const p = list.get(ix);
                expect(p).deep.equal(array[ix]);
            });
        };
        for (let ix = 0; ix < list.size(); ++ix){
            personComparer(ix);
        }
    });
    
    describe("#transform()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(person4);
        list.add(person5);
        it("should convert list to a BinarySearchTree", () => {
            const tree = list.transform<BinarySearchTree<Person>>(BinarySearchTree, ((v1, v2) => v1.Age - v2.Age));
            expect(tree instanceof BinarySearchTree).to.eq(true);
        });
        it("should contain four people", () => {
            const tree = list.transform<BinarySearchTree<Person>>(BinarySearchTree, ((v1, v2) => v1.Age - v2.Age));
            expect(tree.size()).to.eq(4); //person4 and person5 has same age, so only one is allowed.
        });
        it("should contain five people", () => {
            const tree = list.transform<BinarySearchTree<Person>>(BinarySearchTree, ((v1, v2) => v1.Name.localeCompare(v2.Name)));
            expect(tree.size()).to.eq(5);
        });
        it("should convert tree to a list", () => {
            const tree = new BinaryTree<Person>((p1: Person, p2: Person) => p1.Age - p2.Age);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person4);
            tree.insert(person3);
            tree.insert(person5);
            const list: IDeque<Person> = tree.transform<List<Person>>(List);
            expect(list instanceof List).to.eq(true);
            expect(list.size()).to.eq(4);
            expect(list.contains(person4)).to.eq(true);
            expect(list.contains(person5)).to.eq(false);
        });
    });
});
