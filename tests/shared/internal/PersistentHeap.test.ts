import { describe, expect, test } from "vitest";
import { Heap } from "../../../src/heap/Heap";
import { PersistentHeap } from "../../../src/shared/internal/PersistentHeap";

const compare = (a: number, b: number) => a - b;

describe("PersistentHeap", () => {
    test("should keep the same array layout as Heap", () => {
        const source = Array.from({ length: 500 }, (_, i) => (i * 7919) % 211);
        const mutable = new Heap(compare, source);
        let persistent = PersistentHeap.create(source, compare);
        expect(Array.from(persistent)).to.deep.equal(Array.from(mutable));
        for (let i = 0; i < 300; ++i) {
            mutable.add(i % 37);
            persistent = persistent.add(i % 37);
            if (i % 3 === 0) {
                mutable.poll();
                persistent = persistent.poll();
            }
        }
        expect(Array.from(persistent)).to.deep.equal(Array.from(mutable));
    });
    test("should poll in priority order without changing earlier versions", () => {
        const source = Array.from({ length: 2000 }, (_, i) => (i * 104729) % 1999);
        const full = PersistentHeap.create(source, compare);
        let heap = full;
        const polled: Array<number> = [];
        while (heap.size > 0) {
            polled.push(heap.peek() as number);
            heap = heap.poll();
        }
        expect(polled).to.deep.equal(source.slice().sort(compare));
        expect(full.size).to.equal(2000);
        expect(Array.from(full).sort(compare)).to.deep.equal(polled);
        expect(heap.poll()).to.equal(heap);
    });
    test("should keep heap order after removing arbitrary elements", () => {
        const source = Array.from({ length: 300 }, (_, i) => (i * 7919) % 1000);
        let heap = PersistentHeap.create(source, compare);
        const remaining = source.slice();
        for (let i = 0; i < 150; ++i) {
            const element = remaining.splice((i * 31) % remaining.length, 1)[0];
            heap = heap.remove(element);
        }
        expect(heap.remove(-1)).to.equal(heap);
        const polled: Array<number> = [];
        while (heap.size > 0) {
            polled.push(heap.peek() as number);
            heap = heap.poll();
        }
        expect(polled).to.deep.equal(remaining.sort(compare));
    });
    test("should rebuild after bulk removal and return itself when nothing matches", () => {
        const heap = PersistentHeap.create([5, 3, 8, 1, 9, 2], compare);
        expect(heap.removeWhere(e => e > 100)).to.equal(heap);
        expect(heap.addAll([])).to.equal(heap);
        const odd = heap.removeWhere(e => e % 2 === 0);
        expect(odd.peek()).to.equal(1);
        expect(Array.from(odd).sort(compare)).to.deep.equal([1, 3, 5, 9]);
        expect(heap.size).to.equal(6);
        expect(heap.contains(8)).to.be.true;
        expect(odd.contains(8)).to.be.false;
    });
});
