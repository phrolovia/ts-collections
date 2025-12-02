import { describe, expect, expectTypeOf, test } from "vitest";
import { Enumerable } from "../../src/enumerator/Enumerable";
import { from } from "../../src/enumerator/functions/from";
import { IEnumerable } from "../../src/enumerator/IEnumerable";
import { CircularLinkedList } from "../../src/list/CircularLinkedList";
import { ImmutableList } from "../../src/list/ImmutableList";
import { List } from "../../src/list/List";
import { CircularQueue } from "../../src/queue/CircularQueue";
import { ImmutableCircularQueue } from "../../src/queue/ImmutableCircularQueue";
import { ImmutableQueue } from "../../src/queue/ImmutableQueue";
import { PriorityQueue } from "../../src/queue/PriorityQueue";
import { DimensionMismatchException } from "../../src/shared/DimensionMismatchException";
import { EqualityComparator } from "../../src/shared/EqualityComparator";
import { IndexOutOfBoundsException } from "../../src/shared/IndexOutOfBoundsException";
import { InsufficientElementException } from "../../src/shared/InsufficientElementException";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";
import { MoreThanOneElementException } from "../../src/shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../../src/shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../../src/shared/NoElementsException";
import { NoMatchingElementException } from "../../src/shared/NoMatchingElementException";
import { Stack } from "../../src/stack/Stack";
import { Helper } from "../helpers/Helper";
import { ApiResponse, ApiResponseSuccess, isError, isLoading, isSuccess } from "../models/ApiResponse";
import { Pair } from "../models/Pair";
import { Person } from "../models/Person";
import { School } from "../models/School";
import { SchoolStudents } from "../models/SchoolStudents";
import { Student } from "../models/Student";
import "../../src/lookup/Lookup";

