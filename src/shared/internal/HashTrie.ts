import { sameValueZero } from "./hashKey";

const BITS = 5;
const MASK = (1 << BITS) - 1;

/**
 * Edit token of a trie being built in place. Nodes created under a token may be mutated by
 * later edits that pass the same token; every other node is copied before it changes.
 */
export type TrieOwner = object;

/**
 * A leaf of the trie. Entries are immutable and may be shared between trie versions.
 * `index` is the entry's slot in the insertion-order vector of {@link OrderedHashTrie}.
 */
export class TrieEntry<TKey, TValue> {
    public constructor(
        public readonly hash: number,
        public readonly key: TKey,
        public readonly value: TValue,
        public readonly index: number
    ) {
    }
}

/**
 * Holds entries whose keys have the same full 32-bit hash.
 */
export class CollisionNode<TKey, TValue> {
    public constructor(
        public readonly hash: number,
        public entries: Array<TrieEntry<TKey, TValue>>,
        public readonly owner: TrieOwner | undefined
    ) {
    }
}

/**
 * Branch node of the hash array mapped trie. `bitmap` marks which of the 32 slots for this
 * level are occupied and `children` holds only the occupied slots, in slot order.
 */
export class BitmapNode<TKey, TValue> {
    public constructor(
        public bitmap: number,
        public children: Array<TrieNode<TKey, TValue>>,
        public readonly owner: TrieOwner | undefined
    ) {
    }
}

export type TrieNode<TKey, TValue> = BitmapNode<TKey, TValue> | CollisionNode<TKey, TValue> | TrieEntry<TKey, TValue>;

/**
 * Describes what the last {@link upsert} or {@link remove} call did. Reusing one object
 * avoids allocating a result per call; read it right after the call that filled it.
 */
export interface TrieChange {
    /** The entry that was added or that replaced `previous`; undefined if nothing changed. */
    entry: TrieEntry<unknown, unknown> | undefined;
    /** The entry that was replaced or removed, if any. */
    previous: TrieEntry<unknown, unknown> | undefined;
}

export const lastChange: TrieChange = { entry: undefined, previous: undefined };

const EMPTY_ROOT = /* @__PURE__ */ new BitmapNode<never, never>(0, [], undefined);

export const emptyRoot = <TKey, TValue>(): BitmapNode<TKey, TValue> => EMPTY_ROOT;

/**
 * Finds the entry for a key, or `undefined` if the trie does not contain it.
 */
export const find = <TKey, TValue>(root: BitmapNode<TKey, TValue>, hash: number, key: TKey): TrieEntry<TKey, TValue> | undefined => {
    let node: TrieNode<TKey, TValue> = root;
    let shift = 0;
    while (node instanceof BitmapNode) {
        const bit = 1 << ((hash >>> shift) & MASK);
        if ((node.bitmap & bit) === 0) {
            return undefined;
        }
        node = node.children[popCount(node.bitmap & (bit - 1))];
        shift += BITS;
    }
    if (node instanceof TrieEntry) {
        return node.hash === hash && (node.key === key || sameValueZero(node.key, key)) ? node : undefined;
    }
    if (node.hash !== hash) {
        return undefined;
    }
    return node.entries.find(e => sameValueZero(e.key, key));
};

/**
 * Maps the key to the value in a single pass and reports the outcome in {@link lastChange}.
 * A new key gets `index`; an existing key keeps its index. Returns the same root, with
 * `lastChange.entry` undefined, if the key is already mapped to that exact value.
 * Only nodes on the path to the key are copied, or mutated when they belong to `owner`.
 */
export const upsert = <TKey, TValue>(
    root: BitmapNode<TKey, TValue>,
    hash: number,
    key: TKey,
    value: TValue,
    index: number,
    owner?: TrieOwner
): BitmapNode<TKey, TValue> => {
    lastChange.entry = undefined;
    lastChange.previous = undefined;
    return upsertInto(root, hash, key, value, index, owner, 0) as BitmapNode<TKey, TValue>;
};

/**
 * Removes the key in a single pass and reports the removed entry in `lastChange.previous`.
 * Returns the same root, with `lastChange.previous` undefined, if the key is absent.
 */
export const remove = <TKey, TValue>(root: BitmapNode<TKey, TValue>, hash: number, key: TKey, owner?: TrieOwner): BitmapNode<TKey, TValue> => {
    lastChange.entry = undefined;
    lastChange.previous = undefined;
    const result = removeFrom(root, hash, key, owner, 0);
    return (result ?? (owner === undefined ? EMPTY_ROOT : new BitmapNode(0, [], owner))) as BitmapNode<TKey, TValue>;
};

const createEntry = <TKey, TValue>(hash: number, key: TKey, value: TValue, index: number, previous?: TrieEntry<TKey, TValue>): TrieEntry<TKey, TValue> => {
    const entry = new TrieEntry(hash, key, value, previous?.index ?? index);
    lastChange.entry = entry;
    lastChange.previous = previous;
    return entry;
};

