import { describe, expect, test } from "vitest";
import { chunk } from "../../../src/enumerator/functions/chunk";
import { count } from "../../../src/enumerator/functions/count";
import { elementAt } from "../../../src/enumerator/functions/elementAt";
import { forEach } from "../../../src/enumerator/functions/forEach";
import { range } from "../../../src/enumerator/functions/range";
import "../../../src/list/List";

describe("#chunk()", () => {
    test("should split the list into groups of 10", () => {
        const sequence = range(1, 100);
        const chunks = chunk(sequence, 10);
        expect(count(chunks)).to.eq(10);
        forEach(chunks, c => expect(count(c)).to.eq(10));
    });
    test("should split the list into a group of 3 at most", () => {
        const sequence = range(1, 8);
        const chunks = chunk(sequence, 3);
        expect(count(chunks)).to.eq(3);
        expect(count(elementAt(chunks, 0))).to.eq(3);
        expect(count(elementAt(chunks, 1))).to.eq(3);
        expect(count(elementAt(chunks, 2))).to.eq(2);
    });
});
