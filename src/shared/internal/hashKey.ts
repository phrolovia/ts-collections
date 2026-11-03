const objectIds = new WeakMap<object, number>();
let nextObjectId = 1;

/**
 * Computes a 32-bit hash for a key, consistent with the SameValueZero equality used by `Map`:
 * keys that `Map` treats as the same key always produce the same hash.
 * Objects and functions are hashed by identity through an id assigned on first use.
 */
export const hashKey = (key: unknown): number => {
    switch (typeof key) {
        case "number":
            return mix(Number.isInteger(key) ? key | 0 : hashString(String(key)));
        case "string":
            return mix(hashString(key));
        case "boolean":
            return key ? 0x4cf5ad43 : 0x2b2ae35d;
        case "bigint":
            return mix(hashString(key.toString()));
        case "symbol":
            // Symbols cannot be WeakMap keys under ES2022; equal hashes for equal descriptions are resolved by key equality.
            return mix(hashString(key.description ?? ""));
        case "undefined":
            return 0x1b873593;
        case "object":
            if (key === null) {
                return 0x0e6546b6;
            }
            return mix(objectId(key));
        case "function":
            return mix(objectId(key));
    }
};

/**
 * SameValueZero equality, the key equality used by `Map` and therefore by {@link Dictionary}.
 */
export const sameValueZero = (a: unknown, b: unknown): boolean => {
    return a === b || (a !== a && b !== b);
};

const hashString = (value: string): number => {
    let hash = 0x811c9dc5;
    for (let index = 0; index < value.length; ++index) {
        hash = Math.imul(hash ^ value.charCodeAt(index), 0x01000193);
    }
    return hash | 0;
};

// MurmurHash3 finalizer, spreads sequential ids and integers across all trie branches.
const mix = (hash: number): number => {
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 0x85ebca6b);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 0xc2b2ae35);
    hash ^= hash >>> 16;
    return hash | 0;
};

const objectId = (key: object): number => {
    let id = objectIds.get(key);
    if (id === undefined) {
        id = nextObjectId++;
        objectIds.set(key, id);
    }
    return id;
};
