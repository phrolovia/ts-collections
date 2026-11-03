import { KeyValuePair } from "../../src/dictionary/KeyValuePair";
import { ImmutableSortedDictionary } from "../../src/dictionary/ImmutableSortedDictionary";

describe("ImmutableSortedDictionary", () => {
    describe("#add()", () => {
        test("should add values to the dictionary with a string key", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            const newDictionary = dictionary.add("key3", "value3");
            expect(dictionary.size()).to.equal(2);
            expect(dictionary.get("key3")).to.be.null;
            expect(newDictionary.get("key3")).to.equal("value3");
            expect(newDictionary.length).to.equal(3);
            expect(newDictionary.size()).to.equal(3);
            expect(newDictionary.containsKey("key1")).to.be.true;
            expect(newDictionary.containsKey("key2")).to.be.true;
        });
        test("should be sorted", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key3", "value3"),
                    new KeyValuePair("key1", "value1")
                ]
            );
            const newDictionary = dictionary.add("key2", "value2");
            expect(dictionary.size()).to.equal(2);
            expect(dictionary.length).to.equal(2);
            expect(newDictionary.size()).to.equal(3);
            expect(newDictionary.length).to.equal(3);
            expect(newDictionary.get("key1")).to.equal("value1");
            expect(newDictionary.get("key2")).to.equal("value2");
            expect(newDictionary.get("key3")).to.equal("value3");
            expect(newDictionary.keys().toArray()).to.deep.equal(["key1", "key2", "key3"]);
            expect(newDictionary.values().toArray()).to.deep.equal(["value1", "value2", "value3"]);
        });
    });
    describe("#clear()", () => {
        test("should clear the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            const newDictionary = dictionary.clear();
            expect(dictionary.size()).to.equal(2);
            expect(dictionary.isEmpty()).to.be.false;
            expect(newDictionary.size()).to.equal(0);
            expect(newDictionary.isEmpty()).to.be.true;
        });
    });
    describe("#containsKey()", () => {
        test("should return true if the key exists in the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            expect(dictionary.containsKey("key1")).to.be.true;
            expect(dictionary.containsKey("key2")).to.be.true;
            expect(dictionary.containsKey("key3")).to.be.false;
        });
        test("should return false", () => {
            const dict = ImmutableSortedDictionary.create<any, any>();
            const key1 = {a: 1};
            const newDict = dict.add(key1, 1);
            expect(newDict.containsKey(key1)).to.eq(true);
            expect(newDict.contains(1 as any)).to.eq(false);
            const dict2 = ImmutableSortedDictionary.create<any, any>();
            const newDict2 = dict2.add(1, 1);
            expect(newDict2.contains(key1 as any)).to.eq(false);
        });
    });
    describe("#containsValue()", () => {
        test("should return true if the value exists in the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            expect(dictionary.containsValue("value1")).to.be.true;
            expect(dictionary.containsValue("value2")).to.be.true;
            expect(dictionary.containsValue("value3")).to.be.false;
        });
    });
    describe("#create()", () => {
        test("should create an empty dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create();
            expect(dictionary.size()).to.equal(0);
        });
        test("should create a dictionary from an iterable of KeyValuePair", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            expect(dictionary.size()).to.equal(2);
            expect(dictionary.get("key1")).to.equal("value1");
            expect(dictionary.get("key2")).to.equal("value2");
        });
        test("should create a dictionary from an iterable of [key, value] pairs", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    ["key1", "value1"],
                    ["key2", "value2"]
                ]
            );
            expect(dictionary.size()).to.equal(2);
            expect(dictionary.get("key1")).to.equal("value1");
            expect(dictionary.get("key2")).to.equal("value2");
        });
    });
    describe("#entries()", () => {
        test("should return an IterableIterator of [key, value] pairs", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            const iterator = dictionary.entries();
            expect(iterator.next().value).to.deep.equal(["key1", "value1"]);
            expect(iterator.next().value).to.deep.equal(["key2", "value2"]);
            expect(iterator.next().done).to.be.true;
        });
    });
    describe("#get()", () => {
        test("should return the value associated with the key", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            expect(dictionary.get("key1")).to.equal("value1");
            expect(dictionary.get("key2")).to.equal("value2");
            expect(dictionary.get("key3")).to.be.null;
        });
    });
    describe("#keys()", () => {
        test("should return a set of keys", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            const keys = dictionary.keys();
            expect(keys.size()).to.equal(2);
            expect(keys.contains("key1")).to.be.true;
            expect(keys.contains("key2")).to.be.true;
            expect(keys.contains("key3")).to.be.false;
        });
    });
    describe("#put()", () => {
        test("should add a value to the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create();
            const newDictionary = dictionary.put("key1", "value1");
            expect(dictionary.size()).to.equal(0);
            expect(dictionary.get("key1")).to.be.null;
            expect(newDictionary.size()).to.equal(1);
            expect(newDictionary.get("key1")).to.equal("value1");
        });
        test("should update the value of the key if the key already exists", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1")
                ]
            );
            const newDictionary = dictionary.put("key1", "value2");
            expect(dictionary.size()).to.equal(1);
            expect(dictionary.get("key1")).to.equal("value1");
            expect(newDictionary.size()).to.equal(1);
            expect(newDictionary.get("key1")).to.equal("value2");
        });
    });
    describe("#remove()", () => {
        test("should remove the key and its associated value from the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1")
                ]
            );
            const newDictionary = dictionary.remove("key1");
            expect(dictionary.size()).to.equal(1);
            expect(dictionary.get("key1")).to.equal("value1");
            expect(newDictionary.size()).to.equal(0);
            expect(newDictionary.get("key1")).to.be.null;
        });
    });
    describe("#set()", () => {
        test("should set the value of the key", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1")
                ]
            );
            const newDictionary = dictionary.set("key1", "value2");
            expect(dictionary.size()).to.equal(1);
            expect(dictionary.get("key1")).to.equal("value1");
            expect(newDictionary.size()).to.equal(1);
            expect(newDictionary.get("key1")).to.equal("value2");
        });
    });
    describe("#size()", () => {
        test("should return the number of elements in the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1")
                ]
            );
            expect(dictionary.size()).to.equal(1);
        });
    });
    describe("#values()", () => {
        test("should return a collection of values", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            const values = dictionary.values();
            expect(values.size()).to.equal(2);
            expect(values.contains("value1")).to.be.true;
            expect(values.contains("value2")).to.be.true;
            expect(values.contains("value3")).to.be.false;
        });
    });

    describe("persistence", () => {
        test("should match a sorted model through random edits without changing earlier versions", () => {
            let dictionary = ImmutableSortedDictionary.create<number, number>();
            const model = new Map<number, number>();
            const sortedEntries = () => Array.from(model).sort((a, b) => a[0] - b[0]);
            const snapshots: Array<[ImmutableSortedDictionary<number, number>, Array<[number, number]>]> = [];
            let seed = 5;
            const random = (bound: number) => (seed = (seed * 1103515245 + 12345) % 2147483648) % bound;
            for (let step = 0; step < 3000; ++step) {
                const key = random(800);
                const op = random(4);
                if (op === 0) {
                    dictionary = dictionary.remove(key);
                    model.delete(key);
                } else if (op === 1 && model.has(key)) {
                    dictionary = dictionary.set(key, -step);
                    model.set(key, -step);
                } else {
                    dictionary = dictionary.put(key, step);
                    model.set(key, step);
                }
                if (step % 300 === 0) {
                    snapshots.push([dictionary, sortedEntries()]);
                }
            }
            expect(Array.from(dictionary.entries())).to.deep.equal(sortedEntries());
            for (const [key, value] of model) {
                expect(dictionary.get(key)).to.equal(value);
            }
            for (const [snapshot, expected] of snapshots) {
                expect(Array.from(snapshot.entries())).to.deep.equal(expected);
            }
        });
        test("should return the same dictionary when nothing changes", () => {
            const dictionary = ImmutableSortedDictionary.create<number, string>([[1, "a"], [2, "b"]]);
            expect(dictionary.remove(3)).to.equal(dictionary);
            expect(dictionary.put(1, "a")).to.equal(dictionary);
            expect(dictionary.set(2, "b")).to.equal(dictionary);
        });
        test("should reject duplicate and missing keys", () => {
            const dictionary = ImmutableSortedDictionary.create<number, string>([[2, "b"], [1, "a"]]);
            expect(() => dictionary.add(1, "x")).to.throw("Key already exists: 1");
            expect(() => dictionary.set(3, "x")).to.throw();
            expect(() => ImmutableSortedDictionary.create<number, string>([[1, "a"], [2, "b"], [1, "c"]])).to.throw("Key already exists: 1");
            expect(dictionary.keys().toArray()).to.deep.equal([1, 2]);
            expect(dictionary.values().toArray()).to.deep.equal(["a", "b"]);
        });
    });
});
