import { describe, expect, test } from "vitest";
import { Trie } from "../../src/tree/Trie";

describe("Trie", () => {
    describe("Default parameters", () => {
        test("should insert and retrieve simple string keys", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            trie.insert("car", 2);
            trie.insert("bird", 3);

            expect(trie.has("cat")).to.be.true;
            expect(trie.has("car")).to.be.true;
            expect(trie.has("bird")).to.be.true;
            expect(trie.has("crow")).to.be.false;
        });

        test("should overwrite existing key values", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            expect(trie.get("cat")).to.equal(1);
            trie.insert("cat", 42);
            expect(trie.get("cat")).to.equal(42);
        });

        test("should handle keys that are prefixes of other keys", () => {
            const trie = new Trie<string, string>();
            trie.insert("maria", "Maria");
            trie.insert("mariana", "Mariana");

            expect(trie.has("maria")).to.be.true;
            expect(trie.has("mariana")).to.be.true;
            expect(trie.get("maria")).to.equal("Maria");
            expect(trie.get("mariana")).to.equal("Mariana");

            expect(trie.delete("maria")).to.be.true;
            expect(trie.has("maria")).to.be.false;
            expect(trie.has("mariana")).to.be.true;
            expect(trie.get("mariana")).to.equal("Mariana");
        });

        test("should return false on deleting non-existent keys", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            trie.insert("car", 2);

            expect(trie.delete("crow")).to.be.false;
            expect(trie.has("cat")).to.be.true;
            expect(trie.has("car")).to.be.true;
        });

        test("should not delete when key is only a prefix and not terminal", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            expect(trie.delete("ca")).to.be.false;
            expect(trie.delete("cat")).to.be.true;
        });

        test("should support valuesWithPrefix for default string keys", () => {
            const trie = new Trie<string, string>();
            trie.insert("cat", "cat");
            trie.insert("car", "car");
            trie.insert("cart", "cart");
            trie.insert("dog", "dog");

            const valuesWithCa = trie.prefix("ca").order().toArray();
            const valuesWithCar = trie.prefix("car").order().toArray();
            const valuesWithDo = trie.prefix("do").order().toArray();
            const valuesWithX = trie.prefix("x").order().toArray();

            expect(valuesWithCa).toEqual(["car", "cart", "cat"]);
            expect(valuesWithCar).toEqual(["car", "cart"]);
            expect(valuesWithDo).toEqual(["dog"]);
            expect(valuesWithX).toEqual([]);
        });

        test("should have its iterator yield all values", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            trie.insert("car", 2);
            trie.insert("crow", 3);
            trie.insert("bird", 4);

            const values = trie.select(([, v]) => v).order().toArray();
            expect(values).toEqual([1, 2, 3, 4]);
        });
    });
    describe("Custom tokenizer", () => {
        test("should use dot-separated segments as tokens", () => {
            const trie = new Trie<string, string>((key: string) => key.split("."));

            trie.insert("page.home.title", "title");
            trie.insert("page.home.subtitle", "subtitle");
            trie.insert("page.about.title", "about-title");

            expect(trie.get("page.home.title")).toBe("title");
            expect(trie.get("page.home.subtitle")).toBe("subtitle");
            expect(trie.get("page.about.title")).toBe("about-title");
            expect(trie.get("page.home")).to.be.null;

            const homeValues = trie.prefix("page.home").order().toArray();
            expect(homeValues).toEqual(["subtitle", "title"]);
        });

        test("should support empty keys", () => {
            const trie = new Trie<string, string>((key: string) => key === "" ? [] : key.split(""));
            trie.insert("", "empty");
            trie.insert("a", "a-value");

            expect(trie.has("")).to.be.true;
            expect(trie.get("")).toBe("empty");
            expect(trie.has("a")).to.be.true;

            expect(trie.delete("")).to.be.true;
            expect(trie.has("")).to.be.false;
            expect(trie.has("a")).to.be.true;
        });
    });
    describe("Custom token comparator", () => {
        test("should support case-insensitive matching", () => {
            const trie = new Trie<string, string>(
                key => key.split(""),
                (a, b) => a.toLowerCase() === b.toLowerCase()
            );

            trie.insert("Cat", "feline");
            trie.insert("Raven", "bird");

            expect(trie.get("cat")).toBe("feline");
            expect(trie.get("CAT")).toBe("feline");
            expect(trie.get("RaVeN")).toBe("bird");

            expect(trie.delete("cAt")).to.be.true;
            expect(trie.has("CAT")).to.be.false;
            expect(trie.has("raven")).to.be.true;

            const values = trie.prefix("r").order().toArray();
            expect(values).toEqual(["bird"]);
        });
    });
    describe("Array keys with default tokenizer", () => {
        test("should use the key's own iterator as tokenizer", () => {
            const trie = new Trie<string[], number>();

            trie.insert(["home", "user", "docs"], 1);
            trie.insert(["home", "user", "pictures"], 2);
            trie.insert(["home", "guest"], 3);

            expect(trie.get(["home", "user", "docs"])).toBe(1);
            expect(trie.get(["home", "user", "pictures"])).toBe(2);
            expect(trie.get(["home", "guest"])).toBe(3);
            expect(trie.get(["home", "admin"])).to.be.null;

            const homeUserValues = trie.prefix(["home", "user"]).order().toArray();
            expect(homeUserValues).toEqual([1, 2]);
        });
    });
    describe("Deletion in more detail", () => {
        test("should delete a leaf node cleanly", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            trie.insert("car", 2);

            expect(trie.delete("car")).toBe(true);
            expect(trie.has("car")).toBe(false);
            expect(trie.has("cat")).toBe(true);
            expect(trie.get("cat")).toBe(1);
        });
        test("should delete a middle node that has deeper children when it becomes unnecessary", () => {
            const trie = new Trie<string, number>();
            trie.insert("ab", 1);
            trie.insert("abc", 2);
            trie.insert("abcd", 3);

            // Delete the deepest key
            expect(trie.delete("abcd")).toBe(true);
            expect(trie.has("abcd")).toBe(false);
            expect(trie.has("abc")).toBe(true);
            expect(trie.has("ab")).toBe(true);

            // Now delete "abc"
            expect(trie.delete("abc")).toBe(true);
            expect(trie.has("abc")).toBe(false);
            expect(trie.has("ab")).toBe(true);

            // And finally delete "ab"
            expect(trie.delete("ab")).toBe(true);
            expect(trie.has("ab")).toBe(false);
        });
    });
    describe("Enumeration", () => {
        test("should work with IEnumerable interface", () => {
            const trie = new Trie<string, number>();
            trie.insert("cat", 1);
            trie.insert("car", 2);
            trie.insert("crow", 3);
            trie.insert("bird", 4);

            const wordStartingWithC = trie.where(e => e[0].charAt(0) === 'c').select(e => e[1]).toArray().sort();
            expect(wordStartingWithC).toEqual([1, 2, 3]);
        });
    })
});
