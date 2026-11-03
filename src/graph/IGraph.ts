import type { IEnumerable } from "../enumerator/IEnumerable";
import type { GraphEdge } from "./GraphEdge";
import type { GraphPath } from "./GraphPath";

export interface IGraph<TNode, TEdge = undefined> extends IEnumerable<TNode> {
    /**
     * Adds an edge between two nodes, adding the nodes if they are not in the graph yet.
     * If the edge already exists, its value is replaced.
     * @param source The node the edge starts from.
     * @param target The node the edge leads to.
     * @param value The value to store on the edge, such as a weight or a label.
     * @returns {boolean} true if the edge is new, false if an existing edge's value was replaced.
     */
    addEdge(source: TNode, target: TNode, value?: TEdge): boolean;

    /**
     * Adds a node without any edges.
     * @param node The node to add.
     * @returns {boolean} true if the node is added, false if it is already in the graph.
     */
    addNode(node: TNode): boolean;

    /**
     * Returns a deferred sequence of the nodes reachable from a start node, in breadth-first order.
     * @param start The node the traversal starts from.
     * @returns {IEnumerable<TNode>} The reachable nodes, each once, ordered by their distance in edges from {@link start}.
     */
    breadthFirst(start: TNode): IEnumerable<TNode>;

    /**
     * Removes every node and edge.
     */
    clear(): void;

    /**
     * Checks whether the graph has an edge between two nodes.
     * @param source The node the edge starts from.
     * @param target The node the edge leads to.
     * @returns {boolean} true if the edge exists.
     */
    containsEdge(source: TNode, target: TNode): boolean;

    /**
     * Checks whether a node is in the graph.
     * @param node The node to look for.
     * @returns {boolean} true if the node is in the graph.
     */
    containsNode(node: TNode): boolean;

    /**
     * Returns a deferred sequence of the nodes reachable from a start node, in depth-first pre-order.
     * @param start The node the traversal starts from.
     * @returns {IEnumerable<TNode>} The reachable nodes, each once, in the order a recursive depth-first search visits them.
     */
    depthFirst(start: TNode): IEnumerable<TNode>;

    /**
     * Returns the number of edges in the graph.
     * @returns {number} The number of edges.
     */
    edgeCount(): number;

    /**
     * Returns a deferred sequence of the edges of the graph.
     * @returns {IEnumerable<GraphEdge<TNode, TEdge>>} Every edge once, with its value.
     */
    edges(): IEnumerable<GraphEdge<TNode, TEdge>>;

    /**
     * Returns the value stored on an edge.
     * @param source The node the edge starts from.
     * @param target The node the edge leads to.
     * @returns {TEdge | null} The edge's value, or null if there is no such edge.
     */
    getEdge(source: TNode, target: TNode): TEdge | null;

    /**
     * Returns a deferred sequence of the nodes that a node has edges to.
     * @param node The node whose neighbours are returned.
     * @returns {IEnumerable<TNode>} The neighbours, or an empty sequence if the node is not in the graph.
     */
    neighbours(node: TNode): IEnumerable<TNode>;

    /**
     * Returns the number of nodes in the graph.
     * @returns {number} The number of nodes.
     */
    nodeCount(): number;

    /**
     * Returns a deferred sequence of the nodes of the graph, in the order they were added.
     * @returns {IEnumerable<TNode>} Every node once.
     */
    nodes(): IEnumerable<TNode>;

    /**
     * Removes the edge between two nodes. The nodes stay in the graph.
     * @param source The node the edge starts from.
     * @param target The node the edge leads to.
     * @returns {boolean} true if the edge is removed, false if there was no such edge.
     */
    removeEdge(source: TNode, target: TNode): boolean;

    /**
     * Removes a node and every edge that touches it.
     * @param node The node to remove.
     * @returns {boolean} true if the node is removed, false if it is not in the graph.
     */
    removeNode(node: TNode): boolean;

    /**
     * Finds the shortest path from a start node to a goal node.
     * @param start The node the path starts from.
     * @param goal The node the path ends at.
     * @param weight Optional function that returns the weight of an edge from its value. Without it, every edge weighs 1 and the path with the fewest edges is found.
     * @returns {GraphPath<TNode> | null} The path and its distance, or null if {@link goal} cannot be reached.
     * @throws {InvalidArgumentException} If {@link weight} returns a negative number or NaN.
     */
    shortestPath(start: TNode, goal: TNode, weight?: (value: TEdge, source: TNode, target: TNode) => number): GraphPath<TNode> | null;
}
