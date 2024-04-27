import { ImmutableList } from "../../src/list/ImmutableList";
import { Comparators } from "../../src/shared/Comparators";

describe("ImmutableList", () => {
    describe("#add()", () => {
        test("should return a new list with the element added", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.add(4);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(4);
            expect(newList.get(3)).to.eq(4);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
    });
    describe("#addAll()", () => {
        test("should return a new list with the elements added", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.addAll([4, 5, 6]);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(6);
            expect(newList.get(3)).to.eq(4);
            expect(newList.get(4)).to.eq(5);
            expect(newList.get(5)).to.eq(6);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
    });
    describe("#any()", () => {
        test("should return true if the list contains the element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.any(e => e === 2)).to.be.true;
        });
        test("should return false if the list does not contain the element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.any(e => e === 4)).to.be.false;
        });
    });
    describe("#clear()", () => {
        test("should return a new empty list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.clear();
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(0);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
    });
    describe("#contains()", () => {
        test("should return true if the list contains the element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.contains(2)).to.be.true;
        });
        test("should return false if the list does not contain the element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.contains(4)).to.be.false;
        });
    });
    describe("#containsAll()", () => {
        test("should return true if the list contains all the elements", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.containsAll([2, 3])).to.be.true;
        });
        test("should return false if the list does not contain all the elements", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.containsAll([2, 4])).to.be.false;
        });
    });
    describe("#count()", () => {
        test("should return the number of elements in the list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.count()).to.eq(3);
        });
        test("should return the number of elements in the list that match the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.count(e => e > 1)).to.eq(2);
        });
    });
    describe("#elementAt()", () => {
        test("should return the element at the given index", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.elementAt(1)).to.eq(2);
        });
        test("should throw an error if the index is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.elementAt(3)).to.throw(Error);
        });
    });
    describe("#elementAtOrDefault()", () => {
        test("should return the element at the given index", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.elementAtOrDefault(1)).to.eq(2);
        });
        test("should return null if the index is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.elementAtOrDefault(3)).to.be.null;
        });
    });
    describe("#entries()", () => {
        test("should return an iterable of the entries", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect([...list.entries()]).to.deep.eq([[0, 1], [1, 2], [2, 3]]);
        });
    });
    describe("#first()", () => {
        test("should return the first element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.first()).to.eq(1);
        });
        test("should return the first element matching the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.first(e => e > 1)).to.eq(2);
        });
        test("should throw an error if the list is empty", () => {
            const list = ImmutableList.create();
            expect(() => list.first()).to.throw(Error);
        });
        test("should throw an error if no element matches the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.first(e => e > 3)).to.throw(Error);
        });
    });
    describe("#firstOrDefault()", () => {
        test("should return the first element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.firstOrDefault()).to.eq(1);
        });
        test("should return the first element matching the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.firstOrDefault(e => e > 1)).to.eq(2);
        });
        test("should return null if the list is empty", () => {
            const list = ImmutableList.create();
            expect(list.firstOrDefault()).to.be.null;
        });
        test("should return null if no element matches the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.firstOrDefault(e => e > 3)).to.be.null;
        });
    });
    describe("#get()", () => {
        test("should return the element at the given index", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.get(1)).to.eq(2);
        });
        test("should throw an error if the index is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.get(3)).to.throw(Error);
        });
    });
    describe("#getRange()", () => {
        test("should return a new list with the elements in the range", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.getRange(1, 2);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(2);
            expect(newList.get(0)).to.eq(2);
            expect(newList.get(1)).to.eq(3);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
        test("should throw an error if the index is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.getRange(3, 1)).to.throw(Error);
        });
        test("should throw an error if the count is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.getRange(1, 3)).to.throw(Error);
        });
    });
    describe("#indexOf()", () => {
        test("should return the index of the element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.indexOf(2)).to.eq(1);
        });
        test("should return -1 if the element is not in the list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.indexOf(4)).to.eq(-1);
        });
    });
    describe("#isEmpty()", () => {
        test("should return true if the list is empty", () => {
            const list = ImmutableList.create();
            expect(list.isEmpty()).to.be.true;
        });
        test("should return false if the list is not empty", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.isEmpty()).to.be.false;
        });
    });
    describe("#last()", () => {
        test("should return the last element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.last()).to.eq(3);
        });
        test("should return the last element matching the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.last(e => e < 3)).to.eq(2);
        });
        test("should throw an error if the list is empty", () => {
            const list = ImmutableList.create();
            expect(() => list.last()).to.throw(Error);
        });
        test("should throw an error if no element matches the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.last(e => e < 1)).to.throw(Error);
        });
    });
    describe("#lastIndexOf()", () => {
        test("should return the last index of the element", () => {
            const list = ImmutableList.create([1, 2, 3, 2]);
            expect(list.lastIndexOf(2)).to.eq(3);
        });
        test("should return -1 if the element is not in the list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.lastIndexOf(4)).to.eq(-1);
        });
    });
    describe("#lastOrDefault()", () => {
        test("should return the last element", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.lastOrDefault()).to.eq(3);
        });
        test("should return the last element matching the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.lastOrDefault(e => e < 3)).to.eq(2);
        });
        test("should return null if the list is empty", () => {
            const list = ImmutableList.create();
            expect(list.lastOrDefault()).to.be.null;
        });
        test("should return null if no element matches the predicate", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.lastOrDefault(e => e < 1)).to.be.null;
        });
    });
    describe("#remove()", () => {
        test("should return a new list with the element removed", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.remove(2);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(2);
            expect(newList.get(0)).to.eq(1);
            expect(newList.get(1)).to.eq(3);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
    });
    describe("#removeAll()", () => {
        test("should return a new list with the elements removed", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.removeAll([2, 3]);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(1);
            expect(newList.get(0)).to.eq(1);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
    });
    describe("#removeAt()", () => {
        test("should return a new list with the element removed", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.removeAt(1);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(2);
            expect(newList.get(0)).to.eq(1);
            expect(newList.get(1)).to.eq(3);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
        test("should throw an error if the index is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.removeAt(3)).to.throw(Error);
        });
    });
    describe("#removeIf()", () => {
        test("should return a new list with the elements removed", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.removeIf(e => e > 1);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(1);
            expect(newList.get(0)).to.eq(1);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
    });
    describe("#set()", () => {
        test("should return a new list with the element set", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.set(1, 4);
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(3);
            expect(newList.get(0)).to.eq(1);
            expect(newList.get(1)).to.eq(4);
            expect(newList.get(2)).to.eq(3);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([1, 2, 3]);
        });
        test("should throw an error if the index is out of bounds", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(() => list.set(3, 4)).to.throw(Error);
        });
    });
    describe("#size()", () => {
        test("should return the number of elements in the list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.size()).to.eq(3);
        });
    });
    describe("#sort()", () => {
        test("should return a new list with the elements sorted", () => {
            const list = ImmutableList.create([3, 1, 2]);
            const newList = list.sort();
            expect(newList).not.to.eq(list);
            expect(newList.size()).to.eq(3);
            expect(newList.get(0)).to.eq(1);
            expect(newList.get(1)).to.eq(2);
            expect(newList.get(2)).to.eq(3);
            expect(list.size()).to.eq(3);
            expect(list.toArray()).to.deep.eq([3, 1, 2]);
        });
    });
    describe("#toString()", () => {
        test("should return a string representation of the list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.toString()).to.eq("1, 2, 3");
        });
        test("should empty string if the list is empty", () => {
            const list = ImmutableList.create();
            expect(list.toString()).to.eq("");
        });
        test("should return a string representation of the list with the given separator", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.toString("; ")).to.eq("1; 2; 3");
        });
        test("should return a string representation of the list with the given separator and selector", () => {
            const list = ImmutableList.create([1, 2, 3]);
            expect(list.toString("; ", e => String(e * 2))).to.eq("2; 4; 6");
        });
    });
    describe("get comparator()", () => {
        test("should return the comparator used to compare elements", () => {
            const comparator = Comparators.equalityComparator;
            const list = ImmutableList.create([1, 2, 3], comparator);
            expect(list.comparator).to.eq(comparator);
        });
    });
    describe("get length()", () => {
        test("should return the number of elements in the list", () => {
            const list = ImmutableList.create([1, 2, 3]);
            const newList = list.add(4);
            expect(list.length).to.eq(3);
            expect(newList.length).to.eq(4);
        });
    });
});