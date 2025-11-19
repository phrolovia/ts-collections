import { describe, expect, test } from "vitest";
import { min } from "../../../src/enumerator/functions/min";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";

describe("#min()", () => {
    test("should return the minimum value", () => {
        expect(min([1, 2, 3, 4, 5])).to.eq(1);
    });
    test("should return the minimum value with a selector", () => {
        const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        expect(min(list, p => p.age)).to.eq(20);
    });
    test("should throw an error if the list is empty", () => {
        const list = new List([]);
        expect(() => min(list)).to.throw();
    });
});
