// Compiled with the oldest TypeScript version the package supports, against the built declarations,
// to catch declarations that use syntax or types that version does not understand. The package is
// imported by its own name, so it resolves through package.json "exports" as it does for consumers.
import {
    BiMap,
    DirectedGraph,
    Dictionary,
    DisjointSet,
    Enumerable,
    IntervalTree,
    List,
    LruCache,
    MultiSet,
    SortedSet,
    breadthFirst,
    from,
    shortestPath,
    type GraphPath,
    type IEnumerable
} from "@mirei/ts-collections";

const numbers: IEnumerable<number> = from([3, 1, 2]).where(n => n > 1).orderBy(n => n);
const list: List<string> = new List(["a", "b"]);
const sorted: SortedSet<number> = numbers.toSortedSet();
const dictionary: Dictionary<string, number> = list.toDictionary(s => s, s => s.length);
const grouped: IEnumerable<string> = Enumerable.range(0, 10).groupBy(n => n % 3).select(g => `${g.key}:${g.count()}`);

const graph = new DirectedGraph<string, number>([["a", "b", 1], ["b", "c", 2]]);
const path: GraphPath<string> | null = graph.shortestPath("a", "c", weight => weight);
const reachable: number[] = breadthFirst(1, n => n < 5 ? [n + 1] : []).toArray();
const route: GraphPath<number> | null = shortestPath(1, 3, n => [n + 1]);

const bag = new MultiSet(["x", "y", "x"]);
const cache = new LruCache<string, number>(2, (key: string, value: number) => void [key, value]);
cache.setCapacity(3);
const codes = new BiMap<string, number>([["one", 1]]);
const groups = new DisjointSet([1, 2, 3]);
const intervals = new IntervalTree<number, string>([[1, 5, "a"]]);

export const results = [
    numbers, sorted, dictionary, grouped, path, reachable, route,
    bag.occurrences("x"), cache.capacity, codes.inverse().get(1), groups.merge(1, 2), intervals.containing(3).toArray()
];
