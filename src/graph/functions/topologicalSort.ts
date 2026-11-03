import { Enumerator } from "../../enumerator/Enumerator";
import type { IEnumerable } from "../../enumerator/IEnumerable";
import { CycleDetectedException } from "../../shared/CycleDetectedException";
import type { Selector } from "../../shared/Selector";
import { nodeKey } from "../helpers/nodeKey";

const VISITING = 1;
const DONE = 2;

/**
 * Returns a deferred sequence of nodes ordered so that every node comes after the nodes it depends on.
 * @template TNode The type of the nodes.
 * @param nodes The nodes to order. Dependencies that are not in {@link nodes} are included as well.
 * @param dependencies Returns the nodes that a node depends on, which must come before it.
 * @param keySelector Optional selector that returns the key a node is identified by. Without it, nodes are compared with Object.is semantics.
 * @returns {IEnumerable<TNode>} Every node once, dependencies first.
 * @throws {CycleDetectedException} If the dependencies form a cycle. The exception's `cycle` lists the nodes of one cycle.
 * @remarks The whole order is computed when enumeration starts, so a cycle is reported before any node is yielded. Independent nodes keep the order of {@link nodes}. The sort runs in O(V + E) time and is iterative, so long dependency chains do not overflow the call stack.
 * @example
 * ```typescript
 * const dependsOn = new Map([["app", ["lib", "utils"]], ["lib", ["utils"]], ["utils", []]]);
 * const order = topologicalSort(["app"], n => dependsOn.get(n) ?? []).toArray();
 * console.log(order); // ["utils", "lib", "app"]
 * ```
 */
export const topologicalSort = <TNode>(nodes: Iterable<TNode>, dependencies: Selector<TNode, Iterable<TNode>>, keySelector?: Selector<TNode, unknown>): IEnumerable<TNode> => {
    return new Enumerator(() => sortTopologically(nodes, dependencies, nodeKey(keySelector)));
};

const sortTopologically = <TNode>(nodes: Iterable<TNode>, dependencies: Selector<TNode, Iterable<TNode>>, keyOf: (node: TNode) => unknown): TNode[] => {
    const states = new Map<unknown, number>();
    const order: TNode[] = [];
    for (const root of nodes) {
        const rootKey = keyOf(root);
        if (states.has(rootKey)) {
            continue;
        }
        states.set(rootKey, VISITING);
        const path: TNode[] = [root];
        const keys: unknown[] = [rootKey];
        const pending: Iterator<TNode>[] = [dependencies(root)[Symbol.iterator]()];
        while (pending.length > 0) {
            const next = pending[pending.length - 1].next();
            if (next.done) {
                pending.pop();
                states.set(keys.pop(), DONE);
                order.push(path.pop() as TNode);
                continue;
            }
            const key = keyOf(next.value);
            const state = states.get(key);
            if (state === DONE) {
                continue;
            }
            if (state === VISITING) {
                throw new CycleDetectedException([...path.slice(keys.findIndex(k => Object.is(k, key))), next.value]);
            }
            states.set(key, VISITING);
            path.push(next.value);
            keys.push(key);
            pending.push(dependencies(next.value)[Symbol.iterator]());
        }
    }
    return order;
};
