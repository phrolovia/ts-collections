import { expect } from "chai";
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
    const person5: Person    = new Person("Jane", "Green", 33);
    const ageComparator      = (p1: Person, p2: Person) => p1.Age - p2.Age;
    const nameComparator     = (p1: Person, p2: Person) => p1.Name.localeCompare(p2.Name);
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const tree = new BinaryTree<Person>();
            expect(tree.isEmpty()).to.eq(true);
        });
    });
    describe("#insert()", () => {
        it("should insert person to tree", () => {
            const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
            expect(tree.countNodes()).to.eq(5);
        });
    });
    describe("#search()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
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
    describe("#traverseAndMap(): INORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 529 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "INORDER");
            expect(result[2]).to.eq(529);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "INORDER");
            expect(result[0]).to.eq(81);
            expect(result[1]).to.eq(100);
            expect(result[2]).to.eq(529);
            expect(result[3]).to.eq(1089);
        });
    });
    describe("#traverseAndMap(): PREORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 529 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "PREORDER");
            expect(result[2]).to.eq(100);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "PREORDER");
            expect(result[0]).to.eq(529);
            expect(result[1]).to.eq(81);
            expect(result[2]).to.eq(100);
            expect(result[3]).to.eq(1089);
        });
    });
    describe("#traverseAndMap(): POSTORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 529 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "POSTORDER");
            expect(result[2]).to.eq(1089);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "POSTORDER");
            expect(result[0]).to.eq(100);
            expect(result[1]).to.eq(81);
            expect(result[2]).to.eq(1089);
            expect(result[3]).to.eq(529);
        });
    });
    describe("#toArray(): INORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return an array with a size of 4", () => {
            let people: Person[] = [];
            people = tree.toArray(people);
            expect(people.length).to.eq(4);
        });
        it("should have person with age '9' (Mel) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray(people);
            expect(people[0].Age).to.eq(9);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray(people);
            expect(people[0].Age).to.eq(9);
            expect(people[1].Age).to.eq(10);
            expect(people[2].Age).to.eq(23);
            expect(people[3].Age).to.eq(33);
        });
    });
    describe("#toArray(): PREORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return an array with a size of 4", () => {
            let people: Person[] = [];
            people = tree.toArray(people, "PREORDER");
            expect(people.length).to.eq(4);
        });
        it("should have person with age '23' (Alice) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray(people, "PREORDER");
            expect(people[0].Age).to.eq(23);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray(people, "PREORDER");
            expect(people[0].Age).to.eq(23);
            expect(people[1].Age).to.eq(9);
            expect(people[2].Age).to.eq(10);
            expect(people[3].Age).to.eq(33);
        });
    });
    describe("#toArray(): POSTORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return an array with a size of 4", () => {
            let people: Person[] = [];
            people = tree.toArray(people, "POSTORDER");
            expect(people.length).to.eq(4);
        });
        it("should have person with age '10' (Senna) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray(people, "POSTORDER");
            expect(people[0].Age).to.eq(10);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray(people, "POSTORDER");
            expect(people[0].Age).to.eq(10);
            expect(people[1].Age).to.eq(9);
            expect(people[2].Age).to.eq(33);
            expect(people[3].Age).to.eq(23);
        });
    });
});