describe("List", () => {
    const personNameComparator = (p1: Person, p2: Person) =>
        p1.name === p2.name;
    const responses = new List<ApiResponse<Person>>([
        { status: "success", data: Person.Alice },
        { status: "error", error: "Not found" },
        { status: "success", data: Person.Bella },
        { status: "error", error: "Server error" },
        { status: "success", data: Person.Mel },
        { status: "loading", estimatedTime: 4000 }
    ]);
    const responseArray = responses.toArray();

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
            const list1 = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla
            ]);
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
            const list1 = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla
            ]);
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
            const list = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla
            ]);
            expect(() => list.addAt(Person.Suzuha, -1)).toThrow(
                new IndexOutOfBoundsException(-1)
            );
            expect(() => list.addAt(Person.Suzuha, 5)).toThrow(
                new IndexOutOfBoundsException(5)
            );
            expect(() => list.addAt(Person.Bella, 2)).to.not.throw;
            expect(list.length).to.eq(4);
        });
        test("should add the element to the specified index", () => {
            const list = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla
            ]);
            list.addAt(Person.Bella, 2);
            expect(list.get(2)).to.eq(Person.Bella);
            expect(list.length).to.eq(5);
        });
        test("should not throw error and add the element if index is equal to size", () => {
            const list = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla
            ]);
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
            const result = list.aggregate(
                (total, next) => (next % 2 === 0 ? total + 1 : total),
                0
            );
            expect(result).to.eq(6);
        });
        test("should return pomegranate", () => {
            const list = new List([
                "apple",
                "mango",
                "orange",
                "pomegranate",
                "grape"
            ]);
            const result = list.aggregate(
                (longest, next) =>
                    next.length > longest.length ? next : longest,
                "banana"
            );
            expect(result).to.eq("pomegranate");
        });
        test("should return 10", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.aggregate<number>(
                (total, num) => (total += num)
            );
            expect(result).to.eq(10);
        });
        test("should throw error if list is empty and no seed is provided", () => {
            const list = new List<number>([]);
            expect(() =>
                list.aggregate<number>((acc, num) => (acc *= num))
            ).toThrow(new NoElementsException());
        });
        test("should return the seed if list is empty", () => {
            const list = new List<number>([]);
            const result = list.aggregate<number>(
                (total, num) => (total += num),
                -99
            );
            expect(result).to.eq(-99);
        });
        test("should use provided resultSelector and return 100", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.aggregate<number>(
                (total, num) => (total += num),
                0,
                (r) => Math.pow(r, 2)
            );
            expect(result).to.eq(100);
        });
    });

    describe("#aggregateBy()", () => {
        test("should aggregate by name and produce (name, sum of ages) pairs", () => {
            const list = new List([
                Person.Alice,
                Person.Noemi,
                Person.Noemi2,
                Person.Kaori
            ]);
            const result = list.aggregateBy(
                (p) => p.name,
                () => 0,
                (acc, p) => acc + p.age
            );
            const obj = result.toObject(
                (p) => p.key,
                (p) => p.value
            );
            expect(obj).to.deep.equal({ Alice: 23, Noemi: 72, Kaori: 10 });
        });
        test("should use provided key comparator", () => {
            const LittleKaori = new Person("kaori", "Furuya", 6);
            const list = new List([
                Person.Alice,
                Person.Noemi,
                Person.Noemi2,
                Person.Kaori,
                LittleKaori
            ]);
            const result = list.aggregateBy(
                (p) => p.name,
                () => 0,
                (acc, p) => acc + p.age
            );
            const result2 = list.aggregateBy(
                (p) => p.name,
                () => 0,
                (acc, p) => acc + p.age,
                (k1, k2) =>
                    k1.toLowerCase().localeCompare(k2.toLowerCase()) === 0
            );
            const obj = result.toObject(
                (p) => p.key,
                (p) => p.value
            );
            const obj2 = result2.toObject(
                (p) => p.key,
                (p) => p.value
            );
            expect(obj).to.deep.equal({
                Alice: 23,
                Noemi: 72,
                Kaori: 10,
                kaori: 6
            });
            expect(obj2).to.deep.equal({ Alice: 23, Noemi: 72, Kaori: 16 });
        });
        test("should work with non-function seeds", () => {
            const list = new List([
                Person.Alice,
                Person.Noemi,
                Person.Noemi2,
                Person.Kaori
            ]);
            const result = list.aggregateBy(
                (p) => p.name,
                0,
                (acc, p) => acc + p.age
            );
            const obj = result.toObject(
                (p) => p.key,
                (p) => p.value
            );
            expect(obj).to.deep.equal({ Alice: 23, Noemi: 72, Kaori: 10 });
        });
    });

    describe("#all()", () => {
        const list = new List([
            Person.Alice,
            Person.Mel,
            Person.Senna,
            null,
            Person.Jane
        ]);
        test("should not have any people younger than 9", () => {
            const all = list.all((p) => (!p ? true : p.age >= 9));
            expect(all).to.eq(true);
        });
        test("should have people whose names start with an uppercase letter", () => {
            const all = list.any((p) =>
                !p ? true : p.name.charAt(0).toUpperCase() === p.name.charAt(0)
            );
            expect(all).to.eq(true);
        });
        test("should have no null items", () => {
            const all = list.all((p) => p != null);
            expect(all).to.eq(false);
        });
    });

    describe("#any()", () => {
        const list = new List([
            Person.Alice,
            Person.Mel,
            Person.Senna,
            null,
            Person.Jane
        ]);
        test("should have a person with age '9'", () => {
            const any = list.any((p) => p?.age === 9);
            expect(any).to.eq(true);
        });
        test("should not have people whose names start with 'T'", () => {
            const any = list.any((p) => p?.name.startsWith("T") === true);
            expect(any).to.eq(false);
        });
        test("should have null", () => {
            const any = list.any((p) => p == null);
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

    describe("#atLeast()", () => {
        test("should return true if there are at least 3 elements greater than 5", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atLeast = list.atLeast(3, n => n > 5);
            expect(atLeast).to.eq(true);
        });
        test("should return false if there are not at least 5 elements greater than 5", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atLeast = list.atLeast(5, n => n > 5);
            expect(atLeast).to.eq(false);
        });
        test("should return true if there are at least 1 element in the list", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atLeast = list.atLeast(1);
            expect(atLeast).to.eq(true);
        });
        test("should return false if there are not at least 1 element in the list", () => {
            const list = new List<number>([]);
            const atLeast = list.atLeast(1);
            const atLeast2 = list.atLeast(0);
            expect(atLeast).to.eq(false);
            expect(atLeast2).to.eq(true);
        });
        test("should throw error if count is less than 0", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            expect(() => list.atLeast(-1)).toThrowError(
                new InvalidArgumentException("Count must be greater than or equal to 0.", "count")
            );
        });
    });

    describe("#atMost()", () => {
        test("should return true if there are at most 3 elements greater than 6", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atMost = list.atMost(3, n => n > 6);
            expect(atMost).to.eq(true);
        });
        test("should return false if there are not at most 2 elements greater than 5", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atMost = list.atMost(2, n => n > 5);
            expect(atMost).to.eq(false);
        });
        test("should return true if there are at most 10 element in the list", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atMost = list.atMost(10);
            expect(atMost).to.eq(true);
        });
        test("should return false if there are not at most 0 element in the list", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            const atMost = list.atMost(0);
            expect(atMost).to.eq(false);
        });
        test("should throw error if count is less than 0", () => {
            const list = new List([1, 2, 3, 6, 7, 8, 9]);
            expect(() => list.atMost(-1)).toThrowError(
                new InvalidArgumentException("Count must be greater than or equal to 0.", "count")
            );
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
            expect(() => list.average(s => parseInt(s, 10))).toThrow(
                new NoElementsException()
            );
        });
    });

    describe("#cast()", () => {
        const mixedList = new List([1, 2, 3, "4", "5", "6", 7, 8, 9, "10"]);
        const numbers = mixedList
            .where((n) => typeof n === "number")
            .cast<number>();
        const strings = mixedList
            .where((s) => typeof s === "string")
            .cast<string>();
        test("should return a list of numbers", () => {
            expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9]);
        });
        test("should return a list of strings", () => {
            expect(strings.toArray()).to.deep.equal(["4", "5", "6", "10"]);
        });
    });

    describe("#cartesian()", () => {
        test("should return cartesian product of two lists", () => {
            const list1 = new List([1, 2]);
            const list2 = new List(["x", "y", "z"]);
            const result = list1.cartesian(list2).toArray();
            const expected = [[1, "x"], [1, "y"], [1, "z"], [2, "x"], [2, "y"], [2, "z"]];
            expect(result).to.deep.equal(expected);
        });
        test("should return empty list if first list is empty", () => {
            const list1 = new List();
            const list2 = new List(["x", "y", "z"]);
            const result = list1.cartesian(list2).toArray();
            expect(result).to.deep.equal([]);
        });
        test("should return empty list if second list is empty", () => {
            const list1 = new List([1, 2]);
            const list2 = new List();
            const result = list1.cartesian(list2).toArray();
            expect(result).to.deep.equal([]);
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
            expect(() => list.chunk(0)).toThrowError(
                new InvalidArgumentException(
                    `Invalid argument: size. Size must be greater than 0.`
                )
            );
        });
    });

    describe("#clear()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Lucrezia,
            Person.Noemi,
            Person.Priscilla,
            Person.Vanessa,
            Person.Viola
        ]);
        test("should remove all elements from the collection", () => {
            list1.clear();
            expect(list1.size()).to.eq(0);
            expect(list1.length).to.eq(0);
        });
    });

    describe("#combinations()", () => {
        const list = new List([1, 2, 3]);
        test("should return all combinations", () => {
            const combinations = list.combinations();
            const array = combinations.select((c) => c.toArray()).toArray();
            expect(array).to.deep.equal([
                [],
                [1],
                [2],
                [1, 2],
                [3],
                [1, 3],
                [2, 3],
                [1, 2, 3]
            ]);
        });
        test("should return all combinations of length 2", () => {
            const combinations = list.combinations(2);
            const array = combinations.select((c) => c.toArray()).toArray();
            expect(array).to.deep.equal([
                [1, 2],
                [1, 3],
                [2, 3]
            ]);
        });
        test("should return all combinations of length 3", () => {
            const combinations = list.combinations(3);
            const array = combinations.select((c) => c.toArray()).toArray();
            expect(array).to.deep.equal([[1, 2, 3]]);
        });
        test("should return all combinations of length 4", () => {
            const combinations = list.combinations(4);
            const array = combinations.select((c) => c.toArray()).toArray();
            expect(array).to.deep.equal([]);
        });
        test("should return all combinations of length 0", () => {
            const combinations = list.combinations(0);
            const array = combinations.select((c) => c.toArray()).toArray();
            expect(array).to.deep.equal([[]]);
        });
        test("it should return all combinations of length 1", () => {
            const combinations = list.combinations(1);
            const array = combinations.select((c) => c.toArray()).toArray();
            expect(array).to.deep.equal([[1], [2], [3]]);
        });
        test("should return an empty list if source list is empty", () => {
            const list = new List<number>();
            const combinations = list.combinations();
            expect(combinations.toArray()).to.deep.equal([]);
        });
        test("should throw error if length is less than 0", () => {
            expect(() => list.combinations(-1)).toThrowError(
                "Size must be greater than or equal to 0."
            );
        });
    });

    describe("#compact()", () => {
        test("should filter out null and undefined elements", () => {
            const list = new List([1, "a", null, false, undefined]);
            const result = list.compact().toArray();
            const expected = [1, "a", false];
            expect(result).to.deep.equal(expected);
            expectTypeOf(result).toEqualTypeOf<Array<number | string | boolean>>();
        });
    });

    describe("#concat()", () => {
        test("should return a list with [1,2,3,4,5,5,6,7,8,9]", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const clist = list1.concat([5, 6, 7, 8, 9]);
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
        const personComparator: EqualityComparator<Person> = (
            p1: Person,
            p2: Person
        ) => p1.name === p2.name;
        test("should contain -1", () => {
            expect(list.contains(-1)).to.eq(true);
        });
        test("should not contain -77", () => {
            expect(list.contains(-77)).to.eq(false);
        });
        test("should contain person 'Alice'", () => {
            expect(personList.contains(Person.Alice, personComparator)).to.eq(
                true
            );
        });
        test("should not contain person 'Lenka'", () => {
            expect(personList.contains(Person.Lenka, personComparator)).to.eq(
                false
            );
        });
        test("should run fast with big collections", () => {
            const bigPeopleArray = Helper.generateRandomPerson(200000);
            const searchedPerson = new Person("Mona", "Lumia", 21);
            bigPeopleArray.splice(
                Helper.generateRandomNumber(0, bigPeopleArray.length - 1),
                0,
                searchedPerson
            );
            const list = new List(bigPeopleArray);
            const includes = list.contains(searchedPerson, personComparator);
            expect(includes).to.be.true;
        });
    });

    describe("#containsAll()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Lucrezia,
            Person.Noemi,
            Person.Priscilla,
            Person.Vanessa,
            Person.Viola
        ]);
        const list2 = new List([Person.Vanessa, Person.Viola]);
        test("should return false if size is smaller than the other list's size", () => {
            expect(list2.containsAll(list1)).to.eq(false);
        });
        test("should return true if list contains all the elements from the other list", () => {
            expect(list1.containsAll(list2)).to.eq(true);
        });
    });

    describe("#correlation()", () => {
        test("should return correlation of two lists", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([2, 4, 6, 8, 10]);
            const correlation = list1.correlation(list2);
            expect(correlation).to.eq(1);
        });
        test("should return 1 for identical lists", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([1, 2, 3, 4, 5]);
            const correlation = list1.correlation(list2);
            expect(correlation).to.eq(1);
        });
        test("should throw error if lists have different sizes", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([2, 4, 6, 8]);
            expect(() => list1.correlation(list2)).toThrowError(
                new DimensionMismatchException()
            );
        });
        test("should throw error if lists are empty", () => {
            const list1 = new List<number>();
            const list2 = new List<number>();
            expect(() => list1.correlation(list2)).toThrowError(
                new InsufficientElementException("Correlation requires at least two pairs of elements.")
            );
        });
        test("should throw error if lists have only one element", () => {
            const list1 = new List([1]);
            const list2 = new List([2]);
            expect(() => list1.correlation(list2)).toThrowError(
                new InsufficientElementException("Correlation requires at least two pairs of elements.")
            );
        });
    });

    describe("#correlationBy()", () => {
        test("should return correlation of two lists based on selectors", () => {
            const list1 = new List([
                { value: 1, amount: 11 },
                { value: 2, amount: 22 },
                { value: 3, amount: 33 },
                { value: 4, amount: 44 },
                { value: 5, amount: 55 }
            ]);
            const correlation = list1.correlationBy(
                x => x.value,
                x => x.amount
            );
            expect(correlation).to.eq(1);
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
            const count = list.count((n) => n < 5);
            expect(count).to.eq(5);
        });
        test("should use list's size if predicate is not provided", () => {
            const list = new List([1, 9, 2, 8, 3, 7, 4, 6, 5, 0]);
            const count = list.count();
            expect(count).to.eq(10);
        });
    });

    describe("#countBy()", () => {
        const list = new List([
            Person.Noemi,
            Person.Noemi2,
            Person.Suzuha,
            Person.Suzuha2,
            Person.Suzuha3,
            Person.Eliza
        ]);
        test("should return 2", () => {
            const countPairs = list.countBy((p) => p.name);
            const noemiCount = countPairs.first((p) => p.key === "Noemi").value;
            expect(noemiCount).to.eq(2);
        });
        test("should return 3", () => {
            const countPairs = list.countBy((p) => p.name);
            const suzuhaCount = countPairs.first(
                (p) => p.key === "Suzuha"
            ).value;
            expect(suzuhaCount).to.eq(3);
        });
        test("should return 1", () => {
            const countPairs = list.countBy((p) => p.name);
            const elizaCount = countPairs.first((p) => p.key === "Eliza").value;
            expect(elizaCount).to.eq(1);
        });
        test("should return 0", () => {
            const countPairs = list.countBy((p) => p.name);
            const aliceCount = countPairs.count((p) => p.key === "Alice");
            expect(aliceCount).to.eq(0);
        });
        test("should use provided comparator", () => {
            const LittleEliza = new Person("eliza", "Nymph", 9);
            const list2 = new List([...list, LittleEliza]);
            const countPairs1 = list2.countBy(
                (p) => p.name,
                (n1, n2) => n1.localeCompare(n2) === 0
            );

            const elizaCountBig = countPairs1.first(
                (p) => p.key === "Eliza"
            ).value;
            expect(elizaCountBig).to.eq(1);

            const elizaCountLittle = countPairs1.first(
                (p) => p.key === "eliza"
            ).value;
            expect(elizaCountLittle).to.eq(1);

            const countPairs2 = list2.countBy(
                (p) => p.name,
                (n1, n2) =>
                    n1.toLowerCase().localeCompare(n2.toLowerCase()) === 0
            );
            const elizaCountAll = countPairs2.first(
                (p) => p.key === "Eliza"
            ).value;
            expect(elizaCountAll).to.eq(2);
        });
    });

    describe("#covariance", () => {
        test("should return covariance of two lists", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([2, 4, 6, 8, 10]);
            const sampleCovariance = list1.covariance(list2);
            const populationCovariance = list1.covariance(list2, x => x, y => y, false);
            expect(sampleCovariance).to.eq(5);
            expect(populationCovariance).to.eq(4);
        });
        test("should throw error if lists have different sizes", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([2, 4, 6, 8]);
            expect(() => list1.covariance(list2)).toThrowError(
                new DimensionMismatchException()
            );
        });
        test("should throw error if lists are empty", () => {
            const list1 = new List<number>();
            const list2 = new List<number>();
            expect(() => list1.covariance(list2)).toThrowError(
                new InsufficientElementException("Covariance requires at least two pairs of elements.")
            );
        });
        test("should throw error if lists have only one element", () => {
            const list1 = new List([1]);
            const list2 = new List([2]);
            expect(() => list1.covariance(list2)).toThrowError(
                new InsufficientElementException("Covariance requires at least two pairs of elements.")
            );
        });
        test("should return 0 if one list has no variance", () => {
            const list1 = new List([3, 3, 3, 3, 3]);
            const list2 = new List([2, 4, 6, 8, 10]);
            const covariance = list1.covariance(list2);
            expect(covariance).to.eq(0);
        });
        test("should return 0 if both lists have no variance", () => {
            const list1 = new List([3, 3, 3, 3, 3]);
            const list2 = new List([7, 7, 7, 7, 7]);
            const covariance = list1.covariance(list2);
            expect(covariance).to.eq(0);
        });
        test("should return negative covariance", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([10, 8, 6, 4, 2]);
            const covariance = list1.covariance(list2);
            expect(covariance).to.eq(-5);
        });
        test("should use selectors", () => {
            const list1 = new List([
                { value: 1 },
                { value: 2 },
                { value: 3 },
                { value: 4 },
                { value: 5 }
            ]);
            const list2 = new List([
                { value: 2 },
                { value: 4 },
                { value: 6 },
                { value: 8 },
                { value: 10 }
            ]);
            const covariance = list1.covariance(list2, x => x.value, y => y.value);
            expect(covariance).to.eq(5);
        });
    });

    describe("#covarianceBy()", () => {
        test("should return covariance by two keys of one list", () => {
            const list = new List([
                new Pair(1, 2),
                new Pair(2, 4),
                new Pair(3, 6),
                new Pair(4, 8),
                new Pair(5, 10)
            ]);
            const sampleCovariance = list.covarianceBy(p => p.key, p => p.value);
            const populationCovariance = list.covarianceBy(p => p.key, p => p.value, false);
            expect(sampleCovariance).to.eq(5);
            expect(populationCovariance).to.eq(4);
        });
        test("should throw error if list has less than two elements", () => {
            const list1 = new List<Pair<number, number>>([]);
            expect(() => list1.covarianceBy(p => p.key, p => p.value)).toThrowError(
                new InsufficientElementException("Covariance requires at least two pairs of elements.")
            );
            const list2 = new List([new Pair(1, 2)]);
            expect(() => list2.covarianceBy(p => p.key, p => p.value)).toThrowError(
                new InsufficientElementException("Covariance requires at least two pairs of elements.")
            );
        });
        test("should return 0 if one key has no variance", () => {
            const list = new List([
                new Pair(3, 2),
                new Pair(3, 4),
                new Pair(3, 6),
                new Pair(3, 8),
                new Pair(3, 10)
            ]);
            const covariance = list.covarianceBy(p => p.key, p => p.value);
            expect(covariance).to.eq(0);
        });
        test("should return 0 if both keys have no variance", () => {
            const list = new List([
                new Pair(3, 7),
                new Pair(3, 7),
                new Pair(3, 7),
                new Pair(3, 7),
                new Pair(3, 7)
            ]);
            const covariance = list.covarianceBy(p => p.key, p => p.value);
            expect(covariance).to.eq(0);
        });
        test("should return negative covariance", () => {
            const list = new List([
                new Pair(1, 10),
                new Pair(2, 8),
                new Pair(3, 6),
                new Pair(4, 4),
                new Pair(5, 2)
            ]);
            const covariance = list.covarianceBy(p => p.key, p => p.value);
            expect(covariance).to.eq(-5);
        });
    });

    describe("#cycle()", () => {
        test("should return an infinite iterable", () => {
            const list = new List([1, 2, 3]);
            const cycle = list.cycle();
            const iterator = cycle[Symbol.iterator]();
            for (let i = 0; i < 100; ++i) {
                const value = iterator.next().value;
                expect(value).to.eq((i % 3) + 1);
            }
        });
        test("should return an iterable with 10 elements", () => {
            const list = new List([1, 2, 3]);
            const cycle = list.cycle(3);
            const cycle2 = list.cycle(4);
            const array = cycle.toArray();
            const array2 = cycle2.toArray();
            expect(array).to.deep.equal([1, 2, 3, 1, 2, 3, 1, 2, 3]);
            expect(array2).to.deep.equal([1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]);
        });
        test("should return an iterable with 0 elements", () => {
            const list = new List([1, 2, 3]);
            const cycle = list.cycle(0);
            expect(cycle.toArray()).to.deep.equal([]);
        });
        test("should return an empty iterable if count is less than 0", () => {
            const list = new List([1, 2, 3]);
            const cycle = list.cycle(-1);
            expect(cycle.toArray()).to.deep.equal([]);
        });
        test("should throw error if source list is empty", () => {
            const list = new List<number>();
            expect(() => list.cycle().toList()).toThrowError(
                "Sequence contains no elements."
            );
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

    describe("#disjoint()", () => {
        test("should return true if two lists have no elements in common", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List([4, 5, 6]);
            expect(list1.disjoint(list2)).to.be.true;
        });
        test("should return false if two lists have elements in common", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List([3, 4, 5, 6]);
            expect(list1.disjoint(list2)).to.be.false;
        });
        test("should return true if one list is empty", () => {
            const list1 = new List<number>([]);
            const list2 = new List([3, 4, 5, 6]);
            expect(list1.disjoint(list2)).to.be.true;
            expect(list2.disjoint(list1)).to.be.true;
        });
        test("should return true if both lists are empty", () => {
            const list1 = new List<number>([]);
            const list2 = new List<number>([]);
            expect(list1.disjoint(list2)).to.be.true;
        });
        test("should use provided comparator", () => {
            const list1 = new List([Person.Alice, Person.Mel, Person.Senna]);
            const list2 = new List([Person.Hanna, Person.Hanna2, Person.Noemi]);
            const list3 = new List([Person.Senna, Person.Lucrezia, Person.Vanessa]);
            const comparator: EqualityComparator<Person> = (p1, p2) =>
                p1.name === p2.name;
            expect(list1.disjoint(list2, comparator)).to.be.true;
            expect(list1.disjoint(list3, comparator)).to.be.false;
        });
        test("should work with different types", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List(["1", "2", "3"]);
            const comparator: EqualityComparator<number | string> = (a, b) =>
                a.toString() === b.toString();
            expect(list1.disjoint(list2)).to.be.true;
            expect(list1.disjoint(list2, comparator)).to.be.false;
        });
    });

    describe("#disjointBy()", () => {
        test("should return true if two lists have no elements in common based on key", () => {
            const list1 = new List([Person.Alice, Person.Mel, Person.Senna]);
            const list2 = new List([Person.Hanna, Person.Hanna2, Person.Noemi]);
            expect(list1.disjointBy(list2, p => p.name, p => p.name)).to.be.true;
        });
        test("should return false if two lists have elements in common based on key", () => {
            const list1 = new List([Person.Alice, Person.Mel, Person.Suzuha]);
            const list2 = new List([Person.Suzuha2, Person.Lucrezia, Person.Vanessa]);
            expect(list1.disjointBy(list2, p => p, p => p)).to.be.true;
            expect(list1.disjointBy(list2, p => p.name, p => p.name)).to.be.false;
        });
        test("should return true if one list is empty", () => {
            const list1 = new List<Person>([]);
            const list2 = new List([Person.Suzuha, Person.Lucrezia, Person.Vanessa]);
            expect(list1.disjointBy(list2, p => p.name, p => p.name)).to.be.true;
            expect(list2.disjointBy(list1, p => p.name, p => p.name)).to.be.true;
        });
        test("should return true if both lists are empty", () => {
            const list1 = new List<Person>([]);
            const list2 = new List<Person>([]);
            expect(list1.disjointBy(list2, p => p.name, p => p.name)).to.be.true;
        });
        test("should work with different types", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List(["1", "2", "3"]);
            expect(list1.disjointBy(list2, n => n, s => s)).to.be.true;
            expect(list1.disjointBy(list2, n => n.toString(), s => s)).to.be.false;
        });
    });

    describe("#distinct()", () => {
        test("should remove duplicate elements", () => {
            const list = new List([
                Person.Alice,
                Person.Mel,
                Person.Senna,
                Person.Mel,
                Person.Alice
            ]);
            const distinct = list.distinct();
            expect(distinct.toArray()).to.deep.equal([
                Person.Alice,
                Person.Mel,
                Person.Senna
            ]);
            expect(distinct.toList().length).to.eq(3);
        });
        test("should use default comparator if no comparator is provided", () => {
            const list1 = new List([1, 2, 3, 1, 1, 1, 4, 5, 4, 3]);
            const list2 = new List([
                "Alice",
                "Vanessa",
                "Misaki",
                "Alice",
                "Misaki",
                "Megumi",
                "Megumi"
            ]);
            const distinct1 = list1.distinct().toArray();
            const distinct2 = list2.distinct().toArray();
            expect(distinct1).to.deep.equal([1, 2, 3, 4, 5]);
            expect(distinct2).to.deep.equal([
                "Alice",
                "Vanessa",
                "Misaki",
                "Megumi"
            ]);
        });
        test("should use provided comparator for key comparison", () => {
            const list2 = new List([
                Person.Alice,
                Person.Hanna,
                Person.Hanna2,
                Person.Noemi,
                Person.Noemi2
            ]);
            const distinct2 = list2
                .distinct((p1, p2) => p1.name.localeCompare(p2.name) === 0)
                .toArray();
            expect(distinct2).to.deep.equal([
                Person.Alice,
                Person.Hanna,
                Person.Noemi
            ]);
        });
    });

    describe("#distinctBy()", () => {
        test("should return original list", () => {
            const list = new List([Person.Noemi, Person.Noemi2]);
            const distinct = list.distinctBy((p) => p);
            const distinct2 = list.distinctBy((p) => p.name);
            expect(distinct.toArray()).to.deep.equal([
                Person.Noemi,
                Person.Noemi2
            ]);
            expect(distinct2.toArray()).to.deep.equal([Person.Noemi]);
        });
        test("should remove duplicate elements", () => {
            const list = new List([
                Person.Alice,
                Person.Mel,
                Person.Senna,
                Person.Mel,
                Person.Alice
            ]);
            const distinct = list.distinctBy((p) => p.name);
            expect(distinct.toArray()).to.deep.equal([
                Person.Alice,
                Person.Mel,
                Person.Senna
            ]);
            expect(distinct.toList().length).to.eq(3);
        });
        test("should use provided comparator for key comparison", () => {
            const LittleHanna = new Person("hanna", "Nymph", 9);
            const list2 = new List([
                Person.Alice,
                Person.Hanna,
                Person.Hanna2,
                Person.Noemi,
                Person.Noemi2,
                LittleHanna
            ]);
            const distinct2 = list2
                .distinctBy(
                    (p) => p.name,
                    (n1, n2) =>
                        n1.toLowerCase().localeCompare(n2.toLowerCase()) === 0
                )
                .toArray();
            expect(distinct2).to.deep.equal([
                Person.Alice,
                Person.Hanna,
                Person.Noemi
            ]);
        });
    });

    describe("#distinctUntilChanged()", () => {
        test("should return distinct contiguous elements", () => {
            const list = new List([1, 1, 2, 2, 2, 1, 3, 3]);
            const distinct = list.distinctUntilChanged().toArray();
            expect(distinct).to.deep.equal([1, 2, 1, 3]);
        });
        test("should return empty list if source is empty", () => {
            const list = new List([]);
            const distinct = list.distinctUntilChanged().toArray();
            expect(distinct).to.deep.equal([]);
        });
        test("should use provided comparator for key comparison", () => {
            const list = new List(["a", "a", "A", "b"]);
            const distinctWithoutComparator = list.distinctUntilChanged().toArray();
            const distinctWithComparator = list.distinctUntilChanged((e1, e2) => e1.toLowerCase().localeCompare(e2.toLowerCase()) === 0).toArray();
            expect(distinctWithoutComparator).to.deep.equal(["a", "A", "b"]);
            expect(distinctWithComparator).to.deep.equal(["a", "b"]);
        });
    });

    describe("#distinctUntilChangedBy()", () => {
        test("should return distinct contiguous elements", () => {
            const list = new List([Person.Alice, Person.Alice, Person.Noemi, Person.Noemi2, Person.Rui]);
            const distinct = list.distinctUntilChangedBy(p => p.name).toArray();
            expect(distinct).to.deep.equal([Person.Alice, Person.Noemi, Person.Rui]);
        });
        test("should return empty list if source is empty", () => {
            const list = new List([]);
            const distinct = list.distinctUntilChangedBy(k => k).toArray();
            expect(distinct).to.deep.equal([]);
        });
        test("should use provided comparator for key comparison", () => {
            const littleAlice = new Person("alice", "Rivermist", 9);
            const list = new List([Person.Alice, littleAlice, Person.Ayana]);
            const distinctWithoutComparator = list.distinctUntilChangedBy(p => p.name).toArray();
            const distinctWithComparator = list.distinctUntilChangedBy(p => p.name, (e1, e2) => e1.toLowerCase().localeCompare(e2.toLowerCase()) === 0).toArray();
            expect(distinctWithoutComparator).to.deep.equal([Person.Alice, littleAlice, Person.Ayana]);
            expect(distinctWithComparator).to.deep.equal([Person.Alice, Person.Ayana]);
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

    describe("#exactly()", () => {
        test("should return true if list has exactly 3 elements", () => {
            const list = new List([1, 2, 3]);
            expect(list.exactly(3)).to.be.true;
        });
        test("should return false if list does not have exactly 3 elements", () => {
            const list = new List([1, 2, 3, 4]);
            expect(list.exactly(3)).to.be.false;
        });
        test("should return true if list has exactly 0 elements", () => {
            const list = new List();
            expect(list.exactly(0)).to.be.true;
        });
        test("should return false if list does not have exactly 0 elements", () => {
            const list = new List([1]);
            expect(list.exactly(0)).to.be.false;
        });
        test("should return false if predicate does not match exactly 3 elements", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(list.exactly(3, n => n % 2 === 0)).to.be.false;
        });
        test("should return true if predicate matches exactly 2 elements", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(list.exactly(2, n => n % 2 === 0)).to.be.true;
        });
        test("should throw error if count is less than 0", () => {
            const list = new List([1, 2, 3]);
            expect(() => list.exactly(-1)).toThrowError(
                new InvalidArgumentException("Count must be greater than or equal to 0.", "count")
            );
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
        test("should return an array of [1,2]", () => {
            const list1 = new List([1, 1, 2]);
            const list2 = new List<number>([]);
            const elist = list1.except(list2).toList();
            expect(elist.toArray()).to.deep.equal([1, 2]);
        });
        test("should only have 'Alice', 'Noemi' and 'Senna'", () => {
            const list1 = new List([
                Person.Alice,
                Person.Noemi,
                Person.Mel,
                Person.Senna,
                Person.Lenka,
                Person.Jane
            ]);
            const list2 = new List([
                Person.Mel,
                Person.Lenka,
                Person.Jane,
                Person.Noemi2
            ]);
            const elist = list1.except(list2);
            expect(elist.toArray()).to.deep.equal([
                Person.Alice,
                Person.Noemi,
                Person.Senna
            ]);
        });
        test("should only have 'Alice' and 'Senna'", () => {
            const list1 = new List([
                Person.Alice,
                Person.Noemi,
                Person.Mel,
                Person.Senna,
                Person.Lenka,
                Person.Jane
            ]);
            const list2 = new List([
                Person.Mel,
                Person.Lenka,
                Person.Jane,
                Person.Noemi2
            ]);
            const elist = list1.except(list2, (p1, p2) => p1.name === p2.name);
            expect(elist.toArray()).to.deep.equal([Person.Alice, Person.Senna]);
        });
        test(
            "should return a set of people unique to first enumerable",
            { timeout: 10000 },
            () => {
                const list1 = new List<Person>();
                const list2 = new List<Person>();
                for (let px = 0; px < 100000; ++px) {
                    const p1 = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 90)
                    );
                    const p2 = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 50)
                    );
                    list1.add(p1);
                    list2.add(p2);
                }
                const exceptionList = list1.except(
                    list2,
                    (p1, p2) => p1.age === p2.age
                );
                const ageCount = exceptionList.count((p) => p.age <= 50);
                expect(ageCount).to.eq(0);
            }
        );
        test(
            "should use order comparator and return a set of people unique to first enumerable #2",
            { timeout: 10000 },
            () => {
                const list1 = new List<Person>();
                const list2 = new List<Person>();
                for (let px = 0; px < 100000; ++px) {
                    const p1 = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 90)
                    );
                    const p2 = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 50)
                    );
                    list1.add(p1);
                    list2.add(p2);
                }
                const exceptionList = list1.except(
                    list2,
                    (p1, p2) => p1.age - p2.age
                );
                const ageCount = exceptionList.count((p) => p.age <= 50);
                expect(ageCount).to.eq(0);
            }
        );
        test("should not fail if the list has falsy values", () => {
            const list1 = new List([0, undefined, null, false, 1, 2, 3]);
            const list2 = new List([undefined, 0]);
            const elist = list1.except(list2);
            expect(elist.toArray()).to.deep.equal([null, false, 1, 2, 3]);
        });
    });

    describe("#exceptBy()", () => {
        const list1 = new List([Person.Alice, Person.Noemi]);
        const list2 = new List([Person.Mel, Person.Noemi2]);
        test("should only have 'Alice'", () => {
            const elist = list1.exceptBy(list2, (p) => p.name);
            expect(elist.toArray()).to.deep.equal([Person.Alice]);
        });
        test("should only have 'Alice' and 'Noemi'", () => {
            const elist = list1.exceptBy(list2, (p) => p);
            expect(elist.toArray()).to.deep.equal([Person.Alice, Person.Noemi]);
        });
        test("shoud return 'Noemi'", () => {
            const list3 = new List([Person.Noemi, Person.Noemi2]);
            const list4 = new List<Person>([]);
            const elist = list3.exceptBy(list4, (p) => p.name);
            expect(elist.toArray()).to.deep.equal([Person.Noemi]);
        });
        test("should use provided comparator", () => {
            const LittleNoemi = new Person("noemi", "Nymph", 9);
            const list3 = new List([Person.Alice, LittleNoemi]);
            const list4 = new List([Person.Mel, Person.Noemi2]);
            const elist = list3.exceptBy(list4, (p) => p.name);
            const elist2 = list3.exceptBy(
                list2,
                (p) => p.name,
                (n1, n2) =>
                    n1.toLowerCase().localeCompare(n2.toLowerCase()) === 0
            );
            expect(elist.toArray()).to.deep.equal([Person.Alice, LittleNoemi]);
            expect(elist2.toArray()).to.deep.equal([Person.Alice]);
        });
    });

    describe("#first()", () => {
        test("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.first()).toThrow(new NoElementsException());
        });
        test("should return the first element if no predicate is provided.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            const first = list.first();
            expect(first).to.eq(99);
        });
        test("should throw an error if no matching element is found.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            expect(() => list.first((n) => n < 0)).toThrowError(
                new NoMatchingElementException()
            );
        });
        test("should return a person with name 'Alice'", () => {
            const list = new List([Person.Mel, Person.Alice, Person.Jane]);
            const first = list.first((p) => p.name === "Alice");
            expect(first.name).to.eq("Alice");
        });
        test("should not throw error if sequence contains only null or undefined", () => {
            const data = [
                { a: 1, b: undefined },
                { a: 3, b: undefined },
                { a: 4, b: 5 }
            ];
            const list = new List(data);
            expect(() => list.select((d) => d.b).first()).to.not.throw();
            const first = list.select((d) => d.b).first();
            expect(first).to.eq(undefined);
        });
        test("should narrow items with type guard", () => {
            const firstError = responses.first(isError);
            expect(firstError).to.haveOwnProperty("error");
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
            expect(list.firstOrDefault((n) => n < 0)).to.eq(null);
        });
        test("should return a person with name 'Alice'", () => {
            const list = new List([Person.Mel, Person.Alice, Person.Jane]);
            const first = list.firstOrDefault(
                (p) => p.name === "Alice"
            ) as Person;
            expect(first.name).to.eq("Alice");
        });
        test("should return null if sequence contains only null or undefined", () => {
            const data = [
                { a: 1, b: undefined },
                { a: 3, b: undefined },
                { a: 4, b: 5 }
            ];
            const list = new List(data);
            const first = list.select((d) => d.b).firstOrDefault();
            expect(first).to.eq(undefined);
        });
        test("should narrow items with type guard", () => {
            const firstError = responses.firstOrDefault(isError);
            expect(firstError).to.haveOwnProperty("error");
        });
    });

    describe("#get()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Lucrezia,
            Person.Noemi,
            Person.Priscilla,
            Person.Vanessa,
            Person.Viola
        ]);
        test("should throw error if index is out of bounds", () => {
            expect(() => list1.get(-1)).toThrow(
                new IndexOutOfBoundsException(-1)
            );
            expect(() => list1.get(6)).toThrow(
                new IndexOutOfBoundsException(6)
            );
        });
        test("should return the element at the specified index", () => {
            expect(list1.get(0)).to.eq(Person.Alice);
            expect(list1.get(5)).to.eq(Person.Viola);
            expect(list1.get(2)).to.eq(Person.Noemi);
        });
    });

    describe("#getRange()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Lucrezia,
            Person.Noemi,
            Person.Priscilla,
            Person.Vanessa,
            Person.Viola
        ]);
        test("should throw error if index is out of bounds", () => {
            expect(() => list1.getRange(-1, 3)).toThrow(
                new IndexOutOfBoundsException(-1)
            );
            expect(() => list1.getRange(6, 3)).toThrow(
                new IndexOutOfBoundsException(6)
            );
        });
        test("should throw error if length is out of bounds", () => {
            expect(() => list1.getRange(0, 7)).toThrow(
                new IndexOutOfBoundsException(7)
            );
            expect(() => list1.getRange(0, -1)).toThrow(
                new InvalidArgumentException(
                    `Invalid argument: count. count must be greater than or equal to zero.`
                )
            );
        });
        test("should return the elements at the specified index", () => {
            const range = list1.getRange(1, 3);
            expect(range.toArray()).to.deep.equal([
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla
            ]);
            expect(range.length).to.eq(3);
        });
    });

    describe("#groupBy()", () => {
        const list = new List([
            Person.Alice,
            Person.Mel,
            Person.Senna,
            Person.Lenka,
            Person.Jane,
            Person.Kaori,
            Person.Reina
        ]);
        test("should group people by age", () => {
            const group = list.groupBy((p) => p.age).toList();
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
                const expectedAges = new Array(sameAges.length).fill(
                    sameAges[0]
                );
                expect(sameAges).to.deep.equal(expectedAges);
            }
        });
        test("should return people who are younger than 16", () => {
            const kids = list
                .groupBy((p) => p.age)
                .where((pg) => pg.key < 16)
                .selectMany((g) => g.source)
                .toArray();
            expect(kids.length).to.eq(3);
            expect(kids).to.have.all.members([
                Person.Kaori,
                Person.Mel,
                Person.Senna
            ]);
        });
        test("should be iterable with for-of loop", () => {
            const groupedPeople = list.groupBy((p) => p.name.length);
            const people: Person[] = [];
            const expectedResult = [
                Person.Alice,
                Person.Senna,
                Person.Lenka,
                Person.Kaori,
                Person.Reina,
                Person.Mel,
                Person.Jane
            ];
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
                const p = new Person(
                    Helper.generateRandomString(8),
                    Helper.generateRandomString(10),
                    Helper.generateRandomNumber(1, 50)
                );
                list.add(p);
            }
            const people: Person[] = [];
            list.groupBy((p) => p.age).forEach((g) => {
                g.source.orderBy((n) => n).forEach((p) => people.push(p));
            });
        });
        test("should use provided comparator for key comparison", () => {
            const LittleAlice = new Person("alice", "Snowmist", 9);
            const list = new List([
                Person.Alice,
                Person.Mel,
                Person.Senna,
                LittleAlice
            ]);
            const group = list
                .groupBy(
                    (p) => p.name,
                    (n1, n2) => n1.toLowerCase() === n2.toLowerCase()
                )
                .toList();
            const names: string[] = [];
            const groupedNames: { [name: string]: string[] } = {};
            for (const nameGroup of group) {
                names.push(nameGroup.key);
                groupedNames[nameGroup.key] ??= [];
                for (const pdata of nameGroup.source) {
                    groupedNames[nameGroup.key].push(pdata.name);
                }
            }
            expect(names).to.have.all.members(["Alice", "Mel", "Senna"]);
            expect(groupedNames["Alice"]).to.have.all.members([
                "Alice",
                "alice"
            ]);
            expect(groupedNames["Mel"]).to.have.all.members(["Mel"]);
            expect(groupedNames["Senna"]).to.have.all.members(["Senna"]);
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
        const students = new List([
            desiree,
            apolline,
            giselle,
            priscilla,
            lucrezia
        ]);

        test("should join and group by school id", () => {
            const joinedData = schools
                .groupJoin(
                    students,
                    (sc) => sc.id,
                    (st) => st.schoolId,
                    (school, students) => {
                        return new SchoolStudents(
                            school.id,
                            students?.toList() ?? new List<Student>()
                        );
                    }
                )
                .orderByDescending((ss) => ss.students.size());
            const finalData = joinedData.toArray();
            const finalOutput: string[] = [];
            for (const sd of finalData) {
                const school = schools
                    .where((s) => s.id === sd.schoolId)
                    .single();
                finalOutput.push(`Students of ${school.name}: `);
                for (const student of sd.students) {
                    finalOutput.push(
                        `[${student.id}] :: ${student.name} ${student.surname}`
                    );
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

        test("should handle empty inner collection", () => {
            const emptyStudents = new List<Student>();
            const joinedData = schools.groupJoin(
                emptyStudents,
                (sc) => sc.id,
                (st) => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(
                        school.id,
                        students?.toList() ?? new List<Student>()
                    );
                }
            );

            const result = joinedData.toArray();
            expect(result.length).to.equal(4);

            // All schools should have empty student lists
            for (const schoolStudents of result) {
                expect(schoolStudents.students.size()).to.equal(0);
            }
        });

        test("should handle empty outer collection", () => {
            const emptySchools = new List<School>();
            const joinedData = emptySchools.groupJoin(
                students,
                (sc) => sc.id,
                (st) => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(
                        school.id,
                        students?.toList() ?? new List<Student>()
                    );
                }
            );

            const result = joinedData.toArray();
            expect(result.length).to.equal(0);
        });

        test("should handle no matches between collections", () => {
            const unrelatedSchools = new List([
                new School(10, "Music School"),
                new School(11, "Art School")
            ]);

            const joinedData = unrelatedSchools.groupJoin(
                students,
                (sc) => sc.id,
                (st) => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(
                        school.id,
                        students?.toList() ?? new List<Student>()
                    );
                }
            );

            const result = joinedData.toArray();
            expect(result.length).to.equal(2);

            // All schools should have empty student lists
            for (const schoolStudents of result) {
                expect(schoolStudents.students.size()).to.equal(0);
            }
        });

        test("should handle custom equality comparator", () => {
            // Create a custom comparator that considers school IDs equal if they have the same parity (odd/even)
            const parityComparator = (id1: number, id2: number) =>
                id1 % 2 === id2 % 2;

            const joinedData = schools.groupJoin(
                students,
                (sc) => sc.id,
                (st) => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(
                        school.id,
                        students?.toList() ?? new List<Student>()
                    );
                },
                parityComparator
            );

            const result = joinedData.toArray();

            // School 1 (odd) should match students with school IDs 1 and 3 (odd)
            const school1Students =
                result.find((ss) => ss.schoolId === 1)?.students.toArray() ??
                [];
            expect(school1Students.length).to.equal(2);
            expect(school1Students.map((s) => s.id)).to.have.members([
                100, 400
            ]);

            // School 2 (even) should match students with school IDs 2 and 4 (even)
            const school2Students =
                result.find((ss) => ss.schoolId === 2)?.students.toArray() ??
                [];
            expect(school2Students.length).to.equal(3);
            expect(school2Students.map((s) => s.id)).to.have.members([
                200, 300, 500
            ]);

            // School 3 (odd) should match students with school IDs 1 and 3 (odd)
            const school3Students =
                result.find((ss) => ss.schoolId === 3)?.students.toArray() ??
                [];
            expect(school3Students.length).to.equal(2);
            expect(school3Students.map((s) => s.id)).to.have.members([
                100, 400
            ]);

            // School 5 (odd) should match students with school IDs 1 and 3 (odd)
            const school5Students =
                result.find((ss) => ss.schoolId === 5)?.students.toArray() ??
                [];
            expect(school5Students.length).to.equal(2);
            expect(school5Students.map((s) => s.id)).to.have.members([
                100, 400
            ]);
        });

        test("should handle different key selectors", () => {
            // Use a string key selector that converts the ID to a string
            const joinedData = schools.groupJoin(
                students,
                (sc) => sc.id.toString(),
                (st) => st.schoolId.toString(),
                (school, students) => {
                    return new SchoolStudents(
                        school.id,
                        students?.toList() ?? new List<Student>()
                    );
                }
            );

            const result = joinedData.toArray();
            expect(result.length).to.equal(4);

            // Verify the same grouping as the original test
            const school1Students =
                result.find((ss) => ss.schoolId === 1)?.students.toArray() ??
                [];
            expect(school1Students.length).to.equal(1);
            expect(school1Students[0].id).to.equal(400);

            const school2Students =
                result.find((ss) => ss.schoolId === 2)?.students.toArray() ??
                [];
            expect(school2Students.length).to.equal(2);
            expect(school2Students.map((s) => s.id)).to.have.members([
                200, 300
            ]);

            const school3Students =
                result.find((ss) => ss.schoolId === 3)?.students.toArray() ??
                [];
            expect(school3Students.length).to.equal(1);
            expect(school3Students[0].id).to.equal(100);

            const school5Students =
                result.find((ss) => ss.schoolId === 5)?.students.toArray() ??
                [];
            expect(school5Students.length).to.equal(0);
        });

        test("should handle null keys", () => {
            // Create students with null school IDs
            const studentWithNullSchool1 = new Student(
                600,
                "Student",
                "WithNullSchool1",
                null as any
            );
            const studentWithNullSchool2 = new Student(
                700,
                "Student",
                "WithNullSchool2",
                null as any
            );

            // Create a school with null ID
            const schoolWithNullId = new School(null as any, "Null ID School");

            const schoolsWithNull = new List([
                ...schools.toArray(),
                schoolWithNullId
            ]);
            const studentsWithNull = new List([
                ...students.toArray(),
                studentWithNullSchool1,
                studentWithNullSchool2
            ]);

            const joinedData = schoolsWithNull.groupJoin(
                studentsWithNull,
                (sc) => sc.id,
                (st) => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(
                        school.id,
                        students?.toList() ?? new List<Student>()
                    );
                }
            );

            const result = joinedData.toArray();
            expect(result.length).to.equal(5);

            // The null ID school should match students with null school IDs
            const nullSchoolStudents =
                result.find((ss) => ss.schoolId === null)?.students.toArray() ??
                [];
            expect(nullSchoolStudents.length).to.equal(2);
            expect(nullSchoolStudents.map((s) => s.id)).to.have.members([
                600, 700
            ]);
        });

        test("should handle complex result selector", () => {
            // Use a more complex result selector that creates a formatted string
            const joinedData = schools.groupJoin(
                students,
                (sc) => sc.id,
                (st) => st.schoolId,
                (school, students) => {
                    const studentCount = students!.count();
                    const studentNames = students!
                        .select((s) => `${s.name} ${s.surname}`)
                        .toArray()
                        .join(", ");
                    return `${school.name} (${studentCount} students): ${
                        studentCount > 0 ? studentNames : "No students"
                    }`;
                }
            );

            const result = joinedData.toArray();
            expect(result.length).to.equal(4);

            expect(result).to.include(
                "Elementary School (1 students): Priscilla Necci"
            );
            expect(result).to.include(
                "High School (2 students): Apolline Bruyere, Giselle García"
            );
            expect(result).to.include(
                "University (1 students): Desireé Moretti"
            );
            expect(result).to.include("Academy (0 students): No students");
        });
    });

    describe("#index()", () => {
        const list1 = new List([
            Person.Kaori,
            Person.Mirei,
            Person.Rui,
            Person.Setsuna,
            Person.Reina
        ]);
        test("should return a tuple of [index, element]", () => {
            const indexPersonTuple = list1.index().toArray();
            expect(indexPersonTuple[0][0]).to.eq(0);
            expect(indexPersonTuple[0][1]).to.eq(Person.Kaori);
            expect(indexPersonTuple[1][0]).to.eq(1);
            expect(indexPersonTuple[1][1]).to.eq(Person.Mirei);
            expect(indexPersonTuple[2][0]).to.eq(2);
            expect(indexPersonTuple[2][1]).to.eq(Person.Rui);
            expect(indexPersonTuple[3][0]).to.eq(3);
            expect(indexPersonTuple[3][1]).to.eq(Person.Setsuna);
            expect(indexPersonTuple[4][0]).to.eq(4);
            expect(indexPersonTuple[4][1]).to.eq(Person.Reina);
        });
        test("should return empty array if list is empty", () => {
            const list = new List<Person>();
            const indexPersonTuple = list.index().toArray();
            expect(indexPersonTuple).to.deep.equal([]);
        });
    });

    describe("#indexOf()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Noemi,
            null,
            Person.Noemi2,
            null
        ]);
        test("should return 2", () => {
            expect(list1.indexOf(null)).to.eq(2);
        });
        test("should return 1", () => {
            expect(list1.indexOf(Person.Noemi)).to.eq(1);
        });
        test("should use the given comparator", () => {
            const ageComparator = (p1: Person | null, p2: Person | null) =>
                p1?.age === p2?.age;
            const index = list1.indexOf(Person.Noemi2, ageComparator);
            expect(index).to.eq(3);
        });
    });

    describe("#interleave()", () => {
        test("should create an interleaved list", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const array = ["a", "b", "c"];
            const result = list1.interleave(array).toArray();
            const expected = [1, "a", 2, "b", 3, "c", 4, 5];
            expect(result).to.deep.equal(expected);
        });
        test("should create an interleaved list #2", () => {
            const list1 = new List([1, 2, 3]);
            const array = ["a", "b", "c", "d", "e"];
            const result = list1.interleave(array).toArray();
            const expected = [1, "a", 2, "b", 3, "c", "d", "e"];
            expect(result).to.deep.equal(expected);
        });
        test("should return empty list", () => {
            const list1 = new List([]);
            const array = [] as string[];
            const result = list1.interleave(array).toArray();
            expect(result).to.deep.equal([]);
        });
        test("should return second list if first list is empty", () => {
            const list1 = new List([]);
            const list2 = new List([1, 2, 3]);
            const result = list1.interleave(list2).toArray();
            const expected = [1, 2, 3];
            expect(result).to.deep.equal(expected);
        });
        test("should return first list if second list is empty", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List([]);
            const result = list1.interleave(list2).toArray();
            const expected = [1, 2, 3];
            expect(result).to.deep.equal(expected);
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
        test("should return an empty array if second list is empty", () => {
            const list1 = new List([1, 1, 2]);
            const list2 = new List<number>();
            const elist = list1.intersect(list2).toList();
            expect(elist.toArray()).to.deep.equal([]);
        });
        test("should not return any duplicates", () => {
            const list1 = new List([1, 1, 2, 3, 4, 5]);
            const list2 = new List([4, 5, 5, 6, 7, 8]);
            const elist = list1.intersect(list2).toList();
            expect(elist.toArray()).to.deep.equal([4, 5]);
        });
        test("should only have 'Mel', 'Lenka' and 'Jane'", () => {
            const list1 = new List([
                Person.Alice,
                Person.Noemi,
                Person.Mel,
                Person.Senna,
                Person.Lenka,
                Person.Jane
            ]);
            const list2 = new List([
                Person.Mel,
                Person.Lenka,
                Person.Jane,
                Person.Noemi2
            ]);
            const elist = list1.intersect(list2);
            expect(elist.toArray()).to.deep.equal([
                Person.Mel,
                Person.Lenka,
                Person.Jane
            ]);
        });
        test("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
            const list1 = new List([
                Person.Alice,
                Person.Noemi,
                Person.Mel,
                Person.Senna,
                Person.Lenka,
                Person.Jane
            ]);
            const list2 = new List([
                Person.Mel,
                Person.Lenka,
                Person.Jane,
                Person.Noemi2
            ]);
            const elist = list1.intersect(
                list2,
                (p1, p2) => p1.name === p2.name
            );
            expect(elist.toArray()).to.deep.equal([
                Person.Noemi,
                Person.Mel,
                Person.Lenka,
                Person.Jane
            ]);
        });
        test(
            "should return a set of people common in both enumerables",
            { timeout: 10000 },
            () => {
                const list1 = new List<Person>();
                const list2 = new List<Person>();
                for (let px = 0; px < 100000; ++px) {
                    const p = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 90)
                    );
                    list1.add(p);
                }
                for (let px = 0; px < 100000; ++px) {
                    const p = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 50)
                    );
                    list2.add(p);
                }
                const exceptionList = list1.intersect(
                    list2,
                    (p1, p2) => p1.age === p2.age
                );
                const ageCount = exceptionList.count((p) => p.age > 50);
                expect(ageCount).to.eq(0);
            }
        );
        test(
            "should use order comparator and return a set of people common in both enumerables",
            { timeout: 10000 },
            () => {
                const list1 = new List<Person>();
                const list2 = new List<Person>();
                for (let px = 0; px < 100000; ++px) {
                    const p = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 90)
                    );
                    list1.add(p);
                }
                for (let px = 0; px < 100000; ++px) {
                    const p = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 50)
                    );
                    list2.add(p);
                }
                const exceptionList = list1.intersect(
                    list2,
                    (p1, p2) => p1.age - p2.age
                );
                const ageCount = exceptionList.count((p) => p.age > 50);
                expect(ageCount).to.eq(0);
            }
        );
        test("should not fail if the list has falsy values", () => {
            const list1 = new List([0, undefined, null, false, 1, 2, 3]);
            const list2 = new List([undefined, 0]);
            const elist = list1.intersect(list2);
            expect(elist.toArray()).to.deep.equal([0, undefined]);
        });
    });

    describe("#intersectBy()", () => {
        const list1 = new List([Person.Alice, Person.Noemi]);
        const list2 = new List([Person.Mel, Person.Noemi2]);
        test("should only have 'Noemi'", () => {
            const elist = list1.intersectBy(list2, (p) => p.name);
            expect(elist.toArray()).to.deep.equal([Person.Noemi]);
        });
        test("should be empty", () => {
            const elist = list1.intersectBy(list2, (p) => p);
            expect(elist.toArray()).to.deep.equal([]);
        });
        test("shoud return empty list #2", () => {
            const list3 = new List([Person.Noemi, Person.Noemi2]);
            const list4 = new List<Person>([]);
            const elist = list3.intersectBy(list4, (p) => p.name);
            expect(elist.toArray()).to.deep.equal([]);
        });
        test("should return empty if first list is empty", () => {
            const list5 = new List<Person>();
            const list6 = new List([Person.Eliza, Person.Viola]);
            const elist = list5.intersectBy(list6, (p) => p.name);
            expect(elist.toArray()).to.deep.equal([]);
        });
        test("should use provided comparator", () => {
            const LittleNoemi = new Person("noemi", "Nymph", 9);
            const list3 = new List([Person.Alice, LittleNoemi]);
            const list4 = new List([Person.Mel, Person.Noemi2]);
            const elist = list3.intersectBy(list4, (p) => p.name);
            const elist2 = list3.intersectBy(
                list2,
                (p) => p.name,
                (n1, n2) =>
                    n1.toLowerCase().localeCompare(n2.toLowerCase()) === 0
            );
            expect(elist.toArray()).to.deep.equal([]);
            expect(elist2.toArray()).to.deep.equal([LittleNoemi]);
        });
    });

    describe("#intersperse()", () => {
        test("should return [1, 'a', 2, 'a', 3, 'a', 4, 'a', 5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const interspersed = list.intersperse("a").toList();
            expect(interspersed.toArray()).to.deep.equal([
                1,
                "a",
                2,
                "a",
                3,
                "a",
                4,
                "a",
                5
            ]);
            expect(interspersed.length).to.eq(9);
        });
        test("should return empty list if list is empty", () => {
            const list = new List<number>();
            const interspersed = list.intersperse(0).toList();
            expect(interspersed.toArray()).to.deep.equal([]);
            expect(interspersed.length).to.eq(0);
        });
    });

    describe("#isEmpty()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Noemi,
            null,
            Person.Noemi2,
            null
        ]);
        test("should return false if list is not empty", () => {
            expect(list1.isEmpty()).to.false;
        });
        test("should return true if list is empty", () => {
            list1.removeIf((p) => !p || !!p);
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
        const students = new List([
            desiree,
            apolline,
            giselle,
            priscilla,
            lucrezia
        ]);
        test("should join students and schools", () => {
            const joinedData = students
                .join(
                    schools,
                    (st) => st.schoolId,
                    (sc) => sc.id,
                    (student, school) =>
                        `${student.name} ${student.surname} :: ${school?.name}`
                )
                .toList();
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
            const joinedData = students
                .join(
                    schools,
                    (st) => st.schoolId,
                    (sc) => sc.id,
                    (student, school) => [student, school],
                    (stid, scid) => stid === scid,
                    true
                )
                .toArray();
            for (const jd of joinedData) {
                if ((jd[0] as Student).surname === "Volpe") {
                    expect(jd[1]).to.eq(null);
                } else {
                    expect(jd[1]).to.not.eq(null);
                }
            }
        });
        test("should join key-value pairs", () => {
            const pairList1 = new List([
                new Pair(1, "A"),
                new Pair(2, "B"),
                new Pair(3, "C")
            ]);
            const pairList2 = new List([
                new Pair(1, "a1"),
                new Pair(1, "a2"),
                new Pair(1, "a3"),
                new Pair(2, "b1"),
                new Pair(2, "b2")
            ]);
            const joinList = pairList1.join(
                pairList2,
                (p1) => p1.key,
                (p2) => p2.key,
                (pair1, pair2) => [pair1.value, pair2?.value]
            );
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

        test("should return empty result when outer collection is empty", () => {
            const emptyStudents = new List<Student>();
            const joinedData = emptyStudents.join(
                schools,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) =>
                    `${student.name} ${student.surname} :: ${school?.name}`
            );
            expect(joinedData.any()).to.be.false;
            expect(joinedData.count()).to.eq(0);
        });

        test("should return empty result when inner collection is empty", () => {
            const emptySchools = new List<School>();
            const joinedData = students.join(
                emptySchools,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) =>
                    `${student.name} ${student.surname} :: ${school?.name}`
            );
            expect(joinedData.any()).to.be.false;
            expect(joinedData.count()).to.eq(0);
        });

        test("should return results for left join when inner collection is empty", () => {
            const emptySchools = new List<School>();
            const joinedData = students.join(
                emptySchools,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) => [student.name, school?.name],
                undefined,
                true
            );
            expect(joinedData.count()).to.eq(5);
            for (const item of joinedData) {
                expect(item[1]).to.be.undefined;
            }
        });

        test("should handle custom equality comparator", () => {
            // Custom comparator that considers school IDs equal if they have the same parity (odd/even)
            const parityComparator = (id1: number, id2: number) =>
                id1 % 2 === id2 % 2;

            const joinedData = students.join(
                schools,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) => `${student.name} at ${school?.name}`,
                parityComparator
            );

            // All students should match with at least one school since we're matching by parity
            expect(joinedData.count()).to.be.greaterThan(0);

            // Lucrezia (schoolId 4) should match with schools with even IDs (2)
            const lucreziaMatches = joinedData
                .where((s) => s.startsWith("Lucrezia"))
                .count();
            expect(lucreziaMatches).to.be.greaterThan(0);
        });

        test("should handle null keys in outer collection", () => {
            const studentsWithNull = new List([
                desiree,
                new Student(
                    600,
                    "Student",
                    "WithNullSchool",
                    null as unknown as number
                )
            ]);

            const joinedData = studentsWithNull.join(
                schools,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) => [student.name, school?.name]
            );

            // Only Desiree should match
            expect(joinedData.count()).to.eq(1);
            expect(joinedData.first()[0]).to.eq("Desireé");
        });

        test("should handle null keys in inner collection", () => {
            const schoolsWithNull = new List([
                school1,
                new School(null as unknown as number, "School with null ID")
            ]);

            const joinedData = students.join(
                schoolsWithNull,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) => [student.name, school?.name]
            );

            // Only Priscilla should match with school1
            expect(joinedData.count()).to.eq(1);
            expect(joinedData.first()[0]).to.eq("Priscilla");
        });

        test("should handle complex join scenarios with multiple matches", () => {
            // Create schools with duplicate IDs
            const schoolsWithDuplicates = new List([
                new School(1, "Elementary School 1"),
                new School(1, "Elementary School 2"),
                new School(2, "High School 1"),
                new School(2, "High School 2"),
                new School(3, "University 1"),
                new School(3, "University 2")
            ]);

            const joinedData = students.join(
                schoolsWithDuplicates,
                (st) => st.schoolId,
                (sc) => sc.id,
                (student, school) => `${student.name} at ${school?.name}`
            );

            // Each student should match with two schools (except Lucrezia)
            expect(joinedData.count()).to.eq(8); // 4 students * 2 schools each

            // Check that Priscilla matches with both Elementary Schools
            const priscillaMatches = joinedData
                .where((s) => s.startsWith("Priscilla"))
                .toArray();
            expect(priscillaMatches.length).to.eq(2);
            expect(priscillaMatches).to.include(
                "Priscilla at Elementary School 1"
            );
            expect(priscillaMatches).to.include(
                "Priscilla at Elementary School 2"
            );
        });
    });

    describe("#last()", () => {
        test("should throw error if list is empty()", () => {
            const list = new List<number>();
            expect(() => list.last()).toThrow(new NoElementsException());
        });
        test("should return the last element if no predicate is provided.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            const last = list.last();
            expect(last).to.eq(5);
        });
        test("should throw an error if no matching element is found.", () => {
            const list = new List([99, 2, 3, 4, 5]);
            expect(() => list.last((n) => n < 0)).toThrowError(
                new NoMatchingElementException()
            );
        });
        test("should return 87", () => {
            const list = new List([
                9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 67, 12, 19
            ]);
            const last = list.last((p) => p > 80);
            expect(last).to.eq(87);
        });
        test("should not throw error if sequence contains only null or undefined items", () => {
            const data = [
                { a: 1, b: 5 },
                { a: 3, b: undefined },
                { a: 4, b: null }
            ];
            const list = new List(data);
            expect(() => list.select((d) => d.b).last()).to.not.throw();
            const last = list.select((d) => d.b).last();
            expect(last).to.eq(null);
        });
        test("should narrow items with type guard", () => {
            const lastError = responses.last(isError);
            expect(lastError).to.haveOwnProperty("error");
            expect(lastError.error).to.eq("Server error");
        });
    });

    describe("#lastIndexOf()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Noemi,
            null,
            Person.Noemi2,
            null
        ]);
        test("should return 4", () => {
            expect(list1.lastIndexOf(null)).to.eq(4);
        });
        test("should lastIndexOf 1", () => {
            expect(list1.lastIndexOf(Person.Noemi)).to.eq(1);
        });
        test("should use the given comparator", () => {
            const nameComparator = (p1: Person | null, p2: Person | null) =>
                p1?.name === p2?.name;
            const index = list1.lastIndexOf(Person.Noemi, nameComparator);
            expect(index).to.eq(3);
        });
        test("should return -1", () => {
            list1.removeIf((p) => !p);
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
            expect(list.lastOrDefault((n) => n < 0)).to.eq(null);
        });
        test("should return 87", () => {
            const list = new List([
                9, 34, 65, 92, 87, 435, 3, 54, 83, 23, 87, 67, 12, 19
            ]);
            const last = list.lastOrDefault((p) => p > 80);
            expect(last).to.eq(87);
        });
        test("should return null if sequence contains only null or undefined items", () => {
            const data = [
                { a: 1, b: 5 },
                { a: 3, b: undefined },
                { a: 4, b: null }
            ];
            const list = new List(data);
            const last = list.select((d) => d.b).lastOrDefault();
            expect(last).to.eq(null);
        });
        test("should narrow items with type guard", () => {
            const lastError = responses.lastOrDefault(isError);
            expect(lastError).to.haveOwnProperty("error");
            expect(lastError!.error).to.eq("Server error");
        });
    });

    describe("#max()", () => {
        const list = new List([43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011]);
        test("should return 2312", () => {
            const max = list.max((n) => n);
            const max2 = list.max();
            expect(max).to.eq(2312);
            expect(max2).to.eq(max);
        });
        test("should return 23", () => {
            const personList = new List([
                Person.Alice,
                Person.Mel,
                Person.Senna,
                Person.Lenka,
                Person.Jane
            ]);
            const max = personList.max((p) => p.age);
            expect(max).to.eq(23);
        });
        test("should throw if list has no elements", () => {
            const list = new List<number>();
            expect(() => list.max()).toThrow(new NoElementsException());
            expect(() => list.max((n) => n * 2)).toThrow(
                new NoElementsException()
            );
        });
    });
    describe("#maxBy()", () => {
        test("should return person with the biggest age", () => {
            const personList = new List([
                Person.Alice,
                Person.Ayana,
                Person.Setsuna
            ]);
            const oldest = personList.maxBy((p) => p.age);
            expect(oldest).to.eq(Person.Ayana);
        });
        test("should return biggest element", () => {
            const list = new List([
                43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011
            ]);
            const max = list.maxBy((n) => n);
            expect(max).to.eq(2312);
        });
        test("should use provided comparator", () => {
            const list = new List([
                43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011
            ]);
            const max = list.maxBy(
                (n) => n,
                (n1, n2) => n2 - n1
            ); // should return the smallest element
            expect(max).to.eq(1);
        });
        test("should throw if list has no elements", () => {
            const list = new List<Person>();
            expect(() => list.maxBy((p) => p.age)).toThrow(
                new NoElementsException()
            );
        });
    });

    describe("#median()", () => {
        test("should return the median of the list which has odd number of elements", () => {
            const list = new List([3, 1, 5, 4, 2]);
            const median = list.median();
            expect(median).to.eq(3);
        });
        test("should return the low median of the list which has even number of elements", () => {
            const list = new List([4, 2, 1, 3]);
            const median = list.median(x => x, "low");
            expect(median).to.eq(2);
        });
        test("should return the high median of the list which has even number of elements", () => {
            const list = new List([4, 2, 1, 3]);
            const median = list.median(x => x, "high");
            expect(median).to.eq(3);
        });
        test("should return the interpolated median of the list which has even number of elements", () => {
            const list = new List([4, 3, 1, 2]);
            const median = list.median(x => x, "interpolate");
            expect(median).to.eq(2.5);
        });
        test("should return NaN if the list is empty", () => {
            const list = new List<number>();
            const median = list.median();
            expect(median).to.be.NaN;
        });
        test("should use provided selector", () => {
            const list = new List([Person.Bella, Person.Kaori, Person.Vanessa]);
            const median = list.median(p => p.age);
            expect(median).to.eq(20);
        });
    });

    describe("#min()", () => {
        const list = new List([43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011]);
        test("should return 1", () => {
            const min = list.min((n) => n);
            const min2 = list.min();
            expect(min).to.eq(1);
            expect(min2).to.eq(min);
        });
        test("should return 9", () => {
            const personList = new List([
                Person.Alice,
                Person.Mel,
                Person.Senna,
                Person.Lenka,
                Person.Jane
            ]);
            const min = personList.min((p) => p.age);
            expect(min).to.eq(9);
        });
        test("should throw if list has no elements", () => {
            const list = new List<number>();
            expect(() => list.min()).toThrow(new NoElementsException());
            expect(() => list.min((n) => n / 2)).toThrow(
                new NoElementsException()
            );
        });
    });
    describe("#minBy()", () => {
        test("should return person with the smallest age", () => {
            const personList = new List([
                Person.Alice,
                Person.Ayana,
                Person.Setsuna
            ]);
            const youngest = personList.minBy((p) => p.age);
            expect(youngest).to.eq(Person.Setsuna);
        });
        test("should return smallest element", () => {
            const list = new List([
                43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011
            ]);
            const min = list.minBy((n) => n);
            expect(min).to.eq(1);
        });
        test("should use provided comparator", () => {
            const list = new List([
                43, 56, 123, 65, 1, 6, 900, 2312, 555, 1011
            ]);
            const min = list.minBy(
                (n) => n,
                (n1, n2) => n2 - n1
            ); // should return the biggest element
            expect(min).to.eq(2312);
        });
        test("should throw if list has no elements", () => {
            const list = new List<Person>();
            expect(() => list.minBy((p) => p.age)).toThrow(
                new NoElementsException()
            );
        });
    });

    describe("#mode()", () => {
        test("should return most frequent element", () => {
            const list = new List([1, 2, 2, 3]);
            const mode = list.mode();
            expect(mode).to.eq(2);
        });
        test("should return first most frequent element", () => {
            const list = new List([1, 2, 2, 1]);
            const mode = list.mode();
            expect(mode).to.eq(1);
        });
        test("should throw if list is empty", () => {
            const list = new List<number>([]);
            expect(() => list.mode()).toThrow(new NoElementsException());
        });
        test("should use provided selector", () => {
            const list = new List([Person.Noemi, Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi2]);
            const mode = list.mode(p => p.name);
            expect(mode).to.eq(Person.Suzuha);
        });
    });

    describe("#modeOrDefault()", () => {
        test("should return most frequent element", () => {
            const list = new List([1, 2, 2, 3]);
            const mode = list.modeOrDefault();
            expect(mode).to.eq(2);
        });
        test("should return first most frequent element", () => {
            const list = new List([1, 2, 2, 1]);
            const mode = list.modeOrDefault();
            expect(mode).to.eq(1);
        });
        test("should return null if list is empty", () => {
            const list = new List<number>([]);
            const mode = list.modeOrDefault();
            expect(mode).to.be.null;
        });
        test("should not throw if list is empty", () => {
            const list = new List<number>([]);
            expect(() => list.modeOrDefault()).not.toThrow(new NoElementsException());
        });
        test("should use provided selector", () => {
            const list = new List([Person.Noemi, Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi2]);
            const mode = list.modeOrDefault(p => p.name);
            expect(mode).to.eq(Person.Suzuha);
        });
    });

    describe("#multimode()", () => {
        test("should return a list of most frequent elements", () => {
            const list1 = new List([1, 2, 2, 3]);
            const list2 = new List([1, 2, 2, 3, 3]);
            const mode1 = list1.multimode().toArray();
            const mode2 = list2.multimode().toArray();
            expect(mode1).to.deep.equal([2]);
            expect(mode2).to.deep.equal([2, 3]);
        });
        test("should return empty list if source list is empty", () => {
            const list = new List<number>([]);
            const mode = list.multimode().toArray();
            expect(mode).to.be.empty;
        });
        test("should use provided selector", () => {
            const list = new List([
                Person.Noemi,
                Person.Suzuha,
                Person.Noemi2,
                Person.Suzuha2,
                Person.Bella
            ]);
            const mode = list.multimode(p => p.name).toArray();
            expect(mode).to.deep.equal([Person.Noemi, Person.Suzuha]);
        });
    });

    describe("#none()", () => {
        test("should return true if list is empty", () => {
            const list = new List<number>();
            expect(list.none((n) => n > 1)).to.true;
        });
        test("should return true if no element matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(list.none((n) => n > 5)).to.true;
        });
        test("should return false if an element matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(list.none((n) => n === 3)).to.false;
        });
        test("should return true if list is empty and no predicate is provided", () => {
            const list = new List<number>();
            expect(list.none()).to.true;
        });
        test("should return false if list is not empty and no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(list.none()).to.false;
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
            1,
            2,
            3,
            "4",
            "5",
            "6",
            7,
            8,
            9,
            10,
            true,
            false,
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
            expect(objects).to.deep.equal([
                object,
                Person.Mirei,
                Person.Alice,
                ["x", "y", "z"]
            ]);
        });
        test("should return an array of objects via typeof", () => {
            const objects = list.ofType("object").toArray();
            expect(objects).to.deep.equal([
                object,
                Person.Mirei,
                Person.Alice,
                ["x", "y", "z"]
            ]);
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
            const stringsAndNumbers = [
                ...list.ofType(String),
                ...list.ofType(Number)
            ];
            expect(stringsAndNumbers).to.deep.equal([
                "4",
                "5",
                "6",
                1,
                2,
                3,
                7,
                8,
                9,
                10,
                999
            ]);
        });
    });

    describe("#order()", () => {
        test("should order numbers", () => {
            const unsorted = new List([4, 2, 3, 1, 5]);
            const sorted = unsorted.order().toArray();
            expect(sorted).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should use provided comparator", () => {
            const source = new List(["b", "a"]);
            const sorted1 = source.order((e1, e2) => e1.localeCompare(e2)).toArray();
            const sorted2 = source.order((e1, e2) => -(e1.localeCompare(e2))).toArray();
            expect(sorted1).to.deep.equal(["a", "b"]);
            expect(sorted2).to.deep.equal(["b", "a"]);
        });
    });

    describe("#orderBy()", () => {
        test("should order people by age [asc]", () => {
            const people = new List([
                Person.Alice,
                Person.Lenka,
                Person.Jane,
                Person.Jisu,
                Person.Kaori,
                Person.Mel,
                Person.Rebecca,
                Person.Reina,
                Person.Senna,
                Person.Vanessa,
                Person.Viola
            ]);
            const orderedPeople = people.orderBy((p) => p.age);
            const orderedPeopleAges = orderedPeople.select((p) => p.age);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#orderByDescending()", () => {
        test("should order people by age [desc]", () => {
            const people = new List([
                Person.Alice,
                Person.Lenka,
                Person.Jane,
                Person.Jisu,
                Person.Kaori,
                Person.Mel,
                Person.Rebecca,
                Person.Reina,
                Person.Senna,
                Person.Vanessa,
                Person.Viola
            ]);
            const orderedPeople = people.orderByDescending((p) => p.age);
            const orderedPeopleAges = orderedPeople.select((p) => p.age);
            const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#orderDescending()", () => {
        test("should order numbers", () => {
            const unsorted = new List([4, 2, 3, 1, 5]);
            const sorted = unsorted.orderDescending().toArray();
            expect(sorted).to.deep.equal([5, 4, 3, 2, 1]);
        });
        test("should use provided comparator", () => {
            const source = new List(["b", "a"]);
            const sorted1 = source.orderDescending((e1, e2) => e1.localeCompare(e2)).toArray();
            const sorted2 = source.orderDescending((e1, e2) => -(e1.localeCompare(e2))).toArray();
            expect(sorted1).to.deep.equal(["b", "a"]);
            expect(sorted2).to.deep.equal(["a", "b"]);
        });
    });

    describe("#pairwise()", () => {
        const list = new List(["a", "b", "c", "d", "e", "f"]);
        const result = list.pairwise((prev, curr) => [
            `->${prev}`,
            `${curr}<-`
        ]);
        test("should create an enumerable that pairs up the values", () => {
            expect(result.toArray()).to.deep.equal([
                ["->a", "b<-"],
                ["->b", "c<-"],
                ["->c", "d<-"],
                ["->d", "e<-"],
                ["->e", "f<-"]
            ]);
        });
    });

    describe("#partition()", () => {
        test("should partition the list into two lists", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const [evens, odds] = list.partition((n) => n % 2 === 0);
            expect(evens.toArray()).to.deep.equal([2, 4, 6, 8, 10]);
            expect(odds.toArray()).to.deep.equal([1, 3, 5, 7, 9]);
        });
        test("should narrow items with type guard", () => {
            const [successes, rest] = responses.partition(isSuccess);
            expect(successes.select(s => s.data).toArray()).to.deep.equal([
                Person.Alice,
                Person.Bella,
                Person.Mel
            ]);
            expect(rest.count()).to.eq(3);
            expectTypeOf(successes).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
            expectTypeOf(rest).toEqualTypeOf<IEnumerable<Exclude<ApiResponse<Person>, ApiResponseSuccess<Person>>>>();
        });
    });

    describe("#percentile()", () => {
        test("should return percentile of the list for 0.25", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = list.percentile(0.25);
            expect(result).to.equal(2.0);
        });
        test("should return percentile of the list for 0.5", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = list.percentile(0.5);
            expect(result).to.equal(3);
        });
        test("should return percentile of the list for 0.75 with 'nearest' strategy", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = list.percentile(0.75, x => x, "nearest");
            expect(result).to.equal(4);
        });
        test("should return percentile of the list for 0.5 with 'low' strategy", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.percentile(0.5, x => x, "low");
            expect(result).to.equal(2);
        });
        test("should return percentile of the list for 0.5 with 'high' strategy", () => {
            const list = new List([1, 2, 3, 4]);
            const result = list.percentile(0.5, x => x, "high");
            expect(result).to.equal(3);
        });
        test("should return percentile of the list for 0.5 with 'midpoint' strategy", () => {
            const list = new List([1, 2, 3, 10]);
            const result = list.percentile(0.5, x => x, "midpoint");
            expect(result).to.equal(2.5);
        });
        test("should use provided selector", () => {
            const list = new List([
                { value: 10 },
                { value: 20 },
                { value: 30 }
            ]);
            const result = list.percentile(0.9, x => x.value);
            expect(result).to.equal(28);
        });
    });

    describe("#permutations()", () => {
        test("should return all permutations of the list", () => {
            const list = new List([1, 2, 3]);
            const perms = list
                .permutations()
                .select((p) => p.toArray())
                .toArray();
            const expected = [
                [1, 2, 3],
                [1, 3, 2],
                [2, 1, 3],
                [2, 3, 1],
                [3, 1, 2],
                [3, 2, 1]
            ];
            expect(perms).to.deep.equal(expected);
        });
        test("should return all permutations that have the length of 2", () => {
            const list = new List(["a", "b", "c", "d"]);
            const perms = list
                .permutations(2)
                .select((p) => p.toArray())
                .toArray();
            const expected = [
                ["a", "b"],
                ["a", "c"],
                ["a", "d"],
                ["b", "a"],
                ["b", "c"],
                ["b", "d"],
                ["c", "a"],
                ["c", "b"],
                ["c", "d"],
                ["d", "a"],
                ["d", "b"],
                ["d", "c"]
            ];
            expect(perms).to.deep.equal(expected);
        });
        test("should throw error if size is less than 1", () => {
            const list = new List([1, 2, 3]);
            expect(() => list.permutations(0)).toThrow(
                "Size must be greater than 0."
            );
            expect(() => list.permutations(-1)).toThrow(
                "Size must be greater than 0."
            );
        });
        test("should return empty list if source list is empty", () => {
            const list = new List<number>();
            const perms = list
                .permutations()
                .select((p) => p.toArray())
                .toArray();
            expect(perms).to.deep.equal([[]]);
        });
        test("should return empty list if there are no distinct elements", () => {
            const list = new List([1, 1, 1]);
            const perms = list
                .permutations()
                .select((p) => p.toArray())
                .toArray();
            expect(perms).to.deep.equal([[1]]);
        });
        test(
            "should measure the time taken to generate permutations",
            () => {
                const list = Enumerable.range(1, 9).toList();
                const startTime = performance.now();
                const perms = list
                    .permutations()
                    .select((p) => p.toArray())
                    .toArray();
                const endTime = performance.now();
                console.log(
                    `Time taken to generate permutations: ${
                        endTime - startTime
                    } ms`
                );
                expect(perms.length).to.eq(362880);
            },
            { timeout: 10000 }
        );
    });

    describe("#pipe()", () => {
        test("should execute the given operator function", () => {
            const list1 = new List([1, 2, 3, 4, 5]);
            const list2 = new List([6, 7, 8, 9, 10]);
            const avgOfEvenSquares = (source: Iterable<number>): number => from(source).where(n => n % 2 === 0).select(n => n * n).average();
            const result1 = list1.where(n => n % 2 === 0).select(n => n * n).average();
            const result2 = list2.where(n => n % 2 === 0).select(n => n * n).average();
            const pipeResult1 = list1.pipe(avgOfEvenSquares);
            const pipeResult2 = list2.pipe(avgOfEvenSquares);
            expect(pipeResult1).to.eq(result1);
            expect(pipeResult2).to.eq(result2);
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

    describe("#product()", () => {
        test("should return the product of all elements", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const product = list.product();
            expect(product).to.eq(120);
        });
        test("should return the product of all elements", () => {
            const list1 = new List([1, 2, 3, 4, 5, 0]);
            const list2 = new List([-1, -2, -3, -4, -5]);
            const product1 = list1.product();
            const product2 = list2.product();
            expect(product1).to.eq(0);
            expect(product2).to.eq(-120);
        });
        test("it should use the provided selector", () => {
            const list = new List([Person.Alice, Person.Reina, Person.Mirei]);
            const product = list.product((p) => p.age);
            expect(product).to.eq(
                Person.Alice.age * Person.Reina.age * Person.Mirei.age
            );
        });
        test("should throw error if list is empty", () => {
            const list = new List<number>();
            expect(() => list.product()).toThrow(new NoElementsException());
        });
    });

    describe("#remove()", () => {
        const list1 = new List([
            Person.Alice,
            Person.Noemi,
            null,
            Person.Noemi2,
            null
        ]);
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
            const list1 = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla,
                Person.Vanessa,
                Person.Viola
            ]);
            const list2 = new List([
                Person.Vanessa,
                Person.Viola,
                Person.Noemi2
            ]);
            list1.removeAll(list2);
            expect(list1.size()).to.eq(4);
            expect(list1.get(3)).to.eq(Person.Priscilla);
            expect(list1.length).to.eq(4);
        });
        test("should use the provided comparator for comparison", () => {
            const list1 = new List(
                [
                    Person.Alice,
                    Person.Lucrezia,
                    Person.Noemi,
                    Person.Priscilla,
                    Person.Vanessa,
                    Person.Viola
                ],
                personNameComparator
            );
            const list2 = new List([
                Person.Vanessa,
                Person.Viola,
                Person.Noemi2
            ]);
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
            expect(() => list.removeAt(-1)).toThrow(
                new IndexOutOfBoundsException(-1)
            );
            expect(() => list.removeAt(44)).toThrow(
                new IndexOutOfBoundsException(44)
            );
            expect(list.length).to.eq(5);
        });
        test("should remove element from the specified index", () => {
            const list1 = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla,
                Person.Vanessa,
                Person.Viola
            ]);
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
            const list1 = new List([
                Person.Alice,
                Person.Lucrezia,
                Person.Noemi,
                Person.Priscilla,
                Person.Vanessa,
                Person.Viola
            ]);
            list1.removeIf((p) => p.name.length > 5);
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
            const list1 = new List(
                [
                    Person.Alice,
                    Person.Lucrezia,
                    Person.Noemi,
                    Person.Priscilla,
                    Person.Vanessa,
                    Person.Viola
                ],
                personNameComparator
            );
            const list2 = new List([
                Person.Vanessa,
                Person.Viola,
                Person.Noemi2
            ]);
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

    describe("#rotate()", () => {
        test("should left rotate the list by 2", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const rotated = list.rotate(2).toArray();
            expect(rotated).to.deep.equal([3, 4, 5, 1, 2]);
        });
        test("should right rotate the list by 2", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const rotated = list.rotate(-2).toArray();
            expect(rotated).to.deep.equal([4, 5, 1, 2, 3]);
        });
        test("should right rotate by 3", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const rotated = list.rotate(13).toArray();
            expect(rotated).to.deep.equal([4, 5, 1, 2, 3]);
        });
        test("should return the same order as source", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const rotated = list.rotate(0).toArray();
            expect(rotated).to.deep.equal([1, 2, 3, 4, 5]);
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
            expect(() => list.scan((acc, n) => acc + n).toArray()).toThrow(
                new NoElementsException()
            );
        });
    });

    describe("#select()", () => {
        test("should return an IEnumerable with elements [4, 25, 36, 81]", () => {
            const list = new List([2, 5, 6, 9]);
            const list2 = list.select((n) => Math.pow(n, 2)).toList();
            expect(list2.size()).to.eq(4);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(25);
            expect(list2.get(2)).to.eq(36);
            expect(list2.get(3)).to.eq(81);
            expect(list2.length).to.eq(4);
        });
        test("should return an IEnumerable with elements [125, 729]", () => {
            const list = new List([2, 5, 6, 9]);
            const list2 = list
                .where((n) => n % 2 !== 0)
                .select((n) => Math.pow(n, 3))
                .toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(125);
            expect(list2.get(1)).to.eq(729);
        });
        test("should have index as the second parameter", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = list.select((n, i) => n + i).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(3);
            expect(list2.get(2)).to.eq(5);
            expect(list2.get(3)).to.eq(7);
            expect(list2.get(4)).to.eq(9);
        });
    });

    describe("#selectMany()", () => {
        test("should return a flattened array of ages #1", () => {
            const people: Person[] = [];
            Person.Viola.friendsArray = [Person.Rebecca];
            Person.Jisu.friendsArray = [Person.Alice, Person.Mel];
            Person.Vanessa.friendsArray = [
                Person.Viola,
                Person.Rebecca,
                Person.Jisu,
                Person.Alice
            ];
            Person.Rebecca.friendsArray = [Person.Viola];
            people.push(Person.Viola);
            people.push(Person.Rebecca);
            people.push(Person.Jisu);
            people.push(Person.Vanessa);
            const peopleList = new List(people);
            const friends = peopleList
                .selectMany((p) => p.friendsArray)
                .select((p) => p.age)
                .toArray();
            expect(friends).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
        });
        test("should return a flattened array of ages #2", () => {
            const people: Person[] = [];
            Person.Viola.friendsList = new List([Person.Rebecca]);
            Person.Jisu.friendsList = new List([Person.Alice, Person.Mel]);
            Person.Vanessa.friendsList = new List([
                Person.Viola,
                Person.Rebecca,
                Person.Jisu,
                Person.Alice
            ]);
            Person.Rebecca.friendsList = new List([Person.Viola]);
            people.push(Person.Viola);
            people.push(Person.Rebecca);
            people.push(Person.Jisu);
            people.push(Person.Vanessa);
            const peopleList = new List(people);
            const friends = peopleList
                .selectMany((p) => p.friendsList)
                .select((p) => p.age)
                .toArray();
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
            const list1 = new List([
                Person.Alice,
                Person.Mel,
                Person.Lenka,
                Person.Noemi
            ]);
            const list2 = new List([
                Person.Alice,
                Person.Mel,
                Person.Lenka,
                Person.Noemi2
            ]);
            expect(
                list1.sequenceEqual(list2, (p1, p2) => p1.name === p2.name)
            ).to.eq(true);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
    });

    describe("#set", () => {
        test("should throw error if index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => list.set(-1, 111)).toThrow(
                new IndexOutOfBoundsException(-1)
            );
            expect(() => list.set(44, 111)).toThrow(
                new IndexOutOfBoundsException(44)
            );
            list.clear();
            expect(() => list.set(0, 111)).toThrow(
                new IndexOutOfBoundsException(0)
            );
        });
        test("should change the element at the specified index with the provided element", () => {
            const list = new List([1, 2, 3, 4, 5]);
            list.set(1, 222);
            expect(list.size()).to.eq(5);
            expect(list.get(1)).to.eq(222);
            expect(list.indexOf(2)).to.eq(-1);
        });
    });

    describe("#shuffle()", () => {
        test("should shuffle the list", () => {
            const list = new List(Enumerable.range(1, 12));
            const shuffled = list.shuffle();
            expect(shuffled.count()).to.eq(12);
            expect(shuffled.toArray()).to.not.deep.eq([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
            ]);
        });
    });

    describe("#single()", () => {
        test("should throw error if list is empty.", () => {
            const list = new List<number>();
            expect(() => list.single()).toThrow(new NoElementsException());
            expect(() => list.single((n) => n > 0)).toThrow(
                new NoElementsException()
            );
        });
        test("should throw error if list has more than one element", () => {
            const list = new List();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            expect(() => list.single()).toThrowError(
                new MoreThanOneElementException()
            );
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
            expect(() => list.single((p) => p.name === "Lenka")).toThrowError(
                new NoMatchingElementException()
            );
        });
        test("should throw error if more than one matching element is found.", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            list.add(Person.Senna);
            expect(() => list.single((p) => p.name === "Senna")).toThrowError(
                new MoreThanOneMatchingElementException()
            );
        });
        test("should return person with name 'Alice'.", () => {
            const list = new List<Person>();
            list.add(Person.Alice);
            list.add(Person.Senna);
            list.add(Person.Jane);
            const single = list.single((p) => p.name === "Alice");
            expect(single.name).to.eq("Alice");
            expect(single).to.eq(Person.Alice);
        });
        test("should not throw error if the only element is null or undefined", () => {
            const data = [null];
            const list = new List(data);
            expect(() => list.single()).to.not.throw();
            const single = list.single();
            expect(single).to.eq(null);
        });
        test("should narrow items with type guard", () => {
            const loading = responses.single(isLoading);
            expectTypeOf(loading).toHaveProperty("estimatedTime");
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
            const sod2 = list2.singleOrDefault((n) => n > 0);
            expect(sod1).to.eq(null);
            expect(sod2).to.eq(null);
        });
        test("should return 3", () => {
            const item = list.singleOrDefault((n) => n === 3);
            expect(item).to.eq(3);
        });
        test(`should throw error`, () => {
            list.add(3);
            expect(() => list.singleOrDefault((n) => n === 3)).toThrowError(
                new MoreThanOneMatchingElementException()
            );
        });
        test("should return the only element in the list", () => {
            const list2 = new List<string>();
            list2.add("Suzuha");
            const sod = list2.singleOrDefault();
            expect(sod).to.eq("Suzuha");
        });
        test(`should throw error`, () => {
            const list2 = new List<string>();
            list2.add("Suzuha");
            list2.add("Suzuri");
            expect(() => list2.singleOrDefault()).toThrowError(
                new MoreThanOneElementException()
            );
        });
        test("should return default value [null] if no matching element is found.", () => {
            const sod = list.singleOrDefault((n) => n < 0);
            expect(sod).to.eq(null);
        });
        test("should not throw error if the only element is null or undefined", () => {
            const data = [undefined];
            const data2 = [null];
            const list = new List(data);
            const list2 = new List(data2);
            const sod = list.singleOrDefault();
            const sod2 = list2.singleOrDefault();
            expect(sod).to.eq(undefined);
            expect(sod2).to.eq(null);
        });
        test("should narrow items with type guard", () => {
            const loading = responses.singleOrDefault(isLoading);
            expectTypeOf(loading!).toHaveProperty("estimatedTime");
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
        test("should run performance test", () => {
            const list = new List(Enumerable.range(1, 1000000));
            const start = Date.now();
            list.skipLast(999999).toList();
            const end = Date.now();
            console.log(`Performance test took ${end - start}ms`);
        });
    });
    describe("#skipUntil()", () => {
        test("should skip elements until predicate matches and include matching and following elements", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = list.skipUntil((n) => n > 2).toArray();
            expect(result).to.deep.equal([3, 4, 5]);
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
            const list = new List([
                Person.Noemi,
                Person.Alice,
                Person.Lucrezia,
                Person.Priscilla,
                Person.Eliza,
                Person.Bella
            ]);
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
        });
    });

    describe("#span()", () => {
        test("should return two lists", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 6, 5, 3]);
            const [first, second] = list.span((n) => n < 6);
            expect(first.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
            expect(second.toArray()).to.deep.equal([6, 7, 8, 9, 10, 6, 5, 3]);
        });
        test("should have empty list for first part and full list for second part", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const [first, second] = list.span((n) => n > 100);
            expect(second.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
            expect(first.none()).to.eq(true);
            expect(second.none()).to.eq(false);
        });
        test("should have full list for first part and empty list for second part", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const [first, second] = list.span((n) => n < 100);
            expect(first.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
            expect(first.none()).to.eq(false);
            expect(second.none()).to.eq(true);
        });
        test("should have empty list for both parts", () => {
            const list = new List<number>();
            const [first, second] = list.span((n) => n < 100);
            expect(first.none()).to.eq(true);
            expect(second.none()).to.eq(true);
        });
        test("should narrow items with type guard", () => {
            const [initialSuccesses, remainder] = responses.span(isSuccess);
            expect(initialSuccesses.toArray()).to.deep.equal([{ status: "success", data: Person.Alice }]);
            expect(remainder.count()).to.eq(5);
            expectTypeOf(initialSuccesses).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
            expectTypeOf(remainder).toEqualTypeOf<IEnumerable<ApiResponse<Person>>>();
        });
    });

    describe("#standardDeviation()", () => {
        test("should return the standard deviation of the list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const stdDevForSample = list.standardDeviation();
            const stdDevForPopulation = list.standardDeviation(x => x, false);
            const acceptableResultForSample = (stdDevForSample - Math.sqrt(2.5)) < 1e-12;
            const acceptableResultForPopulation = (stdDevForPopulation - Math.sqrt(2)) < 1e-12;
            expect(acceptableResultForSample).to.be.true;
            expect(acceptableResultForPopulation).to.be.true;
        });
        test("should return standard deviation as 0 for all identical values", () => {
            const list = new List([3, 3, 3, 3]);
            const sampleStdDev = list.standardDeviation();
            const populationStdDev = list.standardDeviation(x => x, false);
            expect(sampleStdDev).to.equal(0);
            expect(populationStdDev).to.equal(0);
        });
        test("should return NaN for empty input", () => {
            const list = new List<number>([]);
            const sampleStdDev = list.standardDeviation();
            const populationStdDev = list.standardDeviation(x => x, false);
            expect(sampleStdDev).to.be.NaN;
            expect(populationStdDev).to.be.NaN;
        });
        test("should work with given selector", () => {
            const people = new List([
                { name: "A", age: 20 },
                { name: "B", age: 25 },
                { name: "C", age: 30 }
            ]);
            const sampleStdDev = people.standardDeviation(p => p.age);
            const populationStdDev = people.standardDeviation(p => p.age, false);
            const acceptableSampleStdDev = sampleStdDev - Math.sqrt(25) < 1e-12;
            const acceptablePopulationStdDev = populationStdDev - Math.sqrt(16.6666666667) < 1e-12;
            expect(acceptableSampleStdDev).to.be.true;
            expect(acceptablePopulationStdDev).to.be.true;
        });
    });

    describe("#step()", () => {
        test("should return an IEnumerable with elements [1,3,5,7,9]", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const list2 = list.step(2).toList();
            expect(list2.toArray()).to.deep.equal([1, 3, 5, 7, 9]);
            expect(list2.count()).to.eq(5);
        });
        test("should return an IEnumerable with elements [1,4,7,10]", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const list2 = list.step(3).toList();
            expect(list2.toArray()).to.deep.equal([1, 4, 7, 10]);
            expect(list2.count()).to.eq(4);
        });
        test("should return an IEnumerable with elements [1,5,9]", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const list2 = list.step(4).toList();
            expect(list2.toArray()).to.deep.equal([1, 5, 9]);
            expect(list2.count()).to.eq(3);
        });
        test("should return an IEnumerable with only the first element", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            const list2 = list.step(10).toList();
            const list3 = list.step(100).toList();
            expect(list2.toArray()).to.deep.equal([1]);
            expect(list2.count()).to.eq(1);
            expect(list3.toArray()).to.deep.equal([1]);
            expect(list3.count()).to.eq(1);
        });
        test("should throw error if step is less than 1", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            expect(() => list.step(0)).toThrow("Step must be greater than 0.");
            expect(() => list.step(-1)).toThrow("Step must be greater than 0.");
        });
    });

    describe("#sum()", () => {
        test("should return 21", () => {
            const list = new List([1, 2, 3, 4, 5, 6]);
            const sum = list.sum((n) => n);
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
        test("should run performance test", () => {
            const largeList = new List<number>();
            for (let i = 0; i < 100000; i++) {
                largeList.add(i);
            }
            const result = largeList.takeLast(100).toList();
            expect(result.count()).to.eq(100);
            expect(result.get(0)).to.eq(99900);
            expect(result.get(99)).to.eq(99999);
        });
    });
    describe("#takeUntil()", () => {
        const list = new List([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500]);
        test("should return an IEnumerable with elements [5000, 2500]", () => {
            const list2 = list.takeUntil((n) => n >= 9000).toList();
            expect(list2.toArray()).to.deep.equal([5000, 2500]);
            expect(list2.count()).to.eq(2);
        });
    });
    describe("#takeWhile()", () => {
        const list = new List([
            "apple",
            "banana",
            "mango",
            "orange",
            "plum",
            "grape"
        ]);
        test("should return an IEnumerable with elements [apple, banana, mango]", () => {
            const list2 = list
                .takeWhile((f) => f.localeCompare("orange") !== 0)
                .toList();
            expect(list2.get(0)).to.eq("apple");
            expect(list2.get(1)).to.eq("banana");
            expect(list2.get(2)).to.eq("mango");
            expect(list2.count()).to.eq(3);
        });
        test("should narrow items with type guard", () => {
            const result = responses.takeWhile(isSuccess);
            expect(result.toArray()).to.deep.equal([
                { status: "success", data: Person.Alice }
            ]);
            expectTypeOf(result).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
        });
    });

    describe("#tap()", () => {
        test("should tap into sequence without modifying it", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const squares: [number, number][] = [];
            const list2 = list.tap((n, nx) => squares.push([nx, n * n])).toImmutableList();
            const expectedTap = [
                [0, 1],
                [1, 4],
                [2, 9],
                [3, 16],
                [4, 25]
            ];
            expect(squares).to.deep.equal(expectedTap);
            expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#thenBy()", () => {
        test("should order people by age [asc] then by name[asc]", () => {
            const people = new List([
                Person.Alice,
                Person.Lenka,
                Person.Jane,
                Person.Jisu,
                Person.Kaori,
                Person.Mel,
                Person.Rebecca,
                Person.Reina,
                Person.Senna,
                Person.Vanessa,
                Person.Viola
            ]);
            const orderedPeople = people
                .orderBy(
                    (p) => p.age,
                    (a1, a2) => a1 - a2
                )
                .thenBy((p) => p.name);
            const orderedPeopleAges = orderedPeople.select((p) => p.age);
            const orderedPeopleNames = orderedPeople.select((p) => p.name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = [
                "Mel",
                "Kaori",
                "Senna",
                "Jisu",
                "Jane",
                "Lenka",
                "Rebecca",
                "Vanessa",
                "Alice",
                "Reina",
                "Viola"
            ];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        test("should order people by age [asc] then by name[asc] then by surname[asc]", () => {
            const people = new List([
                Person.Bella,
                Person.Amy,
                Person.Emily,
                Person.Eliza,
                Person.Hanna,
                Person.Hanna2,
                Person.Suzuha3,
                Person.Julia,
                Person.Lucrezia,
                Person.Megan,
                Person.Noemi,
                Person.Olga,
                Person.Priscilla,
                Person.Reika,
                Person.Suzuha,
                Person.Suzuha2,
                Person.Noemi2
            ]);
            const orderedPeople = people
                .orderBy((p) => p.age)
                .thenBy(
                    (p) => p.name,
                    (n1, n2) => n1.localeCompare(n2)
                )
                .thenBy((p) => p.surname);
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
            const people = new List([
                Person.Bella,
                Person.Amy,
                Person.Emily,
                Person.Eliza,
                Person.Hanna,
                Person.Hanna2,
                Person.Suzuha3,
                Person.Julia,
                Person.Lucrezia,
                Person.Megan,
                Person.Noemi,
                Person.Olga,
                Person.Priscilla,
                Person.Reika,
                Person.Suzuha,
                Person.Suzuha2,
                Person.Noemi2
            ]);
            const orderedPeople = people
                .orderByDescending(
                    (p) => p.age,
                    (a1, a2) => a1 - a2
                )
                .thenBy((p) => p.name)
                .thenByDescending(
                    (p) => p.surname,
                    (n1, n2) => n1.localeCompare(n2)
                )
                .orderBy((p) => p.age)
                .thenBy((p) => p.name);
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
            const people = new List([
                Person.Alice,
                Person.Lenka,
                Person.Jane,
                Person.Jisu,
                Person.Kaori,
                Person.Mel,
                Person.Rebecca,
                Person.Reina,
                Person.Senna,
                Person.Vanessa,
                Person.Viola
            ]);
            const orderedPeople = people
                .orderBy((p) => p.age)
                .thenByDescending((p) => p.name);
            const orderedPeopleAges = orderedPeople.select((p) => p.age);
            const orderedPeopleNames = orderedPeople.select((p) => p.name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = [
                "Mel",
                "Senna",
                "Kaori",
                "Jisu",
                "Lenka",
                "Jane",
                "Rebecca",
                "Vanessa",
                "Reina",
                "Alice",
                "Viola"
            ];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        test("should order people by age [desc] then by name[desc] then by surname[desc]", () => {
            const people = new List([
                Person.Bella,
                Person.Amy,
                Person.Emily,
                Person.Eliza,
                Person.Hanna,
                Person.Hanna2,
                Person.Suzuha3,
                Person.Julia,
                Person.Lucrezia,
                Person.Megan,
                Person.Noemi,
                Person.Olga,
                Person.Priscilla,
                Person.Reika,
                Person.Suzuha,
                Person.Suzuha2,
                Person.Noemi2
            ]);
            const orderedPeople = people
                .orderByDescending(
                    (p) => p.age,
                    (a1, a2) => a1 - a2
                )
                .thenByDescending((p) => p.name)
                .thenByDescending(
                    (p) => p.surname,
                    (n1, n2) => n1.localeCompare(n2)
                );
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
            const people = new List([
                Person.Bella,
                Person.Amy,
                Person.Emily,
                Person.Eliza,
                Person.Hanna,
                Person.Hanna2,
                Person.Suzuha3,
                Person.Julia,
                Person.Lucrezia,
                Person.Megan,
                Person.Noemi,
                Person.Olga,
                Person.Priscilla,
                Person.Reika,
                Person.Suzuha,
                Person.Suzuha2,
                Person.Noemi2
            ]);
            const orderedPeople = people
                .orderByDescending(
                    (p) => p.age,
                    (a1, a2) => a1 - a2
                )
                .thenByDescending((p) => p.name)
                .thenByDescending(
                    (p) => p.surname,
                    (n1, n2) => n1.localeCompare(n2)
                )
                .orderBy((p) => p.age)
                .thenBy((p) => p.name);
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
            const people = new List([
                Person.Bella,
                Person.Amy,
                Person.Emily,
                Person.Eliza,
                Person.Hanna,
                Person.Hanna2,
                Person.Suzuha3,
                Person.Julia,
                Person.Lucrezia,
                Person.Megan,
                Person.Noemi,
                Person.Olga,
                Person.Priscilla,
                Person.Reika,
                Person.Suzuha,
                Person.Suzuha2,
                Person.Noemi2
            ]);
            const orderedPeople = people
                .orderByDescending(
                    (p) => p.age,
                    (a1, a2) => a1 - a2
                )
                .thenByDescending((p) => p.name)
                .thenByDescending(
                    (p) => p.surname,
                    (n1, n2) => n1.localeCompare(n2)
                )
                .orderByDescending((p) => p.age)
                .thenBy((p) => p.name);
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

    describe("#toCircularLinkedList()", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const circularList = list.toCircularLinkedList();

        test("should return a new CircularLinkedList without altering the current list", () => {
            expect(list.size()).to.eq(5);
            expect(circularList instanceof CircularLinkedList).to.be.true;
            expect(circularList.size()).to.eq(5);
            expect(list.length).to.eq(5);
            expect(circularList.length).to.eq(5);
        });

        test("should preserve the elements and their order", () => {
            expect(circularList.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });

        test("should work with an empty list", () => {
            const emptyList = new List<number>();
            const emptyCircularList = emptyList.toCircularLinkedList();
            expect(emptyCircularList.isEmpty()).to.be.true;
            expect(emptyCircularList.size()).to.eq(0);
        });

        test("should accept a custom comparator", () => {
            const personList = new List([Person.Alice, Person.Noemi]);
            const customComparator = (p1: Person, p2: Person) =>
                p1.name === p2.name;
            const circularPersonList =
                personList.toCircularLinkedList(customComparator);

            // Create a new person with the same name but different age
            const aliceClone = new Person("Alice", "Smith", 30);

            // With custom comparator, it should find Alice by name
            expect(circularPersonList.contains(aliceClone)).to.be.true;
        });
    });

    describe("#toCircularQueue()", () => {
        const list = new List<number>([1, 2, 3, 4, 5]);
        test("should return a new CircularQueue without altering the list", () => {
            const queue = list.toCircularQueue();
            expect(queue instanceof CircularQueue).to.be.true;
        });
        test("should retain only the most recent elements up to capacity", () => {
            const queue = list.toCircularQueue(3);
            expect(queue.toArray()).to.deep.equal([3, 4, 5]);
        });
        test("should retain all elements if capacity is bigger than the size of the source", () => {
            const queue = list.toCircularQueue(100);
            expect(queue.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toDictionary()", () => {
        const list = new List([
            Person.Alice,
            Person.Mel,
            Person.Noemi,
            Person.Lucrezia,
            Person.Amy,
            Person.Bella,
            Person.Reina
        ]);
        test("should convert it to a dictionary", () => {
            const dictionary = list.toDictionary(
                (p) => p.name,
                (p) => p
            );
            expect(dictionary.get(Person.Alice.name)).to.equal(Person.Alice);
            expect(dictionary.get(Person.Mel.name)).to.equal(Person.Mel);
            expect(dictionary.get(Person.Noemi.name)).to.equal(Person.Noemi);
            expect(dictionary.get(Person.Lucrezia.name)).to.equal(
                Person.Lucrezia
            );
            expect(dictionary.get(Person.Amy.name)).to.equal(Person.Amy);
            expect(dictionary.get(Person.Bella.name)).to.equal(Person.Bella);
            expect(dictionary.get(Person.Reina.name)).to.equal(Person.Reina);
            expect(dictionary.keys().toArray()).to.deep.equal([
                "Alice",
                "Mel",
                "Noemi",
                "Lucrezia",
                "Amy",
                "Bella",
                "Reina"
            ]);
        });
    });

    describe("#toEnumerableSet()", () => {
        const list = new List([1, 2, 3, 4, 4, 5, 6, 7, 7, 7, 8, 9, 10]);
        test("should convert it to a set", () => {
            const set = list.toEnumerableSet();
            expect(set.toArray()).to.deep.equal([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ]);
        });
    });

    describe("#toImmutableCircularQueue", () => {
        const list = new List([1, 2, 3, 4, 5]);
        test("should return an ImmutableCircularQueue without altering the list", () => {
            const queue = list.toImmutableCircularQueue();
            expect(queue instanceof ImmutableCircularQueue).to.be.true;
            expect(queue.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toImmutableDictionary()", () => {
        const list = new List([
            Person.Alice,
            Person.Mel,
            Person.Noemi,
            Person.Lucrezia,
            Person.Amy,
            Person.Bella,
            Person.Reina
        ]);
        test("should convert it to an immutable dictionary", () => {
            const dictionary = list.toImmutableDictionary(
                (p) => p.name,
                (p) => p
            );
            expect(dictionary.get(Person.Alice.name)).to.equal(Person.Alice);
            expect(dictionary.get(Person.Mel.name)).to.equal(Person.Mel);
            expect(dictionary.get(Person.Noemi.name)).to.equal(Person.Noemi);
            expect(dictionary.get(Person.Lucrezia.name)).to.equal(
                Person.Lucrezia
            );
            expect(dictionary.get(Person.Amy.name)).to.equal(Person.Amy);
            expect(dictionary.get(Person.Bella.name)).to.equal(Person.Bella);
            expect(dictionary.get(Person.Reina.name)).to.equal(Person.Reina);
            expect(dictionary.keys().toArray()).to.deep.equal([
                "Alice",
                "Mel",
                "Noemi",
                "Lucrezia",
                "Amy",
                "Bella",
                "Reina"
            ]);
            const dict2 = dictionary.add(
                Person.Priscilla.name,
                Person.Priscilla
            );
            expect(dict2.size()).to.eq(8);
            expect(dict2.get(Person.Priscilla.name)).to.eq(Person.Priscilla);
            expect(dictionary.size()).to.eq(7);
            expect(dictionary.get(Person.Priscilla.name)).to.be.null;
            expect(dict2.length).to.eq(8);
            expect(dictionary.length).to.eq(7);
            expect(dict2.keys().toArray()).to.deep.equal([
                "Alice",
                "Mel",
                "Noemi",
                "Lucrezia",
                "Amy",
                "Bella",
                "Reina",
                "Priscilla"
            ]);
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

    describe("#toImmutableQueue()", () => {
        const list = new List([1, 2, 3, 4, 5]);
        test("should convert it to an immutable queue", () => {
            const queue = list.toImmutableQueue();
            expect(queue instanceof ImmutableQueue).to.be.true;
            expect(queue.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toImmutableSet()", () => {
        const list = new List([1, 2, 3, 4, 4, 5, 6, 7, 7, 7, 8, 9, 10]);
        test("should convert it to an immutable set", () => {
            const set = list.toImmutableSet();
            expect(set.toArray()).to.deep.equal([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ]);
            const set2 = set.toImmutableSet().add(999);
            expect(set).to.not.equal(set2);
            expect(set.size()).to.eq(10);
            expect(set2.size()).to.eq(11);
            expect(set2.last()).to.eq(999);
        });
    });

    describe("#toImmutableSortedDictionary()", () => {
        const people = new List([
            Person.Alice,
            Person.Vanessa,
            Person.Viola,
            Person.Lenka,
            Person.Senna
        ]);
        test("should create a sorted dictionary from the list", () => {
            const dict = people.toImmutableSortedDictionary(
                (p) => p.name,
                (p) => p
            );
            expect(dict.size()).to.eq(people.size());
            expect(dict.keys().toArray()).to.deep.equal([
                "Alice",
                "Lenka",
                "Senna",
                "Vanessa",
                "Viola"
            ]);
            const dict2 = dict.add(Person.Kaori.name, Person.Kaori);
            expect(dict2.size()).to.eq(people.size() + 1);
            expect(dict2.get(Person.Kaori.name)).to.eq(Person.Kaori);
            expect(dict.size()).to.eq(people.size());
            expect(dict.get(Person.Kaori.name)).to.be.null;
            expect(dict2.length).to.eq(people.size() + 1);
            expect(dict.length).to.eq(people.size());
            expect(dict2.keys().toArray()).to.deep.equal([
                "Alice",
                "Kaori",
                "Lenka",
                "Senna",
                "Vanessa",
                "Viola"
            ]);
        });
    });

    describe("#toImmutableSortedSet()", () => {
        const list = new List([5, 2, 3, 4, 4, 3, 9, 7, 7, 6, 8, 1, 10]);
        test("should convert it to an immutable sorted set", () => {
            const set = list.toImmutableSortedSet();
            expect(set.toArray()).to.deep.equal([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ]);
            const set2 = set.toImmutableSortedSet().add(999);
            expect(set).to.not.equal(set2);
            expect(set.size()).to.eq(10);
            expect(set2.size()).to.eq(11);
            expect(set.last()).to.eq(10);
            expect(set2.last()).to.eq(999);
        });
    });

    describe("#toImmutableStack()", () => {
        const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        test("should convert it to an immutable stack", () => {
            const stack = list.toImmutableStack();
            expect(stack.size()).to.eq(10);
            expect(stack.peek()).to.eq(10);
            const stack2 = stack.push(999);
            expect(stack2 !== stack).to.be.true;
            expect(stack.size()).to.eq(10);
            expect(stack2.size()).to.eq(11);
            expect(stack.peek()).to.eq(10);
            expect(stack2.peek()).to.eq(999);
            expect(stack2.last()).to.eq(1);
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
        const list = new List([
            Person.Suzuha,
            Person.Suzuha2,
            Person.Suzuha3,
            Person.Noemi,
            Person.Noemi2,
            Person.Hanna,
            Person.Hanna2
        ]);
        const lookup = list.toLookup(
            (p) => p.name,
            (p) => p,
            (n1, n2) => n1.localeCompare(n2)
        );
        test("should create a lookup with name being the key", () => {
            expect(lookup.size()).to.eq(3);
            expect(lookup.hasKey("Noemi")).to.eq(true);
        });
    });

    describe("#toMap()", () => {
        const list = new List([
            Person.Suzuha,
            Person.Suzuha2,
            Person.Suzuha3,
            Person.Noemi,
            Person.Noemi2,
            Person.Hanna,
            Person.Hanna2
        ]);
        const map = list.toMap(
            (p) => p.name,
            (p) => p
        );
        /**
         * Duplicate keys are not allowed in a map, so the last element with the same key will be the one stored in the map.
         */
        test("should create a map with name being the key", () => {
            expect(map.size).to.eq(3);
            expect(map.get("Noemi")).to.eq(Person.Noemi2);
            expect(map.get("Suzuha")).to.eq(Person.Suzuha3);
            expect(map.get("Hanna")).to.eq(Person.Hanna2);
        });
    });

    describe("#toObject()", () => {
        const list = new List([
            Person.Suzuha,
            Person.Suzuha2,
            Person.Suzuha3,
            Person.Noemi,
            Person.Noemi2,
            Person.Hanna,
            Person.Hanna2
        ]);
        const obj = list.toObject(
            (p) => p.name,
            (p) => p
        );
        test("should create an object with name being the key", () => {
            expect(obj["Noemi"]).to.eq(Person.Noemi2);
            expect(obj["Suzuha"]).to.eq(Person.Suzuha3);
            expect(obj["Hanna"]).to.eq(Person.Hanna2);
        });
    });

    describe("#toPriorityQueue()", () => {
        const list = new List([70, 5, 0, 14, 20, 65, 12, 37]);
        const queue = list.toPriorityQueue();
        test("should return a new min PriorityQueue", () => {
            const expected = [0, 14, 5, 37, 20, 65, 12, 70];
            expect(queue instanceof PriorityQueue).to.be.true;
            expect(queue.toArray()).to.deep.equal(expected);
        });
        test("should return a new max PriorityQueue", () => {
            const queue = list.toPriorityQueue((a, b) => b - a);
            const expected = [70, 37, 65, 20, 14, 0, 12, 5];
            expect(queue.toArray()).to.deep.equal(expected);
        });
    });

    describe("#toQueue()", () => {
        const list = new List([1, 2, 3]);
        const queue = list.toQueue();
        test("should return a new Queue without altering the current list", () => {
            expect(list.toArray()).to.deep.equal(queue.toArray());
        });
    });

    describe("#toSet()", () => {
        const list = new List([1, 2, 3, 4, 4, 5, 6, 7, 7, 7, 8, 9, 10]);
        test("should convert it to a set", () => {
            const set = list.toSet();
            expect(Array.from(set)).to.deep.equal([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ]);
        });
    });

    describe("#toSortedDictionary()", () => {
        const people = new List([
            Person.Alice,
            Person.Vanessa,
            Person.Viola,
            Person.Lenka,
            Person.Senna
        ]);
        test("should create a sorted dictionary from the list", () => {
            const dict = people.toSortedDictionary(
                (p) => p.name,
                (p) => p
            );
            expect(dict.size()).to.eq(people.size());
            expect(dict.keys().toArray()).to.deep.equal([
                "Alice",
                "Lenka",
                "Senna",
                "Vanessa",
                "Viola"
            ]);
        });
    });

    describe("#toSortedSet()", () => {
        const list = new List([5, 2, 3, 4, 4, 3, 9, 7, 7, 6, 8, 1, 10]);
        test("should create a sorted set from the list", () => {
            const set = list.toSortedSet();
            expect(set.toArray()).to.deep.equal([
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ]);
        });
    });

    describe("#toStack()", () => {
        const list = new List([1, 2, 3]);
        const stack = list.toStack();
        test("should return a new Stack without altering the current list", () => {
            expect(stack instanceof Stack).to.be.true;
            expect(stack.toArray()).to.deep.equal(list.reverse().toArray());
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
            const people = new List([
                Person.Alice,
                Person.Vanessa,
                Person.Viola,
                Person.Lenka,
                Person.Senna
            ]);
            expect(people.toString("|", (p) => `${p.name}`)).to.equal(
                "Alice|Vanessa|Viola|Lenka|Senna"
            );
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
            const list2 = new List([
                "Alice",
                "Rei",
                "Vanessa",
                "Vanessa",
                "Yuzuha"
            ]);
            const union = list1.union(list2);
            expect(union.toArray()).to.deep.equal([
                "Alice",
                "Misaki",
                "Megumi",
                "Rei",
                "Vanessa",
                "Yuzuha"
            ]);
            expect(union.toList().length).to.eq(6);
        });
        test(
            "should return union of two enumerables",
            () => {
                const list1 = new List<Person>();
                const list2 = new List<Person>();
                for (let px = 0; px < 100000; ++px) {
                    const p = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 90)
                    );
                    list1.add(p);
                }
                for (let px = 0; px < 100000; ++px) {
                    const p = new Person(
                        Helper.generateRandomString(8),
                        Helper.generateRandomString(10),
                        Helper.generateRandomNumber(1, 50)
                    );
                    list2.add(p);
                }
                const exceptionList = list1.union(
                    list2,
                    (p1, p2) => p1.age === p2.age
                );
                const ageCount = exceptionList
                    .select((p) => p.age)
                    .distinct()
                    .count();
                expect(ageCount).to.not.greaterThan(90);
            },
            { timeout: 10000 }
        );
    });

    describe("#unionBy()", () => {
        test("should return a set of items from two lists", () => {
            const list1 = new List([Person.Alice, Person.Noemi]);
            const list2 = new List([
                Person.Noemi2,
                Person.Suzuha,
                Person.Alice
            ]);
            const union = list1.unionBy(list2, (p) => p.name);
            expect(union.toArray()).to.deep.equal([
                Person.Alice,
                Person.Noemi,
                Person.Suzuha
            ]);
        });
        test("should use provided comparator", () => {
            const LittleAlice = new Person("alice", "Nanahira", 9);
            const list1 = new List([Person.Alice, Person.Noemi, LittleAlice]);
            const list2 = new List([
                Person.Noemi2,
                Person.Suzuha,
                Person.Alice
            ]);
            const unionWithDefaultComparator = list1.unionBy(
                list2,
                (p) => p.name
            );
            const unionWithCustomComparator = list1.unionBy(
                list2,
                (p) => p.name,
                (n1, n2) =>
                    n1.toLowerCase().localeCompare(n2.toLowerCase()) === 0
            );
            expect(unionWithDefaultComparator.toArray()).to.deep.equal([
                Person.Alice,
                Person.Noemi,
                LittleAlice,
                Person.Suzuha
            ]);
            expect(unionWithCustomComparator.toArray()).to.deep.equal([
                Person.Alice,
                Person.Noemi,
                Person.Suzuha
            ]);
        });
    });

    describe("#variance()", () => {
        test("should return the variance of the given list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const sampleVariance = list.variance();
            const populationVariance = list.variance(x => x, false);
            expect(sampleVariance).to.equal(2.5);
            expect(populationVariance).to.equal(2);
        });
        test("should return variance as 0 for all identical values", () => {
            const list = new List([3, 3, 3, 3]);
            const sampleVariance = list.variance();
            const populationVariance = list.variance(x => x, false);
            expect(sampleVariance).to.equal(0);
            expect(populationVariance).to.equal(0);
        });
        test("should return the variance of the given list #2", () => {
            const list = new List([2, 4]);
            const sampleVariance = list.variance();
            const populationVariance = list.variance(x => x, false);
            expect(sampleVariance).to.equal(2);
            expect(populationVariance).to.equal(1);
        });
        test("should return NaN for empty input", () => {
            const list = new List<number>([]);
            const sampleVariance = list.variance();
            const populationVariance = list.variance(x => x, false);
            expect(sampleVariance).to.be.NaN;
            expect(populationVariance).to.be.NaN;
        });
        test("should return NaN for sample variance of single element list", () => {
            const list = new List([10]);
            const sampleVariance = list.variance();
            expect(sampleVariance).to.be.NaN;
        });
        test("should return 0 for population variance of single element list", () => {
            const list = new List([10]);
            const populationVariance = list.variance(x => x, false);
            expect(populationVariance).to.equal(0);
        });
        test("should work with given selector", () => {
            const people = new List([
                { name: "A", age: 20 },
                { name: "B", age: 25 },
                { name: "C", age: 30 }
            ]);
            const sampleVariance = people.variance(p => p.age);
            const populationVariance = people.variance(p => p.age, false);
            expect(sampleVariance).to.equal(25);
            expect(populationVariance).to.eq(16.666666666666668);
        });
    });

    describe("#where()", () => {
        test("should return an IEnumerable with elements [2,5]", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = list.where((n) => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
        test("should narrow elements", () => {
            const success = responses.where(isSuccess).select(p => p.data);
            const successArray = responseArray.filter(isSuccess).map(p => p.data);
            expect(success.count()).to.eq(3);
            expect(success.toArray()).to.deep.equal(successArray);
        });
    });

    describe("#windows()", () => {
        const list = new List([1, 2, 3, 4, 5]);
        test("should return a list of windows of size 3", () => {
            const windows = list.windows(3).toList();
            expect(windows.size()).to.eq(3);
            expect(windows.get(0).toArray()).to.deep.equal([1, 2, 3]);
            expect(windows.get(1).toArray()).to.deep.equal([2, 3, 4]);
            expect(windows.get(2).toArray()).to.deep.equal([3, 4, 5]);
        });
        test("should return a list of windows of size 1", () => {
            const windows = list.windows(1).toList();
            expect(windows.size()).to.eq(5);
            expect(windows.get(0).toArray()).to.deep.equal([1]);
            expect(windows.get(1).toArray()).to.deep.equal([2]);
            expect(windows.get(2).toArray()).to.deep.equal([3]);
            expect(windows.get(3).toArray()).to.deep.equal([4]);
            expect(windows.get(4).toArray()).to.deep.equal([5]);
        });
        test("should return a list of windows of size 5", () => {
            const windows = list.windows(5).toList();
            expect(windows.size()).to.eq(1);
            expect(windows.get(0).toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should return an empty list if size is greater than source size", () => {
            const windows = list.windows(6).toList();
            expect(windows.size()).to.eq(0);
        });
        test("should throw an error if size is less than 1", () => {
            expect(() => list.windows(0)).to.throw(
                "Size must be greater than 0."
            );
            expect(() => list.windows(-1)).to.throw(
                "Size must be greater than 0."
            );
        });
    });

    describe("#zip()", () => {
        const numberList = new List([1, 2, 3, 4]);
        const stringList = new List(["one", "two", "three"]);
        const numStrList = numberList
            .zip(
                stringList,
                (first: number, second: string) => `${first} ${second}`
            )
            .toList();
        test("should return array of tuple if predicate is null", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = new List([true, true, false, true]);
            const result = list.zip(list2).toArray();
            const expectedResult = [
                [2, true],
                [5, true],
                [6, false],
                [99, true]
            ];
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
            const zippedList = numberList
                .takeWhile((n) => n <= 2)
                .zip(
                    stringList,
                    (first: number, second: string) => `${second} ${first}`
                )
                .toList();
            expect(zippedList.size()).to.eq(2);
            expect(zippedList.get(0)).to.eq("one 1");
            expect(zippedList.get(1)).to.eq("two 2");
        });
    });

    describe("#zipMany()", () => {
        test("should zip multiple lists", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List(["a", "b", "c"]);
            const list3 = new List([false, true, false]);
            const zipped = list1.zipMany(list2, list3).toArray();
            expect(zipped).to.deep.equal(
                [[1, "a", false],
                    [2, "b", true],
                    [3, "c", false]]
            );
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
