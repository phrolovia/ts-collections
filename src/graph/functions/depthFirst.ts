import { Enumerator } from "../../enumerator/Enumerator";
import type { IEnumerable } from "../../enumerator/IEnumerable";
import type { Selector } from "../../shared/Selector";
import { nodeKey } from "../helpers/nodeKey";

/**
 * Returns a deferred sequence of the nodes reachable from a start node, in depth-first order.
 * @template TNode The type of the nodes.
 * @param start The node the traversal starts from. It is the first element of the sequence.
 * @param neighbours Returns the nodes that a node has edges to.
 * @param keySelector Optional selector that returns the key a node is identified by. Use it when equal nodes are different objects, such as coordinate pairs. Without it, nodes are compared with Object.is semantics.
 * @returns {IEnumerable<TNode>} The reachable nodes, each yielded once, in the order a recursive depth-first search visits them (pre-order).
 * @remarks The traversal is iterative, so deep graphs do not overflow the call stack. Neighbours are read lazily, one at a time, and the graph is explored only as far as the sequence is enumerated.
 * @example
 * ```typescript
 * const edges = new Map([[1, [2, 3]], [2, [4]], [3, []], [4, []]]);
 * const order = depthFirst(1, n => edges.get(n) ?? []).toArray();
 * console.log(order); // [1, 2, 4, 3]
 * ```
 */
export const depthFirst = <TNode>(start: TNode, neighbours: Selector<TNode, Iterable<TNode>>, keySelector?: Selector<TNode, unknown>): IEnumerable<TNode> => {
    return new Enumerator(() => depthFirstGenerator(start, neighbours, nodeKey(keySelector)));
};

function* depthFirstGenerator<TNode>(start: TNode, neighbours: Selector<TNode, Iterable<TNode>>, keyOf: (node: TNode) => unknown): IterableIterator<TNode> {
    const visited = new Set<unknown>([keyOf(start)]);
    yield start;
    const pending: Iterator<TNode>[] = [neighbours(start)[Symbol.iterator]()];
    while (pending.length > 0) {
        const next = pending[pending.length - 1].next();
        if (next.done) {
            pending.pop();
            continue;
        }
        const key = keyOf(next.value);
        if (visited.has(key)) {
            continue;
        }
        visited.add(key);
        yield next.value;
        pending.push(neighbours(next.value)[Symbol.iterator]());
    }
}
