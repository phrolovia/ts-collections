import {Person} from "../models/Person";
import {it} from "mocha";
import {List} from "../../src/list/List";
import {expect} from "chai";
import {LinkedList} from "../../src/list/LinkedList";
import {RedBlackTree} from "../../src/tree/RedBlackTree";
import {SortedDictionary} from "../../src/dictionary/SortedDictionary";
import {IQueue} from "../../src/queue/IQueue";
import {Enumerable} from "../../src/enumerator/Enumerable";

describe("Lookup", () => {
    const personAgeComparator = (p1: Person, p2: Person) => p1.age === p2.age;
    const personNameComparator = (p1: Person, p2: Person) => p1.name === p2.name;
    const personSurnameComparator = (p1: Person, p2: Person) => p1.surname === p2.surname;
    const peopleArray = [Person.Hanna, Person.Hanna2, Person.Noemi, Person.Noemi2, Person.Suzuha, Person.Suzuha2, Person.Suzuha3];

    describe("#aggregate()", () => {
        it("should return 4", () => {
            const list = new List([4, 8, 8, 3, 9, 0, 7, 8, 2]);
            const lookup = list.toLookup(n => n, n => n * 2);
            const result = lookup.aggregate((total, next) => next.key % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(4); // for 4, 8, 0 and 2
        });
    });

    describe("#get()", () => {
        it("should get the data that belongs to the given key", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const noemiData = lookup.get("Noemi");
            expect(noemiData.toArray()).to.have.all.members([Person.Noemi, Person.Noemi2]);
        });
        it("should return empty enumerable if key have no data", () => {
            const tree = new RedBlackTree((p1, p2) => p1.name.localeCompare(p2.name), peopleArray);
            const lookup = tree.toLookup(p => p.name, p => p);
            const karenData = lookup.get("Karen");
            expect(karenData.any()).to.eq(false);
        });
    });

    describe("#hasKey()", () => {
        it("should return true if lookup has the key", () => {
            const dict = new SortedDictionary<string, Person>(
                (n1, n2) => n1.localeCompare(n2),
                (p1, p2) => personNameComparator(p1, p2) && personSurnameComparator(p1, p2) && personAgeComparator(p1, p2));
            peopleArray.forEach(p => dict.tryAdd(p.name, p));
            const lookup = dict.toLookup(p => p.key, p => p.value);
            expect(lookup.hasKey("Noemi")).to.eq(true);
            expect(lookup.hasKey("Suzuha")).to.eq(true);
            expect(lookup.hasKey("Hanna")).to.eq(true);
            expect(lookup.hasKey("Lucrezia")).to.eq(false);
            expect(lookup.length).to.eq(3);
        });
    });

    describe("#size()", () => {
        it("should return the size of the lookup", () => {
            const queue: IQueue<Person> = new LinkedList(peopleArray);
            const lookup = queue.toLookup(p => p.name, p => p);
            const lookup2 = Enumerable.empty<Person>().toLookup(p => p.surname, p => p.age);
            expect(lookup.size()).to.eq(3); // Hanna, Noemi, Suzuha
            expect(lookup2.size()).to.eq(0);
            expect(lookup.length).to.eq(3);
            expect(lookup2.length).to.eq(0);
        });
    });

});
