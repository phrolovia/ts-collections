import { describe, expect, test } from "vitest";
import { toPriorityQueue } from "../../../src/enumerator/functions/toPriorityQueue";
import { PriorityQueue } from "../../../src/queue/PriorityQueue";

describe("#toPriorityQueue()", () => {
    test("should return a min priority queue", () => {
        const priorityQueue = toPriorityQueue([70, 5, 0, 14, 20, 65, 12, 37]);
        expect(priorityQueue instanceof PriorityQueue).to.be.true;
        expect(priorityQueue.size()).to.eq(8);
        expect(priorityQueue.length).to.eq(8);
        expect(priorityQueue.toArray()).toEqual([0, 14, 5, 37, 20, 65, 12, 70]);
    });
    test("should return a max priority queue", () => {
        const priorityQueue = toPriorityQueue([70, 5, 0, 14, 20, 65, 12, 37], (a, b) => b - a);
        expect(priorityQueue instanceof PriorityQueue).to.be.true;
        expect(priorityQueue.size()).to.eq(8);
        expect(priorityQueue.length).to.eq(8);
        expect(priorityQueue.toArray()).toEqual([70, 37, 65, 20, 14, 0, 12, 5]);
    });
});
