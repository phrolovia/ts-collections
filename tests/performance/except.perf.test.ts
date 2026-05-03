import { beforeAll, describe, expect, test } from "vitest";
import { count, except, IEnumerable, range, select } from "../../src";
import { Helper } from "../helpers/Helper";
import { Person } from "../models/Person";

describe("#except Performance Tests()", () => {
    let first: IEnumerable<Person>;
    let second: IEnumerable<Person>;
    beforeAll(() => {
        first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
        second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
    });
    test("should return a set of people unique to first sequence", () => {
        const result = except(first, second, (a, b) => a.age === b.age);
        const ageCount = count(result, p => p.age <= 50);
        expect(ageCount).to.eq(0);
    });
    test("should use the order comparator parameter and return a set of people unique to first sequence", () => {
        const result = except(first, second, (a, b) => a.age - b.age);
        const ageCount = count(result, p => p.age <= 50);
        expect(ageCount).to.eq(0);
    });
    test("should handle 100,000 items efficiently with default comparator", () => {
        const first = Array.from({ length: 100000 }, (_, i) => i);
        const second = Array.from({ length: 50000 }, (_, i) => i * 2);
        const start = performance.now();
        const result = except(first, second).toArray();
        const end = performance.now();
        expect(end - start).toBeLessThan(500);
        expect(result.length).toBe(50000);
    });
});
