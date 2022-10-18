import {describe, it} from "mocha";
import {expect} from "chai";
import {ReadonlyList} from "../../src/list/ReadonlyList";
import {List} from "../../src/list/List";
import {Enumerable} from "../../src/enumerator/Enumerable";

describe("ReadonlyList", () => {
    describe("#entries()", () => {
        it("should return an indexed IterableIterator", () => {
            const list = new ReadonlyList(Enumerable.range(1, 100).toList());
            for (const [index, element] of list.entries()) {
                expect(index + 1).to.eq(element);
                expect(list.get(index)).to.eq(element);
            }
        });
    });

    describe("#get()", () => {
        it("should return the element at the given index", () => {
            const list = new ReadonlyList(Enumerable.range(1, 100).toIndexableList());
            for (let i = 0; i < 100; i++) {
                expect(list.get(i)).to.eq(i + 1);
            }
        });
    });

    describe("#indexOf()", () => {
        it("should return the index of the given element", () => {
            const list = new ReadonlyList(Enumerable.range(1, 100).toList());
            for (let i = 0; i < 100; i++) {
                expect(list.indexOf(i + 1)).to.eq(i);
            }
        });
    });

    describe("#lastIndexOf()", () => {
        it("should return the last index of the given element", () => {
            const list = new ReadonlyList(Enumerable.range(1, 100).toLinkedList());
            for (let i = 0; i < 100; i++) {
                expect(list.lastIndexOf(i + 1)).to.eq(i);
            }
        });
    });

    describe("#size()", () => {
        it("should return the number of elements in the collection", () => {
            const list = new ReadonlyList(new List([1, 2, 3, 4, 5]));
            expect(list.size()).to.equal(5);
            expect(list.length).to.equal(5);
        });
    });
});