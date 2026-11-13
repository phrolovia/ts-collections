/**
 * Lets the standalone functions answer from a collection's own index or size instead of iterating it.
 * A collection opts in by declaring one of the getters below in its class body. The functions cannot
 * import the collection classes, because that would create an import cycle, and registering the classes
 * when their modules load would keep every collection in a bundle that never uses it.
 * Only operations whose result cannot differ from iterating are dispatched.
 */

export type SizedSource = { size(): number };
export type IndexedSource<TElement> = SizedSource & { get(index: number): TElement };
export type HashedSetSource<TElement> = { contains(element: TElement): boolean };

// Declared by the collections as `protected get <name>(): true`, so subclasses inherit them.
type CollectionTraits = {
    // size() returns the number of elements that iteration yields, in O(1).
    readonly isSizedSource?: unknown;
    // get(index) returns the element that iteration yields at that position, for 0 <= index < size().
    readonly isIndexedSource?: unknown;
    // contains(element) hashes with SameValueZero, like a native Set.
    readonly isHashedSetSource?: unknown;
};

type MaybeTraits = CollectionTraits | null | undefined;

export const asSized = (source: unknown): SizedSource | null =>
    (source as MaybeTraits)?.isSizedSource === true ? source as SizedSource : null;

export const asIndexed = <TElement>(source: Iterable<TElement>): IndexedSource<TElement> | null =>
    (source as MaybeTraits)?.isIndexedSource === true ? source as unknown as IndexedSource<TElement> : null;

export const asHashedSet = <TElement>(source: Iterable<TElement>): HashedSetSource<TElement> | null =>
    (source as MaybeTraits)?.isHashedSetSource === true ? source as unknown as HashedSetSource<TElement> : null;
