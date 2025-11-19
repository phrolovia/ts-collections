import { describe, expect, expectTypeOf, test } from "vitest";
import { takeWhile } from "../../../src/enumerator/functions/takeWhile";
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

describe("#takeWhile()", () => {
    test("should return a sequence with elements [1,2,3]", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = takeWhile(list, n => n < 4).toList();
        expect(list2.size()).to.eq(3);
        expect(list2.get(0)).to.eq(1);
        expect(list2.get(1)).to.eq(2);
        expect(list2.get(2)).to.eq(3);
        expect(list2.length).to.eq(3);
    });
    test("should return an empty sequence", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = takeWhile(list, n => n < 1).toList();
        expect(list2.size()).to.eq(0);
        expect(list2.length).to.eq(0);
    });
    test("should return all elements if the take count is greater than the sequence size", () => {
        const list = new List([1, 2, 3, 4, 5]);
        const list2 = takeWhile(list, n => n < 10).toList();
        expect(list2.size()).to.eq(5);
        expect(list2.length).to.eq(5);
    });
    test("should narrow items with type guard", () => {
        const result = takeWhile(responses, isSuccess);
        expect(result.toArray()).to.deep.equal([
            { status: "success", data: Person.Alice }
        ]);
        expectTypeOf(result).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
    });
});
