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
});
