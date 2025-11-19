import { InvalidArgumentException } from "../../shared/InvalidArgumentException";
import type { IEnumerable } from "../IEnumerable";
import { from } from "../functions/from";
import { empty } from "../functions/empty";

export const permutationsGenerator = function* <TElement>(distinctElements: TElement[], size?: number): Generator<IEnumerable<TElement>> {
    const n = distinctElements.length;
    const targetSize = (size === undefined || size === null) ? n : size;

    if (targetSize < 0 || targetSize > n) {
        throw new InvalidArgumentException("Invalid permutation size.", "size");
    }
    if (targetSize === 0 || n === 0) {
        return yield empty<TElement>();
    }

    const used = new Array<boolean>(n).fill(false);
    const currentPermutation = new Array<TElement>(targetSize);

    function* generate(index: number): IterableIterator<IEnumerable<TElement>> {
        if (index === targetSize) {
            return yield from(currentPermutation);
        }

        for (let i = 0; i < n; i++) {
            if (!used[i]) {
                used[i] = true;
                currentPermutation[index] = distinctElements[i];
                yield* generate(index + 1);
                used[i] = false;
            }
        }
    }

    yield* generate(0);
}
