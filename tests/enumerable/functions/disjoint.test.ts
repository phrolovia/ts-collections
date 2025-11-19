import { describe, expect, test } from "vitest";
import { EqualityComparator } from "../../../src";
import { disjoint } from "../../../src/enumerator/functions/disjoint";
import { Person } from "../../models/Person";

describe("#disjoint()", () => {
    test("should return true if two lists have no elements in common", () => {
        const list1 = [1, 2, 3];
        const list2 = [4, 5, 6];
        expect(disjoint(list1, list2)).to.be.true;
    });
    test("should return false if two lists have elements in common", () => {
        const list1 = [1, 2, 3];
        const list2 = [3, 4, 5, 6];
        expect(disjoint(list1, list2)).to.be.false;
    });
    test("should return true if one list is empty", () => {
        const list1 = [] as number[];
        const list2 = [3, 4, 5, 6];
        expect(disjoint(list1, list2)).to.be.true;
        expect(disjoint(list1, list1)).to.be.true;
    });
    test("should return true if both lists are empty", () => {
        const list1 = [] as number[];
        const list2 = [] as number[];
        expect(disjoint(list1, list2)).to.be.true;
    });
    test("should use provided comparator", () => {
        const list1 = [Person.Alice, Person.Mel, Person.Senna];
        const list2 = [Person.Hanna, Person.Hanna2, Person.Noemi];
        const list3 = [Person.Senna, Person.Lucrezia, Person.Vanessa];
        const comparator: EqualityComparator<Person> = (p1, p2) =>
            p1.name === p2.name;
        expect(disjoint(list1, list2, comparator)).to.be.true;
        expect(disjoint(list1, list3, comparator)).to.be.false;
    });
    test("should work with different types", () => {
        const list1 = [1, 2, 3];
        const list2 = ["1", "2", "3"];
        const comparator: EqualityComparator<number | string> = (a, b) =>
            a.toString() === b.toString();
        expect(disjoint(list1, list2)).to.be.true;
        expect(disjoint(list1, list2, comparator)).to.be.false;
    });
});
