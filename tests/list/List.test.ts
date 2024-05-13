import { Enumerable, ImmutableList, ReadonlyCollection } from "../../src/imports";
import { List } from "../../src/list/List";
import { EqualityComparator } from "../../src/shared/EqualityComparator";
import { ErrorMessages } from "../../src/shared/ErrorMessages";
import { Helper } from "../helpers/Helper";
import { Pair } from "../models/Pair";
import { Person } from "../models/Person";
import { School } from "../models/School";
import { SchoolStudents } from "../models/SchoolStudents";
import { Student } from "../models/Student";

describe("List", () => {
    const personNameComparator = (p1: Person, p2: Person) => p1.name === p2.name;

    describe("#add()", () => {
        const list = new List([1, 2, 3]);
        test("should add element at the end of the list", () => {
            list.add(4);
            expect(list.size()).to.eq(4);
            expect(list.get(3)).to.eq(4);
            expect(list.length).to.eq(4);
        });
    });

    describe("#addAll()", () => {
        test("should add all elements from the second list to this list", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            const list2 = new List([Person.Vanessa, Person.Viola]);
            const personArray = [...list1.toArray(), ...list2.toArray()];
            list1.addAll(list2);
            expect(list1.size()).to.eq(6);
            let index = 0;
            for (const element of list1) {
                expect(element).to.eq(personArray[index++]);
            }
            expect(list1.length).to.eq(6);
        });
        test("should return true if list is changed as a result (and false if not)", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            const list2 = new List([Person.Vanessa, Person.Viola]);
            const list3 = new List<Person>();
            const result = list1.addAll(list2);
            const result2 = list1.addAll(list3);
            expect(result).to.eq(true);
            expect(result2).to.eq(false);
            expect(list1.length).to.eq(6);
        });
    });

    describe("#addAt()", () => {
        test("should throw error if index is out of bounds", () => {
            const list = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            expect(() => list.addAt(Person.Suzuha, -1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.addAt(Person.Suzuha, 5)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.addAt(Person.Bella, 2)).to.not.throw;
            expect(list.length).to.eq(4);
        });
        test("should add the element to the specified index", () => {
            const list = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            list.addAt(Person.Bella, 2);
            expect(list.get(2)).to.eq(Person.Bella);
            expect(list.length).to.eq(5);
        });
        test("should not throw error and add the element if index is equal to size", () => {
            const list = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            expect(() => list.addAt(Person.Bella, 4)).to.not.throw;
            list.addAt(Person.Bella, 4);
            expect(list.size()).to.eq(5);
            expect(list.get(4)).to.eq(Person.Bella);
            expect(list.length).to.eq(5);
        });
    });

    describe("#aggregate()", () => {
        test("should return 6", () => {
            const list = new List([4, 8, 8, 3, 9, 0, 7, 8, 2]);
            const result = list.aggregate((total, next) => next % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(6);
        });
        test("should return pomegranate", () => {
            const list = new List(["apple", "mango", "orange", "pomegranate", "grape"]);
            const result = list.aggregate((longest, next) => next.length > longest.length ? next : longest, "banana");
            expect(result).to.eq("pomegranate");
        });
        test("should return 10", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.aggregate<number>((total, num) => total += num);
            expect(result).to.eq(10);
        });
        test("should throw error if list is empty and no seed is provided", () => {
            const list = new List<number>([]);
            expect(() => list.aggregate<number>((acc, num) => acc *= num)).to.throw(ErrorMessages.NoElements);
        });
        test("should return the seed if list is empty", () => {
            const list = new List<number>([]);
            const result = list.aggregate<number>((total, num) => total += num, -99);
            expect(result).to.eq(-99);
        });
        test("should use provided resultSelector and return 100", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.aggregate<number>((total, num) => total += num, 0, r => Math.pow(r, 2));
            expect(result).to.eq(100);
        });
    });

    describe("#all()", () => {
        const list = new List([Person.Alice, Person.Mel, Person.Senna, null, Person.Jane]);
        test("should not have any people younger than 9", () => {
            const all = list.all(p => !p ? true : p.age >= 9);
            expect(all).to.eq(true);
        });
        test("should have people whose names start with an uppercase letter", () => {
            const all = list.any(p => !p ? true : p.name.charAt(0).toUpperCase() === p.name.charAt(0));
            expect(all).to.eq(true);
        });
        test("should have no null items", () => {
            const all = list.all(p => p != null);
            expect(all).to.eq(false);
        });
    });

    describe("#any()", () => {
        const list = new List([Person.Alice, Person.Mel, Person.Senna, null, Person.Jane]);
        test("should have a person with age '9'", () => {
            const any = list.any(p => p?.age === 9);
            expect(any).to.eq(true);
        });
        test("should not have people whose names start with 'T'", () => {
            const any = list.any(p => p?.name.startsWith("T") === true);
            expect(any).to.eq(false);
        });
        test("should have null", () => {
            const any = list.any(p => p == null);
            expect(any).to.eq(true);
        });
        test("should return true if no predicate is provided and list is not empty", () => {
            const list2 = new List<number>();
            list2.add(1);
            const any = list2.any();
            expect(any).to.eq(true);
        });
        test("should return false if no predicate is provided and list is empty", () => {
            const emptyList = new List<number>();
            const any = emptyList.any();
            expect(any).to.eq(false);
        });
    });

    describe("#append()", () => {
        test("should append the given element to the end of enumerable", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const enumerable = list.append(9);
            const array = enumerable.append(99).toArray();
            const array2 = enumerable.append(777).append(0).toArray();
            expect(list.size()).to.eq(5);
            expect(array.length).to.eq(7);
            expect(array2.length).to.eq(8);
            expect(list.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
            expect(array).to.deep.equal([1, 2, 3, 4, 5, 9, 99]);
            expect(array2).to.deep.equal([1, 2, 3, 4, 5, 9, 777, 0]);
            expect(enumerable.toList().length).to.eq(6);
        });
    });

    describe("#asEnumerable()", () => {
        test("should return an IEnumerable", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const enumerable = list.asEnumerable();
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#average()", () => {
        test("should return 99948748093", () => {
            const list = new List(["10007", "37", "299846234235"]);
            const avg = list.average(s => parseInt(s, 10));
            expect(avg).to.eq(99948748093);
        });
        test("should use non-transformed values if predicate is not provided.", () => {
            const list = new List([2, 5, 6, 99]);
            expect(list.average()).to.eq(28);
        });
        test("should throw error if list is empty", () => {
            const list = new List<string>([]);
            expect(() => list.average(s => parseInt(s, 10))).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#cast()", () => {
        const mixedList = new List([1, 2, 3, "4", "5", "6", 7, 8, 9, "10"]);
        const numbers = mixedList.where(n => typeof n === "number").cast<number>();
        const strings = mixedList.where(s => typeof s === "string").cast<string>();
        test("should return a list of numbers", () => {
            expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9]);
        });
        test("should return a list of strings", () => {
            expect(strings.toArray()).to.deep.equal(["4", "5", "6", "10"]);
        });
    });

    describe("#chunk()", () => {
        test("should split list into chunks of size 10", () => {
            const list = Enumerable.range(1, 100).toList();
            for (const chunk of list.chunk(10)) {
                expect(chunk.count() === 10).to.be.true;
            }
        });
        test("should splits enumerable into chunks of size 5 at max", () => {
            const enumerable = Enumerable.range(1, 100);
            for (const chunk of enumerable.chunk(5)) {
                expect(chunk.count() <= 5).to.be.true;
            }
        });
        test("should throw error if chunk size is 0", () => {
            const list = Enumerable.range(1, 100);
            expect(() => list.chunk(0)).to.throw(ErrorMessages.InvalidChunkSize);
        });
    });

    describe("#clear()", () => {
        const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        test("should remove all elements from the collection", () => {
            list1.clear();
            expect(list1.size()).to.eq(0);
            expect(list1.length).to.eq(0);
        });
    });

    describe("#concat()", () => {
        test("should return a list with [1,2,3,4,5,5,6,7,8,9]", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([5, 6, 7, 8, 9]);
            const clist = list1.concat(list2);
            const array = clist.toArray();
            const array2 = clist.append(-1).toArray();
            expect(array).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
            expect(array2).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9, -1]);
            expect(clist.toList().length).to.eq(10);
        });
    });

    describe("#contains()", () => {
        const list = new List([1, 3, 5, 6, 7, 8, 9, 2, 0, -1, 99, -99]);
        const personList = new List([Person.Alice, Person.Mel, Person.Senna]);
        const personComparator: EqualityComparator<Person> = (p1: Person, p2: Person) => p1.name === p2.name;
        test("should contain -1", () => {
            expect(list.contains(-1)).to.eq(true);
        });
        test("should not contain -77", () => {
            expect(list.contains(-77)).to.eq(false);
        });
        test("should contain person 'Alice'", () => {
            expect(personList.contains(Person.Alice, personComparator)).to.eq(true);
        });
        test("should not contain person 'Lenka'", () => {
            expect(personList.contains(Person.Lenka, personComparator)).to.eq(false);
        });
        test("should run fast with big collections", () => {
            const bigPeopleArray = Helper.generateRandomPerson(200000);
            const searchedPerson = new Person("Mona", "Lumia", 21);
            bigPeopleArray.splice(Helper.generateRandomNumber(0, bigPeopleArray.length - 1), 0, searchedPerson);
            const list = new List(bigPeopleArray);
            const includes = list.contains(searchedPerson, personComparator);
            expect(includes).to.be.true;
        });
    });

    describe("#containsAll()", () => {
        const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        const list2 = new List([Person.Vanessa, Person.Viola]);
        test("should return false if size is smaller than the other list's size", () => {
            expect(list2.containsAll(list1)).to.eq(false);
        });
        test("should return true if list contains all the elements from the other list", () => {
            expect(list1.containsAll(list2)).to.eq(true);
        });
    });

    describe("#count()", () => {
        test("should return 2", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Mel);
            expect(list.count()).to.equal(2);
        });
        test("should return 0", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Mel);
            list.clear();
            expect(list.count()).to.equal(0);
        });
        test("should return 5", () => {
            const list = new List([1, 9, 2, 8, 3, 7, 4, 6, 5, 0]);
            const count = list.count(n => n < 5);
            expect(count).to.eq(5);
        });
        test("should use list's size if predicate is not provided", () => {
            const list = new List([1, 9, 2, 8, 3, 7, 4, 6, 5, 0]);
            const count = list.count();
            expect(count).to.eq(10);
        });
    });

    describe("#defaultIfEmpty()", () => {
        test("should return a new IEnumerable with the default values", () => {
            const list = new List();
            const newList = list.defaultIfEmpty(7).toList();
            const single = list.defaultIfEmpty(1).single();
            expect(newList instanceof List).to.eq(true);
            expect(newList.size()).to.eq(1);
            expect(newList.get(0)).to.eq(7);
            expect(single).to.eq(1);
            expect(newList.length).to.eq(1);
        });
        test("should disregard the given value if list is not empty", () => {
            const list = new List([1]);
            const newList = list.defaultIfEmpty(-1).toList();
            const single = list.defaultIfEmpty(5).single();
            expect(list.size()).to.eq(1);
            expect(list.get(0)).to.eq(1);
            expect(newList.size()).to.eq(1);
            expect(newList.get(0)).to.eq(1);
            expect(single).to.eq(1);
            expect(newList.length).to.eq(1);
        });
    });

    describe("#distinct()", () => {
        test("should remove duplicate elements", () => {
            const list = new List([Person.Alice, Person.Mel, Person.Senna, Person.Mel, Person.Alice]);
            const distinct = list.distinct(p => p.name);
            expect(distinct.toArray()).to.deep.equal([Person.Alice, Person.Mel, Person.Senna]);
            expect(distinct.toList().length).to.eq(3);
        });
        test("should use default comparator if no comparator is provided", () => {
            const list1 = new List([1, 2, 3, 1, 1, 1, 4, 5, 4, 3]);
            const list2 = new List(["Alice", "Vanessa", "Misaki", "Alice", "Misaki", "Megumi", "Megumi"]);
            const distinct1 = list1.distinct().toArray();
            const distinct2 = list2.distinct().toArray();
            expect(distinct1).to.deep.equal([1, 2, 3, 4, 5]);
            expect(distinct2).to.deep.equal(["Alice", "Vanessa", "Misaki", "Megumi"]);
        });
        test("should use provided comparator for key comparison", () => {
            const list2 = new List([Person.Alice, Person.Hanna, Person.Hanna2, Person.Noemi, Person.Noemi2]);
            const distinct2 = list2.distinct(p => p.name, (n1, n2) => n1.localeCompare(n2) === 0).toArray();
            expect(distinct2).to.deep.equal([Person.Alice, Person.Hanna, Person.Noemi]);
        });
    });

    describe("#elementAt()", () => {
        const list = new List([1, 48, 6, 195, 47]);
        test("should return 48", () => {
            const item = list.elementAt(1);
            expect(item).to.eq(48);
        });
        test("should throw error if index is out of bounds", () => {
            expect(() => list.elementAt(100)).to.throw();
            expect(() => list.elementAt(-1)).to.throw();
        });
    });
    describe("#elementAtOrDefault()", () => {
        const list = new List([1, 48, 6, 195, 47]);
        test("should return 48", () => {
            const item = list.elementAtOrDefault(1);
            expect(item).to.eq(48);
        });
        test("should return null if index is out of bounds", () => {
            const upper = list.elementAtOrDefault(100);
            const lower = list.elementAtOrDefault(-1);
            expect(upper).to.eq(null);
            expect(lower).to.eq(null);
        });
    });
    describe("#entries()", () => {
        test("should return an indexed IterableIterator", () => {
            const list = Enumerable.range(1, 100).toList();
            for (const [index, element] of list.entries()) {
                expect(index + 1).to.eq(element);
                expect(list.get(index)).to.eq(element);
            }
        });
    });
    describe("#except()", () => {
        test("should return an array of [1,2,3]", () => {
            const list1 = new List([1, 2, 3, 3, 4, 5]);
            const list2 = new List([4, 5, 6, 7, 8]);
            const elist = list1.except(list2).toList();
            expect(elist.toArray()).to.deep.equal([1, 2, 3]);
            expect(elist.length).to.eq(3);
        });
        test("should return an array of [1,2]", () => {
            const list1 = new List([1, 2, 3, 3, 4, 5]);
            const list2 = new List([3, 4, 5, 6, 7, 8]);
            const elist = list1.except(list2).toList();
            expect(elist.toArray()).to.deep.equal([1, 2]);
        });
        test("should only have 'Alice', 'Noemi' and 'Senna'", () => {
            const list1 = new List([Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]);
            const list2 = new List([Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]);
            const elist = list1.except(list2);
            expect(elist.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Senna]);
        });
        test("should only have 'Alice' and 'Senna'", () => {
            const list1 = new List([Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]);
            const list2 = new List([Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]);
            const elist = list1.except(list2, (p1, p2) => p1.name === p2.name);
            expect(elist.toArray()).to.deep.equal([Person.Alice, Person.Senna]);
        });
        test("should return a set of people unique to first enumerable", () => {
            const list1 = new List<Person>();
            const list2 = new List<Person>();
            for (let px = 0; px < 100000; ++px) {
                const p1 = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90));
                const p2 = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50));
                list1.add(p1);
                list2.add(p2);
            }
            const exceptionList = list1.except(list2, (p1, p2) => p1.age === p2.age);
            const ageCount = exceptionList.count(p => p.age <= 50);
            expect(ageCount).to.eq(0);
        }, {timeout: 10000});
        test("should use order comparator and return a set of people unique to first enumerable #2", () => {
            const list1 = new List<Person>();
            const list2 = new List<Person>();
            for (let px = 0; px < 100000; ++px) {
                const p1 = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90));
                const p2 = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50));
                list1.add(p1);
                list2.add(p2);
            }
            const exceptionList = list1.except(list2, null, (p1, p2) => p1.age - p2.age);
            const ageCount = exceptionList.count(p => p.age <= 50);
            expect(ageCount).to.eq(0);
        }, {timeout: 10000});
    });

    describe("#first()", () => {
        test("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.first()).to.throw(ErrorMessages.NoElements);
        });
        test("should return the first element if no predicate is provided.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            const first = list.first();
            expect(first).to.eq(99);
        });
        test("should throw an error if no matching element is found.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            expect(() => list.first(n => n < 0)).to.throw(ErrorMessages.NoMatchingElement);
        });
        test("should return a person with name 'Alice'", () => {
            const list = new List([Person.Mel, Person.Alice, Person.Jane]);
            const first = list.first(p => p.name === "Alice");
            expect(first.name).to.eq("Alice");
        });
    });

    describe("#firstOrDefault()", () => {
        test("should return null if list is empty()", () => {
            const list = new List<number>();
            expect(list.firstOrDefault()).to.eq(null);
        });
        test("should return the first element if no predicate is provided.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            const first = list.firstOrDefault();
            expect(first).to.eq(99);
        });
        test("should return null if no matching element is found.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            expect(list.firstOrDefault(n => n < 0)).to.eq(null);
        });
        test("should return a person with name 'Alice'", () => {
            const list = new List([Person.Mel, Person.Alice, Person.Jane]);
            const first = list.firstOrDefault(p => p.name === "Alice") as Person;
            expect(first.name).to.eq("Alice");
        });
    });

    describe("#get()", () => {
        const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        test("should throw error if index is out of bounds", () => {
            expect(() => list1.get(-1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list1.get(6)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        });
        test("should return the element at the specified index", () => {
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(5)).to.eq(Person.Viola);
            expect(list1.get(2)).to.eq(Person.Noemi);
        });
    });

    describe("#getRange()", () => {
        const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        test("should throw error if index is out of bounds", () => {
            expect(() => list1.getRange(-1, 3)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list1.getRange(6, 3)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        });
        test("should throw error if length is out of bounds", () => {
            expect(() => list1.getRange(0, 7)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list1.getRange(0, -1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        });
        test("should return the elements at the specified index", () => {
            const range = list1.getRange(1, 3);
            expect(range.toArray()).to.deep.equal([Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            expect(range.length).to.eq(3);
        });
    });

    describe("#groupBy()", () => {
        const list = new List([Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane, Person.Kaori, Person.Reina]);
        test("should group people by age", () => {
            const group = list.groupBy(p => p.age).toList();
            const ages: number[] = [];
            const groupedAges: { [age: number]: number[] } = {};
            for (const ageGroup of group) {
                ages.push(ageGroup.key);
                groupedAges[ageGroup.key] ??= [];
                for (const pdata of ageGroup.source) {
                    groupedAges[ageGroup.key].push(pdata.age);
                }
            }
            expect(ages).to.have.all.members([9, 10, 16, 23]);
            for (const g in groupedAges) {
                const sameAges = groupedAges[g];
                const expectedAges = new Array(sameAges.length).fill(sameAges[0]);
                expect(sameAges).to.deep.equal(expectedAges);
            }
        });
        test("should return people who are younger than 16", () => {
            const kids = list.groupBy(p => p.age).where(pg => pg.key < 16).selectMany(g => g.source).toArray();
            expect(kids.length).to.eq(3);
            expect(kids).to.have.all.members([Person.Kaori, Person.Mel, Person.Senna]);
        });
        test("should use provided comparator", () => {
            const shortNamedPeople = list.groupBy(p => p.name, (n1, n2) => n1 === n2).where(pg => pg.key.length < 5).selectMany(g => g.source).toArray();
            expect(shortNamedPeople.length).to.eq(2);
            expect(shortNamedPeople).to.have.all.members([Person.Mel, Person.Jane]);
        });
        test("should be iterable with for-of loop", () => {
            const groupedPeople = list.groupBy(p => p.name.length);
            const people: Person[] = [];
            const expectedResult = [Person.Alice, Person.Senna, Person.Lenka, Person.Kaori, Person.Reina, Person.Mel, Person.Jane];
            for (const group of groupedPeople) {
                for (const person of group) {
                    people.push(person);
                }
            }
            expect(people).to.deep.equal(expectedResult);
        });
        test("should work with good performance", () => {
            const list = new List<Person>();
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50));
                list.add(p);
            }
            const people: Person[] = [];
            list.groupBy(p => p.age).forEach(g => {
                g.source.orderBy(n => n).forEach(p => people.push(p));
            });
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
        const schools = new List([school1, school2, school3, school4]);
        const students = new List([desiree, apolline, giselle, priscilla, lucrezia]);
        test("should join and group by school id", () => {
            const joinedData = schools.groupJoin(students, sc => sc.id, st => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(school.id, students?.toList() ?? new List<Student>());
                }).orderByDescending(ss => ss.students.size());
            const finalData = joinedData.toArray();
            const finalOutput: string[] = [];
            for (const sd of finalData) {
                const school = schools.where(s => s.id === sd.schoolId).single();
                finalOutput.push(`Students of ${school.name}: `);
                for (const student of sd.students) {
                    finalOutput.push(`[${student.id}] :: ${student.name} ${student.surname}`);
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

    describe("#indexOf", () => {
        const list1 = new List([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        test("should return 2", () => {
            expect(list1.indexOf(null)).to.eq(2);
        });
        test("should return 1", () => {
            expect(list1.indexOf(Person.Noemi)).to.eq(1);
        });
        test("should use the given comparator", () => {
            const ageComparator = (p1: Person | null, p2: Person | null) => p1?.age === p2?.age;
            const index = list1.indexOf(Person.Noemi2, ageComparator);
            expect(index).to.eq(3);
        });
    });

    describe("#intersect()", () => {
        test("should return an array of [4,5]", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([4, 5, 6, 7, 8]);
            const elist = list1.intersect(list2).toList();
            expect(elist.toArray()).to.deep.equal([4, 5]);
            expect(elist.length).to.eq(2);
        });
        test("should return an array of [3, 4, 5]", () => {
            const list1 = new List([1, 2, 3, 3, 4, 5, 5, 5, 11]);
            const list2 = new List([3, 3, 3, 4, 4, 5, 5, 6, 7, 8]);
            const elist = list1.intersect(list2).toList();
            expect(elist.toArray()).to.deep.equal([3, 4, 5]);
        });
        test("should only have 'Mel', 'Lenka' and 'Jane'", () => {
            const list1 = new List([Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]);
            const list2 = new List([Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]);
            const elist = list1.intersect(list2);
            expect(elist.toArray()).to.deep.equal([Person.Mel, Person.Lenka, Person.Jane]);
        });
        test("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
            const list1 = new List([Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]);
            const list2 = new List([Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]);
            const elist = list1.intersect(list2, (p1, p2) => p1.name === p2.name);
            expect(elist.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
        });
        test("should return a set of people common in both enumerables", () => {
            const list1 = new List<Person>();
            const list2 = new List<Person>();
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90));
                list1.add(p);
            }
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50));
                list2.add(p);
            }
            const exceptionList = list1.intersect(list2, (p1, p2) => p1.age === p2.age);
            const ageCount = exceptionList.count(p => p.age > 50);
            expect(ageCount).to.eq(0);
        }, {timeout: 10000});
        test("should use order comparator and return a set of people common in both enumerables", () => {
            const list1 = new List<Person>();
            const list2 = new List<Person>();
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90));
                list1.add(p);
            }
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50));
                list2.add(p);
            }
            const exceptionList = list1.intersect(list2, null, (p1, p2) => p1.age - p2.age);
            const ageCount = exceptionList.count(p => p.age > 50);
            expect(ageCount).to.eq(0);
        }, {timeout: 10000});
    });

    describe("#isEmpty()", () => {
        const list1 = new List([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        test("should return false if list is not empty", () => {
            expect(list1.isEmpty()).to.false;
        });
        test("should return true if list is empty", () => {
            list1.removeIf(p => !p || !!p);
            expect(list1.isEmpty()).to.true;
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
        const schools = new List([school1, school2, school3]);
        const students = new List([desiree, apolline, giselle, priscilla, lucrezia]);
        test("should join students and schools", () => {
            const joinedData = students.join(schools, st => st.schoolId, sc => sc.id,
                (student, school) => `${student.name} ${student.surname} :: ${school?.name}`).toList();
            const expectedOutputDataList = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
            ];
            expect(joinedData.size()).to.eq(4);
            expect(joinedData.toArray()).to.deep.equal(expectedOutputDataList);
        });
        test("should set null for school if left join is true", () => {
            const joinedData = students.join(schools, st => st.schoolId, sc => sc.id,
                (student, school) => [student, school], (stid, scid) => stid === scid, true).toArray();
            for (const jd of joinedData) {
                if ((jd[0] as Student).surname === "Volpe") {
                    expect(jd[1]).to.eq(null);
                } else {
                    expect(jd[1]).to.not.eq(null);
                }
            }
        });
        test("should join key-value pairs", () => {
            const pairList1 = new List([new Pair(1, "A"), new Pair(2, "B"), new Pair(3, "C")]);
            const pairList2 = new List([new Pair(1, "a1"), new Pair(1, "a2"), new Pair(1, "a3"), new Pair(2, "b1"), new Pair(2, "b2")]);
            const joinList = pairList1.join(pairList2, p1 => p1.key, p2 => p2.key, (pair1, pair2) => [pair1.value, pair2?.value]);
            const expectedOutput = [
                ["A", "a1"],
                ["A", "a2"],
                ["A", "a3"],
                ["B", "b1"],
                ["B", "b2"]
            ];
            expect(joinList.toArray()).to.deep.equal(expectedOutput);
            expect(joinList.toList().length).to.eq(5);
        });
    });

    describe("#last()", () => {
        test("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.last()).to.throw(ErrorMessages.NoElements);
        });
        test("should return the last element if no predicate is provided.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            const last = list.last();
            expect(last).to.eq(5);
        });
        test("should throw an error if no matching element is found.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            expect(() => list.last(n => n < 0)).to.throw(ErrorMessages.NoMatchingElement);
        });
        test("should return 87", () => {
            const list = new List([9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 67, 12, 19]);
            const last = list.last(p => p > 80);
            expect(last).to.eq(87);
        });
    });

    describe("#lastIndexOf()", () => {
        const list1 = new List([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        test("should return 4", () => {
            expect(list1.lastIndexOf(null)).to.eq(4);
        });
        test("should lastIndexOf 1", () => {
            expect(list1.lastIndexOf(Person.Noemi)).to.eq(1);
        });
        test("should use the given comparator", () => {
            const nameComparator = (p1: Person | null, p2: Person | null) => p1?.name === p2?.name;
            const index = list1.lastIndexOf(Person.Noemi, nameComparator);
            expect(index).to.eq(3);
        });
        test("should return -1", () => {
            list1.removeIf(p => !p);
            expect(list1.lastIndexOf(null)).to.eq(-1);
        });
    });

    describe("#lastOrDefault()", () => {
        test("should return null if list is empty()", () => {
            const list = new List<number>();
            expect(list.lastOrDefault()).to.eq(null);
        });
        test("should return the last element if no predicate is provided.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            const first = list.lastOrDefault();
            expect(first).to.eq(5);
        });
        test("should return null if no matching element is found.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            expect(list.lastOrDefault(n => n < 0)).to.eq(null);
        });
        test("should return 87", () => {
            const list = new List([9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 67, 12, 19]);
            const last = list.lastOrDefault(p => p > 80);
            expect(last).to.eq(87);
        });
    });

    describe("#max()", () => {
        const list = new List([43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011]);
        test("should return 2312", () => {
            const max = list.max(n => n);
            const max2 = list.max();
            expect(max).to.eq(2312);
            expect(max2).to.eq(max);
        });
        test("should return 23", () => {
            const personList = new List([Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]);
            const max = personList.max(p => p.age);
            expect(max).to.eq(23);
        });
        test("should throw if list has no elements", () => {
            const list = new List<number>();
            expect(() => list.max()).to.throw(ErrorMessages.NoElements);
            expect(() => list.max(n => n * 2)).to.throw(ErrorMessages.NoElements);
        });
    });
    describe("#min()", () => {
        const list = new List([43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011]);
        test("should return 1", () => {
            const min = list.min(n => n);
            const min2 = list.min();
            expect(min).to.eq(1);
            expect(min2).to.eq(min);
        });
        test("should return 9", () => {
            const personList = new List([Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]);
            const min = personList.min(p => p.age);
            expect(min).to.eq(9);
        });
        test("should throw if list has no elements", () => {
            const list = new List<number>();
            expect(() => list.min()).to.throw(ErrorMessages.NoElements);
            expect(() => list.min(n => n / 2)).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#ofType()", () => {
        const symbol = Symbol("test");
        const object = new Object(100);
        const bigInt = BigInt(100);
        const bigint2 = BigInt(Number.MAX_SAFE_INTEGER);
        const generator = function* () {
            yield 1;
            yield 2;
            yield 3;
        };
        const func = () => {
            return 1;
        };
        const list = new List([
            1, 2, 3,
            "4", "5", "6",
            7, 8, 9, 10,
            true, false,
            Number(999),
            symbol,
            object,
            Person.Mirei,
            Person.Alice,
            bigInt,
            bigint2,
            ["x", "y", "z"],
            generator,
            func
        ]);
        test("should return an array of numbers via Number constructor", () => {
            const numbers = list.ofType(Number).toArray();
            expect(numbers).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
        });
        test("should return an array of numbers via typeof", () => {
            const numbers = list.ofType("number").toArray();
            expect(numbers).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
        });
        test("should return an array of strings via String constructor", () => {
            const strings = list.ofType(String).toArray();
            expect(strings).to.deep.equal(["4", "5", "6"]);
        });
        test("should return an array of strings via typeof", () => {
            const strings = list.ofType("string").toArray();
            expect(strings).to.deep.equal(["4", "5", "6"]);
        });
        test("should return an array of booleans via Boolean constructor", () => {
            const booleans = list.ofType(Boolean).toArray();
            expect(booleans).to.deep.equal([true, false]);
        });
        test("should return an array of booleans via typeof", () => {
            const booleans = list.ofType("boolean").toArray();
            expect(booleans).to.deep.equal([true, false]);
        });
        test("should return an array of symbols", () => {
            const symbols = list.ofType(Symbol).toArray();
            expect(symbols).to.deep.equal([symbol]);
        });
        test("should return an array of symbols via typeof", () => {
            const symbols = list.ofType("symbol").toArray();
            expect(symbols).to.deep.equal([symbol]);
        });
        test("should return an array of objects", () => {
            const objects = list.ofType(Object).toArray();
            expect(objects).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
        });
        test("should return an array of objects via typeof", () => {
            const objects = list.ofType("object").toArray();
            expect(objects).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
        });
        test("should return an array of Person", () => {
            const people = list.ofType(Person).toArray();
            expect(people).to.deep.equal([Person.Mirei, Person.Alice]);
        });
        test("should return an array of BigInt", () => {
            const bigintList = list.ofType(BigInt).toArray();
            expect(bigintList).to.deep.equal([bigInt, bigint2]);
        });
        test("should return an array of BigInt via typeof", () => {
            const bigintList = list.ofType("bigint").toArray();
            expect(bigintList).to.deep.equal([bigInt, bigint2]);
        });
        test("should return an array of arrays", () => {
            const arrays = list.ofType(Array).toArray();
            expect(arrays).to.deep.equal([["x", "y", "z"]]);
        });
        test("should return an array of functions", () => {
            const functions = list.ofType(Function).toArray();
            expect(functions).to.deep.equal([generator, func]);
        });
        test("should return an array of functions via typeof", () => {
            const functions = list.ofType("function").toArray();
            expect(functions).to.deep.equal([generator, func]);
        });
        test("should return an array of strings and numbers", () => {
            const stringsAndNumbers = [...list.ofType(String), ...list.ofType(Number)];
            expect(stringsAndNumbers).to.deep.equal(["4", "5", "6", 1, 2, 3, 7, 8, 9, 10, 999]);
        });
    });

    describe("#orderBy()", () => {
        test("should order people by age [asc]", () => {
            const people = new List([Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola]);
            const orderedPeople = people.orderBy(p => p.age);
            const orderedPeopleAges = orderedPeople.select(p => p.age);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });
    describe("#orderByDescending()", () => {
        test("should order people by age [desc]", () => {
            const people = new List([Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola]);
            const orderedPeople = people.orderByDescending(p => p.age);
            const orderedPeopleAges = orderedPeople.select(p => p.age);
            const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#pairwise()", () => {
        const list = new List(["a", "b", "c", "d", "e", "f"]);
        const result = list.pairwise((prev, curr) => [`->${prev}`, `${curr}<-`]);
        test("should create an enumerable that pairs up the values", () => {
            expect(result.toArray()).to.deep.equal([["->a", "b<-"], ["->b", "c<-"], ["->c", "d<-"], ["->d", "e<-"], ["->e", "f<-"]]);
        });
    });

    describe("#partition()", () => {
        test("should partition the list into two lists", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const [evens, odds] = list.partition(n => n % 2 === 0);
            expect(evens.toArray()).to.deep.equal([2, 4, 6, 8, 10]);
            expect(odds.toArray()).to.deep.equal([1, 3, 5, 7, 9]);
        });
    });

    describe("#prepend()", () => {
        const list = new List<Person>();
        list.add(Person.Mel);
        list.add(Person.Senna);
        test("should have two elements", () => {
            expect(list.size()).to.eq(2);
            expect(list.length).to.eq(2);
        });
        test("should return a new list", () => {
            const newList = list.prepend(Person.Lenka).toList();
            expect(list.size()).to.eq(2);
            expect(newList.size()).to.eq(3);
        });
        test("should have the item at the beginning of the list", () => {
            const newList = list.prepend(Person.Lenka).toList();
            const first = newList.get(0);
            expect(first).to.eq(Person.Lenka);
        });
        test("should not have the appended item in the old list", () => {
            const newList = list.prepend(Person.Lenka).toList();
            expect(newList.contains(Person.Lenka)).to.eq(true);
            expect(list.contains(Person.Lenka)).to.eq(false);
        });
    });

    describe("#remove()", () => {
        const list1 = new List([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        test("should remove null from index 2", () => {
            list1.remove(null);
            expect(list1.get(2)).to.eq(Person.Noemi2);
            expect(list1.length).to.eq(4);
        });
        test("should remove Noemi from the list", () => {
            list1.remove(Person.Noemi);
            expect(list1.get(2)).to.eq(null);
            expect(list1.get(1)).to.eq(Person.Noemi2);
            expect(list1.length).to.eq(3);
        });
    });

    describe("#removeAll()", () => {
        test("should remove the elements of second list from first list", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            const list2 = new List([Person.Vanessa, Person.Viola, Person.Noemi2]);
            list1.removeAll(list2);
            expect(list1.size()).to.eq(4);
            expect(list1.get(3)).to.eq(Person.Priscilla);
            expect(list1.length).to.eq(4);
        });
        test("should use the provided comparator for comparison", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola], personNameComparator);
            const list2 = new List([Person.Vanessa, Person.Viola, Person.Noemi2]);
            list1.removeAll(list2);
            expect(list1.size()).to.eq(3);
            expect(list1.get(2)).to.eq(Person.Priscilla);
            expect(list1.length).to.eq(3);
        });
        test("should remove the given elements from the list", () => {
            const list = new List([78, 3, 16, 16, 10, 7]);
            list.removeAll([3, 16, 7]);
            expect(list.size()).to.eq(2);
            expect(list.get(0)).to.eq(78);
            expect(list.get(1)).to.eq(10);
        });
    });

    describe("#removeAt()", () => {
        test("should throw error if index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => list.removeAt(-1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.removeAt(44)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(list.length).to.eq(5);
        });
        test("should remove element from the specified index", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            const removedElement = list1.removeAt(5);
            expect(list1.size()).to.eq(5);
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(4)).to.eq(Person.Vanessa);
            expect(list1.length).to.eq(5);
            expect(removedElement).to.eq(Person.Viola);
        });
    });

    describe("#removeIf()", () => {
        test("should remove people whose names are longer than 5 characters from the list", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            list1.removeIf(p => p.name.length > 5);
            expect(list1.size()).to.eq(3);
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(1)).to.eq(Person.Noemi);
            expect(list1.get(2)).to.eq(Person.Viola);
            expect(list1.length).to.eq(3);
        });
    });

    describe("#retainAll()", () => {
        test("should remove elements that are not in the specified list", () => {
            const list1 = new List([3, 4, 1, 2, 5]);
            const list2 = new List([5, 4]);
            list1.retainAll(list2);
            expect(list1.size()).to.eq(2);
            expect(list1.get(0)).to.eq(4);
            expect(list1.get(1)).to.eq(5);
            expect(list1.length).to.eq(2);
        });
        test("should use the provided comparator", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola], personNameComparator);
            const list2 = new List([Person.Vanessa, Person.Viola, Person.Noemi2]);
            list1.retainAll(list2);
            expect(list1.size()).to.eq(3);
            expect(list1.get(0)).to.eq(Person.Noemi);
            expect(list1.get(1)).to.eq(Person.Vanessa);
            expect(list1.get(2)).to.eq(Person.Viola);
            expect(list1.length).to.eq(3);
        });
        test("should remove the given elements from the list", () => {
            const list = new List([78, 3, 16, 16, 10, 7]);
            list.retainAll([3, 16]);
            expect(list.length).to.eq(3);
            expect(list.get(0)).to.eq(3);
            expect(list.get(1)).to.eq(16);
            expect(list.get(1)).to.eq(16);
        });
    });

    describe("#reverse()", () => {
        const list: List<Person> = new List<Person>();
        list.add(Person.Alice);
        list.add(Person.Lenka);
        list.add(Person.Senna);
        list.add(Person.Mel);
        test("should have a person with the surname 'Rivermist' at the end.", () => {
            const list2 = list.reverse().toList();
            const last = list2.get(list2.size() - 1);
            expect(last.surname).to.eq("Rivermist");
        });
        test("should not modify the original list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = list.reverse().toList();
            expect(list.get(0)).to.eq(list2.get(4));
            expect(list.get(1)).to.eq(list2.get(3));
            expect(list.get(2)).to.eq(list2.get(2));
            expect(list.get(3)).to.eq(list2.get(1));
            expect(list.get(4)).to.eq(list2.get(0));
        });
    });

    describe("#scan()", () => {
        test("should create a list of increasing numbers starting with 1", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.scan((acc, n) => acc + n);
            expect(result.toArray()).to.deep.equal([1, 3, 6, 10]);
        });
        test("should create a list of increasing numbers starting with 3", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = list.scan((acc, n) => acc + n, 2);
            expect(result.toArray()).to.deep.equal([3, 5, 8, 12, 17]);
        });
        test("should create a list of increasing numbers starting with 1", () => {
            const list = new List([1, 3, 12, 19, 33]);
            const result = list.scan((acc, n) => acc + n, 0);
            expect(result.toArray()).to.deep.equal([1, 4, 16, 35, 68]);
        });
        test("should throw error if the list is empty", () => {
            const list = new List<number>();
            expect(() => list.scan((acc, n) => acc + n).toArray()).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#select()", () => {
        test("should return an IEnumerable with elements [4, 25, 36, 81]", () => {
            const list = new List([2, 5, 6, 9]);
            const list2 = list.select(n => Math.pow(n, 2)).toList();
            expect(list2.size()).to.eq(4);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(25);
            expect(list2.get(2)).to.eq(36);
            expect(list2.get(3)).to.eq(81);
            expect(list2.length).to.eq(4);
        });
        test("should return an IEnumerable with elements [125, 729]", () => {
            const list = new List([2, 5, 6, 9]);
            const list2 = list.where(n => n % 2 !== 0).select(n => Math.pow(n, 3)).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(125);
            expect(list2.get(1)).to.eq(729);
        });
    });

    describe("#selectMany()", () => {
        test("should return a flattened array of ages #1", () => {
            const people: Person[] = [];
            Person.Viola.friendsArray = [Person.Rebecca];
            Person.Jisu.friendsArray = [Person.Alice, Person.Mel];
            Person.Vanessa.friendsArray = [Person.Viola, Person.Rebecca, Person.Jisu, Person.Alice];
            Person.Rebecca.friendsArray = [Person.Viola];
            people.push(Person.Viola);
            people.push(Person.Rebecca);
            people.push(Person.Jisu);
            people.push(Person.Vanessa);
            const peopleList = new List(people);
            const friends = peopleList.selectMany(p => p.friendsArray).select(p => p.age).toArray();
            expect(friends).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
        });
        test("should return a flattened array of ages #2", () => {
            const people: Person[] = [];
            Person.Viola.friendsList = new List([Person.Rebecca]);
            Person.Jisu.friendsList = new List([Person.Alice, Person.Mel]);
            Person.Vanessa.friendsList = new List([Person.Viola, Person.Rebecca, Person.Jisu, Person.Alice]);
            Person.Rebecca.friendsList = new List([Person.Viola]);
            people.push(Person.Viola);
            people.push(Person.Rebecca);
            people.push(Person.Jisu);
            people.push(Person.Vanessa);
            const peopleList = new List(people);
            const friends = peopleList.selectMany(p => p.friendsList).select(p => p.age).toArray();
            expect(friends).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
        });
    });

    describe("#sequenceEqual()", () => {
        test("should return false for lists with different sizes", () => {
            const list1 = new List([1, 2]);
            const list2 = new List([1, 2, 3]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        test("should return false if lists don't have members in the same order", () => {
            const list1 = new List([1, 2]);
            const list2 = new List([2, 1]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        test("should return true if lists have members in the same order", () => {
            const list1 = new List([1, 2]);
            const list2 = new List([1, 2]);
            expect(list1.sequenceEqual(list2)).to.eq(true);
        });
        test("should return true if lists have members in the same order", () => {
            const list1 = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
            const list2 = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi2]);
            expect(list1.sequenceEqual(list2, (p1, p2) => p1.name === p2.name)).to.eq(true);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
    });

    describe("#set", () => {
        test("should throw error if index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => list.set(-1, 111)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.set(44, 111)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            list.clear();
            expect(() => list.set(0, 111)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        })
        test("should change the element at the specified index with the provided element", () => {
            const list = new List([1, 2, 3, 4, 5]);
            list.set(1, 222);
            expect(list.size()).to.eq(5);
            expect(list.get(1)).to.eq(222);
            expect(list.indexOf(2)).to.eq(-1);
        })
    });

    describe("#shuffle()", () => {
        test("should shuffle the list", () => {
            const list = new List(Enumerable.range(1, 12));
            const shuffled = list.shuffle();
            expect(shuffled.count()).to.eq(12);
            expect(shuffled.toArray()).to.not.deep.eq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        });
    });

    describe("#single()", () => {
        test("should throw error if list is empty.", () => {
            const list = new List<number>();
            expect(() => list.single()).to.throw(ErrorMessages.NoElements);
            expect(() => list.single(n => n > 0)).to.throw(ErrorMessages.NoElements);
        });
        test("should throw error if list has more than one element", () => {
            const list = new List();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            expect(() => list.single()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        test("should return the only element in the list", () => {
            const list = new List();
            list.add(Person.Alice);
            const single = list.single();
            expect(single).to.eq(Person.Alice);
        });
        test("should throw error if no matching element is found.", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            expect(() => list.single(p => p.name === "Lenka")).to.throw(ErrorMessages.NoMatchingElement);
        });
        test("should throw error if more than one matching element is found.", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            list.add(Person.Senna);
            expect(() => list.single(p => p.name === "Senna")).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        test("should return person with name 'Alice'.", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            const single = list.single(p => p.name === "Alice");
            expect(single.name).to.eq("Alice");
            expect(single).to.eq(Person.Alice);
        });
    });
    describe("#singleOrDefault()", () => {
        const list = new List<number>();
        list.add(1);
        list.add(2);
        list.add(3);
        test("should return null if the list is empty", () => {
            const list2 = new List<number>();
            const sod1 = list2.singleOrDefault();
            const sod2 = list2.singleOrDefault(n => n > 0);
            expect(sod1).to.eq(null);
            expect(sod2).to.eq(null);
        });
        test("should return 3", () => {
            const item = list.singleOrDefault(n => n === 3);
            expect(item).to.eq(3);
        });
        test(`should throw error [${ErrorMessages.MoreThanOneMatchingElement}]`, () => {
            list.add(3);
            expect(() => list.singleOrDefault(n => n === 3)).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        test("should return the only element in the list", () => {
            const list2 = new List<string>();
            list2.add("Suzuha");
            const sod = list2.singleOrDefault();
            expect(sod).to.eq("Suzuha");
        });
        test(`should throw error [${ErrorMessages.MoreThanOneElement}]`, () => {
            const list2 = new List<string>();
            list2.add("Suzuha");
            list2.add("Suzuri");
            expect(() => list2.singleOrDefault()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        test("should return default value [null] if no matching element is found.", () => {
            const sod = list.singleOrDefault(n => n < 0);
            expect(sod).to.eq(null);
        });
    });

    describe("#size()", () => {
        const list = new List([1, 2, 3, 4, 5]);
        test("should return the size of the list", () => {
            expect(list.size()).to.eq(5);
            list.removeAt(0);
            expect(list.size()).to.eq(4);
            list.clear();
            expect(list.size()).to.eq(0);
        });
    });

    describe("#skip()", () => {
        const list = new List([1, 2, 3, 4, 5, 6, 7]);
        test("should return a list with elements [5,6,7]", () => {
            const list2 = list.skip(4).toList();
            expect(list2.get(0)).to.eq(5);
            expect(list2.get(1)).to.eq(6);
            expect(list2.get(2)).to.eq(7);
        });
        test("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skip(100).toList();
            expect(list2.size()).to.eq(0);
        });
    });

    describe("#skipLast()", () => {
        const list = new List([1, 2, 3, 4, 5, 6, 7]);
        test("should return a list with elements [1,2,3]", () => {
            const list2 = list.skipLast(4).toList();
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
        });
        test("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skipLast(100).toList();
            expect(list2.size()).to.eq(0);
        });
    });
    describe("#skipWhile()", () => {
        const list = new List([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500]);
        test("should return an IEnumerable with elements [4000, 1500, 5500]", () => {
            const list2 = list.skipWhile((n, nx) => n > nx * 1000).toList();
            expect(list2.get(0)).to.eq(4000);
            expect(list2.get(1)).to.eq(1500);
            expect(list2.get(2)).to.eq(5500);
            expect(list2.count()).to.eq(3);
        });
    });

    describe("#sort", () => {
        test("should sort list with the specified constructor", () => {
            const list = new List([Person.Noemi, Person.Alice, Person.Lucrezia, Person.Priscilla, Person.Eliza, Person.Bella]);
            list.sort((p1, p2) => p1.name.localeCompare(p2.name));
            expect(list.get(0)).to.eq(Person.Alice);
            expect(list.get(1)).to.eq(Person.Bella);
            expect(list.get(2)).to.eq(Person.Eliza);
            expect(list.get(3)).to.eq(Person.Lucrezia);
            expect(list.get(4)).to.eq(Person.Noemi);
            expect(list.get(5)).to.eq(Person.Priscilla);
        });
        test("should sort list with the default comparator if no comparator is specified", () => {
            const list = new List([3, 1, -1, 8, 10, -9]);
            list.sort();
            expect(list.get(0)).to.eq(-9);
            expect(list.get(1)).to.eq(-1);
            expect(list.get(2)).to.eq(1);
            expect(list.get(3)).to.eq(3);
            expect(list.get(4)).to.eq(8);
            expect(list.get(5)).to.eq(10);
        })
    });

    describe("#sum()", () => {
        test("should return 21", () => {
            const list = new List([1, 2, 3, 4, 5, 6]);
            const sum = list.sum(n => n);
            const sum2 = list.sum();
            expect(sum).to.eq(21);
            expect(sum2).to.eq(sum);
        });
    });

    describe("#take()", () => {
        const list = new List([1, 2, 3, 4, 5, 6, 7]);
        test("should return an empty IEnumerable", () => {
            const list2 = list.take(0).toList();
            const list3 = list.take(-1).toList();
            expect(list2.isEmpty()).to.eq(true);
            expect(list3.isEmpty()).to.eq(true);
        });
        test("should return a list with elements [1,2,3]", () => {
            const list2 = list.take(3).toList();
            expect(list2.count()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
        });
        test("should return all elements if count is bigger than list size", () => {
            const list2 = list.take(100).toList();
            expect(list.size()).to.eq(list2.size());
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
        const list = new List([1, 2, 3, 4, 5, 6, 7]);
        test("should return an empty IEnumerable", () => {
            const list2 = list.takeLast(0).toList();
            const list3 = list.takeLast(-1).toList();
            expect(list2.isEmpty()).to.eq(true);
            expect(list3.isEmpty()).to.eq(true);
        });
        test("should return a list with elements [5,6,7]", () => {
            const list2 = list.takeLast(3).toList();
            expect(list2.count()).to.eq(3);
            expect(list2.get(0)).to.eq(5);
            expect(list2.get(1)).to.eq(6);
            expect(list2.get(2)).to.eq(7);
        });
        test("should return all elements if count is bigger than list size", () => {
            const list2 = list.takeLast(100).toList();
            expect(list.size()).to.eq(list2.size());
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
        const list = new List(["apple", "banana", "mango", "orange", "plum", "grape"]);
        test("should return an IEnumerable with elements [apple, banana, mango]", () => {
            const list2 = list.takeWhile(f => f.localeCompare("orange") !== 0).toList();
            expect(list2.get(0)).to.eq("apple");
            expect(list2.get(1)).to.eq("banana");
            expect(list2.get(2)).to.eq("mango");
            expect(list2.count()).to.eq(3);
        });
    });

    describe("#thenBy()", () => {
        test("should order people by age [asc] then by name[asc]", () => {
            const people = new List([Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola]);
            const orderedPeople = people.orderBy(p => p.age, (a1, a2) => a1 - a2).thenBy(p => p.name);
            const orderedPeopleAges = orderedPeople.select(p => p.age);
            const orderedPeopleNames = orderedPeople.select(p => p.name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = ["Mel", "Kaori", "Senna", "Jisu", "Jane", "Lenka", "Rebecca", "Vanessa", "Alice", "Reina", "Viola"];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        test("should order people by age [asc] then by name[asc] then by surname[asc]", () => {
            const people = new List([Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]);
            const orderedPeople = people.orderBy(p => p.age)
                .thenBy(p => p.name, (n1, n2) => n1.localeCompare(n2))
                .thenBy(p => p.surname);
            const expectedOrder: string[] = [
                "[9] :: Priscilla Necci",
                "[19] :: Eliza Jackson",
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
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        test("should be ignored if followed by an orderBy", () => {
            const people = new List([Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]);
            const orderedPeople = people.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
                .thenBy(p => p.name)
                .thenByDescending(p => p.surname, (n1, n2) => n1.localeCompare(n2))
                .orderBy(p => p.age).thenBy(p => p.name);
            const expectedOrder: string[] = [
                "[9] :: Priscilla Necci",
                "[19] :: Eliza Jackson",
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#thenByDescending()", () => {
        test("should order people by age [asc] then by name[desc]", () => {
            const people = new List([Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola]);
            const orderedPeople = people.orderBy(p => p.age).thenByDescending(p => p.name);
            const orderedPeopleAges = orderedPeople.select(p => p.age);
            const orderedPeopleNames = orderedPeople.select(p => p.name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = ["Mel", "Senna", "Kaori", "Jisu", "Lenka", "Jane", "Rebecca", "Vanessa", "Reina", "Alice", "Viola"];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        test("should order people by age [desc] then by name[desc] then by surname[desc]", () => {
            const people = new List([Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]);
            const orderedPeople = people.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
                .thenByDescending(p => p.name)
                .thenByDescending(p => p.surname, (n1, n2) => n1.localeCompare(n2));
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
                "[19] :: Eliza Jackson",
                "[9] :: Priscilla Necci"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        test("should be ignored if followed by an orderBy", () => {
            const people = new List([Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]);
            const orderedPeople = people.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
                .thenByDescending(p => p.name)
                .thenByDescending(p => p.surname, (n1, n2) => n1.localeCompare(n2))
                .orderBy(p => p.age).thenBy(p => p.name);
            const expectedOrder: string[] = [
                "[9] :: Priscilla Necci",
                "[19] :: Eliza Jackson",
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        test("should be ignored if followed by an orderByDescending", () => {
            const people = new List([Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]);
            const orderedPeople = people.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
                .thenByDescending(p => p.name)
                .thenByDescending(p => p.surname, (n1, n2) => n1.localeCompare(n2))
                .orderByDescending(p => p.age).thenBy(p => p.name);
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
                "[19] :: Eliza Jackson",
                "[19] :: Hanna Jackson",
                "[9] :: Priscilla Necci"
            ];
            const returnedOrder: string[] = [];
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });

    describe("#toDictionary()", () => {
        const list = new List([Person.Alice, Person.Mel, Person.Noemi, Person.Lucrezia, Person.Amy, Person.Bella, Person.Reina]);
        test("should convert it to a dictionary", () => {
            const dictionary = list.toDictionary(p => p.name, p => p);
            expect(dictionary.get(Person.Alice.name)).to.equal(Person.Alice);
            expect(dictionary.get(Person.Mel.name)).to.equal(Person.Mel);
            expect(dictionary.get(Person.Noemi.name)).to.equal(Person.Noemi);
            expect(dictionary.get(Person.Lucrezia.name)).to.equal(Person.Lucrezia);
            expect(dictionary.get(Person.Amy.name)).to.equal(Person.Amy);
            expect(dictionary.get(Person.Bella.name)).to.equal(Person.Bella);
            expect(dictionary.get(Person.Reina.name)).to.equal(Person.Reina);
            expect(dictionary.keys().toArray()).to.deep.equal(["Alice", "Mel", "Noemi", "Lucrezia", "Amy", "Bella", "Reina"]);
        });
    });

    describe("#toEnumerableSet()", () => {
        const list = new List([1, 2, 3, 4, 4, 5, 6, 7, 7, 7, 8, 9, 10]);
        test("should convert it to a set", () => {
            const set = list.toEnumerableSet();
            expect(set.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });

    describe("#toImmutableDictionary()", () => {
        const list = new List([Person.Alice, Person.Mel, Person.Noemi, Person.Lucrezia, Person.Amy, Person.Bella, Person.Reina]);
        test("should convert it to an immutable dictionary", () => {
            const dictionary = list.toImmutableDictionary(p => p.name, p => p);
            expect(dictionary.get(Person.Alice.name)).to.equal(Person.Alice);
            expect(dictionary.get(Person.Mel.name)).to.equal(Person.Mel);
            expect(dictionary.get(Person.Noemi.name)).to.equal(Person.Noemi);
            expect(dictionary.get(Person.Lucrezia.name)).to.equal(Person.Lucrezia);
            expect(dictionary.get(Person.Amy.name)).to.equal(Person.Amy);
            expect(dictionary.get(Person.Bella.name)).to.equal(Person.Bella);
            expect(dictionary.get(Person.Reina.name)).to.equal(Person.Reina);
            expect(dictionary.keys().toArray()).to.deep.equal(["Alice", "Mel", "Noemi", "Lucrezia", "Amy", "Bella", "Reina"]);
            const dict2 = dictionary.add(Person.Priscilla.name, Person.Priscilla);
            expect(dict2.size()).to.eq(8);
            expect(dict2.get(Person.Priscilla.name)).to.eq(Person.Priscilla);
            expect(dictionary.size()).to.eq(7);
            expect(dictionary.get(Person.Priscilla.name)).to.be.null;
            expect(dict2.length).to.eq(8);
            expect(dictionary.length).to.eq(7);
            expect(dict2.keys().toArray()).to.deep.equal(["Alice", "Mel", "Noemi", "Lucrezia", "Amy", "Bella", "Reina", "Priscilla"]);
        });
    });

    describe("#toImmutableList()", () => {
        const list = new List([1, 2, 3]);
        const immutableList = list.toImmutableList();
        test("should return a new ImmutableList without altering the current list", () => {
            expect(list.size()).to.eq(3);
            expect(immutableList instanceof ImmutableList).to.be.true;
            expect(immutableList).to.not.equal(list);
            expect(immutableList.size()).to.eq(3);
            expect(list.length).to.eq(3);
            expect(immutableList.length).to.eq(3);
        });
        test("should return a new immutable list", () => {
            const immutable2 = list.toImmutableList();
            expect(list).to.not.equal(immutable2);
            expect(list.toArray()).to.deep.equal(immutable2.toArray());
        });
    });

    describe("#toImmutableSet()", () => {
        const list = new List([1, 2, 3, 4, 4, 5, 6, 7, 7, 7, 8, 9, 10]);
        test("should convert it to an immutable set", () => {
            const set = list.toImmutableSet();
            expect(set.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const set2 = set.toImmutableSet().add(999);
            expect(set).to.not.equal(set2);
            expect(set.size()).to.eq(10);
            expect(set2.size()).to.eq(11);
            expect(set2.last()).to.eq(999);
        });
    });

    describe("#toImmutableSortedDictionary()", () => {
        const people = new List([Person.Alice, Person.Vanessa, Person.Viola, Person.Lenka, Person.Senna]);
        test("should create a sorted dictionary from the list", () => {
            const dict = people.toImmutableSortedDictionary(p => p.name, p => p);
            expect(dict.size()).to.eq(people.size());
            expect(dict.keys().toArray()).to.deep.equal(["Alice", "Lenka", "Senna", "Vanessa", "Viola"]);
            const dict2 = dict.add(Person.Kaori.name, Person.Kaori);
            expect(dict2.size()).to.eq(people.size() + 1);
            expect(dict2.get(Person.Kaori.name)).to.eq(Person.Kaori);
            expect(dict.size()).to.eq(people.size());
            expect(dict.get(Person.Kaori.name)).to.be.null;
            expect(dict2.length).to.eq(people.size() + 1);
            expect(dict.length).to.eq(people.size());
            expect(dict2.keys().toArray()).to.deep.equal(["Alice", "Kaori", "Lenka", "Senna", "Vanessa", "Viola"]);
        })
    });

    describe("#toImmutableSortedSet()", () => {
        const list = new List([5, 2, 3, 4, 4, 3, 9, 7, 7, 6, 8, 1, 10]);
        test("should convert it to an immutable sorted set", () => {
            const set = list.toImmutableSortedSet();
            expect(set.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const set2 = set.toImmutableSortedSet().add(999);
            expect(set).to.not.equal(set2);
            expect(set.size()).to.eq(10);
            expect(set2.size()).to.eq(11);
            expect(set.last()).to.eq(10);
            expect(set2.last()).to.eq(999);
        });
    });

    describe("#toList()", () => {
        const list = new List([1, 2, 3]);
        const list2 = list.append(4).toList();
        test("should return a new List without altering the current list", () => {
            expect(list.size()).to.eq(3);
            expect(list2 instanceof List).to.be.true;
            expect(list2.size()).to.eq(4);
            expect(list === list2).to.be.false;
            expect(list.length).to.eq(3);
            expect(list2.length).to.eq(4);
        });
        test("should return a new list", () => {
            const list3 = list.toList();
            expect(list === list3).to.be.false;
            expect(list.toArray()).to.deep.equal(list3.toArray());
        });
    });

    describe("#toLookup()", () => {
        const list = new List([Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi, Person.Noemi2, Person.Hanna, Person.Hanna2]);
        const lookup = list.toLookup(p => p.name, p => p, (n1, n2) => n1.localeCompare(n2));
        test("should create a lookup with name being the key", () => {
            expect(lookup.size()).to.eq(3);
            expect(lookup.hasKey("Noemi")).to.eq(true);
            // for (const item of lookup) {
            //     console.log("Key: ", item.key);
            //     const value = lookup.get(item.key);
            //     for (const p of value) {
            //         console.log("Person Value: ", p);
            //     }
            //     console.log("Null: ", lookup.get("Fujiwara"));
            // }
        });
    });

    describe("#toReadonlyCollection()", () => {
        const list = new List([1, 2, 3]);
        const readonlyCollection = list.toReadonlyCollection();
        test("should return a new ReadonlyCollection without altering the current list", () => {
            expect(list.size()).to.eq(3);
            expect(readonlyCollection instanceof ReadonlyCollection).to.be.true;
            expect(readonlyCollection.size()).to.eq(3);
            expect(list === readonlyCollection).to.be.false;
            expect(list.length).to.eq(3);
            expect(readonlyCollection.length).to.eq(3);
        });
        test("should return a new readonly collection", () => {
            const readonly2 = list.toReadonlyCollection();
            expect(list === readonly2).to.be.false;
            expect(list.toArray()).to.deep.equal(readonly2.toArray());
        });
    });

    describe("#toSortedDictionary()", () => {
        const people = new List([Person.Alice, Person.Vanessa, Person.Viola, Person.Lenka, Person.Senna]);
        test("should create a sorted dictionary from the list", () => {
            const dict = people.toSortedDictionary(p => p.name, p => p);
            expect(dict.size()).to.eq(people.size());
            expect(dict.keys().toArray()).to.deep.equal(["Alice", "Lenka", "Senna", "Vanessa", "Viola"]);
        })
    });

    describe("#toSortedSet()", () => {
        const list = new List([5, 2, 3, 4, 4, 3, 9, 7, 7, 6, 8, 1, 10]);
        test("should create a sorted set from the list", () => {
            const set = list.toSortedSet();
            expect(set.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });

    describe("#toString()", () => {
        const list = new List([1, 2, 3]);
        test("should return a string representation of the list", () => {
            expect(list.toString()).to.equal("1, 2, 3");
        });
        test("should return a string representation of the list by using the separator", () => {
            expect(list.toString("|")).to.equal("1|2|3");
        });
        test("should return a string representation of the list by using the separator and the format", () => {
            const people = new List([Person.Alice, Person.Vanessa, Person.Viola, Person.Lenka, Person.Senna]);
            expect(people.toString("|", p => `${p.name}`)).to.equal("Alice|Vanessa|Viola|Lenka|Senna");
        });
        test("should return empty string if the list is empty", () => {
            const emptyList = new List<number>();
            expect(emptyList.toString()).to.equal("");
        });
    });

    describe("#union()", () => {
        test("should return a set of items from two lists", () => {
            const list1 = new List([1, 2, 3, 4, 5, 5, 5]);
            const list2 = new List([4, 5, 6, 7, 8, 9, 7]);
            const union = list1.union(list2, (n1, n2) => n1 === n2);
            expect(union.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
        test("should use default comparator if no comparator is provided", () => {
            const list1 = new List(["Alice", "Misaki", "Megumi", "Misaki"]);
            const list2 = new List(["Alice", "Rei", "Vanessa", "Vanessa", "Yuzuha"]);
            const union = list1.union(list2);
            expect(union.toArray()).to.deep.equal(["Alice", "Misaki", "Megumi", "Rei", "Vanessa", "Yuzuha"]);
            expect(union.toList().length).to.eq(6);
        });
        test("should return union of two enumerables", () => {
            const list1 = new List<Person>();
            const list2 = new List<Person>();
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90));
                list1.add(p);
            }
            for (let px = 0; px < 100000; ++px) {
                const p = new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50));
                list2.add(p);
            }
            const exceptionList = list1.union(list2, (p1, p2) => p1.age === p2.age);
            const ageCount = exceptionList.select(p => p.age).distinct().count();
            expect(ageCount).to.not.greaterThan(90);
        }, {timeout: 10000});
    });

    describe("#where()", () => {
        test("should return an IEnumerable with elements [2,5]", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = list.where(n => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
    });

    describe("#zip()", () => {
        const numberList = new List([1, 2, 3, 4]);
        const stringList = new List(["one", "two", "three"]);
        const numStrList = numberList.zip(stringList, (first: number, second: string) => `${first} ${second}`).toList();
        test("should return array of tuple if predicate is null", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = new List([true, true, false, true]);
            const result = list.zip(list2).toArray();
            const expectedResult = [[2, true], [5, true], [6, false], [99, true]];
            expect(result).to.deep.equal(expectedResult);
        });
        test("should return a zipped list with size of 3", () => {
            expect(numStrList.size()).to.eq(3);
            expect(numStrList.get(0)).to.eq("1 one");
            expect(numStrList.get(1)).to.eq("2 two");
            expect(numStrList.get(2)).to.eq("3 three");
        });
        test("should return a zipped list with size of 2", () => {
            stringList.add("four");
            stringList.add("five");
            const zippedList = numberList.takeWhile(n => n <= 2).zip(stringList, (first: number, second: string) => `${second} ${first}`).toList();
            expect(zippedList.size()).to.eq(2);
            expect(zippedList.get(0)).to.eq("one 1");
            expect(zippedList.get(1)).to.eq("two 2");
        });
    });

    describe("[Symbol.iterator]", () => {
        const list = new List([1, 2, 3, 4]);
        test("should be for-of iterable", () => {
            const output: number[] = [];
            const output2: number[] = [];
            const expectedOutput = [1, 2, 3, 4];
            const expectedOutput2 = [1, 2, 3, 4, 5];
            for (const element of list) {
                output.push(element);
            }
            for (const element of list.append(5)) {
                output2.push(element);
            }
            expect(output).to.deep.equal(expectedOutput);
            expect(output2).to.deep.equal(expectedOutput2);
        });
    });
});
