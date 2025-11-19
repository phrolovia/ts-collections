import { describe, expect, it, test } from "vitest";
import { combinations } from "../../../src/enumerator/functions/combinations";
import "../../../src/enumerator/OrderedEnumerator";
import "../../../src/list/List";

describe("#combinations()", () => {
    test("should return all combinations of the string", () => {
        const sequence = "AYANA";
        const cmb = combinations(sequence);
        const combinationsArray = cmb.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(24);
    });
    test("should return all combinations of the string with a length of 1", () => {
        const sequence = "AYANA";
        const cmb = combinations(sequence, 1);
        const combinationsArray = cmb.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(3);
    });
    test("should return all combinations of the string with a length of 2", () => {
        const sequence = "AYANA";
        const combinationsEnum = combinations(sequence, 2);
        const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(6);
    });
    test("should return all combinations of the string with a length of 3", () => {
        const sequence = "AYANA";
        const combinationsEnum = combinations(sequence, 3);
        const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(8);
    });
    it("should return all combinations of the string with a length of 4", () => {
        const sequence = "AYANA";
        const combinationsEnum = combinations(sequence, 4);
        const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(5);
    });
    it("should return all combinations of the string with a length of 5", () => {
        const sequence = "AYANA";
        const combinationsEnum = combinations(sequence, 5);
        const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(1);
    });
    it("should return all combinations of the string with a length of 6", () => {
        const sequence = "AYANA";
        const combinationsEnum = combinations(sequence, 6);
        const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(0);
    });
    it("should return all combinations of the string #2", () => {
        const sequence = "ALICE";
        const combinationsEnum = combinations(sequence);
        const combinationsArray = combinationsEnum.select(p => p.toArray()).orderBy(c => c.length).toArray();
        expect(combinationsArray.length).to.eq(32);
    });
});
