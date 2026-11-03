import { Enumerator } from "../../enumerator/Enumerator";
import type { IEnumerable } from "../../enumerator/IEnumerable";
import type { Selector } from "../../shared/Selector";
import { nodeKey } from "../helpers/nodeKey";

/**
 * Returns a deferred sequence of the nodes reachable from a start node, in breadth-first order.
 * @template TNode The type of the nodes.
 * @param start The node the traversal starts from. It is the first element of the sequence.
 * @param neighbours Returns the nodes that a node has edges to.
 * @param keySelector Optional selector that returns the key a node is identified by. Use it when equal nodes are different objects, such as coordinate pairs. Without it, nodes are compared with Object.is semantics.
 * @returns {IEnumerable<TNode>} The reachable nodes, each yielded once, ordered by their distance in edges from {@link start}.
 * @remarks The graph is explored as the sequence is enumerated, so stopping early (for example with `first` or `take`) stops the traversal. {@link neighbours} is called once per yielded node. The graph may be infinite as long as enumeration stops.
 * @example
 * ```typescript
 * const edges = new Map([[1, [2, 3]], [2, [4]], [3, [4]], [4, []]]);
 * const order = breadthFirst(1, n => edges.get(n) ?? []).toArray();
 * console.log(order); // [1, 2, 3, 4]
 * ```
 */
export const breadthFirst = <TNode>(start: TNode, neighbours: Selector<TNode, Iterable<TNode>>, keySelector?: Selector<TNode, unknown>): IEnumerable<TNode> => {
    return new Enumerator(() => breadthFirstGenerator(start, neighbours, nodeKey(keySelector)));
};

function* breadthFirstGenerator<TNode>(start: TNode, neighbours: Selector<TNode, Iterable<TNode>>, keyOf: (node: TNode) => unknown): IterableIterator<TNode> {
    const visited = new Set<unknown>([keyOf(start)]);
    let current: TNode[] = [start];
    while (current.length > 0) {
        const next: TNode[] = [];
        for (const node of current) {
            yield node;
            for (const neighbour of neighbours(node)) {
                const key = keyOf(neighbour);
                if (!visited.has(key)) {
                    visited.add(key);
                    next.push(neighbour);
                }
            }
        }
        current = next;
    }
}
