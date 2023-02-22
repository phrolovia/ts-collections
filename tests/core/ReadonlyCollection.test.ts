import {describe} from "mocha";
import {expect} from "chai";
import {ReadonlyCollection} from "../../src/core/ReadonlyCollection";
import {SortedSet} from "../../src/set/SortedSet";

describe("ReadonlyCollection", () => {
    describe("#size()", () => {
        it("should return the number of elements in the collection", () => {
            const set = new SortedSet([1, 2, 3, 4, 5]);
            const collection = new ReadonlyCollection(set);
            expect(collection.size()).to.equal(5);
            expect(collection.length).to.equal(5);
        });
        it("should reflect changes in the underlying collection", () => {
            const set = new SortedSet([1, 2, 3, 4, 5]);
            const collection = new ReadonlyCollection(set);
            expect(collection.size()).to.equal(5);
            expect(collection.length).to.equal(5);
            set.add(6);
            expect(collection.size()).to.equal(6);
            expect(collection.length).to.equal(6);
        });
    });
});