import { describe, expect, test } from "vitest";
import { RedBlackTree } from "../../src/tree/RedBlackTree";
import { SortedSet } from "../../src/set/SortedSet";

type Node = {
    getColor(): number;
    getData(): number;
    getLeft(): Node | null;
    getParent(): Node | null;
    getRight(): Node | null;
};

// Returns the black height, failing when a red node has a red child, paths differ in black nodes,
// a parent link is wrong, or the order is broken.
const blackHeight = (node: Node | null, parent: Node | null, low: number, high: number): number => {
    if (node == null) {
        return 1;
    }
    expect(node.getParent()).toBe(parent);
    expect(node.getData()).toBeGreaterThan(low);
    expect(node.getData()).toBeLessThan(high);
    if (node.getColor() === 0) {
        expect(node.getLeft()?.getColor() ?? 1).toBe(1);
        expect(node.getRight()?.getColor() ?? 1).toBe(1);
    }
    const left = blackHeight(node.getLeft(), node, low, node.getData());
    const right = blackHeight(node.getRight(), node, node.getData(), high);
    expect(left).toBe(right);
    return left + node.getColor();
};

const checkTree = (tree: RedBlackTree<number>): void => {
    const root = (tree as unknown as { root: Node | null }).root;
    expect(root?.getColor() ?? 1).toBe(1);
    blackHeight(root, null, -Infinity, Infinity);
};

describe("RedBlackTree built from ascending input", () => {
    test("should be a valid red-black tree for every size", () => {
        for (let size = 0; size <= 130; ++size) {
            const values = Array.from({ length: size }, (_, i) => i);
            const tree = new RedBlackTree<number>(values);
            checkTree(tree);
            expect(tree.size()).toBe(size);
            expect(tree.toArray()).toEqual(values);
        }
    });
    test("should stay valid through later additions and removals", () => {
        const tree = new RedBlackTree<number>(Array.from({ length: 200 }, (_, i) => i * 2));
        const model = new Set(Array.from({ length: 200 }, (_, i) => i * 2));
        let seed = 7;
        for (let step = 0; step < 2000; ++step) {
            seed = (seed * 1103515245 + 12345) % 2147483648;
            const value = seed % 500;
            if (step % 3 === 0) {
                tree.remove(value);
                model.delete(value);
            } else {
                tree.add(value);
                model.add(value);
            }
        }
        checkTree(tree);
        expect(tree.toArray()).toEqual([...model].sort((a, b) => a - b));
    });
    test("should keep the first of equal elements, as add does", () => {
        const byKey = (a: { key: number }, b: { key: number }): number => a.key - b.key;
        const first = { key: 1, name: "first" };
        const set = new SortedSet([{ key: 0, name: "zero" }, first, { key: 1, name: "second" }, { key: 2, name: "two" }], byKey);
        expect(set.size()).toBe(3);
        expect(set.toArray()[1]).toBe(first);
    });
    test("should fall back to adding one at a time for unsorted input", () => {
        const tree = new RedBlackTree<number>([5, 1, 4, 1, 3, 2]);
        checkTree(tree);
        expect(tree.toArray()).toEqual([1, 2, 3, 4, 5]);
    });
    test("should read a one-shot iterable once", () => {
        function* ascending(): Generator<number> {
            yield* [1, 2, 3];
        }
        function* unsorted(): Generator<number> {
            yield* [3, 1, 2];
        }
        expect(new SortedSet(ascending()).toArray()).toEqual([1, 2, 3]);
        expect(new SortedSet(unsorted()).toArray()).toEqual([1, 2, 3]);
    });
    test("should follow the comparator order", () => {
        const descending = (a: number, b: number): number => b - a;
        const set = new SortedSet([3, 2, 1], descending);
        expect(set.toArray()).toEqual([3, 2, 1]);
        expect(set.contains(2)).toBe(true);
        expect(new SortedSet([1, 2, 3], descending).toArray()).toEqual([3, 2, 1]);
    });
});
