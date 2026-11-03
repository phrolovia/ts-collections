const BITS = 5;
const WIDTH = 1 << BITS;
const MASK = WIDTH - 1;

type VectorNode = Array<unknown>;

/**
 * Persistent bit-partitioned vector trie. `push` and `set` copy only the path to the
 * affected leaf, so both run in O(log32 n) and every previous version stays valid.
 */
export class PersistentVector<TElement> {
    static readonly #empty = new PersistentVector<never>(0, 0, []);

    readonly #root: VectorNode;
    readonly #shift: number;
    readonly #size: number;

    private constructor(size: number, shift: number, root: VectorNode) {
        this.#size = size;
        this.#shift = shift;
        this.#root = root;
    }

    public static empty<TElement>(): PersistentVector<TElement> {
        return PersistentVector.#empty;
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (let start = 0; start < this.#size; start += WIDTH) {
            const leaf = this.#leafFor(start);
            const end = Math.min(WIDTH, this.#size - start);
            for (let index = 0; index < end; ++index) {
                yield leaf[index] as TElement;
            }
        }
    }

    public get(index: number): TElement {
        return this.#leafFor(index)[index & MASK] as TElement;
    }

    public push(element: TElement): PersistentVector<TElement> {
        if (this.#size === 1 << (this.#shift + BITS)) {
            const root = [this.#root, PersistentVector.#newPath(this.#shift, element)];
            return new PersistentVector(this.#size + 1, this.#shift + BITS, root);
        }
        return new PersistentVector(this.#size + 1, this.#shift, PersistentVector.#pushInto(this.#root, this.#shift, this.#size, element));
    }

    public set(index: number, element: TElement): PersistentVector<TElement> {
        return new PersistentVector(this.#size, this.#shift, PersistentVector.#setIn(this.#root, this.#shift, index, element));
    }

    static #newPath(level: number, element: unknown): VectorNode {
        return level === 0 ? [element] : [PersistentVector.#newPath(level - BITS, element)];
    }

    static #pushInto(node: VectorNode, level: number, index: number, element: unknown): VectorNode {
        const copy = node.slice();
        if (level === 0) {
            copy[index & MASK] = element;
            return copy;
        }
        const slot = (index >>> level) & MASK;
        const child = node[slot] as VectorNode | undefined;
        copy[slot] = child === undefined
            ? PersistentVector.#newPath(level - BITS, element)
            : PersistentVector.#pushInto(child, level - BITS, index, element);
        return copy;
    }

    static #setIn(node: VectorNode, level: number, index: number, element: unknown): VectorNode {
        const copy = node.slice();
        if (level === 0) {
            copy[index & MASK] = element;
        } else {
            const slot = (index >>> level) & MASK;
            copy[slot] = PersistentVector.#setIn(node[slot] as VectorNode, level - BITS, index, element);
        }
        return copy;
    }

    #leafFor(index: number): VectorNode {
        let node = this.#root;
        for (let level = this.#shift; level > 0; level -= BITS) {
            node = node[(index >>> level) & MASK] as VectorNode;
        }
        return node;
    }

    public get size(): number {
        return this.#size;
    }
}
