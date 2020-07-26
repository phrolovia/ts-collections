
import { describe, it } from "mocha";
import { expect } from "chai";
import { Person } from "../models/Person";
import { ISet } from "../../src/set/ISet";
import { TreeSet } from "../../src/set/TreeSet";
import {Collections} from "../../src/util/Collections";
import {IDeque} from "../../src/queue/IDeque";
import {List} from "../../src/list/List";
import {ITree} from "../../src/tree/ITree";
import {BinarySearchTree} from "../../src/tree/BinarySearchTree";
import {BinaryTree} from "../../src/tree/BinaryTree";
import {IList} from "../../src/list/IList";

describe("Collections", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    const ageComparator      = (p1: Person, p2: Person) => p1.Age - p2.Age;
    const numberComparator   = (n1: number, n2: number) => n1 - n2;
    describe("#addAll()", () => {
        it("should add items to the collection (set)", () => {
            const set: ISet<number> = new TreeSet<number>();
            Collections.addAll(set, 1, 2, 3, 4, 5);
            expect(set.Count).to.eq(5);
            expect(set.contains(1)).to.eq(true);
            expect(set.contains(2)).to.eq(true);
            expect(set.contains(3)).to.eq(true);
            expect(set.contains(4)).to.eq(true);
            expect(set.contains(5)).to.eq(true);
        });
        it("should add items to the collection (deque)", () => {
            const deque: IDeque<Person> = new List<Person>();
            Collections.addAll(deque, person, person2, person4);
            expect(deque.Count).to.eq(3);
            expect(deque.contains(person)).to.eq(true);
            expect(deque.contains(person2)).to.eq(true);
            expect(deque.contains(person3)).to.eq(false);
            expect(deque.contains(person4)).to.eq(true);
        });
        it("should throw error", () => {
            expect(() => Collections.addAll(null, 1, 2, 3)).to.throw("Collection is null.");
        });
    });
    describe("#disjoint()", () => {
        const bstree: ITree<number> = new BinarySearchTree(numberComparator);
        const btree: ITree<number> = new BinaryTree(numberComparator);
        btree.insert(1);
        btree.insert(2);
        btree.insert(3);
        bstree.insert(11);
        bstree.insert(22);
        bstree.insert(33);
        it("should not have common items", () => {
            const hasCommon = !Collections.disjoint(btree, bstree);
            expect(hasCommon).to.eq(false);
        });
        it("should have common items", () => {
            bstree.insert(1);
            const hasCommon = !Collections.disjoint(bstree, btree);
            expect(hasCommon).to.eq(true);
        });
        it("should throw error", () => {
            expect(() => Collections.disjoint(null, btree)).to.throw("c1 is null.");
            expect(() => Collections.disjoint(bstree, null)).to.throw("c2 is null.");
        });
    });
    describe("#fill()", () => {
        const list: IList<string> = new List();
        list.add("Alice");
        list.add("Rei");
        list.add("Misaki");
        it("should fill the list with given value", () => {
            expect(list.toArray()).to.deep.eq(["Alice", "Rei", "Misaki"]);
            Collections.fill(list, "Megumi");
            expect(list.toArray()).to.deep.eq(["Megumi", "Megumi", "Megumi"])
            expect(list.get(0)).to.eq("Megumi");
            expect(list.get(1)).to.eq("Megumi");
            expect(list.get(2)).to.eq("Megumi");
            expect(list.Count).to.eq(3);
        });
        it("should throw error", () => {
            expect(() => Collections.fill(null, 0)).to.throw("list is null.");
        });
    });
    describe("#reverse()", () => {
        const list: IList<string> = new List();
        list.add("Alice");
        list.add("Rei");
        list.add("Misaki");
        it("should reverse the list", () => {
            expect(list.toArray()).to.deep.eq(["Alice", "Rei", "Misaki"]);
            Collections.reverse(list);
            expect(list.toArray()).to.deep.eq(["Misaki", "Rei", "Alice"])
            expect(list.get(0)).to.eq("Misaki");
            expect(list.get(1)).to.eq("Rei");
            expect(list.get(2)).to.eq("Alice");
            expect(list.Count).to.eq(3);
        });
    });
    // describe("#shuffle()", () => {
    //     const list: IList<string> = new List();
    //     list.add("Alice");
    //     list.add("Rei");
    //     list.add("Misaki");
    //     it("should shuffle the list", () => {
    //         expect(list.toArray()).to.deep.eq(["Alice", "Rei", "Misaki"]);
    //         Collections.shuffle(list);
    //         expect(list.toArray()).to.not.deep.eq(["Alice", "Rei", "Misaki"]);
    //         expect(list.Count).to.eq(3);
    //     });
    // });
});
