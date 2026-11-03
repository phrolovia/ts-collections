import { describe, expect, test } from "vitest";
import { PersistentVector } from "../../../src/shared/internal/PersistentVector";

describe("PersistentVector", () => {
    test("should push and read elements across several trie levels", () => {
        let vector = PersistentVector.empty<number>();
        const count = 32 * 32 * 3 + 7;
        for (let i = 0; i < count; ++i) {
            vector = vector.push(i);
        }
        expect(vector.size).to.equal(count);
        for (let i = 0; i < count; ++i) {
            expect(vector.get(i)).to.equal(i);
        }
        expect(Array.from(vector)).to.deep.equal(Array.from({ length: count }, (_, i) => i));
    });
    test("should set elements without modifying earlier versions", () => {
        let original = PersistentVector.empty<string>();
        for (let i = 0; i < 2000; ++i) {
            original = original.push(`v${i}`);
        }
        const updated = original.set(1500, "changed").set(0, "first");
        expect(updated.get(1500)).to.equal("changed");
        expect(updated.get(0)).to.equal("first");
        expect(original.get(1500)).to.equal("v1500");
        expect(original.get(0)).to.equal("v0");
        expect(updated.size).to.equal(original.size);
    });
    test("should keep versions independent when pushing onto the same parent", () => {
        const base = PersistentVector.empty<number>().push(1).push(2);
        const left = base.push(3);
        const right = base.push(4);
        expect(Array.from(base)).to.deep.equal([1, 2]);
        expect(Array.from(left)).to.deep.equal([1, 2, 3]);
        expect(Array.from(right)).to.deep.equal([1, 2, 4]);
    });
    test("should edit a mutable copy in place without changing the original", () => {
        let original = PersistentVector.empty<number>();
        for (let i = 0; i < 100; ++i) {
            original = original.push(i);
        }
        const mutable = original.asMutable();
        expect(mutable.push(100)).to.equal(mutable);
        expect(mutable.set(5, -5)).to.equal(mutable);
        for (let i = 101; i < 2000; ++i) {
            mutable.push(i);
        }
        const frozen = mutable.asImmutable();
        expect(frozen.size).to.equal(2000);
        expect(frozen.get(5)).to.equal(-5);
        expect(frozen.get(1999)).to.equal(1999);
        expect(original.size).to.equal(100);
        expect(original.get(5)).to.equal(5);
        expect(Array.from(original)).to.deep.equal(Array.from({ length: 100 }, (_, i) => i));
        expect(frozen.push(1)).not.to.equal(frozen);
    });
});
