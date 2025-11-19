import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { elementAt } from "../../../src/enumerator/functions/elementAt";
import { forEach } from "../../../src/enumerator/functions/forEach";
import { groupBy } from "../../../src/enumerator/functions/groupBy";
import { select } from "../../../src/enumerator/functions/select";
import { selectMany } from "../../../src/enumerator/functions/selectMany";
import { toArray } from "../../../src/enumerator/functions/toArray";
import { where } from "../../../src/enumerator/functions/where";
import { Person } from "../../models/Person";
import "../../../src/enumerator/Group";
import "../../../src/list/List";

describe("#groupBy()", () => {
    const sequence = new Set([Person.Alice, Person.Mel, Person.Senna, Person.Lenka, Person.Jane, Person.Kaori, Person.Reina]);
    test("should group people by age", () => {
        const groups = groupBy(sequence, p => p.age);
        const ages: number[] = [];
        const groupedAges: Record<number, number[]> = {};
        forEach(groups, g => {
            ages.push(g.key);
            groupedAges[g.key] = toArray(select(g.source, p => p.age));
        });
        expect(ages).to.have.all.members([9, 10, 16, 23]);
        forEach(Object.keys(groupedAges), key => {
            const sameAges = groupedAges[+key];
            const expectedAges = new Array(sameAges.length).fill(sameAges[0]);
            expect(sameAges).to.deep.equal(expectedAges);
        });
    });
    test("should return people who are younger than 16", () => {
        const kids = toArray(selectMany(where(groupBy(sequence, p => p.age), g => g.key < 16), g => g.source));
        const kids2 = groupBy(sequence, p => p.age).where(g => g.key < 16).selectMany(g => g.source).toArray();
        expect(kids).to.have.all.members([Person.Kaori, Person.Mel, Person.Senna]);
        expect(kids).to.deep.equal(kids2);
    });
    test("should use the provided comparator", () => {
        const sequence = [Person.Alice, Person.Mel, Person.Noemi, Person.Noemi2, Person.Reina];
        const groups = groupBy(sequence, p => p.name, (a, b) => a === b);
        expect(count(groups)).to.eq(4);
        expect(elementAt(groups, 0).key).to.eq("Alice");
        expect(elementAt(groups, 1).key).to.eq("Mel");
        expect(elementAt(groups, 2).key).to.eq("Noemi");
        expect(elementAt(groups, 3).key).to.eq("Reina");
        expect(count(elementAt(groups, 0).source)).to.eq(1);
        expect(count(elementAt(groups, 1).source)).to.eq(1);
        expect(count(elementAt(groups, 2).source)).to.eq(2);
        expect(count(elementAt(groups, 3).source)).to.eq(1);
    });
});
