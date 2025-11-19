import { describe, expect, expectTypeOf, test } from "vitest";
import { partition } from "../../../src/enumerator/functions/partition";
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

describe("#partition()", () => {
    const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    test("should partition the sequence into two", () => {
        const result = partition(sequence, n => n % 2 === 0);
        expect(result[0].toArray()).to.deep.equal([2, 4, 6, 8]);
        expect(result[1].toArray()).to.deep.equal([1, 3, 5, 7, 9]);
    });
    test("should narrow items with type guard", () => {
        const [successes, rest] = partition(responses, isSuccess);
        expect(successes.select(s => s.data).toArray()).to.deep.equal([
            Person.Alice,
            Person.Bella,
            Person.Mel
        ]);
        expect(rest.count()).to.eq(3);
        expectTypeOf(successes).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
        expectTypeOf(rest).toEqualTypeOf<IEnumerable<Exclude<ApiResponse<Person>, ApiResponseSuccess<Person>>>>();
    });
});
