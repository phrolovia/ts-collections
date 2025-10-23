import { describe, expect, expectTypeOf, test } from "vitest";
import { where } from "../../../src/enumerator/functions/where";
import { IEnumerable } from "../../../src/enumerator/IEnumerable";
import { List } from "../../../src/list/List";
import { ApiResponse, ApiResponseSuccess, isSuccess } from "../../models/ApiResponse";
import { Person } from "../../models/Person";

describe("#where()", () => {
    test("should return an IEnumerable with elements [2,5]", () => {
        const list = new List([2, 5, 6, 99]);
        const list2 = where(list, n => n <= 5).toList();
        expect(list2.size()).to.eq(2);
        expect(list2.get(0)).to.eq(2);
        expect(list2.get(1)).to.eq(5);
        expect(list2.length).to.eq(2);
    });

    test("should narrow the filtered sequence when using a type guard", () => {
        const responses = new List<ApiResponse<Person>>([
            { status: "success", data: Person.Alice },
            { status: "error", error: "Not found" },
            { status: "success", data: Person.Bella },
            { status: "error", error: "Server error" },
            { status: "success", data: Person.Mel },
            { status: "loading", estimatedTime: 4000 }
        ]);

        const successesFromMethod = responses.where(isSuccess);
        const namesFromMethod = successesFromMethod.select(result => result.data.name).toArray();

        expect(namesFromMethod).to.deep.equal([
            Person.Alice.name,
            Person.Bella.name,
            Person.Mel.name
        ]);

        expectTypeOf(successesFromMethod).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();

        const successesFromFunction = where(responses, isSuccess);
        const namesFromFunction = successesFromFunction.select(result => result.data.name).toArray();

        expect(namesFromFunction).to.deep.equal([
            Person.Alice.name,
            Person.Bella.name,
            Person.Mel.name
        ]);

        expectTypeOf(successesFromFunction).toEqualTypeOf<IEnumerable<ApiResponseSuccess<Person>>>();
    });
});
