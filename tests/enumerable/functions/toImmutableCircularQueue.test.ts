import { describe, expect, test } from "vitest";
import { toImmutableCircularQueue } from "../../../src/enumerator/functions/toImmutableCircularQueue";
import { ImmutableCircularQueue } from "../../../src/queue/ImmutableCircularQueue";

describe("#toImmutableCircularQueue()", () => {
    test("should return an immutable circular queue", () => {
        const queue = toImmutableCircularQueue([1, 2, 3]);
        expect(queue instanceof ImmutableCircularQueue).to.be.true;
        expect(queue.toArray()).to.deep.equal([1, 2, 3]);
        expect(queue.size()).to.eq(3);
        expect(queue.length).to.eq(3);
    });

    test("should retain only the most recent elements up to capacity", () => {
        const queue = toImmutableCircularQueue([1, 2, 3, 4], 3);
        expect(queue.toArray()).to.deep.equal([2, 3, 4]);
        expect(queue.capacity).to.equal(3);
    });
});
