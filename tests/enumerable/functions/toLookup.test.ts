import { describe, expect, test } from "vitest";
import { toLookup } from "../../../src/enumerator/functions/toLookup";
import { Person } from "../../models/Person";
import "../../../src/lookup/Lookup";

describe("#toLookup()", () => {
    test("should return a lookup", () => {
        const lookup = toLookup(
            [Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi, Person.Noemi2, Person.Hanna, Person.Hanna2],
            p => p.name,
            p => p,
            (n1, n2) => n1.localeCompare(n2)
        );
        expect(lookup.size()).to.eq(3);
        expect(lookup.hasKey("Noemi")).to.be.true;
    });
});
