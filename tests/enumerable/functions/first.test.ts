import { describe, expect, expectTypeOf, test } from "vitest";
import { first } from "../../../src/enumerator/functions/first";
import { List } from "../../../src/list/List";
import { NoElementsException } from "../../../src/shared/NoElementsException";
import { NoMatchingElementException } from "../../../src/shared/NoMatchingElementException";
import { ApiResponse, ApiResponseSuccess, isSuccess } from "../../models/ApiResponse";
import { Person } from "../../models/Person";

const responses = new List<ApiResponse<Person>>([
    { status: "success", data: Person.Alice },
    { status: "error", error: "Not found" },
    { status: "success", data: Person.Bella },
    { status: "error", error: "Server error" },
    { status: "success", data: Person.Mel },
    { status: "loading", estimatedTime: 4000 }
]);

describe("#first()", () => {
    test("should throw error if the sequence is empty", () => {
        expect(() => first([])).toThrow(new NoElementsException());
    });
    test("should return the first element if no predicate is provided", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(first(list)).to.eq(1);
    });
    test("should return the first element that matches the predicate", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(first(list, n => n % 2 === 0)).to.eq(2);
    });
    test("should throw error if no element matches the predicate", () => {
        expect(() => first([1, 2, 3, 4, 5], n => n > 5)).toThrowError(new NoMatchingElementException());
    });
    test("should narrow items with type guard", () => {
        const firstSuccess = first(responses, isSuccess);
        expect(firstSuccess.data).to.eq(Person.Alice);
        expectTypeOf(firstSuccess).toEqualTypeOf<ApiResponseSuccess<Person>>();
    });
});
