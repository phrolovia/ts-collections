import { describe, expect, test } from "vitest";
import { sum } from "../../../src/enumerator/functions/sum";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";

describe("#sum()", () => {
    test("should return the sum of the sequence", () => {
        expect(sum([1, 2, 3, 4, 5])).to.eq(15);
    });
    test("should return the sum of the sequence with a selector", () => {
        const list = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
        expect(sum(list, p => p.age)).to.eq(77);
    });
    test("should throw an error if the list is empty", () => {
        expect(() => sum([])).to.throw();
    });
});
