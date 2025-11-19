import { describe } from "vitest";
import { shuffleInPlace } from "../../src/utils/shuffleInPlace";
import { range } from "../../src/enumerator/functions/range";
import "../../src/list/List";

describe("#shuffleInPlace", () => {
    test("should shuffle elements in an array", () => {
        const arr = range(1, 200).toArray();
        const original = [...arr];
        shuffleInPlace(arr);
        expect(arr).to.have.members(original); // same elements
        expect(arr).to.not.deep.equal(original); // likely different order
    });
    test("should shuffle elements in an IList", () => {
        const list = range(1, 200).toList();
        const original = list.toArray();
        shuffleInPlace(list);
        expect(list.toArray()).to.have.members(original); // same elements
        expect(list.toArray()).to.not.deep.equal(original); // likely different order
    });
});
