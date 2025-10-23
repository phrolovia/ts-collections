import { describe, expect, test } from "vitest";
import { disjointBy } from "../../../src/enumerator/functions/disjointBy";
import { Person } from "../../models/Person";

describe("#disjointBy()", () => {
    test("should return true if two lists have no elements in common based on key", () => {
        const list1 = [Person.Alice, Person.Mel, Person.Senna];
        const list2 = [Person.Hanna, Person.Hanna2, Person.Noemi];
        expect(disjointBy(list1, list2, p => p.name, p => p.name)).to.be.true;
    });
    test("should return false if two lists have elements in common based on key", () => {
        const list1 = [Person.Alice, Person.Mel, Person.Suzuha];
        const list2 = [Person.Suzuha2, Person.Lucrezia, Person.Vanessa];
        expect(disjointBy(list1, list2, p => p, p => p)).to.be.true;
        expect(disjointBy(list1, list2, p => p.name, p => p.name)).to.be.false;
    });
    test("should return true if one list is empty", () => {
        const list1 = [] as Person[];
        const list2 = [Person.Suzuha, Person.Lucrezia, Person.Vanessa];
        expect(disjointBy(list1, list2, p => p.name, p => p.name)).to.be.true;
        expect(disjointBy(list1, list1, p => p.name, p => p.name)).to.be.true;
    });
    test("should return true if both lists are empty", () => {
        const list1 = [] as Person[];
        const list2 = [] as Person[];
        expect(disjointBy(list1, list2, p => p.name, p => p.name)).to.be.true;
    });
    test("should work with different types", () => {
        const list1 = [1, 2, 3];
        const list2 = ["1", "2", "3"];
        expect(disjointBy(list1, list2, n => n, s => s)).to.be.true;
        expect(disjointBy(list1, list2, n => n.toString(), s => s)).to.be.false;
    });
});
