export interface Shape {
    sides: number;
}

export abstract class AbstractShape implements Shape {
    protected constructor(public readonly sides: number) {
    }
}

export class Circle extends AbstractShape {
    public constructor(public readonly radius: number) {
        super(0);
    }
}

export class Triangle extends AbstractShape {
    public constructor(public readonly base: number, public readonly height: number) {
        super(3);
    }
}

export class Square extends AbstractShape {
    public constructor(public readonly side: number) {
        super(4);
    }
}

export class Polygon extends AbstractShape {
    public constructor(public readonly sideLengths: number[]) {
        super(sideLengths.length);
    }
}

export class Rectangle extends Polygon {
    public constructor(public readonly width: number, public readonly height: number) {
        super([width, height, width, height]);
    }
}