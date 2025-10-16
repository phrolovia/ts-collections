import { swap } from "./swap";
import { IList } from "../list/IList";

export const shuffleInPlace = <TElement>(sequence: Array<TElement> | IList<TElement>): void => {
    const size = sequence instanceof Array ? sequence.length : sequence.size();
    const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min)) + min;
    for (let ix = size; ix > 1; --ix) {
        swap(sequence, ix - 1, random(0, ix));
    }
};
