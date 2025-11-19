import { describe, expect, test } from "vitest";
import { count } from "../../../src/enumerator/functions/count";
import { distinct } from "../../../src/enumerator/functions/distinct";
import { toList } from "../../../src/enumerator/functions/toList";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";

describe("#distinct()", () => {
    test("should return a list of unique elements", () => {
        const list = new List([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);
        const list2 = toList(distinct(list));
        expect(list2.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
    test("should return a list of unique elements #2", () => {
        const uniqueSequence = distinct([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
        expect(count(uniqueSequence)).to.eq(4);
        expect(uniqueSequence.toArray()).to.deep.equal([Person.Alice, Person.Mirei, Person.Lucrezia, Person.Vanessa]);
    });
    test("should return a list of unique elements with a comparer", () => {
        const uniqueSequence = distinct([Person.Mel, Person.Noemi, Person.Noemi2], (p1, p2) => p1.name === p2.name);
        expect(count(uniqueSequence)).to.eq(2);
        expect(uniqueSequence.toArray()).to.deep.equal([Person.Mel, Person.Noemi]);
    });
});
