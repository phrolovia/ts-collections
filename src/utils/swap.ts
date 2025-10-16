import {IList} from "../list/IList";
import {IndexOutOfBoundsException} from "../shared/IndexOutOfBoundsException";

/**
 * Swaps the elements of the list at the given indices.
 * @param {IList|Array} sequence The list or array whose two elements will be swapped
 * @param {number} firstIndex The first index of the swap operation
 * @param {number} secondIndex The second index of the swap operation
 * @throws {IndexOutOfBoundsException} If the given indices are out of bounds.
 */
export const swap = <TElement>(sequence: IList<TElement> | Array<TElement>, firstIndex: number, secondIndex: number): void => {
    const size = sequence instanceof Array ? sequence.length : sequence.size();
    if (firstIndex < 0 || firstIndex >= size) {
        throw new IndexOutOfBoundsException(firstIndex);
    } else if (secondIndex < 0 || secondIndex >= size) {
        throw new IndexOutOfBoundsException(secondIndex);
    }
    if (sequence instanceof Array) {
        [sequence[firstIndex], sequence[secondIndex]] = [sequence[secondIndex], sequence[firstIndex]];
        return;
    }
    const temp = sequence.get(firstIndex);
    sequence.set(firstIndex, sequence.get(secondIndex));
    sequence.set(secondIndex, temp);
};
