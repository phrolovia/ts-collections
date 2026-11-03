import { describe, expect, test } from "vitest";
import { type BitmapNode, emptyRoot, find, lastChange, remove, upsert } from "../../../src/shared/internal/HashTrie";

type Item = [hash: number, key: string];

const insertAll = (items: Array<Item>, root = emptyRoot<string, string>(), owner?: object): BitmapNode<string, string> => {
    return items.reduce((r, [hash, key], index) => upsert(r, hash, key, key, index, owner), root);
};

describe("HashTrie", () => {
    test("should find entries whose hashes differ only in the highest bits", () => {
        const items: Array<Item> = [[0, "a"], [1 << 30, "b"], [1 << 31, "c"], [0x7fffffff, "d"]];
        const root = insertAll(items);
        for (const [hash, key] of items) {
            expect(find(root, hash, key)?.value).to.equal(key);
        }
        expect(find(root, 1 << 29, "a")).to.be.undefined;
    });
    test("should keep keys with identical hashes apart", () => {
        const root = insertAll([[42, "a"], [42, "b"], [42, "c"]]);
        expect(find(root, 42, "a")?.value).to.equal("a");
        expect(find(root, 42, "b")?.value).to.equal("b");
        expect(find(root, 42, "c")?.value).to.equal("c");
        expect(find(root, 42, "d")).to.be.undefined;

        const replaced = upsert(root, 42, "b", "B", 99);
        expect(find(replaced, 42, "b")?.value).to.equal("B");
        expect(find(replaced, 42, "b")?.index).to.equal(1);
        expect(lastChange.previous?.value).to.equal("b");
        expect(find(root, 42, "b")?.value).to.equal("b");
    });
    test("should report what an upsert did", () => {
        const root = upsert(emptyRoot<string, string>(), 1, "a", "x", 0);
        expect(lastChange.entry?.key).to.equal("a");
        expect(lastChange.previous).to.be.undefined;

        const same = upsert(root, 1, "a", "x", 1);
        expect(same).to.equal(root);
        expect(lastChange.entry).to.be.undefined;

        upsert(root, 1, "a", "y", 1);
        expect(lastChange.entry?.index).to.equal(0);
        expect(lastChange.previous?.value).to.equal("x");
    });
    test("should split a collision node when a key with a different hash shares its path", () => {
        const root = insertAll([[5, "a"], [5, "b"], [5 | (1 << 20), "c"]]);
        expect(find(root, 5, "a")?.value).to.equal("a");
        expect(find(root, 5, "b")?.value).to.equal("b");
        expect(find(root, 5 | (1 << 20), "c")?.value).to.equal("c");
    });
    test("should remove colliding keys one at a time", () => {
        let root = insertAll([[7, "a"], [7, "b"], [7, "c"], [8, "d"]]);
        root = remove(root, 7, "b");
        expect(lastChange.previous?.key).to.equal("b");
        expect(find(root, 7, "b")).to.be.undefined;
        expect(find(root, 7, "a")?.value).to.equal("a");
        root = remove(root, 7, "a");
        expect(find(root, 7, "c")?.value).to.equal("c");
        root = remove(root, 7, "c");
        root = remove(root, 8, "d");
        expect(root.children.length).to.equal(0);
    });
    test("should return the same root when removing an absent key", () => {
        const root = insertAll([[1, "a"], [1, "b"], [33, "c"]]);
        expect(remove(root, 1, "x")).to.equal(root);
        expect(lastChange.previous).to.be.undefined;
        expect(remove(root, 2, "a")).to.equal(root);
        expect(remove(root, 33 + (1 << 10), "c")).to.equal(root);
    });
    test("should collapse branches left with a single entry after removal", () => {
        // Both hashes share the first two 5-bit fragments, forcing a chain of branch nodes.
        let root = insertAll([[0b00001_00001, "a"], [0b11_00001_00001, "b"]]);
        root = remove(root, 0b11_00001_00001, "b");
        expect(root.children.length).to.equal(1);
        expect(root.children[0]).to.equal(find(root, 0b00001_00001, "a"));
    });
    test("should not modify earlier versions", () => {
        const first = insertAll([[1, "a"]]);
        const second = upsert(first, 2, "b", "b", 1);
        const third = remove(second, 1, "a");
        expect(find(first, 2, "b")).to.be.undefined;
        expect(find(second, 1, "a")?.value).to.equal("a");
        expect(find(third, 1, "a")).to.be.undefined;
        expect(find(third, 2, "b")?.value).to.equal("b");
    });
    test("should edit owned nodes in place without touching shared ones", () => {
        const items: Array<Item> = Array.from({ length: 200 }, (_, i) => [i * 2654435761 | 0, `k${i}`]);
        const shared = insertAll(items);
        const owner = {};
        const first = upsert(shared, 7, "new", "new", 200, owner);
        expect(first).not.to.equal(shared);
        const second = upsert(first, 8, "other", "other", 201, owner);
        expect(second).to.equal(first);
        const third = remove(second, items[0][0], items[0][1], owner);
        expect(third).to.equal(first);

        expect(find(third, 7, "new")?.value).to.equal("new");
        expect(find(third, items[0][0], items[0][1])).to.be.undefined;
        expect(find(shared, 7, "new")).to.be.undefined;
        expect(find(shared, items[0][0], items[0][1])?.value).to.equal(items[0][1]);
        for (const [hash, key] of items.slice(1)) {
            expect(find(shared, hash, key)?.value).to.equal(key);
            expect(find(third, hash, key)?.value).to.equal(key);
        }
    });
});
