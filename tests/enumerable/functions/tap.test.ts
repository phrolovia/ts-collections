import { describe, expect, test } from "vitest";
import { tap } from "../../../src/enumerator/functions/tap";

describe("#tap()", () => {
    test("should tap into sequence without modifying it", () => {
        const list = [1,2,3,4,5];
        const squares: [number, number][] = [];
        const list2 = tap(list, (n, nx) => squares.push([nx, n*n])).toArray();
        const expectedTap = [
            [0, 1],
            [1, 4],
            [2, 9],
            [3, 16],
            [4, 25]
        ];
        expect(squares).to.deep.equal(expectedTap);
        expect(list2).to.deep.equal([1,2,3,4,5]);
    });
})
