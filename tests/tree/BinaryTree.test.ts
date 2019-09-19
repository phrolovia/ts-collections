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
    describe("#contains()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should return true", () => {
            expect(tree.contains(person3)).to.eq(true);
        });
        it("should return false", () => {
            expect(tree.contains(person4)).to.eq(false);
        });
    });
    describe("#countNodes()", () => {
        it("should return 0", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            expect(tree.countNodes()).to.eq(0);
        });
        it("should return 3", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            expect(tree.countNodes()).to.eq(3);
        });
    });
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            expect(tree.isEmpty()).to.eq(true);
        });
        it("should return false", () => {
            const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            expect(tree.isEmpty()).to.eq(false);
        });
    });
    describe("#delete()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should delete person from tree", () => {
            tree.delete(person);
            expect(tree.countNodes()).to.eq(4);
        });
        it("should not have 'Alice' at root", () => {
            expect(tree.toArray()[0].Name).to.not.eq("Alice");
        });
    });
    describe("#find()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should return person with name 'Lenka'", () => {
            const lenka = tree.find(p => p.Name === 'Lenka');
            expect(lenka.Name).to.eq('Lenka');
        });
        it("should not return a person with name 'Mirei'", () => {
            const mirei = tree.find(p => p.Name === 'Mirei');
            expect(mirei).to.eq(null);
        });
        it("should return person with age 9", () => {
            const mel = tree.find(p => p.Age === 9);
            expect(mel.Age).to.eq(9);
            expect(mel.Name).to.eq('Mel');
        });
    });
    describe("#insert()", () => {
        const tree = new BinaryTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should insert person to tree", () => {
            expect(tree.countNodes()).to.eq(5);
        });
        it("should have 'Alice' at root", () => {
            expect(tree.toArray()[0].Name).to.eq("Alice");
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
    describe("#forEach()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        const people = [person2, person3, person, person5];
        let index    = 0;
        it("should act on tree items inorderly", () => {
            tree.forEach(p => {
                expect(p.Name).to.eq(people[index++].Name);
            });
        });
    });
    describe("#traverseAndMapToArray(): INORDER", () => {
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
    describe("#traverseAndMapToArray(): PREORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 100 at index: 2", () => {
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
    describe("#traverseAndMapToArray(): POSTORDER", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 1089 at index: 2", () => {
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
    describe("#traverseAndMorph()", () => {
        const tree = new BinaryTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        const resultTree = tree.traverseAndMorph<number>(p => p.Age, (i1: number, i2: number) => i1-i2);
        it("should return a number tree with '23' at root", () => {
            const rootNumber = resultTree.getRootData();
            expect(rootNumber).to.eq(23);
        });
        it("should have pre-morph and post-morph items in the same order: INORDER", () => {
            const personArray = tree.toArray();
            const numberArray = resultTree.toArray();
            const ageArray = personArray.map(p => p.Age);
            expect(numberArray[0]).to.eq(ageArray[0]);
            expect(numberArray[1]).to.eq(ageArray[1]);
            expect(numberArray[2]).to.eq(ageArray[2]);
            expect(numberArray[3]).to.eq(ageArray[3]);
        });
        it("should have pre-morph and post-morph items in the same order: PREORDER", () => {
            const personArray = tree.toArray("PREORDER");
            const numberArray = resultTree.toArray("PREORDER");
            const ageArray = personArray.map(p => p.Age);
            expect(numberArray[0]).to.eq(ageArray[0]);
            expect(numberArray[1]).to.eq(ageArray[1]);
            expect(numberArray[2]).to.eq(ageArray[2]);
            expect(numberArray[3]).to.eq(ageArray[3]);
        });
        it("should have pre-morph and post-morph items in the same order: POSTORDER", () => {
            const personArray = tree.toArray("POSTORDER");
            const numberArray = resultTree.toArray("POSTORDER");
            const ageArray = personArray.map(p => p.Age);
            expect(numberArray[0]).to.eq(ageArray[0]);
            expect(numberArray[1]).to.eq(ageArray[1]);
            expect(numberArray[2]).to.eq(ageArray[2]);
            expect(numberArray[3]).to.eq(ageArray[3]);
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
            people = tree.toArray();
            expect(people.length).to.eq(4);
        });
        it("should have person with age '9' (Mel) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray();
            expect(people[0].Age).to.eq(9);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray();
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
            people = tree.toArray("PREORDER");
            expect(people.length).to.eq(4);
        });
        it("should have person with age '23' (Alice) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray("PREORDER");
            expect(people[0].Age).to.eq(23);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray("PREORDER");
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
            people = tree.toArray("POSTORDER");
            expect(people.length).to.eq(4);
        });
        it("should have person with age '10' (Senna) at index: 0", () => {
            let people: Person[] = [];
            people = tree.toArray("POSTORDER");
            expect(people[0].Age).to.eq(10);
        });
        it("should have people at correct indices", () => {
            let people: Person[] = [];
            people = tree.toArray("POSTORDER");
            expect(people[0].Age).to.eq(10);
            expect(people[1].Age).to.eq(9);
            expect(people[2].Age).to.eq(33);
            expect(people[3].Age).to.eq(23);
        });
    });
});