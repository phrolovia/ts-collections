import { describe, expect, test } from "vitest";
import { toLinkedList } from "../../../src/enumerator/functions/toLinkedList";
import { LinkedList } from "../../../src/list/LinkedList";

describe("#toLinkedList()", () => {
    test("should return a linked list", () => {
        const linkedList = toLinkedList([1, 2, 3, 4, 5]);
        expect(linkedList instanceof LinkedList).to.be.true;
        expect(linkedList.size()).to.eq(5);
        expect(linkedList.length).to.eq(5);
    });
});
