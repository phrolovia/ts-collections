import { Enumerator } from "../enumerator/Enumerator";
import type { IEnumerable } from "../enumerator/IEnumerable";
import { AbstractGraph } from "./AbstractGraph";
import type { GraphEdge } from "./GraphEdge";

/**
 * A graph whose edges connect both ways: an edge between two nodes can be followed from either end,
 * and the order of the two nodes passed to a method does not matter. Each edge can carry a value,
 * such as a weight or a label.
 * @template TNode The type of the nodes. Nodes are hashed like the keys of a Map.
 * @template TEdge The type of the values stored on the edges.
 */
export class UndirectedGraph<TNode, TEdge = undefined> extends AbstractGraph<TNode, TEdge> {
    /**
     * Creates an undirected graph.
     * @param edges Optional edges to add, each as a [node, node] or [node, node, value] tuple.
     */
    public constructor(edges: Iterable<readonly [TNode, TNode] | readonly [TNode, TNode, TEdge]> = []) {
        super();
        for (const edge of edges) {
            this.addEdge(edge[0], edge[1], edge[2] as TEdge);
        }
    }

    public addEdge(source: TNode, target: TNode, value?: TEdge): boolean {
        const edges = this.edgesOf(source);
        const added = !edges.has(target);
        edges.set(target, value as TEdge);
        this.edgesOf(target).set(source, value as TEdge);
        if (added) {
            ++this.edgeTotal;
        }
        return added;
    }

    /**
     * Returns a deferred sequence of the connected components of the graph: the largest groups of
     * nodes that are connected to each other by some path.
     * @returns {IEnumerable<TNode[]>} Every component once, as an array of its nodes in breadth-first order. Components are ordered by their first added node.
     */
    public connectedComponents(): IEnumerable<TNode[]> {
        const adjacency = this.adjacency;
        const reachable = (node: TNode): TNode[] => this.breadthFirst(node).toArray();
        return new Enumerator(function* (): IterableIterator<TNode[]> {
            const visited = new Set<TNode>();
            for (const node of adjacency.keys()) {
                if (visited.has(node)) {
                    continue;
                }
                const component = reachable(node);
                for (const member of component) {
                    visited.add(member);
                }
                yield component;
            }
        });
    }

    /**
     * Returns the number of edges that touch a node. A self-loop counts once.
     * @param node The node whose edges are counted.
     * @returns {number} The number of edges touching the node, or 0 if it is not in the graph.
     */
    public degree(node: TNode): number {
        return this.adjacency.get(node)?.size ?? 0;
    }

    public edges(): IEnumerable<GraphEdge<TNode, TEdge>> {
        const adjacency = this.adjacency;
        return new Enumerator(function* (): IterableIterator<GraphEdge<TNode, TEdge>> {
            // Each edge is stored at both ends, so it is yielded from the end that comes first.
            const passed = new Set<TNode>();
            for (const [source, edges] of adjacency) {
                for (const [target, value] of edges) {
                    if (!passed.has(target)) {
                        yield { source, target, value };
                    }
                }
                passed.add(source);
            }
        });
    }

    public removeEdge(source: TNode, target: TNode): boolean {
        if (!this.adjacency.get(source)?.delete(target)) {
            return false;
        }
        this.adjacency.get(target)?.delete(source);
        --this.edgeTotal;
        return true;
    }

    public removeNode(node: TNode): boolean {
        const edges = this.adjacency.get(node);
        if (edges == null) {
            return false;
        }
        this.edgeTotal -= edges.size;
        for (const neighbour of edges.keys()) {
            this.adjacency.get(neighbour)?.delete(node);
        }
        this.adjacency.delete(node);
        return true;
    }
}
