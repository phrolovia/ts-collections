import { describe, expect, test } from "vitest";
import { aggregateBy } from "../../../src/enumerator/functions/aggregateBy";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";
import "../../../src/enumerator/Group";

describe("#aggregateBy()", () => {
    test("should return (name, sum of ages)", () => {
        const sequence = new List([Person.Alice, Person.Noemi, Person.Noemi2, Person.Jisu])
        const result = aggregateBy(sequence, p => p.name, () => 0, (total, next) => total + next.age);
        const obj = result.toObject(p => p.key, p => p.value);
        expect(obj).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 14});
    });
    test("should return (name, sum of ages) with a comparer", () => {
        const LittleJisu = new Person("jisu", "", 6);
        const sequence = new List([Person.Alice, Person.Noemi, Person.Noemi2, Person.Jisu, LittleJisu])
        const result1 = aggregateBy(sequence, p => p.name, () => 0, (total, next) => total + next.age);
        const result2 = aggregateBy(sequence, p => p.name, () => 0, (total, next) => total + next.age, (a, b) => a.toLowerCase() === b.toLowerCase());
        const obj1 = result1.toObject(p => p.key, p => p.value);
        const obj2 = result2.toObject(p => p.key, p => p.value);
        expect(obj1).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 14, "jisu": 6});
        expect(obj2).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 20});
    });
    test("should work with non function seed", () => {
        const sequence = new List([Person.Alice, Person.Noemi, Person.Noemi2, Person.Jisu])
        const result = aggregateBy(sequence, p => p.name, 0, (total, next) => total + next.age);
        const obj = result.toObject(p => p.key, p => p.value);
        expect(obj).to.deep.equal({"Alice": 23, "Noemi": 72, "Jisu": 14});
    });
});
