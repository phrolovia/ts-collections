import { describe, expect, test } from "vitest";
import { standardDeviation } from "../../../src/enumerator/functions/standardDeviation";

describe("#standardDeviation()", () => {
    test("should return the standard deviation of the list", () => {
        const list = [1, 2, 3, 4, 5];
        const sampleStdDev = standardDeviation(list);
        const populationStdDev = standardDeviation(list, x => x, false);
        const acceptableResultForSample = (sampleStdDev - Math.sqrt(2.5)) < 1e-12;
        const acceptableResultForPopulation = (populationStdDev - Math.sqrt(2)) < 1e-12;
        expect(acceptableResultForSample).to.be.true;
        expect(acceptableResultForPopulation).to.be.true;
    });
    test("should return standard deviation as 0 for all identical values", () => {
        const list = [3, 3, 3, 3];
        const sampleStdDev = standardDeviation(list);
        const populationStdDev = standardDeviation(list, x => x, false);
        expect(sampleStdDev).to.equal(0);
        expect(populationStdDev).to.equal(0);
    });
    test("should return NaN for empty input", () => {
        const list = [] as number[];
        const sampleStdDev = standardDeviation(list);
        const populationStdDev = standardDeviation(list, x => x, false);
        expect(sampleStdDev).to.be.NaN;
        expect(populationStdDev).to.be.NaN;
    });
    test("should work with given selector", () => {
        const people = [
            {name: "A", age: 20},
            {name: "B", age: 25},
            {name: "C", age: 30}
        ];
        const sampleStdDev = standardDeviation(people, x => x.age);
        const populationStdDev = standardDeviation(people, x => x.age, false);
        const acceptableSampleStdDev = sampleStdDev - Math.sqrt(25) < 1e-12;
        const acceptablePopulationStdDev = populationStdDev - Math.sqrt(16.6666666667) < 1e-12;
        expect(acceptableSampleStdDev).to.be.true;
        expect(acceptablePopulationStdDev).to.be.true;
    });
});
