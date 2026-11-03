import { Enumerator } from "../enumerator/Enumerator";
import type { IEnumerable } from "../enumerator/IEnumerable";
import { CycleDetectedException } from "../shared/CycleDetectedException";
import { AbstractGraph } from "./AbstractGraph";
import { stronglyConnectedComponents } from "./functions/stronglyConnectedComponents";
import { topologicalSort } from "./functions/topologicalSort";
import type { GraphEdge } from "./GraphEdge";

/**
 * A graph whose edges have a direction: an edge from a source to a target does not connect the
 * target back to the source. Each edge can carry a value, such as a weight or a label.
 * @template TNode The type of the nodes. Nodes are hashed like the keys of a Map.
 * @template TEdge The type of the values stored on the edges.
 */
export class DirectedGraph<TNode, TEdge = undefined> extends AbstractGraph<TNode, TEdge> {
    readonly #incoming: Map<TNode, Set<TNode>> = new Map<TNode, Set<TNode>>();

    /**
     * Creates a directed graph.
     * @param edges Optional edges to add, each as a [source, target] or [source, target, value] tuple.
     */
    public constructor(edges: Iterable<readonly [TNode, TNode] | readonly [TNode, TNode, TEdge]> = []) {
        super();
        for (const edge of edges) {
            this.addEdge(edge[0], edge[1], edge[2] as TEdge);
        }
    }

    public addEdge(source: TNode, target: TNode, value?: TEdge): boolean {
        const edges = this.edgesOf(source);
        this.addNode(target);
        const added = !edges.has(target);
        edges.set(target, value as TEdge);
        if (added) {
            (this.#incoming.get(target) as Set<TNode>).add(source);
            ++this.edgeTotal;
        }
        return added;
    }

    public override clear(): void {
        super.clear();
        this.#incoming.clear();
    }

    public edges(): IEnumerable<GraphEdge<TNode, TEdge>> {
        const adjacency = this.adjacency;
        return new Enumerator(function* (): IterableIterator<GraphEdge<TNode, TEdge>> {
            for (const [source, edges] of adjacency) {
                for (const [target, value] of edges) {
                    yield { source, target, value };
                }
            }
        });
    }

    /**
     * Finds a cycle in the graph.
     * @returns {TNode[] | null} The nodes of one cycle, following its edges and starting and ending with the same node, or null if the graph has no cycle.
     */
    public findCycle(): TNode[] | null {
        try {
            this.topologicalSort().toArray();
            return null;
        } catch (error) {
            if (error instanceof CycleDetectedException) {
                // The sort follows edges backwards, from each node to its predecessors.
                return [...(error as CycleDetectedException<TNode>).cycle].reverse();
            }
            throw error;
        }
    }

    /**
     * Checks whether the graph has a cycle.
     * @returns {boolean} true if some node can reach itself by following edges.
     */
    public hasCycle(): boolean {
        return this.findCycle() != null;
    }

    /**
     * Returns the number of edges that lead to a node.
     * @param node The node whose incoming edges are counted.
     * @returns {number} The number of edges ending at the node, or 0 if it is not in the graph.
     */
    public inDegree(node: TNode): number {
        return this.#incoming.get(node)?.size ?? 0;
    }

    /**
     * Returns the number of edges that start from a node.
     * @param node The node whose outgoing edges are counted.
     * @returns {number} The number of edges starting at the node, or 0 if it is not in the graph.
     */
    public outDegree(node: TNode): number {
        return this.adjacency.get(node)?.size ?? 0;
    }

    /**
     * Returns a deferred sequence of the nodes that have an edge to a node.
     * @param node The node whose predecessors are returned.
     * @returns {IEnumerable<TNode>} The predecessors, or an empty sequence if the node is not in the graph.
     */
    public predecessors(node: TNode): IEnumerable<TNode> {
        return new Enumerator(() => this.#incoming.get(node) ?? []);
    }

    public removeEdge(source: TNode, target: TNode): boolean {
        if (!this.adjacency.get(source)?.delete(target)) {
            return false;
        }
        (this.#incoming.get(target) as Set<TNode>).delete(source);
        --this.edgeTotal;
        return true;
    }

    public removeNode(node: TNode): boolean {
        const outgoing = this.adjacency.get(node);
        if (outgoing == null) {
            return false;
        }
        for (const target of outgoing.keys()) {
            this.#incoming.get(target)?.delete(node);
        }
        this.edgeTotal -= outgoing.size;
        for (const source of this.#incoming.get(node) as Set<TNode>) {
            // A self-loop was already counted among the outgoing edges.
            if (this.adjacency.get(source)?.delete(node) && source !== node) {
                --this.edgeTotal;
            }
        }
        this.adjacency.delete(node);
        this.#incoming.delete(node);
        return true;
    }

    /**
     * Returns a deferred sequence of the strongly connected components of the graph: the largest
     * groups of nodes in which every node can reach every other.
     * @returns {IEnumerable<TNode[]>} Every component once. A component comes before every component that has an edge into it.
     */
    public stronglyConnectedComponents(): IEnumerable<TNode[]> {
        return stronglyConnectedComponents(this.adjacency.keys(), node => this.adjacency.get(node)?.keys() ?? []);
    }

    /**
     * Returns a deferred sequence of the nodes ordered so that every edge leads from an earlier node to a later one.
     * @returns {IEnumerable<TNode>} Every node once. Nodes that do not depend on each other keep the order they were added in.
     * @throws {CycleDetectedException} If the graph has a cycle, when the sequence is enumerated.
     */
    public topologicalSort(): IEnumerable<TNode> {
        return topologicalSort(this.adjacency.keys(), node => this.#incoming.get(node) ?? []);
    }

    protected override onNodeAdded(node: TNode): void {
        this.#incoming.set(node, new Set<TNode>());
    }
}
