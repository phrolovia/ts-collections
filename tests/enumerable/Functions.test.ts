import {expect} from "chai";
import {describe, it} from "mocha";
import {
    aggregate,
    all,
    any,
    append,
    average,
    cast,
    chunk,
    concat,
    contains,
    count,
    defaultIfEmpty,
    Dictionary,
    distinct,
    elementAt,
    elementAtOrDefault,
    empty,
    EnumerableSet,
    except,
    first,
    firstOrDefault,
    forEach,
    groupBy,
    groupJoin,
    ImmutableDictionary,
    ImmutableList,
    ImmutableSet,
    ImmutableSortedDictionary, ImmutableSortedSet,
    IndexableList,
    intersect,
    join,
    last,
    lastOrDefault,
    LinkedList,
    List,
    max,
    min,
    ofType,
    orderBy,
    orderByDescending,
    pairwise,
    partition,
    prepend,
    range,
    repeat,
    reverse,
    scan,
    select,
    selectMany,
    sequenceEqual,
    single,
    singleOrDefault,
    skip,
    skipLast,
    skipWhile,
    SortedDictionary,
    SortedSet,
    sum,
    take,
    takeLast,
    takeWhile,
    toArray,
    toDictionary,
    toEnumerableSet,
    toImmutableDictionary,
    toImmutableList,
    toImmutableSet,
    toImmutableSortedDictionary,
    toImmutableSortedSet,
    toIndexableList,
    toLinkedList,
    toList,
    toLookup,
    toSortedDictionary,
    toSortedSet,
    union,
    where,
    zip
} from "../../imports";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {Helper} from "../helpers/Helper";
import {Pair} from "../models/Pair";
import {Person} from "../models/Person";
import {School} from "../models/School";
import {SchoolStudents} from "../models/SchoolStudents";
import {Student} from "../models/Student";

