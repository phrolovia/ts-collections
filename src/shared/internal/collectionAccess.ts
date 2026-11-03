/**
 * Lets the standalone functions answer from a collection's own index or size instead of iterating it.
 * The collection classes register themselves here, because importing them into the functions would
 * create an import cycle. Only operations whose result cannot differ from iterating are dispatched.
 */

// A class, abstract or with a non-public constructor, recognised through its prototype.
type CollectionType = { readonly prototype: object };

export type SizedSource = { size(): number };
export type IndexedSource<TElement> = SizedSource & { get(index: number): TElement };
export type HashedSetSource<TElement> = { contains(element: TElement): boolean };

const sizedTypes: CollectionType[] = [];
const indexedTypes: CollectionType[] = [];
const hashedSetTypes: CollectionType[] = [];

const isAny = (source: unknown, types: CollectionType[]): boolean => {
    for (const type of types) {
        if (Object.prototype.isPrototypeOf.call(type.prototype, source as object)) {
            return true;
        }
    }
    return false;
};

// size() returns the number of elements that iteration yields, in O(1).
export const registerSizedType = (type: CollectionType): void => {
    sizedTypes.push(type);
};

// get(index) returns the element that iteration yields at that position, for 0 <= index < size().
export const registerIndexedType = (type: CollectionType): void => {
    indexedTypes.push(type);
};

// contains(element) hashes with SameValueZero, like a native Set.
export const registerHashedSetType = (type: CollectionType): void => {
    hashedSetTypes.push(type);
};

export const asSized = (source: unknown): SizedSource | null =>
    isAny(source, sizedTypes) ? source as SizedSource : null;

export const asIndexed = <TElement>(source: Iterable<TElement>): IndexedSource<TElement> | null =>
    isAny(source, indexedTypes) ? source as unknown as IndexedSource<TElement> : null;

export const asHashedSet = <TElement>(source: Iterable<TElement>): HashedSetSource<TElement> | null =>
    isAny(source, hashedSetTypes) ? source as unknown as HashedSetSource<TElement> : null;
