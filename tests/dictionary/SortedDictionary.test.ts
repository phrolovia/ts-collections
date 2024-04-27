import { KeyValuePair } from "../../src/dictionary/KeyValuePair";
import { SortedDictionary } from "../../src/dictionary/SortedDictionary";
import { Enumerable, List } from "../../src/imports";
import { EqualityComparator } from "../../src/shared/EqualityComparator";
import { ErrorMessages } from "../../src/shared/ErrorMessages";
import { Helper } from "../helpers/Helper";
import { Person } from "../models/Person";
import { School } from "../models/School";
import { SchoolStudents } from "../models/SchoolStudents";
import { Student } from "../models/Student";

describe("SortedDictionary", () => {

    const personAgeComparator = (p1: Person, p2: Person) => p1.age - p2.age;
    const personNameComparator = (p1: Person, p2: Person) => p1.name.localeCompare(p2.name);
    const personSurnameComparator = (p1: Person, p2: Person) => p1.surname.localeCompare(p2.surname);

    describe("#add()", () => {
        const dictionary = new SortedDictionary<string, number>();
        dictionary.add("Amber", 1162621);
        dictionary.add("Barbara", 212121211);
        dictionary.add("Noelle", 1718615156);
        test("should add values into the dictionary", () => {
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.get("Amber")).to.not.undefined;
            expect(dictionary.get("Amber")).to.eq(1162621);
            expect(dictionary.get("Barbara")).to.not.undefined;
            expect(dictionary.get("Barbara")).to.eq(212121211);
            expect(dictionary.get("Noelle")).to.not.undefined;
            expect(dictionary.get("Noelle")).to.eq(1718615156);
            expect(dictionary.length).to.eq(3);
        });
        test("should throw error if key already exists", () => {
            expect(() => dictionary.add("Amber", 1)).to.throw();
        });
    });

    describe("#aggregate()", () => {
        const dictionary = new SortedDictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        dictionary.add(3, "c");
        dictionary.add(4, "d");
        dictionary.add(5, "e");
        test("should return the sum of keys", () => {
            const result = dictionary.aggregate((total, next) => total + next.key, 0);
            expect(result).to.eq(15);
            dictionary.remove(5);
            const result2 = dictionary.aggregate((total, next) => total + next.key, 0);
            expect(result2).to.eq(10);
        });
        test("should return the seed if dictionary is empty", () => {
            dictionary.clear();
            const result = dictionary.aggregate((total, next) => total + next.key, 99);
            expect(result).to.eq(99);
        });
        test("should throw error if dictionary is empty and no seed is provided", () => {
            expect(() => dictionary.aggregate<number>((total, next) => total + next.key)).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#all()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should not have any person who is older than 29", () => {
            const all = dictionary.all(p => p.value.age > 29);
            expect(all).to.eq(false);
        });
    });

    describe("#any()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should have a person with age 29", () => {
            const any = dictionary.any(p => p.value.age === 29);
            expect(any).to.eq(true);
        });
        test("should return true if no predicate is provided and dictionary is not empty", () => {
            expect(dictionary.any()).to.eq(true);
        });
        test("should return false if no predicate is provided and dictionary is empty", () => {
            dictionary.clear();
            expect(dictionary.any()).to.eq(false);
        });
    });

    describe("#append()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should append the new element and return a new dictionary", () => {
            const dict2 = dictionary.append(new KeyValuePair<string, Person>(Person.Reina.name, Person.Reina)).toSortedDictionary(p => p.key, p => p.value);
            expect(dict2.get("Reina")).to.not.null;
            expect(dict2.get("Reina")).to.eq(Person.Reina);
            expect(dict2.size()).to.eq(5);
            expect(dictionary.size()).to.eq(4);
            expect(dictionary.get("Reina")).to.null;
            expect(dict2 === dictionary).to.eq(false);
            expect(dict2.length).to.eq(5);
        });
    });

    describe("#average()", () => {
        const dict = new SortedDictionary<string, number>();
        dict.add("A", 1);
        dict.add("B", 101);
        test("should return 51", () => {
            const avg = dict.average(p => p.value);
            expect(avg).to.eq(51);
        });
        test("should throw error if dictionary is empty", () => {
            dict.clear();
            expect(() => dict.average(p => p.value)).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#chunk()", () => {
        test("should split list into chunks of size 10", () => {
            const dictionary = Enumerable.range(1, 100).toSortedDictionary(n => n, n => n * n);
            for (const chunk of dictionary.chunk(10)) {
                expect(chunk.count() === 10).to.be.true;
            }
        });
        test("should splits enumerable into chunks of size 7 at max", () => {
            const enumerable = Enumerable.range(1, 79);
            for (const chunk of enumerable.toSortedDictionary(n => n, n => n * 2).chunk(7)) {
                expect(chunk.count() <= 7).to.be.true;
            }
        });
        test("should throw error if chunk size is 0", () => {
            const dictionary = Enumerable.range(1, 100).toSortedDictionary(n => n, n => n * n);
            expect(() => dictionary.chunk(0)).to.throw(ErrorMessages.InvalidChunkSize);
        });
    });

    describe("#clear()", () => {
        test("should remove all elements from the dictionary", () => {
            const dictionary = new SortedDictionary<string, number>();
            dictionary.add("a", 1);
            dictionary.add("b", 2);
            dictionary.clear();
            expect(dictionary.size()).to.eq(0);
            expect(dictionary.get("a")).to.null;
            expect(dictionary.get("b")).to.null;
            expect(dictionary.length).to.eq(0);
        });
    });

    describe("#concat()", () => {
        const dictionary1 = new SortedDictionary<string, Person>();
        dictionary1.add(Person.Alice.name, Person.Alice);
        dictionary1.add(Person.Lucrezia.name, Person.Lucrezia);
        const dictionary2 = new SortedDictionary<string, Person>();
        dictionary2.add(Person.Noemi.name, Person.Noemi);
        dictionary2.add(Person.Priscilla.name, Person.Priscilla);
        test("should return a dictionary which contains four people", () => {
            const dict = dictionary1.concat(dictionary2).toSortedDictionary(p => p.key, p => p.value);
            expect(dict.size()).to.eq(4);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Noemi")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.get("Priscilla")).to.not.null;
            expect(dict.length).to.eq(4);
        });
    });

    describe("#contains()", () => {
        const personComparator: EqualityComparator<KeyValuePair<string, Person>>
            = (p1, p2) => p1.value.name === p2.value.name;
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should contain 'Noemi'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Noemi.name, Person.Noemi), personComparator)).to.eq(true);
        });
        test("should contain 'Lucrezia'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia), personComparator)).to.eq(true);
        });
        test("should not contain 'Olga'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Olga.name, Person.Olga), personComparator)).to.eq(false);
        });
        test("should return false", () => {
            const dict = new SortedDictionary<any, any>();
            const key1 = {a: 1};
            dict.add(key1, 1);
            expect(dict.containsKey(key1)).to.eq(true);
            expect(dict.contains(1 as any)).to.eq(false);
            const dict2 = new SortedDictionary<any, any>();
            dict2.add(1, 1);
            expect(dict2.contains(key1 as any)).to.eq(false);
        });
    });

    describe("#containsKey()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should return true", () => {
            expect(dictionary.containsKey(Person.Noemi.name)).to.eq(true);
        });
        test("should return false", () => {
            expect(dictionary.containsKey(Person.Viola.name)).to.eq(false);
        });
    });

    describe("#containsValue()", () => {
        const personComparator = (p1: Person, p2: Person) => p1.equals(p2);
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should return true", () => {
            expect(dictionary.containsValue(Person.Noemi)).to.eq(true);
        });
        test("should return false", () => {
            expect(dictionary.containsValue(Person.Noemi2, personComparator)).to.eq(false);
        });
    });

    describe("#count()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should return 4", () => {
            expect(dictionary.count()).to.eq(4);
        });
        test("should return 3", () => {
            const count = dictionary.count(p => p.value.age > 9);
            expect(count).to.eq(3);
        });
        test("should return 0", () => {
            dictionary.clear();
            expect(dictionary.count()).to.eq(0);
        });
    });

    describe("#defaultIfEmpty()", () => {
        test("should return a new IEnumerable with the default value", () => {
            const dictionary = new SortedDictionary<string, Person>();
            const dict = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(Person.Alice.name, Person.Alice)).toSortedDictionary<string, Person>(p => p!.key, p => p!.value);
            const single = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia)).single() as KeyValuePair<string, Person>;
            expect(dict instanceof SortedDictionary).to.eq(true);
            expect(dict.size()).to.eq(1);
            expect(dict.get(Person.Alice.name)).to.not.null;
            expect(single.value).to.eq(Person.Lucrezia);
            expect(dict.length).to.eq(1);
        });
    });

    describe("#distinct()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        test("should return a new dictionary which is identical to the source dictionary", () => {
            const dict = dictionary.distinct(e => e.key).toSortedDictionary<string, Person>(p => p.key, p => p.value);
            expect(dict === dictionary).to.eq(false);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.length).to.eq(dictionary.size());
            // console.log("distinct operation on a dictionary has no effect since dictionary is innately distinct.");
        });
    });

    describe("#elementAt()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Suzuha.name, Person.Suzuha);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        test("should return 'Lucrezia'", () => {
            const person = dictionary.elementAt(1);
            expect(person.value).to.eq(Person.Lucrezia);
        });
        test("should return 'Suzuha'", () => { // It's a sorted dictionary, so it should be the last element
            const person = dictionary.elementAt(2);
            expect(person.value).to.eq(Person.Suzuha);
        });
        test("should throw error if index is out of bounds", () => {
            expect(() => dictionary.elementAt(100)).to.throw();
            expect(() => dictionary.elementAt(-1)).to.throw();
        });
    });

    describe("#elementAtOrDefault()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        test("should return 'Lucrezia'", () => {
            const person = dictionary.elementAtOrDefault(1) as KeyValuePair<string, Person>;
            expect(person.value).to.eq(Person.Lucrezia);
        });
        test("should return null if index is out of bounds", () => {
            expect(dictionary.elementAtOrDefault(100)).to.eq(null);
            expect(dictionary.elementAtOrDefault(-1)).to.eq(null);
        });
    });

    describe("#entries()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Alice.name, Person.Alice);
        let index = 0;
        test("should return an IterableIterator with key-value tuple", () => {
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
        const dict1 = new SortedDictionary<number, string>();
        const dict2 = new SortedDictionary<number, string>();
        dict1.add(1, "a");
        dict1.add(2, "b");
        dict1.add(3, "c");
        dict1.add(4, "d");
        dict2.add(5, "e");
        dict2.add(2, "b");
        test("should return a new dictionary with the elements unique to first dictionary", () => {
            const result = dict1.except(dict2).toSortedDictionary<number, string>(p => p.key, p => p.value);
            expect(result.size()).to.eq(3);
            expect(result.get(1)).to.not.null;
            expect(result.get(3)).to.not.null;
            expect(result.get(4)).to.not.null;
            expect(result.get(2)).to.null;
        });
    });

    describe("#first()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should throw error if dictionary is empty()", () => {
            const dict = new SortedDictionary<number, number>();
            expect(() => dict.first()).to.throw(ErrorMessages.NoElements);
        });
        test("should return the first element if no predicate is provided", () => {
            const first = dictionary.first();
            expect(first.key).to.eq(Person.Alice.name);
            expect(first.value.equals(Person.Alice)).to.be.true;
        });
        test("should throw an error if no matching element is found", () => {
            expect(() => dictionary.first(p => p.value.name === "Suzuha")).to.throw(ErrorMessages.NoMatchingElement);
        });
        test("should return a person with name 'Noemi'", () => {
            const first = dictionary.first(p => p.value.name === "Noemi");
            expect(first.value).to.eq(Person.Noemi);
        });
    });

    describe("#firstOrDefault()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should return null if dictionary is empty()", () => {
            const dict = new SortedDictionary<number, number>();
            expect(dict.firstOrDefault()).to.eq(null);
        });
        test("should return the first element if no predicate is provided", () => {
            const first = dictionary.firstOrDefault() as KeyValuePair<string, Person>;
            expect(first.key).to.eq(Person.Alice.name);
            expect(first.value.equals(Person.Alice)).to.be.true;
        });
        test("should return null if no matching element is found", () => {
            expect(dictionary.firstOrDefault(p => p.value.name === "Suzuha")).to.eq(null);
        });
        test("should return a person with name 'Noemi'", () => {
            const first = dictionary.firstOrDefault(p => p.value.name === "Noemi") as KeyValuePair<string, Person>;
            expect(first.value).to.eq(Person.Noemi);
        });
    });

    describe("#forEach()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should loop over the dictionary", () => {
            const names: string[] = [];
            dictionary.forEach(pair => names.push(pair.value.name));
            expect(names).to.deep.equal([Person.Alice.name, Person.Lucrezia.name, Person.Noemi.name, Person.Priscilla.name]);
        });
    });

    describe("#get()", () => {
        const dictionary = new SortedDictionary<Person, number>([], personNameComparator);
        test("should get the value which belongs to the given key", () => {
            dictionary.add(Person.Alice, Person.Alice.age);
            dictionary.add(Person.Mel, Person.Mel.age);
            dictionary.add(Person.Senna, Person.Senna.age);
            expect(dictionary.get(Person.Alice)).to.eq(Person.Alice.age);
            expect(dictionary.get(Person.Mel)).to.eq(Person.Mel.age);
            expect(dictionary.get(Person.Senna)).to.eq(Person.Senna.age);
        });
        test("should get the value which belongs to the given key #2", () => {
            const numbers = Helper.generateRandomUniqueNumbers(500000);
            const dict = new SortedDictionary<number, string>();
            numbers.forEach(n => dict.add(n, n.toString()));
            for (const num of numbers) {
                expect(dict.get(num)).to.eq(num.toString());
            }
        }, {timeout: 15000});
        test("should return null if key is not in the dictionary", () => {
            expect(dictionary.get(Person.Jane)).to.be.null;
        });
    });

    describe("#groupBy()", () => {
        const dict = new SortedDictionary<string, Person>();
        dict.add(Person.Alice.name, Person.Alice);
        dict.add(Person.Mel.name, Person.Mel);
        dict.add(Person.Senna.name, Person.Senna);
        dict.add(Person.Lenka.name, Person.Lenka);
        dict.add(Person.Jane.name, Person.Jane);
        dict.add(Person.Kaori.name, Person.Kaori);
        dict.add(Person.Reina.name, Person.Reina);
        test("should group people by age", () => {
            const group = dict.groupBy(p => p.value.age).toSortedDictionary(g => g.key, g => g);
            const ages: number[] = [];
            const groupedAges: Record<number, number[]> = {};
            for (const ageGroup of group.values()) {
                ages.push(ageGroup.key);
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
        const schoolDict = new SortedDictionary<number, School>();
        const studentDict = new SortedDictionary<number, Student>();
        schoolDict.add(1, new School(1, "Elementary School"));
        schoolDict.add(2, new School(2, "High School"));
        schoolDict.add(3, new School(3, "University"));
        schoolDict.add(5, new School(5, "Academy"));
        studentDict.add(100, new Student(100, "Desireé", "Moretti", 3));
        studentDict.add(200, new Student(200, "Apolline", "Bruyere", 2));
        studentDict.add(300, new Student(300, "Giselle", "García", 2));
        studentDict.add(400, new Student(400, "Priscilla", "Necci", 1));
        studentDict.add(500, new Student(500, "Lucrezia", "Volpe", 4));
        test("should join and group by school id", () => {
            const joinedData = schoolDict.groupJoin(studentDict, sc => sc.value.id, st => st.value.schoolId,
                (schoolPair, students) => {
                    return new SchoolStudents(schoolPair.key, students?.select(s => s.value).toList() ?? new List<Student>());
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
        const dict1 = new SortedDictionary<number, string>();
        const dict2 = new SortedDictionary<number, string>();
        dict1.add(1, "a");
        dict1.add(2, "b");
        dict1.add(3, "c");
        dict2.add(4, "d");
        dict2.add(2, "b");
        test("should return a dictionary consisting of equal KeyValuePairs", () => {
            const result = dict1.intersect(dict2).toSortedDictionary<number, string>(p => p.key, p => p.value);
            expect(result.size()).to.eq(1);
            expect(result.get(2)).to.eq("b");
            expect(result.get(1)).to.null;
            expect(result.get(3)).to.null;
            expect(result.get(4)).to.null;
        });
        test("should return an empty dictionary", () => {
            const dict3 = new SortedDictionary<number, string>();
            dict3.add(2, "zz");
            dict3.add(3, "ff");
            const result = dict1.intersect(dict3).toSortedDictionary<number, string>(p => p.key, p => p.value);
            expect(result.isEmpty()).to.eq(true);
        });
    });

    describe("#isEmpty()", () => {
        test("should return true if dictionary is empty", () => {
            const dictionary = new SortedDictionary<number, string>();
            expect(dictionary.isEmpty()).to.eq(true);
        });
        test("should return false if dictionary is not empty", () => {
            const dictionary = new SortedDictionary<number, string>();
            dictionary.add(1, "a");
            expect(dictionary.isEmpty()).to.eq(false);
        });
    });

    describe("#join()", () => {
        const schoolDict = new SortedDictionary<number, School>();
        const studentDict = new SortedDictionary<number, Student>();
        schoolDict.add(1, new School(1, "Elementary School"));
        schoolDict.add(2, new School(2, "High School"));
        schoolDict.add(3, new School(3, "University"));
        schoolDict.add(5, new School(5, "Academy"));
        studentDict.add(100, new Student(100, "Desireé", "Moretti", 3));
        studentDict.add(200, new Student(200, "Apolline", "Bruyere", 2));
        studentDict.add(300, new Student(300, "Giselle", "García", 2));
        studentDict.add(400, new Student(400, "Priscilla", "Necci", 1));
        studentDict.add(500, new Student(500, "Lucrezia", "Volpe", 4));
        test("should join students and schools", () => {
            const joinedData = studentDict.join(schoolDict, st => st.value.schoolId, sc => sc.value.id,
                (student, school) => `${student.value.name} ${student.value.surname} :: ${school?.value.name}`).toArray();
            const expectedOutput = [
                "Desireé Moretti :: University",
                "Apolline Bruyere :: High School",
                "Giselle García :: High School",
                "Priscilla Necci :: Elementary School"
            ];
            expect(joinedData.length).to.eq(4);
            expect(joinedData).to.deep.equal(expectedOutput);
        });
        test("should set null for school if left join is true and student's school is unknown", () => {
            const joinedData = studentDict.join(schoolDict, st => st.value.schoolId, sc => sc.value.id,
                (student, school) => [student, school],
                (stid, scid) => stid === scid, true);
            for (const jd of joinedData) {
                if ((jd[0]?.value as Student).surname === "Volpe") {
                    expect(jd[1]).to.eq(null);
                } else {
                    expect(jd[1]).to.not.eq(null);
                }
            }
        });
    });

    describe("#keys()", () => {
        test("should return a set containing keys", () => {
            const dictionary = new SortedDictionary<string, Person>();
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Jane.name, Person.Jane);
            dictionary.add(Person.Amy.name, Person.Amy);
            const keySet = dictionary.keys();
            expect(keySet.size()).to.eq(3);
            expect(keySet.length).to.eq(3);
            expect(keySet.toArray()).to.deep.equal(["Alice", "Amy", "Jane"]);
        });
    });

    describe("#last()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should throw error if dictionary is empty()", () => {
            const dict = new SortedDictionary<number, number>();
            expect(() => dict.last()).to.throw(ErrorMessages.NoElements);
        });
        test("should return the last element if no predicate is provided", () => {
            const last = dictionary.last();
            expect(last.key).to.eq(Person.Priscilla.name);
            expect(last.value.equals(Person.Priscilla)).to.be.true; // it isn't Noemi since dictionary is sorted due to RedBlackTree implementation
        });
        test("should throw an error if no matching element is found", () => {
            expect(() => dictionary.last(p => p.value.name === "Suzuha")).to.throw(ErrorMessages.NoMatchingElement);
        });
        test("should return a person with name 'Noemi' with age 29", () => {
            const last = dictionary.last(p => p.value.name === "Noemi");
            expect(last.value).to.eq(Person.Noemi);
            expect(last.value.age).to.eq(29);
        });
    });

    describe("#lastOrDefault()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should return null if dictionary is empty()", () => {
            const dict = new SortedDictionary<number, number>();
            expect(dict.lastOrDefault()).to.eq(null);
        });
        test("should return the last element if no predicate is provided", () => {
            const last = dictionary.lastOrDefault() as KeyValuePair<string, Person>;
            expect(last.key).to.eq(Person.Priscilla.name);
            expect(last.value.equals(Person.Priscilla)).to.be.true; // it isn't Noemi since dictionary is sorted due to RedBlackTree implementation
        });
        test("should return null if no matching element is found", () => {
            expect(dictionary.lastOrDefault(p => p.value.name === "Suzuha")).to.eq(null);
        });
        test("should return a person with name 'Noemi'", () => {
            const last = dictionary.lastOrDefault(p => p.value.name === "Noemi") as KeyValuePair<string, Person>;
            expect(last.value).to.eq(Person.Noemi);
            expect(last.value.age).to.eq(29);
        });
    });

    describe("#max()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should select return the maximum age", () => {
            const max = dictionary.max(p => p.value.age);
            expect(max).to.eq(29);
        });
        test("should throw error if dictionary has no elements", () => {
            dictionary.clear();
            expect(() => dictionary.max()).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#min()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should select return the minimum age", () => {
            const max = dictionary.min(p => p.value.age);
            expect(max).to.eq(9);
        });
        test("should throw error if dictionary has no elements", () => {
            dictionary.clear();
            expect(() => dictionary.min()).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#orderBy()", () => {
        test("should order dictionary by key [asc]", () => {
            const dictionary = new SortedDictionary<string, Person>();
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
        test("should order dictionary by key [desc]", () => {
            const dictionary = new SortedDictionary<string, Person>();
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

    describe("#pairwise()", () => {
        test("should return an array of pairs", () => {
            const dictionary = new SortedDictionary<string, Person>();
            dictionary.add(Person.Noemi.name, Person.Noemi);
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Priscilla.name, Person.Priscilla);
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Eliza.name, Person.Eliza);
            dictionary.add(Person.Suzuha.name, Person.Suzuha);
            const pairs = dictionary.pairwise().toArray();
            const tuples = [];
            for (const pair of pairs) {
                const [p1, p2] = pair;
                tuples.push([p1.key, p2.value.surname]);
            }
            const expectedResult = [ // values are sorted due to sorted dictionary
                ["Alice", "Jackson"],
                ["Eliza", "Volpe"],
                ["Lucrezia", "Waterfox"],
                ["Noemi", "Necci"],
                ["Priscilla", "Suzuki"]
            ];
            expect(tuples).to.deep.eq(expectedResult);
        });
    });

    describe("#prepend()", () => {
        test("should add item at the beginning", () => {
            const dictionary = new SortedDictionary<string, Person>();
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

    describe("#put()", () => {
        const dict = new SortedDictionary<number, number>();
        dict.add(9, 80);
        test("should add an item if key does not exists", () => {
            dict.put(4, 16);
            expect(dict.length).to.eq(2);
            expect(dict.size()).to.eq(2);
        });
        test("should not throw an error if the key already exists", () => {
            expect(() => dict.put(4, 1616)).to.not.throw;
        });
        test("should update an item if the key already exists", () => {
            dict.put(9, 81);
            expect(dict.size()).to.eq(2);
            expect(dict.get(9)).to.eq(81);
        });
        test("should return null if the key added (and not updated)", () => {
            const oldValue = dict.put(8, 64);
            expect(oldValue).to.be.null;
        });
        test("should return the old value if the key is updated (and not added)", () => {
            const oldValue = dict.put(8, 88);
            expect(oldValue).to.eq(64);
        });
    });

    describe("#remove()", () => {
        const dictionary = new SortedDictionary<Person, string>([], personNameComparator);
        dictionary.add(Person.Jane, Person.Jane.name);
        dictionary.add(Person.Mel, Person.Mel.name);
        test("should remove the value from dictionary", () => {
            const value = dictionary.remove(Person.Mel);
            expect(dictionary.size()).to.eq(1);
            expect(dictionary.get(Person.Jane)).to.not.null;
            expect(dictionary.get(Person.Mel)).to.null;
            expect(value).to.eq(Person.Mel.name);
            expect(dictionary.length).to.eq(1);
        });
        test("should return the value that is mapped to the given key", () => {
            const value = dictionary.remove(Person.Jane);
            expect(value).to.eq(Person.Jane.name);
            expect(dictionary.length).to.eq(0);
        });
        test("should return null if key is not in the dictionary", () => {
            const value = dictionary.remove(Person.Senna);
            expect(value).to.null;
        });
    });

    describe("#reverse()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should reverse the dictionary", () => {
            const dictArray = dictionary.reverse().toArray();
            expect(dictArray[dictArray.length - 1].key).to.eq(Person.Alice.name);
        });
    });

    describe("#select()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should select keys of dictionary and surname value from values", () => {
            const result = dictionary.select(p => [p.key, p.value.surname]).toSortedDictionary(p => p[0], p => p[1]);
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
    });

    describe("#selectMany()", () => {
        test("should return a flattened array of friends' ages", () => {
            const dictionary = new SortedDictionary<string, Person>();
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
        test("should return false for dictionaries with different sizes", () => {
            const dict1 = new SortedDictionary<number, string>();
            const dict2 = new SortedDictionary<number, string>();
            dict1.add(1, "a");
            dict2.add(1, "a");
            dict2.add(2, "b");
            expect(dict1.sequenceEqual(dict2)).to.eq(false);
        });
        test("should return true if dictionaries have members in the same order", () => {
            const dict1 = new SortedDictionary<number, string>();
            const dict2 = new SortedDictionary<number, string>();
            dict1.add(1, "a");
            dict1.add(2, "b");
            dict2.add(1, "a");
            dict2.add(2, "b");
            expect(dict1.sequenceEqual(dict2)).to.eq(true);
        });
        test("should return true if dictionaries have members in the same order", () => {
            const dict1 = new SortedDictionary<number, Person>();
            const dict2 = new SortedDictionary<number, Person>();
            dict1.add(1, Person.Alice);
            dict1.add(2, Person.Lucrezia);
            dict2.add(1, Person.Alice);
            dict2.add(2, Person.Lucrezia);
            expect(dict1.sequenceEqual(dict2, (p1, p2) => p1.value.name === p2.value.name)).to.eq(true);
        });
    });

    describe("#set()", () => {
        const dict = new SortedDictionary<string, number>();
        dict.add("one", 1);
        dict.add("two", 2);
        test("should throw error if key is not found", () => {
            expect(() => dict.set("three", 3)).to.throw(ErrorMessages.KeyNotFound);
        });
        test("should set the value of the key and not add a new key", () => {
            dict.set("two", 22);
            expect(dict.get("two")).to.eq(22);
            expect(dict.size()).to.eq(2);
            expect(dict.length).to.eq(2);
            const expectedResults = [["one", 1], ["two", 22]];
            let index = 0;
            for (const [key, value] of dict.entries()) {
                expect([key, value]).to.deep.eq(expectedResults[index++]);
            }
        });
    });

    describe("#single", () => {
        test("should throw error if dictionary is empty", () => {
            const dict = new SortedDictionary();
            expect(() => dict.single()).to.throw(ErrorMessages.NoElements);
        });
        test("should throw error if dictionary has more than one elements and no predicate is provided", () => {
            const dict = new SortedDictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "b");
            expect(() => dict.single()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        test("should return the only element in the dictionary", () => {
            const dict = new SortedDictionary<number, string>();
            dict.add(1, "a");
            const single = dict.single();
            expect(single.equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
        });
        test("should throw error if no matching element is found", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Hanna.name, Person.Hanna);
            dict.add(Person.Noemi.name, Person.Noemi);
            expect(() => dict.single(p => p.key === "Lenka")).to.throw(ErrorMessages.NoMatchingElement);
        });
        test("should return person with name 'Priscilla'", () => {
            const dict = new SortedDictionary<string, Person>();
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
        test("should return null if dictionary is empty", () => {
            const dict = new SortedDictionary();
            expect(dict.singleOrDefault()).to.eq(null);
        });
        test("should throw error if dictionary has more than one elements and no predicate is provided", () => {
            const dict = new SortedDictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "b");
            expect(() => dict.singleOrDefault()).to.throw(ErrorMessages.MoreThanOneElement);
        });
        test("should return the only element in the dictionary", () => {
            const dict = new SortedDictionary<number, string>();
            dict.add(1, "a");
            const single = dict.singleOrDefault() as KeyValuePair<number, string>;
            expect(single.equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
        });
        test("should throw error if there are more than one matching elements", () => {
            const dict = new SortedDictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "a");
            expect(() => dict.singleOrDefault(p => p.value === "a")).to.throw(ErrorMessages.MoreThanOneMatchingElement);
        });
        test("should return null if no matching element is found", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Hanna.name, Person.Hanna);
            dict.add(Person.Noemi.name, Person.Noemi);
            expect(dict.singleOrDefault(p => p.key === "Lenka")).to.eq(null);
        });
        test("should return person with name 'Priscilla'", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const single = dict.singleOrDefault(p => p.key === "Priscilla") as KeyValuePair<string, Person>;
            expect(single.key).eq(Person.Priscilla.name);
            expect(single.value).to.eq(Person.Priscilla);
        });
    });

    describe("#size()", () => {
        const dictionary = new SortedDictionary<Person, string>([], personNameComparator);
        dictionary.add(Person.Mel, Person.Mel.surname);
        dictionary.add(Person.Lenka, Person.Lenka.surname);
        dictionary.add(Person.Jane, Person.Jane.surname);
        test("should return the size of the dictionary()", () => {
            expect(dictionary.size()).to.eq(3);
        });
    });

    describe("#skip()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new SortedDictionary<string, Person>();
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
        test("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skip(100).toSortedDictionary(p => p.key, p => p.value.surname);
            expect(people.size()).to.eq(0);
        });
    });

    describe("#skipLast()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new SortedDictionary<string, Person>();
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
        test("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skipLast(100).toSortedDictionary(p => p.key, p => p.value.surname);
            expect(people.size()).to.eq(0);
        });
    });

    describe("#skipWhile()", () => {
        const dict = new SortedDictionary<number, Person>();
        dict.add(5000, Person.Alice);
        dict.add(2500, Person.Bella);
        dict.add(8000, Person.Eliza);
        dict.add(6500, Person.Hanna);
        dict.add(9000, Person.Emily);
        dict.add(4000, Person.Julia);
        dict.add(1500, Person.Megan);
        dict.add(5500, Person.Noemi);
        test("should return a dictionary with keys [8000, 9000]", () => {
            const dict2 = dict.skipWhile((p, px) => p.key <= 6500).toSortedDictionary<number, Person>(p => p.key, p => p.value);
            const keys = dict2.select(p => p.key).toArray();
            expect(keys.length).to.eq(2);
            expect(keys).to.have.all.members([8000, 9000]);
        });
    });

    describe("#sum()", () => {
        const dict = new SortedDictionary<number, Person>();
        dict.add(5000, Person.Alice);
        dict.add(2500, Person.Bella);
        dict.add(9000, Person.Emily);
        dict.add(8000, Person.Eliza);
        test("should return ", () => {
            const sum = dict.sum(p => p.key);
            expect(sum).to.eq(24500);
        });
        test("should throw error if dictionary is empty", () => {
            dict.clear();
            expect(() => dict.sum()).to.throw(ErrorMessages.NoElements);
        });
    });

    describe("#take()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new SortedDictionary<string, Person>();
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
        test("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.take(100).toSortedDictionary(p => p.key, p => p.value);
            expect(people.size()).to.eq(4);
        });
    });

    describe("#takeLast()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new SortedDictionary<string, Person>();
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
        test("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new SortedDictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.takeLast(100).toSortedDictionary(p => p.key, p => p.value);
            expect(people.size()).to.eq(4);
        });
    });

    describe("#takeWhile()", () => {
        const dict = new SortedDictionary<string, number>();
        dict.add("apple", 1);
        dict.add("banana", 2);
        dict.add("mango", 3);
        dict.add("orange", 4);
        dict.add("plum", 5);
        dict.add("grape", 6);
        test("should return a dictionary with keys [apple, banana, mango, grape]", () => {
            const dict2 = dict.takeWhile(p => p.key.localeCompare("orange") !== 0).toSortedDictionary<string, number>(p => p.key, p => p.value);
            expect(dict2.size()).to.eq(4);
            const fruits = dict2.select(p => p.key).toArray();
            expect(fruits).to.deep.equal(["apple", "banana", "grape", "mango"]);
        });
    });

    describe("#thenBy()", () => {
        test("should order people by age [asc] then by name [desc] then by surname [asc]", () => {
            const dict = new SortedDictionary<number, Person>();
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
        test("should be ignored if followed by an orderBy", () => {
            const dict = new SortedDictionary<number, Person>();
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
        test("should order people by age [desc] then by name [desc] then by surname [asc]", () => {
            const dict = new SortedDictionary<number, Person>();
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
        test("should be ignored if followed by an orderBy", () => {
            const dict = new SortedDictionary<number, Person>();
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
        const dict = new SortedDictionary<string, Person>();
        dict.add(Person.Lucrezia.name, Person.Lucrezia);
        dict.add(Person.Vanessa.name, Person.Vanessa);
        dict.add(Person.Alice.name, Person.Alice);
        const people = dict.toArray();
        test("should have the same size as dictionary", () => {
            expect(dict.size()).to.eq(people.length);
            expect(dict.length).to.eq(people.length);
        });
        test("should have the same order as dictionary", () => { // ordered due to RedBlackTree
            expect(people[0].value).to.eq(Person.Alice);
            expect(people[1].value).to.eq(Person.Lucrezia);
            expect(people[2].value).to.eq(Person.Vanessa);
        });
    });

    describe("#toList()", () => {
        const dictionary = new SortedDictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const list = dictionary.toList();
        test("should create a new KeyValuePair list", () => {
            expect(list.size()).to.eq(dictionary.size());
            expect(list.get(0).equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
            expect(list.get(1).equals(new KeyValuePair<number, string>(2, "b"))).to.eq(true);
            expect(list instanceof List).to.be.true;
            expect(list.length).to.eq(dictionary.length);
        });
    });

    describe("#toSortedDictionary()", () => {
        const dictionary = new SortedDictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const dict2 = dictionary.toSortedDictionary(p => p.value, p => p.key);
        test("should create a new dictionary", () => {
            expect(dict2.size()).to.eq(dictionary.size());
            expect(dict2.get("a")).to.not.null;
            expect(dict2.get("b")).to.not.null;
            expect(dict2.length).to.eq(dictionary.length);
        });
    });

    describe("#toString()", () => {
        test("should return a string representation", () => {
            const dictionary = new SortedDictionary<number, string>();
            dictionary.add(1, "a");
            dictionary.add(2, "b");
            dictionary.add(3, "c");
            expect(dictionary.toString()).to.eq("{ 1: a, 2: b, 3: c }");
        });
        test("should return a string representation with custom selector", () => {
            const dictionary = new SortedDictionary<number, string>();
            dictionary.add(2, "b");
            dictionary.add(1, "a");
            dictionary.add(3, "c");
            expect(dictionary.toString(p => p.value)).to.eq("{ a, b, c }");
        });
        test("should return a string representation with custom selector #2", () => {
            const dictionary = new SortedDictionary<string, Person>();
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Vanessa.name, Person.Vanessa);
            dictionary.add(Person.Alice.name, Person.Alice);
            expect(dictionary.toString(p => p.value.name)).to.eq("{ Alice, Lucrezia, Vanessa }");
        });
    });

    describe("#tryAdd()", () => {
        const dictionary = new SortedDictionary<Person, string>([], personNameComparator);
        dictionary.add(Person.Alice, Person.Alice.name);
        dictionary.add(Person.Hanna, Person.Hanna.name);
        test("should not throw if key already exists", () => {
            expect(() => dictionary.add(Person.Alice, "Alicia")).to.throw(ErrorMessages.KeyAlreadyAdded);
            expect(() => dictionary.tryAdd(Person.Alice, "Alicia")).to.not.throw;
        });
        test("should return true if key doesn't exist and item is added", () => {
            expect(dictionary.tryAdd(Person.Suzuha, Person.Suzuha.name)).to.eq(true);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.length).to.eq(3);
        });
        test("should return true if key already exists and item is not added", () => {
            expect(dictionary.tryAdd(Person.Alice, Person.Alice.name)).to.eq(false);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.length).to.eq(3);
        });
    });

    describe("#union()", () => {
        const dict1 = new SortedDictionary<number, string>();
        const dict2 = new SortedDictionary<number, string>();
        const dict3 = new SortedDictionary<number, string>();
        dict1.add(1, "a");
        dict1.add(2, "b");
        dict1.add(3, "c");
        dict1.add(4, "d");

        dict2.add(5, "e");
        dict2.add(2, "b");

        dict3.add(6, "f");
        dict3.add(7, "g");
        test("should throw error when keys are duplicate", () => {
            expect(() => dict1.union(dict2).toSortedDictionary<number, string>(p => p.key, p => p.value)).to.throw(ErrorMessages.KeyAlreadyAdded);
        });

        test("should return a dictionary with unique key value pairs", () => {
            const union1 = dict1.union(dict3).toSortedDictionary<number, string>(p => p.key, p => p.value);
            expect(union1.size()).to.eq(6);
        });

        test("should throw error if key already exists and key value pairs are not equal", () => {
            const dict4 = new SortedDictionary<number, string>();
            dict4.add(1, "z");
            expect(() => dict1.union(dict4).toDictionary(p => p.key, p => p.value)).to.throw();
        });
    });

    describe("#values()", () => {
        const dictionary = new SortedDictionary<number, Person>();
        dictionary.add(Person.Senna.age, Person.Senna);
        dictionary.add(Person.Alice.age, Person.Alice);
        dictionary.add(Person.Mel.age, Person.Mel);
        dictionary.add(Person.Lenka.age, Person.Lenka);
        test("should return a list with mapped values", () => {
            const values = dictionary.values().toArray();
            expect(values).to.deep.equal([Person.Mel, Person.Senna, Person.Lenka, Person.Alice]); // sorted by age due to RedBlackTree
            expect(dictionary.values().length).to.eq(4);
        });
    });

    describe("#where()", () => {
        const dictionary = new SortedDictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should return a dictionary with people who are younger than 10", () => {
            const dict = dictionary.where(p => p.value.age < 10).toSortedDictionary<string, Person>(p => p.key, p => p.value);
            expect(dict.size()).to.eq(1);
            expect(dict.get(Person.Alice.name)).to.null;
            expect(dict.get(Person.Lucrezia.name)).to.null;
            expect(dict.get(Person.Noemi.name)).to.null;
            expect(dict.get(Person.Priscilla.name)).to.not.null;
            expect(dict.length).to.eq(1);
        });
    });

    describe("#zip()", () => {
        test("should return array of key value pair tuples if predicate is null", () => {
            const dict1 = new SortedDictionary<number, string>();
            const dict2 = new SortedDictionary<number, string>();
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
        test("should return a zipped list with size of 2", () => {
            const dict1 = new SortedDictionary<number, string>();
            const dict2 = new SortedDictionary<string, number>();
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
