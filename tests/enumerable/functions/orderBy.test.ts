import { describe, expect, test } from "vitest";
import { orderBy } from "../../../src/enumerator/functions/orderBy";
import { select } from "../../../src/enumerator/functions/select";
import { Person } from "../../models/Person";

describe("#orderBy()", () => {
    const people = [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola];
    test("should order the list by age", () => {
        const orderedPeople = orderBy(people, p => p.age);
        const orderedAges = select(orderedPeople, p => p.age);
        const expectedAges = [9, 10, 10, 14, 16, 16, 17, 20, 23, 23, 28];
        expect(orderedAges.toArray()).to.deep.equal(expectedAges);
    });
});
