import { describe, expect, test } from "vitest";
import { ofType } from "../../../src/enumerator/functions/ofType";
import { Person } from "../../models/Person";
import { AbstractShape, Circle, Polygon, Rectangle, Square, Triangle } from "../../models/Shape";

describe("#ofType()", () => {
    const symbol = Symbol("test");
    const object = new Object(100);
    const bigInt = BigInt(100);
    const bigint2 = BigInt(Number.MAX_SAFE_INTEGER);
    const generator = function* () {
        yield 1;
        yield 2;
        yield 3;
    };
    const func = () => {
        return 1;
    };
    const collection = [
        1, 2, 3,
        "4", "5", "6",
        7, 8, 9, 10,
        true, false,
        Number(999),
        symbol,
        object,
        Person.Mirei,
        Person.Alice,
        bigInt,
        bigint2,
        ["x", "y", "z"],
        generator,
        func
    ];
    const circle1 = new Circle(1);
    const circle2 = new Circle(2);
    const triangle = new Triangle(10, 8);
    const square = new Square(5);
    const polygon = new Polygon([5, 5, 5, 5, 5]);
    const polygon2 = new Polygon([10, 10, 10, 10, 10]);
    const rectangle = new Rectangle(10, 5);
    const rectangle2 = new Rectangle(20, 10);
    const shapes = [circle1, circle2, triangle, square, polygon, polygon2, rectangle, rectangle2];
    const shapesWithPeople = [...shapes, Person.Mirei, Person.Alice];
    test("should return an array of numbers via Number constructor", () => {
        const numbers = ofType(collection, Number);
        expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
    });
    test("should return an array of numbers via typeof", () => {
        const numbers = ofType(collection, "number");
        expect(numbers.toArray()).to.deep.equal([1, 2, 3, 7, 8, 9, 10, 999]);
    });
    test("should return an array of strings via String constructor", () => {
        const strings = ofType(collection, String);
        expect(strings.toArray()).to.deep.equal(["4", "5", "6"]);
    });
    test("should return an array of strings via typeof", () => {
        const strings = ofType(collection, "string");
        expect(strings.toArray()).to.deep.equal(["4", "5", "6"]);
    });
    test("should return an array of booleans via Boolean constructor", () => {
        const booleans = ofType(collection, Boolean);
        expect(booleans.toArray()).to.deep.equal([true, false]);
    });
    test("should return an array of booleans via typeof", () => {
        const booleans = ofType(collection, "boolean");
        expect(booleans.toArray()).to.deep.equal([true, false]);
    });
    test("should return an array of symbols via Symbol constructor", () => {
        const symbols = ofType(collection, Symbol);
        expect(symbols.toArray()).to.deep.equal([symbol]);
    });
    test("should return an array of symbols via typeof", () => {
        const symbols = ofType(collection, "symbol");
        expect(symbols.toArray()).to.deep.equal([symbol]);
    });
    test("should return an array of objects via Object constructor", () => {
        const objects = ofType(collection, Object);
        expect(objects.toArray()).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
    });
    test("should return an array of objects via typeof", () => {
        const objects = ofType(collection, "object");
        expect(objects.toArray()).to.deep.equal([object, Person.Mirei, Person.Alice, ["x", "y", "z"]]);
    });
    test("should return an array of big integers via BigInt constructor", () => {
        const bigintList = ofType(collection, BigInt);
        expect(bigintList.toArray()).to.deep.equal([bigInt, bigint2]);
    });
    test("should return an array of big integers via typeof", () => {
        const bigintList = ofType(collection, "bigint");
        expect(bigintList.toArray()).to.deep.equal([bigInt, bigint2]);
    });
    test("should return an array of functions via Function constructor", () => {
        const functions = ofType(collection, Function);
        expect(functions.toArray()).to.deep.equal([generator, func]);
    });
    test("should return an array of functions via typeof", () => {
        const functions = ofType(collection, "function");
        expect(functions.toArray()).to.deep.equal([generator, func]);
    });
    test("should return an array of Person objects via Person constructor", () => {
        const people = ofType(collection, Person);
        expect(people.toArray()).to.deep.equal([Person.Mirei, Person.Alice]);
    });
    test("should return an array of arrays via Array constructor", () => {
        const arrays = ofType(collection, Array);
        expect(arrays.toArray()).to.deep.equal([["x", "y", "z"]]);
    });
    test("should return an array of strings and numbers", () => {
        const stringsAndNumbers = [...ofType(collection, String), ...ofType(collection, Number)];
        expect(stringsAndNumbers).to.deep.equal(["4", "5", "6", 1, 2, 3, 7, 8, 9, 10, 999]);
    });
    test("should return an array of circles via Circle constructor", () => {
        const circles = ofType(shapes, Circle);
        expect(circles.toArray()).to.deep.equal([circle1, circle2]);
    });
    test("should return an array of polygons via Polygon constructor", () => {
        const polygons = ofType(shapes, Polygon);
        // Rectangle extends Polygon, so it should be included in the result
        expect(polygons.toArray()).to.deep.equal([polygon, polygon2, rectangle, rectangle2]);
    });
    test("should return an array of rectangles via Rectangle constructor", () => {
        const rectangles = ofType(shapes, Rectangle);
        expect(rectangles.toArray()).to.deep.equal([rectangle, rectangle2]);
    });
    test("should return an array of squares via Square constructor", () => {
        const squares = ofType(shapes, Square);
        expect(squares.toArray()).to.deep.equal([square]);
    });
    test("should return an array of triangles via Triangle constructor", () => {
        const triangles = ofType(shapes, Triangle);
        expect(triangles.toArray()).to.deep.equal([triangle]);
    });
    test("should return an array of shapes via AbstractShape constructor", () => {
        const allShapes = ofType(shapes, AbstractShape);
        expect(allShapes.toArray()).to.deep.equal(shapes);
    });
    test("should return respective shapes and people", () => {
        const shapes = ofType(shapesWithPeople, AbstractShape); // return type is not IEnumerable<AbstractShape>, could not find a way to do this
        const people = ofType(shapesWithPeople, Person);
        expect(shapes.toArray()).to.deep.equal([circle1, circle2, triangle, square, polygon, polygon2, rectangle, rectangle2]);
        expect(people.toArray()).to.deep.equal([Person.Mirei, Person.Alice]);
    });
});
