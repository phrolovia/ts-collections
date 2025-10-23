import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { intersect } from "../../../src/enumerator/functions/intersect";
import { range } from "../../../src/enumerator/functions/range";
import { select } from "../../../src/enumerator/functions/select";
import { Helper } from "../../helpers/Helper";
import { Person } from "../../models/Person";

describe("#intersect()", () => {
    test("should return [4,5]", () => {
        const first = [1, 2, 3, 4, 5];
        const second = [4, 5, 6, 7, 8];
        const result = intersect(first, second);
        expect(result.toArray()).to.deep.equal([4, 5]);
    });
    test("should return [3,4,5]", () => {
        const first = [1, 2, 3, 3, 4, 5, 5, 5, 11];
        const second = [3, 3, 3, 4, 4, 5, 5, 6, 7, 8];
        const result = intersect(first, second);
        expect(result.toArray()).to.deep.equal([3, 4, 5]);
    });
    test("should ony have 'Mel', 'Lenka' and 'Jane'", () => {
        const result = intersect(
            [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
            [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
        );
        expect(result.toArray()).to.deep.equal([Person.Mel, Person.Lenka, Person.Jane]);
    });
    test("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
        const result = intersect(
            [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
            [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
            (a, b) => a.name === b.name
        );
        expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
    });
    test("should return a set of people who are both in first and second sequence", () => {
        const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
        const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
        const intersection = intersect(first, second, (a, b) => a.age === b.age);
        const ageCount = count(intersection, p => p.age > 59);
        expect(ageCount).to.eq(0);
    });
    test("should use the order comparator parameter and return a set of people who are both in first and second sequence", () => {
        const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
        const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
        const intersection = intersect(first, second, (a, b) => a.age - b.age);
        const ageCount = count(intersection, p => p.age > 59);
        expect(ageCount).to.eq(0);
    });
});
