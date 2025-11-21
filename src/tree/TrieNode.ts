interface TrieChild<TKey, TValue, TToken> {
    readonly key: TToken;
    readonly node: TrieNode<TKey, TValue, TToken>;
}

export class TrieNode<TKey, TValue, TToken> {
    public children: Array<TrieChild<TKey, TValue, TToken>> = [];
    public isTerminal: boolean = false;
    public key: TKey | null = null;
    public value: TValue | null = null;
}
