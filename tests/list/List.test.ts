import {List} from "../../src/list/List";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {IList} from "../../src/list/IList";

describe("List", () => {
    const person: Person = new Person("Alice", "Rivermist", 23);
    const person2: Person = new Person("Mel", "Bluesky", 9);
    const person3: Person = new Person("Senna", "Hikaru", 10);
    const person4: Person = new Person("Lenka", "Polakova", 16);
    const person5: Person = new Person("Jane", "Green", 16);
    describe("[static] #from", () => {
        const list = List.from([person, person2, person3, person4, person5]);
        it("should be a list", () => {
            expect(list instanceof List).to.eq(true);
        });
        it("should have the size of 5", () => {
            expect(list.size()).to.eq(5);
        });
        it("should contain all five people", () => {
            const names = [person.Name, person2.Name, person3.Name, person4.Name, person5.Name];
            let index = 0;
            for (const p of list) {
                expect(p.Name).to.eq(names[index]);
                index++;
            }
        });
    });
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
    describe("#aggregate()", () => {
        it("should return 6", () => {
            const list = List.from([4, 8, 8, 3, 9, 0, 7, 8, 2]);
            const result = list.aggregate((total, next) => next % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(6);
        });
        it("should return pomegranate", () => {
            const list = List.from(["apple", "mango", "orange", "pomegranate", "grape"]);
            const result = list.aggregate((longest, next) => next.length > longest.length ? next : longest, "banana");
            expect(result).to.eq("pomegranate");
        });
        it("should return 10", () => {
            const list = List.from([1,2,3,4]);
            const result = list.aggregate<number>((total, num) => total += num);
            expect(result).to.eq(10);
        });
        it("should throw error ['accumulator is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.aggregate(null)).to.throw("accumulator is null.");
        });
        it("should throw error if list is empty and no seed is provided", () => {
            const list = List.from<number>([]);
            expect(() => list.aggregate<number>((acc, num) => acc *= num)).to.throw("Sequence contains no elements.");
        });
        it("should return the seed if list is empty", () => {
            const list = List.from<number>([]);
            const result = list.aggregate<number>((total, num) => total += num, -99);
            expect(result).to.eq(-99);
        });
    });
    describe("#all()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(null);
        list.add(person5);
        it("should not have any people younger than 9", () => {
            const all = list.all(p => !p ? true : p.Age >= 9);
            expect(all).to.eq(true);
        });
        it("should have people whose names start with an uppercase letter", () => {
            const all = list.any(p => !p ? true : p.Name.charAt(0).toUpperCase() === p.Name.charAt(0));
            expect(all).to.eq(true);
        });
        it("should have no null items", () => {
            const all = list.all(p => p != null);
            expect(all).to.eq(false);
        });
        it("should return true if no predicate is provided", () => {
            const list2 = new List<number>();
            list2.add(1);
            const any = list2.all();
            expect(any).to.eq(true);
        });
        it("should return false if no predicate is provided and list is empty", () => {
            const emptyList = new List<number>();
            const any = emptyList.all();
            expect(any).to.eq(false);
        });
    });
    describe("#append()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person2);
        list.add(person3);
        it("should have two elements", () => {
            expect(list.Count).to.eq(2);
        });
        it("should return a new list", () => {
            const newList = list.append(person4).toList();
            expect(list.Count).to.eq(2);
            expect(newList.Count).to.eq(3);
        });
        it("should not have the appended item in the old list", () => {
            const newList = list.append(person4).toList();
            expect(newList.includes(person4)).to.eq(true);
            expect(list.includes(person4)).to.eq(false);
        });
    });
    describe("#any()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(person3);
        list.add(null);
        list.add(person5);
        it("should have a person with age '9'", () => {
            const any = list.any(p => p.Age === 9);
            expect(any).to.eq(true);
        });
        it("should not have people whose names start with 'T'", () => {
            const any = list.any(p => p?.Name.startsWith("T"));
            expect(any).to.eq(false);
        });
        it("should have null", () => {
            const any = list.any(p => p == null);
            expect(any).to.eq(true);
        });
        it("should return true if no predicate is provided", () => {
            const list2 = new List<number>();
            list2.add(1);
            const any = list2.any();
            expect(any).to.eq(true);
        });
        it("should return false if no predicate is provided and list is empty", () => {
            const emptyList = new List<number>();
            const any = emptyList.any();
            expect(any).to.eq(false);
        });
    });
    describe("#asEnumerable()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        it("should return itself as an enumerable", () => {
            expect(list.asEnumerable() === list).to.eq(true);
        });
    });
    describe("#average()", () => {
        it("should return 99948748093", () => {
            const list = List.from(["10007", "37", "299846234235"]);
            const avg = list.average(s => parseInt(s, 10));
            expect(avg).to.eq(99948748093);
        });
        it("should throw error ['predicate is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.average(null)).to.throw("predicate is null.");
        });
        it("should use non-transformed values if predicate is not provided.", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(list.average()).to.eq(28);
        });
        it("should throw error if list is empty", () => {
            const list = List.from<string>([]);
            expect(() => list.average(s => parseInt(s, 10))).to.throw("Sequence contains no elements.");
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
        const list = List.from([1,3,5,6,7,8,9,2,0,-1,99,-99]);
        const personList = List.from([person, person2, person3]);
        const personComparator = (p1: Person, p2: Person) => p1.Name.localeCompare(p2.Name)
        it("should contain -1", () => {
            expect(list.contains(-1)).to.eq(true);
        });
        it("should not contain -77", () => {
            expect(list.contains(-77)).to.eq(false);
        });
        it("should contain person 'Alice'", () => {
            expect(personList.contains(person, personComparator)).to.eq(true);
        });
        it("should not contain person 'Lenka'", () => {
            expect(personList.contains(person4, personComparator)).to.eq(false);
        });
    });
    describe("#count()", () => {
        it("should return 2", () => {
            const list: IList<Person> = new List<Person>();
            list.add(person);
            list.add(person2);
            expect(list.count()).to.equal(2);
        });
        it("should return 0", () => {
            const list: IList<Person> = new List<Person>();
            list.add(person);
            list.add(person2);
            list.clear();
            expect(list.count()).to.equal(0);
        });
        it("should return 5", () => {
            const list = List.from([1,9,2,8,3,7,4,6,5,0]);
            const count = list.count(n => n < 5);
            expect(count).to.eq(5);
        });
    });
    describe("#defaultIfEmpty()", () => {
        it("should return the list itself if it has elements", () => {
            const list: IList<Person> = new List<Person>();
            list.add(person);
            list.add(person2);
            expect(list.defaultIfEmpty() === list).to.eq(true);
        });
        it("should return a new IEnumerable with the default values", () => {
            const list: IList<number> = new List();
            const newList = list.defaultIfEmpty(7).toList();
            const single = list.defaultIfEmpty(1).single();
            expect(newList instanceof List).to.eq(true);
            expect(newList.size()).to.eq(1);
            expect(newList.get(0)).to.eq(7);
            expect(single).to.eq(1);
        });
    });
    describe("#distinct()", () => {
        it("should remove duplicate elements", () => {
            const list = List.from([person, person2, person, person2, person3]);
            const distinct = list.distinct((p1, p2) => p1.Name.localeCompare(p2.Name));
            expect(distinct.toArray()).to.deep.equal([person, person2, person3]);
        });
        it("should use default comparator if no comparator is provided", () => {
            const list1 = List.from([1,2,3,1,1,1,4,5,4,3]);
            const list2 = List.from(["Alice", "Vanessa", "Misaki", "Alice", "Misaki", "Megumi", "Megumi"]);
            const distinct1 = list1.distinct().toArray();
            const distinct2 = list2.distinct().toArray();
            expect(distinct1).to.deep.equal([1,2,3,4,5]);
            expect(distinct2).to.deep.equal(["Alice", "Vanessa", "Misaki", "Megumi"]);
        });
    });
    describe("#elementAt()", () => {
        const list = List.from([1, 48, 6, 195, 47]);
        it("should return 48", () => {
            const item = list.elementAt(1);
            expect(item).to.eq(48);
        });
        it("should throw error if index is out of bounds", () => {
            expect(() => list.elementAt(100)).to.throw();
            expect(() => list.elementAt(-1)).to.throw();
        });
    });
    describe("#elementAtOrDefault()", () => {
        const list = List.from([1, 48, 6, 195, 47]);
        it("should return 48", () => {
            const item = list.elementAtOrDefault(1);
            expect(item).to.eq(48);
        });
        it("should return if index is out of bounds", () => {
            const upper = list.elementAtOrDefault(100);
            const lower = list.elementAtOrDefault(-1);
            expect(upper).to.eq(null);
            expect(lower).to.eq(null);
        });
    });
    describe("#except()", () => {
        it("should return an array of [1,2,3]", () => {
            const list1 = List.from([1,2,3,4,5]);
            const list2 = List.from([4,5,6,7,8]);
            const elist = list1.except(list2).toList();
            expect(elist.toArray()).to.deep.equal([1,2,3]);
        });
        it("should only have 'Alice' and 'Senna'", () => {
            const list1 = List.from([person, person2, person3, person4, person5]);
            const list2 = List.from([person2, person4, person5]);
            const elist = list1.except(list2, (p1, p2) => p1.Name.localeCompare(p2.Name));
            expect(elist.toArray()).to.deep.equal([person, person3]);
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
    describe("#first()", () => {
        it("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.first()).to.throw("Sequence contains no elements.");
        });
        it("should return the first element if no predicate is provided.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            const first = list.first();
            expect(first).to.eq(99);
        });
        it("should throw an error if no matching element is found.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            expect(() => list.first(n => n < 0)).to.throw("Sequence contains no matching element.");
        });
        it("should return a person with name 'Alice'", () => {
            const list = List.from([person2, person, person5]);
            const first = list.first(p => p.Name === "Alice");
            expect(first.Name).to.eq("Alice");
        });
    });
    describe("#firstOrDefault()", () => {
        it("should return null if list is empty()", () => {
            const list = new List<number>();
            expect(list.firstOrDefault()).to.eq(null);
        });
        it("should return the first element if no predicate is provided.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            const first = list.firstOrDefault();
            expect(first).to.eq(99);
        });
        it("should return null if no matching element is found.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            expect(list.firstOrDefault(n => n < 0)).to.eq(null);
        });
        it("should return a person with name 'Alice'", () => {
            const list = List.from([person2, person, person5]);
            const first = list.firstOrDefault(p => p.Name === "Alice");
            expect(first.Name).to.eq("Alice");
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
    describe("#includes()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person);
        list.add(person2);
        list.add(null);
        it("should have person2", () => {
            var contains = list.includes(person2);
            expect(contains).to.eq(true);
        });
        it("should not have person3", () => {
            var contains = list.includes(person3);
            expect(contains).to.eq(false);
        });
        it("should have null", () => {
            var contains = list.includes(null);
            expect(contains).to.eq(true);
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
    describe("#last()", () => {
        it("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.last()).to.throw("Sequence contains no elements.");
        });
        it("should return the last element if no predicate is provided.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            const last = list.last();
            expect(last).to.eq(5);
        });
        it("should throw an error if no matching element is found.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            expect(() => list.last(n => n < 0)).to.throw("Sequence contains no matching element.");
        });
        it("should return 87", () => {
            const list = List.from([9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 67, 12, 19]);
            const last = list.last(p => p > 80);
            expect(last).to.eq(87);
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
    describe("#lastOrDefault()", () => {
        it("should return null if list is empty()", () => {
            const list = new List<number>();
            expect(list.lastOrDefault()).to.eq(null);
        });
        it("should return the last element if no predicate is provided.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            const first = list.lastOrDefault();
            expect(first).to.eq(5);
        });
        it("should return null if no matching element is found.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            expect(list.lastOrDefault(n => n < 0)).to.eq(null);
        });
        it("should return 87", () => {
            const list = List.from([9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 67, 12, 19]);
            const last = list.lastOrDefault(p => p > 80);
            expect(last).to.eq(87);
        });
    });
    describe("#max()", () => {
        const list = List.from([43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011]);
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.max(null)).to.throw("predicate is null.");
        });
        it("should return 2312", () => {
            const max = list.max(n => n);
            expect(max).to.eq(2312);
        });
        it("should return 23", () => {
            const personList = List.from([person, person2, person3, person4, person5]);
            const max = personList.max(p => p.Age);
            expect(max).to.eq(23);
        });
    });
    describe("#min()", () => {
        const list = List.from([43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011]);
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.min(null)).to.throw("predicate is null.");
        });
        it("should return 1", () => {
            const max = list.min(n => n);
            expect(max).to.eq(1);
        });
        it("should return 9", () => {
            const personList = List.from([person, person2, person3, person4, person5]);
            const max = personList.min(p => p.Age);
            expect(max).to.eq(9);
        });
    });
    describe("#prepend()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(person2);
        list.add(person3);
        it("should have two elements", () => {
            expect(list.Count).to.eq(2);
        });
        it("should return a new list", () => {
            const newList = list.prepend(person4).toList();
            expect(list.Count).to.eq(2);
            expect(newList.Count).to.eq(3);
        });
        it("should have the item at the beginning of the list", () => {
            const newList = list.prepend(person4).toList();
            const first = newList.get(0);
            expect(first).to.eq(person4);
        });
        it("should not have the appended item in the old list", () => {
            const newList = list.prepend(person4).toList();
            expect(newList.includes(person4)).to.eq(true);
            expect(list.includes(person4)).to.eq(false);
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
            const r = list.remove(person4);
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
            expect(() => list.removeRange(1, 4)).to.throw(`index and count do not denote a valid range of elements in the list.`);
        });
        it("should set the count to 2 after remove", () => {
            list.removeRange(1, 2);
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
    describe("#repeat()", () => {
        it("should throw error if count is less than zero", () => {
            expect(() => new List().repeat("xyz", -1)).to.throw();
        });
        it("should create an IEnumerable with a length of 5 and filled with element '5'", () => {
            const list = new List().repeat(5, 5).toList();
            expect(list.size()).to.eq(5);
            for (const item of list) {
                expect(item).to.eq(5);
            }
        });
    })
    describe("#reverse()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person);
        list.add(person4);
        list.add(person3);
        list.add(null);
        list.add(person2);
        it("should have a person with the surname 'Rivermist' at the end.", () => {
            const list2 = list.reverse().toList();
            const last = list2.get(list2.size() - 1);
            expect(last.Surname).to.eq("Rivermist");
        });
        it("should not modify the original list", () => {
            const list = List.from([1, 2, 3, 4, 5]);
            const list2 = list.reverse().toList();
            expect(list.get(0)).to.eq(list2.get(4));
            expect(list.get(1)).to.eq(list2.get(3));
            expect(list.get(2)).to.eq(list2.get(2));
            expect(list.get(3)).to.eq(list2.get(1));
            expect(list.get(4)).to.eq(list2.get(0));
        });
    });
    describe("#select()", () => {
        it("should throw error ['predicate is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.select(null)).to.throw("predicate is null.");
        });
        it("should return an IEnumerable with elements [4, 25, 36, 81]", () => {
            const list = List.from([2, 5, 6, 9]);
            const list2 = list.select(n => Math.pow(n, 2)).toList();
            expect(list2.size()).to.eq(4);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(25);
            expect(list2.get(2)).to.eq(36);
            expect(list2.get(3)).to.eq(81);
        });
        it("should return an IEnumerable with elements [125, 729]", () => {
            const list = List.from([2, 5, 6, 9]);
            const list2 = list.where(n => n % 2 !== 0).select(n => Math.pow(n, 3)).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(125);
            expect(list2.get(1)).to.eq(729);
        });
    });
    describe("#selectMany()", () => {
        it("should throw error ['predicate is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.selectMany(null)).to.throw("predicate is null.");
        });
        it("should return a flattened array of ages #1", () => {
            const people: Person[] = [];
            const viola = new Person("Viola", "Ringale", 28);
            const rebecca = new Person("Rebecca", "Ringale", 17);
            const jisu = new Person("Jisu", "", 14);
            const vanessa = new Person("Vanessa", "Bloodboil", 20);
            viola.FriendsArray = [rebecca];
            jisu.FriendsArray = [person, person2];
            vanessa.FriendsArray = [viola, rebecca, jisu, person];
            rebecca.FriendsArray = [viola];
            people.push(viola);
            people.push(rebecca);
            people.push(jisu);
            people.push(vanessa);
            const peopleList = List.from(people);
            const friends = peopleList.selectMany(p => p.FriendsArray).select(p => p.Age).toArray();
            expect(friends).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
        });
        it("should return a flattened array of ages #2", () => {
            const people: Person[] = [];
            const viola = new Person("Viola", "Ringale", 28);
            const rebecca = new Person("Rebecca", "Ringale", 17);
            const jisu = new Person("Jisu", "", 14);
            const vanessa = new Person("Vanessa", "Bloodboil", 20);
            viola.FriendsList = List.from([rebecca]);
            jisu.FriendsList = List.from([person, person2]);
            vanessa.FriendsList = List.from([viola, rebecca, jisu, person]);
            rebecca.FriendsList = List.from([viola]);
            people.push(viola);
            people.push(rebecca);
            people.push(jisu);
            people.push(vanessa);
            const peopleList = List.from(people);
            const friends = peopleList.selectMany(p => p.FriendsList).select(p => p.Age).toArray();
            expect(friends).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
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
    describe("#single()", () => {
        it("should throw error if list is empty.", () => {
            const list: IList<Person> = new List();
            expect(() => list.single()).to.throw("Sequence contains no elements.");
        });
        it("should throw error if list has more than two elements", () => {
            const list: IList<Person> = new List();
            list.add(person);
            list.add(person3);
            list.add(person5);
            expect(() => list.single()).to.throw("Sequence contains more than one element.");
        });
        it("should return the only element in the list", () => {
            const list: IList<Person> = new List();
            list.add(person);
            const single = list.single();
            expect(single).to.eq(person);
        });
        it("should throw error if no matching element is found.", () => {
            const list: IList<Person> = new List();
            list.add(person);
            list.add(person3);
            list.add(person5);
            expect(() => list.single(p => p.Name === "Lenka")).to.throw("Sequence contains no matching element.");
        });
        it("should return person with name 'Alice'.", () => {
            const list: IList<Person> = new List();
            list.add(person);
            list.add(person3);
            list.add(person5);
            const single = list.single(p => p.Name === "Alice");
            expect(single.Name).to.eq("Alice");
            expect(single).to.eq(person);
        });

    });
    describe("#singleOrDefault()", () => {
        const list: IList<number> = new List();
        list.add(1);
        list.add(2);
        list.add(3);
        it("should return null if the list is empty", () => {
            const list2: IList<number> = new List();
            const sod1 = list2.singleOrDefault();
            const sod2 = list2.singleOrDefault(n => n > 0);
            expect(sod1).to.eq(null);
            expect(sod2).to.eq(null);
        });
        it("should return 3", () => {
            const item = list.singleOrDefault(n => n === 3);
            expect(item).to.eq(3);
        });
        it("should throw error ['Sequence contains more than one matching element.']", () => {
            list.add(3);
            expect(() => list.singleOrDefault(n => n === 3)).to.throw("Sequence contains more than one matching element.");
        });
        it("should return the only element in the list", () => {
            const list2: IList<string> = new List();
            list2.add("Suzuha");
            const sod = list2.singleOrDefault();
            expect(sod).to.eq("Suzuha");
        });
        it("should throw error ['Sequence contains more than one element.']", () => {
            const list2: IList<string> = new List();
            list2.add("Suzuha");
            list2.add("Suzuri");
            expect(() => list2.singleOrDefault()).to.throw("Sequence contains more than one element.");
        });
        it("should return default value [null] if no matching element is found.", () => {
            const sod = list.singleOrDefault(n => n < 0);
            expect(sod).to.eq(null);
        });
    });
    describe("#skip()", () => {
        const list = List.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return a list with elements [5,6,7]", () => {
            const list2 = list.skip(4).toList();
            console.log(list2.toArray());
            expect(list2.get(0)).to.eq(5);
            expect(list2.get(1)).to.eq(6);
            expect(list2.get(2)).to.eq(7);
        });
        it("should return an unchanged list if no parameter is given", () => {
            const list2 = list.skip().toList();
            expect(list.Count).to.eq(list2.size());
            expect(list2.get(0)).to.eq(list.get(0));
            expect(list2.get(1)).to.eq(list.get(1));
            expect(list2.get(2)).to.eq(list.get(2));
            expect(list2.get(3)).to.eq(list.get(3));
            expect(list2.get(4)).to.eq(list.get(4));
            expect(list2.get(5)).to.eq(list.get(5));
            expect(list2.get(6)).to.eq(list.get(6));
        });
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skip(100).toList();
            expect(list2.size()).to.eq(0);
        });
    });
    describe("#skipLast()", () => {
        const list = List.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return a list with elements [1,2,3]", () => {
            const list2 = list.skipLast(4).toList();
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
        });
        it("should return an unchanged list if no parameter is given", () => {
            const list2 = list.skipLast().toList();
            expect(list.Count).to.eq(list2.size());
            expect(list2.get(0)).to.eq(list.get(0));
            expect(list2.get(1)).to.eq(list.get(1));
            expect(list2.get(2)).to.eq(list.get(2));
            expect(list2.get(3)).to.eq(list.get(3));
            expect(list2.get(4)).to.eq(list.get(4));
            expect(list2.get(5)).to.eq(list.get(5));
            expect(list2.get(6)).to.eq(list.get(6));
        });
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skipLast(100).toList();
            expect(list2.size()).to.eq(0);
        });
    });
    describe("#skipWhile()", () => {
        const list = List.from([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500]);
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.skipWhile(null)).to.throw("predicate is null.");
        });
        it("should return an IEnumerable with elements [4000, 1500, 5500]", () => {
            const list2 = list.skipWhile((n, nx) => n > nx * 1000).toList();
            expect(list2.get(0)).to.eq(4000);
            expect(list2.get(1)).to.eq(1500);
            expect(list2.get(2)).to.eq(5500);
            expect(list2.count()).to.eq(3);
        });
    });
    describe("#sort()", () => {
        const list: List<Person> = new List<Person>();
        list.add(person2);
        list.add(person4);
        list.add(null);
        list.add(person);
        it("should have Alice at the end", () => {
            list.sort((p1, p2) => !p1 || !p2 ? 1 : p1.Age > p2.Age ? 1 : -1);
            expect(list.get(list.size() - 1).Name).to.eq("Alice");
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
    describe("#sum()", () => {
        it("should throw error ['predicate is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.sum(null)).to.throw("predicate is null.");
        });
        it("should return 21", () => {
            const list = List.from([1, 2, 3, 4, 5, 6]);
            const sum = list.sum(n => n);
            expect(sum).to.eq(21);
        });
    });
    describe("#take()", () => {
        const list = List.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return an empty IEnumerable", () => {
            const list2 = list.take(0).toList();
            const list3 = list.take(-1).toList();
            expect(list2.isEmpty()).to.eq(true);
            expect(list3.isEmpty()).to.eq(true);
        });
        it("should return a list with elements [1,2,3]", () => {
            const list2 = list.take(3).toList();
            expect(list2.count()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
        });
        it("should return all elements if count is bigger than list size", () => {
            const list2 = list.take(100).toList();
            expect(list.Count).to.eq(list2.size());
            expect(list2.get(0)).to.eq(list.get(0));
            expect(list2.get(1)).to.eq(list.get(1));
            expect(list2.get(2)).to.eq(list.get(2));
            expect(list2.get(3)).to.eq(list.get(3));
            expect(list2.get(4)).to.eq(list.get(4));
            expect(list2.get(5)).to.eq(list.get(5));
            expect(list2.get(6)).to.eq(list.get(6));
        });
    });
    describe("#takeLast()", () => {
        const list = List.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return an empty IEnumerable", () => {
            const list2 = list.takeLast(0).toList();
            const list3 = list.takeLast(-1).toList();
            expect(list2.isEmpty()).to.eq(true);
            expect(list3.isEmpty()).to.eq(true);
        });
        it("should return a list with elements [5,6,7]", () => {
            const list2 = list.takeLast(3).toList();
            expect(list2.count()).to.eq(3);
            expect(list2.get(0)).to.eq(5);
            expect(list2.get(1)).to.eq(6);
            expect(list2.get(2)).to.eq(7);
        });
        it("should return all elements if count is bigger than list size", () => {
            const list2 = list.takeLast(100).toList();
            expect(list.Count).to.eq(list2.size());
            expect(list2.get(0)).to.eq(list.get(0));
            expect(list2.get(1)).to.eq(list.get(1));
            expect(list2.get(2)).to.eq(list.get(2));
            expect(list2.get(3)).to.eq(list.get(3));
            expect(list2.get(4)).to.eq(list.get(4));
            expect(list2.get(5)).to.eq(list.get(5));
            expect(list2.get(6)).to.eq(list.get(6));
        });
    });
    describe("#takeWhile()", () => {
        const list = List.from(["apple", "banana", "mango", "orange", "plum", "grape"]);
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.takeWhile(null)).to.throw("predicate is null.");
        });
        it("should return an IEnumerable with elements [apple, banana, mango]", () => {
            const list2 = list.takeWhile(f => f.localeCompare("orange") !== 0).toList();
            expect(list2.get(0)).to.eq("apple");
            expect(list2.get(1)).to.eq("banana");
            expect(list2.get(2)).to.eq("mango");
            expect(list2.count()).to.eq(3);
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
        for (let ix = 0; ix < list.size(); ++ix) {
            personComparer(ix);
        }
    });
    describe("#union()", () => {
        it("should return a set of items from two lists", () => {
            const list1 = List.from([1,2,3,4,5,5,5]);
            const list2 = List.from([4,5,6,7,8,9,7]);
            const union = list1.union(list2, (n1, n2) => n1 - n2);
            expect(union.toArray()).to.deep.equal([1,2,3,4,5,6,7,8,9]);
        });
        it("should use default comparator if no comparator is provided", () => {
            const list1 = List.from(["Alice", "Misaki", "Megumi", "Misaki"]);
            const list2 = List.from(["Alice", "Rei", "Vanessa", "Vanessa", "Yuzuha"]);
            const union = list1.union(list2);
            expect(union.toArray()).to.deep.equal(["Alice", "Misaki", "Megumi", "Rei", "Vanessa", "Yuzuha"]);
        });
    });
    describe("#where()", () => {
        it("should throw error ['predicate is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.where(null)).to.throw("predicate is null.");
        });
        it("should return an IEnumerable with elements [2,5]", () => {
            const list = List.from([2, 5, 6, 99]);
            const list2 = list.where(n => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
        });
    });
    describe("#zip()", () => {
        const numberList = List.from([1,2,3,4]);
        const stringList = List.from(["one", "two", "three"]);
        const numStrList = numberList.zip(stringList, (first: number, second: string) => `${first} ${second}`).toList();
        it("should throw error ['predicate is null.]", () => {
            const list = List.from([2, 5, 6, 99]);
            const list2 = List.from([true, true, false, true]);
            expect(() => list.zip(list2, null)).to.throw("zipper is null.");
        });
        it("should return a zipped list with size of 3", () => {
            expect(numStrList.size()).to.eq(3);
            expect(numStrList.get(0)).to.eq("1 one");
            expect(numStrList.get(1)).to.eq("2 two");
            expect(numStrList.get(2)).to.eq("3 three");
        });
        it("should return a zipped list with size of 2", () => {
            stringList.add("four");
            stringList.add("five");
            const zippedList = numberList.takeWhile(n => n <= 2).zip(stringList, (first: number, second: string) => `${second} ${first}`).toList();
            expect(zippedList.size()).to.eq(2);
            expect(zippedList.get(0)).to.eq("one 1");
            expect(zippedList.get(1)).to.eq("two 2");
        });
    });
    describe("#Count getter", () => {
        const list: IList<string> = new List();
        list.add("Alice");
        list.add("Rei");
        list.add("Misaki");
        it("should have the count of 3", () => {
            expect(list.Count).to.eq(3);
            expect(list.Count).to.eq(list.size());
        });
        it("should have the count of 2", () => {
            list.removeAt(0);
            expect(list.Count).to.eq(2);
            expect(list.Count).to.eq(list.size());
        });
        it("should have the count of 5", () => {
            list.add("Alice");
            list.add("Yuzuha");
            list.add("Megumi");
            expect(list.Count).to.eq(5);
            expect(list.Count).to.eq(list.size());
        });
        it("should throw an error if assigned", () => {
            // @ts-ignore
            expect(() => list.Count = 10).to.throw();
        });
    });
    describe("#for-of loop", () => {
        const list: IList<number> = new List<number>();
        list.add(10);
        list.add(50);
        list.add(22);
        list.add(20);
        const numArray: number[] = [];
        for (const num of list) {
            numArray.push(num);
        }
        it("should have four items", () => {
            expect(numArray.length).to.eq(4);
        });
        it("should loop over the list", () => {
            expect(numArray[0]).to.eq(10);
            expect(numArray[1]).to.eq(50);
            expect(numArray[2]).to.eq(22);
            expect(numArray[3]).to.eq(20);
        });
    });
});
