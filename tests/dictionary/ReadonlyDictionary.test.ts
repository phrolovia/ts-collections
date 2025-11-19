import { range } from "../../src/enumerator/functions/range";
import { ReadonlyDictionary } from "../../src/dictionary/ReadonlyDictionary";
import { SortedDictionary } from "../../src/dictionary/SortedDictionary";


describe("ReadonlyDictionary", () => {

    describe("#containsKey()", () => {
        test("should return true if the dictionary contains the given key", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).reverse().toSortedDictionary(x => x, x => x));
            for (let i = 0; i < 100; i++) {
                expect(dictionary.containsKey(i + 1)).to.be.true;
                expect(dictionary.containsKey(0)).to.be.false;
            }
        });
    });

    describe("#containsValue()", () => {
        test("should return true if the dictionary contains the given value", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => x));
            for (let i = 0; i < 100; i++) {
                expect(dictionary.containsValue(i + 1)).to.be.true;
                expect(dictionary.containsValue(0)).to.be.false;
            }
        });
    });

    describe("#entries()", () => {
        test("should return an indexed IterableIterator", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => x));
            for (const [key, value] of dictionary.entries()) {
                expect(key).to.eq(value);
                expect(dictionary.get(key)).to.eq(value);
            }
            expect(dictionary.size()).to.eq(100);
            expect(dictionary.length).to.eq(100);
        });
    });

    describe("#get()", () => {
        test("should return the value at the given key", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => x));
            for (let i = 0; i < 100; i++) {
                expect(dictionary.get(i + 1)).to.eq(i + 1);
            }
        });
    });

    describe("#keys()", () => {
        test("should return an IterableIterator of keys", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => 1 / x));
            let index = 1;
            for (const key of dictionary.keys()) {
                expect(key).to.eq(index);
                index++;
            }
        });
    });

    describe("#size()", () => {
        test("should return the number of elements in the collection", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => x));
            expect(dictionary.size()).to.equal(100);
            expect(dictionary.length).to.equal(100);
        });
        test("should reflect changes to the underlying collection", () => {
            const dictionary = new SortedDictionary(range(1, 100).toDictionary(x => x, x => x));
            const readonlyDictionary = new ReadonlyDictionary(dictionary);
            expect(readonlyDictionary.size()).to.equal(100);
            expect(readonlyDictionary.length).to.equal(100);
            dictionary.add(101, 101);
            expect(readonlyDictionary.size()).to.equal(101);
            expect(readonlyDictionary.length).to.equal(101);
        });
    });

    describe("#values()", () => {
        test("should return an IterableIterator of values", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => 1 / x));
            let index = 1;
            for (const value of dictionary.values()) {
                expect(value).to.eq(1 / index);
                index++;
            }
        });
    });

    describe("for-of", () => {
        test("should iterate over the dictionary", () => {
            const dictionary = new ReadonlyDictionary(range(1, 100).toDictionary(x => x, x => x));
            let index = 1;
            for (const pair of dictionary) {
                expect(pair.key).to.eq(index);
                expect(pair.value).to.eq(index);
                index++;
            }
        });
    });
});
