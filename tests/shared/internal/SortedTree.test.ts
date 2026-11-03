import { describe, expect, test } from "vitest";
import { at, find, fromSorted, insert, lastChange, nodes, remove, type Tree } from "../../../src/shared/internal/SortedTree";

const compare = (a: number, b: number) => a - b;

const keysOf = (tree: Tree<number, number>) => Array.from(nodes(tree), n => n.key);

// Checks ordering, cached sizes and the weight-balance bound on every node.
const checkInvariants = (tree: Tree<number, number>, low = -Infinity, high = Infinity): number => {
    if (tree === null) {
        return 0;
    }
    expect(tree.key).to.be.greaterThan(low);
    expect(tree.key).to.be.lessThan(high);
    const left = checkInvariants(tree.left, low, tree.key);
    const right = checkInvariants(tree.right, tree.key, high);
    expect(tree.size).to.equal(left + right + 1);
    if (left + right > 1) {
        expect(left).to.be.at.most(3 * right);
        expect(right).to.be.at.most(3 * left);
    }
    return tree.size;
};

describe("SortedTree", () => {
    test("should match a sorted model through random inserts and removals", () => {
        let tree: Tree<number, number> = null;
        const model = new Map<number, number>();
        const snapshots: Array<[Tree<number, number>, Array<number>]> = [];
        let seed = 11;
        const random = (bound: number) => (seed = (seed * 1103515245 + 12345) % 2147483648) % bound;
        for (let step = 0; step < 4000; ++step) {
            const key = random(1500);
            if (random(3) === 0) {
                tree = remove(tree, key, compare);
                expect(lastChange.found?.key).to.equal(model.has(key) ? key : undefined);
                model.delete(key);
            } else {
                tree = insert(tree, key, step, compare, true);
                expect(lastChange.found?.key).to.equal(model.has(key) ? key : undefined);
                model.set(key, step);
            }
            if (step % 400 === 0) {
                snapshots.push([tree, Array.from(model.keys()).sort(compare)]);
                checkInvariants(tree);
            }
        }
        checkInvariants(tree);
        const sorted = Array.from(model.keys()).sort(compare);
        expect(keysOf(tree)).to.deep.equal(sorted);
        for (const [key, value] of model) {
            expect(find(tree, key, compare)?.value).to.equal(value);
        }
        sorted.forEach((key, index) => expect(at(tree, index).key).to.equal(key));
        for (const [snapshot, expected] of snapshots) {
            expect(keysOf(snapshot)).to.deep.equal(expected);
        }
    });
    test("should stay balanced when keys arrive in order", () => {
        let tree: Tree<number, number> = null;
        for (let i = 0; i < 5000; ++i) {
            tree = insert(tree, i, i, compare, false);
        }
        checkInvariants(tree);
        for (let i = 0; i < 4000; ++i) {
            tree = remove(tree, i, compare);
        }
        checkInvariants(tree);
        expect(tree?.size).to.equal(1000);
    });
    test("should return the same tree when nothing changes", () => {
        const tree = fromSorted([1, 2, 3], [10, 20, 30]);
        checkInvariants(tree);
        expect(insert(tree, 2, 99, compare, false)).to.equal(tree);
        expect(insert(tree, 2, 20, compare, true)).to.equal(tree);
        expect(remove(tree, 4, compare)).to.equal(tree);
        expect(lastChange.found).to.be.null;
        const replaced = insert(tree, 2, 99, compare, true);
        expect(find(replaced, 2, compare)?.value).to.equal(99);
        expect(find(tree, 2, compare)?.value).to.equal(20);
    });
    test("should start iteration at a bound", () => {
        const tree = fromSorted([1, 3, 5, 7, 9, 11, 13], [0, 0, 0, 0, 0, 0, 0]);
        const from = (key: number, inclusive: boolean) => Array.from(nodes(tree, { key, inclusive, comparator: compare }), n => n.key);
        expect(from(5, true)).to.deep.equal([5, 7, 9, 11, 13]);
        expect(from(5, false)).to.deep.equal([7, 9, 11, 13]);
        expect(from(6, true)).to.deep.equal([7, 9, 11, 13]);
        expect(from(0, false)).to.deep.equal([1, 3, 5, 7, 9, 11, 13]);
        expect(from(13, false)).to.deep.equal([]);
    });
});
