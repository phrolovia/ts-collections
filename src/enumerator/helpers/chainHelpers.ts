import { Enumerator } from "../Enumerator";
import type { IEnumerable } from "../IEnumerable";

// A persistent list of the parts that append, concat and prepend added around a base sequence.
type ChainPart<TElement> = { readonly next: ChainPart<TElement> | null; readonly part: Iterable<TElement> } | null;

type Chain<TElement> = {
    readonly back: ChainPart<TElement>;
    readonly base: Iterable<TElement>;
    readonly front: ChainPart<TElement>;
};

// An enumerator that this module returned keeps its chain, so that joining onto it extends the same chain.
const chainOf = <TElement>(source: Iterable<TElement>): Chain<TElement> =>
    (source instanceof Enumerator ? source.chain as Chain<TElement> | undefined : undefined)
    ?? { back: null, base: source, front: null };

function* chainGenerator<TElement>(chain: Chain<TElement>): IterableIterator<TElement> {
    for (let front = chain.front; front !== null; front = front.next) {
        yield* front.part;
    }
    yield* chain.base;
    const back: Array<Iterable<TElement>> = [];
    for (let part = chain.back; part !== null; part = part.next) {
        back.push(part.part);
    }
    for (let index = back.length - 1; index >= 0; --index) {
        yield* back[index];
    }
}

// Joining parts one generator at a time nests a frame per call, which overflows the stack for
// long chains; keeping the parts in one chain visits each element through a single generator.
const chained = <TElement>(chain: Chain<TElement>): IEnumerable<TElement> => {
    const enumerator = new Enumerator<TElement>(() => chainGenerator(chain));
    enumerator.chain = chain;
    return enumerator;
};

export const addToBack = <TElement>(source: Iterable<TElement>, part: Iterable<TElement>): IEnumerable<TElement> => {
    const chain = chainOf(source);
    return chained({ ...chain, back: { next: chain.back, part } });
};

export const addToFront = <TElement>(source: Iterable<TElement>, part: Iterable<TElement>): IEnumerable<TElement> => {
    const chain = chainOf(source);
    return chained({ ...chain, front: { next: chain.front, part } });
};
