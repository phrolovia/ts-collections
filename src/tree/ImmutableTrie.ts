import { Selector } from "../shared/Selector";
import { EqualityComparator } from "../shared/EqualityComparator";
import { isIterable } from "../utils/isIterable";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { Comparators } from "../shared/Comparators";
import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import { ImmutableTrieNode } from "./ImmutableTrieNode";
import { IEnumerable } from "../enumerator/IEnumerable";
import { from } from "../enumerator/functions/from";

export class ImmutableTrie<TKey, TValue, TToken = TKey> extends AbstractEnumerable<[TKey, TValue]> {
    readonly #root: ImmutableTrieNode<TKey, TValue, TToken>;
    readonly #tokenComparator: EqualityComparator<TToken> = Comparators.equalityComparator;
    readonly #tokenizer: Selector<TKey, Iterable<TToken>>;

    private constructor(
        tokenizer: Selector<TKey, Iterable<TToken>> | null = null,
        tokenComparator?: EqualityComparator<TToken>,
        root?: ImmutableTrieNode<TKey, TValue, TToken>
    ) {
        super();
        if (tokenizer) {
            this.#tokenizer = tokenizer;
        } else {
            this.#tokenizer = (key: TKey) => {
                if (isIterable(key)) {
                    return key as Iterable<TToken>;
                }
                throw new InvalidArgumentException(
                    "ImmutableTrie: key is not iterable and a tokenizer was not provided."
                );
            };
        }

