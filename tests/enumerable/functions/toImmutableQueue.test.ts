import { describe, expect, test } from "vitest";
import { toImmutableQueue } from "../../../src/enumerator/functions/toImmutableQueue";
import { ImmutableQueue } from "../../../src/queue/ImmutableQueue";

describe("#toImmutableQueue()", () => {
    test("should return an immutable queue", () => {
        const immutableQueue = toImmutableQueue([1, 2, 3, 4, 5]);
        expect(immutableQueue instanceof ImmutableQueue).to.be.true;
        expect(immutableQueue.size()).to.eq(5);
        expect(immutableQueue.length).to.eq(5);
    });
});
