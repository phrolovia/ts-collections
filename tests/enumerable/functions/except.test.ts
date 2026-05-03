import { describe, expect, test } from "vitest";
import { except } from "../../../src/enumerator/functions/except";
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
    test("should distinguish between 0 and -0", () => {
        const result = except([0, -0], [-0]).toArray();
        expect(result).to.deep.equal([0]);
        expect(Object.is(result[0], 0)).to.be.true;

        const result2 = except([0, -0], [0]).toArray();
        expect(result2).to.deep.equal([-0]);
        expect(Object.is(result2[0], -0)).to.be.true;
    });
});
