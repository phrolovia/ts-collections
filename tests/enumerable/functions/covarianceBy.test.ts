import { describe, expect, test } from "vitest";
import { covarianceBy } from "../../../src/enumerator/functions/covarianceBy";
import { InsufficientElementException } from "../../../src/shared/InsufficientElementException";
import { Pair } from "../../models/Pair";

describe("#covarianceBy()", () => {
    test("should return covariance by two keys of one list", () => {
        const list = [
            new Pair(1, 2),
            new Pair(2, 4),
            new Pair(3, 6),
            new Pair(4, 8),
            new Pair(5, 10),
        ];
        const sampleCovariance = covarianceBy(list, p => p.key, p => p.value);
        const populationCovariance = covarianceBy(list, p => p.key, p => p.value, false);
        expect(sampleCovariance).to.eq(5);
        expect(populationCovariance).to.eq(4);
    });
    test("should throw error if list has less than two elements", () => {
        const list1 = [] as Pair<number, number>[];
        expect(() => covarianceBy(list1, p => p.key, p => p.value)).toThrowError(
            new InsufficientElementException("Covariance requires at least two pairs of elements.")
        );
        const list2 = [new Pair(1, 2)];
        expect(() => covarianceBy(list2, p => p.key, p => p.value)).toThrowError(
            new InsufficientElementException("Covariance requires at least two pairs of elements.")
        );
    });
    test("should return 0 if one key has no variance", () => {
        const list = [
            new Pair(3, 2),
            new Pair(3, 4),
            new Pair(3, 6),
            new Pair(3, 8),
            new Pair(3, 10),
        ];
        const covariance = covarianceBy(list, p => p.key, p => p.value);
        expect(covariance).to.eq(0);
    });
    test("should return 0 if both keys have no variance", () => {
        const list = [
            new Pair(3, 7),
            new Pair(3, 7),
            new Pair(3, 7),
            new Pair(3, 7),
            new Pair(3, 7),
        ];
        const covariance = covarianceBy(list, p => p.key, p => p.value);
        expect(covariance).to.eq(0);
    });
    test("should return negative covariance", () => {
        const list = [
            new Pair(1, 10),
            new Pair(2, 8),
            new Pair(3, 6),
            new Pair(4, 4),
            new Pair(5, 2),
        ];
        const covariance = covarianceBy(list, p => p.key, p => p.value);
        expect(covariance).to.eq(-5);
    });
});
