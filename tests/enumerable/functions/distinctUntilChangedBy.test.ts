import { describe, expect, test } from "vitest";
import { distinctUntilChangedBy } from "../../../src/enumerator/functions/distinctUntilChangedBy";
import { Person } from "../../models/Person";

describe("#distinctUntilChangedBy()", () => {
    test("should return distinct contiguous elements", () => {
        const list = [Person.Alice, Person.Alice, Person.Noemi, Person.Noemi2, Person.Rui];
        const distinct = distinctUntilChangedBy(list, p => p.name).toArray();
        expect(distinct).to.deep.equal([Person.Alice, Person.Noemi, Person.Rui]);
    });
    test("should return empty list if source is empty", () => {
        const list = [] as never[];
        const distinct = distinctUntilChangedBy(list, k => k).toArray();
        expect(distinct).to.deep.equal([]);
    });
    test("should use provided comparator for key comparison", () => {
        const littleAlice = new Person("alice", "Rivermist", 9);
        const list = [Person.Alice, littleAlice, Person.Ayana];
        const distinctWithoutComparator = distinctUntilChangedBy(list, p => p.name).toArray();
        const distinctWithComparator = distinctUntilChangedBy(list, p => p.name, (e1, e2) => e1.toLowerCase().localeCompare(e2.toLowerCase()) === 0).toArray();
        expect(distinctWithoutComparator).to.deep.equal([Person.Alice, littleAlice, Person.Ayana]);
        expect(distinctWithComparator).to.deep.equal([Person.Alice, Person.Ayana]);
    });
});
