import { describe, expect, expectTypeOf, test } from "vitest";
import { single } from "../../../src/enumerator/functions/single";
import { List } from "../../../src/list/List";
import { MoreThanOneElementException } from "../../../src/shared/MoreThanOneElementException";
import { MoreThanOneMatchingElementException } from "../../../src/shared/MoreThanOneMatchingElementException";
import { NoElementsException } from "../../../src/shared/NoElementsException";
import { NoMatchingElementException } from "../../../src/shared/NoMatchingElementException";
import { ApiResponse, ApiResponseLoading, isLoading } from "../../models/ApiResponse";
import { Person } from "../../models/Person";

const responses = new List<ApiResponse<Person>>([
    { status: "success", data: Person.Alice },
    { status: "error", error: "Not found" },
    { status: "success", data: Person.Bella },
    { status: "error", error: "Server error" },
    { status: "success", data: Person.Mel },
    { status: "loading", estimatedTime: 4000 }
]);

describe("#single()", () => {
    test("should throw error if the sequence is empty", () => {
        expect(() => single([])).toThrow(new NoElementsException());
    });
    test("should throw error if list has more than one element", () => {
        expect(() => single([1, 2])).toThrowError(new MoreThanOneElementException());
    });
    test("should return the single element", () => {
        expect(single([1])).to.eq(1);
    });
    test("should throw error if no element matches the predicate", () => {
        expect(() => single([1, 2, 3, 4, 5], n => n === 6)).toThrowError(new NoMatchingElementException());
    });
    test("should throw error if more than one element matches the predicate", () => {
        expect(() => single([1, 2, 3, 4, 5, 4], n => n === 4)).toThrowError(new MoreThanOneMatchingElementException());
    });
    test("should return the person with name 'Alice'", () => {
        const result = single([Person.Alice, Person.Mel, Person.Lenka, Person.Noemi], p => p.name === "Alice");
        expect(result).to.eq(Person.Alice);
    });
    test("should narrow items with type guard", () => {
        const loading = single(responses, isLoading);
        expect(loading.estimatedTime).to.eq(4000);
        expectTypeOf(loading).toEqualTypeOf<ApiResponseLoading>();
    });
});