const upsertInto = <TKey, TValue>(
    node: TrieNode<TKey, TValue>,
    hash: number,
    key: TKey,
    value: TValue,
    index: number,
    owner: TrieOwner | undefined,
    shift: number
): TrieNode<TKey, TValue> => {
    if (node instanceof BitmapNode) {
        const bit = 1 << ((hash >>> shift) & MASK);
        const position = popCount(node.bitmap & (bit - 1));
        if ((node.bitmap & bit) === 0) {
            const entry = createEntry(hash, key, value, index);
            const target = editable(node, owner);
            target.children.splice(position, 0, entry);
            target.bitmap |= bit;
            return target;
        }
        const child = node.children[position];
        const newChild = upsertInto(child, hash, key, value, index, owner, shift + BITS);
        if (newChild === child) {
            return node;
        }
        const target = editable(node, owner);
        target.children[position] = newChild;
        return target;
    }
    if (node.hash !== hash) {
        return branch(node, createEntry(hash, key, value, index), shift, owner);
    }
    if (node instanceof TrieEntry) {
        if (!sameValueZero(node.key, key)) {
            return new CollisionNode(hash, [node, createEntry(hash, key, value, index)], owner);
        }
        return Object.is(node.value, value) ? node : createEntry(hash, key, value, index, node);
    }
    const position = node.entries.findIndex(e => sameValueZero(e.key, key));
    if (position !== -1 && Object.is(node.entries[position].value, value)) {
        return node;
    }
    const entry = createEntry(hash, key, value, index, position === -1 ? undefined : node.entries[position]);
    const target = node.owner !== undefined && node.owner === owner ? node : new CollisionNode(node.hash, node.entries.slice(), owner);
    if (position === -1) {
        target.entries.push(entry);
    } else {
        target.entries[position] = entry;
    }
    return target;
};

// Builds the smallest subtree holding two leaves whose hashes differ.
// The hashes must differ in some bit, so their 5-bit fragments diverge by shift 30 at the latest.
const branch = <TKey, TValue>(
    existing: TrieEntry<TKey, TValue> | CollisionNode<TKey, TValue>,
    entry: TrieEntry<TKey, TValue>,
    shift: number,
    owner: TrieOwner | undefined
): BitmapNode<TKey, TValue> => {
    const existingFragment = (existing.hash >>> shift) & MASK;
    const entryFragment = (entry.hash >>> shift) & MASK;
    if (existingFragment === entryFragment) {
        return new BitmapNode(1 << existingFragment, [branch(existing, entry, shift + BITS, owner)], owner);
    }
    const children = existingFragment < entryFragment ? [existing, entry] : [entry, existing];
    return new BitmapNode((1 << existingFragment) | (1 << entryFragment), children, owner);
};

// Returns the same node when the key is absent and undefined when the node becomes empty.
// Below the root, a branch left with a single leaf collapses into that leaf so the trie stays shallow.
const removeFrom = <TKey, TValue>(
    node: TrieNode<TKey, TValue>,
    hash: number,
    key: TKey,
    owner: TrieOwner | undefined,
    shift: number
): TrieNode<TKey, TValue> | undefined => {
    if (node instanceof TrieEntry) {
        if (node.hash === hash && sameValueZero(node.key, key)) {
            lastChange.previous = node;
            return undefined;
        }
        return node;
    }
    if (node instanceof CollisionNode) {
        if (node.hash !== hash) {
            return node;
        }
        const position = node.entries.findIndex(e => sameValueZero(e.key, key));
        if (position === -1) {
            return node;
        }
        lastChange.previous = node.entries[position];
        if (node.entries.length === 2) {
            return node.entries[1 - position];
        }
        const target = node.owner !== undefined && node.owner === owner ? node : new CollisionNode(node.hash, node.entries.slice(), owner);
        target.entries.splice(position, 1);
        return target;
    }

    const bit = 1 << ((hash >>> shift) & MASK);
    if ((node.bitmap & bit) === 0) {
        return node;
    }
    const position = popCount(node.bitmap & (bit - 1));
    const child = node.children[position];
    const newChild = removeFrom(child, hash, key, owner, shift + BITS);
    if (newChild === child) {
        return node;
    }
    if (newChild === undefined) {
        if (node.children.length === 1) {
            return undefined;
        }
        if (shift > 0 && node.children.length === 2 && !(node.children[1 - position] instanceof BitmapNode)) {
            return node.children[1 - position];
        }
        const target = editable(node, owner);
        target.children.splice(position, 1);
        target.bitmap ^= bit;
        return target;
    }
    if (shift > 0 && node.children.length === 1 && !(newChild instanceof BitmapNode)) {
        return newChild;
    }
    const target = editable(node, owner);
    target.children[position] = newChild;
    return target;
};

const editable = <TKey, TValue>(node: BitmapNode<TKey, TValue>, owner: TrieOwner | undefined): BitmapNode<TKey, TValue> => {
    return node.owner !== undefined && node.owner === owner ? node : new BitmapNode(node.bitmap, node.children.slice(), owner);
};

const popCount = (value: number): number => {
    value -= (value >>> 1) & 0x55555555;
    value = (value & 0x33333333) + ((value >>> 2) & 0x33333333);
    value = (value + (value >>> 4)) & 0x0f0f0f0f;
    return Math.imul(value, 0x01010101) >>> 24;
};
