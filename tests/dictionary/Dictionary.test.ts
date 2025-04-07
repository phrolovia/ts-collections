import { describe, test } from "vitest";
import { Dictionary } from "../../src/dictionary/Dictionary";
import { KeyValuePair } from "../../src/dictionary/KeyValuePair";
import { Enumerable } from "../../src/enumerator/Enumerable";
import {
    CircularLinkedList,
    EnumerableSet,
    ImmutableDictionary,
    ImmutableList,
    ImmutableQueue,
    ImmutableSet,
    ImmutableSortedDictionary,
    ImmutableSortedSet,
    ImmutableStack,
    LinkedList,
    PriorityQueue,
    Queue,
    Stack
} from "../../src/imports";
import { List } from "../../src/list/List";
import { EqualityComparator } from "../../src/shared/EqualityComparator";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";
import { KeyNotFoundException } from "../../src/shared/KeyNotFoundException";
import { MoreThanOneElementException } from "../../src/shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../../src/shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../../src/shared/NoElementsException";
import { NoMatchingElementException } from "../../src/shared/NoMatchingElementException";
import { Helper } from "../helpers/Helper";
import { Person } from "../models/Person";
import { School } from "../models/School";
import { SchoolStudents } from "../models/SchoolStudents";
import { Student } from "../models/Student";

