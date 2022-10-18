import {describe} from "mocha";
import {expect} from "chai";
import {ReadonlyCollection} from "../../src/core/ReadonlyCollection";

describe("ReadonlyCollection", () => {
    describe("#size()", () => {
        it("should return the number of elements in the collection", () => {
            const collection = new ReadonlyCollection([1, 2, 3, 4, 5]);
            expect(collection.size()).to.equal(5);
            expect(collection.length).to.equal(5);
        });
    });
});