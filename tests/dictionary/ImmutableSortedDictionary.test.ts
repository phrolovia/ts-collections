import {expect} from "chai";
import {describe, it} from "mocha";
import {ImmutableSortedDictionary} from "../../imports";
import {KeyValuePair} from "../../src/dictionary/KeyValuePair";

describe("ImmutableSortedDictionary", () => {
    describe("#add()", () => {
        it("should add values to the dictionary with a string key", () => {
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
        it("should be sorted", () => {
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
        it("should clear the dictionary", () => {
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
        it("should return true if the key exists in the dictionary", () => {
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
    });
    describe("#containsValue()", () => {
        it("should return true if the value exists in the dictionary", () => {
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
    describe("#entries()", () => {
        it("should return an IterableIterator of [key, value] pairs", () => {
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
        it("should return the value associated with the key", () => {
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
        it("should return a set of keys", () => {
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
        it("should add a value to the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create();
            const newDictionary = dictionary.put("key1", "value1");
            expect(dictionary.size()).to.equal(0);
            expect(dictionary.get("key1")).to.be.null;
            expect(newDictionary.size()).to.equal(1);
            expect(newDictionary.get("key1")).to.equal("value1");
        });
        it("should update the value of the key if the key already exists", () => {
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
        it("should remove the key and its associated value from the dictionary", () => {
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
        it("should set the value of the key", () => {
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
        it("should return the number of elements in the dictionary", () => {
            const dictionary = ImmutableSortedDictionary.create(
                [
                    new KeyValuePair("key1", "value1")
                ]
            );
            expect(dictionary.size()).to.equal(1);
        });
    });
    describe("#values()", () => {
        it("should return a collection of values", () => {
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
});