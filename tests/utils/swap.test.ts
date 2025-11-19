import { describe } from "vitest";
import { List } from "../../src/list/List";
import { IndexOutOfBoundsException } from "../../src/shared/IndexOutOfBoundsException";
import { swap } from "../../src/utils/swap";

describe("#swap", () => {
    test("should swap elements in an array", () => {
        const arr = [1, 2, 3, 4];
        swap(arr, 1, 3);
        expect(arr).to.deep.equal([1, 4, 3, 2]);
    });
    test("should swap elements in an IList", () => {
        const list = new List([1, 2, 3, 4]);
        swap(list, 0, 2);
        expect(list.toArray()).to.deep.equal([3, 2, 1, 4]);
    });
    test("should throw IndexOutOfBoundsException for invalid indices in array", () => {
        const arr = [1, 2, 3];
        expect(() => swap(arr, -1, 2)).toThrowError(
            new IndexOutOfBoundsException(`Index -1 is out of bounds.`)
        );
        expect(() => swap(arr, 1, 3)).toThrowError(
            new IndexOutOfBoundsException(`Index 3 is out of bounds.`)
        );
    });
    test("should throw IndexOutOfBoundsException for invalid indices in IList", () => {
        const list = new List([1, 2, 3]);
        expect(() => swap(list, -1, 2)).toThrowError(
            new IndexOutOfBoundsException(`Index -1 is out of bounds.`)
        );
        expect(() => swap(list, 1, 3)).toThrowError(
            new IndexOutOfBoundsException(`Index 3 is out of bounds.`)
        );
    });
});
