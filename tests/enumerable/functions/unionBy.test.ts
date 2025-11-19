import { describe, expect, test } from "vitest";
import { unionBy } from "../../../src/enumerator/functions/unionBy";
import { Person } from "../../models/Person";

describe("#unionBy()", () => {
    test("should return a set of items from both sequences", () => {
        const first = [Person.Alice, Person.Mel, Person.Lenka, Person.Noemi];
        const second = [Person.Mirei, Person.Noemi2, Person.Hanna, Person.Lenka];
        const result = unionBy(first, second, p => p.name);
        expect(result.toArray()).to.deep.equal([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi, Person.Mirei, Person.Hanna]);
    });
    test("should use the comparator to determine equality", () => {
        const LitteAlice = new Person("Alice", "Nanahira", 5);
        const first = [Person.Alice, Person.Noemi];
        const second = [Person.Mirei, Person.Noemi2, LitteAlice];
        const result = unionBy(first, second, p => p.name, (p1, p2) => p1.toLowerCase().localeCompare(p2.toLowerCase()) === 0);
        expect(result.toArray()).to.deep.equal([Person.Alice, Person.Noemi, Person.Mirei]);
    });
});
