export class CycleDetectedException<TNode = unknown> extends Error {
    /**
     * The nodes of the cycle in order, starting and ending with the same node.
     */
    public readonly cycle: readonly TNode[];

    public constructor(cycle: readonly TNode[], message: string = "The graph contains a cycle.") {
        super(message);
        this.cycle = cycle;
    }
}
