import { describe, expect, test } from "vitest";
import { empty } from "../../../src/enumerator/functions/empty";

describe("#empty()", () => {
    test("should create an empty enumerable", () => {
        const enumerable = empty<number>();
        expect(enumerable.count()).to.eq(0);
    });
});
