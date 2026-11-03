import { describe, expect, test } from "vitest";
import { Enumerable } from "../../src/enumerator/Enumerable";
import { List } from "../../src/list/List";

describe("append, concat and prepend chains", () => {
    test("should join long chains without overflowing the stack", () => {
        const count = 20000;
        let enumerable = Enumerable.from<number>([]);
        for (let i = 0; i < count; ++i) {
            enumerable = i % 3 === 0 ? enumerable.append(i) : i % 3 === 1 ? enumerable.concat([i]) : enumerable.prepend(i);
        }
        const expected: number[] = [];
        for (let i = count - 1; i >= 0; --i) {
            if (i % 3 === 2) {
                expected.push(i);
            }
        }
        for (let i = 0; i < count; ++i) {
            if (i % 3 !== 2) {
                expected.push(i);
            }
        }
        expect(enumerable.toArray()).to.deep.equal(expected);
    });
    test("should keep each branch of a shared chain independent", () => {
        const base = Enumerable.from([1, 2]).append(3);
        const left = base.append(4).prepend(0);
        const right = base.concat([5, 6]);
        expect(base.toArray()).to.deep.equal([1, 2, 3]);
        expect(left.toArray()).to.deep.equal([0, 1, 2, 3, 4]);
        expect(right.toArray()).to.deep.equal([1, 2, 3, 5, 6]);
    });
    test("should read the joined sources lazily on every enumeration", () => {
        const list = new List([1]);
        const joined = Enumerable.from(list).append(9).concat(list);
        list.add(2);
        expect(joined.toArray()).to.deep.equal([1, 2, 9, 1, 2]);
        list.clear();
        expect(joined.toArray()).to.deep.equal([9]);
    });
    test("should keep operators applied after a join", () => {
        const joined = Enumerable.from([1, 2, 3]).append(4).where(x => x % 2 === 0).prepend(0).append(10);
        expect(joined.toArray()).to.deep.equal([0, 2, 4, 10]);
    });
});
