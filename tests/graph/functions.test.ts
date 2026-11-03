import { describe, expect, test } from "vitest";
import { breadthFirst } from "../../src/graph/functions/breadthFirst";
import { depthFirst } from "../../src/graph/functions/depthFirst";
import { shortestPath } from "../../src/graph/functions/shortestPath";
import { stronglyConnectedComponents } from "../../src/graph/functions/stronglyConnectedComponents";
import { topologicalSort } from "../../src/graph/functions/topologicalSort";
import { CycleDetectedException } from "../../src/shared/CycleDetectedException";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";

type Point = { x: number; y: number };

const graphOf = <TNode>(edges: Array<[TNode, TNode[]]>): (node: TNode) => TNode[] => {
    const map = new Map(edges);
    return node => map.get(node) ?? [];
};

const pointKey = (p: Point): string => `${p.x},${p.y}`;

// A 4 x 3 grid with walls at (1, 0) and (1, 1).
const gridNeighbours = (p: Point): Point[] => [
    { x: p.x + 1, y: p.y }, { x: p.x - 1, y: p.y }, { x: p.x, y: p.y + 1 }, { x: p.x, y: p.y - 1 }
].filter(q => q.x >= 0 && q.x < 4 && q.y >= 0 && q.y < 3 && !(q.x === 1 && q.y < 2));

