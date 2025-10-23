import { describe, expect, test } from "vitest";
import { mode } from "../../../src/enumerator/functions/mode";
import { NoElementsException } from "../../../src/shared/NoElementsException";
import { Person } from "../../models/Person";

describe("#mode()", () => {
    test("should return most frequent element", () => {
        const list = [1, 2, 2, 3];
        const result = mode(list);
        expect(result).to.eq(2);
    });
    test("should return first most frequent element", () => {
        const list = [1, 2, 2, 1];
        const result = mode(list);
        expect(result).to.eq(1);
    });
    test("should throw if list is empty", () => {
        const list = [] as number[];
        expect(() => mode(list)).toThrow(new NoElementsException());
    });
    test("should use provided selector", () => {
        const list = [Person.Noemi, Person.Suzuha, Person.Suzuha2, Person.Suzuha3, Person.Noemi2];
        const result = mode(list, p => p.name);
        expect(result).to.eq(Person.Suzuha);
    });
});
