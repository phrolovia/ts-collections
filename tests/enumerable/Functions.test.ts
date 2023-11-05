import {expect} from "chai";
import {describe, it} from "mocha";
import {
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
    distinct,
    elementAt,
    elementAtOrDefault,
    empty,
    except,
    first,
    firstOrDefault,
    forEach,
    groupBy, groupJoin, intersect, join, last, lastOrDefault,
    List, max, min, orderByDescending,
    range,
    repeat,
    select,
    selectMany, single,
    toArray,
    toList,
    where
} from "../../imports";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {Helper} from "../helpers/Helper";
import {Pair} from "../models/Pair";
import {Person} from "../models/Person";
import {School} from "../models/School";
import {SchoolStudents} from "../models/SchoolStudents";
import {Student} from "../models/Student";

describe("Enumerable", () => {
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
            const list = new List([1, 2, 3, 4, 5]);
            const list2 = toList(append(list, 6));
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
            const list = new List([1, 2, 3, 4, 5]);
            expect(elementAtOrDefault(list, 2)).to.eq(3);
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
            expect(min(list, p => p.age)).to.eq(9);
        });
        it("should throw an error if the list is empty", () => {
            const list = new List([]);
            expect(() => min(list)).to.throw();
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
});
