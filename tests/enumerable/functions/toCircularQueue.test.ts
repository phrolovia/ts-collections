import { describe, expect, test } from "vitest";
import { toCircularQueue } from "../../../src/enumerator/functions/toCircularQueue";
import { CircularQueue } from "../../../src/queue/CircularQueue";

describe("#toCircularQueue()", () => {
    test("should return a circular queue", () => {
        const queue = toCircularQueue([1, 2, 3]);
        expect(queue instanceof CircularQueue).to.be.true;
        expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        expect(queue.size()).to.eq(3);
        expect(queue.length).to.eq(3);
    });

    test("should respect the provided capacity", () => {
        const queue = toCircularQueue([1, 2, 3, 4], 2);
        expect(queue.toArray()).to.deep.equal([3, 4]);
        expect(queue.size()).to.eq(2);
        expect(queue.length).to.eq(2);
    });
});
