import { Enumerable } from "../Enumerable";
import { IEnumerable } from "../IEnumerable";

export const sequence = (
    start: number,
    end: number,
    step: number
): IEnumerable<number> => {
    return Enumerable.sequence(start, end, step);
}
