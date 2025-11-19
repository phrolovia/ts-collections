import { describe, expect, test } from "vitest";
import { aggregate } from "../../../src/enumerator/functions/aggregate";
import { NoElementsException } from "../../../src/shared/NoElementsException";

describe("#aggregate()", () => {
    test("should return 6", () => {
        const sequence = [4, 8, 8, 3, 9, 0, 7, 8, 2];
        const result = aggregate(sequence, (total, next) => next % 2 === 0 ? total + 1 : total, 0);
        expect(result).to.eq(6);
    });
    test("should return pomegranate", () => {
        const sequence = ["apple", "mango", "orange", "pomegranate", "grape"];
        const result = aggregate(sequence, (longest, next) => next.length > longest.length ? next : longest, "banana");
        expect(result).to.eq("pomegranate");
    });
    test("should return 10", () => {
        const sequence = [1, 2, 3, 4];
        const result = aggregate(sequence, (total, next) => total + next);
        expect(result).to.eq(10);
    });
    test("should throw error if the sequence is empty and no seed is provided", () => {
        expect(() => aggregate<number>([], (total, next) => total + next)).toThrow(new NoElementsException());
    });
    test("should return the seed if the sequence is empty", () => {
        const result = aggregate<number, number>([], (total, next) => total + next, 10);
        expect(result).to.eq(10);
    });
    test("should use the result selector", () => {
        const sequence = [1, 2, 3, 4];
        const result = aggregate(sequence, (total, next) => total + next, 0, result => Math.pow(result, 2));
        expect(result).to.eq(100);
    });
});