describe("Graph functions", () => {
    describe("#breadthFirst()", () => {
        test("should visit nodes level by level, each once", () => {
            const neighbours = graphOf([[1, [2, 3]], [2, [4, 1]], [3, [4, 5]], [4, [6]], [5, []], [6, [1]]]);
            expect(breadthFirst(1, neighbours).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
        });
        test("should be lazy and re-enumerable", () => {
            let calls = 0;
            const naturals = breadthFirst(0, (n: number) => {
                ++calls;
                return [n + 1];
            });
            expect(naturals.take(3).toArray()).toEqual([0, 1, 2]);
            expect(calls).toBeLessThanOrEqual(3);
            expect(naturals.first(n => n > 10)).toBe(11);
        });
        test("should identify nodes by key", () => {
            const reachable = breadthFirst({ x: 0, y: 0 }, gridNeighbours, pointKey).select(pointKey).toArray();
            expect(reachable).toHaveLength(10);
            expect(new Set(reachable).size).toBe(10);
            expect(reachable[0]).toBe("0,0");
        });
    });

    describe("#depthFirst()", () => {
        test("should visit nodes in recursive pre-order", () => {
            const neighbours = graphOf([[1, [2, 5]], [2, [3, 4]], [3, [1]], [4, []], [5, [4, 6]], [6, []]]);
            expect(depthFirst(1, neighbours).toArray()).toEqual([1, 2, 3, 4, 5, 6]);
        });
        test("should handle very deep graphs without overflowing the stack", () => {
            const last = depthFirst(0, (n: number) => n < 200000 ? [n + 1] : []).last();
            expect(last).toBe(200000);
        });
        test("should identify nodes by key", () => {
            const order = depthFirst({ x: 0, y: 0 }, gridNeighbours, pointKey).select(pointKey).toArray();
            expect(order.slice(0, 4)).toEqual(["0,0", "0,1", "0,2", "1,2"]);
            expect(order).toHaveLength(10);
        });
    });

    describe("#topologicalSort()", () => {
        test("should place dependencies before dependents", () => {
            const dependsOn = graphOf([["app", ["lib", "utils"]], ["lib", ["utils", "core"]], ["utils", ["core"]], ["core", []]]);
            const order = topologicalSort(["app"], dependsOn).toArray();
            expect(order).toEqual(["core", "utils", "lib", "app"]);
        });
        test("should keep the input order for independent nodes", () => {
            expect(topologicalSort(["c", "a", "b"], () => []).toArray()).toEqual(["c", "a", "b"]);
        });
        test("should report a cycle before yielding anything", () => {
            const dependsOn = graphOf([["a", ["b"]], ["b", ["c"]], ["c", ["a"]], ["d", []]]);
            const yielded: string[] = [];
            let error: unknown = null;
            try {
                for (const node of topologicalSort(["d", "a"], dependsOn)) {
                    yielded.push(node);
                }
            } catch (e) {
                error = e;
            }
            expect(yielded).toEqual([]);
            expect(error).toBeInstanceOf(CycleDetectedException);
            expect((error as CycleDetectedException<string>).cycle).toEqual(["a", "b", "c", "a"]);
        });
        test("should report a self-dependency", () => {
            expect(() => topologicalSort([1], () => [1]).toArray()).toThrow(CycleDetectedException);
        });
        test("should sort long chains without overflowing the stack", () => {
            const order = topologicalSort([100000], (n: number) => n > 0 ? [n - 1] : []).toArray();
            expect(order).toHaveLength(100001);
            expect(order[0]).toBe(0);
        });
    });

    describe("#shortestPath()", () => {
        const roads = graphOf([["a", ["b", "c"]], ["b", ["d"]], ["c", ["d", "e"]], ["d", ["e"]], ["e", []], ["f", ["a"]]]);
        const lengths = new Map([["a-b", 1], ["a-c", 4], ["b-d", 1], ["c-d", 1], ["c-e", 1], ["d-e", 5]]);
        const weight = (from: string, to: string): number => lengths.get(`${from}-${to}`) as number;
        test("should find the path with the fewest edges without weights", () => {
            expect(shortestPath("a", "e", roads)).toEqual({ distance: 2, path: ["a", "c", "e"] });
        });
        test("should find the lightest path with weights", () => {
            expect(shortestPath("a", "e", roads, weight)).toEqual({ distance: 5, path: ["a", "c", "e"] });
            expect(shortestPath("a", "d", roads, weight)).toEqual({ distance: 2, path: ["a", "b", "d"] });
        });
        test("should return a zero-length path from a node to itself", () => {
            expect(shortestPath("a", "a", roads)).toEqual({ distance: 0, path: ["a"] });
            expect(shortestPath("a", "a", roads, weight)).toEqual({ distance: 0, path: ["a"] });
        });
        test("should return null when the goal is unreachable", () => {
            expect(shortestPath("a", "f", roads)).toBeNull();
            expect(shortestPath("a", "f", roads, weight)).toBeNull();
        });
        test("should reject negative weights", () => {
            expect(() => shortestPath("a", "e", roads, () => -1)).toThrow(InvalidArgumentException);
            expect(() => shortestPath("a", "e", roads, () => NaN)).toThrow(InvalidArgumentException);
        });
        test("should route around walls on a grid with keyed nodes", () => {
            const route = shortestPath({ x: 0, y: 0 }, { x: 2, y: 0 }, gridNeighbours, undefined, pointKey);
            expect(route?.distance).toBe(6);
            expect(route?.path.map(pointKey)).toEqual(["0,0", "0,1", "0,2", "1,2", "2,2", "2,1", "2,0"]);
            const weighted = shortestPath({ x: 0, y: 0 }, { x: 2, y: 0 }, gridNeighbours, () => 2, pointKey);
            expect(weighted?.distance).toBe(12);
        });
    });

    describe("#stronglyConnectedComponents()", () => {
        test("should group nodes that reach each other, sinks first", () => {
            const neighbours = graphOf([[1, [2]], [2, [3]], [3, [1, 4]], [4, [5]], [5, [4, 6]], [6, []], [7, [6]]]);
            const components = stronglyConnectedComponents([1, 7], neighbours).toArray();
            expect(components).toEqual([[6], [4, 5], [1, 2, 3], [7]]);
        });
        test("should handle self-loops and isolated nodes", () => {
            const components = stronglyConnectedComponents([1, 2], (n: number) => n === 1 ? [1] : []).toArray();
            expect(components).toEqual([[1], [2]]);
        });
        test("should handle very deep graphs without overflowing the stack", () => {
            const components = stronglyConnectedComponents([0], (n: number) => [(n + 1) % 100000]).toArray();
            expect(components).toHaveLength(1);
            expect(components[0]).toHaveLength(100000);
        });
    });
});
