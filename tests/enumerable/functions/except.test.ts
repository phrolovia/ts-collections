import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { except } from "../../../src/enumerator/functions/except";
import { range } from "../../../src/enumerator/functions/range";
import { select } from "../../../src/enumerator/functions/select";
import { Helper } from "../../helpers/Helper";
import { Person } from "../../models/Person";
import "../../../src/set/SortedSet";

describe("#except()", () => {
    test("should return [1,2,3]", () => {
        const result = except([1, 2, 3, 3, 4, 5], [4, 5, 6, 7, 8]);
        expect(result.toArray()).to.deep.equal([1, 2, 3]);
    });
    test("should return [1,2]", () => {
        const result = except([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 7, 8]);
        expect(result.toArray()).to.deep.equal([1, 2]);
    });
    test("should only have 'Alice', 'Noemi' and 'Senna'", () => {
        const result = except(
            [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
            [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2]
        );
        expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Senna]);
    });
    test("should only have 'Alice' and 'Senna'", () => {
        const result = except(
            [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
            [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
            (a, b) => a.name === b.name
        );
        expect(result.toArray()).to.deep.equal([Person.Alice, Person.Senna]);
    });
    test("should return a set of people unique to first sequence", () => {
        const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
        const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
        const result = except(first, second, (a, b) => a.age === b.age);
        const ageCount = count(result, p => p.age <= 50);
        expect(ageCount).to.eq(0);
    });
    test("should use the order comparator parameter and return a set of people unique to first sequence", () => {
        const first = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 90)));
        const second = select(range(1, 100000), _ => new Person(Helper.generateRandomString(8), Helper.generateRandomString(10), Helper.generateRandomNumber(1, 50)));
        const result = except(first, second, (a, b) => a.age - b.age);
        const ageCount = count(result, p => p.age <= 50);
        expect(ageCount).to.eq(0);
    });
});
