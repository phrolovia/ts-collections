import {Enumerable} from "../../src/enumerable/Enumerable";
import {describe, it} from "mocha";
import {expect} from "chai";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {Person} from "../models/Person";
import {School} from "../models/School";
import {Student} from "../models/Student";
import {Pair} from "../models/Pair";
import {SchoolStudents} from "../models/SchoolStudents";
import {Dictionary} from "../../src/dictionary/Dictionary";
import {KeyValuePair} from "../../src/dictionary/KeyValuePair";

describe("Enumerable", () => {
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
    const randomPeopleList = [alice, suzuha3, jane, suzuha2, jisu, suzuha, viola, megan, lucrezia, noemi, priscilla, reika, bella, eliza, hanna, julia];
    describe("#aggregate()", () => {
        it("should return 6", () => {
            const list = Enumerable.from([4, 8, 8, 3, 9, 0, 7, 8, 2]);
            const result = list.aggregate((total, next) => next % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(6);
        });
        it("should return pomegranate", () => {
            const list = Enumerable.from(["apple", "mango", "orange", "pomegranate", "grape"]);
            const result = list.aggregate((longest, next) => next.length > longest.length ? next : longest, "banana");
            expect(result).to.eq("pomegranate");
        });
        it("should return 10", () => {
            const list = Enumerable.from([1, 2, 3, 4]);
            const result = list.aggregate<number>((total, num) => total += num);
            expect(result).to.eq(10);
        });
        it("should throw error ['aggregator is null.]", () => {
            const list = Enumerable.from([2, 5, 6, 99]);
            expect(() => list.aggregate(null)).to.throw(ErrorMessages.NoAggregatorProvided);
        });
        it("should throw error if list is empty and no seed is provided", () => {
            const list = Enumerable.from<number>([]);
            expect(() => list.aggregate<number>((acc, num) => acc *= num)).to.throw(ErrorMessages.NoElements);
        });
        it("should return the seed if list is empty", () => {
            const list = Enumerable.from<number>([]);
            const result = list.aggregate<number>((total, num) => total += num, -99);
            expect(result).to.eq(-99);
        });
        it("should combine all names to a single string and get a substring from it which results in 'Suzuha'", () => {
            let secondName = "";
            const list = Enumerable.from(randomPeopleList).aggregate((namesStr: string, person) => `${namesStr} ${person.Name}`, "", namesStr => {
                const parts = namesStr.trim().split(" ");
                secondName = parts[1];
            });
            expect(secondName).to.eq("Suzuha");
        });
    });
    describe("#all()", () => {
        const list = Enumerable.from([alice, mel, senna, null, jane]);
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
            const list2 = Enumerable.from([1]);
            const any = list2.all();
            expect(any).to.eq(true);
        });
        it("should return false if no predicate is provided and list is empty", () => {
            const emptyList = Enumerable.from<number>([]);
            const any = emptyList.all();
            expect(any).to.eq(false);
        });
    });
    describe("#any()", () => {
        const list = Enumerable.from([alice, mel, senna, null, jane]);
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
            const list2 = Enumerable.from([]).defaultIfEmpty(1);
            const any = list2.any();
            expect(any).to.eq(true);
        });
        it("should return false if no predicate is provided and list is empty", () => {
            const emptyList = Enumerable.empty();
            const any = emptyList.any();
            expect(any).to.eq(false);
        });
    });
    describe("#append()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should append -888 to the end of list", () => {
            const result = enumerable.append(-888).toArray();
            expect(result[result.length - 1]).to.eq(-888);
        });
    });
    describe("#average()", () => {
        it("should return 99948748093", () => {
            const list = Enumerable.from(["10007", "37", "299846234235"]);
            const avg = list.average(s => parseInt(s, 10));
            expect(avg).to.eq(99948748093);
        });
        it("should use non-transformed values if predicate is not provided.", () => {
            const list = Enumerable.from([2, 5, 6, 99]);
            expect(list.average()).to.eq(28);
        });
        it("should throw error if list is empty", () => {
            const list = Enumerable.from<string>([]);
            expect(() => list.average(s => parseInt(s, 10))).to.throw(ErrorMessages.NoElements);
        });
    });
    describe("#concat()", () => {
        const numberList1 = [1, 2, 3, 4, 5];
        const numberList2 = [5, 6, 7, 8, 9];
        const concatEnumerable = new Enumerable(numberList1).concat(new Enumerable(numberList2));
        it("should concat two arrays", () => {
            expect(concatEnumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5, 5, 6, 7, 8, 9]);
        });
        it("should work with other methods", () => {
            const sum = concatEnumerable.append(10).select(n => n + 1).sum(n => n);
            expect(sum).to.eq(71);
        });
    });
    describe("#contains()", () => {
        const numList = [1, 2, 3, 45, 66, 77, 903];
        const contains = new Enumerable(numList).contains(77);
        it("should contain element [77]", () => {
            expect(contains).to.eq(true);
        });
    });
    describe("#count()", () => {
        it("should return 2", () => {
            const list = Enumerable.from([alice, mel]);
            expect(list.count()).to.equal(2);
        });
        it("should return 0", () => {
            const list = Enumerable.from([]);
            expect(list.count()).to.equal(0);
        });
        it("should return 5", () => {
            const list = Enumerable.from([1, 9, 2, 8, 3, 7, 4, 6, 5, 0]);
            const count = list.count(n => n < 5);
            expect(count).to.eq(5);
        });
    });
    describe("#defaultIfEmpty()", () => {
        it("should return a new IEnumerable with the default values", () => {
            const list = Enumerable.empty<number>();
            const newList = list.defaultIfEmpty(7).toArray();
            const single = list.defaultIfEmpty(1).single();
            expect(newList.length).to.eq(1);
            expect(newList[0]).to.eq(7);
            expect(single).to.eq(1);
        });
        it("should not return a new IEnumerable with the the default value(s)", () => {
            const list = Enumerable.range(1, 5);
            const newList = list.defaultIfEmpty(-99).toArray();
            expect(newList.length).to.eq(5);
            expect(newList.indexOf(-99)).to.eq(-1);
        });
    });
    describe("#distinct()", () => {
        const nonDistinctList = [1, 2, 3, 3, 2, 4, 5, 6, 5, 5, 5, 32, 11, 24, 11];
        const distinctList = Enumerable.from(nonDistinctList).distinct().toArray();
        it("should return a list of distinct numbers", () => {
            expect(distinctList).to.deep.equal([1, 2, 3, 4, 5, 6, 32, 11, 24]);
            expect(distinctList.length).to.eq(9);
        });
    });
    describe("#elementAt()", () => {
        const numList = [1, 2, 3, 45, 66, 77, 903];
        const enumerable = Enumerable.from(numList);
        it("should return the element at the index of 4", () => {
            expect(enumerable.elementAt(4)).to.eq(66);
        });
        it("should throw error if index is less than 0.", () => {
            expect(() => enumerable.elementAt(-1)).to.throw(ErrorMessages.IndexOutOfBounds);
        });
        it("should throw error if index is greater than or equal to list size.", () => {
            expect(() => enumerable.elementAt(7)).to.throw(ErrorMessages.IndexOutOfBounds);
            expect(() => enumerable.elementAt(42)).to.throw(ErrorMessages.IndexOutOfBounds);
        });
    });
    describe("#elementAtOrDefault()", () => {
        const numList = [1, 2, 3, 45, 66, 77, 903];
        const enumerable = Enumerable.from(numList);
        it("should return the element at the index of 4", () => {
            expect(enumerable.elementAtOrDefault(4)).to.eq(66);
        });
        it("should return null if index is less than 0.", () => {
            expect(enumerable.elementAtOrDefault(-1)).to.eq(null);
        });
    });
    describe("#except()", () => {
        const numList1 = [1, 2, 3, 4, 5, 6];
        const numList2 = [5, 6, 22, 55];
        const exceptList = Enumerable.from(numList1).except(Enumerable.from(numList2)).toArray();
        it("should return numbers that do not exist in the second list", () => {
            expect(exceptList).to.deep.equal([1, 2, 3, 4]);
        });
        it("should return a person with name Lucrezia", () => {
            const list1 = Enumerable.from([alice, lucrezia]);
            const list2 = Enumerable.from([senna, noemi, alice]);
            const result = list1.except(list2, (p1, p2) => p1.Name === p2.Name).toArray();
            expect(result.length).to.eq(1);
            expect(result[0]).to.deep.equal(lucrezia);
        });
    });
    describe("#first()", () => {
        const numList = [1, 11, 21, 2222, 3, 4, 5];
        const enumerable = Enumerable.from(numList);
        const emptyEnumerable = Enumerable.from([]);
        it("should return first even number", () => {
            const first = enumerable.first(p => p % 2 === 0);
            expect(first).to.eq(2222);
        });
        it("should throw error if the list is empty", () => {
            expect(() => emptyEnumerable.first(p => p % 2 === 0)).to.throw();
        });
    });
    describe("#firstOrDefault()", () => {
        const numList = [1, 11, 21, 2222, 3, 4, 5];
        const enumerable = Enumerable.from(numList);
        const emptyEnumerable = Enumerable.from([]);
        it("should return first even number", () => {
            const first = enumerable.firstOrDefault(p => p % 2 === 0);
            expect(first).to.eq(2222);
        });
        it("should return null if the list is empty", () => {
            expect(emptyEnumerable.firstOrDefault(p => p % 2 === 0)).to.eq(null);
        });
    });
    describe("#groupBy()", () => {
        const list = Enumerable.from([alice, mel, senna, lenka, jane, karen, reina]);
        it("should group people by age", () => {
            const group = list.groupBy(p => p.Age).toArray();
            const ages: number[] = [];
            const groupedAges: { [age: number]: number[] } = {};
            for (const ageGroup of group) {
                ages.push(ageGroup.key);
                groupedAges[ageGroup.key] ??= [];
                for (const pdata of ageGroup.source) {
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
            const kids = list.groupBy(p => p.Age).where(pg => pg.key < 16).selectMany(g => g.source).toArray();
            expect(kids.length).to.eq(3);
            expect(kids).to.have.all.members([karen, mel, senna]);
        });
        it("should use provided comparator", () => {
            const shortNamedPeople = list.groupBy(p => p.Name, (n1, n2) => n1 === n2).where(pg => pg.key.length < 5).selectMany(g => g.source).toArray();
            expect(shortNamedPeople.length).to.eq(2);
            expect(shortNamedPeople).to.have.all.members([mel, jane]);
        });
        it("should be iterable with for-of loop", () => {
            const groupedPeople = list.groupBy(p => p.Name.length);
            const people: Person[] = [];
            const expectedResult = [alice, senna, lenka, karen, reina, mel, jane];
            for (const group of groupedPeople) {
                for (const person of group) {
                    people.push(person);
                }
            }
            expect(people).to.deep.equal(expectedResult);
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
        const schools = Enumerable.from([school1, school2, school3, school4]);
        const students = Enumerable.from([desiree, apolline, giselle, priscilla, lucrezia]);
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
    describe("#intersect()", () => {
        const numList1 = [1, 2, 3, 4, 5, 6, 7];
        const numList2 = [5, 6, 7, 11, 22, 33, 44, 55];
        const intersectList = Enumerable.from(numList1).intersect(Enumerable.from(numList2)).toArray();
        it("should return the elements from numList1 only if they also exist in numList2", () => {
            expect(intersectList).to.deep.equal([5, 6, 7]);
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
        const schools = Enumerable.from([school1, school2, school3]);
        const students = Enumerable.from([desiree, apolline, giselle, priscilla, lucrezia]);
        it("should join students and schools", () => {
            const joinedData = students.join(schools, st => st.SchoolId, sc => sc.Id,
                (student, school) => `${student.Name} ${student.Surname} :: ${school.Name}`).toArray();
            const expectedOutputDataList = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
            ];
            expect(joinedData.length).to.eq(4);
            expect(joinedData).to.deep.equal(expectedOutputDataList);
        });
        it("should set null for school if left join is true", () => {
            const joinedData = students.join(schools, st => st.SchoolId, sc => sc.Id,
                (student, school) => [student, school], (stid, scid) => stid === scid, true).toArray();
            for (const jd of joinedData) {
                if ((jd[0] as Student).Surname === "Volpe") {
                    expect(jd[1]).to.eq(null);
                } else {
                    expect(jd[1]).to.not.eq(null);
                }
            }
        });
        it("should join key-value pairs", () => {
            const pairList1 = Enumerable.from([new Pair(1, "A"), new Pair(2, "B"), new Pair(3, "C")]);
            const pairList2 = Enumerable.from([new Pair(1, "a1"), new Pair(1, "a2"), new Pair(1, "a3"), new Pair(2, "b1"), new Pair(2, "b2")]);
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
    describe("#last", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should return the last number in the list", () => {
            const last = enumerable.last();
            expect(last).to.eq(10);
        });
        it("should return the last odd number in the list", () => {
            const lastOddNumber = enumerable.last(n => n % 2 !== 0);
            expect(lastOddNumber).to.eq(9);
        });
        it("should throw error if the list is empty", () => {
            expect(() => Enumerable.from([]).last()).to.throw();
        });
        it("should throw error if no matching element is found", () => {
            expect(() => enumerable.last(n => n > 10)).to.throw(ErrorMessages.NoMatchingElement);
        });
    });
    describe("#lastOrDefault()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should return the last number in the list", () => {
            const last = enumerable.lastOrDefault();
            expect(last).to.eq(10);
        });
        it("should return the last odd number in the list", () => {
            const lastOddNumber = enumerable.lastOrDefault(n => n % 2 !== 0);
            expect(lastOddNumber).to.eq(9);
        });
        it("should return null if the list is empty", () => {
            const last = Enumerable.from([]).lastOrDefault();
            expect(last).to.eq(null);
        });
        it("should return null if no matching element is found", () => {
            const last = enumerable.lastOrDefault(n => n > 10);
            expect(last).to.eq(null);
        });
    });
    describe("#max()", () => {
        const numbers = [6, 22, 11, 55, 234, 949, 12, 90];
        const enumerable = Enumerable.from(numbers);
        it("should return the greatest element in the list", () => {
            expect(enumerable.max()).to.eq(949);
        });
        it("should return the greatest element that is smaller than 100 in the list", () => {
            const max = enumerable.where(n => n < 100).max();
            expect(max).to.eq(90);
        });
        it("should throw error if list is empty", () => {
            const list = Enumerable.empty<number>();
            expect(() => list.max()).to.throw(ErrorMessages.NoElements);
            expect(() => list.max(n => n)).to.throw(ErrorMessages.NoElements);
        });
    });
    describe("#min()", () => {
        const numbers = [6, 22, 11, 55, 234, 949, 12, 1, 90];
        const enumerable = Enumerable.from(numbers);
        it("should return the smallest element in the list", () => {
            expect(enumerable.min()).to.eq(1);
        });
        it("should return the smallest element that is greater than 100 in the list", () => {
            const max = enumerable.where(n => n > 100).min();
            expect(max).to.eq(234);
        });
        it("should throw error if list is empty", () => {
            const list = Enumerable.empty<number>();
            expect(() => list.min()).to.throw(ErrorMessages.NoElements);
            expect(() => list.min(n => n)).to.throw(ErrorMessages.NoElements);
        });
    });
    describe("#orderBy()", () => {
        it("should order people by age [asc]", () => {
            const people = Enumerable.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderBy(p => p.Age);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });
    describe("#orderByDescending()", () => {
        it("should order people by age [desc]", () => {
            const people = Enumerable.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderByDescending(p => p.Age);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
        });
    });
    describe("#prepend()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const enumerable = Enumerable.from(numbers);
        it("should prepend the list with -999", () => {
            const result = enumerable.prepend(-999).toArray();
            expect(result[0]).to.eq(-999);
        });
    });
    describe("#range()", () => {
        const enumerable = Enumerable.range(1, 5);
        it("should create a list of increasing numbers starting with 1", () => {
            expect(enumerable.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const max = Enumerable.range(1, 10).select(n => Math.pow(n, 3)).max();
            expect(max).to.eq(1000);
        });
    });
    describe("#repeat()", () => {
        const arrayOfFives = Enumerable.repeat(5, 5).toArray();
        it("should create an array of 5s with the length of 5", () => {
            expect(arrayOfFives).to.deep.equal([5, 5, 5, 5, 5]);
        });
        it("should create an enumerable that can be queried", () => {
            const sum = Enumerable.repeat(10, 10).sum(n => n);
            expect(sum).to.eq(100);
        });
    });
    describe("#reverse()", () => {
        const enumerable = Enumerable.from([alice, lenka, senna, mel]);
        it("should have a person with the surname 'Rivermist' at the end.", () => {
            const reverseEnumerable = enumerable.reverse();
            const reverseList = reverseEnumerable.toArray();
            const last = reverseList[reverseList.length - 1];
            expect(last.Surname).to.eq("Rivermist");
            expect(reverseEnumerable.last().Name).to.eq("Alice");
        });
        it("should not modify the original list", () => {
            const list = Enumerable.from([1, 2, 3, 4, 5]);
            const list2 = list.reverse().toArray();
            expect(list.elementAt(0)).to.eq(list2[4]);
            expect(list.elementAt(1)).to.eq(list2[3]);
            expect(list.elementAt(2)).to.eq(list2[2]);
            expect(list.elementAt(3)).to.eq(list2[1]);
            expect(list.elementAt(4)).to.eq(list2[0]);
        });
    });
    describe("#select()", () => {
        it(`should throw error [${ErrorMessages.NoSelectorProvided}]`, () => {
            const list = Enumerable.from([2, 5, 6, 99]);
            expect(() => list.select(null)).to.throw(ErrorMessages.NoSelectorProvided);
        });
        it("should return an IEnumerable with elements [4, 25, 36, 81]", () => {
            const list = Enumerable.from([2, 5, 6, 9]);
            const list2 = list.select(n => Math.pow(n, 2)).toList();
            expect(list2.size()).to.eq(4);
            expect(list2.get(0)).to.eq(4);
            expect(list2.get(1)).to.eq(25);
            expect(list2.get(2)).to.eq(36);
            expect(list2.get(3)).to.eq(81);
        });
        it("should return an IEnumerable with elements [125, 729]", () => {
            const list = Enumerable.from([2, 5, 6, 9]);
            const list2 = list.where(n => n % 2 !== 0).select(n => Math.pow(n, 3)).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(125);
            expect(list2.get(1)).to.eq(729);
        });
    });
    describe("#selectMany()", () => {
        it(`should throw error [${ErrorMessages.NoSelectorProvided}]`, () => {
            const list = Enumerable.from([2, 5, 6, 99]);
            expect(() => list.selectMany(null)).to.throw(ErrorMessages.NoSelectorProvided);
        });
        it("should return a flattened array of ages #1", () => {
            viola.FriendsArray = [rebecca];
            jisu.FriendsArray = [alice, mel];
            vanessa.FriendsArray = [viola, rebecca, jisu, alice];
            rebecca.FriendsArray = [viola];
            const people: Person[] = [viola, rebecca, jisu, vanessa];
            const peopleList = Enumerable.from(people);
            const friends = peopleList.selectMany(p => p.FriendsArray).select(p => p.Age).toArray();
            expect(friends).to.deep.eq([17, 28, 23, 9, 28, 17, 14, 23]);
        });
    });
    describe("#sequenceEqual()", () => {
        it("should return false for lists with different sizes", () => {
            const list1 = Enumerable.from([1, 2]);
            const list2 = Enumerable.from([1, 2, 3]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        it("should return false if lists don't have members in the same order", () => {
            const list1 = Enumerable.from([1, 2]);
            const list2 = Enumerable.from([2, 1]);
            expect(list1.sequenceEqual(list2)).to.eq(false);
        });
        it("should return true if lists have members in the same order", () => {
            const list1 = Enumerable.from([1, 2]);
            const list2 = Enumerable.from([1, 2]);
            expect(list1.sequenceEqual(list2)).to.eq(true);
        });
        it("should return true if lists have members in the same order", () => {
            const list1 = Enumerable.from([alice, mel, lenka]);
            const list2 = Enumerable.from([alice, mel, lenka]);
            expect(list1.sequenceEqual(list2, (p1, p2) => p1.Name === p2.Name)).to.eq(true);
        });
    });
    describe("#single()", () => {
        it("should throw error if list is empty.", () => {
            const list = Enumerable.from<number>([]);
            expect(() => list.single()).to.throw(ErrorMessages.NoElements);
            expect(() => list.single(n => n > 0)).to.throw(ErrorMessages.NoElements);
        });
        it("should throw error if list has more than two elements", () => {
            const list = Enumerable.from([alice, senna, jane]);
            expect(() => list.single()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return the only element in the list", () => {
            const list = Enumerable.from([alice]);
            const single = list.single();
            expect(single).to.eq(alice);
        });
        it("should throw error if searched element found multiple times", () => {
            const list = Enumerable.from([1, 2, 2, 3]);
            expect(() => list.single(n => n === 2)).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        it("should throw error if no matching element is found.", () => {
            const list = Enumerable.from([alice, senna, jane]);
            expect(() => list.single(p => p.Name === "Lenka")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return person with name 'Alice'.", () => {
            const list = Enumerable.from([alice, senna, jane]);
            const single = list.single(p => p.Name === "Alice");
            expect(single.Name).to.eq("Alice");
            expect(single).to.eq(alice);
        });

    });
    describe("#singleOrDefault()", () => {
        const list = Enumerable.from([1, 2, 3]);
        it("should return null if the list is empty", () => {
            const list2 = Enumerable.from<number>([]);
            const sod1 = list2.singleOrDefault();
            const sod2 = list2.singleOrDefault(n => n > 0);
            expect(sod1).to.eq(null);
            expect(sod2).to.eq(null);
        });
        it("should return 3", () => {
            const item = list.singleOrDefault(n => n === 3);
            expect(item).to.eq(3);
        });
        it(`should throw error [${ErrorMessages.MoreThanOneMatchingElement}]`, () => {
            expect(() => list.append(3).singleOrDefault(n => n === 3)).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        it("should return the only element in the list", () => {
            const list2 = Enumerable.from(["Suzuha"]);
            const sod = list2.singleOrDefault();
            expect(sod).to.eq("Suzuha");
        });
        it(`should throw error [${ErrorMessages.MoreThanOneElement}]`, () => {
            const list2 = Enumerable.from(["Suzuha", "Suzuri"]);
            expect(() => list2.singleOrDefault()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return default value [null] if no matching element is found.", () => {
            const sod = list.singleOrDefault(n => n < 0);
            expect(sod).to.eq(null);
        });
    });
    describe("#skip()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return a list with elements [5,6,7]", () => {
            const list2 = list.skip(4).toArray();
            expect(list2).to.deep.equal([5, 6, 7]);
        });
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skip(100).toArray();
            expect(list2.length).to.eq(0);
        });
    });
    describe("#skipLast()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return a list with elements [1,2,3]", () => {
            const list2 = list.skipLast(4).toArray();
            expect(list2).to.deep.equal([1, 2, 3]);
        });
        it("should return an empty list if the list contains fewer than skipped elements", () => {
            const list2 = list.skipLast(100).toArray();
            expect(list2.length).to.eq(0);
        });
    });
    describe("#skipWhile()", () => {
        const list = Enumerable.from([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500]);
        it(`should throw error if predicate is null`, () => {
            expect(() => list.skipWhile(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return an IEnumerable with elements [4000, 1500, 5500]", () => {
            const list2 = list.skipWhile((n, nx) => n > nx * 1000).toArray();
            expect(list2).to.deep.equal([4000, 1500, 5500]);
        });
    });
    describe("#sum()", () => {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const sum = new Enumerable(numbers).sum(n => n);
        it("should return the sum of the list", () => {
            expect(sum).to.eq(55);
        });
    });
    describe("#take()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return an empty IEnumerable", () => {
            const list2 = list.take(0).toArray();
            const list3 = list.take(-1).toArray();
            expect(list2.length).to.eq(0);
            expect(list3.length).to.eq(0);
        });
        it("should return a list with elements [1,2,3]", () => {
            const list2 = list.take(3).toArray();
            expect(list2.length).to.eq(3);
            expect(list2).to.deep.equal([1, 2, 3]);
        });
        it("should return all elements if count is bigger than list size", () => {
            const list2 = list.take(100).toArray();
            expect(list2.length).to.eq(list.count());
            expect(list2[0]).to.eq(list.elementAt(0));
            expect(list2[1]).to.eq(list.elementAt(1));
            expect(list2[2]).to.eq(list.elementAt(2));
            expect(list2[3]).to.eq(list.elementAt(3));
            expect(list2[4]).to.eq(list.elementAt(4));
            expect(list2[5]).to.eq(list.elementAt(5));
            expect(list2[6]).to.eq(list.elementAt(6));
        });
    });
    describe("#takeLast()", () => {
        const list = Enumerable.from([1, 2, 3, 4, 5, 6, 7]);
        it("should return an empty IEnumerable", () => {
            const list2 = list.takeLast(0).toArray();
            const list3 = list.takeLast(-1).toArray();
            expect(list2.length).to.eq(0);
            expect(list3.length).to.eq(0);
        });
        it("should return a list with elements [5,6,7]", () => {
            const list2 = list.takeLast(3).toArray();
            expect(list2.length).to.eq(3);
            expect(list2[0]).to.eq(5);
            expect(list2[1]).to.eq(6);
            expect(list2[2]).to.eq(7);
        });
        it("should return all elements if count is bigger than list size", () => {
            const list2 = list.takeLast(100).toArray();
            expect(list2.length).to.eq(list.count());
            expect(list2[0]).to.eq(list.elementAt(0));
            expect(list2[1]).to.eq(list.elementAt(1));
            expect(list2[2]).to.eq(list.elementAt(2));
            expect(list2[3]).to.eq(list.elementAt(3));
            expect(list2[4]).to.eq(list.elementAt(4));
            expect(list2[5]).to.eq(list.elementAt(5));
            expect(list2[6]).to.eq(list.elementAt(6));
        });
    });
    describe("#takeWhile()", () => {
        const list = Enumerable.from(["apple", "banana", "mango", "orange", "plum", "grape"]);
        // it("should throw error ['predicate is null.]", () => {
        //     expect(() => list.takeWhile(null)).to.throw("predicate is null.");
        // });
        it("should return an array with elements [apple, banana, mango]", () => {
            const list2 = list.takeWhile(f => f.localeCompare("orange") !== 0).toArray();
            expect(list2).to.deep.equal(["apple", "banana", "mango"]);
        });
    });
    describe("#thenBy()", () => {
        it("should order people by age [asc] then by name[asc]", () => {
            const people = Enumerable.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderBy(p => p.Age, (a1, a2) => a1 - a2).thenBy(p => p.Name);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const orderedPeopleNames = orderedPeople.select(p => p.Name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = ["Mel", "Karen", "Senna", "Jisu", "Jane", "Lenka", "Rebecca", "Vanessa", "Alice", "Reina", "Viola"];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        it("should order people by age [asc] then by name[asc] then by surname[asc]", () => {
            const people = Enumerable.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const people = Enumerable.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#thenByDescending()", () => {
        it("should order people by age [asc] then by name[desc]", () => {
            const people = Enumerable.from([alice, lenka, jane, jisu, karen, mel, rebecca, reina, senna, vanessa, viola]);
            const orderedPeople = people.orderBy(p => p.Age).thenByDescending(p => p.Name);
            const orderedPeopleAges = orderedPeople.select(p => p.Age);
            const orderedPeopleNames = orderedPeople.select(p => p.Name);
            const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
            const expectedNames = ["Mel", "Senna", "Karen", "Jisu", "Lenka", "Jane", "Rebecca", "Vanessa", "Reina", "Alice", "Viola"];
            expect(orderedPeopleAges.toArray()).to.deep.equal(expectedAges);
            expect(orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        it("should order people by age [desc] then by name[desc] then by surname[desc]", () => {
            const people = Enumerable.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const people = Enumerable.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderByDescending", () => {
            const people = Enumerable.from([bella, amy, emily, eliza, hanna, hanna2, suzuha3, julia, lucrezia, megan, noemi, olga, priscilla, reika, suzuha, suzuha2, noemi2]);
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
            for (const p of orderedPeople.toArray()) {
                const personStr = `[${p.Age}] :: ${p.Name} ${p.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#toDictionary()", () => {
        it("should create a dictionary", () => {
            const people = [alice, emily, karen, megan, suzuha];
            const dictionary = Enumerable.from(people).toDictionary(p => p.Name, p => p);
            expect(dictionary.size()).to.eq(5);
            expect(dictionary.get("Alice")).to.deep.equal(alice);
            expect(dictionary.get("Emily")).to.deep.equal(emily);
            expect(dictionary.get("Karen")).to.deep.equal(karen);
            expect(dictionary.get("Megan")).to.deep.equal(megan);
            expect(dictionary.get("Suzuha")).to.deep.equal(suzuha);
        });
        it("should use internal key value pair to create dictionary if no selectors are provided", () => {
            const dict = new Dictionary<Person, number>();
            dict.add(alice, alice.Age);
            dict.add(emily, emily.Age);
            dict.add(karen, karen.Age);
            const newDict = dict.append(new KeyValuePair<Person, number>(priscilla, priscilla.Age)).toDictionary();
            expect(newDict.size()).to.eq(4);
            expect(newDict.get(alice)).to.eq(alice.Age);
            expect(newDict.get(emily)).to.eq(emily.Age);
            expect(newDict.get(karen)).to.eq(karen.Age);
            expect(newDict.get(priscilla)).to.eq(priscilla.Age);
        });
    });
    describe("#union()", () => {
        const numberList1 = [1, 2, 3, 4, 5];
        const numberList2 = [4, 5, 6, 7, 8];
        const unionList = Enumerable.from(numberList1).union(Enumerable.from(numberList2)).toArray();
        it("should return a union set of two arrays (distinct values only)", () => {
            expect(unionList).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
        });
        it("should use default comparator if no comparator is provided", () => {
            const list1 = Enumerable.from(["Alice", "Misaki", "Megumi", "Misaki"]);
            const list2 = Enumerable.from(["Alice", "Rei", "Vanessa", "Vanessa", "Yuzuha"]);
            const union = list1.union(list2);
            expect(union.toArray()).to.deep.equal(["Alice", "Misaki", "Megumi", "Rei", "Vanessa", "Yuzuha"]);
        });
        it("should be equal to second list if first list is empty", () => {
            const list1 = Enumerable.empty<Person>();
            const list2 = Enumerable.from([alice, noemi, karen, priscilla]);
            const union = list1.union(list2);
            expect(union.toArray()).to.deep.equal(list2.toArray());
        });
    });
    describe("#where()", () => {
        it("should throw error if predicate is null", () => {
            const list = Enumerable.from([2, 5, 6, 99]);
            expect(() => list.where(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return an IEnumerable with elements [2,5]", () => {
            const list = Enumerable.from([2, 5, 6, 99]);
            const list2 = list.where(n => n <= 5).toList();
            expect(list2.size()).to.eq(2);
            expect(list2.get(0)).to.eq(2);
            expect(list2.get(1)).to.eq(5);
        });
    });
    describe("#zip()", () => {
        const numberEnumerable = Enumerable.from([1, 2, 3, 4]);
        const stringEnumerable = Enumerable.from(["one", "two", "three"]);
        it("should return a zipped list with size of 3", () => {
            const numStrList = numberEnumerable.zip(stringEnumerable);
            const expectedResult = [[1, "one"], [2, "two"], [3, "three"]];
            expect(numStrList.toArray()).to.deep.equal(expectedResult);
        });
        it("should return a zipped list with size of 2", () => {
            const zippedList = numberEnumerable.takeLast(2)
                .zip(stringEnumerable.append("four").append("five").takeLast(2), (first: number, second: string) => `${second} ${first}`).toArray();
            expect(zippedList.length).to.eq(2);
            expect(zippedList[0]).to.eq("four 3");
            expect(zippedList[1]).to.eq("five 4");
        });
    });
});
