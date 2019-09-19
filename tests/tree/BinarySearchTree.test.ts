import { expect } from "chai";
import { BinarySearchTree } from "../../src/tree/BinarySearchTree";

class Person {
    Name: string;
    Surname: string;
    Age: number;
    constructor(name: string, surname: string, age: number) {
        this.Name = name;
        this.Surname = surname;
        this.Age = age;
    }
    public toString(): string {
        return `${this.Name} ${this.Surname} (${this.Age})`;
    }
}

describe("BinarySearchTree", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    const comparator: Function = (p1: Person, p2: Person) => p1.Name.localeCompare(p2.Name);
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const tree = new BinarySearchTree<Person>(comparator);
            expect(tree.isEmpty()).to.eq(true);
        });
        it("should not return true", () => {
            const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person);
            expect(tree.isEmpty()).to.eq(false);
        });
    });
    describe("#delete()", () => {
        it("should delete person from the tree", () => {
            const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
            tree.delete(person2);
            expect(tree.countNodes()).to.eq(4);
        });
        it("should delete 'Jane' from the tree", () => {
            const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person5);
            tree.insert(person);
            tree.delete(person5);
            const result = tree.search(person5);
            expect(result.Name).to.not.eq("Jane");
            expect(result.Name).to.eq("Alice");
        });
    });
    describe("#insert()", () => {
        it("should insert person to tree", () => {
            const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
            expect(tree.countNodes()).to.eq(5);
        });
        it("should not insert same person to tree", () => {
            const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person);
            tree.insert(person5);
            tree.insert(person);
            expect(tree.countNodes()).to.eq(2);
        });
    });
    describe("#search()", () => {
        const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return true", () => {
            expect(tree.search(person)).to.eq(person);
        });
        it("should return false", () => {
            expect(tree.search(person4)).to.not.eq(person4);
        });
    });
    describe("#toArray()", () => {
        const tree = new BinarySearchTree<Person>(comparator);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
            tree.insert(person);
        it("should have its name equal to 'Alice'", () => {
            let result: Person[];
            const array = tree.toArray(result);
            expect(array[0].Name).to.eq("Alice");
        });
        it("should return array with people ordered by name (asc)", () => {
            let result: Person[];
            const array = tree.toArray(result);
            expect(array[0].Name).to.eq("Alice");
            expect(array[1].Name).to.eq("Jane");
            expect(array[2].Name).to.eq("Mel");
            expect(array[3].Name).to.eq("Senna");
        });
        it("should return array with people ordered by age (asc)", () => {
            const tree2 = new BinarySearchTree<Person>((v1: Person, v2: Person) => v1.Age - v2.Age);
                tree2.insert(person2);
                tree2.insert(person);
                tree2.insert(person5);
                tree2.insert(person3);
            let result: Person[];
            const array = tree2.toArray(result);
            expect(array[0].Age).to.eq(9);
            expect(array[1].Age).to.eq(10);
            expect(array[2].Age).to.eq(16);
            expect(array[3].Age).to.eq(23);
        });
    });
});