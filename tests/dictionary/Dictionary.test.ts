import {describe} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {Dictionary} from "../../src/dictionary/Dictionary";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {KeyValuePair} from "../../src/dictionary/KeyValuePair";
import {EqualityComparator} from "../../src/shared/EqualityComparator";

describe("Dictionary", () => {
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
        const dictionary = new Dictionary<number, string>();
        dictionary.put(1, "a");
        dictionary.put(2, "b");
        dictionary.put(3, "c");
        dictionary.put(4, "d");
        dictionary.put(5, "e");
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
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should not have any person who is older than 29", () => {
            const all = dictionary.all(p => p.value.Age > 29);
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
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should have a person with age 29", () => {
            const any = dictionary.any(p => p.value.Age === 29);
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
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should append the new element and return a new dictionary", () => {
            const dict2 = dictionary.append(new KeyValuePair<string, Person>(reina.Name, reina)).toDictionary(p => p.key, p => p.value);
            expect(dict2.get("Reina")).to.not.null;
            expect(dict2.get("Reina")).to.eq(reina);
            expect(dict2.size()).to.eq(5);
            expect(dictionary.size()).to.eq(4);
            expect(dictionary.get("Reina")).to.null;
            expect(dict2 === dictionary).to.eq(false);
        });
    });
    describe("#average()", () => {
        const dict = new Dictionary<string, number>();
        dict.put("A", 1);
        dict.put("B", 101);
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
            dictionary.put("a", 1);
            dictionary.put("b", 2);
            dictionary.clear();
            expect(dictionary.size()).to.eq(0);
            expect(dictionary.get("a")).to.null;
            expect(dictionary.get("b")).to.null;
        });
    });
    describe("#concat()", () => {
        const dictionary1 = new Dictionary<string, Person>();
        dictionary1.put(alice.Name, alice);
        dictionary1.put(lucrezia.Name, lucrezia);
        const dictionary2 = new Dictionary<string, Person>();
        dictionary2.put(noemi.Name, noemi);
        dictionary2.put(priscilla.Name, priscilla);
        it("should return with a dictionary which contains four people", () => {
            const dict = dictionary1.concat(dictionary2).toDictionary();
            expect(dict.size()).to.eq(4);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Noemi")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            expect(dict.get("Priscilla")).to.not.null;
        });
    });
    describe("#contains()", () => {
        const personComparator: EqualityComparator<KeyValuePair<string, Person>>
            = (p1, p2) => p1.value.Name === p2.value.Name;
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should contain 'Noemi'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(noemi.Name, noemi), personComparator)).to.eq(true);
        });
        it("should contain 'Lucrezia'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(lucrezia.Name, lucrezia), personComparator)).to.eq(true);
        });
        it("should not contain 'Olga'", () => {
            expect(dictionary.contains(new KeyValuePair<string, Person>(olga.Name, olga), personComparator)).to.eq(false);
        });
    });
    describe("#count()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should return 4", () => {
            expect(dictionary.count()).to.eq(4);
        });
        it("should return 3", () => {
            const count = dictionary.count(p => p.value.Age > 9);
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
            const dict = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(alice.Name, alice)).toDictionary<string, Person>();
            const single = dictionary.defaultIfEmpty(new KeyValuePair<string, Person>(lucrezia.Name, lucrezia)).single();
            expect(dict instanceof Dictionary).to.eq(true);
            expect(dict.size()).to.eq(1);
            expect(dict.get(alice.Name)).to.not.null;
            expect(single.value).to.eq(lucrezia);
        });
    });
    describe("#distinct()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        it("should return a new dictionary which is identical to the source dictionary", () => {
            const dict = dictionary.distinct().toDictionary<string, Person>();
            expect(dict === dictionary).to.eq(false);
            expect(dict.get("Alice")).to.not.null;
            expect(dict.get("Lucrezia")).to.not.null;
            console.log("distinct operation on a dictionary has no effect since dictionary is innately distinct.");
        });
    });
    describe("#elementAt()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        it("should return 'Lucrezia'", () => {
            const person = dictionary.elementAt(1);
            expect(person.value).to.eq(lucrezia);
        });
        it("should throw error if index is out of bounds", () => {
            expect(() => dictionary.elementAt(100)).to.throw();
            expect(() => dictionary.elementAt(-1)).to.throw();
        });
    });
    describe("#elementAtOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        it("should return 'Lucrezia'", () => {
            const person = dictionary.elementAtOrDefault(1);
            expect(person.value).to.eq(lucrezia);
        });
        it("should return null if index is out of bounds", () => {
            expect(dictionary.elementAtOrDefault(100)).to.eq(null);
            expect(dictionary.elementAtOrDefault(-1)).to.eq(null);
        });
    });
    describe("#except()", () => {
        const dict1 = new Dictionary<number, string>();
        const dict2 = new Dictionary<number, string>();
        dict1.put(1, "a");
        dict1.put(2, "b");
        dict1.put(3, "c");
        dict1.put(4, "d");
        dict2.put(5, "e");
        dict2.put(2, "b");
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
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should throw error if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(() => dict.first()).to.throw(ErrorMessages.NoElements);
        });
        it("should return the first element if no predicate is provided", () => {
            expect(dictionary.first().equals(new KeyValuePair<string, Person>(alice.Name, alice))).to.eq(true);
        });
        it("should throw an error if no matching element is found", () => {
            expect(() => dictionary.first(p => p.value.Name === "Suzuha")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return a person with name 'Noemi'", () => {
            const first = dictionary.first(p => p.value.Name === 'Noemi');
            expect(first.value).to.eq(noemi);
        });
    });
    describe("#firstOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should return null if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(dict.firstOrDefault()).to.eq(null);
        });
        it("should return the first element if no predicate is provided", () => {
            expect(dictionary.firstOrDefault().equals(new KeyValuePair<string, Person>(alice.Name, alice))).to.eq(true);
        });
        it("should return null if no matching element is found", () => {
            expect(dictionary.firstOrDefault(p => p.value.Name === "Suzuha")).to.eq(null);
        });
        it("should return a person with name 'Noemi'", () => {
            const first = dictionary.firstOrDefault(p => p.value.Name === 'Noemi');
            expect(first.value).to.eq(noemi);
        });
    });
    describe("#get()", () => {
        const dictionary = new Dictionary<Person, number>();
        it("should get the value which belongs to the given key", () => {
            dictionary.put(alice, alice.Age);
            dictionary.put(mel, mel.Age);
            dictionary.put(senna, senna.Age);
            expect(dictionary.get(alice)).to.eq(alice.Age);
            expect(dictionary.get(mel)).to.eq(mel.Age);
            expect(dictionary.get(senna)).to.eq(senna.Age);
        });
        it("should return null if key is not in the dictionary", () => {
            expect(dictionary.get(jane)).to.be.null;
        });
    });
    describe("#isEmpty()", () => {
        it("should return true if dictionary is empty", () => {
            const dictionary = new Dictionary<number, string>();
            expect(dictionary.isEmpty()).to.eq(true);
        });
        it("should return false if dictionary is not empty", () => {
            const dictionary = new Dictionary<number, string>();
            dictionary.put(1, "a");
            expect(dictionary.isEmpty()).to.eq(false);
        });
    });
    describe("#keys()", () => {
        it("should return a set containing keys", () => {
            const dictionary = new Dictionary<number, Person>();
            dictionary.put(alice.Age, alice);
            dictionary.put(jane.Age, jane); // age 16
            dictionary.put(lenka.Age, lenka); // age 16
            const keySet = dictionary.keys();
            expect(keySet.size()).to.eq(2);
            expect(keySet.includes(alice.Age)).to.eq(true);
            expect(keySet.includes(lenka.Age)).to.eq(true);
            expect(keySet.includes(jane.Age)).to.eq(true);
            console.log(dictionary.values().toArray());
        });
    });
    describe("#last()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(noemi2.Name, noemi2);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should throw error if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(() => dict.last()).to.throw(ErrorMessages.NoElements);
        });
        it("should return the last element if no predicate is provided", () => {
            expect(dictionary.last().equals(new KeyValuePair<string, Person>(priscilla.Name, priscilla))).to.eq(true);
        });
        it("should throw an error if no matching element is found", () => {
            expect(() => dictionary.last(p => p.value.Name === "Suzuha")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return a person with name 'Noemi' with age 29", () => {
            const last = dictionary.last(p => p.value.Name === 'Noemi');
            expect(last.value).to.eq(noemi);
            expect(last.value.Age).to.eq(29);
        });
    });
    describe("#lastOrDefault()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(noemi2.Name, noemi2);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should return null if dictionary is empty()", () => {
            const dict = new Dictionary<number, number>();
            expect(dict.lastOrDefault()).to.eq(null);
        });
        it("should return the last element if no predicate is provided", () => {
            expect(dictionary.lastOrDefault().equals(new KeyValuePair<string, Person>(priscilla.Name, priscilla))).to.eq(true);
        });
        it("should return null if no matching element is found", () => {
            expect(dictionary.lastOrDefault(p => p.value.Name === "Suzuha")).to.eq(null);
        });
        it("should return a person with name 'Noemi'", () => {
            const last = dictionary.lastOrDefault(p => p.value.Name === 'Noemi');
            expect(last.value).to.eq(noemi);
            expect(last.value.Age).to.eq(29);
        });
    });
    describe("#max()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should select return the maximum age", () => {
            const max = dictionary.max(p => p.value.Age);
            expect(max).to.eq(29);
        });
        it("should throw error if no selector is provided", () => {
            expect(() => dictionary.max()).to.throw(ErrorMessages.CannotConvertToNumber);
        });
    });
    describe("#min()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(alice.Name, alice);
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(noemi.Name, noemi);
        dictionary.put(priscilla.Name, priscilla);
        it("should select return the minimum age", () => {
            const max = dictionary.min(p => p.value.Age);
            expect(max).to.eq(9);
        });
        it("should throw error if no selector is provided", () => {
            expect(() => dictionary.min()).to.throw(ErrorMessages.CannotConvertToNumber);
        });
    });
    describe("#orderBy()", () => {
        it("should order dictionary by key [asc]", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.put(lucrezia.Name, lucrezia);
            dictionary.put(alice.Name, alice);
            dictionary.put(priscilla.Name, priscilla);
            dictionary.put(noemi.Name, noemi);
            const orderedArray = dictionary.orderBy(p => p.key).toDictionary<string, Person>().toArray();
            const expectedResult = [
                new KeyValuePair<string, Person>(alice.Name, alice),
                new KeyValuePair<string, Person>(lucrezia.Name, lucrezia),
                new KeyValuePair<string, Person>(noemi.Name, noemi),
                new KeyValuePair<string, Person>(priscilla.Name, priscilla)
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
            dictionary.put(lucrezia.Name, lucrezia);
            dictionary.put(alice.Name, alice);
            dictionary.put(priscilla.Name, priscilla);
            dictionary.put(noemi.Name, noemi);
            const orderedArray = dictionary.orderByDescending(p => p.key).toDictionary<string, Person>().toArray();
            const expectedResult = [
                new KeyValuePair<string, Person>(priscilla.Name, priscilla),
                new KeyValuePair<string, Person>(noemi.Name, noemi),
                new KeyValuePair<string, Person>(lucrezia.Name, lucrezia),
                new KeyValuePair<string, Person>(alice.Name, alice)
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
        it("should add item at the beginning of the dictionary", () => {
            const dictionary = new Dictionary<string, Person>();
            dictionary.put(alice.Name, alice);
            dictionary.put(lucrezia.Name, lucrezia);
            dictionary.put(noemi.Name, noemi);
            dictionary.put(priscilla.Name, priscilla);
            const dict2 = dictionary.prepend(new KeyValuePair<string, Person>(vanessa.Name, vanessa)).toDictionary<string, Person>();
            expect(dict2.size()).to.eq(5);
            expect(dict2.get(vanessa.Name)).to.not.null;
            expect(dict2.toArray()[0].key).eq(vanessa.Name);
        });
    });
    describe("#put()", () => {
        const dictionary = new Dictionary<string, number>();
        it("should put values into the dictionary", () => {
            dictionary.put("Amber", 1162621);
            dictionary.put("Barbara", 212121211);
            dictionary.put("Noelle", 1718615156);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.get("Amber")).to.not.undefined;
            expect(dictionary.get("Amber")).to.eq(1162621);
            expect(dictionary.get("Barbara")).to.not.undefined;
            expect(dictionary.get("Barbara")).to.eq(212121211);
            expect(dictionary.get("Noelle")).to.not.undefined;
            expect(dictionary.get("Noelle")).to.eq(1718615156);
        });
        it("should replace the existing value if key already exists", () => {
            dictionary.put("Amber", 1);
            expect(dictionary.size()).to.eq(3);
            expect(dictionary.get("Amber")).to.not.undefined;
            expect(dictionary.get("Amber")).to.eq(1);
        });
    });
    describe("#remove()", () => {
        const dictionary = new Dictionary<Person, string>();
        dictionary.put(jane, jane.Name);
        dictionary.put(mel, mel.Name);
        it("should remove the value from dictionary", () => {
            dictionary.remove(mel);
            expect(dictionary.size()).to.eq(1);
            expect(dictionary.get(jane)).to.not.null;
            expect(dictionary.get(mel)).to.null;
        });
        it("should return the value that is mapped to the given key", () => {
            const value = dictionary.remove(jane);
            expect(value).to.eq(jane.Name);
        });
        it("should return null if key is not in the dictionary", () => {
            const value = dictionary.remove(senna);
            expect(value).to.null;
        });
    });
    describe("#reverse()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(alice.Name, alice);
        dictionary.put(priscilla.Name, priscilla);
        dictionary.put(noemi.Name, noemi);
        it("should reverse the dictionary", () => {
            const dict = dictionary.reverse().toDictionary<string, Person>();
            expect(dict.toArray()[dict.size() - 1].key).to.eq(lucrezia.Name);
        });
    });
    describe("#select()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.put(lucrezia.Name, lucrezia);
        dictionary.put(alice.Name, alice);
        dictionary.put(priscilla.Name, priscilla);
        dictionary.put(noemi.Name, noemi);
        it("should select keys of dictionary and surname value from values", () => {
            const result = dictionary.select(p => [p.key, p.value.Surname]).toDictionary(p => p[0], p => p[1]);
            const expectedResult = [
                new KeyValuePair<string, string>(lucrezia.Name, lucrezia.Surname),
                new KeyValuePair<string, string>(alice.Name, alice.Surname),
                new KeyValuePair<string, string>(priscilla.Name, priscilla.Surname),
                new KeyValuePair<string, string>(noemi.Name, noemi.Surname)
            ];
            let index = 0;
            for(const person of result) {
                expect(person.equals(expectedResult[index])).to.eq(true);
                index++;
            }
        });
        it("should throw error if selector is undefined", () => {
            expect(() => dictionary.select(null).toList()).to.throw(ErrorMessages.NoSelectorProvided);
        });
    });
    describe("#size()", () => {
        const dictionary = new Dictionary<Person, string>();
        dictionary.put(mel, mel.Surname);
        dictionary.put(lenka, lenka.Surname);
        dictionary.put(jane, jane.Surname);
        it("should return the size of the dictionary()", () => {
            expect(dictionary.size()).to.eq(3);
        });
    });
    describe("#values()", () => {
        const dictionary = new Dictionary<number, Person>();
        dictionary.put(alice.Age, alice);
        dictionary.put(mel.Age, mel);
        dictionary.put(senna.Age, senna);
        dictionary.put(lenka.Age, lenka);
        it("should return a list with mapped values", () => {
            const values = dictionary.values().toArray();
            expect(values).to.deep.equal([alice, mel, senna, lenka]);
        });
    });
});
