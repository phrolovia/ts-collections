interface ImmutableTrieChild<TKey, TValue, TToken> {
    readonly key: TToken;
    readonly node: ImmutableTrieNode<TKey, TValue, TToken>;
}

export class ImmutableTrieNode<TKey, TValue, TToken> {
    public readonly children: ReadonlyArray<ImmutableTrieChild<TKey, TValue, TToken>>;
    public readonly isTerminal: boolean;
    public readonly key: TKey | null;
    public readonly value: TValue | null;

    public constructor(
        children: ReadonlyArray<ImmutableTrieChild<TKey, TValue, TToken>> = [],
        isTerminal: boolean = false,
        key: TKey | null = null,
        value: TValue | null = null
    ) {
        this.children = children;
        this.isTerminal = isTerminal;
        this.key = key;
        this.value = value;
    }
}
