import { describe, expect, test } from "vitest";
import { sequenceEqual } from "../../../src/enumerator/functions/sequenceEqual";
import { List } from "../../../src/list/List";
import { ImmutableSet } from "../../../src/set/ImmutableSet";
import { Person } from "../../models/Person";

describe("#sequenceEqual()", () => {
    test("should return false if the sequence sizes are different", () => {
        const first = [1, 2, 3, 4, 5];
        const second = [1, 2, 3, 4];
        const result = sequenceEqual(first, second);
        expect(result).to.be.false;
    });
    test("should return false if the sequence sizes are different #2", () => {
        const first = [1, 2, 3, 4];
        const second = [1, 2, 3, 4, 5];
        const result = sequenceEqual(first, second);
        expect(result).to.be.false;
    });
    test("should return false if the sequence elements are different", () => {
        const first = [1, 2, 3, 4, 5];
        const second = [1, 2, 3, 4, 6];
        const result = sequenceEqual(first, second);
        expect(result).to.be.false;
    });
    test("should return false if the order of the sequence elements are different", () => {
        const first = [1, 2, 3, 4, 5];
        const second = [1, 2, 3, 5, 4];
        const result = sequenceEqual(first, second);
        expect(result).to.be.false;
    });
    test("should return true if the sequences are equal", () => {
        const first = [1, 2, 3, 4, 5];
        const second = [1, 2, 3, 4, 5];
        const result = sequenceEqual(first, second);
        expect(result).to.be.true;
    });
    test("should return true if the sequences are equal #2", () => {
        const first = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi]);
        const second = new List([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi2]);
        const resultWithComparator = sequenceEqual(first, second, (a, b) => a.name === b.name);
        const resultWithoutComparator = sequenceEqual(first, second);
        expect(resultWithComparator).to.be.true;
        expect(resultWithoutComparator).to.be.false;
    });
    test("should return true if the sequences are empty", () => {
        const first: number[] = [];
        const second: number[] = [];
        const result = sequenceEqual(first, second);
        expect(result).to.be.true;
    });
    test("should return true if the sequences are empty #2", () => {
        const first = ImmutableSet.create<number>([1]);
        const second: number[] = [1];
        const result = sequenceEqual(first, second);
        expect(result).to.be.true;
    });
    test("should return false if one of the sequences is empty", () => {
        const first: number[] = [];
        const second: number[] = [1];
        const result1 = sequenceEqual(first, second);
        const result2 = sequenceEqual(second, first);
        expect(result1).to.be.false;
        expect(result2).to.be.false;
    });
});
