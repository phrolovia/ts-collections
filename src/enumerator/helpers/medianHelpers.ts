import { MedianTieStrategy } from "../../shared/MedianTieStrategy";
import { swap } from "../../utils/swap";

export function findMedian(data: number[], tie: MedianTieStrategy = "interpolate"): number {
    if (data.length < 1) {
        return Number.NaN;
    }
    if (data.length & 1) {
        const k = data.length >> 1;
        return nthElement(data, k);
    }
    const k1 = (data.length >> 1) - 1;
    const k2 = k1 + 1;
    const lower = nthElement(data, k1);
    const upper = nthElement(data, k2);
    switch (tie) {
        case "low":
            return lower;
        case "high":
            return upper;
        case "interpolate":
        default:
            return (lower + upper) / 2;
    }
}

export function nthElement(sequence: number[], index: number): number {
    let low = 0;
    let high = sequence.length - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const p = medianOfThreeIndex(sequence, low, mid, high);
        const pivot = sequence[p];
        swap(sequence, p, high);
        let store = low;
        for (let i = low; i < high; i++) {
            if (sequence[i] < pivot) {
                swap(sequence, i, store++);
            }
        }
        swap(sequence, store, high);
        if (store === index) {
            return sequence[store];
        }
        if (store < index) {
            low = store + 1;
        } else {
            high = store - 1;
        }
    }
    return Number.NaN;
}

function medianOfThreeIndex(sequence: number[], i: number, j: number, k: number): number {
    const itemI = sequence[i];
    const itemJ = sequence[j];
    const itemK = sequence[k];
    if (itemI < itemJ) {
        if (itemJ < itemK) {
            return j;
        }
        return itemI < itemK ? k : i;
    }
    if (itemI < itemK) {
        return i;
    }
    return itemJ < itemK ? k : j;
}
