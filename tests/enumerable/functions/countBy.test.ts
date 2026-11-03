import { describe, expect, test } from "vitest";
import { countBy } from "../../../src/enumerator/functions/countBy";
import { List } from "../../../src/list/List";
import { Person } from "../../models/Person";
import "../../../src/enumerator/Group";

describe("#countBy()", () => {
    const list = new List([Person.Suzuha, Person.Suzuha2, Person.Kaori]);
    test("should return 2", () => {
        const countPairs = countBy(list, p => p.name);
        const suuzhaCount = countPairs.first(p => p.key === "Suzuha").value;
        expect(suuzhaCount).to.eq(2);
    });
    test("should use provided comparer", () => {
        const LittleKaori = new Person("kaori", "Kawashima", 16);
        const list2 = new List([Person.Suzuha, Person.Suzuha2, Person.Kaori, LittleKaori]);
        const countPairs = countBy(list2, p => p.name, (a, b) => a.toLowerCase() === b.toLowerCase());
        const suuzhaCount = countPairs.first(p => p.key === "Suzuha").value;
        expect(suuzhaCount).to.eq(2);
        const kaoriCount = countPairs.first(p => p.key === "Kaori").value;
        expect(kaoriCount).to.eq(2);
    });
    test("should return number of words", () => {
        const str = `apple banana apple strawberry banana lemon`;
        const record = countBy(str.split(" "), s => s).toObject(p => p.key, p => p.value);
        expect(record).to.deep.equal({ apple: 2, banana: 2, strawberry: 1, lemon: 1 });
    });
    test("should count keys with Object.is semantics", () => {
        const counts = countBy([0, -0, -0, NaN, NaN], x => x).select(p => [p.key, p.value]).toArray();
        expect(counts).to.deep.equal([[0, 1], [-0, 2], [NaN, 2]]);
        expect(Object.is(counts[1][0], -0)).to.be.true;
    });
});
