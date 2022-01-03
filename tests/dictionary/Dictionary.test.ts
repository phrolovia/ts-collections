import {describe, it} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {EqualityComparator} from "../../src/shared/EqualityComparator";
import {School} from "../models/School";
import {Student} from "../models/Student";
import {SchoolStudents} from "../models/SchoolStudents";
import {Dictionary} from "../../src/dictionary/Dictionary";
import {KeyValuePair} from "../../src/dictionary/KeyValuePair";
import {List} from "../../imports";
import {Helper} from "../helpers/Helper";

describe("Dictionary", () => {

    const personAgeComparator = (p1: Person, p2: Person) => p1.age - p2.age;
    const personNameComparator = (p1: Person, p2: Person) => p1.name.localeCompare(p2.name)
    const personSurnameComparator = (p1: Person, p2: Person) => p1.surname.localeCompare(p2.surname);

    describe("#add()", () => {
        const dictionary = new Dictionary<string, number>();
        dictionary.add("Amber", 1162621);
        dictionary.add("Barbara", 212121211);
        dictionary.add("Noelle", 1718615156);
        it("should add values into the dictionary", () => {
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.get("Amber")).to.not.undefined;
            expect(dictionary.get("Amber")).to.eq(1162621);
            expect(dictionary.get("Barbara")).to.not.undefined;
            expect(dictionary.get("Barbara")).to.eq(212121211);
            expect(dictionary.get("Noelle")).to.not.undefined;
            expect(dictionary.get("Noelle")).to.eq(1718615156);
            expect(dictionary.Count).to.eq(3);
        });
        it("should throw error if key already exists", () => {
            expect(() => dictionary.add("Amber", 1)).to.throw();
        });
        it("should throw error if key is null", () => {
            expect(() => dictionary.add(null, 1)).to.throw(ErrorMessages.NullKey);
        });
    });

    describe("#aggregate()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        dictionary.add(3, "c");
        dictionary.add(4, "d");
        dictionary.add(5, "e");
        it("should return the sum of keys", () => {
            const result = dictionary.aggregate((total, next) => total + next.key, 0);
            expect(result).to.eq(15);
            dictionary.remove(5);
            const result2 = dictionary.aggregate((total, next) => total + next.key, 0);
            expect(result2).to.eq(10);
        });
        it("should return the seed if dictionary is empty", () => {
            dictionary.clear();
            const result = dictionary.aggregate((total, next) => total + next.key, 99);
            expect(result).to.eq(99);
        });
        it("should throw error if dictionary is empty and no seed is provided", () => {
            expect(() => dictionary.aggregate<number>((total, next) => total + next.key)).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#all()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should not have any person who is older than 29", () => {
            const all = dictionary.all(p => p.value.age > 29);
            expect(all).to.eq(false);
        });
        it("should return true if no predicate is provided and dictionary is not empty", () => {
            expect(dictionary.all()).to.eq(true);
        });
        it("should return false if no predicate is provided and dictionary is empty", () => {
            dictionary.clear();
            expect(dictionary.all()).to.eq(false);
        });
    });

    describe("#any()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should have a person with age 29", () => {
            const any = dictionary.any(p => p.value.age === 29);
            expect(any).to.eq(true);
        });
        it("should return true if no predicate is provided and dictionary is not empty", () => {
            expect(dictionary.any()).to.eq(true);
        });
        it("should return false if no predicate is provided and dictionary is empty", () => {
            dictionary.clear();
            expect(dictionary.any()).to.eq(false);
        });
    });

    describe("#append()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should append the new element and return a new dictionary", () => {
            const dict2 = dictionary.append(new KeyValuePair<string, Person>(Person.Reina.name, Person.Reina)).toDictionary(p => p.key, p => p.value);
            expect(dict2.get("Reina")).to.not.null;
            expect(dict2.get("Reina")).to.eq(Person.Reina);
            expect(dict2.size()).to.eq(5);
            expect(dictionary.size()).to.eq(4);
            expect(dictionary.get("Reina")).to.null;
            expect(dict2 === dictionary).to.eq(false);
            expect(dict2.Count).to.eq(5);
        });
    });

    describe("#average()", () => {
        const dict = new Dictionary<string, number>();
        dict.add("A", 1);
        dict.add("B", 101);
        it("should return 51", () => {
            const avg = dict.average(p => p.value);
            expect(avg).to.eq(51);
        });
        it("should throw error if dictionary is empty", () => {
            dict.clear();
            expect(() => dict.average(p => p.value)).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#clear()", () => {
        it("should remove all elements from the dictionary", () => {
            const dictionary = new Dictionary<string, number>();
            dictionary.add("a", 1);
            dictionary.add("b", 2);
            dictionary.clear();
            expect(dictionary.size()).to.eq(0);
            expect(dictionary.get("a")).to.null;
            expect(dictionary.get("b")).to.null;
            expect(dictionary.Count).to.eq(0);
        });
    });

    describe("#concat()", () => {
        const dictionary1 = new Dictionary<string, Person>();
        dictionary1.add(Person.Alice.name, Person.Alice);
        dictionary1.add(Person.Lucrezia.name, Person.Lucrezia);
        const dictionary2 = new Dictionary<string, Person>();
        dictionary2.add(Person.Noemi.name, Person.Noemi);
        dictionary2.add(Person.Priscilla.name, Person.Priscilla);
        it("should return with a dictionary which contains four people", () => {
            const dict = dictionary1.concat(dictionary2).toDictionary();
            expect(dict.size()).to.eq(4);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Noemi")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.get("Priscilla")).to.not.null;
            expect(dict.Count).to.eq(4);
        });
    });

    describe("#contains()", () => {
        const personComparator: EqualityComparator<KeyValuePair<string, Person>>
            = (p1, p2) => p1.value.name === p2.value.name;
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should contain 'Noemi'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Noemi.name, Person.Noemi), personComparator)).to.eq(true);
        });
        it("should contain 'Lucrezia'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia), personComparator)).to.eq(true);
        });
        it("should not contain 'Olga'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Olga.name, Person.Olga), personComparator)).to.eq(false);
        });
    });

    describe("#containsKey()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should return true", () => {
            expect(dictionary.containsKey(Person.Noemi.name)).to.eq(true);
        });
        it("should return false", () => {
            expect(dictionary.containsKey(Person.Viola.name)).to.eq(false);
        });
    });

    describe("#containsValue()", () => {
        const personComparator = (p1: Person, p2: Person) => p1.equals(p2);
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should return true", () => {
            expect(dictionary.containsValue(Person.Noemi)).to.eq(true);
        });
        it("should return false", () => {
            expect(dictionary.containsValue(Person.Noemi2, personComparator)).to.eq(false);
        });
    });

    describe("#count()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should return 4", () => {
            expect(dictionary.count()).to.eq(4);
        });
        it("should return 3", () => {
            const count = dictionary.count(p => p.value.age > 9);
            expect(count).to.eq(3);
        });
        it("should return 0", () => {
            dictionary.clear();
            expect(dictionary.count()).to.eq(0);
        });
    });

    describe("#defaultIfEmpty()", () => {
        it("should return a new IEnumerable with the default value", () => {
            const dictionary = new Dictionary<string, Person>();
            const dict = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(Person.Alice.name, Person.Alice)).toDictionary<string, Person>();
            const single = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia)).single();
            expect(dict instanceof Dictionary).to.eq(true);
            expect(dict.size()).to.eq(1);
            expect(dict.get(Person.Alice.name)).to.not.null;
            expect(single.value).to.eq(Person.Lucrezia);
            expect(dict.Count).to.eq(1);
        });
    });

    describe("#distinct()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        it("should return a new dictionary which is identical to the source dictionary", () => {
            const dict = dictionary.distinct(e => e.key).toDictionary<string, Person>();
            expect(dict === dictionary).to.eq(false);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.Count).to.eq(dictionary.size());
            // console.log("distinct operation on a dictionary has no effect since dictionary is innately distinct.");
        });
    });

    describe("#elementAt()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        it("should return 'Lucrezia'", () => {
            const person = dictionary.elementAt(1);
            expect(person.value).to.eq(Person.Lucrezia);
        });
        it("should throw error if index is out of bounds", () => {
            expect(() => dictionary.elementAt(100)).to.throw();
            expect(() => dictionary.elementAt(-1)).to.throw();
        });
    });

    describe("#elementAtOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        it("should return 'Lucrezia'", () => {
            const person = dictionary.elementAtOrDefault(1);
            expect(person.value).to.eq(Person.Lucrezia);
        });
        it("should return null if index is out of bounds", () => {
            expect(dictionary.elementAtOrDefault(100)).to.eq(null);
            expect(dictionary.elementAtOrDefault(-1)).to.eq(null);
        });
    });

    describe("#entries()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Alice.name, Person.Alice);
        let index = 0;
        it("should return an IterableIterator with key-value tuple", () => {
            for (const [key, value] of dictionary.entries()) {
                if (index === 0) {
                    expect(key).to.eq(Person.Alice.name);
                    expect(value.equals(Person.Alice)).to.be.true;
                } else if (index === 1) {
                    expect(key).to.eq(Person.Noemi.name);
                    expect(value.equals(Person.Noemi)).to.be.true;
                }
                ++index;
            }
        });
    });

    describe("#except()", () => {
        const dict1 = new Dictionary<number, string>();
        const dict2 = new Dictionary<number, string>();
        dict1.add(1, "a");
        dict1.add(2, "b");
        dict1.add(3, "c");
        dict1.add(4, "d");
        dict2.add(5, "e");
        dict2.add(2, "b");
        it("should return a new dictionary with the elements unique to first dictionary", () => {
            const result = dict1.except(dict2).toDictionary<number, string>();
            expect(result.size()).to.eq(3);
            expect(result.get(1)).to.not.null;
            expect(result.get(3)).to.not.null;
            expect(result.get(4)).to.not.null;
            expect(result.get(2)).to.null;
        });
    });

    describe("#first()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should throw error if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(() => dict.first()).to.throw(ErrorMessages.NoElements);
        });
        it("should return the first element if no predicate is provided", () => {
            const first = dictionary.first();
            expect(first.key).to.eq(Person.Alice.name);
            expect(first.value.equals(Person.Alice)).to.be.true;
        });
        it("should throw an error if no matching element is found", () => {
            expect(() => dictionary.first(p => p.value.name === "Suzuha")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return a person with name 'Noemi'", () => {
            const first = dictionary.first(p => p.value.name === "Noemi");
            expect(first.value).to.eq(Person.Noemi);
        });
    });

    describe("#firstOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should return null if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(dict.firstOrDefault()).to.eq(null);
        });
        it("should return the first element if no predicate is provided", () => {
            const first = dictionary.firstOrDefault();
            expect(first.key).to.eq(Person.Alice.name);
            expect(first.value.equals(Person.Alice)).to.be.true;
        });
        it("should return null if no matching element is found", () => {
            expect(dictionary.firstOrDefault(p => p.value.name === "Suzuha")).to.eq(null);
        });
        it("should return a person with name 'Noemi'", () => {
            const first = dictionary.firstOrDefault(p => p.value.name === "Noemi");
            expect(first.value).to.eq(Person.Noemi);
        });
    });

    describe("#forEach()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should loop over the dictionary", () => {
            const names: string[] = [];
            dictionary.forEach(pair => names.push(pair.value.name));
            expect(names).to.deep.equal([Person.Alice.name, Person.Lucrezia.name, Person.Noemi.name, Person.Priscilla.name]);
        });
    });

    describe("#get()", () => {
        const dictionary = new Dictionary<Person, number>(personNameComparator);
        it("should get the value which belongs to the given key", () => {
            dictionary.add(Person.Alice, Person.Alice.age);
            dictionary.add(Person.Mel, Person.Mel.age);
            dictionary.add(Person.Senna, Person.Senna.age);
            expect(dictionary.get(Person.Alice)).to.eq(Person.Alice.age);
            expect(dictionary.get(Person.Mel)).to.eq(Person.Mel.age);
            expect(dictionary.get(Person.Senna)).to.eq(Person.Senna.age);
        });
        it("should get the value which belongs to the given key #2", () => {
            const numbers = Helper.generateRandomUniqueNumbers(500000);
            const dict = new Dictionary<number, string>();
            numbers.forEach(n => dict.add(n, n.toString()));
            for (const num of numbers) {
                expect(dict.get(num)).to.eq(num.toString());
            }
        }).timeout(15000);
        it("should return null if key is not in the dictionary", () => {
            expect(dictionary.get(Person.Jane)).to.be.null;
        });
    });

    describe("#groupBy()", () => {
        const dict = new Dictionary<string, Person>();
        dict.add(Person.Alice.name, Person.Alice);
        dict.add(Person.Mel.name, Person.Mel);
        dict.add(Person.Senna.name, Person.Senna);
        dict.add(Person.Lenka.name, Person.Lenka);
        dict.add(Person.Jane.name, Person.Jane);
        dict.add(Person.Karen.name, Person.Karen);
        dict.add(Person.Reina.name, Person.Reina);
        it("should group people by age", () => {
            const group = dict.groupBy(p => p.value.age).toDictionary(g => g.key, g => g, null);
            const ages: number[] = [];
            const groupedAges: Record<number, number[]> = {};
            for (const ageGroup of group.values()) {
                ages.push(ageGroup.key)
                groupedAges[ageGroup.key] ??= [];
                for (const dictItem of ageGroup.source) {
                    groupedAges[ageGroup.key].push(dictItem.value.age);
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
        const schoolDict = new Dictionary<number, School>();
        const studentDict = new Dictionary<number, Student>();
        schoolDict.add(1, new School(1, "Elementary School"));
        schoolDict.add(2, new School(2, "High School"));
        schoolDict.add(3, new School(3, "University"));
        schoolDict.add(5, new School(5, "Academy"));
        studentDict.add(100, new Student(100, "Desireé", "Moretti", 3));
        studentDict.add(200, new Student(200, "Apolline", "Bruyere", 2));
        studentDict.add(300, new Student(300, "Giselle", "García", 2));
        studentDict.add(400, new Student(400, "Priscilla", "Necci", 1));
        studentDict.add(500, new Student(500, "Lucrezia", "Volpe", 4));
        it("should join and group by school id", () => {
            const joinedData = schoolDict.groupJoin(studentDict, sc => sc.value.id, st => st.value.schoolId,
                (schoolId, students) => {
                    return new SchoolStudents(schoolId, students.select(s => s.value).toList())
                }).orderByDescending(ss => ss.students.size());
            const finalData = joinedData.toArray();
            const finalOutput: string[] = [];
            for (const sd of finalData) {
                const school = schoolDict.where(s => s.value.id === sd.schoolId).single();
                finalOutput.push(`Students of ${school.value.name}: `);
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

    describe("#intersect()", () => {
        const dict1 = new Dictionary<number, string>();
        const dict2 = new Dictionary<number, string>();
        dict1.add(1, "a");
        dict1.add(2, "b");
        dict1.add(3, "c");
        dict2.add(4, "d");
        dict2.add(2, "b");
        it("should return a dictionary consisting of equal KeyValuePairs", () => {
            const result = dict1.intersect(dict2).toDictionary<number, string>();
            expect(result.size()).to.eq(1);
            expect(result.get(2)).to.eq("b");
            expect(result.get(1)).to.null;
            expect(result.get(3)).to.null;
            expect(result.get(4)).to.null;
        });
        it("should return an empty dictionary", () => {
            const dict3 = new Dictionary<number, string>();
            dict3.add(2, "zz");
            dict3.add(3, "ff");
            const result = dict1.intersect(dict3).toDictionary<number, string>();
            expect(result.isEmpty()).to.eq(true);
        });
    });

    describe("#isEmpty()", () => {
        it("should return true if dictionary is empty", () => {
            const dictionary = new Dictionary<number, string>();
            expect(dictionary.isEmpty()).to.eq(true);
        });
        it("should return false if dictionary is not empty", () => {
            const dictionary = new Dictionary<number, string>();
            dictionary.add(1, "a");
            expect(dictionary.isEmpty()).to.eq(false);
        });
    });

    describe("#join()", () => {
        const schoolDict = new Dictionary<number, School>();
        const studentDict = new Dictionary<number, Student>();
        schoolDict.add(1, new School(1, "Elementary School"));
        schoolDict.add(2, new School(2, "High School"));
        schoolDict.add(3, new School(3, "University"));
        schoolDict.add(5, new School(5, "Academy"));
        studentDict.add(100, new Student(100, "Desireé", "Moretti", 3));
        studentDict.add(200, new Student(200, "Apolline", "Bruyere", 2));
        studentDict.add(300, new Student(300, "Giselle", "García", 2));
        studentDict.add(400, new Student(400, "Priscilla", "Necci", 1));
        studentDict.add(500, new Student(500, "Lucrezia", "Volpe", 4));
        it("should join students and schools", () => {
            const joinedData = studentDict.join(schoolDict, st => st.value.schoolId, sc => sc.value.id,
                (student, school) => `${student.value.name} ${student.value.surname} :: ${school.value.name}`).toArray();
            const expectedOutput = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
            ];
            expect(joinedData.length).to.eq(4);
            expect(joinedData).to.deep.equal(expectedOutput);
        });
        it("should set null for school if left join is true and student's school is unknown", () => {
            const joinedData = studentDict.join(schoolDict, st => st.value.schoolId, sc => sc.value.id,
                (student, school) => [student, school],
                (stid, scid) => stid === scid, true);
            for (const jd of joinedData) {
                if ((jd[0].value as Student).surname === "Volpe") {
                    expect(jd[1]).to.eq(null);
                } else {
                    expect(jd[1]).to.not.eq(null);
                }
            }
        });
    });

    describe("#keys()", () => {
        it("should return a set containing keys", () => {
            const dictionary = new Dictionary<number, Person>();
            dictionary.add(Person.Alice.age, Person.Alice);
            dictionary.add(Person.Jane.age, Person.Jane);
            const keySet = dictionary.keys();
            expect(keySet.size()).to.eq(2);
            expect(keySet.contains(Person.Alice.age)).to.eq(true);
            expect(keySet.contains(Person.Jane.age)).to.eq(true);
            expect(keySet.Count).to.eq(2);
        });
    });

    describe("#last()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        it("should throw error if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(() => dict.last()).to.throw(ErrorMessages.NoElements);
        });
        it("should return the last element if no predicate is provided", () => {
            const last = dictionary.last();
            expect(last.key).to.eq(Person.Priscilla.name);
            expect(last.value.equals(Person.Priscilla)).to.be.true; // it isn't Noemi since dictionary is sorted due to RedBlackTree implementation
        });
        it("should throw an error if no matching element is found", () => {
            expect(() => dictionary.last(p => p.value.name === "Suzuha")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return a person with name 'Noemi' with age 29", () => {
            const last = dictionary.last(p => p.value.name === "Noemi");
            expect(last.value).to.eq(Person.Noemi);
            expect(last.value.age).to.eq(29);
        });
    });

    describe("#lastOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        it("should return null if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(dict.lastOrDefault()).to.eq(null);
        });
        it("should return the last element if no predicate is provided", () => {
            const last = dictionary.lastOrDefault();
            expect(last.key).to.eq(Person.Priscilla.name);
            expect(last.value.equals(Person.Priscilla)).to.be.true; // it isn't Noemi since dictionary is sorted due to RedBlackTree implementation
        });
        it("should return null if no matching element is found", () => {
            expect(dictionary.lastOrDefault(p => p.value.name === "Suzuha")).to.eq(null);
        });
        it("should return a person with name 'Noemi'", () => {
            const last = dictionary.lastOrDefault(p => p.value.name === "Noemi");
            expect(last.value).to.eq(Person.Noemi);
            expect(last.value.age).to.eq(29);
        });
    });

    describe("#max()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should select return the maximum age", () => {
            const max = dictionary.max(p => p.value.age);
            expect(max).to.eq(29);
        });
        it("should throw error if dictionary has no elements", () => {
            dictionary.clear();
            expect(() => dictionary.max()).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#min()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should select return the minimum age", () => {
            const max = dictionary.min(p => p.value.age);
            expect(max).to.eq(9);
        });
        it("should throw error if dictionary has no elements", () => {
            dictionary.clear();
            expect(() => dictionary.min()).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#orderBy()", () => {
        it("should order dictionary by key [asc]", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Priscilla.name, Person.Priscilla);
            dictionary.add(Person.Noemi.name, Person.Noemi);
            const orderedArray = dictionary.orderBy(p => p.key).toArray();
            const expectedResult = [
                new KeyValuePair<string, Person>(Person.Alice.name, Person.Alice),
                new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia),
                new KeyValuePair<string, Person>(Person.Noemi.name, Person.Noemi),
                new KeyValuePair<string, Person>(Person.Priscilla.name, Person.Priscilla)
            ];
            let index = 0;
            for (const item of orderedArray) {
                expect(item.key).to.eq(expectedResult[index].key);
                expect(item.value).to.eq(expectedResult[index].value);
                index++;
            }
        });
    });

    describe("#orderByDescending()", () => {
        it("should order dictionary by key [desc]", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Priscilla.name, Person.Priscilla);
            dictionary.add(Person.Noemi.name, Person.Noemi);
            const orderedArray = dictionary.orderByDescending(p => p.key).toArray();
            const expectedResult = [
                new KeyValuePair<string, Person>(Person.Priscilla.name, Person.Priscilla),
                new KeyValuePair<string, Person>(Person.Noemi.name, Person.Noemi),
                new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia),
                new KeyValuePair<string, Person>(Person.Alice.name, Person.Alice)
            ];
            let index = 0;
            for (const item of orderedArray) {
                expect(item.key).to.eq(expectedResult[index].key);
                expect(item.value).to.eq(expectedResult[index].value);
                index++;
            }
        });
    });

    describe("#prepend()", () => {
        it("should add item at the beginning", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Noemi.name, Person.Noemi);
            dictionary.add(Person.Priscilla.name, Person.Priscilla);
            const list = dictionary.prepend(new KeyValuePair<string, Person>(Person.Vanessa.name, Person.Vanessa)).toList();
            expect(list.size()).to.eq(5);
            expect(list.get(4)).to.not.null;
            expect(list.toArray()[0].key).eq(Person.Vanessa.name);
        });
    });

    describe("#remove()", () => {
        const dictionary = new Dictionary<Person, string>(personNameComparator);
        dictionary.add(Person.Jane, Person.Jane.name);
        dictionary.add(Person.Mel, Person.Mel.name);
        it("should remove the value from dictionary", () => {
            const value = dictionary.remove(Person.Mel);
            expect(dictionary.size()).to.eq(1);
            expect(dictionary.get(Person.Jane)).to.not.null;
            expect(dictionary.get(Person.Mel)).to.null;
            expect(value).to.eq(Person.Mel.name);
            expect(dictionary.Count).to.eq(1);
        });
        it("should return the value that is mapped to the given key", () => {
            const value = dictionary.remove(Person.Jane);
            expect(value).to.eq(Person.Jane.name);
            expect(dictionary.Count).to.eq(0);
        });
        it("should return null if key is not in the dictionary", () => {
            const value = dictionary.remove(Person.Senna);
            expect(value).to.null;
        });
    });

    describe("#reverse()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        it("should reverse the dictionary", () => {
            const dictArray = dictionary.reverse().toArray();
            expect(dictArray[dictArray.length - 1].key).to.eq(Person.Alice.name);
        });
    });

    describe("#select()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        it("should select keys of dictionary and surname value from values", () => {
            const result = dictionary.select(p => [p.key, p.value.surname]).toDictionary(p => p[0], p => p[1]);
            const expectedResult = [
                new KeyValuePair<string, string>(Person.Alice.name, Person.Alice.surname),
                new KeyValuePair<string, string>(Person.Lucrezia.name, Person.Lucrezia.surname),
                new KeyValuePair<string, string>(Person.Noemi.name, Person.Noemi.surname),
                new KeyValuePair<string, string>(Person.Priscilla.name, Person.Priscilla.surname)
            ];
            let index = 0;
            for (const person of result) {
                expect(person.equals(expectedResult[index])).to.eq(true);
                index++;
            }
        });
        it("should throw error if selector is undefined", () => {
            expect(() => dictionary.select(null).toList()).to.throw(ErrorMessages.NoSelectorProvided);
        });
    });

    describe("#selectMany()", () => {
        it("should throw error if selector is undefined", () => {
            const dictionary = new Dictionary<Person, string>();
            expect(() => dictionary.selectMany(null)).to.throw(ErrorMessages.NoSelectorProvided);
        });
        it("should return a flattened array of friends' ages", () => {
            const dictionary = new Dictionary<string, Person>();
            Person.Viola.friendsArray = [Person.Rebecca];
            Person.Jisu.friendsArray = [Person.Alice, Person.Megan];
            Person.Vanessa.friendsArray = [Person.Viola, Person.Lucrezia, Person.Reika];
            Person.Noemi.friendsArray = [Person.Megan, Person.Olga];
            dictionary.add(Person.Viola.name, Person.Viola);
            dictionary.add(Person.Jisu.name, Person.Jisu);
            dictionary.add(Person.Vanessa.name, Person.Vanessa);
            dictionary.add(Person.Noemi.name, Person.Noemi);
            const friendsAges = dictionary.selectMany(p => p.value.friendsArray).select(p => p.age).toArray();
            const expectedResult = [23, 44, 44, 77, 28, 21, 37, 17]; // Friends of Jisu -> Noemi -> Vanessa -> Viola (ordered by name because of RedBlackTree)
            expect(friendsAges).to.deep.equal(expectedResult);
        });
    });

    describe("#sequenceEqual()", () => {
        it("should return false for dictionaries with different sizes", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<number, string>();
            dict1.add(1, "a");
            dict2.add(1, "a");
            dict2.add(2, "b");
            expect(dict1.sequenceEqual(dict2)).to.eq(false);
        });
        it("should return true if dictionaries have members in the same order", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<number, string>();
            dict1.add(1, "a");
            dict1.add(2, "b");
            dict2.add(1, "a");
            dict2.add(2, "b");
            expect(dict1.sequenceEqual(dict2)).to.eq(true);
        });
        it("should return true if dictionaries have members in the same order", () => {
            const dict1 = new Dictionary<number, Person>();
            const dict2 = new Dictionary<number, Person>();
            dict1.add(1, Person.Alice);
            dict1.add(2, Person.Lucrezia);
            dict2.add(1, Person.Alice);
            dict2.add(2, Person.Lucrezia);
            expect(dict1.sequenceEqual(dict2, (p1, p2) => p1.value.name === p2.value.name)).to.eq(true);
        });
    });

    describe("#single", () => {
        it("should throw error if dictionary is empty", () => {
            const dict = new Dictionary();
            expect(() => dict.single()).to.throw(ErrorMessages.NoElements);
        });
        it("should throw error if dictionary has more than one elements and no predicate is provided", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "b");
            expect(() => dict.single()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return the only element in the dictionary", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            const single = dict.single();
            expect(single.equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
        });
        it("should throw error if no matching element is found", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Hanna.name, Person.Hanna);
            dict.add(Person.Noemi.name, Person.Noemi);
            expect(() => dict.single(p => p.key === "Lenka")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return person with name 'Priscilla'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const single = dict.single(p => p.key === "Priscilla");
            expect(single.key).eq(Person.Priscilla.name);
            expect(single.value).to.eq(Person.Priscilla);
        });
    });

    describe("#singleOrDefault", () => {
        it("should return null if dictionary is empty", () => {
            const dict = new Dictionary();
            expect(dict.singleOrDefault()).to.eq(null);
        });
        it("should throw error if dictionary has more than one elements and no predicate is provided", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "b");
            expect(() => dict.singleOrDefault()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        it("should return the only element in the dictionary", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            const single = dict.singleOrDefault();
            expect(single.equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
        });
        it("should throw error if there are more than one matching elements", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "a");
            expect(() => dict.singleOrDefault(p => p.value === "a")).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        it("should return null if no matching element is found", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Hanna.name, Person.Hanna);
            dict.add(Person.Noemi.name, Person.Noemi);
            expect(dict.singleOrDefault(p => p.key === "Lenka")).to.eq(null);
        });
        it("should return person with name 'Priscilla'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const single = dict.singleOrDefault(p => p.key === "Priscilla");
            expect(single.key).eq(Person.Priscilla.name);
            expect(single.value).to.eq(Person.Priscilla);
        });
    });

    describe("#size()", () => {
        const dictionary = new Dictionary<Person, string>(personNameComparator);
        dictionary.add(Person.Mel, Person.Mel.surname);
        dictionary.add(Person.Lenka, Person.Lenka.surname);
        dictionary.add(Person.Jane, Person.Jane.surname);
        it("should return the size of the dictionary()", () => {
            expect(dictionary.size()).to.eq(3);
        });
    });

    describe("#skip()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skip(2).select(p => [p.key, p.value.surname]).toArray();
            const expectedResult = [
                ["Priscilla", "Necci"],
                ["Vanessa", "Bloodboil"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skip(100).toDictionary();
            expect(people.size()).to.eq(0);
        });
    });

    describe("#skipLast()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skipLast(2).select(p => [p.key, p.value.surname]).toArray();
            const expectedResult = [
                ["Alice", "Rivermist"],
                ["Noemi", "Waterfox"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skipLast(100).toDictionary();
            expect(people.size()).to.eq(0);
        });
    });

    describe("#skipWhile()", () => {
        const dict = new Dictionary<number, Person>();
        dict.add(5000, Person.Alice);
        dict.add(2500, Person.Bella);
        dict.add(8000, Person.Eliza);
        dict.add(6500, Person.Hanna);
        dict.add(9000, Person.Emily);
        dict.add(4000, Person.Julia);
        dict.add(1500, Person.Megan);
        dict.add(5500, Person.Noemi);
        it("should throw error if predicate is null", () => {
            expect(() => dict.skipWhile(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return a dictionary with keys [8000, 9000]", () => {
            const dict2 = dict.skipWhile((p, px) => p.key <= 6500).toDictionary<number, Person>();
            const keys = dict2.select(p => p.key).toArray();
            expect(keys.length).to.eq(2);
            expect(keys).to.have.all.members([8000, 9000]);
        });
    });

    describe("#sum()", () => {
        const dict = new Dictionary<number, Person>();
        dict.add(5000, Person.Alice);
        dict.add(2500, Person.Bella);
        dict.add(9000, Person.Emily);
        dict.add(8000, Person.Eliza);
        it("should return ", () => {
            const sum = dict.sum(p => p.key);
            expect(sum).to.eq(24500);
        });
        it("should throw error if dictionary is empty", () => {
            dict.clear();
            expect(() => dict.sum()).to.throw(ErrorMessages.NoElements);
        });
    })

    describe("#take()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.take(2).select(p => [p.key, p.value.surname]).toArray();
            const expectedResult = [
                ["Alice", "Rivermist"],
                ["Noemi", "Waterfox"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.take(100).toDictionary();
            expect(people.size()).to.eq(4);
        });
    });

    describe("#takeLast()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.takeLast(2).select(p => [p.key, p.value.surname]).toArray();
            const expectedResult = [
                ["Priscilla", "Necci"],
                ["Vanessa", "Bloodboil"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.takeLast(100).toDictionary();
            expect(people.size()).to.eq(4);
        });
    });

    describe("#takeWhile()", () => {
        const dict = new Dictionary<string, number>();
        dict.add("apple", 1);
        dict.add("banana", 2);
        dict.add("mango", 3);
        dict.add("orange", 4);
        dict.add("plum", 5);
        dict.add("grape", 6);
        it("should throw error if predicate is null", () => {
            expect(() => dict.takeWhile(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return a dictionary with keys [apple, banana, mango, grape]", () => {
            const dict2 = dict.takeWhile(p => p.key.localeCompare("orange") !== 0).toDictionary<string, number>();
            expect(dict2.size()).to.eq(4);
            const fruits = dict2.select(p => p.key).toArray();
            expect(fruits).to.deep.equal(["apple", "banana", "grape", "mango"]);
        });
    });

    describe("#thenBy()", () => {
        it("should order people by age [asc] then by name [desc] then by surname [asc]", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, Person.Bella);
            dict.add(2, Person.Amy);
            dict.add(3, Person.Emily);
            dict.add(4, Person.Eliza);
            dict.add(5, Person.Hanna);
            dict.add(6, Person.Hanna2);
            dict.add(7, Person.Suzuha3);
            dict.add(8, Person.Julia);
            dict.add(9, Person.Lucrezia);
            dict.add(10, Person.Megan);
            dict.add(11, Person.Noemi);
            dict.add(12, Person.Olga);
            dict.add(13, Person.Priscilla);
            dict.add(14, Person.Reika);
            dict.add(15, Person.Suzuha);
            dict.add(16, Person.Suzuha2);
            dict.add(17, Person.Noemi2);
            const orderedPeople = dict.orderBy(p => p.value.age)
                .thenBy(p => p.value.name, (n1, n2) => n1.localeCompare(n2))
                .thenBy(p => p.value.surname).toArray();
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
            for (const p of orderedPeople) {
                const personStr = `[${p.value.age}] :: ${p.value.name} ${p.value.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, Person.Bella);
            dict.add(2, Person.Amy);
            dict.add(3, Person.Emily);
            dict.add(4, Person.Eliza);
            dict.add(5, Person.Hanna);
            dict.add(6, Person.Hanna2);
            dict.add(7, Person.Suzuha3);
            dict.add(8, Person.Julia);
            dict.add(9, Person.Lucrezia);
            dict.add(10, Person.Megan);
            dict.add(11, Person.Noemi);
            dict.add(12, Person.Olga);
            dict.add(13, Person.Priscilla);
            dict.add(14, Person.Reika);
            dict.add(15, Person.Suzuha);
            dict.add(16, Person.Suzuha2);
            dict.add(17, Person.Noemi2);
            const orderedPeople = dict.orderBy(p => p.value.age)
                .thenBy(p => p.value.name, (n1, n2) => n1.localeCompare(n2))
                .thenByDescending(p => p.value.surname)
                .orderBy(p => p.value.age)
                .thenBy(p => p.value.age).toArray();
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
            for (const p of orderedPeople) {
                const personStr = `[${p.value.age}] :: ${p.value.name} ${p.value.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });

    describe("#thenByDescending()", () => {
        it("should order people by age [desc] then by name [desc] then by surname [asc]", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, Person.Bella);
            dict.add(2, Person.Amy);
            dict.add(3, Person.Emily);
            dict.add(4, Person.Eliza);
            dict.add(5, Person.Hanna);
            dict.add(6, Person.Hanna2);
            dict.add(7, Person.Suzuha3);
            dict.add(8, Person.Julia);
            dict.add(9, Person.Lucrezia);
            dict.add(10, Person.Megan);
            dict.add(11, Person.Noemi);
            dict.add(12, Person.Olga);
            dict.add(13, Person.Priscilla);
            dict.add(14, Person.Reika);
            dict.add(15, Person.Suzuha);
            dict.add(16, Person.Suzuha2);
            dict.add(17, Person.Noemi2);
            const orderedPeople = dict.orderByDescending(p => p.value.age)
                .thenByDescending(p => p.value.name, (n1, n2) => n1.localeCompare(n2))
                .thenByDescending(p => p.value.surname).toArray();
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
            for (const p of orderedPeople) {
                const personStr = `[${p.value.age}] :: ${p.value.name} ${p.value.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, Person.Bella);
            dict.add(2, Person.Amy);
            dict.add(3, Person.Emily);
            dict.add(4, Person.Eliza);
            dict.add(5, Person.Hanna);
            dict.add(6, Person.Hanna2);
            dict.add(7, Person.Suzuha3);
            dict.add(8, Person.Julia);
            dict.add(9, Person.Lucrezia);
            dict.add(10, Person.Megan);
            dict.add(11, Person.Noemi);
            dict.add(12, Person.Olga);
            dict.add(13, Person.Priscilla);
            dict.add(14, Person.Reika);
            dict.add(15, Person.Suzuha);
            dict.add(16, Person.Suzuha2);
            dict.add(17, Person.Noemi2);
            const orderedPeople = dict.orderByDescending(p => p.value.age)
                .thenByDescending(p => p.value.name, (n1, n2) => n1.localeCompare(n2))
                .thenByDescending(p => p.value.surname)
                .orderBy(p => p.value.age)
                .thenBy(p => p.value.name).toArray();
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
            for (const p of orderedPeople) {
                const personStr = `[${p.value.age}] :: ${p.value.name} ${p.value.surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });

    describe("#toArray()", () => {
        const dict = new Dictionary<string, Person>();
        dict.add(Person.Lucrezia.name, Person.Lucrezia);
        dict.add(Person.Vanessa.name, Person.Vanessa);
        dict.add(Person.Alice.name, Person.Alice);
        const people = dict.toArray();
        it("should have the same size as dictionary", () => {
            expect(dict.size()).to.eq(people.length);
        });
        it("should have the same order as dictionary", () => { // ordered due to RedBlackTree
            expect(people[0].value).to.eq(Person.Alice);
            expect(people[1].value).to.eq(Person.Lucrezia);
            expect(people[2].value).to.eq(Person.Vanessa);
        });
    });

    describe("#toDictionary()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const dict2 = dictionary.toDictionary(p => p.value, p => p.key);
        it("should create a new dictionary", () => {
            expect(dict2.size()).to.eq(dictionary.size());
            expect(dict2.get("a")).to.not.null;
            expect(dict2.get("b")).to.not.null;
            expect(dict2.Count).to.eq(dictionary.Count);
        });
    });

    describe("#toList()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const list = dictionary.toList();
        it("should create a new KeyValuePair list", () => {
            expect(list.size()).to.eq(dictionary.size());
            expect(list.get(0).equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
            expect(list.get(1).equals(new KeyValuePair<number, string>(2, "b"))).to.eq(true);
            expect(list instanceof List).to.be.true;
            expect(list.Count).to.eq(dictionary.Count);
        });
    });

    describe("#tryAdd()", () => {
        const dictionary = new Dictionary<Person, string>(personNameComparator);
        dictionary.add(Person.Alice, Person.Alice.name);
        dictionary.add(Person.Hanna, Person.Hanna.name);
        it("should not throw if key already exists", () => {
            expect(() => dictionary.add(Person.Alice, "Alicia")).to.throw(ErrorMessages.KeyAlreadyAdded);
            expect(() => dictionary.tryAdd(Person.Alice, "Alicia")).to.not.throw;
        });
        it("should return true if key doesn't exist and item is added", () => {
            expect(dictionary.tryAdd(Person.Suzuha, Person.Suzuha.name)).to.eq(true);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.Count).to.eq(3);
        });
        it("should return true if key already exists and item is not added", () => {
            expect(dictionary.tryAdd(Person.Alice, Person.Alice.name)).to.eq(false);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.Count).to.eq(3);
        });
        it("should throw error if key is null", () => {
            expect(() => dictionary.tryAdd(null, Person.Karen.name)).to.throw(ErrorMessages.NullKey);
        });
    });

    describe("#union()", () => {
        const dict1 = new Dictionary<number, string>();
        const dict2 = new Dictionary<number, string>();
        const dict3 = new Dictionary<number, string>();
        dict1.add(1, "a");
        dict1.add(2, "b");
        dict1.add(3, "c");
        dict1.add(4, "d");

        dict2.add(5, "e");
        dict2.add(2, "b");

        dict3.add(6, "f");
        dict3.add(2, "g");
        it("should return a dictionary with unique key value pairs", () => {
            const union1 = dict1.union(dict2).toDictionary<number, string>();
            expect(union1.size()).to.eq(5);
        });

        it("should throw error if key already exists and key value pairs are not equal", () => {
            expect(() => dict1.union(dict3)).to.throw;
        });
    });

    describe("#values()", () => {
        const dictionary = new Dictionary<number, Person>();
        dictionary.add(Person.Senna.age, Person.Senna);
        dictionary.add(Person.Alice.age, Person.Alice);
        dictionary.add(Person.Mel.age, Person.Mel);
        dictionary.add(Person.Lenka.age, Person.Lenka);
        it("should return a list with mapped values", () => {
            const values = dictionary.values().toArray();
            expect(values).to.deep.equal([Person.Mel, Person.Senna, Person.Lenka, Person.Alice]); // sorted by age due to RedBlackTree
            expect(dictionary.values().Count).to.eq(4);
        });
    });

    describe("#where()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        it("should throw error if predicate is undefined", () => {
            expect(() => dictionary.where(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return a dictionary with people who are younger than 10", () => {
            const dict = dictionary.where(p => p.value.age < 10).toDictionary<string, Person>();
            expect(dict.size()).to.eq(1);
            expect(dict.get(Person.Alice.name)).to.null;
            expect(dict.get(Person.Lucrezia.name)).to.null;
            expect(dict.get(Person.Noemi.name)).to.null;
            expect(dict.get(Person.Priscilla.name)).to.not.null;
            expect(dict.Count).to.eq(1);
        });
    });

    describe("#zip()", () => {
        it("should return array of key value pair tuples if predicate is null", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<number, string>();
            dict1.add(1, "a");
            dict1.add(2, "b");
            dict1.add(3, "c");
            dict1.add(4, "d");

            dict2.add(5, "e");
            dict2.add(2, "FF");
            const result = dict1.zip(dict2).toArray();
            const expectedResult = [
                [new KeyValuePair<number, string>(1, "a"), new KeyValuePair<number, string>(2, "FF")],
                [new KeyValuePair<number, string>(2, "b"), new KeyValuePair<number, string>(5, "e")]
            ];
            expect(expectedResult.length).to.eq(result.length);
            for (let ix = 0; ix < result.length; ++ix) {
                expect(result[ix][0].equals(expectedResult[ix][0])).to.eq(true);
                expect(result[ix][1].equals(expectedResult[ix][1])).to.eq(true);
            }
        });
        it("should return a zipped list with size of 2", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<string, number>();
            dict1.add(1, "one");
            dict1.add(2, "two");
            dict1.add(3, "three");
            dict2.add("one", 1);
            dict2.add("two", 2);
            dict2.add("three", 3);
            const result = dict1.zip(dict2, (p1, p2) => `${p2.key} ${p1.value}`).toList();
            expect(result.size()).to.eq(3);
            expect(result.get(0)).to.eq("one one");
            expect(result.get(1)).to.eq("three two");
            expect(result.get(2)).to.eq("two three");
        });
    });
});
