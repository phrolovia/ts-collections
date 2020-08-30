import {List} from "../../src/list/List";
import {describe, it} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {IList} from "../../src/list/IList";
import {School} from "../models/School";
import {Student} from "../models/Student";
import {Pair} from "../models/Pair";
import {SchoolStudents} from "../models/SchoolStudents";

describe("List", () => {
    const alice: Person = new Person("Alice", "Rivermist", 23);
    const jane: Person = new Person("Jane", "Green", 16);
    const jisu = new Person("Jisu", "", 14);
    const karen = new Person("Karen", "Furuya", 10);
    const lenka: Person = new Person("Lenka", "Polakova", 16);
    const mel: Person = new Person("Mel", "Bluesky", 9);
    const rebecca = new Person("Rebecca", "Ringale", 17);
    const reina = new Person("Reina", "Karuizawa", 23);
    const senna: Person = new Person("Senna", "Hikaru", 10);
    const vanessa = new Person("Vanessa", "Bloodboil", 20);
    const viola = new Person("Viola", "Ringale", 28);
    const amy = new Person("Amy", "Rivera", 32);
    const bella = new Person("Bella", "Rivera", 21);
    const emily = new Person("Emily", "Redridge", 25);
    const eliza = new Person("Elizabeth", "Jackson", 19);
    const hanna = new Person("Hanna", "Jackson", 20);
    const hanna2 = new Person("Hanna", "Jackson", 19);
    const julia = new Person("Julia", "Watson", 44);
    const lucrezia = new Person("Lucrezia", "Volpe", 21);
    const megan = new Person("Megan", "Watson", 44);
    const noemi = new Person("Noemi", "Waterfox", 29);
    const noemi2 = new Person("Noemi", "Waterfox", 43);
    const olga = new Person("Olga", "Byakova", 77);
    const priscilla = new Person("Priscilla", "Necci", 9);
    const reika = new Person("Reika", "Kurohana", 37);
    const suzuha = new Person("Suzuha", "Suzuki", 22);
    const suzuha2 = new Person("Suzuha", "Mizuki", 22);
    const suzuha3 = new Person("Suzuha", "Mizuki", 26);
    describe("[static] #from", () => {
        const list = List.from([alice, mel, senna, lenka, jane]);
        it("should be a list", () => {
            expect(list instanceof List).to.eq(true);
        });
        it("should have the size of 5", () => {
            expect(list.size()).to.eq(5);
        });
        it("should contain all five people", () => {
            const names = [alice.Name, mel.Name, senna.Name, lenka.Name, jane.Name];
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
            list.add(alice);
            expect(list.get(0)).to.equal(alice);
        });
        it("size should be equal to 1", () => {
            const list: List<Person> = new List<Person>();
            list.add(alice);
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
            const list = List.from([1, 2, 3, 4]);
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
        list.add(alice);
        list.add(mel);
        list.add(senna);
        list.add(null);
        list.add(jane);
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
        list.add(mel);
        list.add(senna);
        it("should have two elements", () => {
            expect(list.Count).to.eq(2);
        });
        it("should return a new list", () => {
            const newList = list.append(lenka).toList();
            expect(list.Count).to.eq(2);
            expect(newList.Count).to.eq(3);
        });
        it("should not have the appended item in the old list", () => {
            const newList = list.append(lenka).toList();
            expect(newList.includes(lenka)).to.eq(true);
            expect(list.includes(lenka)).to.eq(false);
        });
    });
    describe("#any()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(senna);
        list.add(null);
        list.add(jane);
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
        list.add(alice);
        list.add(mel);
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
            list.add(alice);
            list.add(mel);
            list.clear();
            expect(list.size()).to.equal(0);
        });
    });
    describe("#concat()", () => {
        it("should return a list with [1,2,3,4,5,5,6,7,8,9]", () => {
            const list1 = List.from([1, 2, 3, 4, 5]);
            const list2 = List.from([5, 6, 7, 8, 9]);
            const clist = list1.concat(list2);
            expect(clist.toArray()).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
        });
    });
    describe("#contains()", () => {
        const list = List.from([1, 3, 5, 6, 7, 8, 9, 2, 0, -1, 99, -99]);
        const personList = List.from([alice, mel, senna]);
        const personComparator = (p1: Person, p2: Person) => p1.Name.localeCompare(p2.Name)
        it("should contain -1", () => {
            expect(list.contains(-1)).to.eq(true);
        });
        it("should not contain -77", () => {
            expect(list.contains(-77)).to.eq(false);
        });
        it("should contain person 'Alice'", () => {
            expect(personList.contains(alice, personComparator)).to.eq(true);
        });
        it("should not contain person 'Lenka'", () => {
            expect(personList.contains(lenka, personComparator)).to.eq(false);
        });
    });
    describe("#count()", () => {
        it("should return 2", () => {
            const list: IList<Person> = new List<Person>();
            list.add(alice);
            list.add(mel);
            expect(list.count()).to.equal(2);
        });
        it("should return 0", () => {
            const list: IList<Person> = new List<Person>();
            list.add(alice);
            list.add(mel);
            list.clear();
            expect(list.count()).to.equal(0);
        });
        it("should return 5", () => {
            const list = List.from([1, 9, 2, 8, 3, 7, 4, 6, 5, 0]);
            const count = list.count(n => n < 5);
            expect(count).to.eq(5);
        });
    });
    describe("#defaultIfEmpty()", () => {
        it("should return the list itself if it has elements", () => {
            const list: IList<Person> = new List<Person>();
            list.add(alice);
            list.add(mel);
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
            const list = List.from([alice, mel, alice, mel, senna]);
            const distinct = list.distinct((p1, p2) => p1.Name.localeCompare(p2.Name));
            expect(distinct.toArray()).to.deep.equal([alice, mel, senna]);
        });
        it("should use default comparator if no comparator is provided", () => {
            const list1 = List.from([1, 2, 3, 1, 1, 1, 4, 5, 4, 3]);
            const list2 = List.from(["Alice", "Vanessa", "Misaki", "Alice", "Misaki", "Megumi", "Megumi"]);
            const distinct1 = list1.distinct().toArray();
            const distinct2 = list2.distinct().toArray();
            expect(distinct1).to.deep.equal([1, 2, 3, 4, 5]);
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
            const list1 = List.from([1, 2, 3, 4, 5]);
            const list2 = List.from([4, 5, 6, 7, 8]);
            const elist = list1.except(list2).toList();
            expect(elist.toArray()).to.deep.equal([1, 2, 3]);
        });
        it("should only have 'Alice' and 'Senna'", () => {
            const list1 = List.from([alice, mel, senna, lenka, jane]);
            const list2 = List.from([mel, lenka, jane]);
            const elist = list1.except(list2, (p1, p2) => p1.Name.localeCompare(p2.Name));
            expect(elist.toArray()).to.deep.equal([alice, senna]);
        });
    });
    describe("#exists()", () => {
        const list: List<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(null);
        it("should have person with age 9", () => {
            var exists = list.exists(p => p && p.Age === 9);
            expect(exists).to.eq(true);
        });
        it("should not have person with age 99", () => {
            var exists = list.exists(p => p && p.Age === 99);
            expect(exists).to.eq(false);
        });
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.exists(null)).to.throw("predicate is null.");
        });
    });
    describe("#find()", () => {
        const list: List<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(null);
        it("should be person with age 9", () => {
            var foundPerson = list.find(p => p && p.Age === 9);
            expect(foundPerson.Age).to.eq(mel.Age);
        });
        it("should not have person with age 99", () => {
            var foundPerson = list.find(p => p && p.Age === 99);
            expect(foundPerson).to.eq(null);
        });
    });
    describe("#findAll()", () => {
        const list: List<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(senna);
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
        list.add(alice);
        list.add(lenka);
        list.add(senna);
        list.add(senna);
        list.add(jane);
        list.add(null);
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.findIndex(null)).to.throw("predicate is null.");
        });
        it("should throw error ['startIndex is not a valid index.]", () => {
            expect(() => list.findIndex(p => p.Age > 9, -1)).to.throw("startIndex is not a valid index.");
        });
        it("should throw error ['count is less than 0.]", () => {
            expect(() => list.findIndex(p => p.Age > 9, 1, -7)).to.throw("count is less than 0.");
        });
        it("should throw error ['startIndex and count do not specify a valid section in the list.]", () => {
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
        list.add(alice);
        list.add(lenka);
        list.add(null);
        list.add(senna);
        list.add(mel);
        list.add(null);
        list.add(jane);
        it("should throw error ['predicate is null.]", () => {
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
        list.add(alice);
        list.add(lenka);
        list.add(mel);
        list.add(senna);
        list.add(jane);
        list.add(null);
        it("should throw error ['predicate is null.]", () => {
            expect(() => list.findLastIndex(null)).to.throw("predicate is null.");
        });
        it("should throw error ['startIndex is not a valid index.]", () => {
            expect(() => list.findLastIndex(p => p.Age > 9, -1)).to.throw("startIndex is not a valid index.");
        });
        it("should throw error ['count is less than 0.]", () => {
            expect(() => list.findLastIndex(p => p.Age > 9, 1, -7)).to.throw("count is less than 0.");
        });
        it("should throw error ['startIndex and count do not specify a valid section in the list.]", () => {
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
            const list = List.from([mel, alice, jane]);
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
            const list = List.from([mel, alice, jane]);
            const first = list.firstOrDefault(p => p.Name === "Alice");
            expect(first.Name).to.eq("Alice");
        });
    });
    describe("#forEach()", () => {
        const list: List<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(senna);
        list.add(null);
        list.add(lenka);
        list.add(jane);
        it("should throw error ['predicate is null.]", () => {
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
        list.add(alice);
        list.add(mel);
        list.add(senna);
        list.add(null);
        list.add(lenka);
        list.add(jane);
        it("should throw error ['index is null.]", () => {
            expect(() => list.get(null)).to.throw("index is null.");
        });
        it("should throw error ['index is less than 0.]", () => {
            expect(() => list.get(-1)).to.throw("index is less than 0.");
        });
        it(`should throw error ['index is greater than ${list.size()}.]`, () => {
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
    describe("#groupBy()", () => {
        const list = List.from([alice, mel, senna, lenka, jane, karen, reina]);
        it("should group people by age", () => {
            const group = list.groupBy(p => p.Age).toList();
            const ages: number[] = [];
            const groupedAges: { [age: number]: number[] } = {};
            for (const ageGroup of group) {
                ages.push(ageGroup.key);
                groupedAges[ageGroup.key] ??= [];
                for (const pdata of ageGroup.data) {
                    groupedAges[ageGroup.key].push(pdata.Age);
                }
            }
            expect(ages).to.have.all.members([9, 10, 16, 23]);
            for (const g in groupedAges) {
                const sameAges = groupedAges[g];
                const expectedAges = new Array(sameAges.length).fill(sameAges[0]);
                expect(sameAges).to.deep.equal(expectedAges);
            }
        });
        it("should return people who are younger than 16", () => {
            const kids = list.groupBy(p => p.Age).where(pg => pg.key < 16).selectMany(g => g.data).toArray();
            expect(kids.length).to.eq(3);
            expect(kids).to.have.all.members([karen, mel, senna]);
        });
        it("should use provided comparator", () => {
            const shortNamedPeople = list.groupBy(p => p.Name, (n1, n2) => n1.localeCompare(n2)).where(pg => pg.key.length < 5).selectMany(g => g.data).toArray();
            expect(shortNamedPeople.length).to.eq(2);
            expect(shortNamedPeople).to.have.all.members([mel, jane]);
        });
    });
    describe("#groupJoin()", () => {
        const school1 = new School(1, "Elementary School");
        const school2 = new School(2, "High School");
        const school3 = new School(3, "University");
        const school4 = new School(5, "Academy");
        const desiree = new Student(100, "Desireé", "Moretti", 3);
        const apolline = new Student(200, "Apolline", "Bruyere", 2);
        const giselle = new Student(300, "Giselle", "García", 2);
        const priscilla = new Student(400, "Priscilla", "Necci", 1);
        const lucrezia = new Student(500, "Lucrezia", "Volpe", 4);
        const schools = List.from([school1, school2, school3, school4]);
        const students = List.from([desiree, apolline, giselle, priscilla, lucrezia]);
        it("should join and group by school id", () => {
            const joinedData = schools.groupJoin(students, sc => sc.Id, st => st.SchoolId,
                (schoolId, students) => {
                    return new SchoolStudents(schoolId, students.toList());
                }).orderByDescending(ss => ss.Students.size());
            const finalData = joinedData.toArray();
            const finalOutput: string[] = [];
            for (const sd of finalData) {
                const school = schools.where(s => s.Id === sd.SchoolId).single();
                finalOutput.push(`Students of ${school.Name}: `);
                for (const student of sd.Students) {
                    finalOutput.push(`[${student.Id}] :: ${student.Name} ${student.Surname}`);
                }
            }
            const expectedOutput: string[] = [
                "Students of High School: ",
                "[200] :: Apolline Bruyere",
                "[300] :: Giselle García",
                "Students of Elementary School: ",
                "[400] :: Priscilla Necci",
                "Students of University: ",
                "[100] :: Desireé Moretti",
                "Students of Academy: "
            ];
            expect(finalOutput).to.deep.equal(expectedOutput);
        });
    });
    describe("#includes()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(null);
        it("should have person2", () => {
            var contains = list.includes(mel);
            expect(contains).to.eq(true);
        });
        it("should not have person3", () => {
            var contains = list.includes(senna);
            expect(contains).to.eq(false);
        });
        it("should have null", () => {
            var contains = list.includes(null);
            expect(contains).to.eq(true);
        });
    });
    describe("#indexOf()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(alice);
        list.add(mel);
        list.add(senna);
        list.add(null);
        list.add(lenka);
        it("should return 1", () => {
            const p = list.indexOf(mel);
            expect(p).to.eq(1);
        });
        it("should return 3", () => {
            const p = list.indexOf(null);
            expect(p).to.eq(3);
        });
        it("should return -1", () => {
            const p = list.indexOf(jane);
            expect(p).to.eq(-1);
        });
    });
    describe("#insert()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
        it("should throw error ['index is less than 0.]", () => {
            expect(() => list.insert(-1, mel)).to.throw("index is less than 0.");
        });
        it(`should throw error ['index is greater than ${list.size()}.]`, () => {
            expect(() => list.insert(list.size(), mel)).to.throw(`index is greater than or equal to ${list.size()}.`);
        });
        it("should equal to a person with name Mel", () => {
            list.insert(1, mel);
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
    describe("#intersect()", () => {
        it("should return an array of [4,5]", () => {
            const list1 = List.from([1, 2, 3, 4, 5]);
            const list2 = List.from([4, 5, 6, 7, 8]);
            const elist = list1.intersect(list2).toList();
            expect(elist.toArray()).to.deep.equal([4, 5]);
        });
        it("should only have 'Mel', 'Lenka' and 'Jane'", () => {
            const list1 = List.from([alice, mel, senna, lenka, jane]);
            const list2 = List.from([mel, lenka, jane]);
            const elist = list1.intersect(list2, (p1, p2) => p1.Name.localeCompare(p2.Name));
            expect(elist.toArray()).to.deep.equal([mel, lenka, jane]);
        });
    });
    describe("#join()", () => {
        const school1 = new School(1, "Elementary School");
        const school2 = new School(2, "High School");
        const school3 = new School(3, "University");
        const desiree = new Student(100, "Desireé", "Moretti", 3);
        const apolline = new Student(200, "Apolline", "Bruyere", 2);
        const giselle = new Student(300, "Giselle", "García", 2);
        const priscilla = new Student(400, "Priscilla", "Necci", 1);
        const lucrezia = new Student(500, "Lucrezia", "Volpe", 4);
        const schools = List.from([school1, school2, school3]);
        const students = List.from([desiree, apolline, giselle, priscilla, lucrezia]);
        it("should join students and schools", () => {
            const joinedData = students.join(schools, st => st.SchoolId, sc => sc.Id,
                (student, school) => `${student.Name} ${student.Surname} :: ${school.Name}`).toList();
            const expectedOutputDataList = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
            ];
            expect(joinedData.size()).to.eq(4);
            expect(joinedData.toArray()).to.deep.equal(expectedOutputDataList);
        });
        it("should set null for school if left join is true", () => {
            const joinedData = students.join(schools, st => st.SchoolId, sc => sc.Id,
                (student, school) => [student, school], (stid, scid) => stid - scid, true).toArray();
            for (const jd of joinedData) {
                if ((jd[0] as Student).Surname === "Volpe") {
                    expect(jd[1]).to.eq(null);
                } else {
                    expect(jd[1]).to.not.eq(null);
                }
            }
        });
        it("should join key-value pairs", () => {
            const pairList1 = List.from([new Pair(1, "A"), new Pair(2, "B"), new Pair(3, "C")]);
            const pairList2 = List.from([new Pair(1, "a1"), new Pair(1, "a2"), new Pair(1, "a3"), new Pair(2, "b1"), new Pair(2, "b2")]);
            const joinList = pairList1.join(pairList2, p1 => p1.key, p2 => p2.key, (pair1, pair2) => [pair1.value, pair2.value]);
            const expectedOutput = [
                ["A", "a1"],
                ["A", "a2"],
                ["A", "a3"],
                ["B", "b1"],
                ["B", "b2"]
            ];
            expect(joinList.toArray()).to.deep.equal(expectedOutput);
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
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
        list.add(null);
        list.add(alice);
        list.add(mel);
        it("should return 5", () => {
            expect(list.lastIndexOf(alice)).to.eq(5);
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
            const personList = List.from([alice, mel, senna, lenka, jane]);
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
            const personList = List.from([alice, mel, senna, lenka, jane]);
            const max = personList.min(p => p.Age);
            expect(max).to.eq(9);
        });
    });
    describe("#orderBy()", () => {
        it("should order people by age [asc]", () => {
            const people = List.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderBy(p => p.Age);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });
    describe("#orderByDescending()", () => {
        it("should order people by age [desc]", () => {
            const people = List.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderByDescending(p => p.Age);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });
    describe("#prepend()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(mel);
        list.add(senna);
        it("should have two elements", () => {
            expect(list.Count).to.eq(2);
        });
        it("should return a new list", () => {
            const newList = list.prepend(lenka).toList();
            expect(list.Count).to.eq(2);
            expect(newList.Count).to.eq(3);
        });
        it("should have the item at the beginning of the list", () => {
            const newList = list.prepend(lenka).toList();
            const first = newList.get(0);
            expect(first).to.eq(lenka);
        });
        it("should not have the appended item in the old list", () => {
            const newList = list.prepend(lenka).toList();
            expect(newList.includes(lenka)).to.eq(true);
            expect(list.includes(lenka)).to.eq(false);
        });
    });
    describe("#remove()", () => {
        const list: List<Person> = new List<Person>();
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
        list.add(null);
        list.add(alice);
        list.add(mel);

        const removed = list.remove(jane);
        it("should return true", () => {
            expect(removed).to.eq(true);
        });
        it("should have the count of 6", () => {
            expect(list.size()).to.eq(6);
        });
        it("should return false", () => {
            const r = list.remove(lenka);
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
        list.add(alice);
        list.add(lenka);
        list.add(null);
        list.add(senna);
        list.add(mel);
        list.add(null);
        list.add(jane);
        it("should throw error ['predicate is null.]", () => {
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
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
        it("should throw error ['index is less than 0.]", () => {
            expect(() => list.removeAt(-1)).to.throw("index is less than 0.");
        });
        it(`should throw error ['index is greater than ${list.size()}.]`, () => {
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
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
        it("should throw error ['index is less than 0.]", () => {
            expect(() => list.removeRange(-1, 2)).to.throw("index is less than 0.");
        });
        it("should throw error ['index is less than 0.]", () => {
            expect(() => list.removeRange(1, -1)).to.throw("count is less than 0.");
        });
        it(`should throw error ['index and count do not denote a valid range of elements in the list.']`, () => {
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
        list.add(alice);
        list.add(lenka);
        list.add(senna);
        list.add(null);
        list.add(mel);
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
            viola.FriendsArray = [rebecca];
            jisu.FriendsArray = [alice, mel];
            vanessa.FriendsArray = [viola, rebecca, jisu, alice];
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
            viola.FriendsList = List.from([rebecca]);
            jisu.FriendsList = List.from([alice, mel]);
            vanessa.FriendsList = List.from([viola, rebecca, jisu, alice]);
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
    describe("#sequenceEqual()", () => {
        it("should return false for lists with different sizes", () => {
            const list1 = List.from([1, 2]);
            const list2 = List.from([1, 2, 3]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        it("should return false if lists don't have members in the same order", () => {
            const list1 = List.from([1, 2]);
            const list2 = List.from([2, 1]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        it("should return true if lists have members in the same order", () => {
            const list1 = List.from([1, 2]);
            const list2 = List.from([1, 2]);
            expect(list1.sequenceEqual(list2)).to.eq(true);
        });
        it("should return true if lists have members in the same order", () => {
            const list1 = List.from([alice, mel, lenka]);
            const list2 = List.from([alice, mel, lenka]);
            expect(list1.sequenceEqual(list2, (p1, p2) => p1.Name.localeCompare(p2.Name))).to.eq(true);
        });
    });
    describe("#set()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
        it("should throw error ['index is less than 0.]", () => {
            expect(() => list.set(-1, mel)).to.throw("index is less than 0.");
        });
        it(`should throw error ['index is greater than or equal to ${list.size()}.]`, () => {
            expect(() => list.set(list.size(), mel)).to.throw(`index is greater than or equal to ${list.size()}.`);
        });
        it("should equal to a person with surname Bluesky at index 2", () => {
            list.set(2, mel);
            const p = list.get(2);
            expect(p.Surname).to.eq("Bluesky");
        });
        it("should not change the count", () => {
            const fc = list.size();
            list.set(0, lenka);
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
            list.add(alice);
            list.add(senna);
            list.add(jane);
            expect(() => list.single()).to.throw("Sequence contains more than one element.");
        });
        it("should return the only element in the list", () => {
            const list: IList<Person> = new List();
            list.add(alice);
            const single = list.single();
            expect(single).to.eq(alice);
        });
        it("should throw error if no matching element is found.", () => {
            const list: IList<Person> = new List();
            list.add(alice);
            list.add(senna);
            list.add(jane);
            expect(() => list.single(p => p.Name === "Lenka")).to.throw("Sequence contains no matching element.");
        });
        it("should return person with name 'Alice'.", () => {
            const list: IList<Person> = new List();
            list.add(alice);
            list.add(senna);
            list.add(jane);
            const single = list.single(p => p.Name === "Alice");
            expect(single.Name).to.eq("Alice");
            expect(single).to.eq(alice);
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
        list.add(mel);
        list.add(lenka);
        list.add(null);
        list.add(alice);
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
    describe("#thenBy()", () => {
        it("should order people by age [asc] then by name[asc]", () => {
            const people = List.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderBy(p => p.Age, (a1, a2) => a1 - a2).thenBy(p => p.Name);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const orderedPeopleNames = orderedPeople.select(p => p.Name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = ["Mel", "Karen", "Senna", "Jisu", "Jane", "Lenka", "Rebecca", "Vanessa", "Alice", "Reina", "Viola"];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        it("should order people by age [asc] then by name[asc] then by surname[asc]", () => {
            const people = List.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
            const orderedPeople = people.orderBy(p => p.Age)
                .thenBy(p => p.Name, (n1, n2) => n1.localeCompare(n2))
                .thenBy(p => p.Surname);
            const expectedOrder: string[] = [
                "[9] :: Priscilla Necci",
                "[19] :: Elizabeth Jackson",
                "[19] :: Hanna Jackson",
                "[20] :: Hanna Jackson",
                "[21] :: Bella Rivera",
                "[21] :: Lucrezia Volpe",
                "[22] :: Suzuha Mizuki",
                "[22] :: Suzuha Suzuki",
                "[25] :: Emily Redridge",
                "[26] :: Suzuha Mizuki",
                "[29] :: Noemi Waterfox",
                "[32] :: Amy Rivera",
                "[37] :: Reika Kurohana",
                "[43] :: Noemi Waterfox",
                "[44] :: Julia Watson",
                "[44] :: Megan Watson",
                "[77] :: Olga Byakova"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toList()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const people = List.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
            const orderedPeople = people.orderByDescending(p => p.Age, (a1, a2) => a1 - a2)
                .thenBy(p => p.Name)
                .thenBy(p => p.Surname, (n1, n2) => n1.localeCompare(n2))
                .orderBy(p => p.Age).thenBy(p => p.Name);
            const expectedOrder: string[] = [
                "[9] :: Priscilla Necci",
                "[19] :: Elizabeth Jackson",
                "[19] :: Hanna Jackson",
                "[20] :: Hanna Jackson",
                "[21] :: Bella Rivera",
                "[21] :: Lucrezia Volpe",
                "[22] :: Suzuha Mizuki",
                "[22] :: Suzuha Suzuki",
                "[25] :: Emily Redridge",
                "[26] :: Suzuha Mizuki",
                "[29] :: Noemi Waterfox",
                "[32] :: Amy Rivera",
                "[37] :: Reika Kurohana",
                "[43] :: Noemi Waterfox",
                "[44] :: Julia Watson",
                "[44] :: Megan Watson",
                "[77] :: Olga Byakova"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toList()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#thenByDescending()", () => {
        it("should order people by age [asc] then by name[desc]", () => {
            const people = List.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderBy(p => p.Age).thenByDescending(p => p.Name);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const orderedPeopleNames = orderedPeople.select(p => p.Name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = ["Mel", "Senna", "Karen", "Jisu", "Lenka", "Jane", "Rebecca", "Vanessa", "Reina", "Alice", "Viola"];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        it("should order people by age [desc] then by name[desc] then by surname[desc]", () => {
            const people = List.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
            const orderedPeople = people.orderByDescending(p => p.Age, (a1, a2) => a1 - a2)
                .thenByDescending(p => p.Name)
                .thenByDescending(p => p.Surname, (n1, n2) => n1.localeCompare(n2));
            const expectedOrder: string[] = [
                "[77] :: Olga Byakova",
                "[44] :: Megan Watson",
                "[44] :: Julia Watson",
                "[43] :: Noemi Waterfox",
                "[37] :: Reika Kurohana",
                "[32] :: Amy Rivera",
                "[29] :: Noemi Waterfox",
                "[26] :: Suzuha Mizuki",
                "[25] :: Emily Redridge",
                "[22] :: Suzuha Suzuki",
                "[22] :: Suzuha Mizuki",
                "[21] :: Lucrezia Volpe",
                "[21] :: Bella Rivera",
                "[20] :: Hanna Jackson",
                "[19] :: Hanna Jackson",
                "[19] :: Elizabeth Jackson",
                "[9] :: Priscilla Necci"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toList()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const people = List.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
            const orderedPeople = people.orderByDescending(p => p.Age, (a1, a2) => a1 - a2)
                .thenByDescending(p => p.Name)
                .thenByDescending(p => p.Surname, (n1, n2) => n1.localeCompare(n2))
                .orderBy(p => p.Age).thenBy(p => p.Name);
            const expectedOrder: string[] = [
                "[9] :: Priscilla Necci",
                "[19] :: Elizabeth Jackson",
                "[19] :: Hanna Jackson",
                "[20] :: Hanna Jackson",
                "[21] :: Bella Rivera",
                "[21] :: Lucrezia Volpe",
                "[22] :: Suzuha Suzuki",
                "[22] :: Suzuha Mizuki",
                "[25] :: Emily Redridge",
                "[26] :: Suzuha Mizuki",
                "[29] :: Noemi Waterfox",
                "[32] :: Amy Rivera",
                "[37] :: Reika Kurohana",
                "[43] :: Noemi Waterfox",
                "[44] :: Julia Watson",
                "[44] :: Megan Watson",
                "[77] :: Olga Byakova"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toList()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderByDescending", () => {
            const people = List.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
            const orderedPeople = people.orderByDescending(p => p.Age, (a1, a2) => a1 - a2)
                .thenByDescending(p => p.Name)
                .thenByDescending(p => p.Surname, (n1, n2) => n1.localeCompare(n2))
                .orderByDescending(p => p.Age).thenBy(p => p.Name);
            const expectedOrder: string[] = [
                "[77] :: Olga Byakova",
                "[44] :: Julia Watson",
                "[44] :: Megan Watson",
                "[43] :: Noemi Waterfox",
                "[37] :: Reika Kurohana",
                "[32] :: Amy Rivera",
                "[29] :: Noemi Waterfox",
                "[26] :: Suzuha Mizuki",
                "[25] :: Emily Redridge",
                "[22] :: Suzuha Suzuki",
                "[22] :: Suzuha Mizuki",
                "[21] :: Bella Rivera",
                "[21] :: Lucrezia Volpe",
                "[20] :: Hanna Jackson",
                "[19] :: Elizabeth Jackson",
                "[19] :: Hanna Jackson",
                "[9] :: Priscilla Necci"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toList()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#toArray()", () => {
        const list: IList<Person> = new List<Person>();
        list.add(alice);
        list.add(senna);
        list.add(null);
        list.add(jane);
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
            const list1 = List.from([1, 2, 3, 4, 5, 5, 5]);
            const list2 = List.from([4, 5, 6, 7, 8, 9, 7]);
            const union = list1.union(list2, (n1, n2) => n1 - n2);
            expect(union.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
        const numberList = List.from([1, 2, 3, 4]);
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
