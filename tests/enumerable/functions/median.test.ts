import { describe, expect, test } from "vitest";
import { median } from "../../../src/enumerator/functions/median";
import { Person } from "../../models/Person";

describe("#median()", () => {
    test("should return the median of the list which has odd number of elements", () => {
        const list = [3, 1, 5, 4, 2];
        const result = median(list);
        expect(result).to.eq(3);
    });
    test("should return the low median of the list which has even number of elements", () => {
        const list = [4, 2, 1, 3];
        const result = median(list, x => x, "low");
        expect(result).to.eq(2);
    });
    test("should return the high median of the list which has even number of elements", () => {
        const list = [4, 2, 1, 3];
        const result = median(list, x => x, "high");
        expect(result).to.eq(3);
    });
    test("should return the interpolated median of the list which has even number of elements", () => {
        const list = [4, 3, 1, 2];
        const result = median(list, x => x, "interpolate");
        expect(result).to.eq(2.5);
    });
    test("should return NaN if the list is empty", () => {
        const list = [] as number[];
        const result = median(list);
        expect(result).to.be.NaN;
    });
    test("should use provided selector", () => {
        const list = [Person.Bella, Person.Kaori, Person.Vanessa];
        const result = median(list, p => p.age);
        expect(result).to.eq(20);
    });
});
