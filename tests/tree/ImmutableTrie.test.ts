import { describe, test, expect } from "vitest";
import { ImmutableTrie } from "../../src/tree/ImmutableTrie";

describe("ImmutableTrie", () => {
    describe("Basic behavior with default tokenizer/comparator", () => {
        test("should insert and retrieve simple string keys", () => {
            let trie = ImmutableTrie.create<string, number>();

            trie = trie.insert("cat", 1);
            trie = trie.insert("car", 2);
            trie = trie.insert("dog", 3);

            expect(trie.has("cat")).to.be.true;
            expect(trie.has("car")).to.be.true;
            expect(trie.has("dog")).to.be.true;
            expect(trie.has("cow")).to.be.false;

            expect(trie.get("cat")).toBe(1);
            expect(trie.get("car")).toBe(2);
            expect(trie.get("dog")).toBe(3);
            expect(trie.get("cow")).to.be.null;
        });

        test("should overwrite existing key values immutably", () => {
            let trie = ImmutableTrie.create<string, number>();

            const trie1 = trie.insert("cat", 1);
            const trie2 = trie1.insert("cat", 42);

            expect(trie.has("cat")).to.be.false;
            expect(trie.get("cat")).to.be.null;
            expect(trie1.has("cat")).to.be.true;
            expect(trie1.get("cat")).toBe(1);
            expect(trie2.has("cat")).to.be.true;
            expect(trie2.get("cat")).toBe(42);
        });

        test("should handle keys that are prefixes of other keys", () => {
            let trie = ImmutableTrie.create<string, string>();

            trie = trie.insert("MARIA", "maria");
            trie = trie.insert("MARIANA", "mariana");

            expect(trie.has("MARIA")).to.be.true;
            expect(trie.has("MARIANA")).to.be.true;
            expect(trie.get("MARIA")).toBe("maria");
            expect(trie.get("MARIANA")).toBe("mariana");

            const trie2 = trie.delete("MARIA");
            expect(trie2.has("MARIA")).to.be.false;
            expect(trie2.get("MARIA")).to.be.null;
            expect(trie2.has("MARIANA")).to.be.true;
            expect(trie2.get("MARIANA")).toBe("mariana");
            expect(trie.has("MARIA")).to.be.true;
            expect(trie.has("MARIANA")).to.be.true;
        });

        test("should return same instance when delete does nothing", () => {
            let trie = ImmutableTrie.create<string, number>();
            trie = trie.insert("cat", 1);
            trie = trie.insert("car", 2);

            const trie2 = trie.delete("cow");
            expect(trie2).toBe(trie);
            expect(trie.has("cat")).to.be.true;
            expect(trie.has("car")).to.be.true;
        });

        test("should not delete when key is only a prefix and not terminal", () => {
            let trie = ImmutableTrie.create<string, number>();
            trie = trie.insert("cat", 1);

            const trie2 = trie.delete("ca");
            expect(trie2).toBe(trie);
            expect(trie2.has("cat")).to.be.true;
            expect(trie2.get("cat")).toBe(1);
        });
    });

    describe("Iteration", () => {
        test("should support valuesWithPrefix for default string keys", () => {
            let trie = ImmutableTrie.create<string, string>();

            trie = trie.insert("cat", "cat");
            trie = trie.insert("car", "car");
            trie = trie.insert("cart", "cart");
            trie = trie.insert("dog", "dog");

            const valuesWithCa = trie.prefix("ca").order().toArray();
            const valuesWithCar = trie.prefix("car").order().toArray();
            const valuesWithDo = trie.prefix("do").order().toArray();
            const valuesWithX = trie.prefix("x").order().toArray();

            expect(valuesWithCa).toEqual(["car", "cart", "cat"]);
            expect(valuesWithCar).toEqual(["car", "cart"]);
            expect(valuesWithDo).toEqual(["dog"]);
            expect(valuesWithX).toEqual([]);
        });

        test("should yield [TKey, TValue] with original keys", () => {
            let trie = ImmutableTrie.create<string, number>();

            trie = trie.insert("cat", 1);
            trie = trie.insert("car", 2);
            trie = trie.insert("crow", 3);
            trie = trie.insert("bird", 4);

            const entries = trie.toArray();
            expect(entries).toContainEqual(["cat", 1]);
            expect(entries).toContainEqual(["car", 2]);
            expect(entries).toContainEqual(["crow", 3]);
            expect(entries).toContainEqual(["bird", 4]);

            const keys = entries.map(e => e[0]).sort();
            const values = entries.map(e => e[1]).sort((a, b) => a - b);

            expect(keys).toEqual(["bird", "car", "cat", "crow"]);
            expect(values).toEqual([1, 2, 3, 4]);
        });
    });

    describe("Custom Tokenizer", () => {
        test("should be able to use dot-separated segments as tokens", () => {
            let trie = ImmutableTrie.create<string, string, string>(
                key => key.split(".")
            );

            trie = trie.insert("page.home.title", "title");
            trie = trie.insert("page.home.subtitle", "subtitle");
            trie = trie.insert("page.about.title", "about-title");

            expect(trie.get("page.home.title")).toBe("title");
            expect(trie.get("page.home.subtitle")).toBe("subtitle");
            expect(trie.get("page.about.title")).toBe("about-title");
            expect(trie.get("page.home")).to.be.null;

            const homeValues = trie.prefix("page.home").order().toArray();
            expect(homeValues).toEqual(["subtitle", "title"]);
        });

        test("should support empty key if tokenizer returns empty iterable", () => {
            let trie = ImmutableTrie.create<string, string, string>(
                key => (key === "" ? [] : key.split(""))
            );

            trie = trie.insert("", "empty-key");
            trie = trie.insert("a", "a");

            expect(trie.has("")).to.be.true;
            expect(trie.get("")).toBe("empty-key");
            expect(trie.has("a")).to.be.true;

            const trie2 = trie.delete("");
            expect(trie2.has("")).to.be.false;
            expect(trie2.get("")).to.be.null;
            expect(trie2.has("a")).to.be.true;

            expect(trie.has("")).to.be.true;
        });
    });

    describe("Custom Token Comparator", () => {
        test("should support case-insensitive matching via custom comparator", () => {
            let trie = ImmutableTrie.create<string, string, string>(
                key => key.split(""),
                (a, b) => a.toLowerCase() === b.toLowerCase()
            );

            trie = trie.insert("Cat", "cat-value");
            trie = trie.insert("DOG", "dog-value");

            expect(trie.get("cat")).toBe("cat-value");
            expect(trie.get("CAT")).toBe("cat-value");
            expect(trie.get("cAt")).toBe("cat-value");
            expect(trie.get("dog")).toBe("dog-value");
            expect(trie.get("DoG")).toBe("dog-value");

            const cValues = trie.prefix("c").order().toArray();
            expect(cValues).toEqual(["cat-value"]);
        });
    });

    describe("Array keys with default tokenizer using key's iterator", () => {
        test("should use the key's own iterator when tokenizer is not provided", () => {
            type Key = string[];
            let trie = ImmutableTrie.create<Key, number>();

            trie = trie.insert(["home", "user", "docs"], 1);
            trie = trie.insert(["home", "user", "pictures"], 2);
            trie = trie.insert(["home", "guest"], 3);

            expect(trie.get(["home", "user", "docs"])).toBe(1);
            expect(trie.get(["home", "user", "pictures"])).toBe(2);
            expect(trie.get(["home", "guest"])).toBe(3);
            expect(trie.get(["home", "admin"])).to.be.null;

            const homeUserValues = trie.prefix(["home", "user"]).order().toArray();
            expect(homeUserValues).toEqual([1, 2]);
        });
    });

    describe("Deletion behavior and Immutability", () => {
        test("should delete a leaf node cleanly and keep previous version intact", () => {
            let trie = ImmutableTrie.create<string, number>();

            trie = trie.insert("cat", 1);
            trie = trie.insert("car", 2);

            const beforeDelete = trie;
            const afterDelete = trie.delete("car");

            expect(afterDelete.has("car")).to.be.false;
            expect(afterDelete.get("car")).to.be.null;
            expect(afterDelete.has("cat")).to.be.true;
            expect(afterDelete.get("cat")).toBe(1);

            expect(beforeDelete.has("car")).to.be.true;
            expect(beforeDelete.get("car")).toBe(2);
            expect(beforeDelete.has("cat")).to.be.true;
        });

        test("should delete nested keys step by step without affecting other versions", () => {
            let trie = ImmutableTrie.create<string, number>();

            const t1 = trie.insert("ab", 1);
            const t2 = t1.insert("abc", 2);
            const t3 = t2.insert("abcd", 3);

            const t4 = t3.delete("abcd");

            expect(t4.has("abcd")).to.be.false;
            expect(t4.has("abc")).to.be.true;
            expect(t4.has("ab")).to.be.true;

            expect(t3.has("abcd")).to.be.true;
            expect(t3.has("abc")).to.be.true;
            expect(t3.has("ab")).to.be.true;

            const t5 = t4.delete("abc");
            expect(t5.has("abc")).to.be.false;
            expect(t5.has("ab")).to.be.true;

            const t6 = t5.delete("ab");
            expect(t6.has("ab")).to.be.false;
        });
    });
});
