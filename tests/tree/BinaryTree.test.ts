import { expect } from "chai";
import { Stack } from "../../src/stack/Stack";
import { BinaryTree } from "../../src/tree/BinaryTree";

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

describe("BinaryTree", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const tree = new BinaryTree<Person>();
            expect(tree.isEmpty()).to.eq(true);
        });
    });
    describe("#insert()", () => {
        it("should insert person to tree", () => {
            const tree = new BinaryTree<Person>();
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
            expect(tree.countNodes()).to.eq(5);
        });
    });
    describe("#search()", () => {
        const tree = new BinaryTree<Person>();
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return true", () => {
            expect(tree.search(person3)).to.eq(true);
        });
        it("should return false", () => {
            expect(tree.search(person4)).to.eq(false);
        });
    });
});