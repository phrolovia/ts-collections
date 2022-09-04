import {describe, it} from "mocha";
import * as chai from "chai";
import {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import {AsyncEnumerable} from "../../src/enumerator/AsyncEnumerable";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {Person} from "../models/Person";
import {Enumerable} from "../../imports";
import {Helper} from "../helpers/Helper";
import {School} from "../models/School";
import {Student} from "../models/Student";
import {SchoolStudents} from "../models/SchoolStudents";
import {Pair} from "../models/Pair";

describe("AsyncEnumerable", () => {
    chai.use(chaiAsPromised);
    const suspend = (ms: number) => new Promise(resolve => global.setTimeout(resolve, ms));

    const arrayProducer = async function* <T>(numbers: T[], delay: number = 50): AsyncIterable<T> {
        for (let ix = 0; ix < numbers.length; ++ix) {
            await suspend(delay);
            yield numbers[ix];
        }
    };

    const numberProducer = async function* (limit: number = 100, delay: number = 50, start: number = 0): AsyncIterable<number> {
        for (let ix = start; ix < limit; ++ix) {
            await suspend(delay);
            yield ix;
        }
    };

    const numericalStringProducer = async function* (limit: number = 100, delay: number = 50): AsyncIterable<string> {
        for (let ix = 0; ix < limit; ++ix) {
            await suspend(delay);
            yield ix.toString();
        }
    };

    const personProducer = async function* (peopleList: Person[] = [], delay: number = 50): AsyncIterable<Person> {
        const people: Person[] = peopleList.length > 0
            ? peopleList
            : [Person.Alice, Person.Lucrezia, Person.Vanessa, Person.Emily, Person.Noemi];
        for (let ix = 0; ix < people.length; ++ix) {
            await suspend(delay);
            yield people[ix];
        }
    };

    const stringProducer = async function* (stringList: string[], delay: number = 50): AsyncIterable<string> {
        for (let ix = 0; ix < stringList.length; ++ix) {
            await suspend(delay);
            yield stringList[ix];
        }
    };

    describe("aggregate", () => {
        it("should return 3", async () => {
            const result = await new AsyncEnumerable(numberProducer(3)).aggregate((a, b) => a + b);
            expect(result).to.be.equal(3);
        });
        it("should return 6", async () => {
            const result = await new AsyncEnumerable(arrayProducer([4, 8, 8, 3, 9, 0, 7, 8, 2])).aggregate((total, next) => next % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.be.equal(6);
        });
        it("should return 10", async () => {
            const result = await new AsyncEnumerable(arrayProducer([1, 2, 3, 4])).aggregate((total, next) => total+=next);
            expect(result).to.be.equal(10);
        });
        it("should throw error if enumerable is empty and no seed is provided", async () => {
            const result = new AsyncEnumerable(arrayProducer([])).aggregate((a, b) => a + b);
            expect(result).to.be.rejectedWith(ErrorMessages.NoElements);
        });
        it("should return see if enumerable is empty and seed is provided", async () => {
            const result = await new AsyncEnumerable(arrayProducer([])).aggregate((a, b) => a + b, 10);
            expect(result).to.be.equal(10);
        });
        it("should use provided result selector and return 100", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4]));
            const result = await enumerable.aggregate((total, next) => total+=next, 0, (total) => Math.pow(total, 2));
            expect(result).to.be.equal(100);
        })
    });

    describe("#all()", () => {
        it("should return true if all elements satisfy the predicate", async () => {
            const result = await new AsyncEnumerable(numberProducer(10)).all(n => n < 10);
            expect(result).to.eq(true);
        }).timeout(5000);
        it("should return false if any element does not satisfy the predicate", async () => {
            const result = await new AsyncEnumerable(numberProducer(10)).all(n => n % 2 === 1);
            expect(result).to.eq(false);
        }).timeout(5000);
    });

    describe("#any()", () => {
        it("should return true if any element in the enumerable matches the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.any(n => n % 2 === 0);
            console.log(result);
            expect(result).to.eq(true);
        }).timeout(5000);
        it("should return false if no element in the enumerable matches the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.any(n => n > 10);
            expect(result).to.eq(false);
        }).timeout(5000);
        it("should return false if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            const result = await enumerable.any(n => n > 10);
            expect(result).to.eq(false);
        });
        it("should return true if the enumerable is not empty and the predicate is not provided", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.any();
            expect(result).to.eq(true);
        });
    });

    describe("#append()", () => {
        it("should append an element to the end of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.append(10).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            console.log(result);
        }).timeout(5000);
    });

    describe("#average()", () => {
        it("should return the average of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.average(n => n);
            expect(result).to.eq(4.5);
        }).timeout(5000);
        it("should return the average of the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.average();
            expect(result).to.eq(4.5);
        }).timeout(5000);
        it("should throw an error if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.average()).to.be.rejectedWith(ErrorMessages.NoElements);
        }).timeout(5000);
        it("should convert values to number", async () => {
            const enumerable = new AsyncEnumerable(numericalStringProducer(10));
            const result = await enumerable.average(n => parseInt(n, 10));
            expect(result).to.eq(4.5);
        }).timeout(5000);
    });

    describe("#chunk()", () => {
        it("should chunk the enumerable into a collection of arrays", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const resultEnum = await enumerable.chunk(3).toArray();
            const result = resultEnum.map(e => e.toArray());
            expect(result).to.deep.equal([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
        }).timeout(5000);
        it("should chunk the enumerable into a collection of arrays with a custom chunk size", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const resultEnum = await enumerable.chunk(2).toArray();
            const result = resultEnum.map(e => e.toArray());
            expect(result).to.deep.equal([[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]);
        }).timeout(5000);
        it("should throw an error if the chunk size is less than 1", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(() => enumerable.chunk(0)).to.throw(ErrorMessages.InvalidChunkSize);
        }).timeout(5000);
    });

    describe("#concat()", () => {
        it("should concatenate two enumerables", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.concat(new AsyncEnumerable(numberProducer(10))).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }).timeout(5000);
    });

    describe("#contains()", () => {
        it("should return true if the enumerable contains the element", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.contains(5);
            expect(result).to.eq(true);
        }).timeout(5000);
        it("should return false if the enumerable does not contain the element", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.contains(10);
            expect(result).to.eq(false);
        }).timeout(5000);
        it("should use provided equality comparer", async () => {
            expect((await new AsyncEnumerable(personProducer()).contains(Person.Alice, (p1, p2) => p1.age === p2.age))).to.eq(true);
            expect((await new AsyncEnumerable(personProducer()).contains(Person.Noemi, (p1, p2) => p1.age === p2.age))).to.eq(true);
            expect((await new AsyncEnumerable(personProducer()).contains(Person.Noemi2, (p1, p2) => p1.age === p2.age))).to.eq(false);
        });
    });

    describe("#count()", () => {
        it("should return the number of elements in the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.count();
            expect(result).to.eq(10);
        }).timeout(5000);
        it("should return the number of elements in the enumerable that satisfy the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.count(n => n % 2 === 0);
            expect(result).to.eq(5);
        }).timeout(5000);
    });

    describe("#defaultIfEmpty()", () => {
        it("should return the enumerable if it is not empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.defaultIfEmpty(10).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }).timeout(5000);
        it("should return the default value if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            const result = await enumerable.defaultIfEmpty(10).toArray();
            expect(result).to.deep.equal([10]);
        }).timeout(5000);
    });

    describe("#distinct()", () => {
        it("should return the distinct elements in the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.distinct().toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }).timeout(5000);
        it("should return the distinct elements in the enumerable using a custom equality comparer", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Mel, Person.Noemi, Person.Noemi2]
            ));
            const result = await enumerable.distinct(p => p, (p1, p2) => p1.age === p2.age).toArray();
            expect(result).to.deep.equal([Person.Mel, Person.Noemi, Person.Noemi2]);
        }).timeout(5000);
        it("should return the distinct elements in the enumerable using a custom equality comparer #2", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Mel, Person.Noemi, Person.Noemi2]
            ));
            const result = await enumerable.distinct(p => p, (p1, p2) => p1.name === p2.name).toArray();
            expect(result).to.deep.equal([Person.Mel, Person.Noemi]);
        }).timeout(5000);
    });

    describe("#elementAt()", () => {
        it("should return the element at the specified index", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.elementAt(5);
            expect(result).to.eq(5);
        }).timeout(5000);
        it("should throw an error if the index is out of bounds", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(enumerable.elementAt(10)).to.rejectedWith(ErrorMessages.IndexOutOfBoundsException);
        }).timeout(5000);
        it("should throw an error if the index is out of bounds #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(enumerable.elementAt(-1)).to.rejectedWith(ErrorMessages.IndexOutOfBoundsException);
        }).timeout(5000);
    });

    describe("#elementAtOrDefault()", () => {
        it("should return the element at the specified index", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.elementAtOrDefault(5);
            expect(result).to.eq(5);
        }).timeout(5000);
        it("should return the default value if the index is out of bounds", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.elementAtOrDefault(10);
            expect(result).to.eq(null);
        }).timeout(5000);
        it("should return the default value if the index is out of bounds #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.elementAtOrDefault(-1);
            expect(result).to.eq(null);
        }).timeout(5000);
    });

    describe("#except()", () => {
        it("should return the elements in the enumerable that are not in the other enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.except(new AsyncEnumerable(numberProducer(5))).toArray();
            expect(result).to.deep.equal([5, 6, 7, 8, 9]);
        }).timeout(5000);
        it("should only have 'Alice', 'Noemi' and 'Senna' in the result", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]
            ));
            const enumerable2 = new AsyncEnumerable(personProducer(
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            ));
            const result = await enumerable1.except(enumerable2).toArray();
            expect(result).to.deep.equal([Person.Alice, Person.Noemi, Person.Senna]);
        });
        it("should only have 'Alice' and 'Senna' in the result", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]
            ));
            const enumerable2 = new AsyncEnumerable(personProducer(
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            ));
            const result = await enumerable1.except(enumerable2, (p1, p2) => p1.name === p2.name).toArray();
            expect(result).to.deep.equal([Person.Alice, Person.Senna]);
        });
        it("should return a set of people unique to first enumerable", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 100).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const enumerable2 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 50).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const result = await enumerable1.except(enumerable2, (p1, p2) => p1.age === p2.age).toArray();
            const ageCount = Enumerable.from(result).count(p => p.age <= 50);
            expect(ageCount).to.eq(0);
        }).timeout(5000);
        it("should use order comparator to return a set of people unique to first enumerable", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 100).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const enumerable2 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 50).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const result = await enumerable1.except(enumerable2, null, (p1, p2) => p1.age - p2.age).toArray();
            const ageCount = Enumerable.from(result).count(p => p.age <= 50);
            expect(ageCount).to.eq(0);
        }).timeout(5000);
    });

    describe("#first()", () => {
        it("should return the first element of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.first();
            console.log(result);
            expect(result).to.eq(0);
        }).timeout(5000);
        it("should return the first element of the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).first();
            console.log(result);
            expect(result).to.eq(-99);
        }).timeout(5000);
        it("should return the first element that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).skip(2).first(n => n % 5 === 0);
            console.log(result);
            expect(result).to.eq(5);
        }).timeout(5000);
        it("should throw an error if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.first()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
        it("should throw an error if no elements satisfy the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(enumerable.first(n => n > 10)).to.be.rejectedWith(ErrorMessages.NoMatchingElement);
        });
    });

    describe("#firstOrDefault()", () => {
        it("should return the first element of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.firstOrDefault();
            expect(result).to.eq(0);
        }).timeout(5000);
        it("should return the first element of the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).firstOrDefault();
            expect(result).to.eq(-99);
        }).timeout(5000);
        it("should return the first element that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).skip(2).firstOrDefault(n => n % 5 === 0);
            expect(result).to.eq(5);
        }).timeout(5000);
        it("should return the default value if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            const result = await enumerable.firstOrDefault(n => n > 10);
            expect(result).to.be.null;
        }).timeout(5000);
        it("should return the default value if no elements satisfy the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.firstOrDefault(n => n > 10);
            expect(result).to.be.null;
        }).timeout(5000);
    });

    describe("#forEach()", () => {
        it("should iterate over the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result: number[] = [];
            await enumerable.forEach(n => {
                result.push(n);
            });
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }).timeout(5000);
        it("should iterate over the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result: number[] = [];
            await enumerable.where(n => n % 2 === 0).skip(1).forEach(n => {
                result.push(n);
            });
            expect(result).to.deep.equal([2, 4, 6, 8]);
        }).timeout(5000);
    });

    describe("#groupBy()", () => {
        it("should group the enumerable by the key selector", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.groupBy(n => n % 2 === 0).toArray();
            expect(result.length).to.eq(2);
            expect(result[0].key).to.be.true;
            expect(result[1].key).to.be.false;
            expect(result[0].source.toArray()).to.deep.equal([0, 2, 4, 6, 8]);
            expect(result[1].source.toArray()).to.deep.equal([1, 3, 5, 7, 9]);
        }).timeout(5000);
        it("should group people by age", async () => {
            const enumerable = new AsyncEnumerable(personProducer([
                Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane, Person.Kaori, Person.Reina
            ]));
            const group = await enumerable.groupBy(p => p.age).toArray();
            const ages: number[] = [];
            const groupedAges: Record<number, number[]> = {};
            for (const ageGroup of group) {
                ages.push(ageGroup.key);
                groupedAges[ageGroup.key] ??= [];
                for (const person of ageGroup.source) {
                    groupedAges[ageGroup.key].push(person.age);
                }
            }
            expect(ages).to.have.all.members([9, 10, 16, 23]);
            for (const g in groupedAges) {
                const sameAges = groupedAges[g];
                const expectedAges = new Array(sameAges.length).fill(sameAges[0]);
                expect(sameAges).to.deep.equal(expectedAges);
            }
        });
    });

    describe("#groupJoin()", () => {
        const schools: School[] = [
            new School(1, "Elementary School"),
            new School(2, "High School"),
            new School(3, "University"),
            new School(5, "Academy")
        ];
        const students: Student[] = [
            new Student(100, "Desireé", "Moretti", 3),
            new Student(200, "Apolline", "Bruyere", 2),
            new Student(300, "Giselle", "García", 2),
            new Student(400, "Priscilla", "Necci", 1),
            new Student(500, "Lucrezia", "Volpe", 4)
        ];
        const schoolProducer = async function* (): AsyncIterableIterator<School> {
            for (const school of schools) {
                await suspend(100);
                yield school;
            }
        };
        const studentProducer = async function* (): AsyncIterableIterator<Student> {
            for (const student of students) {
                await suspend(100);
                yield student;
            }
        };
        it("should join and group by school id", async () => {
            const schoolsEnumerable = new AsyncEnumerable(schoolProducer());
            const studentsEnumerable = new AsyncEnumerable(studentProducer());
            const joinedData = schoolsEnumerable.groupJoin(studentsEnumerable, sc => sc.id, st => st.schoolId,
                (school, students) => {
                    return new SchoolStudents(school.id, students.toList());
                }).orderByDescending(ss => ss.students.size());
            const finalData = await joinedData.toArray();
            const finalOutput: string[] = [];
            for (const sd of finalData) {
                const school = schools.find(s => s.id === sd.schoolId);
                finalOutput.push(`Students of ${school?.name}: `);
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
        }).timeout(5000);
    });

    describe("#intersect()", () => {
        it("should return the intersection of two enumerables", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10, 10, 0));
            const enumerable2 = new AsyncEnumerable(numberProducer(15, 10, 5));
            const result = await enumerable.intersect(enumerable2).toArray();
            expect(result).to.deep.equal([5, 6, 7, 8, 9]);
        }).timeout(5000);
        it("should only have 'Mel', 'Lenka' and 'Jane' in the result", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]
            ));
            const enumerable2 = new AsyncEnumerable(personProducer(
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            ));
            const result = await enumerable1.intersect(enumerable2).toArray();
            expect(result).to.deep.equal([Person.Mel, Person.Lenka, Person.Jane]);
        });
        it("should only have 'Alice' and 'Senna' in the result", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane]
            ));
            const enumerable2 = new AsyncEnumerable(personProducer(
                [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
            ));
            const result = await enumerable1.intersect(enumerable2, (p1, p2) => p1.name === p2.name).toArray();
            expect(result).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
        });
        it("should return a set of people shared by both enumerables", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 100).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const enumerable2 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 50).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const result = await enumerable1.intersect(enumerable2, (p1, p2) => p1.age === p2.age).toArray();
            const ageCount = Enumerable.from(result).count(p => p.age > 50);
            expect(ageCount).to.eq(0);
        }).timeout(5000);
        it("should use order comparator to return a set of people shared by both enumerables", async () => {
            const enumerable1 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 100).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const enumerable2 = new AsyncEnumerable(personProducer(
                Enumerable.range(0, 50).select(n => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), n + 1)).toArray(),
                1));
            const result = await enumerable1.intersect(enumerable2, null, (p1, p2) => p1.age - p2.age).toArray();
            const ageCount = Enumerable.from(result).count(p => p.age > 50);
            expect(ageCount).to.eq(0);
        }).timeout(5000);
    });

    describe("#join()", () => {
        const schools: School[] = [
            new School(1, "Elementary School"),
            new School(2, "High School"),
            new School(3, "University"),
            new School(5, "Academy")
        ];
        const students: Student[] = [
            new Student(100, "Desireé", "Moretti", 3),
            new Student(200, "Apolline", "Bruyere", 2),
            new Student(300, "Giselle", "García", 2),
            new Student(400, "Priscilla", "Necci", 1),
            new Student(500, "Lucrezia", "Volpe", 4)
        ];
        const schoolProducer = async function* (): AsyncIterableIterator<School> {
            for (const school of schools) {
                await suspend(100);
                yield school;
            }
        };
        const studentProducer = async function* (): AsyncIterableIterator<Student> {
            for (const student of students) {
                await suspend(100);
                yield student;
            }
        };
        it("should join students and schools", async () => {
            const schoolsEnumerable = new AsyncEnumerable(schoolProducer());
            const studentsEnumerable = new AsyncEnumerable(studentProducer());
            const joinedData = await studentsEnumerable.join(schoolsEnumerable, st => st.schoolId, sc => sc.id, (student, school) => {
                return `${student.name} ${student.surname} :: ${school.name}`;
            }).toArray();
            const expectedOutput = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
                // "Lucrezia Volpe :: Academy"
            ];
            expect(joinedData.length).to.eq(4);
            expect(joinedData).to.deep.equal(expectedOutput);
        });
        it("should set null for school if left join is true", async () => {
            const schoolsEnumerable = new AsyncEnumerable(schoolProducer());
            const studentsEnumerable = new AsyncEnumerable(studentProducer());
            const joinedData = await studentsEnumerable.join(schoolsEnumerable, st => st.schoolId, sc => sc.id, (student, school) => {
                return [student, school];
            }, (stId, scId) => stId === scId, true).toArray();
            console.log(joinedData);
            for (const [student, school] of joinedData) {
                if (student.id === 500) {
                    expect(school).to.be.null;
                } else {
                    expect(school).to.not.be.null;
                }
            }
        });
        it("should join key-value pairs", async () => {
            const pairs1 = [
                new Pair(1, "A"),
                new Pair(2, "B"),
                new Pair(3, "C")
            ];
            const pairs2 = [
                new Pair(1, "a1"),
                new Pair(1, "a2"),
                new Pair(1, "a3"),
                new Pair(2, "b1"),
                new Pair(2, "b2")
            ];
            const pairProducer1 = async function* (): AsyncIterableIterator<Pair<number, string>> {
                for (const pair of pairs1) {
                    await suspend(100);
                    yield pair;
                }
            };
            const pairProducer2 = async function* (): AsyncIterableIterator<Pair<number, string>> {
                for (const pair of pairs2) {
                    await suspend(100);
                    yield pair;
                }
            };
            const pairsEnumerable1 = new AsyncEnumerable(pairProducer1());
            const pairsEnumerable2 = new AsyncEnumerable(pairProducer2());
            const joinedData = await pairsEnumerable1.join(pairsEnumerable2, p1 => p1.key, p2 => p2.key, (p1, p2) => [p1.value, p2.value]).toArray();
            const expectedOutput = [
                ["A", "a1"],
                ["A", "a2"],
                ["A", "a3"],
                ["B", "b1"],
                ["B", "b2"]
            ];
            expect(joinedData.length).to.eq(5);
            expect(joinedData).to.deep.equal(expectedOutput);
        });
    });

    describe("#last()", () => {
        it("should return the last element of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const last = await enumerable.last();
            expect(last).to.eq(9);
        });
        it("should return the last element of the enumerable that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const last = await enumerable.last(n => n % 2 === 0);
            expect(last).to.eq(8);
        });
        it("should throw error if no element satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(enumerable.last(n => n > 10)).to.be.rejectedWith(ErrorMessages.NoMatchingElement);
        });
        it("should throw error if no element is present", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.last()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
    });

    describe("#lastOrDefault()", () => {
        it("should return the last element of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const last = await enumerable.lastOrDefault();
            expect(last).to.eq(9);
        });
        it("should return the last element of the enumerable that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const last = await enumerable.lastOrDefault(n => n % 2 === 0);
            expect(last).to.eq(8);
        });
        it("should return null if no element satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(await enumerable.lastOrDefault(n => n > 10)).to.be.null;
        });
        it("should return null if no element is present", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(await enumerable.lastOrDefault()).to.be.null;
        });
    });

    describe("#max()", () => {
        it("should return the maximum value of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const max = await enumerable.max();
            expect(max).to.eq(9);
        });
        it("should return the maximum value of the enumerable that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(personProducer([
                Person.Alice,
                Person.Olga,
                Person.Kaori,
                Person.Priscilla
            ]));
            const max = await enumerable.max(p => p.age);
            expect(max).to.eq(77);
        });
        it("should throw error if no element is present", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.max()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
    });

    describe("#min()", () => {
        it("should return the minimum value of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const min = await enumerable.min();
            expect(min).to.eq(0);
        });
        it("should return the minimum value of the enumerable that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(personProducer([
                Person.Alice,
                Person.Olga,
                Person.Kaori,
                Person.Priscilla
            ]));
            const min = await enumerable.min(p => p.age);
            expect(min).to.eq(9);
        });
        it("should throw error if no element is present", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.min()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
    });

    describe("#orderBy()", () => {
        it("should sort the enumerable in ascending order", async () => {
            const enumerable = new AsyncEnumerable(personProducer([
                Person.Alice,
                Person.Olga,
                Person.Lucrezia,
                Person.Priscilla,
                Person.Reika
            ]));
            const sorted = await enumerable.orderBy(p => p.age).toArray();
            console.log(sorted);
            expect(sorted).to.deep.equal([Person.Priscilla, Person.Lucrezia, Person.Alice, Person.Reika, Person.Olga]);
        });

    });

    describe("#orderByDescending()", () => {
        it("should sort the enumerable in descending order", async () => {
            const enumerable = new AsyncEnumerable(personProducer([
                Person.Alice,
                Person.Olga,
                Person.Lucrezia,
                Person.Priscilla,
                Person.Reika
            ]));
            const sorted = await enumerable.orderByDescending(p => p.age).toArray();
            expect(sorted).to.deep.equal([Person.Olga, Person.Reika, Person.Alice, Person.Lucrezia, Person.Priscilla]);
        });
        it("should sort the enumerable in descending order", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const sorted = await enumerable.orderByDescending(n => n).toArray();
            expect(sorted).to.deep.equal([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
    });

    describe("#pairwise()", () => {
        it("should return the pairwise elements of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(stringProducer(["a", "b", "c", "d", "e", "f"]));
            const result = await enumerable.pairwise((prev, curr) => [`->${prev}`, `${curr}<-`]);
            it("should create an enumerable that pairs up the values", () => {
                expect(result.toArray()).to.deep.equal([["->a", "b<-"], ["->b", "c<-"], ["->c", "d<-"], ["->d", "e<-"], ["->e", "f<-"]]);
            });
        });
    });

    describe("#partition()", () => {
        it("should partition the enumerable into two enumerables", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const [even, odd] = await enumerable.partition(n => n % 2 === 0);
            expect(await even.toArray()).to.deep.equal([0, 2, 4, 6, 8]);
            expect(await odd.toArray()).to.deep.equal([1, 3, 5, 7, 9]);
        });
    });

    describe("#prepend()", () => {
        it("should prepend an element to the beginning of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(10).toArray();
            expect(result).to.deep.equal([10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            console.log(result);
        }).timeout(5000);
    });

    describe("#reverse()", () => {
        it("should reverse the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.reverse().toArray();
            expect(result).to.deep.equal([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        });
    });

    describe("#scan()", () => {
        it("should scan the enumerable", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4]));
            const result = await enumerable.scan((prev, curr) => prev + curr).toArray();
            expect(result).to.deep.equal([1, 3, 6, 10]);
        });
        it("should create a list of increasing numbers starting with 2", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4, 5]));
            const result = await enumerable.scan((acc, n) => acc + n, 2).toArray();
            expect(result).to.deep.equal([3, 5, 8, 12, 17]);
        });
        it("should create a list of increasing numbers starting with 1", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 3, 12, 19, 33]));
            const result = await enumerable.scan((acc, n) => acc + n, 0).toArray();
            expect(result).to.deep.equal([1, 4, 16, 35, 68]);
        });
    });

    describe("#select()", () => {
        it("should map values to their squares", async () => {
            const numbers: number[] = [];
            const enumerable = new AsyncEnumerable(numberProducer(5, 100));
            for await (const num of enumerable.select(p => Math.pow(p, 2))) {
                numbers.push(num);
            }
            expect(numbers).to.deep.equal([0, 1, 4, 9, 16]);
        }).timeout(5000);
        it("should return an IEnumerable with elements [125, 729]", async () => {
            const result = await new AsyncEnumerable(arrayProducer([2, 5, 6, 9], 100))
                .where(n => n % 2 !== 0).select(n => Math.pow(n, 3)).toArray();
            expect(result.length).to.eq(2);
            expect(result[0]).to.eq(125);
            expect(result[1]).to.eq(729);
        });
    });

    describe("#selectMany()", async () => {
        it("should return a flattened array of ages", async () => {
            const people: Person[] = [];
            Person.Viola.friendsArray = [Person.Rebecca];
            Person.Jisu.friendsArray = [Person.Alice, Person.Mel];
            Person.Vanessa.friendsArray = [Person.Viola, Person.Rebecca, Person.Jisu, Person.Alice];
            Person.Rebecca.friendsArray = [Person.Viola];
            people.push(Person.Viola);
            people.push(Person.Rebecca);
            people.push(Person.Jisu);
            people.push(Person.Vanessa);
            const enumerable = new AsyncEnumerable(personProducer(people));
            const friends = await enumerable.selectMany(p => p.friendsArray).select(p => p.age).toArray();
            expect(friends).to.deep.equal([17, 28, 23, 9, 28, 17, 14, 23]);
        });
    });

    describe("#sequenceEqual()", () => {
        it("should return true for two equal enumerables", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.sequenceEqual(new AsyncEnumerable(numberProducer(10)));
            expect(result).to.be.true;
        });
        it("should return false for two unequal enumerables", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.sequenceEqual(new AsyncEnumerable(numberProducer(5)));
            expect(result).to.be.false;
        });
        it("should return false for two unequal enumerables #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(5));
            const result = await enumerable.sequenceEqual(new AsyncEnumerable(numberProducer(10)));
            expect(result).to.be.false;
        });
        it("should return false for two unequal enumerables #3", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(5));
            const result = await enumerable.sequenceEqual(new AsyncEnumerable(numberProducer(0)));
            expect(result).to.be.false;
        });
    });

    describe("#single()", () => {
        it("should return the single element in the enumerable", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1]));
            const result = await enumerable.single();
            expect(result).to.eq(1);
        });
        it("should return the single element in the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4, 5]));
            const result = await enumerable.single(n => n % 5 === 0);
            expect(result).to.eq(5);
        });
        it("should throw error when enumerable has more than one element and no predicate is provided", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2]));
            expect(enumerable.single()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
        it("should throw error if no element matches the predicate", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4, 5]));
            expect(enumerable.single(n => n > 5)).to.be.rejectedWith(ErrorMessages.NoMatchingElement);
        });
        it("should throw if enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([]));
            expect(enumerable.single()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
        it("should return person with name 'Alice'", async () => {
            const enumerable = new AsyncEnumerable(personProducer([Person.Alice, Person.Bella, Person.Suzuha]));
            const result = await enumerable.single(p => p.name === "Alice");
            expect(result).to.eq(Person.Alice);
        });
    });

    describe("#singleOrDefault()", () => {
        it("should return the single element in the enumerable", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1]));
            const result = await enumerable.singleOrDefault();
            expect(result).to.eq(1);
        });
        it("should return the single element in the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4, 5]));
            const result = await enumerable.singleOrDefault(n => n % 5 === 0);
            expect(result).to.eq(5);
        });
        it("should return the default value", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4, 5]));
            const result = await enumerable.singleOrDefault(n => n % 6 === 0);
            expect(result).to.eq(null);
        });
        it("should return the default value if enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([]));
            const result = await enumerable.singleOrDefault();
            expect(result).to.eq(null);
        });
        it("should throw error when enumerable has more than one element and no predicate is provided", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2]));
            expect(enumerable.singleOrDefault()).to.be.rejectedWith(ErrorMessages.MoreThanOneElement);
        });
        it("should throw error if more than one element matches the predicate", async () => {
            const enumerable = new AsyncEnumerable(arrayProducer([1, 2, 3, 4, 4]));
            expect(enumerable.singleOrDefault()).to.be.rejectedWith(ErrorMessages.MoreThanOneMatchingElement);
        });
    });

    describe("#skip()", () => {
        it("should skip the first n elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skip(5).toArray();
            expect(result).to.deep.equal([5, 6, 7, 8, 9]);
            console.log(result);
        }).timeout(5000);
        it("should return empty enumerable if enumerable contains fewer than skipped elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skip(15).toArray();
            expect(result).to.deep.equal([]);
        });
    });

    describe("#skipLast()", () => {
        it("should skip the last n elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skipLast(5).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4]);
        });
        it("should return empty enumerable if enumerable contains fewer than skipped elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skipLast(15).toArray();
            expect(result).to.deep.equal([]);
        });
    });

    describe("#skipWhile()", () => {
        it("should skip elements while predicate is true", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skipWhile(n => n < 5).toArray();
            expect(result).to.deep.equal([5, 6, 7, 8, 9]);
        });
        it("should return empty enumerable if predicate is true for all elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skipWhile(n => n < 15).toArray();
            expect(result).to.deep.equal([]);
        });
    });

    describe("#sum()", () => {
        it("should return the sum of all elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.sum();
            expect(result).to.eq(45);
        });
        it("should return the sum of all elements #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.sum(n => n * 2);
            expect(result).to.eq(90);
        });
        it("should return sum of people's ages", async () => {
            const enumerable = new AsyncEnumerable(personProducer([Person.Alice, Person.Bella, Person.Suzuha]));
            const result = await enumerable.sum(p => p.age);
            expect(result).to.eq(Person.Alice.age + Person.Bella.age + Person.Suzuha.age);
        });
        it("should return 0 for empty enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.sum()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
    });

    describe("#thenBy()", () => {
        it("should order people by age [asc] then by name[asc]", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola]
            ));
            const orderedPeople = enumerable.orderBy(p => p.age, (a1, a2) => a1 - a2).thenBy(p => p.name);
            const orderedPeopleNames = orderedPeople.select(p => p.name);
            const expectedNames = ["Mel", "Kaori", "Senna", "Jisu", "Jane", "Lenka", "Rebecca", "Vanessa", "Alice", "Reina", "Viola"];
            expect(await orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        it("should order people by age [asc] then by name[asc] then by surname[asc]", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                    Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]
            ));
            const orderedPeople = enumerable.orderBy(p => p.age)
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
            for await (const p of orderedPeople) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                    Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]
            ));
            const orderedPeople = enumerable.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
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
            for await (const p of orderedPeople) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });

    describe("#thenByDescending()", () => {
        it("should order people by age [asc] then by name[desc]", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola]
            ));
            const orderedPeople = enumerable.orderBy(p => p.age, (a1, a2) => a1 - a2).thenByDescending(p => p.name);
            const orderedPeopleNames = orderedPeople.select(p => p.name);
            const expectedNames = ["Mel", "Senna", "Kaori", "Jisu", "Lenka", "Jane", "Rebecca", "Vanessa", "Reina", "Alice", "Viola"];
            expect(await orderedPeopleNames.toArray()).to.deep.equal(expectedNames);
        });
        it("should order people by age [desc] then by name[desc] then by surname[desc]", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                    Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]
            ));
            const orderedPeople = enumerable.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
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
            for await (const p of orderedPeople) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                    Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]
            ));
            const orderedPeople = enumerable.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
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
            for await (const p of orderedPeople) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderByDescending", async () => {
            const enumerable = new AsyncEnumerable(personProducer(
                [Person.Bella, Person.Amy, Person.Emily, Person.Eliza, Person.Hanna, Person.Hanna2,
                    Person.Suzuha3, Person.Julia, Person.Lucrezia, Person.Megan, Person.Noemi, Person.Olga, Person.Priscilla, Person.Reika, Person.Suzuha, Person.Suzuha2, Person.Noemi2]
            ));
            const orderedPeople = enumerable.orderByDescending(p => p.age, (a1, a2) => a1 - a2)
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
            for await (const p of orderedPeople) {
                const personStr = `[${p.age}] :: ${p.name} ${p.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });

    describe("#where()", () => {
        it("should select values that can be divided to 3", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(30));
            for await (const num of enumerable.where(p => p % 3 === 0)) {
                expect(num).to.be.greaterThanOrEqual(0);
                expect(num).to.be.lessThan(30);
                expect(num % 3 === 0).to.be.true;
            }
        }).timeout(12000);
    });
});
