import { ImmutableDictionary } from "../../src/dictionary/ImmutableDictionary";
import { KeyValuePair } from "../../src/dictionary/KeyValuePair";
import { from } from "../../src";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";
import { KeyNotFoundException } from "../../src/shared/KeyNotFoundException";
import { test } from "vitest";

describe("ImmutableDictionary", () => {
    describe("#add()", () => {
        test("should add values to the dictionary with a string key", () => {
            const dictionary = ImmutableDictionary.create(
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
    });
    describe("#clear()", () => {
        test("should clear the dictionary", () => {
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            expect(dictionary.containsKey("key1")).to.be.true;
            expect(dictionary.containsKey("key2")).to.be.true;
            expect(dictionary.containsKey("key3")).to.be.false;
        });
    });
    describe("#containsValue()", () => {
        test("should return true if the value exists in the dictionary", () => {
            const dictionary = ImmutableDictionary.create(
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
        test("should create an empty ImmutableDictionary", () => {
            const dictionary = ImmutableDictionary.create();
            expect(dictionary.size()).to.equal(0);
        });
        test("should create an ImmutableDictionary from an iterable of KeyValuePair objects", () => {
            const dictionary = ImmutableDictionary.create(
                [
                    new KeyValuePair("key1", "value1"),
                    new KeyValuePair("key2", "value2")
                ]
            );
            expect(dictionary.size()).to.equal(2);
            expect(dictionary.get("key1")).to.equal("value1");
            expect(dictionary.get("key2")).to.equal("value2");
        });
        test("should create an ImmutableDictionary from an iterable of [key, value] pairs", () => {
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create();
            const newDictionary = dictionary.put("key1", "value1");
            expect(dictionary.size()).to.equal(0);
            expect(dictionary.get("key1")).to.be.null;
            expect(newDictionary.size()).to.equal(1);
            expect(newDictionary.get("key1")).to.equal("value1");
        });
        test("should update the value of the key if the key already exists", () => {
            const dictionary = ImmutableDictionary.create(
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
        test("should put the value in the dictionary if the key does not exist", () => {
            type KeyType = "K1" | "K2" | "K3";
            const dictionary = ImmutableDictionary.create<KeyType, boolean>();
            const newDictionary = dictionary.put("K1", false);
            expect(dictionary.size()).to.equal(0);
            expect(dictionary.get("K1")).to.be.null;
            expect(newDictionary.size()).to.equal(1);
            expect(newDictionary.get("K1")).to.be.false;
        });
    });
    describe("#remove()", () => {
        test("should remove the key and its associated value from the dictionary", () => {
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create(
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
            const dictionary = ImmutableDictionary.create(
                [
                    new KeyValuePair("key1", "value1")
                ]
            );
            expect(dictionary.size()).to.equal(1);
        });
    });
    describe("#values()", () => {
        test("should return a collection of values", () => {
            const dictionary = ImmutableDictionary.create(
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
        test("should match a Map for random operations while keeping every version intact", () => {
            let seed = 12345;
            const random = (max: number) => {
                seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
                return seed % max;
            };
            let dictionary = ImmutableDictionary.create<number, number>();
            let model = new Map<number, number>();
            const snapshots: Array<[ImmutableDictionary<number, number>, Map<number, number>]> = [];
            for (let step = 0; step < 5000; ++step) {
                const key = random(800);
                if (random(3) === 0) {
                    dictionary = dictionary.remove(key);
                    model.delete(key);
                } else {
                    dictionary = dictionary.put(key, step);
                    model.set(key, step);
                }
                if (step % 500 === 0) {
                    snapshots.push([dictionary, model]);
                    model = new Map(model);
                }
            }
            snapshots.push([dictionary, model]);
            for (const [snapshot, expected] of snapshots) {
                expect(snapshot.size()).to.equal(expected.size);
                expect(Array.from(snapshot.entries())).to.deep.equal(Array.from(expected.entries()));
                for (let key = 0; key < 800; ++key) {
                    expect(snapshot.get(key)).to.equal(expected.has(key) ? expected.get(key) : null);
                }
            }
        });
        test("should keep insertion order after updates and removals", () => {
            let dictionary = ImmutableDictionary.create<string, number>([["a", 1], ["b", 2], ["c", 3]]);
            dictionary = dictionary.put("a", 10).remove("b").put("d", 4).put("b", 5);
            expect(Array.from(dictionary.entries())).to.deep.equal([["a", 10], ["c", 3], ["d", 4], ["b", 5]]);
        });
        test("should keep insertion order when most keys are removed", () => {
            let dictionary = ImmutableDictionary.create<number, number>();
            for (let i = 0; i < 1000; ++i) {
                dictionary = dictionary.put(i, i);
            }
            for (let i = 0; i < 1000; ++i) {
                if (i % 10 !== 0) {
                    dictionary = dictionary.remove(i);
                }
            }
            dictionary = dictionary.put(5, 5);
            const expectedKeys = [...Array.from({ length: 100 }, (_, i) => i * 10), 5];
            expect(Array.from(dictionary.keys())).to.deep.equal(expectedKeys);
            expect(dictionary.get(990)).to.equal(990);
            expect(dictionary.get(991)).to.be.null;
        });
        test("should treat keys the same way as Map does", () => {
            const objectKey = { id: 1 };
            const equalObjectKey = { id: 1 };
            const symbolKey = Symbol("key");
            const sameDescriptionSymbol = Symbol("key");
            const dictionary = ImmutableDictionary.create<unknown, string>()
                .put(NaN, "nan")
                .put(0, "zero")
                .put(objectKey, "object")
                .put(symbolKey, "symbol")
                .put(null, "null")
                .put(undefined, "undefined")
                .put("1", "string one")
                .put(1, "number one")
                .put(1.5, "fraction")
                .put(10n, "bigint");
            expect(dictionary.get(NaN)).to.equal("nan");
            expect(dictionary.get(-0)).to.equal("zero");
            expect(dictionary.get(objectKey)).to.equal("object");
            expect(dictionary.containsKey(equalObjectKey)).to.be.false;
            expect(dictionary.get(symbolKey)).to.equal("symbol");
            expect(dictionary.containsKey(sameDescriptionSymbol)).to.be.false;
            expect(dictionary.get(null)).to.equal("null");
            expect(dictionary.get(undefined)).to.equal("undefined");
            expect(dictionary.get("1")).to.equal("string one");
            expect(dictionary.get(1)).to.equal("number one");
            expect(dictionary.get(1.5)).to.equal("fraction");
            expect(dictionary.get(10n)).to.equal("bigint");
            expect(dictionary.size()).to.equal(10);
        });
        test("should return the same instance when nothing changes", () => {
            const dictionary = ImmutableDictionary.create([["key1", "value1"]]);
            expect(dictionary.put("key1", "value1")).to.equal(dictionary);
            expect(dictionary.set("key1", "value1")).to.equal(dictionary);
            expect(dictionary.remove("missing")).to.equal(dictionary);
        });
        test("should not let callers modify the dictionary through yielded pairs", () => {
            const dictionary = ImmutableDictionary.create([["key1", "value1"]]);
            const copy = dictionary.put("key2", "value2");
            for (const pair of dictionary) {
                pair.value = "changed";
            }
            expect(dictionary.get("key1")).to.equal("value1");
            expect(copy.get("key1")).to.equal("value1");
        });
        test("should throw when adding an existing key or setting a missing key", () => {
            const dictionary = ImmutableDictionary.create([["key1", "value1"]]);
            expect(() => dictionary.add("key1", "other")).toThrow(InvalidArgumentException);
            expect(() => dictionary.set("missing", "other")).toThrow(KeyNotFoundException);
            expect(() => ImmutableDictionary.create([["key1", "a"], ["key1", "b"]])).toThrow(InvalidArgumentException);
        });
        test("should be created from Enumerable#toImmutableDictionary", () => {
            const dictionary = from([1, 2, 3]).toImmutableDictionary(n => `k${n}`, n => n * 2);
            expect(dictionary.get("k2")).to.equal(4);
            expect(dictionary.put("k4", 8).size()).to.equal(4);
            expect(dictionary.size()).to.equal(3);
        });
    });
});