describe("Enumerable Standalone Functions", () => {
    describe("#aggregate()", () => {
        it("should return 6", () => {
            const sequence = [4, 8, 8, 3, 9, 0, 7, 8, 2];
            const result = aggregate(sequence, (total, next) => next % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(6);
        });
        it("should return pomegranate", () => {
            const sequence = ["apple", "mango", "orange", "pomegranate", "grape"];
            const result = aggregate(sequence, (longest, next) => next.length > longest.length ? next : longest, "banana");
            expect(result).to.eq("pomegranate");
        });
        it("should return 10", () => {
            const sequence = [1, 2, 3, 4];
            const result = aggregate(sequence, (total, next) => total + next);
            expect(result).to.eq(10);
        });
        it("should throw error if the sequence is empty and no seed is provided", () => {
            expect(() => aggregate<number>([], (total, next) => total + next)).to.throw(ErrorMessages.NoElements);
        });
        it("should return the seed if the sequence is empty", () => {
            const result = aggregate<number, number>([], (total, next) => total + next, 10);
            expect(result).to.eq(10);
        });
        it("should use the result selector", () => {
            const sequence = [1, 2, 3, 4];
            const result = aggregate(sequence, (total, next) => total + next, 0, result => Math.pow(result, 2));
            expect(result).to.eq(100);
        });
    });

    describe("#all()", () => {
        it("should not have any elements that are not even", () => {
            const allEven = all([2, 4, 6, 8, 10], n => n % 2 === 0);
            expect(allEven).to.be.true;
        });
        it("should have at least one element that is not even", () => {
            const allEven = all([1, 2, 3, 5, 7], n => n % 2 === 0);
            expect(allEven).to.be.false;
        });
    });

    describe("#any()", () => {
        it("should have at least one element that is even", () => {
            const anyEven = any([1, 2, 3, 5, 7], n => n % 2 === 0);
            expect(anyEven).to.be.true;
        });
        it("should not have any elements that are even", () => {
            const anyEven = any([1, 3, 5, 7, 9], n => n % 2 === 0);
            expect(anyEven).to.be.false;
        });
        it("should return true if no predicate is provided and the sequence is not empty", () => {
            const anyEven = any([1, 3, 5, 7, 9]);
            expect(anyEven).to.be.true;
        });
        it("should return false if no predicate is provided and the sequence is empty", () => {
            const anyEven = any([]);
            expect(anyEven).to.be.false;
        });
    });

    describe("#append()", () => {
        it("should append an element to the end", () => {
            const list2 = toList(append([1, 2, 3, 4, 5], 6));
            expect(list2.get(5)).to.eq(6);
        });
    });

    describe("#average()", () => {
        it("should return the average of the list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const avg = average(list);
            expect(avg).to.eq(3);
        });
        it("should return the average of the array with a selector", () => {
            const avg = average([{n: 1}, {n: 2}, {n: 3}, {n: 4}, {n: 5}], n => n.n);
            expect(avg).to.eq(3);
        });
        it("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => average(list)).to.throw();
        });
    });

    describe("#cast()", () => {
        it("should cast the list to a new type", () => {
            const mixedSequence = [1, "2", 3, "4", 5];
            const numbers = cast<unknown, number>(where(mixedSequence, n => typeof n === "number"));
            const strings = cast<unknown, string>(where(mixedSequence, n => typeof n === "string"));
            expect(numbers.toArray()).to.deep.equal([1, 3, 5]);
            expect(strings.toArray()).to.deep.equal(["2", "4"]);
        });
    });

    describe("#chunk()", () => {
        it("should split the list into groups of 10", () => {
            const sequence = range(1, 100);
            const chunks = chunk(sequence, 10);
            expect(count(chunks)).to.eq(10);
            forEach(chunks, c => expect(count(c)).to.eq(10));
        });
        it("should split the list into a group of 3 at most", () => {
            const sequence = range(1, 8);
            const chunks = chunk(sequence, 3);
            expect(count(chunks)).to.eq(3);
            expect(count(elementAt(chunks, 0))).to.eq(3);
            expect(count(elementAt(chunks, 1))).to.eq(3);
            expect(count(elementAt(chunks, 2))).to.eq(2);
        });
    });

    describe("#concat()", () => {
        it("should concatenate two lists", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List([4, 5, 6]);
            const list3 = toList(concat(list1, list2));
            expect(list3.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6]);
        });
    });

    describe("#contains()", () => {
        it("should return true if the list contains the element", () => {
            const sequence = [Person.Alice, Person.Hanyuu, Person.Mirei];
            const result = contains(sequence, Person.Alice);
            expect(result).to.be.true;
        });
        it("should return false if the list does not contain the element", () => {
            const sequence = [Person.Alice, Person.Hanyuu, Person.Mirei];
            const result = contains(sequence, Person.Priscilla);
            expect(result).to.be.false;
        });
        it("should return false if the list does not contain the element #2", () => {
            const sequence = [Person.Noemi, Person.Vanessa];
            expect(contains(sequence, Person.Noemi2)).to.be.false;
        });
        it("should return true if the list contains the element with a comparer", () => {
            const sequence = [Person.Noemi, Person.Vanessa];
            expect(contains(sequence, Person.Noemi2, (a, b) => a.name === b.name)).to.be.true;
        });
    });

    describe("#count()", () => {
        it("should return the number of elements in the list", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(count(list)).to.eq(5);
        });
        it("should return the number of elements in the array", () => {
            const array = [1, 2, 3, 4, 5];
            expect(count(array)).to.eq(5);
        });
        it("should return the number of elements in the set with a predicate", () => {
            const set = new Set([1, 2, 3, 4, 5]);
            expect(count(set, n => n % 2 === 0)).to.eq(2);
        });
    });

    describe("#defaultIfEmpty()", () => {
        it("should return the list if it is not empty", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = toList(defaultIfEmpty(list, 6));
            expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should return the default value if the list is empty", () => {
            const list = new List([]);
            const list2 = toList(defaultIfEmpty(list, 6));
            expect(list2.toArray()).to.deep.equal([6]);
        });
    });

    describe("#distinct()", () => {
        it("should return a list of unique elements", () => {
            const list = new List([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
            const list2 = toList(distinct(list));
            expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should return a list of unique elements #2", () => {
            const uniqueSequence = distinct([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            expect(count(uniqueSequence)).to.eq(4);
            expect(uniqueSequence.toArray()).to.deep.equal([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        });
        it("should return a list of unique elements with a comparer", () => {
            const uniqueSequence = distinct([Person.Mel, Person.Noemi, Person.Noemi2], p => p.name);
            expect(count(uniqueSequence)).to.eq(2);
            expect(uniqueSequence.toArray()).to.deep.equal([Person.Mel, Person.Noemi]);
        });
    });

    describe("#elementAt()", () => {
        it("should return the element at the index", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(elementAt(list, 2)).to.eq(3);
        });
        it("should throw an error if the index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(() => elementAt(list, 5)).to.throw();
        });
    });

    describe("#elementAtOrDefault()", () => {
        it("should return the element at the index", () => {
            const result = elementAtOrDefault([1, 2, 3, 4, 5], 2);
            expect(result).to.eq(3);
        });
        it("should return null if the index is out of bounds", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(elementAtOrDefault(list, 5)).to.be.null;
        });
    });

    describe("#empty()", () => {
        it("should create an empty enumerable", () => {
            const enumerable = empty<number>();
            expect(enumerable.count()).to.eq(0);
        });
    });

    describe("#except()", () => {
        it("should return [1,2,3]", () => {
            const result = except([1, 2, 3, 3, 4, 5], [4, 5, 6, 7, 8]);
            expect(result.toArray()).to.deep.equal([1, 2, 3]);
        });
        it("should return [1,2]", () => {
            const result = except([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 7, 8]);
            expect(result.toArray()).to.deep.equal([1, 2]);
        });
        it("should only have 'Alice', 'Noemi' and 'Senna'", () => {
            const result = except(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            );
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Senna]);
        });
        it("should only have 'Alice' and 'Senna'", () => {
            const result = except(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
                (a, b) => a.name === b.name
            );
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Senna]);
        });
        it("should return a set of people unique to first sequence", () => {
            const first = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const result = except(first, second, (a, b) => a.age === b.age);
            const ageCount = count(result, p => p.age <= 50);
            expect(ageCount).to.eq(0);
        });
        it("should use the order comparator parameter and return a set of people unique to first sequence", () => {
            const first = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const result = except(first, second, null, (a, b) => a.age - b.age);
            const ageCount = count(result, p => p.age <= 50);
            expect(ageCount).to.eq(0);
        });
    });

    describe("#first()", () => {
        it("should throw error if the sequence is empty", () => {
            expect(() => first([])).to.throw(ErrorMessages.NoElements);
        });
        it("should return the first element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(first(list)).to.eq(1);
        });
        it("should return the first element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(first(list, n => n % 2 === 0)).to.eq(2);
        });
        it("should throw error if no element matches the predicate", () => {
            expect(() => first([1, 2, 3, 4, 5], n => n > 5)).to.throw(ErrorMessages.NoMatchingElement);
        });
    });

    describe("#firstOrDefault()", () => {
        it("should return null if the sequence is empty", () => {
            expect(firstOrDefault([])).to.be.null;
        });
        it("should return the first element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(firstOrDefault(list)).to.eq(1);
        });
        it("should return the first element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(firstOrDefault(list, n => n % 2 === 0)).to.eq(2);
        });
        it("should return null if no element matches the predicate", () => {
            expect(firstOrDefault([1, 2, 3, 4, 5], n => n > 5)).to.be.null;
        });
    });

    describe("#forEach()", () => {
        it("should loop over the enumerable", () => {
            const result: number[] = [];
            forEach(where([1, 2, 3, 4, 5, 6], n => n % 2 === 0), n => result.push(n));
            expect(result).to.deep.equal([2, 4, 6]);
        });
    });

    describe("#groupBy()", () => {
        const sequence = new Set([Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane, Person.Kaori, Person.Reina]);
        it("should group people by age", () => {
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
        it("should return people who are younger than 16", () => {
            const kids = toArray(selectMany(where(groupBy(sequence, p => p.age), g => g.key < 16), g => g.source));
            const kids2 = groupBy(sequence, p => p.age).where(g => g.key < 16).selectMany(g => g.source).toArray();
            expect(kids).to.have.all.members([Person.Kaori, Person.Mel, Person.Senna]);
            expect(kids).to.deep.equal(kids2);
        });
        it("should use the provided comparator", () => {
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
        it("should join and group by school id", () => {
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

    describe("#intersect()", () => {
        it("should return [4,5]", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [4, 5, 6, 7, 8];
            const result = intersect(first, second);
            expect(result.toArray()).to.deep.equal([4, 5]);
        });
        it("should return [3,4,5]", () => {
            const first = [1, 2, 3, 3, 4, 5, 5, 5, 11];
            const second = [3, 3, 3, 4, 4, 5, 5, 6, 7, 8];
            const result = intersect(first, second);
            expect(result.toArray()).to.deep.equal([3, 4, 5]);
        });
        it("should ony have 'Mel', 'Lenka' and 'Jane'", () => {
            const result = intersect(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            );
            expect(result.toArray()).to.deep.equal([Person.Mel, Person.Lenka, Person.Jane]);
        });
        it("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
            const result = intersect(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
                (a, b) => a.name === b.name
            );
            expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
        });
        it("should return a set of people who are both in first and second sequence", () => {
            const first = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const intersection = intersect(first, second, (a, b) => a.age === b.age);
            const ageCount = count(intersection, p => p.age > 59);
            expect(ageCount).to.eq(0);
        });
        it("should use the order comparator parameter and return a set of people who are both in first and second sequence", () => {
            const first = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
            const second = select(range(1, 100000), i => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
            const intersection = intersect(first, second, null, (a, b) => a.age - b.age);
            const ageCount = count(intersection, p => p.age > 59);
            expect(ageCount).to.eq(0);
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
        it("should join students and schools", () => {
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
        it("should set null for school if left join is true", () => {
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
        it("should join key-value pairs", () => {
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
        it("should throw error if the sequence is empty", () => {
            expect(() => last([])).to.throw(ErrorMessages.NoElements);
        });
        it("should return the last element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(last(list)).to.eq(5);
        });
        it("should return the last element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(last(list, n => n % 2 === 0)).to.eq(4);
        });
        it("should throw error if no element matches the predicate", () => {
            expect(() => last([1, 2, 3, 4, 5], n => n > 5)).to.throw(ErrorMessages.NoMatchingElement);
        });
    });

    describe("#lastOrDefault()", () => {
        it("should return null if the sequence is empty", () => {
            expect(lastOrDefault([])).to.be.null;
        });
        it("should return the last element if no predicate is provided", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(lastOrDefault(list)).to.eq(5);
        });
        it("should return the last element that matches the predicate", () => {
            const list = new List([1, 2, 3, 4, 5]);
            expect(lastOrDefault(list, n => n % 2 === 0)).to.eq(4);
        });
        it("should return null if no element matches the predicate", () => {
            expect(lastOrDefault([1, 2, 3, 4, 5], n => n > 5)).to.be.null;
        });
    });

    describe("#max()", () => {
        it("should return the maximum value", () => {
            expect(max([1, 2, 3, 4, 5])).to.eq(5);
        });
        it("should return the maximum value with a selector", () => {
            const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            expect(max(list, p => p.age)).to.eq(23);
        });
        it("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => max(list)).to.throw();
        });
    });

    describe("#min()", () => {
        it("should return the minimum value", () => {
            expect(min([1, 2, 3, 4, 5])).to.eq(1);
        });
        it("should return the minimum value with a selector", () => {
            const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
            expect(min(list, p => p.age)).to.eq(20);
        });
        it("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => min(list)).to.throw();
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
        it("should retunr an array of numbers via Number constructor", () => {
            const numbers = ofType(collection, Number);
            expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
        });
        it("should return an array of numbers via typeof", () => {
            const numbers = ofType(collection, "number");
            expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
        });
        it("should return an array of strings via String constructor", () => {
            const strings = ofType(collection, String);
            expect(strings.toArray()).to.deep.equal(["4", "5", "6"]);
        });
        it("should return an array of strings via typeof", () => {
            const strings = ofType(collection, "string");
            expect(strings.toArray()).to.deep.equal(["4", "5", "6"]);
        });
        it("should return an array of booleans via Boolean constructor", () => {
            const booleans = ofType(collection, Boolean);
            expect(booleans.toArray()).to.deep.equal([true, false]);
        });
        it("should return an array of booleans via typeof", () => {
            const booleans = ofType(collection, "boolean");
            expect(booleans.toArray()).to.deep.equal([true, false]);
        });
        it("should return an array of symbols via Symbol constructor", () => {
            const symbols = ofType(collection, Symbol);
            expect(symbols.toArray()).to.deep.equal([symbol]);
        });
        it("should return an array of symbols via typeof", () => {
            const symbols = ofType(collection, "symbol");
            expect(symbols.toArray()).to.deep.equal([symbol]);
        });
        it("should return an array of objects via Object constructor", () => {
            const objects = ofType(collection, Object);
            expect(objects.toArray()).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
        });
        it("should return an array of objects via typeof", () => {
            const objects = ofType(collection, "object");
            expect(objects.toArray()).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
        });
        it("should return an array of bigints via BigInt constructor", () => {
            const bigints = ofType(collection, BigInt);
            expect(bigints.toArray()).to.deep.equal([bigInt, bigint2]);
        });
        it("should return an array of bigints via typeof", () => {
            const bigints = ofType(collection, "bigint");
            expect(bigints.toArray()).to.deep.equal([bigInt, bigint2]);
        });
        it("should return an array of functions via Function constructor", () => {
            const functions = ofType(collection, Function);
            expect(functions.toArray()).to.deep.equal([generator, func]);
        });
        it("should return an array of functions via typeof", () => {
            const functions = ofType(collection, "function");
            expect(functions.toArray()).to.deep.equal([generator, func]);
        });
        it("should return an array of Person objects via Person constructor", () => {
            const people = ofType(collection, Person);
            expect(people.toArray()).to.deep.equal([Person.Mirei, Person.Alice]);
        });
        it("should return an array of arrays via Array constructor", () => {
            const arrays = ofType(collection, Array);
            expect(arrays.toArray()).to.deep.equal([["x", "y", "z"]]);
        });
        it("should return an array of strings and numbers", () => {
            const stringsAndNumbers = concat(ofType(collection, String), ofType(collection, Number));
            expect(stringsAndNumbers.toArray()).to.deep.equal(["4", "5", "6", 1, 2, 3, 7, 8, 9, 10, 999]);
        });
    });

    describe("#orderBy()", () => {
        const people = [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola];
        it("should order the list by age", () => {
            const orderedPeople = orderBy(people, p => p.age);
            const orderedAges = select(orderedPeople, p => p.age);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            expect(orderedAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#orderByDescending()", () => {
        const people = [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola];
        it("should order the list by age", () => {
            const orderedPeople = orderByDescending(people, p => p.age);
            const orderedAges = select(orderedPeople, p => p.age);
            const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
            expect(orderedAges.toArray()).to.deep.equal(expectedAges);
        });
    });

    describe("#pairwise()", () => {
        const sequence = ["a", "b", "c", "d", "e", "f"];
        it("should create pairs of elements", () => {
            const result = pairwise(sequence);
            expect(result.toArray()).to.deep.equal([["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"]]);
        });
        it("should create pairs of elements with a selector", () => {
            const result = pairwise(sequence, (a, b) => [`<${a}>`, `<${b}>`]);
            expect(result.toArray()).to.deep.equal([["<a>", "<b>"], ["<b>", "<c>"], ["<c>", "<d>"], ["<d>", "<e>"], ["<e>", "<f>"]]);
        });
    });

    describe("#partition()", () => {
        const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        it("should partition the sequence into two", () => {
            const result = partition(sequence, n => n % 2 === 0);
            expect(result[0].toArray()).to.deep.equal([2, 4, 6, 8]);
            expect(result[1].toArray()).to.deep.equal([1, 3, 5, 7, 9]);
        });
    });

    describe("#prepend()", () => {
        const sequence = [1, 2, 3, 4, 5];
        it("should prepend 0 to the sequence", () => {
            const result = prepend(sequence, 0);
            expect(sequence).to.deep.equal([1, 2, 3, 4, 5]);
            expect(result.toArray()).to.deep.equal([0, 1, 2, 3, 4, 5]);
        });
    });

    describe("#range()", () => {
        const enumerable = range(1, 5);
        it("should create a list of increasing numbers starting with 1", () => {
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const max = range(1, 10).select(n => Math.pow(n, 3)).max();
            expect(max).to.eq(1000);
        });
    });

    describe("#repeat()", () => {
        const arrayOfFives = repeat(5, 5).toArray();
        it("should create an array of 5s with the length of 5", () => {
            expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const sum = repeat(10, 10).sum(n => n);
            expect(sum).to.eq(100);
        });
    });

    describe("#reverse()", () => {
        const sequence = [1, 2, 3, 4, 5];
        it("should reverse the sequence", () => {
            const result = reverse(sequence);
            expect(sequence).to.deep.equal([1, 2, 3, 4, 5]);
            expect(result.toArray()).to.deep.equal([5, 4, 3, 2, 1]);
        });
    });

    describe("#scan()", () => {
        it("should create a sequence of increasing numbers starting with 1", () => {
            const result = scan([1, 2, 3, 4], (acc, n) => acc + n);
            expect(result.toArray()).to.deep.equal([1, 3, 6, 10]);
        });
        it("should create a sequence of increasing numbers starting with 3", () => {
            const result = scan([1, 2, 3, 4, 5], (acc, n) => acc + n, 2);
            expect(result.toArray()).to.deep.equal([3, 5, 8, 12, 17]);
        });
        it("should create a sequence of increasing numbers starting with 1 #2", () => {
            const result = scan(new Set([1, 3, 12, 19, 33]), (acc, n) => acc + n, 0);
            expect(result.toArray()).to.deep.equal([1, 4, 16, 35, 68]);
        });
        it("should throw an error if the sequence is empty", () => {
            expect(() => scan(new List<number>(), (acc, n) => acc + n).toArray()).to.throw();
        });
    });

    describe("#select()", () => {
        it("should return an IEnumerable with elements [2,4,6,8,10]", () => {
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
        expect(friendAges).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
    });

    describe("#sequenceEqual()", () => {
        it("should return false if the sequence sizes are different", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 4];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        it("should return false if the sequence sizes are different #2", () => {
            const first = [1, 2, 3, 4];
            const second = [1, 2, 3, 4, 5];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        it("should return false if the sequence elements are different", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 4, 6];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        it("should return false if the order of the sequence elements are different", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 5, 4];
            const result = sequenceEqual(first, second);
            expect(result).to.be.false;
        });
        it("should return true if the sequences are equal", () => {
            const first = [1, 2, 3, 4, 5];
            const second = [1, 2, 3, 4, 5];
            const result = sequenceEqual(first, second);
            expect(result).to.be.true;
        });
        it("should return true if the sequences are equal #2", () => {
            const first = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
            const second = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi2]);
            const resultWithComparator = sequenceEqual(first, second, (a, b) => a.name === b.name);
            const resultWithoutComparator = sequenceEqual(first, second);
            expect(resultWithComparator).to.be.true;
            expect(resultWithoutComparator).to.be.false;
        });
    });

    describe("#single()", () => {
        it("should throw error if the sequence is empty", () => {
            expect(() => single([])).to.throw(ErrorMessages.NoElements);
        });
        it("should throw error if list has more than one element", () => {
            expect(() => single([1, 2])).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return the single element", () => {
            expect(single([1])).to.eq(1);
        });
        it("should throw error if no element matches the predicate", () => {
            expect(() => single([1, 2, 3, 4, 5], n => n === 6)).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should throw error if more than one element matches the predicate", () => {
            expect(() => single([1, 2, 3, 4, 5, 4], n => n === 4)).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        it("should return the person with name 'Alice'", () => {
            const result = single([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi], p => p.name === "Alice");
            expect(result).to.eq(Person.Alice);
        });
    });

    describe("#singleOrDefault()", () => {
        it("should return null if the sequence is empty", () => {
            expect(singleOrDefault([])).to.be.null;
        });
        it("should throw error if list has more than one element", () => {
            expect(() => singleOrDefault([1, 2])).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return the single element", () => {
            expect(singleOrDefault([1])).to.eq(1);
        });
        it("should return null if no element matches the predicate", () => {
            expect(singleOrDefault([1, 2, 3, 4, 5], n => n === 6)).to.be.null;
        });
        it("should throw error if more than one element matches the predicate", () => {
            expect(() => singleOrDefault([1, 2, 3, 4, 5, 4], n => n === 4)).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        it("should return the person with name 'Alice'", () => {
            const result = singleOrDefault([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi], p => p.name === "Alice");
            expect(result).to.eq(Person.Alice);
        });
    });

    describe("#skip()", () => {
        it("should return an IEnumerable with elements [4,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skip(list, 3).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
        it("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skip(list, 10).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
    });

    describe("#skipLast()", () => {
        it("should return an IEnumerable with elements [1,2,3,4]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipLast(list, 1).toList();
            expect(list2.size()).to.eq(4);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
            expect(list2.get(3)).to.eq(4);
            expect(list2.length).to.eq(4);
        });
        it("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipLast(list, 10).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
    });

    describe("#skipWhile()", () => {
        it("should return an IEnumerable with elements [4,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipWhile(list, n => n < 4).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
        it("should return an empty IEnumerable if the skip count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = skipWhile(list, n => n < 10).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
    });

    describe("#sum()", () => {
        it("should return the sum of the sequence", () => {
            expect(sum([1, 2, 3, 4, 5])).to.eq(15);
        });
        it("should return the sum of the sequence with a selector", () => {
            const list = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
            expect(sum(list, p => p.age)).to.eq(77);
        });
        it("should throw an error if the list is empty", () => {
            expect(() => sum([])).to.throw();
        });
    });

    describe("#take()", () => {
        it("should return a sequence with elements [1,2,3]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = take(list, 3).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
            expect(list2.length).to.eq(3);
        });
        it("should return an empty sequence", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = take(list, 0).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
        it("should return all elements if the take count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = take(list, 10).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.length).to.eq(5);
        });
    });

    describe("#takeLast()", () => {
        it("should return a sequence with elements [3,4,5]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeLast(list, 3).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(3);
            expect(list2.get(1)).to.eq(4);
            expect(list2.get(2)).to.eq(5);
            expect(list2.length).to.eq(3);
        });
        it("should return an empty sequence", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeLast(list, 0).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
        it("should return all elements if the take count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeLast(list, 10).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.length).to.eq(5);
        });
    });

    describe("#takeWhile()", () => {
        it("should return a sequence with elements [1,2,3]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeWhile(list, n => n < 4).toList();
            expect(list2.size()).to.eq(3);
            expect(list2.get(0)).to.eq(1);
            expect(list2.get(1)).to.eq(2);
            expect(list2.get(2)).to.eq(3);
            expect(list2.length).to.eq(3);
        });
        it("should return an empty sequence", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeWhile(list, n => n < 1).toList();
            expect(list2.size()).to.eq(0);
            expect(list2.length).to.eq(0);
        });
        it("should return all elements if the take count is greater than the sequence size", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = takeWhile(list, n => n < 10).toList();
            expect(list2.size()).to.eq(5);
            expect(list2.length).to.eq(5);
        });
    });

    describe("#toArray()", () => {
        it("should return an array of numbers", () => {
            const list = new List([1, 2, 3, 4, 5]);
            const array = toArray(list);
            expect(array instanceof Array).to.be.true;
            expect(array).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe("#toDictionary()", () => {
        it("should return a dictionary with keys [1,2,3,4,5] and values [1,4,9,16,25]", () => {
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
        it("should return an enumerable set", () => {
            const enumerableSet = toEnumerableSet([1, 2, 3, 4, 5]);
            expect(enumerableSet instanceof EnumerableSet).to.be.true;
            expect(enumerableSet.size()).to.eq(5);
            expect(enumerableSet.length).to.eq(5);
        });
    });

    describe("#toImmutableDictionary()", () => {
        it("should return an immutable dictionary with keys [1,2,3,4,5] and values [1,4,9,16,25]", () => {
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
        it("should return an immutable list", () => {
            const immutableList = toImmutableList([1, 2, 3, 4, 5]);
            expect(immutableList instanceof ImmutableList).to.be.true;
            expect(immutableList.size()).to.eq(5);
            expect(immutableList.length).to.eq(5);
        });
    });

    describe("#toImmutableSet()", () => {
        it("should return an immutable set", () => {
            const immutableSet = toImmutableSet([1, 2, 3, 4, 5]);
            expect(immutableSet instanceof ImmutableSet).to.be.true;
            expect(immutableSet.size()).to.eq(5);
            expect(immutableSet.length).to.eq(5);
        });
    });

    describe("#toImmutableSortedDictionary()", () => {
        it("should return an immutable sorted dictionary", () => {
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
        it("should return an immutable sorted set", () => {
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

    describe("#toIndexableList()", () => {
        it("should return an indexable list", () => {
            const indexableList = toIndexableList([1, 2, 3, 4, 5]);
            expect(indexableList instanceof IndexableList).to.be.true;
            expect(indexableList.size()).to.eq(5);
            expect(indexableList.length).to.eq(5);
        });
    });

    describe("#toLinkedList()", () => {
        it("should return a linked list", () => {
            const linkedList = toLinkedList([1, 2, 3, 4, 5]);
            expect(linkedList instanceof LinkedList).to.be.true;
            expect(linkedList.size()).to.eq(5);
            expect(linkedList.length).to.eq(5);
        });
    });

    describe("#toList()", () => {
        it("should return a list", () => {
            const list = toList([1, 2, 3, 4, 5]);
            expect(list instanceof List).to.be.true;
            expect(list.size()).to.eq(5);
            expect(list.length).to.eq(5);
        });
    });

    describe("#toLookup()", () => {
        it("should return a lookup", () => {
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

    describe("#toSortedDictionary()", () => {
        it("should return a sorted dictionary", () => {
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
        it("should return a sorted set", () => {
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

    describe("#union()", () => {
        it("should return a set of items from both sequences", () => {
            const first = [1, 2, 3, 4, 5, 5, 5];
            const second = [4, 5, 6, 7, 8, 9, 7];
            const result = union(first, second);
            expect(result.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
        it("should use the comparator to determine equality", () => {
            const first = [Person.Alice, Person.Noemi];
            const second = [Person.Mirei, Person.Noemi2];
            const result = union(first, second, (p1, p2) => p1.name === p2.name);
            expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Mirei]);
        });
    });

    describe("#where()", () => {
        it("should return an IEnumerable with elements [2,5]", () => {
            const list = new List([2, 5, 6, 99]);
            const list2 = where(list, n => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
            expect(list2.length).to.eq(2);
        });
    });

    describe("#zip()", () => {
        const numbers = [1, 2, 3, 4];
        const strings = ["one", "two", "three"];
        it("should return array of tuples if predicate is not specified", () => {
            const zipped = zip(numbers, strings);
            expect(zipped.toArray()).to.deep.equal([[1, "one"], [2, "two"], [3, "three"]]);
        });
        it("should return array of strings if predicate is specified", () => {
            const zipped = zip(numbers, strings, (n, s) => `${n} ${s}`);
            expect(zipped.toArray()).to.deep.equal(["1 one", "2 two", "3 three"]);
        });
    });
});
