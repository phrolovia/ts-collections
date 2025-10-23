import { describe, expect, test } from "vitest";
import { modeOrDefault } from "../../../src/enumerator/functions/modeOrDefault";
import { NoElementsException } from "../../../src/shared/NoElementsException";
import { Person } from "../../models/Person";

describe("#modeOrDefault()", () => {
    test("should return most frequent element", () => {
        const list = [1, 2, 2, 3];
        const mode = modeOrDefault(list);
        expect(mode).to.eq(2);
    });
    test("should return first most frequent element", () => {
        const list = [1, 2, 2, 1];
        const mode = modeOrDefault(list);
        expect(mode).to.eq(1);
    });
    test("should return null if list is empty", () => {
        const list = [] as number[];
        const mode = modeOrDefault(list);
        expect(mode).to.be.null;
    });
    test("should not throw if list is empty", () => {
        const list = [] as number[];
        expect(() => modeOrDefault(list)).not.toThrow(new NoElementsException());
    });
    test("should use provided selector", () => {
        const list = [Person.Noemi, Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi2];
        const mode = modeOrDefault(list, p => p.name);
        expect(mode).to.eq(Person.Suzuha);
    });
});
