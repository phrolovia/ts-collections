import { describe, expect, test } from "vitest";
import { from } from "../../../src/enumerator/functions/from";
import { pipe } from "../../../src/enumerator/functions/pipe";
import { where } from "../../../src/enumerator/functions/where";

describe("#pipe()", () => {
    test("should execute the given operator function", () => {
        const list1 = [1,2,3,4,5];
        const list2 = [6,7,8,9,10];
        const avgOfEvenSquares = (source: Iterable<number>): number => from(source).where(n => n % 2 === 0).select(n => n * n).average();
        const result1 = where(list1, n => n % 2 === 0).select(n => n * n).average();
        const result2 = where(list2, n => n % 2 === 0).select(n => n * n).average();
        const pipeResult1 = pipe(list1, avgOfEvenSquares);
        const pipeResult2 = pipe(list2, avgOfEvenSquares);
        expect(pipeResult1).to.eq(result1);
        expect(pipeResult2).to.eq(result2);
    });
});
