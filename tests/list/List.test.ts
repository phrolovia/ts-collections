import {describe, it} from "mocha";
import {expect} from "chai";
import {List} from "../../src/list/List";
import {Person} from "../models/Person";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {EqualityComparator} from "../../src/shared/EqualityComparator";

describe("#List", () => {

    describe("#add()", () => {
        const list = List.from([1, 2, 3]);
        it("should add element at the end of the list", () => {
            list.add(4);
            expect(list.size()).to.eq(4);
            expect(list.get(3)).to.eq(4);
        });
    });

    describe("#addAll()", () => {
        it("should add all elements from the second list to this list", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            const list2 = List.from([Person.Vanessa, Person.Viola]);
            const personArray = [...list1.toArray(), ...list2.toArray()];
            list1.addAll(list2);
            expect(list1.size()).to.eq(6);
            let index = 0;
            for (const element of list1) {
                expect(element).to.eq(personArray[index++]);
            }
        });
        it("should return true if list is changed as a result (and false if not)", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            const list2 = List.from([Person.Vanessa, Person.Viola]);
            const list3 = new List<Person>();
            const result = list1.addAll(list2);
            const result2 = list1.addAll(list3);
            expect(result).to.eq(true);
            expect(result2).to.eq(false);
        });
    });

    describe("#addAt()", () => {
        it("should throw error if index is out of bounds", () => {
            const list = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            expect(() => list.addAt(Person.Suzuha, -1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.addAt(Person.Suzuha, 5)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.addAt(Person.Bella, 2)).to.not.throw;
        });
        it("should add the element to the specified index", () => {
            const list = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            list.addAt(Person.Bella, 2);
            expect(list.get(2)).to.eq(Person.Bella);
        });
        it("should not throw error and add the element if index is equal to size", () => {
            const list = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla]);
            expect(() => list.addAt(Person.Bella, 4)).to.not.throw;
            list.addAt(Person.Bella, 4);
            expect(list.size()).to.eq(5);
            expect(list.get(4)).to.eq(Person.Bella);
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
        it(`should throw if aggregator is null`, () => {
            const list = List.from([2, 5, 6, 99]);
            expect(() => list.aggregate(null)).to.throw(ErrorMessages.NoAccumulatorProvided);
        });
        it("should throw error if list is empty and no seed is provided", () => {
            const list = List.from<number>([]);
            expect(() => list.aggregate<number>((acc, num) => acc *= num)).to.throw(ErrorMessages.NoElements);
        });
        it("should return the seed if list is empty", () => {
            const list = List.from<number>([]);
            const result = list.aggregate<number>((total, num) => total += num, -99);
            expect(result).to.eq(-99);
        });
        it("should use provided resultSelector and return 100", () => {
            const list = List.from([1, 2, 3, 4]);
            const result = list.aggregate<number>((total, num) => total += num, 0, r => Math.pow(r, 2));
            expect(result).to.eq(100);
        });
    });

    describe("#all()", () => {
        const list = List.from([Person.Alice, Person.Mel, Person.Senna, null, Person.Jane]);
        it("should not have any people younger than 9", () => {
            const all = list.all(p => !p ? true : p.age >= 9);
            expect(all).to.eq(true);
        });
        it("should have people whose names start with an uppercase letter", () => {
            const all = list.any(p => !p ? true : p.name.charAt(0).toUpperCase() === p.name.charAt(0));
            expect(all).to.eq(true);
        });
        it("should have no null items", () => {
            const all = list.all(p => p != null);
            expect(all).to.eq(false);
        });
        it("should return true if no predicate is provided and list is not empty", () => {
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

    describe("#any()", () => {
        const list = List.from([Person.Alice, Person.Mel, Person.Senna, null, Person.Jane]);
        it("should have a person with age '9'", () => {
            const any = list.any(p => p.age === 9);
            expect(any).to.eq(true);
        });
        it("should not have people whose names start with 'T'", () => {
            const any = list.any(p => p?.name.startsWith("T"));
            expect(any).to.eq(false);
        });
        it("should have null", () => {
            const any = list.any(p => p == null);
            expect(any).to.eq(true);
        });
        it("should return true if no predicate is provided and list is not empty", () => {
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

    describe("#append()", () => {
        it("should append the given element at the end of enumerable", () => {
            const list = List.from([1, 2, 3, 4, 5]);
            const enumerable = list.append(9);
            const array = enumerable.append(99).toArray();
            const array2 = enumerable.append(777).append(0).toArray();
            expect(list.size()).to.eq(5);
            expect(array.length).to.eq(7);
            expect(array2.length).to.eq(8);
            expect(list.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
            expect(array).to.deep.equal([1, 2, 3, 4, 5, 9, 99]);
            expect(array2).to.deep.equal([1, 2, 3, 4, 5, 9, 777, 0]);
        });
    });

    describe("#clear()", () => {
        const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        it("should remove all elements from the collection", () => {
            list1.clear();
            expect(list1.size()).to.eq(0);
        });
    });

    describe("#concat()", () => {
        it("should return a list with [1,2,3,4,5,5,6,7,8,9]", () => {
            const list1 = List.from([1, 2, 3, 4, 5]);
            const list2 = List.from([5, 6, 7, 8, 9]);
            const clist = list1.concat(list2);
            const array = clist.toArray();
            const array2 = clist.append(-1).toArray();
            expect(array).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
            expect(array2).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9, -1]);
        });
    });

    describe("#contains()", () => {
        const list = List.from([1, 3, 5, 6, 7, 8, 9, 2, 0, -1, 99, -99]);
        const personList = List.from([Person.Alice, Person.Mel, Person.Senna]);
        const personComparator: EqualityComparator<Person> = (p1: Person, p2: Person) => p1.name === p2.name;
        it("should contain -1", () => {
            expect(list.contains(-1)).to.eq(true);
        });
        it("should not contain -77", () => {
            expect(list.contains(-77)).to.eq(false);
        });
        it("should contain person 'Alice'", () => {
            expect(personList.contains(Person.Alice, personComparator)).to.eq(true);
        });
        it("should not contain person 'Lenka'", () => {
            expect(personList.contains(Person.Lenka, personComparator)).to.eq(false);
        });
    });

    describe("#containsAll()", () => {
        const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        const list2 = List.from([Person.Vanessa, Person.Viola]);
        it("should return false if size is smaller than the other list's size", () => {
            expect(list2.containsAll(list1)).to.eq(false);
        });
        it("should return true if list contains all the elements from the other list", () => {
            expect(list1.containsAll(list2)).to.eq(true);
        });
        it("should use the provided comparator", () => {
            const noemi = new Person("Noemi", "Green", 34);
            const list3 = List.from([noemi]);
            expect(list1.containsAll(list3)).to.eq(false);
            expect(list1.containsAll(list3, (p1, p2) => p1.name === p2.name)).to.eq(true);
        });
    });

    describe("#first()", () => {
        it("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.first()).to.throw(ErrorMessages.NoElements);
        });
        it("should return the first element if no predicate is provided.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            const first = list.first();
            expect(first).to.eq(99);
        });
        it("should throw an error if no matching element is found.", () => {
            const list = List.from([99, 2, 3, 4, 5]);
            expect(() => list.first(n => n < 0)).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return a person with name 'Alice'", () => {
            const list = List.from([Person.Mel, Person.Alice, Person.Jane]);
            const first = list.first(p => p.name === "Alice");
            expect(first.name).to.eq("Alice");
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
            const list = List.from([Person.Mel, Person.Alice, Person.Jane]);
            const first = list.firstOrDefault(p => p.name === "Alice");
            expect(first.name).to.eq("Alice");
        });
    });

    describe("#get()", () => {
        const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
        it("should throw error if index is out of bounds", () => {
            expect(() => list1.get(-1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list1.get(6)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        });
        it("should return the element at the specified index", () => {
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(5)).to.eq(Person.Viola);
            expect(list1.get(2)).to.eq(Person.Noemi);
        });
    });

    describe("#indexOf", () => {
        const list1 = List.from([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        it("should return 2", () => {
            expect(list1.indexOf(null)).to.eq(2);
        });
        it("should return 1", () => {
            expect(list1.indexOf(Person.Noemi)).to.eq(1);
        });
        it("should return 3", () => {
            expect(list1.indexOf(Person.Noemi, (p1, p2) => p1?.age > p2?.age)).to.eq(3);
        });
    });

    describe("#isEmpty()", () => {
        const list1 = List.from([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        it("should return false if list is not empty", () => {
            expect(list1.isEmpty()).to.false;
        });
        it("should return true if list is empty", () => {
            list1.removeIf(p => !p || !!p);
            expect(list1.isEmpty()).to.true;
        });
    });

    describe("#lastIndexOf", () => {
        const list1 = List.from([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        it("should return 4", () => {
            expect(list1.lastIndexOf(null)).to.eq(4);
        });
        it("should lastIndexOf 1", () => {
            expect(list1.lastIndexOf(Person.Noemi)).to.eq(1);
        });
        it("should return 3", () => {
            expect(list1.lastIndexOf(Person.Noemi, (p1, p2) => p1?.age < p2?.age)).to.eq(3);
        });
        it("should return -1", () => {
            list1.removeIf(p => !p);
            expect(list1.lastIndexOf(null)).to.eq(-1);
        });
    });

    describe("#remove()", () => {
        const list1 = List.from([Person.Alice, Person.Noemi, null, Person.Noemi2, null]);
        it("should remove null from index 2", () => {
            list1.remove(null);
            expect(list1.get(2)).to.eq(Person.Noemi2);
        });
        it("should remove older Noemi from the list", () => {
            list1.remove(Person.Noemi, (p1, p2) => p1?.name === p2?.name && p1?.age !== p2?.age);
            expect(list1.get(2)).to.eq(null);
            expect(list1.get(1)).to.eq(Person.Noemi);
        });
    });

    describe("#removeAll()", () => {
        it("should remove the elements of second list from first list", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            const list2 = List.from([Person.Vanessa, Person.Viola, Person.Noemi2]);
            list1.removeAll(list2);
            expect(list1.size()).to.eq(4);
            expect(list1.get(3)).to.eq(Person.Priscilla);
            console.log(list1.toArray());
        });
        it("should use the provided comparator for comparison", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            const list2 = List.from([Person.Vanessa, Person.Viola, Person.Noemi2]);
            list1.removeAll(list2, (p1, p2) => p1.name === p2.name);
            expect(list1.size()).to.eq(3);
            expect(list1.get(2)).to.eq(Person.Priscilla);
        });
    });

    describe("#removeAt()", () => {
        it("should throw error if index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => list.removeAt(-1)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.removeAt(44)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        });
        it("should remove element from the specified index", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            list1.removeAt(5);
            expect(list1.size()).to.eq(5);
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(4)).to.eq(Person.Vanessa);
        });
    });

    describe("#removeIf()", () => {
        it("should remove people whose names are longer than 5 characters from the list", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            list1.removeIf(p => p.name.length > 5);
            expect(list1.size()).to.eq(3);
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(1)).to.eq(Person.Noemi);
            expect(list1.get(2)).to.eq(Person.Viola);
        });
    });

    describe("#retainAll()", () => {
        it("should remove elements that are not in the specified list", () => {
            const list1 = List.from([3, 4, 1, 2, 5]);
            const list2 = List.from([5, 4]);
            list1.retainAll(list2);
            expect(list1.size()).to.eq(2);
            expect(list1.get(0)).to.eq(4);
            expect(list1.get(1)).to.eq(5);
        });
        it("should use the provided comparator", () => {
            const list1 = List.from([Person.Alice, Person.Lucrezia, Person.Noemi, Person.Priscilla, Person.Vanessa, Person.Viola]);
            const list2 = List.from([Person.Vanessa, Person.Viola, Person.Noemi2]);
            list1.retainAll(list2, (p1, p2) => p1.name === p2.name);
            expect(list1.size()).to.eq(3);
            expect(list1.get(0)).to.eq(Person.Noemi);
            expect(list1.get(1)).to.eq(Person.Vanessa);
            expect(list1.get(2)).to.eq(Person.Viola);
        });
    });

    describe("#set", () => {
        it("should throw error if index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => list.set(-1, 111)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            expect(() => list.set(44, 111)).to.throw(ErrorMessages.IndexOutOfBoundsException);
            list.clear();
            expect(() => list.set(0, 111)).to.throw(ErrorMessages.IndexOutOfBoundsException);
        })
        it("should change the element at the specified index with the provided element", () => {
            const list = new List([1, 2, 3, 4, 5]);
            list.set(1, 222);
            expect(list.size()).to.eq(5);
            expect(list.get(1)).to.eq(222);
            expect(list.indexOf(2)).to.eq(-1);
        })
    });

    describe("$size()", () => {
        const list = new List([1, 2, 3, 4, 5]);
        it("should return the size of the list", () => {
            expect(list.size()).to.eq(5);
            list.removeAt(0);
            expect(list.size()).to.eq(4);
            list.clear();
            expect(list.size()).to.eq(0);
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
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skip(100).toList();
            expect(list2.size()).to.eq(0);
        });
    });

    describe("#toList()", () => {
        const list = List.from([1, 2, 3]);
        const list2 = list.append(4).toList();
        it("should return a new List without altering the current list", () => {
            expect(list.size()).to.eq(3);
            expect(list2 instanceof List).to.be.true;
            expect(list2.size()).to.eq(4);
            expect(list === list2).to.be.false;
        });
    });

    describe("[Symbol.iterator]", () => {
        const list = List.from([1, 2, 3, 4]);
        it("should be for-of iterable", () => {
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
