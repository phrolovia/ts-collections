import { describe, expect, expectTypeOf, test } from "vitest";
import { firstOrDefault } from "../../../src/enumerator/functions/firstOrDefault";
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

describe("#firstOrDefault()", () => {
    test("should return null if the sequence is empty", () => {
        expect(firstOrDefault([])).to.be.null;
    });
    test("should return the first element if no predicate is provided", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(firstOrDefault(list)).to.eq(1);
    });
    test("should return the first element that matches the predicate", () => {
        const list = new List([1, 2, 3, 4, 5]);
        expect(firstOrDefault(list, n => n % 2 === 0)).to.eq(2);
    });
    test("should return null if no element matches the predicate", () => {
        expect(firstOrDefault([1, 2, 3, 4, 5], n => n > 5)).to.be.null;
    });
    test("should narrow items with type guard", () => {
        const firstSuccess = firstOrDefault(responses, isSuccess);
        expect(firstSuccess?.data).to.eq(Person.Alice);
        expectTypeOf(firstSuccess).toEqualTypeOf<ApiResponseSuccess<Person> | null>();
    });
});
