import { describe, expect, test } from "vitest";
import { intersect } from "../../../src/enumerator/functions/intersect";
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
    test("should distinguish between 0 and -0", () => {
        const result = intersect([0, -0], [0]).toArray();
        expect(result).to.deep.equal([0]);
        expect(Object.is(result[0], 0)).to.be.true;

        const result2 = intersect([0, -0], [-0]).toArray();
        expect(result2).to.deep.equal([-0]);
        expect(Object.is(result2[0], -0)).to.be.true;
    });
});
