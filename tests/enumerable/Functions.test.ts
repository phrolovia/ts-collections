import { describe, expect, expectTypeOf, test } from "vitest";
import {
    aggregate,
    aggregateBy,
    all,
    any,
    append,
    average,
    cartesian,
    cast,
    chunk,
    CircularLinkedList,
    CircularQueue,
    combinations,
    compact,
    concat,
    contains,
    count,
    countBy,
    cycle,
    defaultIfEmpty,
    Dictionary,
    distinct,
    distinctBy,
    distinctUntilChanged,
    distinctUntilChangedBy,
    elementAt,
    elementAtOrDefault,
    empty,
    EnumerableSet,
    except,
    exceptBy,
    first,
    firstOrDefault,
    forEach,
    from,
    groupBy,
    groupJoin,
    IEnumerable,
    ImmutableDictionary,
    ImmutableList,
    ImmutablePriorityQueue,
    ImmutableCircularQueue,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    index,
    interleave,
    intersect,
    intersectBy,
    intersperse,
    join,
    last,
    lastOrDefault,
    LinkedList,
    List,
    max,
    maxBy,
    min,
    minBy,
    median,
    mode,
    modeOrDefault,
    multimode,
    none,
    ofType,
    order,
    orderBy,
    orderByDescending,
    orderDescending,
    pairwise,
    partition,
    percentile,
    permutations,
    pipe,
    prepend,
    PriorityQueue,
    product,
    Queue,
    range,
    repeat,
    reverse,
    rotate,
    scan,
    select,
    selectMany,
    sequenceEqual,
    shuffle,
    single,
    singleOrDefault,
    skip,
    skipLast,
    skipWhile,
    SortedDictionary,
    SortedSet,
    span,
    Stack,
    standardDeviation,
    step,
    sum,
    take,
    takeLast,
    takeWhile,
    tap,
    toArray,
    toCircularLinkedList,
    toCircularQueue,
    toDictionary,
    toEnumerableSet,
    toImmutableDictionary,
    toImmutableList,
    toImmutablePriorityQueue,
    toImmutableCircularQueue,
    toImmutableQueue,
    toImmutableSet,
    toImmutableSortedDictionary,
    toImmutableSortedSet,
    toImmutableStack,
    toLinkedList,
    toList,
    toLookup,
    toMap,
    toObject,
    toPriorityQueue,
    toQueue,
    toSet,
    toSortedDictionary,
    toSortedSet,
    toStack,
    union,
    unionBy,
    variance,
    where,
    windows,
    zip,
    zipMany
} from "../../src/imports";
import { MoreThanOneElementException } from "../../src/shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../../src/shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../../src/shared/NoElementsException";
import { NoMatchingElementException } from "../../src/shared/NoMatchingElementException";
import { Helper } from "../helpers/Helper";
import { ApiResponse, ApiResponseLoading, ApiResponseSuccess, isLoading, isSuccess } from "../models/ApiResponse";
import { Pair } from "../models/Pair";
import { Person } from "../models/Person";
import { School } from "../models/School";
import { SchoolStudents } from "../models/SchoolStudents";
import { AbstractShape, Circle, Polygon, Rectangle, Square, Triangle } from "../models/Shape";
import { Student } from "../models/Student";

