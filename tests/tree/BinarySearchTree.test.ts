import { expect } from "chai";
import { BinarySearchTree } from "../../src/tree/BinarySearchTree";
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

describe("BinarySearchTree", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 33);
    const ageComparator      = (p1: Person, p2: Person) => p1.Age - p2.Age;
    const nameComparator     = (p1: Person, p2: Person) => p1.Name.localeCompare(p2.Name);
    describe("#add()", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
        it("should return true", () => {
            const added = tree.add(person3);
            expect(added).to.eq(true);
        });
        it("should return false", () => {
            const added = tree.add(person);
            expect(added).to.eq(false);
        });
    });
    describe("#clear()", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should clear the tree", () => {
            tree.clear();
            expect(tree.size()).to.eq(0);
        });
        it("should not invalidate the tree", () => {
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
            tree.clear();
            tree.insert(person);
            expect(tree.size()).to.eq(1);
            expect(tree.getRootData()).to.eq(person);
        });
    });
    describe("#contains()", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
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
    describe("#delete()", () => {
        const tree = new BinarySearchTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should delete person from tree", () => {
            tree.delete(person);
            expect(tree.size()).to.eq(4);
        });
        it("should not act if item is not in the tree", () => {
            tree.delete(person);
            expect(tree.size()).to.eq(4);
        });
        it("should not have 'Alice' at root", () => {
            expect(tree.toArray()[0].Name).to.not.eq("Alice");
        });
        it("should add 1000 random number and then delete them randomly", () => {
            const numTree = new BinarySearchTree<number>((n1: number, n2: number) => n1-n2);
            const randArrayGenerator = (length: number) => {
                var arr = []
                while(arr.length < length){
                    var r = Math.floor(Math.random()*10000) + 1;
                    if(arr.indexOf(r) === -1) arr.push(r);
                }
                return arr;
            }
            const randArray = randArrayGenerator(1000);
            randArray.forEach(n => numTree.insert(n));
            expect(numTree.size()).to.eq(1000);
            while (randArray.length != 0) {
                var rand = randArray[~~(Math.random() * randArray.length)];
                randArray.splice(randArray.indexOf(rand), 1);
                numTree.delete(rand);
            }
            expect(numTree.size()).to.eq(0);
        });
        it("should delete root item", () => {
            const numTree = new BinarySearchTree<number>((n1: number, n2: number) => n1 - n2);
            numTree.insert(99);
            numTree.delete(99);
            expect(numTree.size()).to.eq(0);
        });
        // it("should delete items", () => {
        //     const numTree = new BinarySearchTree<number>((n1: number, n2: number) => n1 - n2);
        //     numTree.insert(99);
        //     numTree.insert(3657);
        //     numTree.insert(3658);
        //     numTree.clear();
        //     expect(numTree.size()).to.eq(0);
        // });
    });
    describe("#find()", () => {
        const tree = new BinarySearchTree<Person>(nameComparator);
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
    describe("#forEach()", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
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
    describe("#getNodeCount()", () => {
        it("should return 0", () => {
            const tree = new BinarySearchTree<Person>(ageComparator);
            expect(tree.size()).to.eq(0);
        });
        it("should return 3", () => {
            const tree = new BinarySearchTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            expect(tree.size()).to.eq(3);
        });
    });
    describe("#insert()", () => {
        const tree = new BinarySearchTree<Person>(nameComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person4);
            tree.insert(person5);
        it("should insert person to tree", () => {
            expect(tree.size()).to.eq(5);
        });
        it("should have 'Mel' at root", () => {
            expect(tree.getRootData().Name).to.eq("Mel");
        });
        it("should not add same person twice", () => {
            tree.insert(person);
            expect(tree.size()).to.eq(5);
        });
    });
    describe("#isEmpty()", () => {
        it("should return true", () => {
            const tree = new BinarySearchTree<Person>(ageComparator);
            expect(tree.isEmpty()).to.eq(true);
        });
        it("should return false", () => {
            const tree = new BinarySearchTree<Person>(ageComparator);
            tree.insert(person);
            expect(tree.isEmpty()).to.eq(false);
        });
    });
    describe("#search()", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
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
    describe("#traverseAndMapToArray(): INORDER", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
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
        it("should return the same array with toArray() when direction is 'INORDER'", () =>{
            const traverseResult = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "INORDER");
            const toArrayResult  = tree.toArray().map(p => Math.pow(p.Age, 2));
            expect(traverseResult[0]).to.eq(toArrayResult[0]);
            expect(traverseResult[1]).to.eq(toArrayResult[1]);
            expect(traverseResult[2]).to.eq(toArrayResult[2]);
            expect(traverseResult[3]).to.eq(toArrayResult[3]);
        });
    });
    describe("#traverseAndMapToArray(): PREORDER", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 529 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "PREORDER");
            expect(result[2]).to.eq(529);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "PREORDER");
            expect(result[0]).to.eq(100);
            expect(result[1]).to.eq(81);
            expect(result[2]).to.eq(529);
            expect(result[3]).to.eq(1089);
        });
    });
    describe("#traverseAndMapToArray(): POSTORDER", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
            tree.insert(person);
            tree.insert(person2);
            tree.insert(person3);
            tree.insert(person5);
        it("should have 1089 at index: 2", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "POSTORDER");
            expect(result[2]).to.eq(529);
        });
        it("should have correct mapped values", () => {
            const result = tree.traverseAndMapToArray<number>(p => Math.pow(p.Age, 2), "POSTORDER");
            expect(result[0]).to.eq(81);
            expect(result[1]).to.eq(1089);
            expect(result[2]).to.eq(529);
            expect(result[3]).to.eq(100);
        });
    });
    describe("#toArray()", () => {
        const tree = new BinarySearchTree<Person>(ageComparator);
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
});
