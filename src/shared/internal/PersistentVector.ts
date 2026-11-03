const BITS = 5;
const WIDTH = 1 << BITS;
const MASK = WIDTH - 1;

type VectorNode = Array<unknown>;

/**
 * Persistent bit-partitioned vector trie. `push` and `set` copy only the path to the
 * affected leaf, so both run in O(log32 n) and every previous version stays valid.
 *
 * {@link asMutable} returns a copy that `push` and `set` modify in place, copying a shared
 * node only the first time it changes. {@link asImmutable} freezes it again.
 */
export class PersistentVector<TElement> implements Iterable<TElement> {
    static readonly #empty = new PersistentVector<never>(0, 0, [], undefined);

    #owned: WeakSet<VectorNode> | undefined;
    #root: VectorNode;
    #shift: number;
    #size: number;

    private constructor(size: number, shift: number, root: VectorNode, owned: WeakSet<VectorNode> | undefined) {
        this.#size = size;
        this.#shift = shift;
        this.#root = root;
        this.#owned = owned;
    }

    public static empty<TElement>(): PersistentVector<TElement> {
        return PersistentVector.#empty;
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (const leaf of this.leaves()) {
            for (let index = 0; index < leaf.length; ++index) {
                yield leaf[index] as TElement;
            }
        }
    }

    /**
     * Freezes a mutable vector and returns it. The vector must not be modified afterward.
     */
    public asImmutable(): PersistentVector<TElement> {
        this.#owned = undefined;
        return this;
    }

    public asMutable(): PersistentVector<TElement> {
        return new PersistentVector(this.#size, this.#shift, this.#root, new WeakSet());
    }

    public get(index: number): TElement {
        return this.#leafFor(index)[index & MASK] as TElement;
    }

    /**
     * Yields the leaf arrays in order. Leaves only hold written slots, so their combined
     * length equals the vector's size.
     */
    public* leaves(): IterableIterator<ReadonlyArray<TElement>> {
        for (let start = 0; start < this.#size; start += WIDTH) {
            yield this.#leafFor(start) as Array<TElement>;
        }
    }

    /**
     * Removes the last element. The vector must not be empty.
     */
    public pop(): PersistentVector<TElement> {
        if (this.#size === 1) {
            return this.#update(0, 0, this.#owned === undefined ? [] : this.#own([]));
        }
        let shift = this.#shift;
        let root = this.#popFrom(this.#root, shift, this.#size - 1) as VectorNode;
        // Drop levels left with a single child so that push's overflow check stays valid.
        while (shift > 0 && root.length === 1) {
            root = root[0] as VectorNode;
            shift -= BITS;
        }
        return this.#update(this.#size - 1, shift, root);
    }

    public push(element: TElement): PersistentVector<TElement> {
        let shift = this.#shift;
        let root: VectorNode;
        if (this.#size === 1 << (shift + BITS)) {
            root = this.#own([this.#root, this.#newPath(shift, element)]);
            shift += BITS;
        } else {
            root = this.#pushInto(this.#root, shift, this.#size, element);
        }
        return this.#update(this.#size + 1, shift, root);
    }

    /**
     * Appends all elements, editing nodes in place when this vector is not mutable already.
     * Returns this vector if the iterable is empty.
     */
    public pushAll(elements: Iterable<TElement>): PersistentVector<TElement> {
        const target = this.#owned === undefined ? this.asMutable() : this;
        for (const element of elements) {
            target.push(element);
        }
        if (target === this) {
            return this;
        }
        return target.#size === this.#size ? this : target.asImmutable();
    }

    public set(index: number, element: TElement): PersistentVector<TElement> {
        return this.#update(this.#size, this.#shift, this.#setIn(this.#root, this.#shift, index, element));
    }

    #editable(node: VectorNode): VectorNode {
        return this.#owned?.has(node) ? node : this.#own(node.slice());
    }

    #leafFor(index: number): VectorNode {
        let node = this.#root;
        for (let level = this.#shift; level > 0; level -= BITS) {
            node = node[(index >>> level) & MASK] as VectorNode;
        }
        return node;
    }

    #newPath(level: number, element: unknown): VectorNode {
        return this.#own(level === 0 ? [element] : [this.#newPath(level - BITS, element)]);
    }

    #own(node: VectorNode): VectorNode {
        this.#owned?.add(node);
        return node;
    }

    // Removes the element at the given (last) index; returns undefined when the node becomes empty.
    #popFrom(node: VectorNode, level: number, index: number): VectorNode | undefined {
        const slot = (index >>> level) & MASK;
        const target = this.#editable(node);
        if (level === 0) {
            target.length = slot;
        } else {
            const child = this.#popFrom(node[slot] as VectorNode, level - BITS, index);
            if (child === undefined) {
                target.length = slot;
            } else {
                target[slot] = child;
            }
        }
        return target.length === 0 ? undefined : target;
    }

    #pushInto(node: VectorNode, level: number, index: number, element: unknown): VectorNode {
        const target = this.#editable(node);
        if (level === 0) {
            target[index & MASK] = element;
            return target;
        }
        const slot = (index >>> level) & MASK;
        const child = node[slot] as VectorNode | undefined;
        target[slot] = child === undefined
            ? this.#newPath(level - BITS, element)
            : this.#pushInto(child, level - BITS, index, element);
        return target;
    }

    #setIn(node: VectorNode, level: number, index: number, element: unknown): VectorNode {
        const target = this.#editable(node);
        if (level === 0) {
            target[index & MASK] = element;
        } else {
            const slot = (index >>> level) & MASK;
            target[slot] = this.#setIn(node[slot] as VectorNode, level - BITS, index, element);
        }
        return target;
    }

    #update(size: number, shift: number, root: VectorNode): PersistentVector<TElement> {
        if (this.#owned === undefined) {
            return new PersistentVector(size, shift, root, undefined);
        }
        this.#size = size;
        this.#shift = shift;
        this.#root = root;
        return this;
    }

    public get size(): number {
        return this.#size;
    }
}
