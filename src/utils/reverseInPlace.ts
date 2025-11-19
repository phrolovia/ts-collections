import type { IList } from "../list/IList";
import { swap } from "./swap";

export const reverseInPlace = <TElement>(sequence: IList<TElement> | Array<TElement>): void => {
    const size = sequence instanceof Array ? sequence.length : sequence.size();
    for (let ix = 0, mid = size >> 1, jx = size - 1; ix < mid; ++ix, --jx) {
        swap(sequence, ix, jx);
    }
};