describe("Dictionary", () => {
    describe("#add()", () => {
        test("should add values to the dictionary with a string key", () => {
            const dictionary = new Dictionary<string, number>();
            dictionary.add("Shenhe", 1);
            dictionary.add("Mona", 2);
            dictionary.add("Yae Miko", 3);
            expect(dictionary.get("Shenhe")).to.equal(1);
            expect(dictionary.get("Mona")).to.equal(2);
            expect(dictionary.get("Yae Miko")).to.equal(3);
        });
        test("should add values to the dictionary with a number key", () => {
            const dictionary = new Dictionary<number, number>();
            dictionary.add(1, 1);
            dictionary.add(2, 2);
            dictionary.add(3, 3);
            expect(dictionary.get(1)).to.equal(1);
            expect(dictionary.get(2)).to.equal(2);
            expect(dictionary.get(3)).to.equal(3);
        });
    });

    describe("#aggregate()", () => {
        const dictionary = new Dictionary<number, string>();
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
            expect(() => dictionary.aggregate<number>((total, next) => total + next.key)).toThrow(new NoElementsException());
        });
    });

    describe("#aggregateBy()", () => {
        const dictionary = new Dictionary<number, Person>();
        dictionary.add(1, Person.Alice);
        dictionary.add(2, Person.Lucrezia);
        dictionary.add(3, Person.Noemi);
        dictionary.add(4, Person.Noemi2);
        test("should aggregate into (name, sum of ages) pairs", () => {
            const result = dictionary.aggregateBy(p => p.value.name, () => 0, (total, next) => total + next.value.age);
            const obj = result.toObject(p => p.key, p => p.value);
            expect(obj).to.deep.equal({Alice: 23, Lucrezia: 21, Noemi: 72});
        });
        test("should return empty result if source is empty", () => {
            dictionary.clear();
            const result = dictionary.aggregateBy(p => p.value.name, () => 0, (total, next) => total + next.value.age);
            expect(result.count()).to.eq(0);
        });
    });

    describe("#all()", () => {
        const dictionary = new Dictionary<string, Person>();
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
        const dictionary = new Dictionary<string, Person>();
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
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should append the new element and return a new dictionary", () => {
            const dict2 = dictionary.append(new KeyValuePair<string, Person>(Person.Reina.name, Person.Reina)).toDictionary(p => p.key, p => p.value);
            expect(dict2.get("Reina")).to.not.null;
            expect(dict2.get("Reina")).to.eq(Person.Reina);
            expect(dict2.size()).to.eq(5);
            expect(dictionary.size()).to.eq(4);
            expect(dictionary.get("Reina")).to.null;
            expect(dict2.length).to.eq(5);
        });
    });

    describe("#asEnumerable()", () => {
        test("should return an IEnumerable", () => {
            const dictionary = new Dictionary<string, number>([
                ["a", 1],
                ["b", 2],
                ["c", 3]
            ]);
            const enumerable = dictionary.asEnumerable();
            expect(enumerable.toArray()).to.deep.equal([
                new KeyValuePair<string, number>("a", 1),
                new KeyValuePair<string, number>("b", 2),
                new KeyValuePair<string, number>("c", 3)
            ]);
        });
    });

    describe("#asObject()", () => {
        test("should return an object representation of the dictionary", () => {
            const dictionary = new Dictionary<string, number>([
                ["a", 1],
                ["b", 2],
                ["c", 3]
            ]);
            const obj = dictionary.asObject();
            expect(obj).to.deep.equal({
                a: 1,
                b: 2,
                c: 3
            });
        });
        test("should return an object representation of the dictionary with an object key type", () => {
            const dictionary = new Dictionary<Person, Person>([
                [Person.Ayana, Person.Ayana],
                [Person.Rui, Person.Rui],
                [Person.Setsuna, Person.Setsuna]
            ]);
            const obj = dictionary.asObject();
            expect(obj).to.deep.equal({
                "Ayana Suzukawa": Person.Ayana,
                "Rui Kazehaya": Person.Rui,
                "Setsuna Hoshinami": Person.Setsuna
            });
        });
    });

    describe("#average()", () => {
        const dict = new Dictionary<string, number>();
        dict.add("A", 1);
        dict.add("B", 101);
        test("should return 51", () => {
            const avg = dict.average(p => p.value);
            expect(avg).to.eq(51);
        });
        test("should throw error if dictionary is empty", () => {
            dict.clear();
            expect(() => dict.average(p => p.value)).toThrow(new NoElementsException());
        });
    });

    describe("#chunk()", () => {
        test("should split list into chunks of size 10", () => {
            const dictionary = Enumerable.range(1, 100).toDictionary(n => n, n => n * n);
            for (const chunk of dictionary.chunk(10)) {
                expect(chunk.count() === 10).to.be.true;
            }
        });
        test("should splits enumerable into chunks of size 7 at max", () => {
            const enumerable = Enumerable.range(1, 79);
            for (const chunk of enumerable.chunk(7)) {
                expect(chunk.count() <= 7).to.be.true;
            }
        });
        test("should throw error if chunk size is 0", () => {
            const dictionary = Enumerable.range(1, 100).toDictionary(n => n, n => n * n);
            expect(() => dictionary.chunk(0)).toThrowError(new InvalidArgumentException(`Invalid argument: size. Size must be greater than 0.`));
        });
    });

    describe("#cast()", () => {
        const dictionary = new Dictionary<string, string | number>();
        dictionary.add("a", 1);
        dictionary.add("b", 2);
        dictionary.add("c", 3);
        dictionary.add("d", "4");
        dictionary.add("e", "5");
        test("should cast the dictionary to a new dictionary with string values", () => {
            const stringValues = dictionary.values().where(v => typeof v === "string").cast<string>().toArray();
            const numberValues = dictionary.values().where(v => typeof v === "number").cast<number>().toArray();
            expect(stringValues.length).to.eq(2);
            expect(stringValues[0]).to.eq("4");
            expect(stringValues[1]).to.eq("5");
            expect(numberValues.length).to.eq(3);
            expect(numberValues[0]).to.eq(1);
            expect(numberValues[1]).to.eq(2);
            expect(numberValues[2]).to.eq(3);
        });
    });

    describe("#clear()", () => {
        test("should remove all elements from the dictionary", () => {
            const dictionary = new Dictionary<string, number>();
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
        const dictionary1 = new Dictionary<string, Person>();
        dictionary1.add(Person.Alice.name, Person.Alice);
        dictionary1.add(Person.Lucrezia.name, Person.Lucrezia);
        const dictionary2 = new Dictionary<string, Person>();
        dictionary2.add(Person.Noemi.name, Person.Noemi);
        dictionary2.add(Person.Priscilla.name, Person.Priscilla);
        test("should return a dictionary which contains four people", () => {
            const dict = dictionary1.concat(dictionary2).toDictionary(p => p.key, p => p.value);
            expect(dict.size()).to.eq(4);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Noemi")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.get("Priscilla")).to.not.null;
            expect(dict.length).to.eq(4);
        });
    });

    describe("#constructor()", () => {
        const dictionary = new Dictionary<string, Person>(
            [
                new KeyValuePair<string, Person>(Person.Alice.name, Person.Alice),
                new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia)
            ],
            (p1, p2) => p1.name === p2.name
        );
        test("should create a dictionary with two elements", () => {
            expect(dictionary.size()).to.eq(2);
            expect(dictionary.get("Alice")).to.not.null;
            expect(dictionary.get("Lucrezia")).to.not.null;
            expect(dictionary.length).to.eq(2);
        });
        test("should create a dictionary from a tuple array", () => {
            const dict = new Dictionary<string, number>([
                ["a", 1],
                ["b", 2],
                ["c", 3]
            ]);
            expect(dict.size()).to.eq(3);
            expect(dict.get("a")).to.eq(1);
            expect(dict.get("b")).to.eq(2);
            expect(dict.get("c")).to.eq(3);
        });
        test("should throw if tuple contains duplicate values", () => {
            expect(() => new Dictionary<string, number>([
                ["a", 1],
                ["a", 2],
                ["c", 3]
            ])).toThrowError(new InvalidArgumentException(`Key already exists: a`));
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
        test("should contain 'Noemi'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Noemi.name, Person.Noemi), personComparator)).to.eq(true);
        });
        test("should contain 'Lucrezia'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia), personComparator)).to.eq(true);
        });
        test("should not contain 'Olga'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(Person.Olga.name, Person.Olga), personComparator)).to.eq(false);
        });
    });

    describe("#containsKey()", () => {
        const dictionary = new Dictionary<string, Person>();
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
        const dictionary = new Dictionary<string, Person>();
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
        const dictionary = new Dictionary<string, Person>();
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

    describe("#countBy()", () => {
        it("should return a list of [name, count] key value pairs", () => {
            const dict = new Dictionary<string, Person>();
            const LittleNoemi = new Person("noemi", "Bluewater", 9);
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Lucrezia.name, Person.Lucrezia);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(LittleNoemi.name, LittleNoemi);
            const countByResult = dict.countBy(p => p.value.name);
            const noemiCountBig = countByResult.first(p => p.key === "Noemi").value;
            const noemiCountLittle = countByResult.first(p => p.key === "noemi").value;
            expect(noemiCountBig).to.eq(1);
            expect(noemiCountLittle).to.eq(1);

            const countByResult2 = dict.countBy(p => p.value.name, (p1, p2) => p1.toLowerCase().localeCompare(p2.toLowerCase()) === 0);
            const noemiCount = countByResult2.first(p => p.key === "Noemi").value;
            expect(noemiCount).to.eq(2);
        });
    });

    describe("#defaultIfEmpty()", () => {
        test("should return a new IEnumerable with the default value", () => {
            const dictionary = new Dictionary<string, Person>();
            const dict = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(Person.Alice.name, Person.Alice)).toDictionary(p => p!.key, p => p!.value);
            const single = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(Person.Lucrezia.name, Person.Lucrezia)).single() as KeyValuePair<string, Person>;
            expect(dict instanceof Dictionary).to.eq(true);
            expect(dict.size()).to.eq(1);
            expect(dict.get(Person.Alice.name)).to.not.null;
            expect(single.value).to.eq(Person.Lucrezia);
            expect(dict.length).to.eq(1);
        });
    });

    describe("#distinct()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        test("should return a new dictionary which is identical to the source dictionary", () => {
            const dict = dictionary.distinct().toDictionary<string, Person>(p => p.key, p => p.value);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.length).to.eq(dictionary.size());
        });
    });

    describe("#distinctBy()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Suzuha.name, Person.Alice); // note the different people for key and value
        test("should return a new dictionary with distinct values", () => {
            const dict = dictionary.distinctBy(p => p.value.name).toDictionary<string, Person>(p => p.key, p => p.value);
            expect(dict.size()).to.eq(4);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.get("Noemi")).to.not.null;
            expect(dict.get("Priscilla")).to.not.null;
            expect(dict.get("Suzuha")).to.null;
        });
    });

    describe("#elementAt()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        test("should return 'Lucrezia'", () => {
            const person = dictionary.elementAt(1);
            expect(person.value).to.eq(Person.Lucrezia);
        });
        test("should throw error if index is out of bounds", () => {
            expect(() => dictionary.elementAt(100)).to.throw();
            expect(() => dictionary.elementAt(-1)).to.throw();
        });
    });

    describe("#elementAtOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
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
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Alice.name, Person.Alice);
        let index = 0;
        test("should return an IterableIterator with key-value tuple", () => {
            for (const [key, value] of dictionary.entries()) {
                if (index === 0) {
                    expect(key).to.eq(Person.Noemi.name);
                    expect(value.equals(Person.Noemi)).to.be.true;
                } else if (index === 1) {
                    expect(key).to.eq(Person.Alice.name);
                    expect(value.equals(Person.Alice)).to.be.true;
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
        test("should return a new dictionary with the elements unique to first dictionary", () => {
            const result = dict1.except(dict2).toDictionary<number, string>(p => p.key, p => p.value);
            expect(result.size()).to.eq(3);
            expect(result.get(1)).to.not.null;
            expect(result.get(3)).to.not.null;
            expect(result.get(4)).to.not.null;
            expect(result.get(2)).to.null;
        });
        test("should use the comparer to determine uniqueness", () => {
            const result = dict1.except(dict2, (a, b) => a.value === b.value).toDictionary<number, string>(p => p.key, p => p.value);
            expect(result.size()).to.eq(3);
            expect(result.get(2)).to.null; // (2, "b") is not unique, so it is not included in the result
            expect(result.get(1)).to.not.null;
            expect(result.get(3)).to.not.null;
            expect(result.get(4)).to.not.null;
        });
    });

    describe("#first()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should throw error if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(() => dict.first()).toThrow(new NoElementsException());
        });
        test("should return the first element if no predicate is provided", () => {
            const first = dictionary.first();
            expect(first.key).to.eq(Person.Alice.name);
            expect(first.value.equals(Person.Alice)).to.be.true;
        });
        test("should throw an error if no matching element is found", () => {
            expect(() => dictionary.first(p => p.value.name === "Suzuha")).toThrowError(new NoMatchingElementException());
        });
        test("should return a person with name 'Noemi'", () => {
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
        test("should return null if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(dict.firstOrDefault()).to.eq(null);
        });
        test("should return the first element if no predicate is provided", () => {
            const first = dictionary.firstOrDefault() as KeyValuePair<string, Person>;
            expect(first.key).to.eq(Person.Alice.name)
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
        const dictionary = new Dictionary<string, Person>();
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
        const dictionary = new Dictionary<string, number>();
        test("should get the value which belongs to the given key", () => {
            dictionary.add(Person.Alice.name, Person.Alice.age);
            dictionary.add(Person.Mel.name, Person.Mel.age);
            dictionary.add(Person.Senna.name, Person.Senna.age);
            expect(dictionary.get(Person.Alice.name)).to.eq(Person.Alice.age);
            expect(dictionary.get(Person.Mel.name)).to.eq(Person.Mel.age);
            expect(dictionary.get(Person.Senna.name)).to.eq(Person.Senna.age);
        });
        test("should get the value which belongs to the given key #2", () => {
            const numbers = Helper.generateRandomUniqueNumbers(500000);
            const dict = new Dictionary<number, string>();
            numbers.forEach(n => dict.add(n, n.toString()));
            for (const num of numbers) {
                expect(dict.get(num)).to.eq(num.toString());
            }
        }, {timeout: 15000});
        test("should return null if key is not in the dictionary", () => {
            expect(dictionary.get(Person.Jane.name)).to.be.null;
        });
    });

    describe("#groupBy()", () => {
        const dict = new Dictionary<string, Person>();
        dict.add(Person.Alice.name, Person.Alice);
        dict.add(Person.Mel.name, Person.Mel);
        dict.add(Person.Senna.name, Person.Senna);
        dict.add(Person.Lenka.name, Person.Lenka);
        dict.add(Person.Jane.name, Person.Jane);
        dict.add(Person.Kaori.name, Person.Kaori);
        dict.add(Person.Reina.name, Person.Reina);
        test("should group people by age", () => {
            const group = dict.groupBy(p => p.value.age).toDictionary(g => g.key, g => g);
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
        test("should join and group by school id", () => {
            const joinedData = schoolDict.groupJoin(studentDict, sc => sc.value.id, st => st.value.schoolId,
                (schoolPair, students) => {
                    return new SchoolStudents(schoolPair.key, students?.select(s => s.value).toList() ?? new List<Student>())
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
        test("should return a dictionary consisting of equal KeyValuePairs", () => {
            const result = dict1.intersect(dict2).toDictionary<number, string>(p => p.key, p => p.value);
            expect(result.size()).to.eq(1);
            expect(result.get(2)).to.eq("b");
            expect(result.get(1)).to.null;
            expect(result.get(3)).to.null;
            expect(result.get(4)).to.null;
        });
        test("should return an empty dictionary", () => {
            const dict3 = new Dictionary<number, string>();
            dict3.add(2, "zz");
            dict3.add(3, "ff");
            const result = dict1.intersect(dict3).toDictionary<number, string>(p => p.key, p => p.value);
            expect(result.isEmpty()).to.eq(true);
        });
        test("should use the comparer to determine uniqueness", () => {
            const result = dict1.intersect(dict2, (a, b) => a.value === b.value).toDictionary<number, string>(p => p.key, p => p.value);
            expect(result.size()).to.eq(1);
            expect(result.get(2)).to.not.null; // (2, "b") is shared, so it should be in the result
            expect(result.get(1)).to.null;
            expect(result.get(3)).to.null;
            expect(result.get(4)).to.null;
        });
    });

    describe("#isEmpty()", () => {
        test("should return true if dictionary is empty", () => {
            const dictionary = new Dictionary<number, string>();
            expect(dictionary.isEmpty()).to.eq(true);
        });
        test("should return false if dictionary is not empty", () => {
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
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Jane.name, Person.Jane);
            dictionary.add(Person.Amy.name, Person.Amy);
            const keySet = dictionary.keys();
            expect(keySet.size()).to.eq(3);
            expect(keySet.length).to.eq(3);
            expect(keySet.toArray()).to.deep.equal(["Alice", "Jane", "Amy"]);
        });
    });

    describe("#last()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should throw error if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(() => dict.last()).toThrow(new NoElementsException());
        });
        test("should return the last element if no predicate is provided", () => {
            const last = dictionary.last();
            expect(last.key).to.eq(Person.Noemi.name);
            expect(last.value.equals(Person.Noemi)).to.be.true; // it isn't Noemi since dictionary is sorted due to RedBlackTree implementation
        });
        test("should throw an error if no matching element is found", () => {
            expect(() => dictionary.last(p => p.value.name === "Suzuha")).toThrowError(new NoMatchingElementException());
        });
        test("should return a person with name 'Noemi' with age 29", () => {
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
        test("should return null if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(dict.lastOrDefault()).to.eq(null);
        });
        test("should return the last element if no predicate is provided", () => {
            const last = dictionary.lastOrDefault() as KeyValuePair<string, Person>;
            expect(last.key).to.eq(Person.Noemi.name);
            expect(last.value.equals(Person.Noemi)).to.be.true; // it isn't Noemi since dictionary is sorted due to RedBlackTree implementation
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
        const dictionary = new Dictionary<string, Person>();
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
            expect(() => dictionary.max()).toThrow(new NoElementsException());
        });
    });
    describe("#maxBy()", () => {
        const dictionary = new Dictionary<string, Person>(
            [
                [Person.Alice.name, Person.Alice],
                [Person.Noemi.name, Person.Noemi],
                [Person.Lucrezia.name, Person.Lucrezia]
            ]
        );
        test("should return the person with the maximum age", () => {
            const max = dictionary.maxBy(p => p.value.age);
            expect(max.key).to.eq(Person.Noemi.name);
            expect(max.value).to.eq(Person.Noemi);
        });
    });

    describe("#min()", () => {
        const dictionary = new Dictionary<string, Person>();
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
            expect(() => dictionary.min()).toThrow(new NoElementsException());
        });
    });

    describe("#minBy()", () => {
        const dictionary = new Dictionary<string, Person>(
            [
                [Person.Alice.name, Person.Alice],
                [Person.Noemi.name, Person.Noemi],
                [Person.Lucrezia.name, Person.Lucrezia]
            ]
        );
        test("should return the person with the minimum age", () => {
            const min = dictionary.minBy(p => p.value.age);
            expect(min.key).to.eq(Person.Lucrezia.name);
            expect(min.value).to.eq(Person.Lucrezia);
        });
    });

    describe("#ofType()", () => {
        const dict = new Dictionary<number, number | string | Person | Set<unknown>>();
        const set = new Set<number>([1, 2]);
        dict.add(1, 1);
        dict.add(2, "a");
        dict.add(3, 3);
        dict.add(4, "b");
        dict.add(5, 5);
        dict.add(6, Person.Hanyuu);
        dict.add(7, Person.Lucrezia);
        dict.add(8, set);
        test("should return a new list with only numbers", () => {
            const numbers = dict.values().ofType(Number).toList();
            expect(numbers.size()).to.eq(3);
            expect(numbers.length).to.eq(3);
            expect(numbers.toArray()).to.deep.equal([1, 3, 5]);
        });
        test("should return a new list with only strings", () => {
            const strings = dict.values().ofType("string").toList();
            expect(strings.size()).to.eq(2);
            expect(strings.length).to.eq(2);
            expect(strings.toArray()).to.deep.equal(["a", "b"]);
        });
        test("should return a new list with only people", () => {
            const people = dict.values().ofType(Person).toList();
            expect(people.size()).to.eq(2);
            expect(people.length).to.eq(2);
            expect(people.toArray()).to.deep.equal([Person.Hanyuu, Person.Lucrezia]);
        });
    });

    describe("#orderBy()", () => {
        test("should order dictionary by key [asc]", () => {
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
        test("should order dictionary by key [desc]", () => {
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

    describe("#partition()", () => {
        test("should partition dictionary into two groups", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Noemi.name, Person.Noemi);
            dictionary.add(Person.Priscilla.name, Person.Priscilla);
            dictionary.add(Person.Mel.name, Person.Mel);
            const [group1, group2] = dictionary.partition(p => p.value.age > 20);
            expect(group1.count()).to.eq(3);
            expect(group2.count()).to.eq(2);
        });
    });

    describe("#prepend()", () => {
        test("should add item at the beginning", () => {
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

    describe("#product()", () => {
        const dict = new Dictionary<number, Person>([
            [Person.Rui.age, Person.Rui],
            [Person.Setsuna.age, Person.Setsuna],
            [Person.Ayana.age, Person.Ayana]
        ]);
        test("should return the product of all keys", () => {
            const product = dict.product(p => p.key);
            expect(product).to.eq(Person.Rui.age * Person.Setsuna.age * Person.Ayana.age);
        });
    });

    describe("#put()", () => {
        const dict = new Dictionary<number, number>();
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
        test("should work properly with boolean values", () => {
            const dict2 = new Dictionary<string, boolean>();
            dict2.put("a", true);
            dict2.put("b", false);

            expect(dict2.get("a")).to.eq(true);
            expect(dict2.get("b")).to.eq(false);

            dict2.put("a", false);
            dict2.put("b", true);

            expect(dict2.get("a")).to.eq(false);
            expect(dict2.get("b")).to.eq(true);
        });
    });

    describe("#remove()", () => {
        const dictionary = new Dictionary<string, string>();
        dictionary.add(Person.Jane.name, Person.Jane.name);
        dictionary.add(Person.Mel.name, Person.Mel.name);
        test("should remove the value from dictionary", () => {
            const value = dictionary.remove(Person.Mel.name);
            expect(dictionary.size()).to.eq(1);
            expect(dictionary.get(Person.Jane.name)).to.not.null;
            expect(dictionary.get(Person.Mel.name)).to.null;
            expect(value).to.eq(Person.Mel.name);
            expect(dictionary.length).to.eq(1);
        });
        test("should return the value that is mapped to the given key", () => {
            const value = dictionary.remove(Person.Jane.name);
            expect(value).to.eq(Person.Jane.name);
            expect(dictionary.length).to.eq(0);
        });
        test("should return null if key is not in the dictionary", () => {
            const value = dictionary.remove(Person.Senna.name);
            expect(value).to.null;
        });
    });

    describe("#reverse()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should reverse the dictionary", () => {
            const dictArray = dictionary.reverse().toArray();
            expect(dictArray[dictArray.length - 1].key).to.eq(Person.Lucrezia.name);
        });
    });

    describe("#scan()", () => {
        test("should create a Record of name-surname pairs", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Priscilla.name, Person.Priscilla);
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Alice.name, Person.Alice);
            dictionary.add(Person.Noemi.name, Person.Noemi);
            const record = dictionary.scan((acc, item) => {
                acc[item.key] = item.value.surname;
                return acc;
            }, {} as Record<string, string>).last();
            const expectedResult = {
                "Priscilla": "Necci",
                "Lucrezia": "Volpe",
                "Alice": "Rivermist",
                "Noemi": "Waterfox"
            };
            expect(record).to.deep.eq(expectedResult);
        });
    });

    describe("#select()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        test("should select keys of dictionary and surname value from values", () => {
            const result = dictionary.select(p => [p.key, p.value.surname]).toDictionary(p => p[0], p => p[1]);
            const expectedResult = [
                new KeyValuePair<string, string>(Person.Lucrezia.name, Person.Lucrezia.surname),
                new KeyValuePair<string, string>(Person.Alice.name, Person.Alice.surname),
                new KeyValuePair<string, string>(Person.Priscilla.name, Person.Priscilla.surname),
                new KeyValuePair<string, string>(Person.Noemi.name, Person.Noemi.surname)
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
            const expectedResult = [17, 23, 44, 28, 21, 37, 44, 77];
            expect(friendsAges).to.deep.equal(expectedResult);
        });
    });

    describe("#sequenceEqual()", () => {
        test("should return false for dictionaries with different sizes", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<number, string>();
            dict1.add(1, "a");
            dict2.add(1, "a");
            dict2.add(2, "b");
            expect(dict1.sequenceEqual(dict2)).to.eq(false);
        });
        test("should return true if dictionaries have members in the same order", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<number, string>();
            dict1.add(1, "a");
            dict1.add(2, "b");
            dict2.add(1, "a");
            dict2.add(2, "b");
            expect(dict1.sequenceEqual(dict2)).to.eq(true);
        });
        test("should return true if dictionaries have members in the same order", () => {
            const dict1 = new Dictionary<number, Person>();
            const dict2 = new Dictionary<number, Person>();
            dict1.add(1, Person.Alice);
            dict1.add(2, Person.Lucrezia);
            dict2.add(1, Person.Alice);
            dict2.add(2, Person.Lucrezia);
            expect(dict1.sequenceEqual(dict2, (p1, p2) => p1.value.name === p2.value.name)).to.eq(true);
        });
    });

    describe("#set()", () => {
        const dict = new Dictionary<string, number>();
        dict.add("one", 1);
        dict.add("two", 2);
        test("should throw error if key is not found", () => {
            expect(() => dict.set("three", 3)).toThrowError(new KeyNotFoundException("three"));
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
        test("should work properly with boolean values", () => {
            const boolDict = new Dictionary<string, boolean>();
            boolDict.add("first", true);
            boolDict.add("second", false);

            boolDict.set("first", false);
            expect(boolDict.get("first")).to.eq(false);

            boolDict.set("second", true);
            expect(boolDict.get("second")).to.eq(true);
        });
    });

    describe("#shuffle()", () => {
        test("should shuffle the dictionary", () => {
            const dictionary = new Dictionary<number, string>();
            dictionary.add(1, "a");
            dictionary.add(2, "b");
            dictionary.add(3, "c");
            dictionary.add(4, "d");
            dictionary.add(5, "e");
            dictionary.add(6, "f");
            dictionary.add(7, "g");
            dictionary.add(8, "h");
            dictionary.add(9, "i");
            dictionary.add(10, "j");
            const shuffled = dictionary.shuffle();
            expect(shuffled.count()).to.eq(10);
            expect(shuffled.sequenceEqual(dictionary)).to.eq(false);
        });
    });

    describe("#single", () => {
        test("should throw error if dictionary is empty", () => {
            const dict = new Dictionary();
            expect(() => dict.single()).toThrow(new NoElementsException());
        });
        test("should throw error if dictionary has more than one elements and no predicate is provided", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "b");
            expect(() => dict.single()).toThrowError(new MoreThanOneElementException());
        });
        test("should return the only element in the dictionary", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            const single = dict.single();
            expect(single.equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
        });
        test("should throw error if no matching element is found", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Hanna.name, Person.Hanna);
            dict.add(Person.Noemi.name, Person.Noemi);
            expect(() => dict.single(p => p.key === "Lenka")).toThrowError(new NoMatchingElementException());
        });
        test("should return person with name 'Priscilla'", () => {
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
        test("should return null if dictionary is empty", () => {
            const dict = new Dictionary();
            expect(dict.singleOrDefault()).to.eq(null);
        });
        test("should throw error if dictionary has more than one elements and no predicate is provided", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "b");
            expect(() => dict.singleOrDefault()).toThrowError(new MoreThanOneElementException());
        });
        test("should return the only element in the dictionary", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            const single = dict.singleOrDefault() as KeyValuePair<number, string>;
            expect(single.equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
        });
        test("should throw error if there are more than one matching elements", () => {
            const dict = new Dictionary<number, string>();
            dict.add(1, "a");
            dict.add(2, "a");
            expect(() => dict.singleOrDefault(p => p.value === "a")).toThrowError(new MoreThanOneMatchingElementException());
        });
        test("should return null if no matching element is found", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Hanna.name, Person.Hanna);
            dict.add(Person.Noemi.name, Person.Noemi);
            expect(dict.singleOrDefault(p => p.key === "Lenka")).to.eq(null);
        });
        test("should return person with name 'Priscilla'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const single = dict.singleOrDefault(p => p.key === "Priscilla") as KeyValuePair<string, Person>;
            expect(single.key).eq(Person.Priscilla.name)
            expect(single.value).to.eq(Person.Priscilla);
        });
    });

    describe("#size()", () => {
        const dictionary = new Dictionary<string, string>();
        dictionary.add(Person.Mel.name, Person.Mel.surname);
        dictionary.add(Person.Lenka.name, Person.Lenka.surname);
        dictionary.add(Person.Jane.name, Person.Jane.surname);
        test("should return the size of the dictionary()", () => {
            expect(dictionary.size()).to.eq(3);
        });
    });

    describe("#skip()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
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
        test("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skip(100).toDictionary(p => p.key, p => p.value);
            expect(people.size()).to.eq(0);
        });
    });

    describe("#skipLast()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
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
        test("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.skipLast(100).toDictionary(p => p.key, p => p.value);
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
        test("should return a dictionary with keys [8000, 9000]", () => {
            const dict2 = dict.skipWhile((p) => p.key <= 6500).toDictionary<number, Person>(p => p.key, p => p.value);
            const keys = dict2.select(p => p.key).toArray();
            expect(keys.length).to.eq(6);
            // expect(keys).to.have.all.members([8000, 6500, 9000, 4000, 1500, 5500]);
            expect(keys).to.have.all.members([1500, 4000, 5500, 6500, 8000, 9000]);
        });
    });

    describe("#span()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Rui.name, Person.Rui);
            dict.add(Person.Setsuna.name, Person.Setsuna);
            dict.add(Person.Ayana.name, Person.Ayana);
            const [group1, group2] = dict.span(p => p.key.localeCompare("Setsuna") !== 0);
            const group1Keys = group1.select(p => p.key).toArray();
            const group2Keys = group2.select(p => p.key).toArray();
            expect(group1Keys).to.deep.equal(["Alice", "Rui"]);
            expect(group2Keys).to.deep.equal(["Setsuna", "Ayana"]);
        });
    });

    describe("#sum()", () => {
        const dict = new Dictionary<number, Person>();
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
            expect(() => dict.sum()).toThrow(new NoElementsException());
        });
    })

    describe("#take()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
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
        test("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.take(100).toDictionary(p => p.key, p => p.value);
            expect(people.size()).to.eq(4);
        });
    });

    describe("#takeLast()", () => {
        test("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
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
        test("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(Person.Alice.name, Person.Alice);
            dict.add(Person.Noemi.name, Person.Noemi);
            dict.add(Person.Priscilla.name, Person.Priscilla);
            dict.add(Person.Vanessa.name, Person.Vanessa);
            const people = dict.takeLast(100).toDictionary(p => p.key, p => p.value);
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
        test("should return a dictionary with keys [apple, banana, mango]", () => {
            const dict2 = dict.takeWhile(p => p.key.localeCompare("orange") !== 0).toDictionary<string, number>(p => p.key, p => p.value);
            expect(dict2.size()).to.eq(3);
            const fruits = dict2.select(p => p.key).toArray();
            expect(fruits).to.deep.equal(["apple", "banana", "mango"]);
        });
    });

    describe("#thenBy()", () => {
        test("should order people by age [asc] then by name [desc] then by surname [asc]", () => {
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
        test("should be ignored if followed by an orderBy", () => {
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
        test("should order people by age [desc] then by name [desc] then by surname [asc]", () => {
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
        test("should be ignored if followed by an orderBy", () => {
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
        test("should have the same size as dictionary", () => {
            expect(dict.size()).to.eq(people.length);
            expect(dict.length).to.eq(people.length);
        });
        test("should have the same order as dictionary", () => { // ordered due to RedBlackTree
            expect(people[0].value).to.eq(Person.Lucrezia);
            expect(people[1].value).to.eq(Person.Vanessa);
            expect(people[2].value).to.eq(Person.Alice);
        });
    });

    describe("#toCircularLinkedList()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const list = dictionary.toCircularLinkedList();
        test("should create a new KeyValuePair circular linked list", () => {
            expect(list.size()).to.eq(dictionary.size());
            expect(list.get(0).equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
            expect(list.get(1).equals(new KeyValuePair<number, string>(2, "b"))).to.eq(true);
            expect(list instanceof CircularLinkedList).to.be.true;
            expect(list.length).to.eq(dictionary.length);
        });
    });

    describe("#toDictionary()", () => {
        const dict = new Dictionary<string, Person>();
        dict.add(Person.Lucrezia.name, Person.Lucrezia);
        dict.add(Person.Vanessa.name, Person.Vanessa);
        dict.add(Person.Alice.name, Person.Alice);
        const people = dict.toDictionary(p => p.value.name, p => p);
        test("should have the same size as dictionary", () => {
            expect(dict.size()).to.eq(people.size());
            expect(dict.length).to.eq(people.length);
            expect(people instanceof Dictionary).to.be.true;
        });
        test("should have the same order as dictionary", () => { // ordered due to RedBlackTree
            const array = people.values().toArray();
            expect(array[0].value).to.eq(Person.Lucrezia);
            expect(array[1].value).to.eq(Person.Vanessa);
            expect(array[2].value).to.eq(Person.Alice);
        });
    });

    describe("#toEnumerableSet()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(2, "b");
        dictionary.add(1, "a");
        test("should create a new sorted set", () => {
            const set = dictionary.toEnumerableSet();
            expect(set instanceof EnumerableSet).to.be.true;
            expect(set.size()).to.eq(dictionary.size());
            expect(set.toArray().map(p => p.value)).to.deep.eq(["b", "a"]);
        });
    });

    describe("#toImmutableDictionary()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const dict = dictionary.toImmutableDictionary(p => p.key, p => p.value);
        test("should create a new immutable dictionary", () => {
            expect(dict instanceof ImmutableDictionary).to.be.true;
            expect(dict.size()).to.eq(dictionary.size());
            expect(dict.toArray().map(p => p.value)).to.deep.eq(["a", "b"]);
        });
        test("should be immutable", () => {
            const dict2 = dict.add(3, "c");
            expect(dict.size()).to.eq(dictionary.size());
            expect(dict2.size()).to.eq(dictionary.size() + 1);
            expect(dict2.toArray().map(p => p.value)).to.deep.eq(["a", "b", "c"]);
            expect(dict2 instanceof ImmutableDictionary).to.be.true;
            expect(dict2.length).to.eq(dictionary.length + 1);
            expect(dict2).to.not.eq(dict);
        });
    });

    describe("#toImmutableList()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const list = dictionary.toImmutableList();
        test("should create a new immutable KeyValuePair list", () => {
            expect(list.size()).to.eq(dictionary.size());
            expect(list.get(0).equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
            expect(list.get(1).equals(new KeyValuePair<number, string>(2, "b"))).to.eq(true);
            expect(list instanceof ImmutableList).to.be.true;
            expect(list.length).to.eq(dictionary.length);
        });
        test("should be immutable", () => {
            const list2 = list.add(new KeyValuePair<number, string>(3, "c"));
            expect(list2.size()).to.eq(dictionary.size() + 1);
            expect(list2.get(2).equals(new KeyValuePair<number, string>(3, "c"))).to.eq(true);
            expect(list2 instanceof ImmutableList).to.be.true;
            expect(list2.length).to.eq(dictionary.length + 1);
            expect(list2).to.not.eq(list);
        });
    });

    describe("#toImmutableQueue()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const queue = dictionary.toImmutableQueue();
        const expectedQueueItems = [
            new KeyValuePair(1, "a"),
            new KeyValuePair(2, "b")
        ]
        test("should create a new immutable queue", () => {
            expect(queue instanceof ImmutableQueue).to.be.true;
            expect(queue.size()).to.eq(dictionary.size());
            expect(queue.toArray()).to.deep.eq(expectedQueueItems);
        });
        test("should be immutable", () => {
            const queue2 = queue.enqueue(new KeyValuePair<number, string>(3, "c"));
            expect(queue.size()).to.eq(dictionary.size());
            expect(queue2.size()).to.eq(dictionary.size() + 1);
            expect(queue2 instanceof ImmutableQueue).to.be.true;
            expect(queue2.length).to.eq(dictionary.length + 1);
            expect(queue2).to.not.eq(queue);
            const expectedQueueItems2 = [
                ...expectedQueueItems,
                new KeyValuePair(3, "c")
            ];
            expect(queue2.toArray()).to.deep.eq(expectedQueueItems2);
        });
    });

    describe("#toImmutableSet()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const set = dictionary.toImmutableSet();
        test("should create a new immutable set", () => {
            expect(set instanceof ImmutableSet).to.be.true;
            expect(set.size()).to.eq(dictionary.size());
            expect(set.toArray().map(p => p.value)).to.deep.eq(["a", "b"]);
        });
        test("should be immutable", () => {
            const set2 = set.add(new KeyValuePair<number, string>(3, "c"));
            expect(set.size()).to.eq(dictionary.size());
            expect(set2.size()).to.eq(dictionary.size() + 1);
            expect(set2.toArray().map(p => p.value)).to.deep.eq(["a", "b", "c"]);
            expect(set2 instanceof ImmutableSet).to.be.true;
            expect(set2.length).to.eq(dictionary.length + 1);
            expect(set2).to.not.eq(set);
        });
    });

    describe("#toImmutableSortedDictionary()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(2, "b");
        dictionary.add(1, "a");
        const dict = dictionary.toImmutableSortedDictionary(p => p.key, p => p.value);
        test("should create a new immutable sorted dictionary", () => {
            expect(dict instanceof ImmutableSortedDictionary).to.be.true;
            expect(dict.size()).to.eq(dictionary.size());
            expect(dict.toArray().map(p => p.value)).to.deep.eq(["a", "b"]);
        });
        test("should be immutable", () => {
            const dict2 = dict.add(3, "c");
            expect(dict.size()).to.eq(dictionary.size());
            expect(dict2.size()).to.eq(dictionary.size() + 1);
            expect(dict2.toArray().map(p => p.value)).to.deep.eq(["a", "b", "c"]);
            expect(dict2 instanceof ImmutableSortedDictionary).to.be.true;
            expect(dict2.length).to.eq(dictionary.length + 1);
            expect(dict2).to.not.eq(dict);
        });
    });

    describe("#toImmutableSortedSet()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const set = dictionary.toImmutableSortedSet((a, b) => a.value.localeCompare(b.value));
        test("should create a new immutable sorted set", () => {
            expect(set instanceof ImmutableSortedSet).to.be.true;
            expect(set.size()).to.eq(dictionary.size());
            expect(set.toArray().map(p => p.value)).to.deep.eq(["a", "b"]);
        });
        test("should be immutable", () => {
            const set2 = set.add(new KeyValuePair<number, string>(3, "c"));
            expect(set.size()).to.eq(dictionary.size());
            expect(set2.size()).to.eq(dictionary.size() + 1);
            expect(set2.toArray().map(p => p.value)).to.deep.eq(["a", "b", "c"]);
            expect(set2 instanceof ImmutableSortedSet).to.be.true;
            expect(set2.length).to.eq(dictionary.length + 1);
            expect(set2).to.not.eq(set);
        });
    });

    describe("#toImmutableStack()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const stack = dictionary.toImmutableStack();
        const expectedStackItems = [
            new KeyValuePair(2, "b"),
            new KeyValuePair(1, "a")
        ];
        test("should create a new immutable stack", () => {
            expect(stack instanceof ImmutableStack).to.be.true;
            expect(stack.size()).to.eq(dictionary.size());
            expect(stack.toArray()).to.deep.eq(expectedStackItems);
        });
        test("should be immutable", () => {
            const stack2 = stack.push(new KeyValuePair<number, string>(3, "c"));
            expect(stack.size()).to.eq(dictionary.size());
            expect(stack2.size()).to.eq(dictionary.size() + 1);
            expect(stack2 instanceof ImmutableStack).to.be.true;
            expect(stack2.length).to.eq(dictionary.length + 1);
            expect(stack2).to.not.eq(stack);
            const expectedStackItems2 = [
                new KeyValuePair(3, "c"), // reversed
                ...expectedStackItems
            ];
            expect(stack2.toArray()).to.deep.eq(expectedStackItems2);
        });
    });

    describe("#toLinkedList()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const list = dictionary.toLinkedList();
        test("should create a new KeyValuePair list", () => {
            expect(list.size()).to.eq(dictionary.size());
            expect(list.get(0).equals(new KeyValuePair<number, string>(1, "a"))).to.eq(true);
            expect(list.get(1).equals(new KeyValuePair<number, string>(2, "b"))).to.eq(true);
            expect(list instanceof LinkedList).to.be.true;
            expect(list.length).to.eq(dictionary.length);
        });
    });

    describe("#toList()", () => {
        const dictionary = new Dictionary<number, string>();
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

    describe("#toMap()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const map = dictionary.toMap(p => Math.pow(p.key, 2), p => p.value + p.value);
        test("should create a new Map", () => {
            expect(map instanceof Map).to.be.true;
            expect(map.size).to.eq(dictionary.size());
            expect(map.get(1)).to.eq("aa");
            expect(map.get(4)).to.eq("bb");
        });
    });

    describe("#toObject()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const obj = dictionary.toObject(p => p.key * 10, p => p.value);
        test("should create a new object", () => {
            expect(obj).to.deep.equal({10: "a", 20: "b"});
        });
    });

    describe("#toPriorityQueue()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(70, "a");
        dictionary.add(5, "b");
        dictionary.add(0, "c");
        dictionary.add(14, "d");
        dictionary.add(20, "e");
        dictionary.add(65, "f");
        dictionary.add(12, "g");
        dictionary.add(37, "h");
        const queue = dictionary.toPriorityQueue((a, b) => a.key - b.key);
        test("should create a new min priority queue", () => {
            const expectedQueueItems = [
                new KeyValuePair(0, "c"),
                new KeyValuePair(14, "d"),
                new KeyValuePair(5, "b"),
                new KeyValuePair(37, "h"),
                new KeyValuePair(20, "e"),
                new KeyValuePair(65, "f"),
                new KeyValuePair(12, "g"),
                new KeyValuePair(70, "a")
            ];
            expect(queue instanceof PriorityQueue).to.be.true;
            expect(queue.size()).to.eq(dictionary.size());
            expect(queue.toArray()).to.deep.eq(expectedQueueItems);
        });
        test("should create a new max priority queue", () => {
            const queue = dictionary.toPriorityQueue((a, b) => b.key - a.key);
            const expectedQueueItems = [
                new KeyValuePair(70, "a"),
                new KeyValuePair(37, "h"),
                new KeyValuePair(65, "f"),
                new KeyValuePair(20, "e"),
                new KeyValuePair(14, "d"),
                new KeyValuePair(0, "c"),
                new KeyValuePair(12, "g"),
                new KeyValuePair(5, "b")
            ];
            expect(queue instanceof PriorityQueue).to.be.true;
            expect(queue.size()).to.eq(dictionary.size());
            expect(queue.toArray()).to.deep.eq(expectedQueueItems);
        });
    });

    describe("#toQueue()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const queue = dictionary.toQueue();
        const expectedQueueItems = [
            new KeyValuePair(1, "a"),
            new KeyValuePair(2, "b")
        ];
        test("should create a new queue", () => {
            expect(queue instanceof Queue).to.be.true;
            expect(queue.size()).to.eq(dictionary.size());
            expect(queue.toArray()).to.deep.eq(expectedQueueItems);
        });
    });

    describe("#toSet()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const set = dictionary.toSet();
        test("should create a new set", () => {
            const expectedSetItems = [
                new KeyValuePair(1, "a"),
                new KeyValuePair(2, "b")
            ];
            expect(set instanceof Set).to.be.true;
            expect(set.size).to.eq(dictionary.size());
            expect(Array.from(set)).to.deep.eq(expectedSetItems);
        });
    });

    describe("#toSortedDictionary()", () => {
        const dictionary = new Dictionary<number, string>();
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

    describe("#toSortedSet()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        test("should create a new sorted set", () => {
            const set = dictionary.toSortedSet((a, b) => a.value.localeCompare(b.value));
            expect(set.size()).to.eq(dictionary.size());
            expect(set.toArray().map(p => p.value)).to.deep.eq(["a", "b"]);
        });
    });

    describe("#toStack()", () => {
        const dictionary = new Dictionary<number, string>();
        dictionary.add(1, "a");
        dictionary.add(2, "b");
        const stack = dictionary.toStack();
        const expectedStackItems = [
            new KeyValuePair(2, "b"),
            new KeyValuePair(1, "a")
        ];
        test("should create a new stack", () => {
            expect(stack instanceof Stack).to.be.true;
            expect(stack.size()).to.eq(dictionary.size());
            expect(stack.toArray()).to.deep.eq(expectedStackItems);
        });
    });

    describe("#toString()", () => {
        test("should return a string representation", () => {
            const dictionary = new Dictionary<number, string>();
            dictionary.add(1, "a");
            dictionary.add(2, "b");
            dictionary.add(3, "c");
            expect(dictionary.toString()).to.eq("{ 1: a, 2: b, 3: c }");
        });
        test("should return a string representation with custom selector", () => {
            const dictionary = new Dictionary<number, string>();
            dictionary.add(1, "a");
            dictionary.add(2, "b");
            dictionary.add(3, "c");
            expect(dictionary.toString(p => p.value)).to.eq("{ a, b, c }");
        });
        test("should return a string representation with custom selector #2", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
            dictionary.add(Person.Vanessa.name, Person.Vanessa);
            dictionary.add(Person.Alice.name, Person.Alice);
            expect(dictionary.toString(p => p.value.name)).to.eq("{ Lucrezia, Vanessa, Alice }");
        });
    });

    describe("#tryAdd()", () => {
        const dictionary = new Dictionary<string, string>();
        dictionary.add(Person.Alice.name, Person.Alice.name);
        dictionary.add(Person.Hanna.name, Person.Hanna.name);
        test("should not throw if key already exists", () => {
            expect(() => dictionary.add(Person.Alice.name, "Alicia")).toThrowError(new InvalidArgumentException(`Key already exists: ${Person.Alice.name}`));
            expect(() => dictionary.tryAdd(Person.Alice.name, "Alicia")).to.not.throw;
        });
        test("should return true if key doesn't exist and item is added", () => {
            expect(dictionary.tryAdd(Person.Suzuha.name, Person.Suzuha.name)).to.eq(true);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.length).to.eq(3);
        });
        test("should return true if key already exists and item is not added", () => {
            expect(dictionary.tryAdd(Person.Alice.name, Person.Alice.name)).to.eq(false);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.length).to.eq(3);
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
        dict3.add(7, "g");

        test("should return a dictionary with unique key value pairs", () => {
            const union1 = dict1.union(dict3).toDictionary<number, string>(p => p.key, p => p.value);
            expect(union1.size()).to.eq(6);
        });

        test("should not throw errors if keys are duplicate and values are equal", () => {
            const union = dict1.union(dict2).toDictionary<number, string>(p => p.key, p => p.value);
            expect(union.size()).to.eq(5);
            expect(union.get(2)).to.eq("b");
            expect(() => dict1.union(dict2).toDictionary<number, string>(p => p.key, p => p.value)).to.not.throw();
        });

        test("should throw error if key already exists and key value pairs are not equal", () => {
            const dict4 = new Dictionary<number, string>();
            dict4.add(1, "z");
            expect(() => dict1.union(dict4).toDictionary(p => p.key, p => p.value)).toThrowError(new InvalidArgumentException(`Key already exists: 1`));
        });
    });

    describe("#unionBy()", () => {
        const dict1 = new Dictionary<string, Person>();
        const dict2 = new Dictionary<string, Person>();

        dict1.add(Person.Alice.name, Person.Alice);
        dict1.add(Person.Noemi.name, Person.Noemi);

        dict2.add(Person.Alice.name, Person.Alice);
        dict2.add(Person.Priscilla.name, Person.Priscilla);

        test("should return a dictionary with unique key value pairs", () => {
            const union = dict1.unionBy(dict2, p => p.key).toDictionary<string, Person>(p => p.key, p => p.value);
            expect(union.size()).to.eq(3);
            expect(union.get(Person.Alice.name)).to.not.null;
            expect(union.get(Person.Noemi.name)).to.not.null;
            expect(union.get(Person.Priscilla.name)).to.not.null;
        });
    });

    describe("#values()", () => {
        const dictionary = new Dictionary<number, Person>();
        dictionary.add(Person.Senna.age, Person.Senna);
        dictionary.add(Person.Alice.age, Person.Alice);
        dictionary.add(Person.Mel.age, Person.Mel);
        dictionary.add(Person.Lenka.age, Person.Lenka);
        test("should return a list with mapped values", () => {
            const values = dictionary.values().toArray();
            expect(values).to.deep.equal([Person.Senna, Person.Alice, Person.Mel, Person.Lenka]); // sorted by age due to RedBlackTree
            expect(dictionary.values().length).to.eq(4);
        });
    });

    describe("#where()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(Person.Alice.name, Person.Alice);
        dictionary.add(Person.Lucrezia.name, Person.Lucrezia);
        dictionary.add(Person.Noemi.name, Person.Noemi);
        dictionary.add(Person.Priscilla.name, Person.Priscilla);
        test("should return a dictionary with people who are younger than 10", () => {
            const dict = dictionary.where(p => p.value.age < 10).toDictionary<string, Person>(p => p.key, p => p.value);
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
                [new KeyValuePair<number, string>(1, "a"), new KeyValuePair<number, string>(5, "e")],
                [new KeyValuePair<number, string>(2, "b"), new KeyValuePair<number, string>(2, "FF")]
            ];
            expect(expectedResult.length).to.eq(result.length);
            for (let ix = 0; ix < result.length; ++ix) {
                expect(result[ix][0].equals(expectedResult[ix][0])).to.eq(true);
                expect(result[ix][1].equals(expectedResult[ix][1])).to.eq(true);
            }
        });
        test("should return a zipped list with size of 2", () => {
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
            expect(result.get(1)).to.eq("two two");
            expect(result.get(2)).to.eq("three three");
        });
    });
});
