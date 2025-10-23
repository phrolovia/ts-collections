import { describe, expect, test } from "vitest";
import { max } from "../../../src/enumerator/functions/max";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";

describe("#max()", () => {
    test("should return the maximum value", () => {
        expect(max([1, 2, 3, 4, 5])).to.eq(5);
    });
    test("should return the maximum value with a selector", () => {
        const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        expect(max(list, p => p.age)).to.eq(23);
    });
    test("should throw an error if the list is empty", () => {
        const list = new List([]);
        expect(() => max(list)).to.throw();
    });
});