        if (tokenComparator) {
            this.#tokenComparator = tokenComparator;
        }
        this.#root = root ?? new ImmutableTrieNode<TKey, TValue, TToken>();
    }

    public static create<TKey, TValue, TToken = TKey>(
        tokenizer: Selector<TKey, Iterable<TToken>> | null = null,
        tokenComparator?: EqualityComparator<TToken>
    ): ImmutableTrie<TKey, TValue, TToken> {
        return new ImmutableTrie(tokenizer, tokenComparator);
    }

    *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {
        yield* this.#traverseNode(this.#root);
    }

    /**
     * Deletes a key from the trie.
     * Returns a new ImmutableTrie instance; does not modify the current one.
     * If the key was not found, returns the current instance.
     * @param key The key to delete.
     * @returns A new ImmutableTrie instance with the key deleted, or the current instance if the key was not found.
     */
    public delete(key: TKey): ImmutableTrie<TKey, TValue, TToken> {
        const tokens = Array.from(this.#tokenizer(key));
        const newRoot = this.#deletePath(this.#root, tokens, 0, true);

        if (newRoot === this.#root) {
            // No deletion happened
            return this;
        }

        // If everything got pruned (root became empty), newRoot can be null
        const finalRoot = newRoot ?? new ImmutableTrieNode<TKey, TValue, TToken>();
        return new ImmutableTrie(this.#tokenizer, this.#tokenComparator, finalRoot);
    }

    /**
     * Gets the value associated with a key.
     * @param key The key to retrieve.
     * @returns The value associated with the key, or null if not found.
     */
    public get(key: TKey): TValue | null {
        let node: ImmutableTrieNode<TKey, TValue, TToken> | null = this.#root;

        for (const token of this.#tokenizer(key)) {
            node = this.#findChild(node, token);
            if (!node) {
                return null;
            }
        }

        return node.isTerminal ? node.value : null;
    }

    /**
     * Checks if a key exists in the trie.
     * @param key The key to check.
     * @returns True if the key exists, false otherwise.
     */
    public has(key: TKey): boolean {
        let node: ImmutableTrieNode<TKey, TValue, TToken> | null = this.#root;
        for (const token of this.#tokenizer(key)) {
            node = this.#findChild(node, token);
            if (!node) {
                return false;
            }
        }
        return node.isTerminal;
    }

    /**
     * Inserts a key-value pair into the trie.
     * Returns a new ImmutableTrie instance; does not modify the current one.
     * @param key The key to insert.
     * @param value The value to associate with the key.
     * @returns A new ImmutableTrie instance with the key-value pair inserted.
     */
    public insert(key: TKey, value: TValue): ImmutableTrie<TKey, TValue, TToken> {
        const tokens = Array.from(this.#tokenizer(key));
        const newRoot = this.#insertPath(this.#root, tokens, 0, key, value);
        if (newRoot === this.#root) {
            // No structural change (only possible if you add an optimization),
            // so we can safely return this instance.
            return this;
        }
        return new ImmutableTrie(this.#tokenizer, this.#tokenComparator, newRoot);
    }

    /**
     * Yields all values associated with a key prefix.
     * @param prefix The key prefix to search for.
     * @returns An enumerable of values associated with keys that start with the given prefix.
     */
    public prefix(prefix: TKey): IEnumerable<TValue> {
        return from(this.#prefix(prefix));
    }

    #createPath(
        tokens: readonly TToken[],
        index: number,
        key: TKey,
        value: TValue
    ): ImmutableTrieNode<TKey, TValue, TToken> {
        if (index === tokens.length) {
            // Leaf node, terminal for this key
            return new ImmutableTrieNode([], true, key, value);
        }

        const childNode = this.#createPath(tokens, index + 1, key, value);
        const entry = { key: tokens[index], node: childNode };
        return new ImmutableTrieNode([entry], false, null, null);
    }

    *#deepValues(node: ImmutableTrieNode<TKey, TValue, TToken>): IterableIterator<TValue> {
        if (node.isTerminal && node.value !== null) {
            yield node.value;
        }
        for (const child of node.children) {
            yield* this.#deepValues(child.node);
        }
    }

    #deletePath(
        node: ImmutableTrieNode<TKey, TValue, TToken>,
        tokens: readonly TToken[],
        index: number,
        isRoot: boolean
    ): ImmutableTrieNode<TKey, TValue, TToken> | null {
        if (index === tokens.length) {
            // We are at the node for the full key
            if (!node.isTerminal) {
                // Key not present as a terminal here: nothing to delete
                return node;
            }

            if (node.children.length === 0 && !isRoot) {
                // No children and not root -> this node can be pruned
                return null;
            }

            // Unmark terminal but keep children
            return new ImmutableTrieNode(node.children, false, null, null);
        }

        const token = tokens[index];
        const children = node.children;
        let childIndex = -1;

        for (let i = 0; i < children.length; i++) {
            if (this.#tokenComparator(children[i].key, token)) {
                childIndex = i;
                break;
            }
        }

        if (childIndex === -1) {
            // Child for this token doesn't exist -> key isn't present; no change
            return node;
        }

        const childEntry = children[childIndex];
        const updatedChildNode = this.#deletePath(
            childEntry.node,
            tokens,
            index + 1,
            false
        );

        if (updatedChildNode === childEntry.node) {
            // No structural change below
            return node;
        }

        if (updatedChildNode === null) {
            // Child subtree was pruned; remove that child
            const newChildren = children
                .slice(0, childIndex)
                .concat(children.slice(childIndex + 1));

            if (!node.isTerminal && newChildren.length === 0 && !isRoot) {
                // This node also becomes useless (no children, not terminal)
                return null;
            }

            return new ImmutableTrieNode(newChildren, node.isTerminal, node.key, node.value);
        }

        // Child was changed but not pruned
        const newChildren = children.slice();
        newChildren[childIndex] = { key: childEntry.key, node: updatedChildNode };
        return new ImmutableTrieNode(newChildren, node.isTerminal, node.key, node.value);
    }

    #findChild(
        node: ImmutableTrieNode<TKey, TValue, TToken>,
        token: TToken
    ): ImmutableTrieNode<TKey, TValue, TToken> | null {
        for (const child of node.children) {
            if (this.#tokenComparator(child.key, token)) {
                return child.node;
            }
        }
        return null;
    }

    #insertPath(
        node: ImmutableTrieNode<TKey, TValue, TToken>,
        tokens: readonly TToken[],
        index: number,
        key: TKey,
        value: TValue
    ): ImmutableTrieNode<TKey, TValue, TToken> {
        if (index === tokens.length) {
            // End of key: mark terminal and store key + value.
            // We always create a new node here for immutability.
            return new ImmutableTrieNode(node.children, true, key, value);
        }

        const token = tokens[index];
        const children = node.children;
        let childIndex = -1;

        for (let i = 0; i < children.length; i++) {
            if (this.#tokenComparator(children[i].key, token)) {
                childIndex = i;
                break;
            }
        }

        if (childIndex >= 0) {
            const existingChild = children[childIndex];
            const updatedChildNode = this.#insertPath(
                existingChild.node,
                tokens,
                index + 1,
                key,
                value
            );

            if (updatedChildNode === existingChild.node) {
                // No structural change below, so we can reuse the current node as-is.
                return node;
            }

            const newChildren = children.slice();
            newChildren[childIndex] = { key: existingChild.key, node: updatedChildNode };
            return new ImmutableTrieNode(newChildren, node.isTerminal, node.key, node.value);
        } else {
            // No existing child for this token: create the whole remaining path.
            const newChildNode = this.#createPath(tokens, index + 1, key, value);
            const newChildren = children.concat({ key: token, node: newChildNode });
            return new ImmutableTrieNode(newChildren, node.isTerminal, node.key, node.value);
        }
    }

    *#prefix(prefix: TKey): IterableIterator<TValue> {
        let node: ImmutableTrieNode<TKey, TValue, TToken> | null = this.#root;
        for (const token of this.#tokenizer(prefix)) {
            node = this.#findChild(node, token);
            if (!node) {
                return;
            }
        }
        yield* this.#deepValues(node);
    }

    *#traverseNode(
        node: ImmutableTrieNode<TKey, TValue, TToken>
    ): IterableIterator<[TKey, TValue]> {
        if (node.isTerminal && node.key !== null && node.value !== null) {
            // Yield the original key (not the token array)
            yield [node.key, node.value];
        }
        for (const child of node.children) {
            yield* this.#traverseNode(child.node);
        }
    }
}
