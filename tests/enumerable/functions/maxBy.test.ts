import { describe, expect, test } from "vitest";
import { maxBy } from "../../../src/enumerator/functions/maxBy";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";

describe("#maxBy()", () => {
    test("should return the maximum value by a selector", () => {
        const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        const maxPerson = maxBy(list, p => p.age);
        expect(maxPerson).to.eq(Person.Alice);
    });
    test("should throw an error if the list is empty", () => {
        const list = new List<Person>([]);
        expect(() => maxBy(list, p => p.age)).to.throw();
    });
});
