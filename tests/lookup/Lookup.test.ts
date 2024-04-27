import {Person} from "../models/Person";

import {List} from "../../src/list/List";

import {LinkedList} from "../../src/list/LinkedList";
import {RedBlackTree} from "../../src/tree/RedBlackTree";
import {SortedDictionary} from "../../src/dictionary/SortedDictionary";
import {Enumerable} from "../../src/enumerator/Enumerable";
import {Queue} from "../../src/queue/Queue";
import {Group} from "../../src/enumerator/Group";
import {IGroup} from "../../src/enumerator/IGroup";
import {
    EnumerableSet,
    IEnumerable,
    ImmutableDictionary,
    ImmutableList,
    ImmutableSet, ImmutableSortedDictionary, ImmutableSortedSet,
    SortedSet
} from "../../src/imports";
import {Lookup} from "../../src/lookup/Lookup";

describe("Lookup", () => {
    const personAgeComparator = (p1: Person, p2: Person) => p1.age === p2.age;
    const personNameComparator = (p1: Person, p2: Person) => p1.name === p2.name;
    const personSurnameComparator = (p1: Person, p2: Person) => p1.surname === p2.surname;
    const peopleArray = [Person.Hanna, Person.Hanna2, Person.Noemi, Person.Noemi2, Person.Suzuha, Person.Suzuha2, Person.Suzuha3];

    describe("#aggregate()", () => {
        test("should return 4", () => {
            const list = new List([4, 8, 8, 3, 9, 0, 7, 8, 2]);
            const lookup = list.toLookup(n => n, n => n * 2);
            const result = lookup.aggregate((total, next) => next.key % 2 === 0 ? total + 1 : total, 0);
            expect(result).to.eq(4); // for 4, 8, 0 and 2
        });
    });

    describe("#all()", () => {
        test("should return true if all keys have data", () => {
            const list = new LinkedList([Person.Alice, Person.Mirei]);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.all(k => k.source.all(p => p.age > 20))).to.eq(true);
        });
        test("should return false if any of the lookup keys does not satisfy the condition", () => {
            const list = new LinkedList([Person.Alice, Person.Mirei]);
            const lookup = list.toLookup(p => p.age, p => p);
            expect(lookup.all(k => k.key < 20)).to.eq(false);
        });
    });

    describe("#any()", () => {
        test("should return true if lookup has any data", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.any()).to.eq(true);
        });
        test("should return false if lookup has no data", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.any()).to.eq(true);
        });
    });

    describe("#append()", () => {
        test("should append the given key and data to the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const lookupEnumerable = lookup.append(new Group("Lucrezia", Enumerable.from([Person.Lucrezia])));
            expect(lookupEnumerable.count()).to.eq(4);
        });
    });

    describe("#average()", () => {
        test("should return the average of the lookup keys", () => {
            const list = new LinkedList([Person.Alice, Person.Mirei]);
            const lookup = list.toLookup(p => p.age, p => p);
            expect(lookup.average(p => p.key)).to.eq(22.5);
        });
    });

    // describe("#cast()", () => {
    //     // TODO
    // });

    describe("#chunk()", () => {
        test("should return 3 chunks", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.age, p => p);
            const chunks = lookup.chunk(2);
            expect(chunks.count()).to.eq(3);
        });
    });

    describe("#concat()", () => {
        test("should return a new lookup with the given lookup appended", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const group: IGroup<string, Person> = new Group("Lucrezia", Enumerable.from([Person.Lucrezia]));
            const lookup2 = lookup.concat(Enumerable.from([group]));
            expect(lookup2.count()).to.eq(4);
        });
    });

    describe("#contains()", () => {
        test("should return true if lookup contains the given key", () => {
            const list = new LinkedList(peopleArray);
            const group: IGroup<string, Person> = new Group("Hanna", Enumerable.from([Person.Hanna, Person.Hanna2]));
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.contains(group)).to.eq(true);
        });
        test("should return false if lookup does not contain the given key", () => {
            const list = new LinkedList(peopleArray);
            const group: IGroup<string, Person> = new Group("Kaori", Enumerable.from([Person.Kaori]));
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.contains(group)).to.eq(false);
        });
    });

    describe("#count()", () => {
        test("should return the number of keys in the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.count()).to.eq(3);
            expect(lookup.length).to.eq(3);
            expect(lookup.size()).to.eq(3);
        });
    });

    describe("#create()", () => {
        test("should throw error if source is null", () => {
            expect(() => Lookup.create(null as any, p => p, p => p)).to.throw(Error);expect(() => Lookup.create(null as any, p => p, p => p)).to.throw(Error);
        });
        test("should throw error if keySelector is null", () => {
            expect(() => Lookup.create(Enumerable.from([Person.Alice]), null as any, p => p)).to.throw(Error);
        });
        test("should throw error if valueSelector is null", () => {
            expect(() => Lookup.create(Enumerable.from([Person.Alice]), p => p, null as any)).to.throw(Error);
        });
    });

    describe("#defaultIfEmpty()", () => {
        test("should return the given default value if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.defaultIfEmpty(new Group("Noemi", Enumerable.from([Person.Noemi])));
            expect(result.count()).to.eq(1);
            expect(result.first()?.key).to.eq("Noemi");
        });
        test("should disregard the given value if lookup is not empty", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.defaultIfEmpty(new Group("Reika", Enumerable.from([Person.Reika])));
            expect(result.count()).to.eq(3);
            expect(result.select(p => p?.key).contains("Reika")).to.eq(false);
        });
    });

    describe("#distinct()", () => {
        test("should return a lookup with only unique keys", () => {
            const list = new LinkedList([Person.Alice, Person.Mirei, Person.Alice]);
            const lookup = list.toLookup(p => p.age, p => p);
            const result = lookup.distinct();
            expect(result.count()).to.eq(2);
        });
    });

    describe("#elementAt()", () => {
        test("should return the group at the given index", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.elementAt(1);
            expect(result.key).to.eq("Noemi");
        });
        test("should throw an error if index is out of range", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.elementAt(5)).to.throw(Error);
        });
    });

    describe("#elementAtOrDefault()", () => {
        test("should return the group at the given index", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.elementAtOrDefault(1) as IGroup<string, Person>;
            expect(result.key).to.eq("Noemi");
        });
        test("should return the default value if index is out of range", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.elementAtOrDefault(5);
            expect(result).to.be.null;
        });
    });

    describe("#except()", () => {
        test("should return a lookup with the given lookup removed", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const group: IGroup<string, Person> = new Group("Noemi", Enumerable.from([Person.Noemi, Person.Noemi2]));
            const lookup2 = lookup.except(Enumerable.from([group]));
            expect(lookup2.count()).to.eq(2);
        });
    });

    describe("#first()", () => {
        test("should return the first group", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.first();
            expect(result.key).to.eq("Hanna");
        });
        test("should throw an error if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.first()).to.throw(Error);
        });
    });

    describe("#firstOrDefault()", () => {
        test("should return the first group", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.firstOrDefault() as IGroup<string, Person>;
            expect(result.key).to.eq("Hanna");
        });
        test("should return the default value if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.firstOrDefault();
            expect(result).to.be.null;
        });
    });

    describe("#forEach()", () => {
        test("should iterate over each group", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            let count = 0;
            lookup.forEach(() => count++);
            expect(count).to.eq(3);
        });
    });

    describe("#get()", () => {
        test("should get the data that belongs to the given key", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const noemiData = lookup.get("Noemi");
            expect(noemiData.toArray()).to.have.all.members([Person.Noemi, Person.Noemi2]);
        });
        test("should return empty enumerable if key have no data", () => {
            const tree = new RedBlackTree(peopleArray, (p1, p2) => p1.name.localeCompare(p2.name));
            const lookup = tree.toLookup(p => p.name, p => p);
            const kaoriData = lookup.get("Kaori");
            expect(kaoriData.any()).to.eq(false);
        });
    });

    describe("#groupBy()", () => {
        test("should group the data by the given key", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.groupBy(p => p.key);
            expect(result.count()).to.eq(3);
        });
    });

    // describe("#groupJoin()", () => {
    //     // TODO
    // });

    describe("#hasKey()", () => {
        test("should return true if lookup has the key", () => {
            const dict = new SortedDictionary<string, Person>(
                [],
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

    describe("#intersect()", () => {
        test("should return a lookup with the intersection of the given lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const group: IGroup<string, Person> = new Group("Noemi", Enumerable.from([Person.Noemi, Person.Noemi2]));
            const lookup2 = lookup.intersect(Enumerable.from([group]));
            expect(lookup2.count()).to.eq(1);
            expect(lookup2.first().key).to.eq("Noemi");
        });
    });

    // describe("#join()", () => {
    //     // TODO
    // });

    describe("#last()", () => {
        test("should return the last group", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.last();
            expect(result.key).to.eq("Suzuha");
        });
        test("should throw an error if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.last()).to.throw(Error);
        });
    });

    describe("#lastOrDefault()", () => {
        test("should return the last group", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.lastOrDefault() as IGroup<string, Person>;
            expect(result.key).to.eq("Suzuha");
        });
        test("should return the default value if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.lastOrDefault();
            expect(result).to.be.null;
        });
    });

    describe("#max()", () => {
        test("should return the maximum value", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p.age);
            const result = lookup.max(p => p.source.max());
            expect(result).to.eq(43);
        });
        test("should throw an error if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p.age);
            expect(() => lookup.max()).to.throw(Error);
        });
    });

    describe("#min()", () => {
        test("should return the minimum value", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p.age);
            const result = lookup.min(p => p.source.min());
            expect(result).to.eq(19);
        });
        test("should throw an error if lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p.age);
            expect(() => lookup.min()).to.throw(Error);
        });
    });

    // describe("#ofType()", () => {
    //     // TODO
    // });

    describe("#orderBy()", () => {
        test("should order the lookup by the given key", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.orderBy(p => p.key);
            expect(result.first().key).to.eq("Hanna");
        });
    });

    describe("#orderByDescending()", () => {
        test("should order the lookup by the given key", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.orderByDescending(p => p.key);
            expect(result.first().key).to.eq("Suzuha");
        });
    });

    describe("#pairwise()", () => {
        test("should return a lookup with the pairwise elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.pairwise((prev, curr) => [prev, curr]);
            expect(result.count()).to.eq(2);
            expect([result.elementAt(0)[0].key, result.elementAt(0)[1].key]).to.deep.eq(["Hanna", "Noemi"]);
            expect([result.elementAt(1)[0].key, result.elementAt(1)[1].key]).to.deep.eq(["Noemi", "Suzuha"]);
        });
    });

    describe("#partition()", () => {
        test("should partition the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.partition(p => p.key === "Noemi");
            expect(result[0].first().key).to.eq("Noemi");
            expect(result[1].first().key).to.eq("Hanna");
            expect(result[1].last().key).to.eq("Suzuha");
        });
    });

    describe("#prepend()", () => {
        test("should prepend the given element", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.prepend(new Group("Lucrezia", Enumerable.from([Person.Lucrezia])));
            expect(result.first().key).to.eq("Lucrezia");
        });
    });

    describe("#reverse()", () => {
        test("should reverse the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.reverse();
            expect(result.first().key).to.eq("Suzuha");
            expect(result.last().key).to.eq("Hanna");
        });
    });

    describe("#scan()", () => {
        test("should scan the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p.age);
            const result = lookup.scan((prev, curr) => prev + curr.source.sum(), 0);
            expect(result.count()).to.eq(3);
            expect(result.elementAt(0)).to.eq(39); // Hanna = 19 + 20
            expect(result.elementAt(1)).to.eq(111); // Hanna + (Noemi = 29 + 43)
            expect(result.elementAt(2)).to.eq(181); // Hanna + Noemi + (Suzuha = 22 + 22 + 26)
        });
    });

    describe("#select()", () => {
        test("should select the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.select(p => p.key);
            expect(result.first()).to.eq("Hanna");
            expect(result.last()).to.eq("Suzuha");
        });
    });

    describe("#selectMany()", () => {
        test("should select the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.selectMany(p => p.source);
            expect(result.first().name).to.eq("Hanna");
            expect(result.last().name).to.eq("Suzuha");
        });
    });

    describe("#sequenceEqual()", () => {
        test("should return true if the lookup is equal to the given lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const lookup2 = list.toLookup(p => p.name, p => p);
            const lookup3 = list.toLookup(p => p.name, p => p).reverse();
            expect(lookup.sequenceEqual(lookup2)).to.be.true;
            expect(lookup.sequenceEqual(lookup3)).to.be.false;
        });
    });

    describe("#shuffle()", () => {
        test("should shuffle the lookup", () => {
            type TestRecord = { name: string, age: number };
            const list = Enumerable.range(1, 100).select<TestRecord>(i => ({ name: i.toString(), age: i })).toList();
            const lookup = list.toLookup(p => p.name, p => p.age);
            const result = lookup.shuffle().select(p => p.key).toArray();
            expect(result).to.not.deep.equal(lookup.select(p => p.key).toArray());
        });
    });

    describe("#single()", () => {
        test("should return the only element of the lookup", () => {
            const list = new LinkedList([Person.Hanna]);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.single();
            expect(result.key).to.eq("Hanna");
        });
        test("should throw an error if the lookup has more than one element", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.single()).to.throw(Error);
        });
        test("should throw an error if the lookup has more than one element", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.append(new Group("Lucrezia", Enumerable.from([Person.Lucrezia]))).single()).to.throw(Error);
        });
    });

    describe("#singleOrDefault()", () => {
        test("should return the only element of the lookup", () => {
            const list = new LinkedList([Person.Hanna]);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.singleOrDefault() as IGroup<string, Person>;
            expect(result.key).to.eq("Hanna");
        });
        test("should throw an error if the lookup has more than one element", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.singleOrDefault()).to.throw(Error);
        });
        test("should throw an error if the lookup has more than one element", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(() => lookup.append(new Group("Lucrezia", Enumerable.from([Person.Lucrezia]))).singleOrDefault()).to.throw(Error);
        });
        test("should return the default value if the lookup is empty", () => {
            const list = new LinkedList<Person>();
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.singleOrDefault();
            expect(result).to.be.null;
        });
    });

    describe("#size()", () => {
        test("should return the size of the lookup", () => {
            const queue: Queue<Person> = new Queue(peopleArray);
            const lookup = queue.toLookup(p => p.name, p => p);
            const lookup2 = Enumerable.empty<Person>().toLookup(p => p.surname, p => p.age);
            expect(lookup.size()).to.eq(3); // Hanna, Noemi, Suzuha
            expect(lookup2.size()).to.eq(0);
            expect(lookup.length).to.eq(3);
            expect(lookup2.length).to.eq(0);
        });
    });

    describe("#skip()", () => {
        test("should skip the given amount of elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.skip(1);
            expect(result.first().key).to.eq("Noemi");
            expect(result.last().key).to.eq("Suzuha");
        });
    });

    describe("#skipLast()", () => {
        test("should skip the given amount of elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.skipLast(1);
            expect(result.first().key).to.eq("Hanna");
            expect(result.last().key).to.eq("Noemi");
        });
    });

    describe("#skipWhile()", () => {
        test("should skip the given amount of elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.skipWhile(p => p.key !== "Noemi");
            expect(result.first().key).to.eq("Noemi");
            expect(result.last().key).to.eq("Suzuha");
        });
    });

    describe("#sum()", () => {
        test("should return the sum of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p.age);
            const result = lookup.sum(p => p.source.sum());
            expect(result).to.eq(peopleArray.map(p => p.age).reduce((a, b) => a + b));
        });
    });

    describe("#take()", () => {
        test("should take the given amount of elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.take(1);
            expect(result.first().key).to.eq("Hanna");
            expect(result.last().key).to.eq("Hanna");
        });
    });

    describe("#takeLast()", () => {
        test("should take the given amount of elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.takeLast(1);
            expect(result.first().key).to.eq("Suzuha");
            expect(result.last().key).to.eq("Suzuha");
        });
    });

    describe("#takeWhile()", () => {
        test("should take the given amount of elements", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.takeWhile(p => p.key !== "Noemi");
            expect(result.first().key).to.eq("Hanna");
            expect(result.last().key).to.eq("Hanna");
        });
    });

    describe("#thenBy()", () => {
        test("should sort the lookup by the given key selector", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.orderByDescending(p => p.key).thenBy(p => p.source.first().age);
            expect(result.first().key).to.eq("Suzuha");
            expect(result.first().source.first().surname).to.eq("Suzuki");
            expect(result.first().source.first().age).to.eq(Person.Suzuha.age);

        });
    });

    describe("#thenByDescending()", () => {
        test("should sort the lookup by the given key selector", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.orderByDescending(p => p.key).thenByDescending(p => p.source.first().age);
            expect(result.first().key).to.eq("Suzuha");
            expect(result.first().source.first().surname).to.eq("Suzuki"); // same result in C#
            expect(result.first().source.first().age).to.eq(Person.Suzuha.age);
        });
    });

    describe("#toArray()", () => {
        test("should return an array of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toArray();
            expect(result.length).to.eq(3);
            expect(result[0].key).to.eq("Hanna");
            expect(result[1].key).to.eq("Noemi");
            expect(result[2].key).to.eq("Suzuha");
        });
    });

    describe("#toDictionary()", () => {
        test("should return a dictionary of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toDictionary(p => p.key, p => p.source.first());
            expect(result.size()).to.eq(3);
            expect(result.get("Hanna")).to.eq(Person.Hanna);
            expect(result.get("Noemi")).to.eq(Person.Noemi);
            expect(result.get("Suzuha")).to.eq(Person.Suzuha);
        });
    });

    describe("#toEnumerableSet()", () => {
        test("should return an enumerable set of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toEnumerableSet();
            expect(result instanceof EnumerableSet).to.be.true;
            expect(result.size()).to.eq(3);
        });
    });

    describe("#toImmutableDictionary()", () => {
        test("should return an immutable dictionary of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.toImmutableDictionary(p => p.key, p => p.source.first())).to.be.instanceOf(ImmutableDictionary);
        });
    });

    describe("#toImmutableList()", () => {
        test("should return an immutable list of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.toImmutableList()).to.be.instanceOf(ImmutableList);
        });
    });

    describe("#toImmutableSet()", () => {
        test("should return an immutable set of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.toImmutableSet()).to.be.instanceOf(ImmutableSet);
        });
    });

    describe("#toImmutableSortedDictionary()", () => {
        test("should return an immutable sorted dictionary of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.toImmutableSortedDictionary(p => p.key, p => p.source.first())).to.be.instanceOf(ImmutableSortedDictionary);
        });
    });

    describe("#toImmutableSortedSet()", () => {
        test("should return an immutable sorted set of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            expect(lookup.toImmutableSortedSet()).to.be.instanceOf(ImmutableSortedSet);
        });
    });

    describe("#toLinkedList()", () => {
        test("should return a linked list of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toLinkedList();
            expect(result instanceof LinkedList).to.be.true;
            expect(result.size()).to.eq(3);
        });
    });

    describe("#toList()", () => {
        test("should return a list of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toList();
            expect(result instanceof List).to.be.true;
            expect(result.size()).to.eq(3);
        });
    });

    describe("#toLookup()", () => {
        test("should return a lookup of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toLookup(p => p.key, p => p.source.first());
            expect(result instanceof Lookup).to.be.true;
            expect(result.size()).to.eq(3);
        });
    });

    describe("#toSortedDictionary()", () => {
        test("should return a sorted dictionary of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toSortedDictionary(p => p.key, p => p.source.first());
            expect(result instanceof SortedDictionary).to.be.true;
            expect(result.size()).to.eq(3);
        });
    });

    describe("#toSortedSet()", () => {
        test("should return a sorted set of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.toSortedSet((a, b) => a.key.localeCompare(b.key));
            expect(result instanceof SortedSet).to.be.true;
            expect(result.size()).to.eq(3);
        });
    });

    describe("#union()", () => {
        test("should return a union of the lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const group: IGroup<string, Person> = new Group("TEST", Enumerable.from([Person.Alice, Person.Mirei, Person.Kaori]));
            const result = lookup.union(Enumerable.from([group]));
            expect(result.count()).to.eq(4);
        });
        test("should return a union of the lookup and ignore duplicates", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const group: IGroup<string, Person> = new Group("Hanna", Enumerable.from([Person.Hanna2]));
            const result = lookup.union(Enumerable.from([group]));
            expect(result.count()).to.eq(3);
        });
    });

    describe("#where()", () => {
        test("should return a filtered lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.where(p => p.key === "Hanna");
            expect(result.count()).to.eq(1);
            expect(result.first().key).to.eq("Hanna");
        });
    });

    describe("#zip()", () => {
        test("should return a zipped lookup", () => {
            const list = new LinkedList(peopleArray);
            const lookup = list.toLookup(p => p.name, p => p);
            const result = lookup.zip(Enumerable.from([1, 2, 3]), (a, b) => ({ key: a.key, value: b })) as IEnumerable<{ key: string, value: number }>;
            expect(result.count()).to.eq(3);
            expect(result.first().key).to.eq("Hanna");
            expect(result.first().value).to.eq(1);
            expect(result.last().key).to.eq("Suzuha");
            expect(result.last().value).to.eq(3);
        });
    });
});
