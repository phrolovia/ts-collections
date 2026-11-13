import { describe, expect, test } from "vitest";
import { exceptBy } from "../../../src/enumerator/functions/exceptBy";
import { Person } from "../../models/Person";

describe("#exceptBy()", () => {
    test("should return [1,2,3]", () => {
        const result = exceptBy([1, 2, 3, 3, 4, 5], [4, 5, 6, 7, 8], n => n);
        expect(result.toArray()).to.deep.equal([1, 2, 3]);
    });
    test("should return [1,2]", () => {
        const result = exceptBy([1, 2, 3, 3, 4, 5], [3, 4, 5, 6, 7, 8], n => n);
        expect(result.toArray()).to.deep.equal([1, 2]);
    });
    test("should only have 'Alice', 'Noemi' and 'Senna'", () => {
        const result = exceptBy(
            [Person.Alice, Person.Noemi],
            [Person.Mel, Person.Noemi2],
            p => p.name
        );
        expect(result.toArray()).to.deep.equal([Person.Alice]);
    });
    test("should use provided comparer", () => {
        const LittleAlice = new Person("alice", "Kawashima", 9);
        const result = exceptBy(
            [Person.Alice, Person.Reina],
            [LittleAlice],
            p => p.name,
            (a, b) => a.toLowerCase() === b.toLowerCase()
        );
        expect(result.toArray()).to.deep.equal([Person.Reina]);
    });
});
