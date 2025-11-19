import { describe, expect, test } from "vitest";
import { multimode } from "../../../src/enumerator/functions/multimode";
import { Person } from "../../models/Person";

describe("#multimode()", () => {
    test("should return a list of most frequent elements", () => {
        const list1 = [1, 2, 2, 3];
        const list2 = [1, 2, 2, 3, 3];
        const mode1 = multimode(list1).toArray();
        const mode2 = multimode(list2).toArray();
        expect(mode1).to.deep.equal([2]);
        expect(mode2).to.deep.equal([2, 3]);
    });
    test("should return empty list if source list is empty", () => {
        const list = [] as number[];
        const mode = multimode(list).toArray();
        expect(mode).to.be.empty;
    });
    test("should use provided selector", () => {
        const list = [
            Person.Noemi,
            Person.Suzuha,
            Person.Noemi2,
            Person.Suzuha2,
            Person.Bella
        ];
        const mode = multimode(list, p => p.name).toArray();
        expect(mode).to.deep.equal([Person.Noemi, Person.Suzuha]);
    });
});
