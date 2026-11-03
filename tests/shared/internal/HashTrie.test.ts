import { describe, expect, test } from "vitest";
import { type BitmapNode, emptyRoot, find, insert, remove, TrieEntry } from "../../../src/shared/internal/HashTrie";

const entry = (hash: number, key: string, value = key) => new TrieEntry(hash, key, value, 0);

const insertAll = (entries: Array<TrieEntry<string, string>>): BitmapNode<string, string> => {
    return entries.reduce((root, e) => insert(root, e), emptyRoot<string, string>());
};

describe("HashTrie", () => {
    test("should find entries whose hashes differ only in the highest bits", () => {
        const entries = [entry(0, "a"), entry(1 << 30, "b"), entry(1 << 31, "c"), entry(0x7fffffff, "d")];
        const root = insertAll(entries);
        for (const e of entries) {
            expect(find(root, e.hash, e.key)).to.equal(e);
        }
        expect(find(root, 1 << 29, "a")).to.be.undefined;
    });
    test("should keep keys with identical hashes apart", () => {
        const root = insertAll([entry(42, "a"), entry(42, "b"), entry(42, "c")]);
        expect(find(root, 42, "a")?.value).to.equal("a");
        expect(find(root, 42, "b")?.value).to.equal("b");
        expect(find(root, 42, "c")?.value).to.equal("c");
        expect(find(root, 42, "d")).to.be.undefined;

        const replaced = insert(root, entry(42, "b", "B"));
        expect(find(replaced, 42, "b")?.value).to.equal("B");
        expect(find(root, 42, "b")?.value).to.equal("b");
    });
    test("should split a collision node when a key with a different hash shares its path", () => {
        const root = insertAll([entry(5, "a"), entry(5, "b"), entry(5 | (1 << 20), "c")]);
        expect(find(root, 5, "a")?.value).to.equal("a");
        expect(find(root, 5, "b")?.value).to.equal("b");
        expect(find(root, 5 | (1 << 20), "c")?.value).to.equal("c");
    });
    test("should remove colliding keys one at a time", () => {
        let root = insertAll([entry(7, "a"), entry(7, "b"), entry(7, "c"), entry(8, "d")]);
        root = remove(root, 7, "b");
        expect(find(root, 7, "b")).to.be.undefined;
        expect(find(root, 7, "a")?.value).to.equal("a");
        root = remove(root, 7, "a");
        expect(find(root, 7, "c")?.value).to.equal("c");
        root = remove(root, 7, "c");
        root = remove(root, 8, "d");
        expect(root.children.length).to.equal(0);
    });
    test("should return the same root when removing an absent key", () => {
        const root = insertAll([entry(1, "a"), entry(1, "b"), entry(33, "c")]);
        expect(remove(root, 1, "x")).to.equal(root);
        expect(remove(root, 2, "a")).to.equal(root);
        expect(remove(root, 33 + (1 << 10), "c")).to.equal(root);
    });
    test("should collapse branches left with a single entry after removal", () => {
        // Both hashes share the first two 5-bit fragments, forcing a chain of branch nodes.
        const a = entry(0b00001_00001, "a");
        const b = entry(0b11_00001_00001, "b");
        let root = insertAll([a, b]);
        root = remove(root, b.hash, b.key);
        expect(root.children.length).to.equal(1);
        expect(root.children[0]).to.equal(a);
    });
    test("should not modify earlier versions", () => {
        const first = insertAll([entry(1, "a")]);
        const second = insert(first, entry(2, "b"));
        const third = remove(second, 1, "a");
        expect(find(first, 2, "b")).to.be.undefined;
        expect(find(second, 1, "a")?.value).to.equal("a");
        expect(find(third, 1, "a")).to.be.undefined;
        expect(find(third, 2, "b")?.value).to.equal("b");
    });
});
