import { describe, expect, test } from "vitest";
import { union } from "../../../src/enumerator/functions/union";
import { Person } from "../../models/Person";

describe("#union()", () => {
    test("should return a set of items from both sequences", () => {
        const first = [1, 2, 3, 4, 5, 5, 5];
        const second = [4, 5, 6, 7, 8, 9, 7];
        const result = union(first, second);
        expect(result.toArray()).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    test("should use the comparator to determine equality", () => {
        const first = [Person.Alice, Person.Noemi];
        const second = [Person.Mirei, Person.Noemi2];
        const result = union(first, second, (p1, p2) => p1.name === p2.name);
        expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Mirei]);
    });
});
