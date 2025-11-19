import { describe, expect, test } from "vitest";
import { variance } from "../../../src/enumerator/functions/variance";

describe("#variance()", () => {
    test("should return the variance of the given list", () => {
        const list = [1, 2, 3, 4, 5];
        const sampleVariance = variance(list);
        const populationVariance = variance(list, x => x, false);
        expect(sampleVariance).to.equal(2.5);
        expect(populationVariance).to.equal(2);
    });
    test("should return variance as 0 for all identical values", () => {
        const list = [3, 3, 3, 3];
        const sampleVariance = variance(list);
        const populationVariance = variance(list, x => x, false);
        expect(sampleVariance).to.equal(0);
        expect(populationVariance).to.equal(0);
    });
    test("should return the variance of the given list #2", () => {
        const list = [2, 4];
        const sampleVariance = variance(list);
        const populationVariance = variance(list, x => x, false);
        expect(sampleVariance).to.equal(2);
        expect(populationVariance).to.equal(1);
    });
    test("should return NaN for empty input", () => {
        const list = [] as number[];
        const sampleVariance = variance(list);
        const populationVariance = variance(list, x => x, false);
        expect(sampleVariance).to.be.NaN;
        expect(populationVariance).to.be.NaN;
    });
    test("should return NaN for sample variance of single element list", () => {
        const list = [10];
        const sampleVariance = variance(list);
        expect(sampleVariance).to.be.NaN;
    });
    test("should return 0 for population variance of single element list", () => {
        const list = [10];
        const populationVariance = variance(list, x => x, false);
        expect(populationVariance).to.equal(0);
    });
    test("should work with given selector", () => {
        const people = [
            { name: "A", age: 20 },
            { name: "B", age: 25 },
            { name: "C", age: 30 }
        ];
        const sampleVariance = variance(people, p => p.age);
        const populationVariance = variance(people, x => x.age, false);
        expect(sampleVariance).to.equal(25);
        expect(populationVariance).to.eq(16.666666666666668);
    });
});
