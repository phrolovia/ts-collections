import { PriorityQueue } from "../../queue/PriorityQueue";
import { InvalidArgumentException } from "../../shared/InvalidArgumentException";
import type { Selector } from "../../shared/Selector";
import type { GraphPath } from "../GraphPath";
import { nodeKey } from "../helpers/nodeKey";

type Entry<TNode> = {
    readonly distance: number;
    readonly key: unknown;
    readonly node: TNode;
};

/**
 * Finds the shortest path from a start node to a goal node.
 * @template TNode The type of the nodes.
 * @param start The node the path starts from.
 * @param goal The node the path ends at.
 * @param neighbours Returns the nodes that a node has edges to.
 * @param weight Optional function that returns the weight of the edge from its first argument to its second. Without it, every edge weighs 1 and the path with the fewest edges is found.
 * @param keySelector Optional selector that returns the key a node is identified by. Use it when equal nodes are different objects, such as coordinate pairs. Without it, nodes are compared with Object.is semantics.
 * @returns {GraphPath<TNode> | null} The path and its distance, or null if {@link goal} cannot be reached.
 * @throws {InvalidArgumentException} If {@link weight} returns a negative number or NaN.
 * @remarks Without {@link weight} the search is breadth-first and runs in O(V + E) time. With it, the search is Dijkstra's algorithm and runs in O((V + E) log V) time. Either way the search stops as soon as the goal is reached, so only the part of the graph closer than the goal is explored.
 * @example
 * ```typescript
 * const roads = new Map([["a", ["b", "c"]], ["b", ["d"]], ["c", ["d"]], ["d", []]]);
 * const lengths = new Map([["a-b", 5], ["a-c", 1], ["b-d", 1], ["c-d", 2]]);
 * const route = shortestPath("a", "d", n => roads.get(n) ?? [], (from, to) => lengths.get(`${from}-${to}`) ?? Infinity);
 * console.log(route); // { distance: 3, path: ["a", "c", "d"] }
 * ```
 */
export const shortestPath = <TNode>(
    start: TNode,
    goal: TNode,
    neighbours: Selector<TNode, Iterable<TNode>>,
    weight?: (from: TNode, to: TNode) => number,
    keySelector?: Selector<TNode, unknown>
): GraphPath<TNode> | null => {
    const keyOf = nodeKey(keySelector);
    return weight
        ? findWeightedPath(start, keyOf(goal), neighbours, weight, keyOf)
        : findUnweightedPath(start, keyOf(goal), neighbours, keyOf);
};

const buildPath = <TNode>(goal: Entry<TNode>, previous: Map<unknown, Entry<TNode> | null>): GraphPath<TNode> => {
    const path: TNode[] = [];
    for (let entry: Entry<TNode> | null = goal; entry != null; entry = previous.get(entry.key) ?? null) {
        path.push(entry.node);
    }
    return { distance: goal.distance, path: path.reverse() };
};

const findUnweightedPath = <TNode>(
    start: TNode,
    goalKey: unknown,
    neighbours: Selector<TNode, Iterable<TNode>>,
    keyOf: (node: TNode) => unknown
): GraphPath<TNode> | null => {
    const startKey = keyOf(start);
    // Links each reached node to the entry it was reached from.
    const previous = new Map<unknown, Entry<TNode> | null>([[startKey, null]]);
    let current: Entry<TNode>[] = [{ distance: 0, key: startKey, node: start }];
    while (current.length > 0) {
        const next: Entry<TNode>[] = [];
        for (const entry of current) {
            if (Object.is(entry.key, goalKey)) {
                return buildPath(entry, previous);
            }
            for (const neighbour of neighbours(entry.node)) {
                const key = keyOf(neighbour);
                if (!previous.has(key)) {
                    previous.set(key, entry);
                    next.push({ distance: entry.distance + 1, key, node: neighbour });
                }
            }
        }
        current = next;
    }
    return null;
};

const findWeightedPath = <TNode>(
    start: TNode,
    goalKey: unknown,
    neighbours: Selector<TNode, Iterable<TNode>>,
    weight: (from: TNode, to: TNode) => number,
    keyOf: (node: TNode) => unknown
): GraphPath<TNode> | null => {
    const startKey = keyOf(start);
    const distances = new Map<unknown, number>([[startKey, 0]]);
    const previous = new Map<unknown, Entry<TNode> | null>([[startKey, null]]);
    const settled = new Set<unknown>();
    const queue = new PriorityQueue<Entry<TNode>>([{ distance: 0, key: startKey, node: start }], (a, b) => a.distance - b.distance);
    for (let entry = queue.poll(); entry != null; entry = queue.poll()) {
        if (settled.has(entry.key)) {
            continue;
        }
        settled.add(entry.key);
        if (Object.is(entry.key, goalKey)) {
            return buildPath(entry, previous);
        }
        for (const neighbour of neighbours(entry.node)) {
            const edgeWeight = weight(entry.node, neighbour);
            if (!(edgeWeight >= 0)) {
                throw new InvalidArgumentException(`Edge weights must be non-negative numbers, but got ${edgeWeight}.`, "weight");
            }
            const key = keyOf(neighbour);
            const distance = entry.distance + edgeWeight;
            if (!settled.has(key) && distance < (distances.get(key) ?? Infinity)) {
                distances.set(key, distance);
                previous.set(key, entry);
                queue.add({ distance, key, node: neighbour });
            }
        }
    }
    return null;
};
