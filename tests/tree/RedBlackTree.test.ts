import {describe} from "mocha";
import {expect} from "chai";
import {Person} from "../models/Person";
import {RedBlackTree} from "../../src/tree/RedBlackTree";
import {ICollection} from "../../src/core/ICollection";
import {Enumerable, LinkedList} from "../../imports";
import {Pair} from "../models/Pair";

describe("RedBlackTree", () => {
    const personAgeComparator = (p1: Person, p2: Person) => p1.age - p2.age;
    const personNameComparator = (p1: Person, p2: Person) => p1.name.localeCompare(p2.name);
    const personSurnameComparator = (p1: Person, p2: Person) => p1.surname.localeCompare(p2.surname);
    const personComparator = (p1: Person, p2: Person) => {
        let result = personNameComparator(p1, p2);
        if (result !== 0) return result;
        result = personSurnameComparator(p1, p2);
        if (result !== 0) return result;
        result = personAgeComparator(p1, p2);
        if (result !== 0) return result;
        return 0;
    };
    const shuffle = <TElement>(data: Array<TElement> | ICollection<TElement>) => {
        const array = Array.isArray(data) ? data : data.toArray();
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    const randomArrayGenerator = (length: number) => {
        return [...Array(length)].map(e => ~~(Math.random() * length));
    };
    const randomUniqueArrayGenerator = (length: number) => {
        const arr = [];
        while (arr.length < length) {
            const r = Math.floor(Math.random() * 10000) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
        return arr;
    }

    describe("#add()", () => {
        it("should add elements to the tree", () => {
            const tree = new RedBlackTree<number>();
            tree.add(1);
            tree.add(2);
            tree.add(3);
            expect(tree.size()).to.eq(3);
            expect(tree.contains(1)).to.be.true;
            expect(tree.contains(2)).to.be.true;
            expect(tree.contains(3)).to.be.true;
        });
        it("should use provided comparator", () => {
            const tree = new RedBlackTree<Person>(personComparator);
            const noemiTest = new Person("Noemi", "Waterfox", 29);
            tree.add(Person.Alice);
            tree.add(Person.Noemi);
            tree.add(Person.Noemi2);
            tree.add(Person.Noemi2);
            const added = tree.add(noemiTest);
            expect(tree.size()).to.eq(3);
            expect(tree.contains(noemiTest)).to.be.true; // since it is equal to Person.Noemi via personComparator
            expect(added).to.be.false;
        });
        it("should not have duplicates", () => {
            const randomArray = randomArrayGenerator(10000);
            const distinct = Enumerable.from(randomArray).distinct().toArray();
            const tree = new RedBlackTree<number>(null, randomArray);
            expect(distinct.length).to.eq(tree.size());
        });
        it("should not have duplicates #2", () => {
            const repeatedEnumerable = Enumerable.repeat(100, 100);
            const tree = new RedBlackTree<number>(null, repeatedEnumerable);
            expect(tree.size()).to.eq(1);
        });
    });

    describe("#clear()", () => {
        const tree = RedBlackTree.from(["a", "b", "c", "z"]);
        it("should remove all data from the tree", () => {
            tree.clear();
            expect(tree.size()).to.eq(0);
            tree.insert("z");
            expect(tree.size()).to.eq(1);
        });
    });

    describe("#delete()", () => {
        it("should delete the element from the tree", () => {
            const tree = new RedBlackTree<number>();
            tree.add(1);
            tree.add(2);
            tree.add(3);
            tree.delete(2);
            tree.delete(1010); // this will do nothing
            expect(tree.size()).to.eq(2);
            expect(tree.contains(2)).to.be.false;
        });
        it("should use provided comparator", () => {
            const tree = new RedBlackTree<Person>(personComparator);
            tree.add(Person.Alice);
            tree.add(Person.Noemi);
            tree.add(Person.Noemi2);
            tree.delete(Person.Noemi);
            expect(tree.size()).to.eq(2);
            expect(tree.contains(Person.Noemi2)).to.be.true; // since it is equal to Person.Noemi via personComparator
        });
        it("should add 1000 random number and then delete them randomly", () => {
            const numTree = new RedBlackTree<number>();
            const randArray = randomUniqueArrayGenerator(1000);
            randArray.forEach(n => numTree.insert(n));
            expect(numTree.size()).to.eq(1000);
            while (randArray.length !== 0) {
                const rand = randArray[~~(Math.random() * randArray.length)];
                randArray.splice(randArray.indexOf(rand), 1);
                numTree.delete(rand);
            }
            expect(numTree.size()).to.eq(0);
        });
    });

    describe("#find()", () => {
        const tree = new RedBlackTree<Person>(personComparator);
        tree.add(Person.Alice);
        tree.add(Person.Noemi);
        tree.add(Person.Noemi2);
        it("should find the first item in the tree", () => {
            const item = tree.find(p => p.name === Person.Noemi2.name && p.age === Person.Noemi2.age);
            const item2 = tree.firstOrDefault(p => p.name === Person.Noemi2.name && p.age === Person.Noemi2.age);
            expect(item).to.eq(Person.Noemi2);
            expect(item.equals(item2)).to.be.true;
        });

        it("should find the first item in the tree #2", () => {
            const tree = new RedBlackTree<Pair<number, number>>((p1, p2) => p1.key - p2.key);
            tree.add(new Pair<number, number>(1, 2));
            tree.add(new Pair<number, number>(2, 3));
            tree.add(new Pair<number, number>(3, 4));
            const pair1 = tree.find(p => p.key === 1);
            expect([pair1.key, pair1.value]).to.deep.equal([1, 2]);
        });
        it("should return null if item does not exist in the tree", () => {
            const item = tree.find(p => p.name === "Suzuha");
            expect(item).to.be.null;
        });
        it("should return null if tree is empty", () => {
            tree.clear();
            expect(tree.find(p => p.name.startsWith("L"))).to.be.null;
        });
    });

    describe("#forEach()", () => {
        it("should loop over the tree in-orderly", () => {
            const tree = RedBlackTree.from(shuffle([1, 2, 3, 4, 5]));
            const orderedElements: number[] = [];
            const indices: number[] = [];
            tree.forEach((num, nx) => {
                orderedElements.push(num * 2);
                indices.push(nx);
            });
            expect(orderedElements).to.deep.equal([2, 4, 6, 8, 10]);
            expect(indices).to.deep.equal([0, 1, 2, 3, 4]);
        });
        it("should immediately end if tree is empty", () => {
            const tree = new RedBlackTree<string>();
            const result: string[] = [];
            let index = -1;
            tree.forEach((str, ix) => {
                result.push(str);
                index = ix;
            });
            expect(result).to.be.empty;
            expect(index).to.eq(-1);
        });
    });

    describe("#getRootData()", () => {
        it("should return null if the tree is empty", () => {
            const tree = new RedBlackTree<number>();
            expect(tree.getRootData()).to.be.null;
        });
        it("should return the root data", () => {
            const tree = RedBlackTree.from([1, 2, 3]);
            expect(tree.getRootData()).to.eq(2);
        });
    });

    describe("#insert()", () => {
        it("should add elements to the tree", () => {
            const tree = new RedBlackTree<number>();
            tree.insert(1);
            tree.insert(2);
            tree.insert(3);
            expect(tree.size()).to.eq(3);
            expect(tree.contains(1)).to.be.true;
            expect(tree.contains(2)).to.be.true;
            expect(tree.contains(3)).to.be.true;
        });
        it("should use provided comparator", () => {
            const tree = new RedBlackTree<Person>(personComparator);
            const noemiTest = new Person("Noemi", "Waterfox", 29);
            tree.insert(Person.Alice);
            tree.insert(Person.Noemi);
            tree.insert(Person.Noemi2);
            tree.insert(Person.Noemi2);
            tree.insert(noemiTest);
            expect(tree.size()).to.eq(3);
            expect(tree.contains(noemiTest)).to.be.true; // since it is equal to Person.Noemi via personComparator
        });
    });

    describe("#isEmpty", () => {
        it("should return true if tree is empty (and false if not)", () => {
            const tree = new RedBlackTree<number>();
            expect(tree.isEmpty()).to.be.true;
            tree.insert(1);
            expect(tree.isEmpty()).to.be.false;
        });
    });

    describe("#remove()", () => {
        it("should remove the element from the tree", () => {
            const tree = new RedBlackTree<number>();
            tree.add(1);
            tree.add(2);
            tree.add(3);
            tree.remove(2);
            tree.remove(1010); // this will do nothing
            expect(tree.size()).to.eq(2);
            expect(tree.contains(2)).to.be.false;
        });
        it("should use provided comparator", () => {
            const tree = new RedBlackTree<Person>(personComparator);
            tree.add(Person.Alice);
            tree.add(Person.Noemi);
            tree.add(Person.Noemi2);
            tree.remove(Person.Noemi);
            expect(tree.size()).to.eq(2);
            expect(tree.contains(Person.Noemi2)).to.be.true; // since it is equal to Person.Noemi via personComparator
        });
        it("should add 1000 random number and then delete them randomly", () => {
            const numTree = new RedBlackTree<number>();
            const randArray = randomUniqueArrayGenerator(1000);
            randArray.forEach(n => numTree.insert(n));
            expect(numTree.size()).to.eq(1000);
            while (randArray.length !== 0) {
                const rand = randArray[~~(Math.random() * randArray.length)];
                randArray.splice(randArray.indexOf(rand), 1);
                numTree.remove(rand);
            }
            expect(numTree.size()).to.eq(0);
        });
        it("should return false if element is not in the tree", () => {
            const tree = RedBlackTree.from([1, 2, 3, 4]);
            expect(tree.remove(5)).to.be.false;
        })
    });

    describe("#removeAll()", () => {
        it("should remove all elements of the collection from the tree", () => {
            const tree = RedBlackTree.from([Person.Alice, Person.Eliza, Person.Bella, Person.Lucrezia, Person.Vanessa], personComparator);
            const list = LinkedList.from([Person.Alice, Person.Eliza, Person.Vanessa]);
            tree.removeAll(list);
            expect(tree.size()).to.eq(2);
            expect(tree.contains(Person.Alice)).to.be.false;
            expect(tree.contains(Person.Eliza)).to.be.false;
            expect(tree.contains(Person.Vanessa)).to.be.false;
            expect(tree.contains(Person.Bella)).to.be.true;
            expect(tree.contains(Person.Lucrezia)).to.be.true;
        });
    });

    describe("#removeIf()", () => {
        it("should remove all items that satisfies the predicate from the tree", () => {
            const tree = RedBlackTree.from([Person.Alice, Person.Eliza, Person.Bella, Person.Lucrezia, Person.Vanessa], personComparator);
            tree.removeIf(p => p.name.length === 5);
            expect(tree.size()).to.eq(2);
            expect(tree.contains(Person.Alice)).to.be.false;
            expect(tree.contains(Person.Eliza)).to.be.false;
            expect(tree.contains(Person.Bella)).to.be.false;
            expect(tree.contains(Person.Vanessa)).to.be.true;
            expect(tree.contains(Person.Lucrezia)).to.be.true;
        });
    });

    describe("#retainAll()", () => {
        it("should remove all elements of the collection from the tree", () => {
            const tree = RedBlackTree.from([Person.Alice, Person.Eliza, Person.Bella, Person.Lucrezia, Person.Vanessa], personComparator);
            const list = LinkedList.from([Person.Alice, Person.Eliza, Person.Vanessa]);
            tree.retainAll(list);
            expect(tree.size()).to.eq(3);
            expect(tree.contains(Person.Alice)).to.be.true;
            expect(tree.contains(Person.Eliza)).to.be.true;
            expect(tree.contains(Person.Vanessa)).to.be.true;
            expect(tree.contains(Person.Bella)).to.be.false;
            expect(tree.contains(Person.Lucrezia)).to.be.false;
        });
    });

    describe("#search()", () => {
        it("should return true if element exists in the tree (and false if not)", () => {
            const tree = RedBlackTree.from([1, 2, 3, 4, 5]);
            expect(tree.search(1)).to.be.true;
            expect(tree.search(3)).to.be.true;
            expect(tree.search(5)).to.be.true;
            tree.remove(5);
            expect(tree.search(5)).to.be.false;
        });
    });

    describe("#toArray()", () => {
        it("should return empty array if tree is empty", () => {
            const tree = new RedBlackTree<number>();
            expect(tree.toArray()).to.be.empty;
        });
        it("should return in-order array", () => {
            const tree = RedBlackTree.from([1, 2, 3, 4, 5]);
            const array = tree.toArray();
            expect(array).to.have.all.members([1, 2, 3, 4, 5]);
            expect(array).to.deep.equal([1, 2, 3, 4, 5]);
        });
        it("should return in-order array #2", () => {
            const array = randomUniqueArrayGenerator(1000);
            const sortedArray = Enumerable.from(array).orderBy(n => n).toArray();
            const tree = RedBlackTree.from(array);
            const treeArray = tree.toArray();
            expect(sortedArray).to.deep.equal(treeArray);
        });
        it("should return in-order array #3", () => {
            const tree = RedBlackTree.from([Person.Priscilla, Person.Hanna, Person.Karen, Person.Bella, Person.Megan], personNameComparator);
            const array = tree.toArray();
            expect(array).to.deep.equal([Person.Bella, Person.Hanna, Person.Karen, Person.Megan, Person.Priscilla]);
        });
    });

    describe("#traverseToArray()", () => {
        it("should traverse and return an array based on the given direction", () => {
            const sourceData = [4, 1, 3, 5, 2];
            const sortedSourceData = Enumerable.from(sourceData).orderBy(n => n).toArray();
            const expectedPreOrderArray = [3, 1, 2, 4, 5];
            const expectedPostOrderArray = [2, 1, 5, 4, 3];
            const tree = RedBlackTree.from(sourceData);
            const array = tree.toArray();
            const inOrderArray = tree.traverseToArray("INORDER");
            const postOrderArray = tree.traverseToArray("POSTORDER");
            const preOrderArray = tree.traverseToArray("PREORDER");
            expect(inOrderArray).to.deep.equal(sortedSourceData);
            expect(inOrderArray).to.deep.equal(array);
            expect(postOrderArray).to.deep.equal(expectedPostOrderArray);
            expect(preOrderArray).to.deep.equal(expectedPreOrderArray);
            console.log("IN: ", inOrderArray);
            console.log("POST: ", postOrderArray);
            console.log("PRE: ", preOrderArray);
        });
    });
});

