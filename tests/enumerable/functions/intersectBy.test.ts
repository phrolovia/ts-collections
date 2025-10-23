import { describe, expect, test } from "vitest";
import { intersectBy } from "../../../src/enumerator/functions/intersectBy";
import { Person } from "../../models/Person";

describe("#intersectBy()", () => {
    test("should return [4,5]", () => {
        const first = [1, 2, 3, 4, 5];
        const second = [4, 5, 6, 7, 8];
        const result = intersectBy(first, second, n => n);
        expect(result.toArray()).to.deep.equal([4, 5]);
    });
    test("should return [3,4,5]", () => {
        const first = [1, 2, 3, 3, 4, 5, 5, 5, 11];
        const second = [3, 3, 3, 4, 4, 5, 5, 6, 7, 8];
        const result = intersectBy(first, second, n => n);
        expect(result.toArray()).to.deep.equal([3, 4, 5]);
    });
    test("should only have 'Mel', 'Lenka', 'Jane' and 'Noemi'", () => {
        const result = intersectBy(
            [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
            [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
            p => p.name
        );
        expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
    });
    test("should only have 'Noemi', 'Mel', 'Lenka' and 'Jane'", () => {
        const result = intersectBy(
            [Person.Alice, Person.Noemi, Person.Mel, Person.Senna, Person.Lenka, Person.Jane],
            [Person.Mel, Person.Lenka, Person.Jane, Person.Noemi2],
            p => p.name,
            (a, b) => a.toLowerCase() === b.toLowerCase()
        );
        expect(result.toArray()).to.deep.equal([Person.Noemi, Person.Mel, Person.Lenka, Person.Jane]);
    });
});
