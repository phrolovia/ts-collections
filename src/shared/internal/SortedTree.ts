import type { OrderComparator } from "../OrderComparator";

// Weight-balance parameters from Adams' trees as used by Haskell's Data.Map: a subtree may hold at
// most DELTA times as many nodes as its sibling, and RATIO decides between single and double rotations.
const DELTA = 3;
const RATIO = 2;

/**
 * A node of a persistent weight-balanced binary search tree. Nodes are immutable and shared
 * between tree versions. `size` counts the nodes in the subtree, which keeps the tree balanced
 * and gives O(log n) access by index.
 */
export class TreeNode<TKey, TValue> {
    public constructor(
        public readonly key: TKey,
        public readonly value: TValue,
        public readonly left: Tree<TKey, TValue>,
        public readonly right: Tree<TKey, TValue>,
        public readonly size: number
    ) {
    }
}

export type Tree<TKey, TValue> = TreeNode<TKey, TValue> | null;

/**
 * What the last {@link insert} or {@link remove} found: the node that held the key, if any.
 * Read it right after the call; the next call overwrites it.
 */
export const lastChange: { found: TreeNode<unknown, unknown> | null } = { found: null };

export const sizeOf = (tree: Tree<unknown, unknown>): number => tree === null ? 0 : tree.size;

const node = <TKey, TValue>(key: TKey, value: TValue, left: Tree<TKey, TValue>, right: Tree<TKey, TValue>): TreeNode<TKey, TValue> => {
    return new TreeNode(key, value, left, right, sizeOf(left) + sizeOf(right) + 1);
};

// Rebuilds a node whose subtrees went out of balance by at most one insertion or removal.
const balance = <TKey, TValue>(key: TKey, value: TValue, left: Tree<TKey, TValue>, right: Tree<TKey, TValue>): TreeNode<TKey, TValue> => {
    const leftSize = sizeOf(left);
    const rightSize = sizeOf(right);
    if (leftSize + rightSize <= 1) {
        return node(key, value, left, right);
    }
    if (rightSize > DELTA * leftSize) {
        const { left: inner, right: outer } = right as TreeNode<TKey, TValue>;
        if (sizeOf(inner) < RATIO * sizeOf(outer)) {
            return node(right!.key, right!.value, node(key, value, left, inner), outer);
        }
        const middle = inner as TreeNode<TKey, TValue>;
        return node(middle.key, middle.value, node(key, value, left, middle.left), node(right!.key, right!.value, middle.right, outer));
    }
    if (leftSize > DELTA * rightSize) {
        const { right: inner, left: outer } = left as TreeNode<TKey, TValue>;
        if (sizeOf(inner) < RATIO * sizeOf(outer)) {
            return node(left!.key, left!.value, outer, node(key, value, inner, right));
        }
        const middle = inner as TreeNode<TKey, TValue>;
        return node(middle.key, middle.value, node(left!.key, left!.value, outer, middle.left), node(key, value, middle.right, right));
    }
    return node(key, value, left, right);
};

/**
 * Builds a perfectly balanced tree from entries that are already sorted and free of duplicates.
 */
export const fromSorted = <TKey, TValue>(keys: ReadonlyArray<TKey>, values: ReadonlyArray<TValue>): Tree<TKey, TValue> => {
    const build = (start: number, end: number): Tree<TKey, TValue> => {
        if (start >= end) {
            return null;
        }
        const middle = (start + end) >>> 1;
        return new TreeNode(keys[middle], values[middle], build(start, middle), build(middle + 1, end), end - start);
    };
    return build(0, keys.length);
};

export const find = <TKey, TValue>(tree: Tree<TKey, TValue>, key: TKey, comparator: OrderComparator<TKey>): TreeNode<TKey, TValue> | null => {
    while (tree !== null) {
        const order = comparator(key, tree.key);
        if (order === 0) {
            return tree;
        }
        tree = order < 0 ? tree.left : tree.right;
    }
    return null;
};

/**
 * Returns the node at the given in-order position. The index must be within the tree.
 */
export const at = <TKey, TValue>(tree: Tree<TKey, TValue>, index: number): TreeNode<TKey, TValue> => {
    let current = tree as TreeNode<TKey, TValue>;
    for (;;) {
        const leftSize = sizeOf(current.left);
        if (index === leftSize) {
            return current;
        }
        if (index < leftSize) {
            current = current.left as TreeNode<TKey, TValue>;
        } else {
            index -= leftSize + 1;
            current = current.right as TreeNode<TKey, TValue>;
        }
    }
};

