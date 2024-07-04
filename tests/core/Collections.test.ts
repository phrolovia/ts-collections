import { Collections } from "../../src/core/Collections";
import { Enumerable, List, RedBlackTree } from "../../src/imports";
import { LinkedList } from "../../src/list/LinkedList";
import { IndexOutOfBoundsException } from "../../src/shared/IndexOutOfBoundsException";
import { Person } from "../models/Person";

describe("Collections", () => {
    describe("#addAll()", () => {
        test("should add the given elements to the collection", () => {
            const list = new LinkedList([1, 2]);
            Collections.addAll(list, 3, 4, 5);
            expect(list.size()).to.eq(5);
            for (let ix = 1; ix <= 5; ++ix) {
                expect(list.get(ix - 1)).to.eq(ix);
            }
        });
        test("should add the given elements to the collection #2", () => {
            const tree = new RedBlackTree([1, 2]);
            Collections.addAll(tree, 3, 4, 5);
            expect(tree.size()).to.eq(5);
            expect(tree.search(1)).to.be.true;
            expect(tree.search(2)).to.be.true;
            expect(tree.search(3)).to.be.true;
            expect(tree.search(4)).to.be.true;
            expect(tree.search(5)).to.be.true;
        });
    });

    describe("#binarySearch()", () => {
        test("should search and find the index of given item", () => {
            const array = [1, 2, 3];
            const list = new List(array);
            expect(Collections.binarySearch(list, 1)).to.eq(0);
            expect(Collections.binarySearch(array, 1)).to.eq(0);
            expect(Collections.binarySearch(list, 2)).to.eq(1);
            expect(Collections.binarySearch(array, 2)).to.eq(1);
            expect(Collections.binarySearch(list, 3)).to.eq(2);
            expect(Collections.binarySearch(array, 3)).to.eq(2);
            expect(Collections.binarySearch(list, 4)).to.eq(-1);
            expect(Collections.binarySearch(array, 4)).to.eq(-1);
        });
        test("should search and find the index of given item #2", () => {
            const list = Enumerable.range(0, 100).toList();
            const array = list.toArray();
            expect(Collections.binarySearch(list, 0)).to.eq(0);
            expect(Collections.binarySearch(array, 0)).to.eq(0);
            expect(Collections.binarySearch(list, 50)).to.eq(50);
            expect(Collections.binarySearch(array, 50)).to.eq(50);
            expect(Collections.binarySearch(list, 99)).to.eq(99);
            expect(Collections.binarySearch(array, 99)).to.eq(99);
            for (let ix = 0; ix < 100; ++ix) {
                expect(Collections.binarySearch(list, ix)).to.eq(ix);
                expect(Collections.binarySearch(array, ix)).to.eq(ix);
            }
        });
        test("should search and find the index of given item #3", () => {
            const array = [0];
            const list = new List(array);
            expect(Collections.binarySearch(list, 0)).to.eq(0);
            expect(Collections.binarySearch(array, 0)).to.eq(0);
            expect(Collections.binarySearch(list, 1)).to.eq(-1);
            expect(Collections.binarySearch(array, 1)).to.eq(-1);
            list.clear();
            array.length = 0;
            expect(Collections.binarySearch(list, 0)).to.eq(-1);
            expect(Collections.binarySearch(array, 0)).to.eq(-1);
        });
        test("should search and find the index of given item #4", () => {
            const source: Person[] = [Person.Alice, Person.Bella, Person.Eliza, Person.Lenka, Person.Mel, Person.Priscilla];
            const list = new LinkedList(source);
            expect(Collections.binarySearch(list, Person.Priscilla, (p1, p2) => p1.name.localeCompare(p2.name))).to.eq(5);
            expect(Collections.binarySearch(source, Person.Priscilla, (p1, p2) => p1.name.localeCompare(p2.name))).to.eq(5);
        });
    });

    describe("#disjoint()", () => {
        test("should return true if two collections are disjoint", () => {
            const list1 = new List([1, 2, 3]);
            const list2 = new List([4, 5, 6]);
            expect(Collections.disjoint(list1, list2)).to.be.true;
            expect(Collections.disjoint(list2, list1)).to.be.true;
            expect(Collections.disjoint(list1, list1)).to.be.false;
            expect(Collections.disjoint(list2, list2)).to.be.false;
        });
        test("should return true if two collections are disjoint #2", () => {
            const list1 = new List([Person.Alice, Person.Lucrezia, Person.Vanessa]);
            const list2 = new List([Person.Bella, Person.Priscilla, Person.Suzuha]);
            expect(Collections.disjoint(list1, list2, (x, y) => x === y)).to.be.true;
            expect(Collections.disjoint(list2, list1, (x, y) => x === y)).to.be.true;
            expect(Collections.disjoint(list1, list1, (x, y) => x === y)).to.be.false;
            expect(Collections.disjoint(list2, list2, (x, y) => x === y)).to.be.false;
        });
        test("should return true if two collections are disjoint #3", () => {
            const list1 = new List([Person.Noemi, Person.Bella]);
            const list2 = new List([Person.Noemi2, Person.Reika]);
            expect(Collections.disjoint(list1, list2, (x, y) => x.name.localeCompare(y.name) === 0)).to.be.false;
            expect(Collections.disjoint(list1, list2, (x, y) => x.age === y.age)).to.be.true;
        });
    });

    describe("#distinct()", () => {
        test("should return an enumerable with distinct elements only", () => {
            const list = new List([1, 2, 3, 3, 3, 4, 5, 5, 5, 5, 6, 6, 6]);
            const distinct = Collections.distinct(list);
            expect(distinct.count()).to.eq(6);
            expect(distinct.toArray()).to.deep.eq([1, 2, 3, 4, 5, 6]);
        });
        test("should return an enumerable with distinct elements only #2", () => {
            const list = new List([Person.Alice, Person.Alice, Person.Bella, Person.Eliza, Person.Noemi, Person.Noemi2, Person.Lenka, Person.Mel, Person.Priscilla]);
            const distinct = Collections.distinct(list, p => p.name, (n1: string, n2: string) => n1.localeCompare(n2) === 0);
            expect(distinct.count()).to.eq(7);
            expect(distinct.toArray()).to.deep.eq([Person.Alice, Person.Bella, Person.Eliza, Person.Noemi, Person.Lenka, Person.Mel, Person.Priscilla]);
        });
    })

    describe("#fill()", () => {
        test("should replace all elements in the list with the given element", () => {
            const list = new List(["a", "b", "c", "d", "e"]);
            Collections.fill(list, "v");
            for (const s of list) {
                expect(s).to.eq("v");
            }
        });
        test("should not affect empty list", () => {
            const list = new LinkedList<Person>();
            Collections.fill(list, Person.Lucrezia);
            expect(list.size()).to.eq(0);
        });
    });
    describe("#frequency()", () => {
        test("should find the frequency of the given element", () => {
            const array = ["A", "B", "F", "F", "R", "F", "T", "G", "N", "F"];
            const list = new List(array);
            const linkedList = new LinkedList(array);
            const listFrequency = Collections.frequency(list, "F");
            const linkedListFrequency = Collections.frequency(linkedList, "F");
            const arrayFrequency = Collections.frequency(array, "F");
            expect([arrayFrequency, linkedListFrequency, listFrequency]).to.deep.equal([4, 4, 4]);
        });
        test("should find the frequency of the given element #2", () => {
            const array = [Person.Alice, Person.Alice, Person.Lucrezia, Person.Priscilla, Person.Jisu, Person.Alice, Person.Lucrezia, Person.Noemi2];
            const list = new List(array);
            const frequencyA = Collections.frequency(list, Person.Alice, (p1, p2) => p1.name === p2.name);
            const frequencyL = Collections.frequency(list, Person.Lucrezia, (p1, p2) => p1.name === p2.name);
            const frequencyN = Collections.frequency(array, Person.Noemi, (p1, p2) => p1.name === p2.name);
            const frequencyP = Collections.frequency(array, Person.Priscilla, (p1, p2) => p1.name === p2.name);
            expect(frequencyA).to.eq(3);
            expect(frequencyL).to.eq(2);
            expect(frequencyN).to.eq(1);
            expect(frequencyP).to.eq(1);
        });
    });

    describe("#max()", () => {
        test("should return the maximum element in the list", () => {
            const list = new List([1, 2, 3, 4, 566, 6, 7, 8, 999, 10]);
            const max = Collections.max(list);
            expect(max).to.eq(999);
        });
        test("should return the maximum element in the list #2", () => {
            const list = new List([Person.Mel, Person.Alice, Person.Bella, Person.Eliza]);
            const oldestPerson = Collections.max(list, p => p.age);
            expect(oldestPerson.age).to.eq(Person.Alice.age);
        });
        test("should throw error if iterable is empty", () => {
            expect(() => Collections.max([])).to.throw();
        });
    });

    describe("#min()", () => {
        test("should return the minimum element in the list", () => {
            const list = new List([1, 2, 3, 4, 5, 6, -99, 8, 9, 10]);
            const min = Collections.min(list);
            expect(min).to.eq(-99);
        });
        test("should return the minimum element in the list #2", () => {
            const list = new List([Person.Alice, Person.Bella, Person.Eliza]);
            const youngestPerson = Collections.min(list, p => p.age);
            expect(youngestPerson.age).to.eq(Person.Eliza.age);
        });
        test("should throw error if iterable is empty", () => {
            expect(() => Collections.min([])).to.throw();
        });
    });

    describe("#replaceAll()", () => {
        test("should replace old elements with new elements", () => {
            const list = new List([1, 2, 3, 3, 1, 5, 6, 7]);
            const array = list.toArray();
            const oldListSize = list.size();
            const oldArraySize = array.length;
            const listResult = Collections.replaceAll(list, 3, 0);
            const arrayResult = Collections.replaceAll(array, 1, -1);
            const listResult2 = Collections.replaceAll(list, 111, 555);
            expect(list.get(2)).to.eq(0);
            expect(list.get(3)).to.eq(0);
            expect(list.size()).to.eq(oldListSize);
            expect(array[0]).to.eq(-1);
            expect(array[4]).to.eq(-1);
            expect(array.length).to.eq(oldArraySize);
            expect(listResult).to.be.true;
            expect(arrayResult).to.be.true;
            expect(listResult2).to.be.false;
        });
    });


    describe("#reverse()", () => {
        test("should reverse the list in place", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            Collections.reverse(list);
            expect(list.toArray()).to.deep.eq([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        });
        test("should reverse the array in place", () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            Collections.reverse(array);
            expect(array).to.deep.eq([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        });
    });

    describe("#rotate()", () => {
        test("should rotate list by distance of 3", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            Collections.rotate(list, 3);
            expect(list.toArray()).to.deep.eq([8, 9, 10, 1, 2, 3, 4, 5, 6, 7]);
        });
        test("should rotate list by distance of -2", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            Collections.rotate(list, -2);
            expect(list.toArray()).to.deep.eq([3, 4, 5, 6, 7, 8, 9, 10, 1, 2]);
        });
        test("should not rotate list if distance is 0", () => {
            const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            Collections.rotate(list, 0);
            expect(list.toArray()).to.deep.eq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
        test("should rotate array by distance of 3", () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            Collections.rotate(array, 3);
            expect(array).to.deep.eq([8, 9, 10, 1, 2, 3, 4, 5, 6, 7]);
        });
        test("should rotate array by distance of -2", () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            Collections.rotate(array, -2);
            expect(array).to.deep.eq([3, 4, 5, 6, 7, 8, 9, 10, 1, 2]);
        });
        test("should not rotate array if distance is 0", () => {
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            Collections.rotate(array, 0);
            expect(array).to.deep.eq([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
        test("should not do anything if list is empty", () => {
            const list = new List<number>();
            Collections.rotate(list, 3);
            expect(list.toArray()).to.deep.eq([]);
        });
        test("should not do anything if array is empty", () => {
            const array: number[] = [];
            Collections.rotate(array, 3);
            expect(array).to.deep.eq([]);
        });
    })

    /**
     * @todo I don't know how to test this method. Find a way to test it.
     */
    describe("#shuffle()", () => {
        test("should shuffle list", () => {
            const list = new List<number>([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (let i = 0; i < 10; i++) {
                Collections.shuffle(list);
            }
        });
        test("should shuffle array", () => {
            const array = [1, 2, 3];
            for (let i = 0; i < 10; i++) {
                Collections.shuffle(array);
            }
        });
    });

    describe("#swap()", () => {
        test("should throw error if indices are out of bounds", () => {
            const list = new List([1, 2]);
            expect(() => Collections.swap(list, 0, 3)).toThrow(new IndexOutOfBoundsException(3));
            expect(() => Collections.swap(list, 0, -1)).toThrow(new IndexOutOfBoundsException(-1));
            expect(() => Collections.swap(list, -1, 1)).toThrow(new IndexOutOfBoundsException(-1));
            expect(() => Collections.swap(list, 4, 1)).toThrow(new IndexOutOfBoundsException(4));
        });
        test("should swap elements at the given indices [List]", () => {
            const list = new List([1, 2, 3, 4, 5]);
            Collections.swap(list, 1, 4);
            expect(list.get(1)).to.eq(5);
            expect(list.get(4)).to.eq(2);
        });
        test("should swap elements at the given indices [Array]", () => {
            const array = [1, 2, 3, 4, 5];
            Collections.swap(array, 1, 4);
            expect(array[1]).to.eq(5);
            expect(array[4]).to.eq(2);
        });
    });
});
