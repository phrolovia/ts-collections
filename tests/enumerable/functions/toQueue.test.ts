import { describe, expect, test } from "vitest";
import { toQueue } from "../../../src/enumerator/functions/toQueue";
import { Queue } from "../../../src/queue/Queue";

describe("#toQueue()", () => {
    test("should return a queue", () => {
        const queue = toQueue([1, 2, 3, 4, 5]);
        expect(queue instanceof Queue).to.be.true;
        expect(queue.size()).to.eq(5);
        expect(queue.length).to.eq(5);
        expect(queue.toArray()).to.deep.equal([1, 2, 3, 4, 5]);
    });
});
