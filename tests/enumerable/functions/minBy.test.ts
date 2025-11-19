import { describe, expect, test } from "vitest";
import { minBy } from "../../../src/enumerator/functions/minBy";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";

describe("#minBy()", () => {
    test("should return the minimum value by a selector", () => {
        const list = new List([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        const minPerson = minBy(list, p => p.age);
        expect(minPerson).to.eq(Person.Vanessa);
    });
    test("should throw an error if the list is empty", () => {
        const list = new List<Person>([]);
        expect(() => minBy(list, p => p.age)).to.throw();
    });
});
