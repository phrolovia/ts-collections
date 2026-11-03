import { identityKey } from "../../shared/internal/membership";
import type { Selector } from "../../shared/Selector";

/**
 * Returns the function that maps a node to the key it is tracked by. Without a key selector a node
 * is its own key; keys are compared with Object.is semantics either way.
 */
export const nodeKey = <TNode>(keySelector?: Selector<TNode, unknown>): (node: TNode) => unknown =>
    keySelector ? (node: TNode) => identityKey(keySelector(node)) : identityKey;
