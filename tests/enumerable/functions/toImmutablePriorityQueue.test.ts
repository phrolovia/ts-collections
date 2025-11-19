import { describe, expect, test } from "vitest";
import { toImmutablePriorityQueue } from "../../../src/enumerator/functions/toImmutablePriorityQueue";
import { ImmutablePriorityQueue } from "../../../src/queue/ImmutablePriorityQueue";

describe("#toImmutablePriorityQueue()", () => {
    test("should return an immutable priority queue", () => {
        const immutablePriorityQueue = toImmutablePriorityQueue([1, 2, 3, 4, 5]);
        expect(immutablePriorityQueue instanceof ImmutablePriorityQueue).to.be.true;
        expect(immutablePriorityQueue.size()).to.eq(5);
        expect(immutablePriorityQueue.length).to.eq(5);
    });
});
