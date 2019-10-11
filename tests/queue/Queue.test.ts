import { expect } from "chai";
import { IQueue } from "../../src/queue/IQueue";
import { List } from "../../src/list/List";
import { Person } from "../models/Person";

describe("Queue", () => {
    const person: Person     = new Person("Alice", "Rivermist", 23);
    const person2: Person    = new Person("Mel", "Bluesky", 9);
    const person3: Person    = new Person("Senna", "Hikaru", 10);
    const person4: Person    = new Person("Lenka", "Polakova", 16);
    const person5: Person    = new Person("Jane", "Green", 16);
    describe("#clear()", () => {
        it("size should be equal to 0", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person2);
            queue.clear();
            expect(queue.size()).to.equal(0);
        });
    });
    describe("#contains()", () => {
        const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(null);
            queue.enqueue(person2);
        it("should contain person", () => {
            const exists = queue.contains(person);
            expect(exists).to.equal(true);
        });
        it("should contain null item", () => {
            expect(queue.contains(null)).to.eq(true);
        });
        it("should not contain person", () => {
            expect(queue.contains(person4)).to.eq(false);
        });
    });
    describe("#dequeue()", () => {
        it("should return null.", () => {
            const queue: IQueue<Person> = new List<Person>();
            expect(() => queue.dequeue()).to.throw("queue is empty.");
        });
        it("should return a person with the name Alice", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person3);
            queue.enqueue(person5);
            const first = queue.dequeue();
            expect(first.Name).to.equal("Alice");
        });
        it("size should be equal to 3", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person2);
            queue.enqueue(person3);
            queue.enqueue(person5);
            queue.dequeue();
            expect(queue.size()).to.eq(3);
        });
    });
    describe("#enqueue()", () => {
        it("should add element to the list", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            expect(queue.peek()).to.equal(person);
        });
        it("size should be equal to 1", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            expect(queue.size()).to.equal(1);
        });
    });
    describe("#peek()", () => {
        it("should return null.", () => {
            const queue: IQueue<Person> = new List<Person>();
            expect(queue.peek()).to.equal(null);
        });
        it("should return a person with the name Alice", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person3);
            queue.enqueue(person5);
            const first = queue.peek();
            expect(first.Name).to.equal("Alice");
        });
        it("size should not change", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person2);
            queue.enqueue(person3);
            queue.enqueue(person5);
            const fc = queue.size();
            queue.peek();
            expect(queue.size()).to.eq(fc);
        });
    });
    describe("#poll()", () => {
        it("should return null", () => {
            const queue: IQueue<Person> = new List<Person>();
            expect(queue.poll()).to.eq(null);
        });
        it("should return a person with the name Alice", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person3);
            queue.enqueue(person5);
            const first = queue.poll();
            expect(first.Name).to.equal("Alice");
        });
        it("size should be equal to 3", () => {
            const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person2);
            queue.enqueue(person3);
            queue.enqueue(person5);
            queue.poll();
            expect(queue.size()).to.eq(3);
        });
    });
    describe("#toArray()", () => {
        const queue: IQueue<Person> = new List<Person>();
            queue.enqueue(person);
            queue.enqueue(person2);
            queue.enqueue(person3);
            queue.enqueue(person5);
        const array = queue.toArray();
        it("should have the same size as list", () => {
            expect(queue.size()).to.eq(array.length);
        });
        const personComparer = (ix: number) => {
            it(`should have same person at the index: ${ix}`, () => {
                const p = queue.dequeue();
                expect(p).deep.equal(array[ix]);
            });
        };
        for (var ix = 0; ix < queue.size(); ++ix){
            personComparer(ix);
        }
    });
});