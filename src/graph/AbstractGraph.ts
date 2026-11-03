import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import { Enumerator } from "../enumerator/Enumerator";
import type { IEnumerable } from "../enumerator/IEnumerable";
import { breadthFirst } from "./functions/breadthFirst";
import { depthFirst } from "./functions/depthFirst";
import { shortestPath } from "./functions/shortestPath";
import type { GraphEdge } from "./GraphEdge";
import type { GraphPath } from "./GraphPath";
import type { IGraph } from "./IGraph";

/**
 * Stores a graph as a map from each node to a map of the nodes it has edges to and the edges' values.
 * Nodes are hashed like the keys of a Map, so equal primitives are the same node and objects are
 * compared by reference.
 */
export abstract class AbstractGraph<TNode, TEdge = undefined> extends AbstractEnumerable<TNode> implements IGraph<TNode, TEdge> {
    protected readonly adjacency: Map<TNode, Map<TNode, TEdge>> = new Map<TNode, Map<TNode, TEdge>>();
    protected edgeTotal: number = 0;

    protected constructor() {
        super();
    }

    [Symbol.iterator](): Iterator<TNode> {
        return this.adjacency.keys();
    }

    public addNode(node: TNode): boolean {
        if (this.adjacency.has(node)) {
            return false;
        }
        this.adjacency.set(node, new Map<TNode, TEdge>());
        this.onNodeAdded(node);
        return true;
    }

    public breadthFirst(start: TNode): IEnumerable<TNode> {
        return breadthFirst(start, node => this.adjacency.get(node)?.keys() ?? []);
    }

    public clear(): void {
        this.adjacency.clear();
        this.edgeTotal = 0;
    }

    public containsEdge(source: TNode, target: TNode): boolean {
        return this.adjacency.get(source)?.has(target) ?? false;
    }

    public containsNode(node: TNode): boolean {
        return this.adjacency.has(node);
    }

    public depthFirst(start: TNode): IEnumerable<TNode> {
        return depthFirst(start, node => this.adjacency.get(node)?.keys() ?? []);
    }

    public edgeCount(): number {
        return this.edgeTotal;
    }

    public getEdge(source: TNode, target: TNode): TEdge | null {
        const edges = this.adjacency.get(source);
        return edges != null && edges.has(target) ? edges.get(target) as TEdge : null;
    }

    public neighbours(node: TNode): IEnumerable<TNode> {
        return new Enumerator(() => this.adjacency.get(node)?.keys() ?? []);
    }

    public nodeCount(): number {
        return this.adjacency.size;
    }

    public nodes(): IEnumerable<TNode> {
        return new Enumerator(() => this.adjacency.keys());
    }

    public shortestPath(start: TNode, goal: TNode, weight?: (value: TEdge, source: TNode, target: TNode) => number): GraphPath<TNode> | null {
        const neighbours = (node: TNode): Iterable<TNode> => this.adjacency.get(node)?.keys() ?? [];
        if (weight == null) {
            return shortestPath(start, goal, neighbours);
        }
        return shortestPath(start, goal, neighbours, (source, target) => weight(this.getEdge(source, target) as TEdge, source, target));
    }

    // Returns the edges of a node, adding the node if it is not in the graph yet.
    protected edgesOf(node: TNode): Map<TNode, TEdge> {
        this.addNode(node);
        return this.adjacency.get(node) as Map<TNode, TEdge>;
    }

    // Lets a subclass keep its own per-node state in step with the adjacency map.
    protected onNodeAdded(_node: TNode): void {
    }

    abstract addEdge(source: TNode, target: TNode, value?: TEdge): boolean;

    abstract edges(): IEnumerable<GraphEdge<TNode, TEdge>>;

    abstract removeEdge(source: TNode, target: TNode): boolean;

    abstract removeNode(node: TNode): boolean;
}
