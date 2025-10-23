import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { distinctBy } from "../../../src/enumerator/functions/distinctBy";
import { Person } from "../../models/Person";

describe("#distinctBy()", () => {
    test("should return a list of unique elements #2", () => {
        const uniqueSequence = distinctBy([Person.Alice, Person.Hanna, Person.Hanna2], p => p.name);
        expect(count(uniqueSequence)).to.eq(2);
        expect(uniqueSequence.toArray()).to.deep.equal([Person.Alice, Person.Hanna]);
    });
    test("should return a list of unique elements with a comparer", () => {
        const LittleMel = new Person("mel", "Kawashima", 16);
        const uniqueSequence = distinctBy([Person.Mel, Person.Noemi, Person.Noemi2, LittleMel], p => p.name, (a, b) => a.toLowerCase() === b.toLowerCase());
        expect(count(uniqueSequence)).to.eq(2);
        expect(uniqueSequence.toArray()).to.deep.equal([Person.Mel, Person.Noemi]);
    });
});
