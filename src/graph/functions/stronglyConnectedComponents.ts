import { Enumerator } from "../../enumerator/Enumerator";
import type { IEnumerable } from "../../enumerator/IEnumerable";
import type { Selector } from "../../shared/Selector";
import { nodeKey } from "../helpers/nodeKey";

type Frame<TNode> = {
    readonly key: unknown;
    readonly neighbours: Iterator<TNode>;
};

/**
 * Returns a deferred sequence of the strongly connected components of a directed graph: the largest
 * groups of nodes in which every node can reach every other.
 * @template TNode The type of the nodes.
 * @param nodes The nodes of the graph. Nodes reachable from them are included as well.
 * @param neighbours Returns the nodes that a node has edges to.
 * @param keySelector Optional selector that returns the key a node is identified by. Without it, nodes are compared with Object.is semantics.
 * @returns {IEnumerable<TNode[]>} Every component once, as an array of its nodes. A node on no cycle forms a component of its own.
 * @remarks Uses Tarjan's algorithm, which runs in O(V + E) time and is iterative here, so deep graphs do not overflow the call stack. Components are yielded in reverse topological order: a component comes before every component that has an edge into it. The components are computed when enumeration starts.
 * @example
 * ```typescript
 * const edges = new Map([[1, [2]], [2, [1, 3]], [3, []]]);
 * const components = stronglyConnectedComponents([1, 2, 3], n => edges.get(n) ?? []).toArray();
 * console.log(components); // [[3], [1, 2]]
 * ```
 */
export const stronglyConnectedComponents = <TNode>(nodes: Iterable<TNode>, neighbours: Selector<TNode, Iterable<TNode>>, keySelector?: Selector<TNode, unknown>): IEnumerable<TNode[]> => {
    return new Enumerator(() => findComponents(nodes, neighbours, nodeKey(keySelector)));
};

const findComponents = <TNode>(nodes: Iterable<TNode>, neighbours: Selector<TNode, Iterable<TNode>>, keyOf: (node: TNode) => unknown): TNode[][] => {
    const indexes = new Map<unknown, number>();
    const lowLinks = new Map<unknown, number>();
    // Nodes not yet assigned to a component, with each one's position in that stack.
    const stack: TNode[] = [];
    const stackPositions = new Map<unknown, number>();
    const components: TNode[][] = [];
    const frames: Frame<TNode>[] = [];
    const visit = (node: TNode, key: unknown): void => {
        indexes.set(key, indexes.size);
        lowLinks.set(key, indexes.size - 1);
        stackPositions.set(key, stack.length);
        stack.push(node);
        frames.push({ key, neighbours: neighbours(node)[Symbol.iterator]() });
    };
    for (const root of nodes) {
        const rootKey = keyOf(root);
        if (indexes.has(rootKey)) {
            continue;
        }
        visit(root, rootKey);
        while (frames.length > 0) {
            const frame = frames[frames.length - 1];
            const next = frame.neighbours.next();
            if (!next.done) {
                const key = keyOf(next.value);
                if (!indexes.has(key)) {
                    visit(next.value, key);
                } else if (stackPositions.has(key)) {
                    lowLinks.set(frame.key, Math.min(lowLinks.get(frame.key) as number, indexes.get(key) as number));
                }
                continue;
            }
            frames.pop();
            const lowLink = lowLinks.get(frame.key) as number;
            if (frames.length > 0) {
                const parentKey = frames[frames.length - 1].key;
                lowLinks.set(parentKey, Math.min(lowLinks.get(parentKey) as number, lowLink));
            }
            if (lowLink === indexes.get(frame.key)) {
                const component = stack.splice(stackPositions.get(frame.key) as number);
                for (const member of component) {
                    stackPositions.delete(keyOf(member));
                }
                components.push(component);
            }
        }
    }
    return components;
};
