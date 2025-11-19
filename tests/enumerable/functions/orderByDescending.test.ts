import { describe, expect, test } from "vitest";
import { orderByDescending } from "../../../src/enumerator/functions/orderByDescending";
import "../../../src/enumerator/OrderedEnumerator";
import { select } from "../../../src/enumerator/functions/select";
import { Person } from "../../models/Person";

describe("#orderByDescending()", () => {
    const people = [Person.Alice, Person.Lenka, Person.Jane, Person.Jisu, Person.Kaori, Person.Mel, Person.Rebecca, Person.Reina, Person.Senna, Person.Vanessa, Person.Viola];
    test("should order the list by age", () => {
        const orderedPeople = orderByDescending(people, p => p.age);
        const orderedAges = select(orderedPeople, p => p.age);
        const expectedAges = [28, 23, 23, 20, 17, 16, 16, 14, 10, 10, 9];
        expect(orderedAges.toArray()).to.deep.equal(expectedAges);
    });
});
