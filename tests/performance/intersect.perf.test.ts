import { beforeAll, describe, expect, test } from "vitest";
import { IEnumerable } from "../../src";
import { count } from "../../src/enumerator/functions/count";
import { intersect } from "../../src/enumerator/functions/intersect";
import { range } from "../../src/enumerator/functions/range";
import { select } from "../../src/enumerator/functions/select";
import { Helper } from "../helpers/Helper";
import { Person } from "../models/Person";

describe("#intersect() Performance Tests", () => {
    let first: IEnumerable<Person>;
    let second: IEnumerable<Person>;
    beforeAll(() => {
        first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
        second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
    });
    test("should return a set of people who are both in first and second sequence", () => {
        const intersection = intersect(first, second, (a, b) => a.age === b.age);
        const ageCount = count(intersection, p => p.age > 59);
        expect(ageCount).to.eq(0);
    });
    test("should use the order comparator parameter and return a set of people who are both in first and second sequence", () => {
        const intersection = intersect(first, second, (a, b) => a.age - b.age);
        const ageCount = count(intersection, p => p.age > 59);
        expect(ageCount).to.eq(0);
    });
    test("should handle 100,000 items efficiently with default comparator", () => {
        const first = Array.from({ length: 100000 }, (_, i) => i);
        const second = Array.from({ length: 100000 }, (_, i) => i + 50000);
        const start = performance.now();
        const result = intersect(first, second).toArray();
        const end = performance.now();
        expect(end - start).toBeLessThan(500);
        expect(result.length).toBe(50000);
    });
});
