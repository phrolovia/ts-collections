import { TrieNode } from "./TrieNode";
import { Selector } from "../shared/Selector";
import { EqualityComparator } from "../shared/EqualityComparator";
import { isIterable } from "../utils/isIterable";
import { InvalidArgumentException } from "../shared/InvalidArgumentException";
import { Comparators } from "../shared/Comparators";
import { AbstractEnumerable } from "../enumerator/AbstractEnumerable";
import { IEnumerable } from "../enumerator/IEnumerable";
import { from } from "../enumerator/functions/from";

export class Trie<TKey, TValue, TToken = TKey> extends AbstractEnumerable<[TKey, TValue]> {
    readonly #root = new TrieNode<TKey, TValue, TToken>();
    readonly #tokenComparator: EqualityComparator<TToken> = Comparators.equalityComparator;
    readonly #tokenizer: Selector<TKey, Iterable<TToken>>;
    #size: number = 0;

    public constructor(
        tokenizer: Selector<TKey, Iterable<TToken>> | null = null,
        tokenComparator?: EqualityComparator<TToken>
    ) {
        super();
        if (tokenizer) {
            this.#tokenizer = tokenizer;
        } else {
            this.#tokenizer = (key: TKey) => {
                if (isIterable(key)) {
                    return key as Iterable<TToken>;
                }
                throw new InvalidArgumentException("Trie: key is not iterable and a tokenizer was not provided.");
            }
        }
        if (tokenComparator) {
            this.#tokenComparator = tokenComparator;
        }
    }

    *[Symbol.iterator](): IterableIterator<[TKey, TValue]> {
        yield* this.#traverseNode(this.#root);
    }

    /**
     * Removes all entries from the trie.
     */
    public clear(): void {
        this.#root.children = [];
        this.#root.isTerminal = false;
        this.#root.key = null;
        this.#root.value = null;
        this.#size = 0;
    }

    /**
     * Deletes a key from the trie.
     * @param key The key to delete.
     * @returns True if the key was found and deleted, false otherwise.
     */
    public delete(key: TKey): boolean {
        const path: Array<{ node: TrieNode<TKey, TValue, TToken>; token: TToken | null }> = [];
        let node = this.#root;

        path.push({ node, token: null });

        for (const token of this.#tokenizer(key)) {
            const child = this.#findChild(node, token);
            if (!child) {
                return false;
            }
            node = child;
            path.push({ node, token });
        }

        if (!node.isTerminal) {
            return false;
        }

        node.isTerminal = false;
        node.value = null;
        node.key = null;
        this.#size--;

        for (let i = path.length - 1; i > 0; i--) {
            const { node: current, token } = path[i];
            const { node: parent } = path[i - 1];
            if (current.isTerminal || current.children.length > 0) {
                break;
            }
            const children = parent.children;
            const index = children.findIndex(c => this.#tokenComparator(c.key, token as TToken));
            if (index >= 0) {
                children.splice(index, 1);
            }
        }
        return true;
    }

    /**
     * Gets the value associated with a key.
     * @param key The key to get the value for.
     * @returns The value associated with the key, or null if the key is not found.
     */
    public get(key: TKey): TValue | null {
        let node = this.#root;
        for (const token of this.#tokenizer(key)) {
            const child = this.#findChild(node, token);
            if (!child) {
                return null;
            }
            node = child;
        }
        return node.isTerminal ? node.value : null;
    }

    /**
     * Checks if the trie contains a key.
     * @param key The key to check.
     * @returns True if the key exists, false otherwise.
     */
    public has(key: TKey): boolean {
        let node = this.#root;
        for (const token of this.#tokenizer(key)) {
            const child = this.#findChild(node, token);
            if (!child) {
                return false;
            }
            node = child;
        }
        return node.isTerminal;
    }

    /**
    * Inserts a key-value pair into the trie.
     * @param key The key to insert.
     * @param value The value associated with the key.
     */
    public insert(key: TKey, value: TValue): void {
        let node = this.#root;
        for (const token of this.#tokenizer(key)) {
            node = this.#getOrAddChild(node, token);
        }
        const wasTerminal = node.isTerminal;
        node.isTerminal = true;
        node.key = key;
        node.value = value;
        if (!wasTerminal) {
            this.#size++;
        }
    }

    /**
     * Yields all values with the given prefix.
     * @param prefix The prefix to search for.
     * @returns An iterable iterator of values with the given prefix.
     */
    public prefix(prefix: TKey): IEnumerable<TValue> {
        return from(this.#prefix(prefix));
    }

    /**
     * Gets the number of stored key-value pairs.
     * @returns The number of stored key-value pairs.
     */
    public size(): number {
        return this.#size;
    }

    *#deepValues(node: TrieNode<TKey, TValue, TToken>): IterableIterator<TValue> {
        if (node.isTerminal && node.value !== null) {
            yield node.value;
        }
        for (const child of node.children) {
            yield* this.#deepValues(child.node);
        }
    }

    #findChild(node: TrieNode<TKey, TValue, TToken>, token: TToken): TrieNode<TKey, TValue, TToken> | null {
        for (const child of node.children) {
            if (this.#tokenComparator(child.key, token)) {
                return child.node;
            }
        }
        return null;
    }

    #getOrAddChild(node: TrieNode<TKey, TValue, TToken>, token: TToken): TrieNode<TKey, TValue, TToken> {
        const child = this.#findChild(node, token);
        if (child) {
            return child;
        }
        const newNode = new TrieNode<TKey, TValue, TToken>();
        node.children.push({ key: token, node: newNode });
        return newNode;
    }

    *#prefix(prefix: TKey): IterableIterator<TValue> {
        let node = this.#root;
        for (const token of this.#tokenizer(prefix)) {
            const child = this.#findChild(node, token);
            if (!child) {
                return;
            }
            node = child;
        }
        yield* this.#deepValues(node);
    }

    *#traverseNode(node: TrieNode<TKey, TValue, TToken>): IterableIterator<[TKey, TValue]> {
        if (node.isTerminal && node.key !== null && node.value !== null) {
            yield [node.key, node.value];
        }
        for (const child of node.children) {
            yield* this.#traverseNode(child.node);
        }
    }
}
