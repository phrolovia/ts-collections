import { describe, expect, test } from "vitest";
import { OrderedHashTrie } from "../../../src/shared/internal/OrderedHashTrie";

const keysOf = <TKey, TValue>(trie: OrderedHashTrie<TKey, TValue>) => Array.from(trie, e => e.key);

describe("OrderedHashTrie", () => {
    test("should edit a mutable copy in place without changing the original", () => {
        let original = OrderedHashTrie.empty<number, string>();
        for (let i = 0; i < 100; ++i) {
            original = original.set(i, `v${i}`);
        }
        const mutable = original.asMutable();
        expect(mutable.set(100, "v100")).to.equal(mutable);
        expect(mutable.set(3, "changed")).to.equal(mutable);
        expect(mutable.remove(4)).to.equal(mutable);
        const frozen = mutable.asImmutable();

        expect(frozen.size).to.equal(100);
        expect(frozen.find(3)?.value).to.equal("changed");
        expect(frozen.find(4)).to.be.undefined;
        expect(frozen.find(100)?.value).to.equal("v100");
        expect(original.size).to.equal(100);
        expect(original.find(3)?.value).to.equal("v3");
        expect(original.find(4)?.value).to.equal("v4");
        expect(original.find(100)).to.be.undefined;
        expect(keysOf(original)).to.deep.equal(Array.from({ length: 100 }, (_, i) => i));
        expect(frozen.set(1, "x")).not.to.equal(frozen);
    });
    test("should compact removed slots in a mutable copy and keep order", () => {
        let original = OrderedHashTrie.empty<number, number>();
        for (let i = 0; i < 1000; ++i) {
            original = original.set(i, i);
        }
        const mutable = original.asMutable();
        for (let i = 0; i < 1000; ++i) {
            if (i % 10 !== 0) {
                mutable.remove(i);
            }
        }
        mutable.set(5, 5);
        mutable.set(20, -20);
        const frozen = mutable.asImmutable();
        expect(keysOf(frozen)).to.deep.equal([...Array.from({ length: 100 }, (_, i) => i * 10), 5]);
        expect(frozen.find(20)?.value).to.equal(-20);
        expect(original.size).to.equal(1000);
        expect(keysOf(original)).to.deep.equal(Array.from({ length: 1000 }, (_, i) => i));
    });
    test("should empty a mutable copy completely", () => {
        let original = OrderedHashTrie.empty<string, number>();
        original = original.set("a", 1).set("b", 2);
        const mutable = original.asMutable();
        mutable.remove("a");
        mutable.remove("b");
        mutable.remove("missing");
        const frozen = mutable.asImmutable();
        expect(frozen.size).to.equal(0);
        expect(keysOf(frozen)).to.deep.equal([]);
        expect(frozen.set("c", 3).find("c")?.value).to.equal(3);
        expect(keysOf(original)).to.deep.equal(["a", "b"]);
    });
});
