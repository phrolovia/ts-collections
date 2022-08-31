import {describe, it} from "mocha";
import * as chai from "chai";
import {expect} from "chai";
import {AsyncEnumerable} from "../../src/enumerator/AsyncEnumerable";
import chaiAsPromised from "chai-as-promised";
import {ErrorMessages} from "../../src/shared/ErrorMessages";
import {Person} from "../models/Person";

describe("AsyncEnumerable", () => {
    chai.use(chaiAsPromised);
    const suspend = (ms: number) => new Promise(resolve => global.setTimeout(resolve, ms));
    const numberProducer = async function* (limit: number = 100, delay: number = 50): AsyncIterable<number> {
        for (let ix = 0; ix < limit; ++ix) {
            await suspend(delay);
            yield ix;
        }
    };
    const numericalStringProducer = async function* (limit: number = 100, delay: number = 50): AsyncIterable<string> {
        for (let ix = 0; ix < limit; ++ix) {
            await suspend(delay);
            yield ix.toString();
        }
    };

    const personProducer = async function* (delay: number = 50): AsyncIterable<Person> {
        const people: Person[] = [Person.Alice, Person.Lucrezia, Person.Vanessa, Person.Emily, Person.Noemi];
        for (let ix = 0; ix < people.length; ++ix) {
            await suspend(delay);
            yield people[ix];
        }
    };

    describe("#all()", () => {
        it("should return true if all elements satisfy the predicate", async () => {
            const result = await new AsyncEnumerable(numberProducer(10)).all(n => n < 10);
            expect(result).to.eq(true);
        }).timeout(5000);
        it("should return false if any element does not satisfy the predicate", async () => {
            const result = await new AsyncEnumerable(numberProducer(10)).all(n => n % 2 === 1);
            expect(result).to.eq(false);
        }).timeout(5000);
    });

    describe("#any()", () => {
        it("should return true if any element in the enumerable matches the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.any(n => n % 2 === 0);
            console.log(result);
            expect(result).to.eq(true);
        }).timeout(5000);
        it("should return false if no element in the enumerable matches the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.any(n => n > 10);
            expect(result).to.eq(false);
        }).timeout(5000);
        it("should return false if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            const result = await enumerable.any(n => n > 10);
            expect(result).to.eq(false);
        });
        it("should return true if the enumerable is not empty and the predicate is not provided", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.any();
            expect(result).to.eq(true);
        });
    });

    describe("#append()", () => {
        it("should append an element to the end of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.append(10).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            console.log(result);
        }).timeout(5000);
    });

    describe("#average()", () => {
        it("should return the average of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.average(n => n);
            expect(result).to.eq(4.5);
        }).timeout(5000);
        it("should throw an error if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.average()).to.be.rejectedWith(ErrorMessages.NoElements);
        }).timeout(5000);
        it("should convert values to number", async () => {
            const enumerable = new AsyncEnumerable(numericalStringProducer(10));
            const result = await enumerable.average(n => parseInt(n, 10));
            expect(result).to.eq(4.5);
        }).timeout(5000);
    });

    describe("#chunk()", () => {
        it("should chunk the enumerable into a collection of arrays", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const resultEnum = await enumerable.chunk(3).toArray();
            const result = resultEnum.map(e => e.toArray());
            expect(result).to.deep.equal([[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]]);
        }).timeout(5000);
        it("should chunk the enumerable into a collection of arrays with a custom chunk size", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const resultEnum = await enumerable.chunk(2).toArray();
            const result = resultEnum.map(e => e.toArray());
            expect(result).to.deep.equal([[0, 1], [2, 3], [4, 5], [6, 7], [8, 9]]);
        }).timeout(5000);
        it("should throw an error if the chunk size is less than 1", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(() => enumerable.chunk(0)).to.throw(ErrorMessages.InvalidChunkSize);
        }).timeout(5000);
    });

    describe("#concat()", () => {
        it("should concatenate two enumerables", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.concat(new AsyncEnumerable(numberProducer(10))).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }).timeout(5000);
    });

    describe("#contains()", () => {
        it("should return true if the enumerable contains the element", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.contains(5);
            expect(result).to.eq(true);
        }).timeout(5000);
        it("should return false if the enumerable does not contain the element", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.contains(10);
            expect(result).to.eq(false);
        }).timeout(5000);
        it("should use provided equality comparer", async () => {
            ;
            expect((await new AsyncEnumerable(personProducer()).contains(Person.Alice, (p1, p2) => p1.age === p2.age))).to.eq(true);
            expect((await new AsyncEnumerable(personProducer()).contains(Person.Noemi2, (p1, p2) => p1.age === p2.age))).to.eq(false);
        });
    });

    describe("#count()", () => {
        it("should return the number of elements in the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.count();
            expect(result).to.eq(10);
        }).timeout(5000);
        it("should return the number of elements in the enumerable that satisfy the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.count(n => n % 2 === 0);
            expect(result).to.eq(5);
        }).timeout(5000);
    });

    describe("#defaultIfEmpty()", () => {
        it("should return the enumerable if it is not empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.defaultIfEmpty(10).toArray();
            expect(result).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        }).timeout(5000);
        it("should return the default value if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            const result = await enumerable.defaultIfEmpty(10).toArray();
            expect(result).to.deep.equal([10]);
        }).timeout(5000);
    });

    describe("#first()", () => {
        it("should return the first element of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.first();
            console.log(result);
            expect(result).to.eq(0);
        }).timeout(5000);
        it("should return the first element of the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).first();
            console.log(result);
            expect(result).to.eq(-99);
        }).timeout(5000);
        it("should return the first element that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).skip(2).first(n => n % 5 === 0);
            console.log(result);
            expect(result).to.eq(5);
        }).timeout(5000);
        it("should throw an error if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            expect(enumerable.first()).to.be.rejectedWith(ErrorMessages.NoElements);
        });
        it("should throw an error if no elements satisfy the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            expect(enumerable.first(n => n > 10)).to.be.rejectedWith(ErrorMessages.NoMatchingElement);
        });
    });

    describe("#firstOrDefault()", () => {
        it("should return the first element of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.firstOrDefault();
            expect(result).to.eq(0);
        }).timeout(5000);
        it("should return the first element of the enumerable #2", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).firstOrDefault();
            expect(result).to.eq(-99);
        }).timeout(5000);
        it("should return the first element that satisfies the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(-99).skip(2).firstOrDefault(n => n % 5 === 0);
            expect(result).to.eq(5);
        }).timeout(5000);
        it("should return the default value if the enumerable is empty", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(0));
            const result = await enumerable.firstOrDefault(n => n > 10);
            expect(result).to.be.null;
        }).timeout(5000);
        it("should return the default value if no elements satisfy the predicate", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.firstOrDefault(n => n > 10);
            expect(result).to.be.null;
        }).timeout(5000);
    });

    describe("#prepend()", () => {
        it("should prepend an element to the beginning of the enumerable", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.prepend(10).toArray();
            expect(result).to.deep.equal([10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
            console.log(result);
        }).timeout(5000);
    });

    describe("#select()", () => {
        it("should map values to their squares", async () => {
            const numbers: number[] = [];
            const enumerable = new AsyncEnumerable(numberProducer(5, 100));
            for await (const num of enumerable.select(p => Math.pow(p, 2))) {
                numbers.push(num);
            }
            console.log(numbers);
            expect(numbers).to.deep.equal([0, 1, 4, 9, 16]);
        }).timeout(10000);
    });

    describe("#skip()", () => {
        it("should skip the first n elements", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(10));
            const result = await enumerable.skip(5).toArray();
            expect(result).to.deep.equal([5, 6, 7, 8, 9]);
            console.log(result);
        }).timeout(5000);
    });

    describe("#where()", () => {
        it("should select values that can be divided to 3", async () => {
            const enumerable = new AsyncEnumerable(numberProducer(30));
            for await (const num of enumerable.where(p => p % 3 === 0)) {
                expect(num).to.be.greaterThanOrEqual(0);
                expect(num).to.be.lessThan(30);
                expect(num % 3 === 0).to.be.true;
            }
        }).timeout(12000);
    });
});
