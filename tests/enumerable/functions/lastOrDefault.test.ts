import { describe, expect, expectTypeOf, test } from "vitest";
import { lastOrDefault } from "../../../src/enumerator/functions/lastOrDefault";
import { List } from "../../../src/list/List";
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

describe("#lastOrDefault()", () => {
    test("should return null if the sequence is empty", () => {
        expect(lastOrDefault([])).to.be.null;
    });
    test("should return the last element if no predicate is provided", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(lastOrDefault(list)).to.eq(5);
    });
    test("should return the last element that matches the predicate", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(lastOrDefault(list, n => n % 2 === 0)).to.eq(4);
    });
    test("should return null if no element matches the predicate", () => {
        expect(lastOrDefault([1, 2, 3, 4, 5], n => n > 5)).to.be.null;
    });
    test("should narrow items with type guard", () => {
        const lastSuccess = lastOrDefault(responses, isSuccess);
        expect(lastSuccess?.data).to.eq(Person.Mel);
        expectTypeOf(lastSuccess).toEqualTypeOf<ApiResponseSuccess<Person> | null>();
    });
});