/**
 * Maps the key to the value. If the key is already present, `replace` decides whether its value
 * is updated; either way the existing node is reported in {@link lastChange}. Returns the same
 * tree when nothing changed.
 */
export const insert = <TKey, TValue>(
    tree: Tree<TKey, TValue>,
    key: TKey,
    value: TValue,
    comparator: OrderComparator<TKey>,
    replace: boolean
): TreeNode<TKey, TValue> => {
    lastChange.found = null;
    const visit = (current: Tree<TKey, TValue>): TreeNode<TKey, TValue> => {
        if (current === null) {
            return new TreeNode<TKey, TValue>(key, value, null, null, 1);
        }
        const order = comparator(key, current.key);
        if (order === 0) {
            lastChange.found = current;
            return !replace || Object.is(current.value, value)
                ? current
                : new TreeNode(current.key, value, current.left, current.right, current.size);
        }
        if (order < 0) {
            const left = visit(current.left);
            return left === current.left ? current : balance(current.key, current.value, left, current.right);
        }
        const right = visit(current.right);
        return right === current.right ? current : balance(current.key, current.value, current.left, right);
    };
    return visit(tree);
};

// Removes the leftmost node, which becomes `lastChange.found`.
const removeMin = <TKey, TValue>(tree: TreeNode<TKey, TValue>): Tree<TKey, TValue> => {
    if (tree.left === null) {
        lastChange.found = tree;
        return tree.right;
    }
    return balance(tree.key, tree.value, removeMin(tree.left), tree.right);
};

// Removes the rightmost node, which becomes `lastChange.found`.
const removeMax = <TKey, TValue>(tree: TreeNode<TKey, TValue>): Tree<TKey, TValue> => {
    if (tree.right === null) {
        lastChange.found = tree;
        return tree.left;
    }
    return balance(tree.key, tree.value, tree.left, removeMax(tree.right));
};

// Joins the subtrees of a removed node, promoting a neighbour from the larger side.
const glue = <TKey, TValue>(left: Tree<TKey, TValue>, right: Tree<TKey, TValue>): Tree<TKey, TValue> => {
    if (left === null) {
        return right;
    }
    if (right === null) {
        return left;
    }
    if (left.size > right.size) {
        const rest = removeMax(left);
        const max = lastChange.found as TreeNode<TKey, TValue>;
        return balance(max.key, max.value, rest, right);
    }
    const rest = removeMin(right);
    const min = lastChange.found as TreeNode<TKey, TValue>;
    return balance(min.key, min.value, left, rest);
};

/**
 * Removes the key and reports the removed node in {@link lastChange}. Returns the same tree when
 * the key is absent.
 */
export const remove = <TKey, TValue>(tree: Tree<TKey, TValue>, key: TKey, comparator: OrderComparator<TKey>): Tree<TKey, TValue> => {
    let removed: TreeNode<TKey, TValue> | null = null;
    const visit = (current: Tree<TKey, TValue>): Tree<TKey, TValue> => {
        if (current === null) {
            return null;
        }
        const order = comparator(key, current.key);
        if (order === 0) {
            removed = current;
            return glue(current.left, current.right);
        }
        if (order < 0) {
            const left = visit(current.left);
            return left === current.left ? current : balance(current.key, current.value, left, current.right);
        }
        const right = visit(current.right);
        return right === current.right ? current : balance(current.key, current.value, current.left, right);
    };
    const result = visit(tree);
    lastChange.found = removed;
    return result;
};

/**
 * Yields the nodes in order, starting at the first key that is greater than `from`, or equal to
 * it when `inclusive` is true. Without `from`, iteration starts at the smallest key.
 */
export function* nodes<TKey, TValue>(
    tree: Tree<TKey, TValue>,
    from?: { readonly comparator: OrderComparator<TKey>; readonly inclusive: boolean; readonly key: TKey }
): IterableIterator<TreeNode<TKey, TValue>> {
    const stack: Array<TreeNode<TKey, TValue>> = [];
    // Descend to the start position, keeping the ancestors that still lie ahead on the stack.
    while (tree !== null) {
        const order = from === undefined ? -1 : from.comparator(from.key, tree.key);
        if (order < 0 || (order === 0 && from!.inclusive)) {
            stack.push(tree);
            tree = order === 0 ? null : tree.left;
        } else {
            tree = tree.right;
        }
    }
    while (stack.length > 0) {
        const current = stack.pop() as TreeNode<TKey, TValue>;
        yield current;
        for (let next = current.right; next !== null; next = next.left) {
            stack.push(next);
        }
    }
}
