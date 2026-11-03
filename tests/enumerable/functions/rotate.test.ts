import { describe, expect, test } from "vitest";
import { rotate } from "../../../src/enumerator/functions/rotate";
import { Enumerable, LinkedList, List } from "../../../src";

describe("#rotate", () => {
    const sequence = [1, 2, 3, 4, 5];
    function* generated(): Generator<number> {
        yield* sequence;
    }
    test("should left rotate the sequence by 2", () => {
        const result = rotate(sequence, 2).toArray();
        expect(result).to.deep.equal([3, 4, 5, 1, 2]);
    });
    test("should right rotate the sequence by 2", () => {
        const result = rotate(sequence, -2).toArray();
        expect(result).to.deep.equal([4, 5, 1, 2, 3]);
    });
    test("should give the same result for arrays, collections and generated sequences", () => {
        for (const shift of [-12, -5, -1, 0, 1, 4, 5, 7, 12]) {
            const expected = Array.from({ length: 5 }, (_, i) => sequence[(((i + shift) % 5) + 5) % 5]);
            expect(rotate(sequence, shift).toArray()).toEqual(expected);
            expect(rotate(new List(sequence), shift).toArray()).toEqual(expected);
            expect(new LinkedList(sequence).rotate(shift).toArray()).toEqual(expected);
            expect(Enumerable.from(generated()).rotate(shift).toArray()).toEqual(expected);
            expect(Enumerable.from(sequence).where(() => true).rotate(shift).toArray()).toEqual(expected);
        }
    });
    test("should handle empty sequences", () => {
        expect(rotate([], 3).toArray()).toEqual([]);
        expect(rotate([], -3).toArray()).toEqual([]);
        expect(rotate(new List<number>(), 2).toArray()).toEqual([]);
    });
    test("should stay deferred and leave the source unchanged", () => {
        const source = [1, 2, 3];
        const rotated = rotate(source, 1);
        source.push(4);
        expect(rotated.toArray()).toEqual([2, 3, 4, 1]);
        expect(rotated.toArray()).toEqual([2, 3, 4, 1]);
        expect(source).toEqual([1, 2, 3, 4]);
    });
    test("should stream a left rotation of an unbounded sequence", () => {
        const naturals = Enumerable.from((function* () {
            for (let i = 0; ; ++i) {
                yield i;
            }
        })());
        expect(naturals.rotate(3).take(4).toArray()).toEqual([3, 4, 5, 6]);
    });
});
