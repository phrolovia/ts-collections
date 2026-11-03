import { sameValueZero } from "./hashKey";

const BITS = 5;
const MASK = (1 << BITS) - 1;

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
        public readonly entries: ReadonlyArray<TrieEntry<TKey, TValue>>
    ) {
    }
}

/**
 * Branch node of the hash array mapped trie. `bitmap` marks which of the 32 slots for this
 * level are occupied and `children` holds only the occupied slots, in slot order.
 */
export class BitmapNode<TKey, TValue> {
    public constructor(
        public readonly bitmap: number,
        public readonly children: ReadonlyArray<TrieNode<TKey, TValue>>
    ) {
    }
}

export type TrieNode<TKey, TValue> = BitmapNode<TKey, TValue> | CollisionNode<TKey, TValue> | TrieEntry<TKey, TValue>;

const EMPTY_ROOT = new BitmapNode<never, never>(0, []);

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
        return node.hash === hash && sameValueZero(node.key, key) ? node : undefined;
    }
    if (node.hash !== hash) {
        return undefined;
    }
    return node.entries.find(e => sameValueZero(e.key, key));
};

/**
 * Returns a new root that contains the entry, replacing any entry with the same key.
 * Only the nodes on the path to the entry are copied.
 */
export const insert = <TKey, TValue>(root: BitmapNode<TKey, TValue>, entry: TrieEntry<TKey, TValue>): BitmapNode<TKey, TValue> => {
    return insertInto(root, entry, 0) as BitmapNode<TKey, TValue>;
};

/**
 * Returns a new root without the entry for the key. Returns the same root if the key is absent.
 */
export const remove = <TKey, TValue>(root: BitmapNode<TKey, TValue>, hash: number, key: TKey): BitmapNode<TKey, TValue> => {
    const result = removeFrom(root, hash, key, 0);
    return (result ?? EMPTY_ROOT) as BitmapNode<TKey, TValue>;
};

const insertInto = <TKey, TValue>(node: TrieNode<TKey, TValue>, entry: TrieEntry<TKey, TValue>, shift: number): TrieNode<TKey, TValue> => {
    if (node instanceof BitmapNode) {
        const bit = 1 << ((entry.hash >>> shift) & MASK);
        const position = popCount(node.bitmap & (bit - 1));
        if ((node.bitmap & bit) === 0) {
            const children = node.children.slice();
            children.splice(position, 0, entry);
            return new BitmapNode(node.bitmap | bit, children);
        }
        const children = node.children.slice();
        children[position] = insertInto(node.children[position], entry, shift + BITS);
        return new BitmapNode(node.bitmap, children);
    }
    if (node.hash !== entry.hash) {
        return branch(node, entry, shift);
    }
    if (node instanceof TrieEntry) {
        return sameValueZero(node.key, entry.key) ? entry : new CollisionNode(entry.hash, [node, entry]);
    }
    const position = node.entries.findIndex(e => sameValueZero(e.key, entry.key));
    const entries = node.entries.slice();
    if (position === -1) {
        entries.push(entry);
    } else {
        entries[position] = entry;
    }
    return new CollisionNode(node.hash, entries);
};

// Builds the smallest subtree holding two leaves whose hashes differ.
// The hashes must differ in some bit, so their 5-bit fragments diverge by shift 30 at the latest.
const branch = <TKey, TValue>(
    existing: TrieEntry<TKey, TValue> | CollisionNode<TKey, TValue>,
    entry: TrieEntry<TKey, TValue>,
    shift: number
): BitmapNode<TKey, TValue> => {
    const existingFragment = (existing.hash >>> shift) & MASK;
    const entryFragment = (entry.hash >>> shift) & MASK;
    if (existingFragment === entryFragment) {
        return new BitmapNode(1 << existingFragment, [branch(existing, entry, shift + BITS)]);
    }
    const children = existingFragment < entryFragment ? [existing, entry] : [entry, existing];
    return new BitmapNode((1 << existingFragment) | (1 << entryFragment), children);
};

// Returns the same node when the key is absent and undefined when the node becomes empty.
// Below the root, a branch left with a single leaf collapses into that leaf so the trie stays shallow.
const removeFrom = <TKey, TValue>(node: TrieNode<TKey, TValue>, hash: number, key: TKey, shift: number): TrieNode<TKey, TValue> | undefined => {
    if (node instanceof TrieEntry) {
        return node.hash === hash && sameValueZero(node.key, key) ? undefined : node;
    }
    if (node instanceof CollisionNode) {
        if (node.hash !== hash) {
            return node;
        }
        const position = node.entries.findIndex(e => sameValueZero(e.key, key));
        if (position === -1) {
            return node;
        }
        if (node.entries.length === 2) {
            return node.entries[1 - position];
        }
        const entries = node.entries.slice();
        entries.splice(position, 1);
        return new CollisionNode(node.hash, entries);
    }

    const bit = 1 << ((hash >>> shift) & MASK);
    if ((node.bitmap & bit) === 0) {
        return node;
    }
    const position = popCount(node.bitmap & (bit - 1));
    const child = node.children[position];
    const newChild = removeFrom(child, hash, key, shift + BITS);
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
        const children = node.children.slice();
        children.splice(position, 1);
        return new BitmapNode(node.bitmap ^ bit, children);
    }
    if (shift > 0 && node.children.length === 1 && !(newChild instanceof BitmapNode)) {
        return newChild;
    }
    const children = node.children.slice();
    children[position] = newChild;
    return new BitmapNode(node.bitmap, children);
};

const popCount = (value: number): number => {
    value -= (value >>> 1) & 0x55555555;
    value = (value & 0x33333333) + ((value >>> 2) & 0x33333333);
    value = (value + (value >>> 4)) & 0x0f0f0f0f;
    return Math.imul(value, 0x01010101) >>> 24;
};
