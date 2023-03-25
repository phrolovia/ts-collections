import {describe, it} from "mocha";
import {Enumerable, ReadonlyDictionary, SortedDictionary} from "../../imports";
import {expect} from "chai";

describe("ReadonlyDictionary", () => {

    describe("#containsKey()", () => {
        it("should return true if the dictionary contains the given key", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).reverse().toSortedDictionary(x => x, x => x));
            for (let i = 0; i < 100; i++) {
                expect(dictionary.containsKey(i + 1)).to.be.true;
                expect(dictionary.containsKey(0)).to.be.false;
            }
        });
    });

    describe("#containsValue()", () => {
        it("should return true if the dictionary contains the given value", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => x));
            for (let i = 0; i < 100; i++) {
                expect(dictionary.containsValue(i + 1)).to.be.true;
                expect(dictionary.containsValue(0)).to.be.false;
            }
        });
    });

    describe("#entries()", () => {
        it("should return an indexed IterableIterator", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => x));
            for (const [key, value] of dictionary.entries()) {
                expect(key).to.eq(value);
                expect(dictionary.get(key)).to.eq(value);
            }
            expect(dictionary.size()).to.eq(100);
            expect(dictionary.length).to.eq(100);
        });
    });

    describe("#get()", () => {
        it("should return the value at the given key", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => x));
            for (let i = 0; i < 100; i++) {
                expect(dictionary.get(i + 1)).to.eq(i + 1);
            }
        });
    });

    describe("#keys()", () => {
        it("should return an IterableIterator of keys", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => 1/x));
            let index = 1;
            for (const key of dictionary.keys()) {
                expect(key).to.eq(index);
                index++;
            }
        });
    });

    describe("#size()", () => {
        it("should return the number of elements in the collection", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => x));
            expect(dictionary.size()).to.equal(100);
            expect(dictionary.length).to.equal(100);
        });
        it("should reflect changes to the underlying collection", () => {
            const dictionary = new SortedDictionary(null, null, Enumerable.range(1, 100).toDictionary(x => x, x => x));
            const readonlyDictionary = new ReadonlyDictionary(dictionary);
            expect(readonlyDictionary.size()).to.equal(100);
            expect(readonlyDictionary.length).to.equal(100);
            dictionary.add(101, 101);
            expect(readonlyDictionary.size()).to.equal(101);
            expect(readonlyDictionary.length).to.equal(101);
        });
    });

    describe("#values()", () => {
        it("should return an IterableIterator of values", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => 1/x));
            let index = 1;
            for (const value of dictionary.values()) {
                expect(value).to.eq(1/index);
                index++;
            }
        });
    });

    describe("for-of", () => {
        it("should iterate over the dictionary", () => {
            const dictionary = new ReadonlyDictionary(Enumerable.range(1, 100).toDictionary(x => x, x => x));
            let index = 1;
            for (const pair of dictionary) {
                expect(pair.key).to.eq(index);
                expect(pair.value).to.eq(index);
                index++;
            }
        });
    });
});