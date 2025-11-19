import { describe, expect, test } from "vitest";
import { contains } from "../../../src/enumerator/functions/contains";
import { Person } from "../../models/Person";

describe("#contains()", () => {
    test("should return true if the list contains the element", () => {
        const sequence = [Person.Alice, Person.Hanyuu, Person.Mirei];
        const result = contains(sequence, Person.Alice);
        expect(result).to.be.true;
    });
    test("should return false if the list does not contain the element", () => {
        const sequence = [Person.Alice, Person.Hanyuu, Person.Mirei];
        const result = contains(sequence, Person.Priscilla);
        expect(result).to.be.false;
    });
    test("should return false if the list does not contain the element #2", () => {
        const sequence = [Person.Noemi, Person.Vanessa];
        expect(contains(sequence, Person.Noemi2)).to.be.false;
    });
    test("should return true if the list contains the element with a comparer", () => {
        const sequence = [Person.Noemi, Person.Vanessa];
        expect(contains(sequence, Person.Noemi2, (a, b) => a.name === b.name)).to.be.true;
    });
});
