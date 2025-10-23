import { describe, expect, test } from "vitest";
import { toCircularLinkedList } from "../../../src/enumerator/functions/toCircularLinkedList";
import { CircularLinkedList } from "../../../src/list/CircularLinkedList";
import { Person } from "../../models/Person";

describe("#toCircularLinkedList", () => {
    test("should return a circular linked list", () => {
        const circularList = toCircularLinkedList([1, 2, 3, 4, 5]);
        expect(circularList instanceof CircularLinkedList).to.be.true;
        expect(circularList.size()).to.eq(5);
        expect(circularList.length).to.eq(5);
    });

    test("should preserve the elements and their order", () => {
        const circularList = toCircularLinkedList([1, 2, 3, 4, 5]);
        expect(circularList.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });

    test("should work with an empty array", () => {
        const emptyCircularList = toCircularLinkedList([]);
        expect(emptyCircularList.isEmpty()).to.be.true;
        expect(emptyCircularList.size()).to.eq(0);
    });

    test("should accept a custom comparator", () => {
        const personArray = [Person.Alice, Person.Noemi];
        const customComparator = (p1: Person, p2: Person) => p1.name === p2.name;
        const circularPersonList = toCircularLinkedList(personArray, customComparator);

        // Create a new person with the same name but different age
        const aliceClone = new Person("Alice", "Smith", 30);

        // With custom comparator, it should find Alice by name
        expect(circularPersonList.contains(aliceClone)).to.be.true;
    });
});
