import { describe, expect, test } from "vitest";
import { append } from "../../../src/enumerator/functions/append";
import { toList } from "../../../src/enumerator/functions/toList";
import "../../../src/list/List";

describe("#append()", () => {
    test("should append an element to the end", () => {
        const list2 = toList(append([1, 2, 3, 4, 5], 6));
        expect(list2.get(5)).to.eq(6);
    });
});
