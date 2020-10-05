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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        });
    });
    describe("#concat()", () => {
        const dictionary1 = new Dictionary<string, Person>();
        dictionary1.add(alice.Name, alice);
        dictionary1.add(lucrezia.Name, lucrezia);
        const dictionary2 = new Dictionary<string, Person>();
        dictionary2.add(noemi.Name, noemi);
        dictionary2.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
            dictionary.add(alice, alice.Age);
            dictionary.add(mel, mel.Age);
            dictionary.add(senna, senna.Age);
            expect(dictionary.get(alice)).to.eq(alice.Age);
            expect(dictionary.get(mel)).to.eq(mel.Age);
            expect(dictionary.get(senna)).to.eq(senna.Age);
        });
        it("should return null if key is not in the dictionary", () => {
            expect(dictionary.get(jane)).to.be.null;
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
    describe("#keys()", () => {
        it("should return a set containing keys", () => {
            const dictionary = new Dictionary<number, Person>();
            dictionary.add(alice.Age, alice);
            dictionary.add(jane.Age, jane);
            const keySet = dictionary.keys();
            expect(keySet.size()).to.eq(2);
            expect(keySet.includes(alice.Age)).to.eq(true);
            expect(keySet.includes(jane.Age)).to.eq(true);
            console.log(dictionary.values().toArray());
        });
    });
    describe("#last()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
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
            dictionary.add(lucrezia.Name, lucrezia);
            dictionary.add(alice.Name, alice);
            dictionary.add(priscilla.Name, priscilla);
            dictionary.add(noemi.Name, noemi);
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
            dictionary.add(lucrezia.Name, lucrezia);
            dictionary.add(alice.Name, alice);
            dictionary.add(priscilla.Name, priscilla);
            dictionary.add(noemi.Name, noemi);
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
            dictionary.add(alice.Name, alice);
            dictionary.add(lucrezia.Name, lucrezia);
            dictionary.add(noemi.Name, noemi);
            dictionary.add(priscilla.Name, priscilla);
            const dict2 = dictionary.prepend(new KeyValuePair<string, Person>(vanessa.Name, vanessa)).toDictionary<string, Person>();
            expect(dict2.size()).to.eq(5);
            expect(dict2.get(vanessa.Name)).to.not.null;
            expect(dict2.toArray()[0].key).eq(vanessa.Name);
        });
    });
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
        });
        it("should throw error if key already exists", () => {
            expect(() => dictionary.add("Amber", 1)).to.throw();
        });
    });
    describe("#remove()", () => {
        const dictionary = new Dictionary<Person, string>();
        dictionary.add(jane, jane.Name);
        dictionary.add(mel, mel.Name);
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
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(alice.Name, alice);
        dictionary.add(priscilla.Name, priscilla);
        dictionary.add(noemi.Name, noemi);
        it("should reverse the dictionary", () => {
            const dict = dictionary.reverse().toDictionary<string, Person>();
            expect(dict.toArray()[dict.size() - 1].key).to.eq(lucrezia.Name);
        });
    });
    describe("#select()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(alice.Name, alice);
        dictionary.add(priscilla.Name, priscilla);
        dictionary.add(noemi.Name, noemi);
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
    describe("#selectMany()", () => {
        it("should throw error if selector is undefined", () => {
            const dictionary = new Dictionary<Person, string>();
            expect(() => dictionary.selectMany(null)).to.throw(ErrorMessages.NoSelectorProvided);
        });
        it("should return a flattened array of friends' ages", () => {
            const dictionary = new Dictionary<string, Person>();
            viola.FriendsArray = [rebecca];
            jisu.FriendsArray = [alice, megan];
            vanessa.FriendsArray = [viola, lucrezia, reika];
            noemi.FriendsArray = [megan, olga];
            dictionary.add(viola.Name, viola);
            dictionary.add(jisu.Name, jisu);
            dictionary.add(vanessa.Name, vanessa);
            dictionary.add(noemi.Name, noemi);
            const friendsAges = dictionary.selectMany(p => p.value.FriendsArray).select(p => p.Age).toArray();
            const expectedResult = [17, 23, 44, 28, 21, 37, 44, 77];
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
        it("should return false if dictionaries don't have members in the same order", () => {
            const dict1 = new Dictionary<number, string>();
            const dict2 = new Dictionary<number, string>();
            dict1.add(1, "a");
            dict1.add(2, "b");
            dict2.add(2, "b");
            dict2.add(1, "a");
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
            dict1.add(1, alice);
            dict1.add(2, lucrezia);
            dict2.add(1, alice);
            dict2.add(2, lucrezia);
            expect(dict1.sequenceEqual(dict2, (p1, p2) => p1.value.Name === p2.value.Name)).to.eq(true);
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
            dict.add(alice.Name, alice);
            dict.add(hanna.Name, hanna);
            dict.add(noemi.Name, noemi);
            expect(() => dict.single(p => p.key === "Lenka")).to.throw(ErrorMessages.NoMatchingElement);
        });
        it("should return person with name 'Priscilla'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const single = dict.single(p => p.key === "Priscilla");
            expect(single.key).eq(priscilla.Name);
            expect(single.value).to.eq(priscilla);
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
            dict.add(alice.Name, alice);
            dict.add(hanna.Name, hanna);
            dict.add(noemi.Name, noemi);
            expect(dict.singleOrDefault(p => p.key === "Lenka")).to.eq(null);
        });
        it("should return person with name 'Priscilla'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const single = dict.singleOrDefault(p => p.key === "Priscilla");
            expect(single.key).eq(priscilla.Name);
            expect(single.value).to.eq(priscilla);
        });
    });
    describe("#size()", () => {
        const dictionary = new Dictionary<Person, string>();
        dictionary.add(mel, mel.Surname);
        dictionary.add(lenka, lenka.Surname);
        dictionary.add(jane, jane.Surname);
        it("should return the size of the dictionary()", () => {
            expect(dictionary.size()).to.eq(3);
        });
    });
    describe("#skip()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.skip(2).select(p => [p.key, p.value.Surname]).toArray();
            const expectedResult = [
                ["Priscilla", "Necci"],
                ["Vanessa", "Bloodboil"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.skip(100).toDictionary();
            expect(people.size()).to.eq(0);
        });
    });
    describe("#skipLast()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.skipLast(2).select(p => [p.key, p.value.Surname]).toArray();
            const expectedResult = [
                ["Alice", "Rivermist"],
                ["Noemi", "Waterfox"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return an empty dictionary if dictionary contains fewer than skipped elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.skipLast(100).toDictionary();
            expect(people.size()).to.eq(0);
        });
    });
    describe("#skipWhile()", () => {
        const dict = new Dictionary<number, Person>();
        dict.add(5000, alice);
        dict.add(2500, bella);
        dict.add(9000, emily);
        dict.add(8000, eliza);
        dict.add(6500, hanna);
        dict.add(4000, julia);
        dict.add(1500, megan);
        dict.add(5500, noemi);
        it("should throw error if predicate is null", () => {
            expect(() => dict.skipWhile(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return a dictionary with keys [4000, 1500, 5500]", () => {
            const dict2 = dict.skipWhile((p, px) => p.key > px * 1000).toDictionary<number, Person>();
            const keys = dict2.select(p => p.key).toArray();
            expect(keys).to.deep.equal([4000, 1500, 5500]);
        });
    });
    describe("#sum()", () => {
        const dict = new Dictionary<number, Person>();
        dict.add(5000, alice);
        dict.add(2500, bella);
        dict.add(9000, emily);
        dict.add(8000, eliza);
        it("should return ", () => {
            const sum = dict.sum(p => p.key);
            expect(sum).to.eq(24500);
        });
        it("should throw error if no selector is provided", () => {
            expect(() => dict.sum()).to.throw(ErrorMessages.CannotConvertToNumber);
        });
    })
    describe("#take()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.take(2).select(p => [p.key, p.value.Surname]).toArray();
            const expectedResult = [
                ["Alice", "Rivermist"],
                ["Noemi", "Waterfox"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.take(100).toDictionary();
            expect(people.size()).to.eq(4);
        });
    });
    describe("#takeLast()", () => {
        it("should return a dictionary with people 'Priscilla' and 'Vanessa'", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
            const people = dict.takeLast(2).select(p => [p.key, p.value.Surname]).toArray();
            const expectedResult = [
                ["Priscilla", "Necci"],
                ["Vanessa", "Bloodboil"]
            ];
            expect(people).to.deep.equal(expectedResult);
        });
        it("should return all elements if dictionary contains fewer than taken elements", () => {
            const dict = new Dictionary<string, Person>();
            dict.add(alice.Name, alice);
            dict.add(noemi.Name, noemi);
            dict.add(priscilla.Name, priscilla);
            dict.add(vanessa.Name, vanessa);
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
        it("should return a dictionary with keys [apple, banana, mango]", () => {
            const dict2 = dict.takeWhile(p => p.key.localeCompare("orange") !== 0).toDictionary<string, number>();
            expect(dict2.size()).to.eq(3);
            const fruits = dict2.select(p => p.key).toArray();
            expect(fruits).to.deep.equal(["apple", "banana", "mango"]);
        });
    });
    describe("#thenBy()", () => {
        it("should order people by age [asc] then by name [desc] then by surname [asc]", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, bella);
            dict.add(2, amy);
            dict.add(3, emily);
            dict.add(4, eliza);
            dict.add(5, hanna);
            dict.add(6, hanna2);
            dict.add(7, suzuha3);
            dict.add(8, julia);
            dict.add(9, lucrezia);
            dict.add(10, megan);
            dict.add(11, noemi);
            dict.add(12, olga);
            dict.add(13, priscilla);
            dict.add(14, reika);
            dict.add(15, suzuha);
            dict.add(16, suzuha2);
            dict.add(17, noemi2);
            const orderedPeople = dict.orderBy(p => p.value.Age)
                .thenBy(p => p.value.Name, (n1, n2) => n1.localeCompare(n2))
                .thenBy(p => p.value.Surname).toDictionary<number, Person>();
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
            for (const p of orderedPeople) {
                const personStr = `[${p.value.Age}] :: ${p.value.Name} ${p.value.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, bella);
            dict.add(2, amy);
            dict.add(3, emily);
            dict.add(4, eliza);
            dict.add(5, hanna);
            dict.add(6, hanna2);
            dict.add(7, suzuha3);
            dict.add(8, julia);
            dict.add(9, lucrezia);
            dict.add(10, megan);
            dict.add(11, noemi);
            dict.add(12, olga);
            dict.add(13, priscilla);
            dict.add(14, reika);
            dict.add(15, suzuha);
            dict.add(16, suzuha2);
            dict.add(17, noemi2);
            const orderedPeople = dict.orderBy(p => p.value.Age)
                .thenBy(p => p.value.Name, (n1, n2) => n1.localeCompare(n2))
                .thenByDescending(p => p.value.Surname)
                .orderBy(p => p.value.Age)
                .thenBy(p => p.value.Name).toDictionary<number, Person>();
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
                const personStr = `[${p.value.Age}] :: ${p.value.Name} ${p.value.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#thenByDescending()", () => {
        it("should order people by age [desc] then by name [desc] then by surname [asc]", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, bella);
            dict.add(2, amy);
            dict.add(3, emily);
            dict.add(4, eliza);
            dict.add(5, hanna);
            dict.add(6, hanna2);
            dict.add(7, suzuha3);
            dict.add(8, julia);
            dict.add(9, lucrezia);
            dict.add(10, megan);
            dict.add(11, noemi);
            dict.add(12, olga);
            dict.add(13, priscilla);
            dict.add(14, reika);
            dict.add(15, suzuha);
            dict.add(16, suzuha2);
            dict.add(17, noemi2);
            const orderedPeople = dict.orderByDescending(p => p.value.Age)
                .thenByDescending(p => p.value.Name, (n1, n2) => n1.localeCompare(n2))
                .thenByDescending(p => p.value.Surname).toDictionary<number, Person>();
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
            for (const p of orderedPeople) {
                const personStr = `[${p.value.Age}] :: ${p.value.Name} ${p.value.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
        it("should be ignored if followed by an orderBy", () => {
            const dict = new Dictionary<number, Person>();
            dict.add(1, bella);
            dict.add(2, amy);
            dict.add(3, emily);
            dict.add(4, eliza);
            dict.add(5, hanna);
            dict.add(6, hanna2);
            dict.add(7, suzuha3);
            dict.add(8, julia);
            dict.add(9, lucrezia);
            dict.add(10, megan);
            dict.add(11, noemi);
            dict.add(12, olga);
            dict.add(13, priscilla);
            dict.add(14, reika);
            dict.add(15, suzuha);
            dict.add(16, suzuha2);
            dict.add(17, noemi2);
            const orderedPeople = dict.orderByDescending(p => p.value.Age)
                .thenByDescending(p => p.value.Name, (n1, n2) => n1.localeCompare(n2))
                .thenByDescending(p => p.value.Surname)
                .orderBy(p => p.value.Age)
                .thenBy(p => p.value.Name).toDictionary<number, Person>();
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
                const personStr = `[${p.value.Age}] :: ${p.value.Name} ${p.value.Surname}`;
                returnedOrder.push(personStr);
            }
            expect(returnedOrder).to.deep.equal(expectedOrder);
        });
    });
    describe("#toArray()", () => {
        const dict = new Dictionary<string, Person>();
        dict.add(alice.Name, alice);
        dict.add(lucrezia.Name, lucrezia);
        dict.add(vanessa.Name, vanessa);
        const people = dict.toArray();
        it("should have the same size as dictionary", () => {
            expect(dict.size()).to.eq(people.length);
        });
        it("should have the same order as dictionary", () => {
            expect(people[0].value).to.eq(alice);
            expect(people[1].value).to.eq(lucrezia);
            expect(people[2].value).to.eq(vanessa);
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
        dictionary.add(alice.Age, alice);
        dictionary.add(mel.Age, mel);
        dictionary.add(senna.Age, senna);
        dictionary.add(lenka.Age, lenka);
        it("should return a list with mapped values", () => {
            const values = dictionary.values().toArray();
            expect(values).to.deep.equal([alice, mel, senna, lenka]);
        });
    });
    describe("#where()", () => {
        const dictionary = new Dictionary<string, Person>();
        dictionary.add(alice.Name, alice);
        dictionary.add(lucrezia.Name, lucrezia);
        dictionary.add(noemi.Name, noemi);
        dictionary.add(priscilla.Name, priscilla);
        it("should throw error if predicate is undefined", () => {
           expect(() => dictionary.where(null)).to.throw(ErrorMessages.NoPredicateProvided);
        });
        it("should return a dictionary with people who are younger than 10", () => {
            const dict = dictionary.where(p => p.value.Age < 10).toDictionary<string, Person>();
            expect(dict.size()).to.eq(1);
            expect(dict.get(alice.Name)).to.null;
            expect(dict.get(lucrezia.Name)).to.null;
            expect(dict.get(noemi.Name)).to.null;
            expect(dict.get(priscilla.Name)).to.not.null;
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
                [new KeyValuePair<number, string>(1, "a"), new KeyValuePair<number, string>(5, "e")],
                [new KeyValuePair<number, string>(2, "b"), new KeyValuePair<number, string>(2, "FF")],
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
            expect(result.get(1)).to.eq("two two");
            expect(result.get(2)).to.eq("three three");
        });
    });
});
