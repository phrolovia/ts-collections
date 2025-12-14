import { Enumerable } from "../Enumerable";
import { IEnumerable } from "../IEnumerable";

export const infiniteSequence = (start: number, step: number): IEnumerable<number> => {
    return Enumerable.infiniteSequence(start, step);
};
