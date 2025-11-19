import { describe, expect, expectTypeOf, test } from "vitest";
import { span } from "../../../src/enumerator/functions/span";
import { IEnumerable } from "../../../src/enumerator/IEnumerable";
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

describe("#span", () => {
    test("should return two lists", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const result = span(list, n => n < 3);
        expect(result[0].toArray()).to.deep.equal([1, 2]);
        expect(result[1].toArray()).to.deep.equal([3, 4, 5]);
    });
    test("should narrow items with type guard", () => {
        const [initialSuccesses, remainder] = span(responses, isSuccess);
        expect(initialSuccesses.toArray()).to.deep.equal([{ status: "success", data: Person.Alice }]);
        expect(remainder.count()).to.eq(5);
        expectTypeOf(initialSuccesses).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
        expectTypeOf(remainder).toEqualTypeOf<IEnumerable<ApiResponse<Person>>>();
    });
});
