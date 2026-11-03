/**
 * An edge of a graph and the value stored on it.
 */
export interface GraphEdge<TNode, TEdge> {
    /**
     * The node the edge starts from. For an undirected edge, one of its two ends.
     */
    readonly source: TNode;

    /**
     * The node the edge leads to. For an undirected edge, the other end.
     */
    readonly target: TNode;

    /**
     * The value stored on the edge, such as a weight or a label.
     */
    readonly value: TEdge;
}
