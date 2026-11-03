/**
 * A path through a graph, as found by a shortest path search.
 */
export interface GraphPath<TNode> {
    /**
     * The total weight of the path's edges, or the number of edges when the search is unweighted.
     */
    readonly distance: number;

    /**
     * The nodes of the path in order, from the start node to the goal node.
     */
    readonly path: readonly TNode[];
}