describe("Enumerable Standalone Functions", () => {
    const responses = new List<ApiResponse<Person>>([
        { status: "success", data: Person.Alice },
        { status: "error", error: "Not found" },
        { status: "success", data: Person.Bella },
        { status: "error", error: "Server error" },
        { status: "success", data: Person.Mel },
        { status: "loading", estimatedTime: 4000 }
    ]);

    describe("#aggregate()", () => {
        test("should return 6", () => {
            const sequence = [4, 8, 8, 3, 9, 0, 7, 8, 2];
            const result = aggregate(sequence, (total, next) => next % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(6);
        });
        test("should return pomegranate", () => {
            const sequence = ["apple", "mango", "orange", "pomegranate", "grape"];
            const result = aggregate(sequence, (longest, next) => next.length > longest.length ? next : longest, "banana");
            expect(result).to.eq("pomegranate");
        });
        test("should return 10", () => {
            const sequence = [1, 2, 3, 4];
            const result = aggregate(sequence, (total, next) => total + next);
            expect(result).to.eq(10);
        });
        test("should throw error if the sequence is empty and no seed is provided", () => {
            expect(() => aggregate<number>([], (total, next) => total + next)).toThrow(new NoElementsException());
        });
        test("should return the seed if the sequence is empty", () => {
            const result = aggregate<number, number>([], (total, next) => total + next, 10);
            expect(result).to.eq(10);
        });
        test("should use the result selector", () => {
            const sequence = [1, 2, 3, 4];
            const result = aggregate(sequence, (total, next) => total + next, 0, result => Math.pow(result, 2));
            expect(result).to.eq(100);
        });
    });

    describe("#aggregateBy()", () => {
        test("should return (name, sum of ages)", () => {
            const sequence = new List([Person.Alice, Person.Noemi, Person.Noemi2, Person.Jisu])
            const result = aggregateBy(sequence, p => p.name, () => 0, (total, next) => total + next.age);
            const obj = result.toObject(p => p.key, p => p.value);
            expect(obj).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 14});
        });
        test("should return (name, sum of ages) with a comparer", () => {
            const LittleJisu = new Person("jisu", "", 6);
            const sequence = new List([Person.Alice, Person.Noemi, Person.Noemi2, Person.Jisu, LittleJisu])
            const result1 = aggregateBy(sequence, p => p.name, () => 0, (total, next) => total + next.age);
            const result2 = aggregateBy(sequence, p => p.name, () => 0, (total, next) => total + next.age, (a, b) => a.toLowerCase() === b.toLowerCase());
            const obj1 = result1.toObject(p => p.key, p => p.value);
            const obj2 = result2.toObject(p => p.key, p => p.value);
            expect(obj1).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 14, "jisu": 6});
            expect(obj2).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 20});
        });
        test("should work with non function seed", () => {
            const sequence = new List([Person.Alice, Person.Noemi, Person.Noemi2, Person.Jisu])
            const result = aggregateBy(sequence, p => p.name, 0, (total, next) => total + next.age);
            const obj = result.toObject(p => p.key, p => p.value);
            expect(obj).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 14});
        });
    });

    describe("#all()", () => {
        test("should not have any elements that are not even", () => {
            const allEven = all([2, 4, 6, 8, 10], n => n % 2 === 0);
            expect(allEven).to.be.true;
        });
        test("should have at least one element that is not even", () => {
            const allEven = all([1, 2, 3, 5, 7], n => n % 2 === 0);
            expect(allEven).to.be.false;
        });
    });

    describe("#any()", () => {
        test("should have at least one element that is even", () => {
            const anyEven = any([1, 2, 3, 5, 7], n => n % 2 === 0);
            expect(anyEven).to.be.true;
        });
        test("should not have any elements that are even", () => {
            const anyEven = any([1, 3, 5, 7, 9], n => n % 2 === 0);
            expect(anyEven).to.be.false;
        });
        test("should return true if no predicate is provided and the sequence is not empty", () => {
            const anyEven = any([1, 3, 5, 7, 9]);
            expect(anyEven).to.be.true;
        });
        test("should return false if no predicate is provided and the sequence is empty", () => {
            const anyEven = any([]);
            expect(anyEven).to.be.false;
        });
    });

    describe("#append()", () => {
        test("should append an element to the end", () => {
            const list2 = toList(append([1, 2, 3, 4, 5], 6));
            expect(list2.get(5)).to.eq(6);
        });
    });

    describe("#average()", () => {
        test("should return the average of the list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const avg = average(list);
            expect(avg).to.eq(3);
        });
        test("should return the average of the array with a selector", () => {
            const avg = average([{n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}], n => n.n);
            expect(avg).to.eq(3);
        });
        test("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => average(list)).to.throw();
        });
    });

    describe("#cast()", () => {
        test("should cast the list to a new type", () => {
            const mixedSequence = [1, "2", 3, "4", 5];
            const numbers = cast<number>(where(mixedSequence, n => typeof n === "number"));
            const strings = cast<string>(where(mixedSequence, n => typeof n === "string"));
            expect(numbers.toArray()).to.deep.equal([1, 3, 5]);
            expect(strings.toArray()).to.deep.equal(["2", "4"]);
        });
    });

    describe("#cartesian()", () => {
        test("should return cartesian product of two lists", () => {
            const list1 = [1, 2];
            const list2 = ["x", "y", "z"];
            const result = cartesian(list1, list2).toArray();
            const expected = [[1,"x"], [1,"y"], [1,"z"], [2,"x"], [2,"y"], [2,"z"]];
            expect(result).to.deep.equal(expected);
        });
        test("should return empty list if first list is empty", () => {
            const list1 = [] as never[];
            const list2 = ["x", "y", "z"];
            const result = cartesian(list1, list2).toArray();
            expect(result).to.deep.equal([]);
        });
        test("should return empty list if second list is empty", () => {
            const list1 = [1,2];
            const list2 = [] as never[];
            const result = cartesian(list1, list2).toArray();
            expect(result).to.deep.equal([]);
        });
    });

    describe("#chunk()", () => {
        test("should split the list into groups of 10", () => {
            const sequence = range(1, 100);
            const chunks = chunk(sequence, 10);
            expect(count(chunks)).to.eq(10);
            forEach(chunks, c => expect(count(c)).to.eq(10));
        });
        test("should split the list into a group of 3 at most", () => {
            const sequence = range(1, 8);
            const chunks = chunk(sequence, 3);
            expect(count(chunks)).to.eq(3);
            expect(count(elementAt(chunks, 0))).to.eq(3);
            expect(count(elementAt(chunks, 1))).to.eq(3);
            expect(count(elementAt(chunks, 2))).to.eq(2);
        });
    });

    describe("#combinations()", () => {
        test("should return all combinations of the string", () => {
            const sequence = "AYANA";
            const cmb = combinations(sequence);
            const combinationsArray = cmb.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(24);
        });
        test("should return all combinations of the string with a length of 1", () => {
            const sequence = "AYANA";
            const cmb = combinations(sequence, 1);
            const combinationsArray = cmb.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(3);
        });
        test("should return all combinations of the string with a length of 2", () => {
            const sequence = "AYANA";
            const combinationsEnum = combinations(sequence, 2);
            const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(6);
        });
        test("should return all combinations of the string with a length of 3", () => {
            const sequence = "AYANA";
            const combinationsEnum = combinations(sequence, 3);
            const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(8);
        });
        it("should return all combinations of the string with a length of 4", () => {
            const sequence = "AYANA";
            const combinationsEnum = combinations(sequence, 4);
            const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(5);
        });
        it("should return all combinations of the string with a length of 5", () => {
            const sequence = "AYANA";
            const combinationsEnum = combinations(sequence, 5);
            const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(1);
        });
        it("should return all combinations of the string with a length of 6", () => {
            const sequence = "AYANA";
            const combinationsEnum = combinations(sequence, 6);
            const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(0);
        });
        it("should return all combinations of the string #2", () => {
            const sequence = "ALICE";
            const combinationsEnum = combinations(sequence);
            const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
            expect(combinationsArray.length).to.eq(32);
        });
    });

    describe("#compact()", () => {
        test("should filter out null and undefined elements", () => {
            const list = [1, "a", null, false, undefined];
            const result = compact(list).toArray();
            const expected = [1, "a", false];
            expect(result).to.deep.equal(expected);
            expectTypeOf(result).toEqualTypeOf<Array<number | string | boolean>>();
        });
    });

    describe("#concat()", () => {
        test("should concatenate two lists", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List([4, 5, 6]);
            const list3 = toList(concat(list1, list2));
            expect(list3.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6]);
        });
    });

    describe("#contains()", () => {
        test("should return true if the list contains the element", () => {
            const sequence = [Person.Alice, Person.Hanyuu, Person.Mirei];
            const result = contains(sequence, Person.Alice);
            expect(result).to.be.true;
        });
        test("should return false if the list does not contain the element", () => {
            const sequence = [Person.Alice, Person.Hanyuu, Person.Mirei];
            const result = contains(sequence, Person.Priscilla);
            expect(result).to.be.false;
        });
        test("should return false if the list does not contain the element #2", () => {
            const sequence = [Person.Noemi, Person.Vanessa];
            expect(contains(sequence, Person.Noemi2)).to.be.false;
        });
        test("should return true if the list contains the element with a comparer", () => {
            const sequence = [Person.Noemi, Person.Vanessa];
            expect(contains(sequence, Person.Noemi2, (a, b) => a.name === b.name)).to.be.true;
        });
    });

    describe("#count()", () => {
        test("should return the number of elements in the list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(count(list)).to.eq(5);
        });
        test("should return the number of elements in the array", () => {
            const array = [1, 2, 3, 4, 5];
            expect(count(array)).to.eq(5);
        });
        test("should return the number of elements in the set with a predicate", () => {
            const set = new Set([1, 2, 3, 4, 5]);
            expect(count(set, n => n % 2 === 0)).to.eq(2);
        });
    });

    describe("#countBy()", () => {
        const list = new List([Person.Suzuha, Person.Suzuha2, Person.Kaori]);
        test("should return 2", () => {
            const countPairs = countBy(list, p => p.name);
            const suuzhaCount = countPairs.first(p => p.key === "Suzuha").value;
            expect(suuzhaCount).to.eq(2);
        });
        test("should use provided comparer", () => {
            const LittleKaori = new Person("kaori", "Kawashima", 16);
            const list2 = new List([Person.Suzuha, Person.Suzuha2, Person.Kaori, LittleKaori]);
            const countPairs = countBy(list2, p => p.name, (a, b) => a.toLowerCase() === b.toLowerCase());
            const suuzhaCount = countPairs.first(p => p.key === "Suzuha").value;
            expect(suuzhaCount).to.eq(2);
            const kaoriCount = countPairs.first(p => p.key === "Kaori").value;
            expect(kaoriCount).to.eq(2);
        });
    });

    describe("#cycle()", () => {
        test("should cycle through the list 3 times", () => {
            const list = cycle([1, 2, 3], 3);
            expect(count(list)).to.eq(9);
            expect(list.toArray()).to.deep.equal([1, 2, 3, 1, 2, 3, 1, 2, 3]);
        });
        test("should cycle through string 2 times", () => {
            const list = cycle("abc", 2);
            expect(list.toArray()).to.deep.equal(["a", "b", "c", "a", "b", "c"]);
        });
    });

    describe("#defaultIfEmpty()", () => {
        test("should return the list if it is not empty", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = toList(defaultIfEmpty(list, 6));
            expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should return the default value if the list is empty", () => {
            const list = new List([]);
            const list2 = toList(defaultIfEmpty(list, 6));
            expect(list2.toArray()).to.deep.equal([6]);
        });
    });

    describe("#distinct()", () => {
        test("should return a list of unique elements", () => {
            const list = new List([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
            const list2 = toList(distinct(list));
            expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should return a list of unique elements #2", () => {
            const uniqueSequence = distinct([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            expect(count(uniqueSequence)).to.eq(4);
            expect(uniqueSequence.toArray()).to.deep.equal([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        });
        test("should return a list of unique elements with a comparer", () => {
            const uniqueSequence = distinct([Person.Mel, Person.Noemi, Person.Noemi2], (p1, p2) => p1.name === p2.name);
            expect(count(uniqueSequence)).to.eq(2);
            expect(uniqueSequence.toArray()).to.deep.equal([Person.Mel, Person.Noemi]);
        });
    });

    describe("#distinctBy()", () => {
        test("should return a list of unique elements #2", () => {
            const uniqueSequence = distinctBy([Person.Alice, Person.Hanna, Person.Hanna2], p => p.name);
            expect(count(uniqueSequence)).to.eq(2);
            expect(uniqueSequence.toArray()).to.deep.equal([Person.Alice, Person.Hanna]);
        });
        test("should return a list of unique elements with a comparer", () => {
            const LittleMel = new Person("mel", "Kawashima", 16);
            const uniqueSequence = distinctBy([Person.Mel, Person.Noemi, Person.Noemi2, LittleMel], p => p.name, (a, b) => a.toLowerCase() === b.toLowerCase());
            expect(count(uniqueSequence)).to.eq(2);
            expect(uniqueSequence.toArray()).to.deep.equal([Person.Mel, Person.Noemi]);
        });
    });

    describe("#distinctUntilChanged()", () => {
        test("should return distinct contiguous elements", () => {
            const list = [1, 1, 2, 2, 2, 1, 3, 3];
            const distinct = distinctUntilChanged(list).toArray();
            expect(distinct).to.deep.equal([1, 2, 1, 3]);
        });
        test("should return empty list if source is empty", () => {
            const list = [] as string[];
            const distinct = distinctUntilChanged(list).toArray();
            expect(distinct).to.deep.equal([]);
        });
        test("should use provided comparator for key comparison", () => {
            const list = ["a", "a", "A", "b"];
            const distinctWithoutComparator = distinctUntilChanged(list).toArray();
            const distinctWithComparator = distinctUntilChanged(list, (e1, e2) => e1.toLowerCase().localeCompare(e2.toLowerCase()) === 0).toArray();
            expect(distinctWithoutComparator).to.deep.equal(["a", "A", "b"]);
            expect(distinctWithComparator).to.deep.equal(["a", "b"]);
        });
    });

    describe("#distinctUntilChangedBy()", () => {
        test("should return distinct contiguous elements", () => {
            const list = [Person.Alice, Person.Alice, Person.Noemi, Person.Noemi2, Person.Rui];
            const distinct = distinctUntilChangedBy(list, p => p.name).toArray();
            expect(distinct).to.deep.equal([Person.Alice, Person.Noemi, Person.Rui]);
        });
        test("should return empty list if source is empty", () => {
            const list = [] as never[];
            const distinct = distinctUntilChangedBy(list, k => k).toArray();
            expect(distinct).to.deep.equal([]);
        });
        test("should use provided comparator for key comparison", () => {
            const littleAlice = new Person("alice", "Rivermist", 9);
            const list = [Person.Alice, littleAlice, Person.Ayana];
            const distinctWithoutComparator = distinctUntilChangedBy(list, p => p.name).toArray();
            const distinctWithComparator = distinctUntilChangedBy(list, p => p.name, (e1, e2) => e1.toLowerCase().localeCompare(e2.toLowerCase()) === 0).toArray();
            expect(distinctWithoutComparator).to.deep.equal([Person.Alice, littleAlice, Person.Ayana]);
            expect(distinctWithComparator).to.deep.equal([Person.Alice, Person.Ayana]);
        });
    });

    describe("#elementAt()", () => {
        test("should return the element at the index", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(elementAt(list, 2)).to.eq(3);
        });
        test("should throw an error if the index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => elementAt(list, 5)).to.throw();
        });
    });

    describe("#elementAtOrDefault()", () => {
        test("should return the element at the index", () => {
            const result = elementAtOrDefault([1, 2, 3, 4, 5], 2);
            expect(result).to.eq(3);
        });
        test("should return null if the index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(elementAtOrDefault(list, 5)).to.be.null;
        });
    });

    describe("#empty()", () => {
        test("should create an empty enumerable", () => {
            const enumerable = empty<number>();
            expect(enumerable.count()).to.eq(0);
        });
    });

    describe("#except()", () => {
        test("should return [1,2,3]", () => {
            const result = except([1, 2, 3, 3, 4, 5], [4, 5, 6, 7, 8]);
            expect(result.toArray()).to.deep.equal([1, 2, 3]);
        });
        test("should return [1,2]", () => {
            const result = except([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 7, 8]);
            expect(result.toArray()).to.deep.equal([1, 2]);
        });
        test("should only have 'Alice', 'Noemi' and 'Senna'", () => {
            const result = except(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            );
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Senna]);
        });
        test("should only have 'Alice' and 'Senna'", () => {
            const result = except(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
                (a, b) => a.name === b.name
            );
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Senna]);
        });
        test("should return a set of people unique to first sequence", () => {
            const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const result = except(first, second, (a, b) => a.age === b.age);
            const ageCount = count(result, p => p.age <= 50);
            expect(ageCount).to.eq(0);
        });
        test("should use the order comparator parameter and return a set of people unique to first sequence", () => {
            const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const result = except(first, second, (a, b) => a.age - b.age);
            const ageCount = count(result, p => p.age <= 50);
            expect(ageCount).to.eq(0);
        });
    });

    describe("#exceptBy()", () => {
        test("should return [1,2,3]", () => {
            const result = exceptBy([1, 2, 3, 3, 4, 5], [4, 5, 6, 7, 8], n => n);
            expect(result.toArray()).to.deep.equal([1, 2, 3]);
        });
        test("should return [1,2]", () => {
            const result = exceptBy([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 7, 8], n => n);
            expect(result.toArray()).to.deep.equal([1, 2]);
        });
        test("should only have 'Alice', 'Noemi' and 'Senna'", () => {
            const result = exceptBy(
                [Person.Alice, Person.Noemi],
                [Person.Mel, Person.Noemi2],
                p => p.name
            );
            expect(result.toArray()).to.deep.equal([Person.Alice]);
        });
        test("should use provided comparer", () => {
            const LittleAlice = new Person("alice", "Kawashima", 9);
            const result = exceptBy(
                [Person.Alice, Person.Reina],
                [LittleAlice],
                p => p.name,
                (a, b) => a.toLowerCase() === b.toLowerCase()
            );
            expect(result.toArray()).to.deep.equal([Person.Reina]);
        });
    });

    describe("#first()", () => {
        test("should throw error if the sequence is empty", () => {
            expect(() => first([])).toThrow(new NoElementsException());
        });
        test("should return the first element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(first(list)).to.eq(1);
        });
        test("should return the first element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(first(list, n => n % 2 === 0)).to.eq(2);
        });
        test("should throw error if no element matches the predicate", () => {
            expect(() => first([1, 2, 3, 4, 5], n => n > 5)).toThrowError(new NoMatchingElementException());
        });
        test("should narrow items with type guard", () => {
            const firstSuccess = first(responses, isSuccess);
            expect(firstSuccess.data).to.eq(Person.Alice);
            expectTypeOf(firstSuccess).toEqualTypeOf<ApiResponseSuccess<Person>>();
        });
    });

    describe("#firstOrDefault()", () => {
        test("should return null if the sequence is empty", () => {
            expect(firstOrDefault([])).to.be.null;
        });
        test("should return the first element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(firstOrDefault(list)).to.eq(1);
        });
        test("should return the first element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(firstOrDefault(list, n => n % 2 === 0)).to.eq(2);
        });
        test("should return null if no element matches the predicate", () => {
            expect(firstOrDefault([1, 2, 3, 4, 5], n => n > 5)).to.be.null;
        });
        test("should narrow items with type guard", () => {
            const firstSuccess = firstOrDefault(responses, isSuccess);
            expect(firstSuccess?.data).to.eq(Person.Alice);
            expectTypeOf(firstSuccess).toEqualTypeOf<ApiResponseSuccess<Person> | null>();
        });
    });

    describe("#forEach()", () => {
        test("should loop over the enumerable", () => {
            const result: number[] = [];
            forEach(where([1, 2, 3, 4, 5, 6], n => n % 2 === 0), n => result.push(n));
            expect(result).to.deep.equal([2, 4, 6]);
        });
    });

    describe("#groupBy()", () => {
        const sequence = new Set([Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane, Person.Kaori, Person.Reina]);
        test("should group people by age", () => {
            const groups = groupBy(sequence, p => p.age);
            const ages: number[] = [];
            const groupedAges: Record<number, number[]> = {};
            forEach(groups, g => {
                ages.push(g.key);
                groupedAges[g.key] = toArray(select(g.source, p => p.age));
            });
            expect(ages).to.have.all.members([9, 10, 16, 23]);
            forEach(Object.keys(groupedAges), key => {
                const sameAges = groupedAges[+key];
                const expectedAges = new Array(sameAges.length).fill(sameAges[0]);
                expect(sameAges).to.deep.equal(expectedAges);
            });
        });
        test("should return people who are younger than 16", () => {
            const kids = toArray(selectMany(where(groupBy(sequence, p => p.age), g => g.key < 16), g => g.source));
            const kids2 = groupBy(sequence, p => p.age).where(g => g.key < 16).selectMany(g => g.source).toArray();
            expect(kids).to.have.all.members([Person.Kaori, Person.Mel, Person.Senna]);
            expect(kids).to.deep.equal(kids2);
        });
        test("should use the provided comparator", () => {
            const sequence = [Person.Alice, Person.Mel, Person.Noemi, Person.Noemi2, Person.Reina];
            const groups = groupBy(sequence, p => p.name, (a, b) => a === b);
            expect(count(groups)).to.eq(4);
            expect(elementAt(groups, 0).key).to.eq("Alice");
            expect(elementAt(groups, 1).key).to.eq("Mel");
            expect(elementAt(groups, 2).key).to.eq("Noemi");
            expect(elementAt(groups, 3).key).to.eq("Reina");
            expect(count(elementAt(groups, 0).source)).to.eq(1);
            expect(count(elementAt(groups, 1).source)).to.eq(1);
            expect(count(elementAt(groups, 2).source)).to.eq(2);
            expect(count(elementAt(groups, 3).source)).to.eq(1);
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
        const schools = [school1, school2, school3, school4];
        const students = [desiree, apolline, giselle, priscilla, lucrezia];
        test("should join and group by school id", () => {
            const joinedData = groupJoin(schools, students, sc => sc.id, st => st.schoolId,
                (school, students) => new SchoolStudents(school.id, students?.toList() ?? toList(empty()))
            );
            const orderedJoinedData = orderByDescending(joinedData, sd => sd.students.size());
            const finalData = toArray(orderedJoinedData);
            const finalOutput: string[] = [];
            forEach(finalData, sd => {
                const school = single(where(schools, s => s.id === sd.schoolId));
                finalOutput.push(`Students of ${school.name}: `);
                forEach(sd.students, st => finalOutput.push(`[${st.id}] :: ${st.name} ${st.surname}`));
            });
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

    describe("#index()", () => {
        test("should return a list of tuples with the index and the element", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const indexedList = index(list);
            expect(indexedList.toArray()).to.deep.equal([[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
        });
    });

    describe("#interleave()", () => {
        test("should return an interleaved list", () => {
            const set = new Set([1, 2, 3]);
            const queue = new Queue([false, true, false]);
            const result = interleave(set, queue).toArray();
            const expected = [1, false, 2, true, 3, false];
            expect(result).to.deep.equal(expected);
        });
    })

    describe("#intersect()", () => {
        test("should return [4,5]", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [4, 5, 6, 7, 8];
            const result = intersect(first, second);
            expect(result.toArray()).to.deep.equal([4, 5]);
        });
        test("should return [3,4,5]", () => {
            const first = [1, 2, 3, 3, 4, 5, 5, 5, 11];
            const second = [3, 3, 3, 4, 4, 5, 5, 6, 7, 8];
            const result = intersect(first, second);
            expect(result.toArray()).to.deep.equal([3, 4, 5]);
        });
        test("should ony have 'Mel', 'Lenka' and 'Jane'", () => {
            const result = intersect(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            );
            expect(result.toArray()).to.deep.equal([Person.Mel, Person.Lenka, Person.Jane]);
        });
        test("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
            const result = intersect(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
                (a, b) => a.name === b.name
            );
            expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
        });
        test("should return a set of people who are both in first and second sequence", () => {
            const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const intersection = intersect(first, second, (a, b) => a.age === b.age);
            const ageCount = count(intersection, p => p.age > 59);
            expect(ageCount).to.eq(0);
        });
        test("should use the order comparator parameter and return a set of people who are both in first and second sequence", () => {
            const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const intersection = intersect(first, second, (a, b) => a.age - b.age);
            const ageCount = count(intersection, p => p.age > 59);
            expect(ageCount).to.eq(0);
        });
    });

    describe("#intersectBy()", () => {
        test("should return [4,5]", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [4, 5, 6, 7, 8];
            const result = intersectBy(first, second, n => n);
            expect(result.toArray()).to.deep.equal([4, 5]);
        });
        test("should return [3,4,5]", () => {
            const first = [1, 2, 3, 3, 4, 5, 5, 5, 11];
            const second = [3, 3, 3, 4, 4, 5, 5, 6, 7, 8];
            const result = intersectBy(first, second, n => n);
            expect(result.toArray()).to.deep.equal([3, 4, 5]);
        });
        test("should only have 'Mel', 'Lenka', 'Jane' and 'Noemi'", () => {
            const result = intersectBy(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
                p => p.name
            );
            expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
        });
        test("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
            const result = intersectBy(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
                p => p.name,
                (a, b) => a.toLowerCase() === b.toLowerCase()
            );
            expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
        });
    });

    describe("#intersperse()", () => {
        test("should intersperse the list with a separator", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = intersperse(list, 0);
            expect(result.toArray()).to.deep.equal([1, 0, 2, 0, 3, 0, 4, 0, 5]);
        });
        test("should intersperse string with a separator", () => {
            const result = intersperse("ALICE", "-").aggregate((total, next) => total + next, "");
            expect(result).to.eq("A-L-I-C-E");
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
            const joinedData = join(students, schools, st => st.schoolId, sc => sc.id,
                (student, school) => `${student.name} ${student.surname} :: ${school?.name}`
            );
            const expectedOutputDataList = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
            ];
            expect(joinedData.toArray()).to.deep.equal(expectedOutputDataList);
        });
        test("should set null for school if left join is true", () => {
            const joinedData = join(students, schools, st => st.schoolId, sc => sc.id,
                (student, school) => [student, school],
                (stId, scId) => stId === scId,
                true
            );
            forEach(joinedData, ([st, sc]) => {
                const student = st as Student;
                const school = sc as School;
                if (student.surname === "Volpe") {
                    expect(school).to.be.null;
                } else {
                    expect(school).to.not.be.null;
                }
            });
        });
        test("should join key-value pairs", () => {
            const first = [new Pair(1, Person.Alice.name), new Pair(2, Person.Kaori.name), new Pair(3, Person.Mirei.name)];
            const second = [new Pair(1, Person.Alice.surname), new Pair(2, Person.Kaori.surname), new Pair(3, Person.Mirei.surname)];
            const joinedData = join(first, second, f => f.key, s => s.key, (f, s) => [f.value, s?.value]);
            const expectedOutputDataList = [
                [Person.Alice.name, Person.Alice.surname],
                [Person.Kaori.name, Person.Kaori.surname],
                [Person.Mirei.name, Person.Mirei.surname]
            ];
            expect(joinedData.toArray()).to.deep.equal(expectedOutputDataList);
        });
    });

    describe("#last()", () => {
        test("should throw error if the sequence is empty", () => {
            expect(() => last([])).toThrow(new NoElementsException());
        });
        test("should return the last element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(last(list)).to.eq(5);
        });
        test("should return the last element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(last(list, n => n % 2 === 0)).to.eq(4);
        });
        test("should throw error if no element matches the predicate", () => {
            expect(() => last([1, 2, 3, 4, 5], n => n > 5)).toThrowError(new NoMatchingElementException());
        });
        test("should narrow items with type guard", () => {
            const lastSuccess = last(responses, isSuccess);
            expect(lastSuccess.data).to.eq(Person.Mel);
            expectTypeOf(lastSuccess).toEqualTypeOf<ApiResponseSuccess<Person>>();
        });
    });

    describe("#lastOrDefault()", () => {
        test("should return null if the sequence is empty", () => {
            expect(lastOrDefault([])).to.be.null;
        });
        test("should return the last element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(lastOrDefault(list)).to.eq(5);
        });
        test("should return the last element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(lastOrDefault(list, n => n % 2 === 0)).to.eq(4);
        });
        test("should return null if no element matches the predicate", () => {
            expect(lastOrDefault([1, 2, 3, 4, 5], n => n > 5)).to.be.null;
        });
        test("should narrow items with type guard", () => {
            const lastSuccess = lastOrDefault(responses, isSuccess);
            expect(lastSuccess?.data).to.eq(Person.Mel);
            expectTypeOf(lastSuccess).toEqualTypeOf<ApiResponseSuccess<Person> | null>();
        });
    });

    describe("#max()", () => {
        test("should return the maximum value", () => {
            expect(max([1, 2, 3, 4, 5])).to.eq(5);
        });
        test("should return the maximum value with a selector", () => {
            const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            expect(max(list, p => p.age)).to.eq(23);
        });
        test("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => max(list)).to.throw();
        });
    });

    describe("#maxBy()", () => {
        test("should return the maximum value by a selector", () => {
            const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            const maxPerson = maxBy(list, p => p.age);
            expect(maxPerson).to.eq(Person.Alice);
        });
        test("should throw an error if the list is empty", () => {
            const list = new List<Person>([]);
            expect(() => maxBy(list, p => p.age)).to.throw();
        });
    });

    describe("#median()", () => {
        test("should return the median of the list which has odd number of elements", () => {
            const list = [3, 1, 5, 4, 2];
            const result = median(list);
            expect(result).to.eq(3);
        });
        test("should return the low median of the list which has even number of elements", () => {
            const list = [4, 2, 1, 3];
            const result = median(list, x => x, "low");
            expect(result).to.eq(2);
        });
        test("should return the high median of the list which has even number of elements", () => {
            const list = [4, 2, 1, 3];
            const result = median(list, x => x, "high");
            expect(result).to.eq(3);
        });
        test("should return the interpolated median of the list which has even number of elements", () => {
            const list = [4, 3, 1, 2];
            const result = median(list, x => x, "interpolate");
            expect(result).to.eq(2.5);
        });
        test("should return NaN if the list is empty", () => {
            const list = [] as number[];
            const result = median(list);
            expect(result).to.be.NaN;
        });
        test("should use provided selector", () => {
            const list = [Person.Bella, Person.Kaori, Person.Vanessa];
            const result = median(list, p => p.age);
            expect(result).to.eq(20);
        });
    });

    describe("#min()", () => {
        test("should return the minimum value", () => {
            expect(min([1, 2, 3, 4, 5])).to.eq(1);
        });
        test("should return the minimum value with a selector", () => {
            const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            expect(min(list, p => p.age)).to.eq(20);
        });
        test("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => min(list)).to.throw();
        });
    });

    describe("#minBy()", () => {
        test("should return the minimum value by a selector", () => {
            const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            const minPerson = minBy(list, p => p.age);
            expect(minPerson).to.eq(Person.Vanessa);
        });
        test("should throw an error if the list is empty", () => {
            const list = new List<Person>([]);
            expect(() => minBy(list, p => p.age)).to.throw();
        });
    });

    describe("#mode()", () => {
        test("should return most frequent element", () => {
            const list = [1, 2, 2, 3];
            const result = mode(list);
            expect(result).to.eq(2);
        });
        test("should return first most frequent element", () => {
            const list = [1, 2, 2, 1];
            const result = mode(list);
            expect(result).to.eq(1);
        });
        test("should throw if list is empty", () => {
            const list = [] as number[];
            expect(() => mode(list)).toThrow(new NoElementsException());
        });
        test("should use provided selector", () => {
            const list = [Person.Noemi, Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi2];
            const result = mode(list, p => p.name);
            expect(result).to.eq(Person.Suzuha);
        });
    });

    describe("#modeOrDefault()", () => {
        test("should return most frequent element", () => {
            const list = [1, 2, 2, 3];
            const mode = modeOrDefault(list);
            expect(mode).to.eq(2);
        });
        test("should return first most frequent element", () => {
            const list = [1, 2, 2, 1];
            const mode = modeOrDefault(list);
            expect(mode).to.eq(1);
        });
        test("should return null if list is empty", () => {
            const list = [] as number[];
            const mode = modeOrDefault(list);
            expect(mode).to.be.null;
        });
        test("should not throw if list is empty", () => {
            const list = [] as number[];
            expect(() => modeOrDefault(list)).not.toThrow(new NoElementsException());
        });
        test("should use provided selector", () => {
            const list = [Person.Noemi, Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi2];
            const mode = modeOrDefault(list, p => p.name);
            expect(mode).to.eq(Person.Suzuha);
        });
    });

    describe("#nultimode()", () => {
        test("should return a list of most frequent elements", () => {
            const list1 = [1, 2, 2, 3];
            const list2 = [1, 2, 2, 3, 3];
            const mode1 = multimode(list1).toArray();
            const mode2 = multimode(list2).toArray();
            expect(mode1).to.deep.equal([2]);
            expect(mode2).to.deep.equal([2, 3]);
        });
        test("should return empty list if source list is empty", () => {
            const list = [] as number[];
            const mode = multimode(list).toArray();
            expect(mode).to.be.empty;
        });
        test("should use provided selector", () => {
            const list = [
                Person.Noemi,
                Person.Suzuha,
                Person.Noemi2,
                Person.Suzuha2,
                Person.Bella
            ];
            const mode = multimode(list, p => p.name).toArray();
            expect(mode).to.deep.equal([Person.Noemi, Person.Suzuha]);
        });
    });

    describe("#none()", () => {
        test("should not have any elements that are not even", () => {
            const noneEven = none([1, 3, 5, 7, 9], n => n % 2 === 0);
            expect(noneEven).to.be.true;
        });
        test("should have at least one element that is not even", () => {
            const noneEven = none([1, 2, 3, 5, 7], n => n % 2 === 0);
            expect(noneEven).to.be.false;
        });
        test("should return true if sequence is empty", () => {
            const noneEven = none([]);
            expect(noneEven).to.be.true;
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
        const collection = [
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
        ];
        const circle1 = new Circle(1);
        const circle2 = new Circle(2);
        const triangle = new Triangle(10, 8);
        const square = new Square(5);
        const polygon = new Polygon([5, 5, 5, 5, 5]);
        const polygon2 = new Polygon([10, 10, 10, 10, 10]);
        const rectangle = new Rectangle(10, 5);
        const rectangle2 = new Rectangle(20, 10);
        const shapes = [circle1, circle2, triangle, square, polygon, polygon2, rectangle, rectangle2];
        const shapesWithPeople = [...shapes, Person.Mirei, Person.Alice];
        test("should return an array of numbers via Number constructor", () => {
            const numbers = ofType(collection, Number);
            expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
        });
        test("should return an array of numbers via typeof", () => {
            const numbers = ofType(collection, "number");
            expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
        });
        test("should return an array of strings via String constructor", () => {
            const strings = ofType(collection, String);
            expect(strings.toArray()).to.deep.equal(["4", "5", "6"]);
        });
        test("should return an array of strings via typeof", () => {
            const strings = ofType(collection, "string");
            expect(strings.toArray()).to.deep.equal(["4", "5", "6"]);
        });
        test("should return an array of booleans via Boolean constructor", () => {
            const booleans = ofType(collection, Boolean);
            expect(booleans.toArray()).to.deep.equal([true, false]);
        });
        test("should return an array of booleans via typeof", () => {
            const booleans = ofType(collection, "boolean");
            expect(booleans.toArray()).to.deep.equal([true, false]);
        });
        test("should return an array of symbols via Symbol constructor", () => {
            const symbols = ofType(collection, Symbol);
            expect(symbols.toArray()).to.deep.equal([symbol]);
        });
        test("should return an array of symbols via typeof", () => {
            const symbols = ofType(collection, "symbol");
            expect(symbols.toArray()).to.deep.equal([symbol]);
        });
        test("should return an array of objects via Object constructor", () => {
            const objects = ofType(collection, Object);
            expect(objects.toArray()).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
        });
        test("should return an array of objects via typeof", () => {
            const objects = ofType(collection, "object");
            expect(objects.toArray()).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
        });
        test("should return an array of big integers via BigInt constructor", () => {
            const bigintList = ofType(collection, BigInt);
            expect(bigintList.toArray()).to.deep.equal([bigInt, bigint2]);
        });
        test("should return an array of big integers via typeof", () => {
            const bigintList = ofType(collection, "bigint");
            expect(bigintList.toArray()).to.deep.equal([bigInt, bigint2]);
        });
        test("should return an array of functions via Function constructor", () => {
            const functions = ofType(collection, Function);
            expect(functions.toArray()).to.deep.equal([generator, func]);
        });
        test("should return an array of functions via typeof", () => {
            const functions = ofType(collection, "function");
            expect(functions.toArray()).to.deep.equal([generator, func]);
        });
        test("should return an array of Person objects via Person constructor", () => {
            const people = ofType(collection, Person);
            expect(people.toArray()).to.deep.equal([Person.Mirei, Person.Alice]);
        });
        test("should return an array of arrays via Array constructor", () => {
            const arrays = ofType(collection, Array);
            expect(arrays.toArray()).to.deep.equal([["x", "y", "z"]]);
        });
        test("should return an array of strings and numbers", () => {
            const stringsAndNumbers = [...ofType(collection, String), ...ofType(collection, Number)];
            expect(stringsAndNumbers).to.deep.equal(["4", "5", "6", 1, 2, 3, 7, 8, 9, 10, 999]);
        });
        test("should return an array of circles via Circle constructor", () => {
            const circles = ofType(shapes, Circle);
            expect(circles.toArray()).to.deep.equal([circle1, circle2]);
        });
        test("should return an array of polygons via Polygon constructor", () => {
            const polygons = ofType(shapes, Polygon);
            // Rectangle extends Polygon, so it should be included in the result
            expect(polygons.toArray()).to.deep.equal([polygon, polygon2, rectangle, rectangle2]);
        });
        test("should return an array of rectangles via Rectangle constructor", () => {
            const rectangles = ofType(shapes, Rectangle);
            expect(rectangles.toArray()).to.deep.equal([rectangle, rectangle2]);
        });
        test("should return an array of squares via Square constructor", () => {
            const squares = ofType(shapes, Square);
            expect(squares.toArray()).to.deep.equal([square]);
        });
        test("should return an array of triangles via Triangle constructor", () => {
            const triangles = ofType(shapes, Triangle);
            expect(triangles.toArray()).to.deep.equal([triangle]);
        });
        test("should return an array of shapes via AbstractShape constructor", () => {
            const allShapes = ofType(shapes, AbstractShape);
            expect(allShapes.toArray()).to.deep.equal(shapes);
        });
        test("should return respective shapes and people", () => {
            const shapes = ofType(shapesWithPeople, AbstractShape); // return type is not IEnumerable<AbstractShape>, could not find a way to do this
            const people = ofType(shapesWithPeople, Person);
            expect(shapes.toArray()).to.deep.equal([circle1, circle2, triangle, square, polygon, polygon2, rectangle, rectangle2]);
            expect(people.toArray()).to.deep.equal([Person.Mirei, Person.Alice]);
        });
    });

    describe("#order()", () => {
        test("should order numbers", () => {
            const unsorted =[4, 2, 3, 1, 5];
            const sorted = order(unsorted).toArray();
            expect(sorted).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should use provided comparator", () => {
            const source = ["b", "a"];
            const sorted1 = order(source, (e1, e2) => e1.localeCompare(e2)).toArray();
            const sorted2 = order(source, (e1, e2) => -(e1.localeCompare(e2))).toArray();
            expect(sorted1).to.deep.equal(["a", "b"])
            expect(sorted2).to.deep.equal(["b", "a"]);
        });
    });

    describe("#orderBy()", () => {
        const people = [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola];
        test("should order the list by age", () => {
            const orderedPeople = orderBy(people, p => p.age);
            const orderedAges = select(orderedPeople, p => p.age);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            expect(orderedAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#orderByDescending()", () => {
        const people = [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola];
        test("should order the list by age", () => {
            const orderedPeople = orderByDescending(people, p => p.age);
            const orderedAges = select(orderedPeople, p => p.age);
            const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
            expect(orderedAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#orderDescending()", () => {
        test("should order numbers", () => {
            const unsorted = [4, 2, 3, 1, 5];
            const sorted = orderDescending(unsorted).toArray();
            expect(sorted).to.deep.equal([5, 4, 3, 2, 1]);
        });
        test("should use provided comparator", () => {
            const source = ["b", "a"];
            const sorted1 = orderDescending(source, (e1, e2) => e1.localeCompare(e2)).toArray();
            const sorted2 = orderDescending(source, (e1, e2) => -(e1.localeCompare(e2))).toArray();
            expect(sorted1).to.deep.equal(["b", "a"])
            expect(sorted2).to.deep.equal(["a", "b"]);
        });
    });

    describe("#pairwise()", () => {
        const sequence = ["a", "b", "c", "d", "e", "f"];
        test("should create pairs of elements", () => {
            const result = pairwise(sequence);
            expect(result.toArray()).to.deep.equal([["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"]]);
        });
        test("should create pairs of elements with a selector", () => {
            const result = pairwise(sequence, (a, b) => [`<${a}>`, `<${b}>`]);
            expect(result.toArray()).to.deep.equal([["<a>", "<b>"], ["<b>", "<c>"], ["<c>", "<d>"], ["<d>", "<e>"], ["<e>", "<f>"]]);
        });
    });

    describe("#partition()", () => {
        const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        test("should partition the sequence into two", () => {
            const result = partition(sequence, n => n % 2 === 0);
            expect(result[0].toArray()).to.deep.equal([2, 4, 6, 8]);
            expect(result[1].toArray()).to.deep.equal([1, 3, 5, 7, 9]);
        });
        test("should narrow items with type guard", () => {
            const [successes, rest] = partition(responses, isSuccess);
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
            const list = [1, 2, 3, 4, 5];
            const result = percentile(list, 0.25);
            expect(result).to.equal(2.0);
        });
        test("should return percentile of the list for 0.5", () => {
            const list = [1, 2, 3, 4, 5];
            const result = percentile(list, 0.5);
            expect(result).to.equal(3);
        });
        test("should return percentile of the list for 0.75 with 'nearest' strategy", () => {
            const list = [1, 2, 3, 4, 5];
            const result = percentile(list, 0.75, x => x, "nearest");
            expect(result).to.equal(4);
        });
        test("should return percentile of the list for 0.5 with 'low' strategy", () => {
            const list = [1, 2, 3, 4];
            const result = percentile(list, 0.5, x => x, "low");
            expect(result).to.equal(2);
        });
        test("should return percentile of the list for 0.5 with 'high' strategy", () => {
            const list = [1, 2, 3, 4];
            const result = percentile(list, 0.5, x => x, "high");
            expect(result).to.equal(3);
        });
        test("should return percentile of the list for 0.5 with 'midpoint' strategy", () => {
            const list = [1, 2, 3, 10];
            const result = percentile(list, 0.5, x => x, "midpoint");
            expect(result).to.equal(2.5);
        });
        test("should use provided selector", () => {
            const list = [
                { value: 10 },
                { value: 20 },
                { value: 30 }
            ];
            const result = percentile(list, 0.9, x => x.value);
            expect(result).to.equal(28);
        });
    });

    describe("#permutations()", () => {
        test("should return all permutations of the sequence", () => {
            const result = permutations([1, 2, 3]);
            expect(result.select(p => p.toArray()).toArray()).to.deep.equal([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]);
        });
        test("should return all permutations of the string", () => {
            const result = permutations("RUI");
            const perms = result.select(p => p.toArray().join(""));
            expect(perms.toArray()).to.deep.equal(["RUI", "RIU", "URI", "UIR", "IRU", "IUR"]);
        });
    });

    describe("#pipe()", () => {
        test("should execute the given operator function", () => {
            const list1 = [1,2,3,4,5];
            const list2 = [6,7,8,9,10];
            const avgOfEvenSquares = (source: Iterable<number>): number => from(source).where(n => n % 2 === 0).select(n => n * n).average();
            const result1 = where(list1, n => n % 2 === 0).select(n => n * n).average();
            const result2 = where(list2, n => n % 2 === 0).select(n => n * n).average();
            const pipeResult1 = pipe(list1, avgOfEvenSquares);
            const pipeResult2 = pipe(list2, avgOfEvenSquares);
            expect(pipeResult1).to.eq(result1);
            expect(pipeResult2).to.eq(result2);
        });
    });

    describe("#prepend()", () => {
        const sequence = [1, 2, 3, 4, 5];
        test("should prepend 0 to the sequence", () => {
            const result = prepend(sequence, 0);
            expect(sequence).to.deep.equal([1, 2, 3, 4, 5]);
            expect(result.toArray()).to.deep.equal([0, 1, 2, 3, 4, 5]);
        });
    });

    describe("#product()", () => {
        test("should return the product of the sequence", () => {
            const result = product([1, 2, 3, 4, 5]);
            expect(result).to.eq(120);
        });
        test("should return the product of the sequence with a selector", () => {
            const result = product([1, 2, 3, 4, 5], n => n * 2);
            expect(result).to.eq(3840);
        });
        test("should throw error if the sequence is empty", () => {
            expect(() => product([])).to.throw();
        });
    });

    describe("#range()", () => {
        const enumerable = range(1, 5);
        test("should create a list of increasing numbers starting with 1", () => {
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        test("should create an enumerable that can be queried", () => {
            const max = range(1, 10).select(n => Math.pow(n, 3)).max();
            expect(max).to.eq(1000);
        });
    });

    describe("#repeat()", () => {
        const arrayOfFives = repeat(5, 5).toArray();
        test("should create an array of 5s with the length of 5", () => {
            expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
        });
        test("should create an enumerable that can be queried", () => {
            const sum = repeat(10, 10).sum(n => n);
            expect(sum).to.eq(100);
        });
    });

    describe("#reverse()", () => {
        const sequence = [1, 2, 3, 4, 5];
        test("should reverse the sequence", () => {
            const result = reverse(sequence);
            expect(sequence).to.deep.equal([1, 2, 3, 4, 5]);
            expect(result.toArray()).to.deep.equal([5, 4, 3, 2, 1]);
        });
    });

    describe("#rotate", () => {
        const sequence = [1, 2, 3, 4, 5];
        test("should left rotate the sequence by 2", () => {
            const result = rotate(sequence, 2).toArray();
            expect(result).to.deep.equal([3, 4, 5, 1, 2]);
        });
        test("should right rotate the sequence by 2", () => {
            const result = rotate(sequence, -2).toArray();
            expect(result).to.deep.equal([4, 5, 1, 2, 3]);
        });
    });

    describe("#scan()", () => {
        test("should create a sequence of increasing numbers starting with 1", () => {
            const result = scan([1, 2, 3, 4], (acc, n) => acc + n);
            expect(result.toArray()).to.deep.equal([1, 3, 6, 10]);
        });
        test("should create a sequence of increasing numbers starting with 3", () => {
            const result = scan([1, 2, 3, 4, 5], (acc, n) => acc + n, 2);
            expect(result.toArray()).to.deep.equal([3, 5, 8, 12, 17]);
        });
        test("should create a sequence of increasing numbers starting with 1 #2", () => {
            const result = scan(new Set([1, 3, 12, 19, 33]), (acc, n) => acc + n, 0);
            expect(result.toArray()).to.deep.equal([1, 4, 16, 35, 68]);
        });
        test("should throw an error if the sequence is empty", () => {
            expect(() => scan(new List<number>(), (acc, n) => acc + n).toArray()).to.throw();
        });
    });

    describe("#select()", () => {
        test("should return an IEnumerable with elements [2,4,6,8,10]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = select(list, n => n * 2).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(4);
            expect(list2.get(2)).to.eq(6);
            expect(list2.get(3)).to.eq(8);
            expect(list2.get(4)).to.eq(10);
            expect(list2.length).to.eq(5);
        });
    });

    describe("#selectMany()", () => {
        Person.Viola.friendsArray = [Person.Rebecca];
        Person.Jisu.friendsArray = [Person.Alice, Person.Mel];
        Person.Vanessa.friendsArray = [Person.Viola, Person.Rebecca, Person.Jisu, Person.Alice];
        Person.Rebecca.friendsArray = [Person.Viola];
        const people = [Person.Viola, Person.Rebecca, Person.Jisu, Person.Vanessa];
        const friendAges = selectMany(people, p => p.friendsArray).select(p => p.age).toArray();
        test("should return an array of friend ages", () => {
            expect(friendAges).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
        });
    });

    describe("#sequenceEqual()", () => {
        test("should return false if the sequence sizes are different", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 4];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        test("should return false if the sequence sizes are different #2", () => {
            const first = [1, 2, 3, 4];
            const second = [1, 2, 3, 4, 5];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        test("should return false if the sequence elements are different", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 4, 6];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        test("should return false if the order of the sequence elements are different", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 5, 4];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        test("should return true if the sequences are equal", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 4, 5];
            const result = sequenceEqual(first, second);
            expect(result).to.be.true;
        });
        test("should return true if the sequences are equal #2", () => {
            const first = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
            const second = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi2]);
            const resultWithComparator = sequenceEqual(first, second, (a, b) => a.name === b.name);
            const resultWithoutComparator = sequenceEqual(first, second);
            expect(resultWithComparator).to.be.true;
            expect(resultWithoutComparator).to.be.false;
        });
        test("should return true if the sequences are empty", () => {
            const first: number[] = [];
            const second: number[] = [];
            const result = sequenceEqual(first, second);
            expect(result).to.be.true;
        });
        test("should return true if the sequences are empty #2", () => {
            const first = ImmutableSet.create<number>([1]);
            const second: number[] = [1];
            const result = sequenceEqual(first, second);
            expect(result).to.be.true;
        });
        test("should return false if one of the sequences is empty", () => {
            const first: number[] = [];
            const second: number[] = [1];
            const result1 = sequenceEqual(first, second);
            const result2 = sequenceEqual(second, first);
            expect(result1).to.be.false;
            expect(result2).to.be.false;
        });
    });

    describe("#shuffle()", () => {
        test("should shuffle the sequence", () => {
            const sequence = range(1, 40);
            const shuffled = shuffle(sequence).toArray();
            expect(shuffled).to.not.deep.equal(sequence.toArray());
        });
    });

    describe("#single()", () => {
        test("should throw error if the sequence is empty", () => {
            expect(() => single([])).toThrow(new NoElementsException());
        });
        test("should throw error if list has more than one element", () => {
            expect(() => single([1, 2])).toThrowError(new MoreThanOneElementException());
        });
        test("should return the single element", () => {
            expect(single([1])).to.eq(1);
        });
        test("should throw error if no element matches the predicate", () => {
            expect(() => single([1, 2, 3, 4, 5], n => n === 6)).toThrowError(new NoMatchingElementException());
        });
        test("should throw error if more than one element matches the predicate", () => {
            expect(() => single([1, 2, 3, 4, 5, 4], n => n === 4)).toThrowError(new MoreThanOneMatchingElementException());
        });
        test("should return the person with name 'Alice'", () => {
            const result = single([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi], p => p.name === "Alice");
            expect(result).to.eq(Person.Alice);
        });
        test("should narrow items with type guard", () => {
            const loading = single(responses, isLoading);
            expect(loading.estimatedTime).to.eq(4000);
            expectTypeOf(loading).toEqualTypeOf<ApiResponseLoading>();
        });
    });

    describe("#singleOrDefault()", () => {
        test("should return null if the sequence is empty", () => {
            expect(singleOrDefault([])).to.be.null;
        });
        test("should throw error if list has more than one element", () => {
            expect(() => singleOrDefault([1, 2])).toThrowError(new MoreThanOneElementException());
        });
        test("should return the single element", () => {
            expect(singleOrDefault([1])).to.eq(1);
        });
        test("should return null if no element matches the predicate", () => {
            expect(singleOrDefault([1, 2, 3, 4, 5], n => n === 6)).to.be.null;
        });
        test("should throw error if more than one element matches the predicate", () => {
            expect(() => singleOrDefault([1, 2, 3, 4, 5, 4], n => n === 4)).toThrowError(new MoreThanOneMatchingElementException());
        });
        test("should return the person with name 'Alice'", () => {
            const result = singleOrDefault([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi], p => p.name === "Alice");
            expect(result).to.eq(Person.Alice);
        });
        test("should narrow items with type guard", () => {
            const loading = singleOrDefault(responses, isLoading);
            expect(loading?.estimatedTime).to.eq(4000);
            expectTypeOf(loading).toEqualTypeOf<ApiResponseLoading | null>();
        });
    });

    describe("#skip()", () => {
        test("should return an IEnumerable with elements [4,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skip(list, 3).toList();
            expect(list2.size()).to.eq( 2);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
        test("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skip(list, 10).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
    });

    describe("#skipLast()", () => {
        test("should return an IEnumerable with elements [1,2,3,4]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipLast(list, 1).toList();
            expect(list2.size()).to.eq(4);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
            expect(list2.get(3)).to.eq(4);
            expect(list2.length).to.eq(4);
        });
        test("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipLast(list, 10).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
    });

    describe("#skipWhile()", () => {
        test("should return an IEnumerable with elements [4,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipWhile(list, n => n < 4).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
        test("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipWhile(list, n => n < 10).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
    });

    describe("#span", () => {
        test("should return two lists", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const result = span(list, n => n < 3);
            expect(result[0].toArray()).to.deep.equal([1, 2]);
            expect(result[1].toArray()).to.deep.equal([3, 4, 5]);
        });
        test("should narrow items with type guard", () => {
            const [initialSuccesses, remainder] = span(responses, isSuccess);
            expect(initialSuccesses.toArray()).to.deep.equal([{ status: "success", data: Person.Alice }]);
            expect(remainder.count()).to.eq(5);
            expectTypeOf(initialSuccesses).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
            expectTypeOf(remainder).toEqualTypeOf<IEnumerable<ApiResponse<Person>>>();
        });
    });

    describe("#standardDeviation()", () => {
        test("should return the standard deviation of the list", () => {
            const list = [1, 2, 3, 4, 5];
            const sampleStdDev = standardDeviation(list);
            const populationStdDev = standardDeviation(list, x => x, false);
            const acceptableResultForSample = (sampleStdDev - Math.sqrt(2.5)) < 1e-12;
            const acceptableResultForPopulation = (populationStdDev - Math.sqrt(2)) < 1e-12;
            expect(acceptableResultForSample).to.be.true;
            expect(acceptableResultForPopulation).to.be.true;
        });
        test("should return standard deviation as 0 for all identical values", () => {
            const list = [3, 3, 3, 3];
            const sampleStdDev = standardDeviation(list);
            const populationStdDev = standardDeviation(list, x => x, false);
            expect(sampleStdDev).to.equal(0);
            expect(populationStdDev).to.equal(0);
        });
        test("should return NaN for empty input", () => {
            const list = [] as number[];
            const sampleStdDev = standardDeviation(list);
            const populationStdDev = standardDeviation(list, x => x, false);
            expect(sampleStdDev).to.be.NaN;
            expect(populationStdDev).to.be.NaN;
        });
        test("should work with given selector", () => {
            const people = [
                {name: "A", age: 20},
                {name: "B", age: 25},
                {name: "C", age: 30}
            ];
            const sampleStdDev = standardDeviation(people, x => x.age);
            const populationStdDev = standardDeviation(people, x => x.age, false);
            const acceptableSampleStdDev = sampleStdDev - Math.sqrt(25) < 1e-12;
            const acceptablePopulationStdDev = populationStdDev - Math.sqrt(16.6666666667) < 1e-12;
            expect(acceptableSampleStdDev).to.be.true;
            expect(acceptablePopulationStdDev).to.be.true;
        });
    });

    describe("#step()", () => {
        test("should return an IEnumerable with elements [1,3,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = step(list, 2).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(3);
            expect(list2.get(2)).to.eq(5);
            expect(list2.length).to.eq(3);
        });
        test("should return an IEnumerable with only the first element", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = step(list, 10).toList();
            expect(list2.size()).to.eq(1);
            expect(list2.get(0)).to.eq(1);
        });
    });

    describe("#sum()", () => {
        test("should return the sum of the sequence", () => {
            expect(sum([1, 2, 3, 4, 5])).to.eq(15);
        });
        test("should return the sum of the sequence with a selector", () => {
            const list = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
            expect(sum(list, p => p.age)).to.eq(77);
        });
        test("should throw an error if the list is empty", () => {
            expect(() => sum([])).to.throw();
        });
    });

    describe("#take()", () => {
        test("should return a sequence with elements [1,2,3]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = take(list, 3).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
            expect(list2.length).to.eq(3);
        });
        test("should return an empty sequence", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = take(list, 0).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
        test("should return all elements if the take count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = take(list, 10).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.length).to.eq(5);
        });
    });

    describe("#takeLast()", () => {
        test("should return a sequence with elements [3,4,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeLast(list, 3).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(3);
            expect(list2.get(1)).to.eq(4);
            expect(list2.get(2)).to.eq(5);
            expect(list2.length).to.eq(3);
        });
        test("should return an empty sequence", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeLast(list, 0).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
        test("should return all elements if the take count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeLast(list, 10).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.length).to.eq(5);
        });
    });

    describe("#takeWhile()", () => {
        test("should return a sequence with elements [1,2,3]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeWhile(list, n => n < 4).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
            expect(list2.length).to.eq(3);
        });
        test("should return an empty sequence", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeWhile(list, n => n < 1).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
        test("should return all elements if the take count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeWhile(list, n => n < 10).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.length).to.eq(5);
        });
        test("should narrow items with type guard", () => {
            const result = takeWhile(responses, isSuccess);
            expect(result.toArray()).to.deep.equal([
                { status: "success", data: Person.Alice }
            ]);
            expectTypeOf(result).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
        });
    });

    describe("#tap()", () => {
        test("should tap into sequence without modifying it", () => {
            const list = [1,2,3,4,5];
            const squares: [number, number][] = [];
            const list2 = tap(list, (n, nx) => squares.push([nx, n*n])).toArray();
            const expectedTap = [
                [0, 1],
                [1, 4],
                [2, 9],
                [3, 16],
                [4, 25]
            ];
            expect(squares).to.deep.equal(expectedTap);
            expect(list2).to.deep.equal([1,2,3,4,5]);
        });
    })

    describe("#toArray()", () => {
        test("should return an array of numbers", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const array = toArray(list);
            expect(array instanceof Array).to.be.true;
            expect(array).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toCircularLinkedList", () => {
        test("should return a circular linked list", () => {
            const circularList = toCircularLinkedList([1, 2, 3, 4, 5]);
            expect(circularList instanceof CircularLinkedList).to.be.true;
            expect(circularList.size()).to.eq(5);
            expect(circularList.length).to.eq(5);
        });

        test("should preserve the elements and their order", () => {
            const circularList = toCircularLinkedList([1, 2, 3, 4, 5]);
            expect(circularList.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });

        test("should work with an empty array", () => {
            const emptyCircularList = toCircularLinkedList([]);
            expect(emptyCircularList.isEmpty()).to.be.true;
            expect(emptyCircularList.size()).to.eq(0);
        });

        test("should accept a custom comparator", () => {
            const personArray = [Person.Alice, Person.Noemi];
            const customComparator = (p1: Person, p2: Person) => p1.name === p2.name;
            const circularPersonList = toCircularLinkedList(personArray, customComparator);

            // Create a new person with the same name but different age
            const aliceClone = new Person("Alice", "Smith", 30);

            // With custom comparator, it should find Alice by name
            expect(circularPersonList.contains(aliceClone)).to.be.true;
        });
    });

    describe("#toCircularQueue()", () => {
        test("should return a circular queue", () => {
            const queue = toCircularQueue([1, 2, 3]);
            expect(queue instanceof CircularQueue).to.be.true;
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
        });

        test("should respect the provided capacity", () => {
            const queue = toCircularQueue([1, 2, 3, 4], 2);
            expect(queue.toArray()).to.deep.equal([3, 4]);
            expect(queue.size()).to.eq(2);
            expect(queue.length).to.eq(2);
        });
    });

    describe("#toDictionary()", () => {
        test("should return a dictionary with keys [1,2,3,4,5] and values [1,4,9,16,25]", () => {
            const dictionary = toDictionary([1, 2, 3, 4, 5], n => n, n => n * n);
            expect(dictionary instanceof Dictionary).to.be.true;
            expect(dictionary.get(1)).to.eq(1);
            expect(dictionary.get(2)).to.eq(4);
            expect(dictionary.get(3)).to.eq(9);
            expect(dictionary.get(4)).to.eq(16);
            expect(dictionary.get(5)).to.eq(25);
        });
    });

    describe("#toEnumerableSet()", () => {
        test("should return an enumerable set", () => {
            const enumerableSet = toEnumerableSet([1, 2, 3, 4, 5]);
            expect(enumerableSet instanceof EnumerableSet).to.be.true;
            expect(enumerableSet.size()).to.eq(5);
            expect(enumerableSet.length).to.eq(5);
        });
    });

    describe("#toImmutableCircularQueue()", () => {
        test("should return an immutable circular queue", () => {
            const queue = toImmutableCircularQueue([1, 2, 3]);
            expect(queue instanceof ImmutableCircularQueue).to.be.true;
            expect(queue.toArray()).to.deep.equal([1, 2, 3]);
            expect(queue.size()).to.eq(3);
            expect(queue.length).to.eq(3);
        });

        test("should retain only the most recent elements up to capacity", () => {
            const queue = toImmutableCircularQueue([1, 2, 3, 4], 3);
            expect(queue.toArray()).to.deep.equal([2, 3, 4]);
            expect(queue.capacity).to.equal(3);
        });
    });

    describe("#toImmutableDictionary()", () => {
        test("should return an immutable dictionary with keys [1,2,3,4,5] and values [1,4,9,16,25]", () => {
            const dictionary = toImmutableDictionary([1, 2, 3, 4, 5], n => n, n => n * n);
            expect(dictionary instanceof ImmutableDictionary).to.be.true;
            expect(dictionary.get(1)).to.eq(1);
            expect(dictionary.get(2)).to.eq(4);
            expect(dictionary.get(3)).to.eq(9);
            expect(dictionary.get(4)).to.eq(16);
            expect(dictionary.get(5)).to.eq(25);
        });
    });

    describe("#toImmutableList()", () => {
        test("should return an immutable list", () => {
            const immutableList = toImmutableList([1, 2, 3, 4, 5]);
            expect(immutableList instanceof ImmutableList).to.be.true;
            expect(immutableList.size()).to.eq(5);
            expect(immutableList.length).to.eq(5);
        });
    });

    describe("#toImmutablePriorityQueue()", () => {
        test("should return an immutable priority queue", () => {
            const immutablePriorityQueue = toImmutablePriorityQueue([1, 2, 3, 4, 5]);
            expect(immutablePriorityQueue instanceof ImmutablePriorityQueue).to.be.true;
            expect(immutablePriorityQueue.size()).to.eq(5);
            expect(immutablePriorityQueue.length).to.eq(5);
        });
    });

    describe("#toImmutableQueue()", () => {
        test("should return an immutable queue", () => {
            const immutableQueue = toImmutableQueue([1, 2, 3, 4, 5]);
            expect(immutableQueue instanceof ImmutableQueue).to.be.true;
            expect(immutableQueue.size()).to.eq(5);
            expect(immutableQueue.length).to.eq(5);
        });
    });

    describe("#toImmutableSet()", () => {
        test("should return an immutable set", () => {
            const immutableSet = toImmutableSet([1, 2, 3, 4, 5]);
            expect(immutableSet instanceof ImmutableSet).to.be.true;
            expect(immutableSet.size()).to.eq(5);
            expect(immutableSet.length).to.eq(5);
        });
    });

    describe("#toImmutableSortedDictionary()", () => {
        test("should return an immutable sorted dictionary", () => {
            const immutableSortedDictionary = toImmutableSortedDictionary([3, 5, 4, 2, 1], n => n, n => n * n);
            expect(immutableSortedDictionary instanceof ImmutableSortedDictionary).to.be.true;
            expect(immutableSortedDictionary.get(1)).to.eq(1);
            expect(immutableSortedDictionary.get(2)).to.eq(4);
            expect(immutableSortedDictionary.get(3)).to.eq(9);
            expect(immutableSortedDictionary.get(4)).to.eq(16);
            expect(immutableSortedDictionary.get(5)).to.eq(25);
            expect(immutableSortedDictionary.keys().toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toImmutableSortedSet()", () => {
        test("should return an immutable sorted set", () => {
            const immutableSortedSet = toImmutableSortedSet([3, 5, 4, 2, 1]);
            expect(immutableSortedSet instanceof ImmutableSortedSet).to.be.true;
            expect(immutableSortedSet.size()).to.eq(5);
            expect(immutableSortedSet.length).to.eq(5);
            expect(immutableSortedSet.elementAt(0)).to.eq(1);
            expect(immutableSortedSet.elementAt(1)).to.eq(2);
            expect(immutableSortedSet.elementAt(2)).to.eq(3);
            expect(immutableSortedSet.elementAt(3)).to.eq(4);
            expect(immutableSortedSet.elementAt(4)).to.eq(5);
            expect(immutableSortedSet.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toImmutableStack()", () => {
        test("should return an immutable stack", () => {
            const immutableStack = toImmutableStack([1, 2, 3, 4, 5]);
            expect(immutableStack instanceof ImmutableStack).to.be.true;
            expect(immutableStack.size()).to.eq(5);
            expect(immutableStack.length).to.eq(5);
        });
    });

    describe("#toLinkedList()", () => {
        test("should return a linked list", () => {
            const linkedList = toLinkedList([1, 2, 3, 4, 5]);
            expect(linkedList instanceof LinkedList).to.be.true;
            expect(linkedList.size()).to.eq(5);
            expect(linkedList.length).to.eq(5);
        });
    });

    describe("#toList()", () => {
        test("should return a list", () => {
            const list = toList([1, 2, 3, 4, 5]);
            expect(list instanceof List).to.be.true;
            expect(list.size()).to.eq(5);
            expect(list.length).to.eq(5);
        });
    });

    describe("#toLookup()", () => {
        test("should return a lookup", () => {
            const lookup = toLookup(
                [Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi, Person.Noemi2, Person.Hanna, Person.Hanna2],
                p => p.name,
                p => p,
                (n1, n2) => n1.localeCompare(n2)
            );
            expect(lookup.size()).to.eq(3);
            expect(lookup.hasKey("Noemi")).to.be.true;
        });
    });

    describe("#toMap()", () => {
        test("should return a map", () => {
            const map = toMap([["a", 1], ["b", 2], ["c", 3]], t => t[0], t => t[1]);
            expect(map instanceof Map).to.be.true;
            expect(map.size).to.eq(3);
            expect(map.get("a")).to.eq(1);
            expect(map.get("b")).to.eq(2);
            expect(map.get("c")).to.eq(3);
        });
    });

    describe("#toPriorityQueue()", () => {
        test("should return a min priority queue", () => {
            const priorityQueue = toPriorityQueue([70, 5, 0, 14, 20, 65, 12, 37]);
            expect(priorityQueue instanceof PriorityQueue).to.be.true;
            expect(priorityQueue.size()).to.eq(8);
            expect(priorityQueue.length).to.eq(8);
            expect(priorityQueue.toArray()).toEqual([0, 14, 5, 37, 20, 65, 12, 70]);
        });
        test("should return a max priority queue", () => {
            const priorityQueue = toPriorityQueue([70, 5, 0, 14, 20, 65, 12, 37], (a, b) => b - a);
            expect(priorityQueue instanceof PriorityQueue).to.be.true;
            expect(priorityQueue.size()).to.eq(8);
            expect(priorityQueue.length).to.eq(8);
            expect(priorityQueue.toArray()).toEqual([70, 37, 65, 20, 14, 0, 12, 5]);
        });
    });

    describe("#toObject()", () => {
        test("should return an object", () => {
            const obj = toObject([["a", 1], ["b", 2], ["c", 3]], t => t[0], t => t[1]);
            expect(obj).to.deep.equal({a: 1, b: 2, c: 3});
        });
    });

    describe("#toQueue()", () => {
        test("should return a queue", () => {
            const queue = toQueue([1, 2, 3, 4, 5]);
            expect(queue instanceof Queue).to.be.true;
            expect(queue.size()).to.eq(5);
            expect(queue.length).to.eq(5);
            expect(queue.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toSet()", () => {
        test("should return a set", () => {
            const set = toSet([1, 2, 3, 4, 5]);
            expect(set instanceof Set).to.be.true;
            expect(set.size).to.eq(5);
            expect(set.has(1)).to.be.true;
            expect(set.has(2)).to.be.true;
            expect(set.has(3)).to.be.true;
            expect(set.has(4)).to.be.true;
            expect(set.has(5)).to.be.true;
        });
    });

    describe("#toSortedDictionary()", () => {
        test("should return a sorted dictionary", () => {
            const sortedDictionary = toSortedDictionary([3, 5, 4, 2, 1], n => n, n => n * n);
            expect(sortedDictionary instanceof SortedDictionary).to.be.true;
            expect(sortedDictionary.get(1)).to.eq(1);
            expect(sortedDictionary.get(2)).to.eq(4);
            expect(sortedDictionary.get(3)).to.eq(9);
            expect(sortedDictionary.get(4)).to.eq(16);
            expect(sortedDictionary.get(5)).to.eq(25);
        });
    });

    describe("#toSortedSet()", () => {
        test("should return a sorted set", () => {
            const sortedSet = toSortedSet([3, 5, 4, 2, 1]);
            expect(sortedSet instanceof SortedSet).to.be.true;
            expect(sortedSet.size()).to.eq(5);
            expect(sortedSet.length).to.eq(5);
            expect(sortedSet.elementAt(0)).to.eq(1);
            expect(sortedSet.elementAt(1)).to.eq(2);
            expect(sortedSet.elementAt(2)).to.eq(3);
            expect(sortedSet.elementAt(3)).to.eq(4);
            expect(sortedSet.elementAt(4)).to.eq(5);
        });
    });

    describe("#toStack()", () => {
        test("should return a stack", () => {
            const stack = toStack([1, 2, 3, 4, 5]);
            expect(stack instanceof Stack).to.be.true;
            expect(stack.size()).to.eq(5);
            expect(stack.length).to.eq(5);
            expect(stack.toArray()).to.deep.equal([5, 4, 3, 2, 1]);
        });
    });

    describe("#union()", () => {
        test("should return a set of items from both sequences", () => {
            const first = [1, 2, 3, 4, 5, 5, 5];
            const second = [4, 5, 6, 7, 8, 9, 7];
            const result = union(first, second);
            expect(result.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
        test("should use the comparator to determine equality", () => {
            const first = [Person.Alice, Person.Noemi];
            const second = [Person.Mirei, Person.Noemi2];
            const result = union(first, second, (p1, p2) => p1.name === p2.name);
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Mirei]);
        });
    });

    describe("#unionBy()", () => {
        test("should return a set of items from both sequences", () => {
            const first = [Person.Alice, Person.Mel, Person.Lenka, Person.Noemi];
            const second = [Person.Mirei, Person.Noemi2, Person.Hanna, Person.Lenka];
            const result = unionBy(first, second, p => p.name);
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi, Person.Mirei, Person.Hanna]);
        });
        test("should use the comparator to determine equality", () => {
            const LitteAlice = new Person("Alice", "Nanahira", 5);
            const first = [Person.Alice, Person.Noemi];
            const second = [Person.Mirei, Person.Noemi2, LitteAlice];
            const result = unionBy(first, second, p => p.name, (p1, p2) => p1.toLowerCase().localeCompare(p2.toLowerCase()) === 0);
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Mirei]);
        });
    });

    describe("#variance()", () => {
        test("should return the variance of the given list", () => {
            const list = [1, 2, 3, 4, 5];
            const sampleVariance = variance(list);
            const populationVariance = variance(list, x => x, false);
            expect(sampleVariance).to.equal(2.5);
            expect(populationVariance).to.equal(2);
        });
        test("should return variance as 0 for all identical values", () => {
            const list = [3, 3, 3, 3];
            const sampleVariance = variance(list);
            const populationVariance = variance(list, x => x, false);
            expect(sampleVariance).to.equal(0);
            expect(populationVariance).to.equal(0);
        });
        test("should return the variance of the given list #2", () => {
            const list = [2, 4];
            const sampleVariance = variance(list);
            const populationVariance = variance(list, x => x, false);
            expect(sampleVariance).to.equal(2);
            expect(populationVariance).to.equal(1);
        });
        test("should return NaN for empty input", () => {
            const list = [] as number[];
            const sampleVariance = variance(list);
            const populationVariance = variance(list, x => x, false);
            expect(sampleVariance).to.be.NaN;
            expect(populationVariance).to.be.NaN;
        });
        test("should return NaN for sample variance of single element list", () => {
            const list = [10];
            const sampleVariance = variance(list);
            expect(sampleVariance).to.be.NaN;
        });
        test("should return 0 for population variance of single element list", () => {
            const list = [10];
            const populationVariance = variance(list, x => x, false);
            expect(populationVariance).to.equal(0);
        });
        test("should work with given selector", () => {
            const people = [
                { name: "A", age: 20 },
                { name: "B", age: 25 },
                { name: "C", age: 30 }
            ];
            const sampleVariance = variance(people, p => p.age);
            const populationVariance = variance(people, x => x.age, false);
            expect(sampleVariance).to.equal(25);
            expect(populationVariance).to.eq(16.666666666666668);
        });
    });

    describe("#where()", () => {
        test("should return an IEnumerable with elements [2,5]", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = where(list, n => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });

        test("should narrow the filtered sequence when using a type guard", () => {
            const responses = new List<ApiResponse<Person>>([
                { status: "success", data: Person.Alice },
                { status: "error", error: "Not found" },
                { status: "success", data: Person.Bella },
                { status: "error", error: "Server error" },
                { status: "success", data: Person.Mel },
                { status: "loading", estimatedTime: 4000 }
            ]);

            const successesFromMethod = responses.where(isSuccess);
            const namesFromMethod = successesFromMethod.select(result => result.data.name).toArray();

            expect(namesFromMethod).to.deep.equal([
                Person.Alice.name,
                Person.Bella.name,
                Person.Mel.name
            ]);

            expectTypeOf(successesFromMethod).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();

            const successesFromFunction = where(responses, isSuccess);
            const namesFromFunction = successesFromFunction.select(result => result.data.name).toArray();

            expect(namesFromFunction).to.deep.equal([
                Person.Alice.name,
                Person.Bella.name,
                Person.Mel.name
            ]);

            expectTypeOf(successesFromFunction).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
        });
    });

    describe("#windows()", () => {
        test("should return a sequence of windows", () => {
            const sequence = [1, 2, 3, 4, 5];
            const windowsList = windows(sequence, 3).select(w => w.toArray()).toArray();
            expect(windowsList).to.deep.equal([[1, 2, 3], [2, 3, 4], [3, 4, 5]]);
        });
    });

    describe("#zip()", () => {
        const numbers = [1, 2, 3, 4];
        const strings = ["one", "two", "three"];
        test("should return array of tuples if predicate is not specified", () => {
            const zipped = zip(numbers, strings);
            expect(zipped.toArray()).to.deep.equal([[1, "one"], [2, "two"], [3, "three"]]);
        });
        test("should return array of strings if predicate is specified", () => {
            const zipped = zip(numbers, strings, (n, s) => `${n} ${s}`);
            expect(zipped.toArray()).to.deep.equal(["1 one", "2 two", "3 three"]);
        });
    });

    describe("#zipMany()", () => {
        test("should zip multiple arrays", () => {
            const list1 = [1, 2, 3];
            const list2 = ["a", "b", "c"];
            const list3 = [false, true, false];
            const zipped = zipMany(list1, list2, list3).toArray();
            expect(zipped).to.deep.equal(
                [
                    [1, "a", false],
                    [2, "b", true],
                    [3, "c", false]
                ]
            );
        });
    });
});
