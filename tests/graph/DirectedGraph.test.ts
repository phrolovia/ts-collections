import { describe, expect, test } from "vitest";
import { DirectedGraph } from "../../src/graph/DirectedGraph";
import { InvalidArgumentException } from "../../src/shared/InvalidArgumentException";

describe("DirectedGraph", () => {
    const sample = (): DirectedGraph<string, number> => new DirectedGraph<string, number>([
        ["a", "b", 1], ["a", "c", 4], ["b", "c", 2], ["c", "d", 1], ["b", "d", 7]
    ]);

    describe("#addEdge()", () => {
        test("should add missing nodes and count edges once", () => {
            const graph = new DirectedGraph<number>();
            expect(graph.addEdge(1, 2)).toBe(true);
            expect(graph.addEdge(1, 2)).toBe(false);
            expect(graph.nodeCount()).toBe(2);
            expect(graph.edgeCount()).toBe(1);
            expect(graph.containsEdge(1, 2)).toBe(true);
            expect(graph.containsEdge(2, 1)).toBe(false);
        });
        test("should replace the value of an existing edge", () => {
            const graph = sample();
            expect(graph.addEdge("a", "b", 10)).toBe(false);
            expect(graph.getEdge("a", "b")).toBe(10);
            expect(graph.edgeCount()).toBe(5);
        });
    });

    describe("#addNode()", () => {
        test("should add an isolated node once", () => {
            const graph = new DirectedGraph<string>();
            expect(graph.addNode("x")).toBe(true);
            expect(graph.addNode("x")).toBe(false);
            expect(graph.nodes().toArray()).toEqual(["x"]);
            expect(graph.neighbours("x").toArray()).toEqual([]);
        });
    });

    describe("#getEdge()", () => {
        test("should return the value or null", () => {
            const graph = sample();
            expect(graph.getEdge("b", "c")).toBe(2);
            expect(graph.getEdge("c", "b")).toBeNull();
            expect(graph.getEdge("z", "a")).toBeNull();
            const unlabelled = new DirectedGraph<number>([[1, 2]]);
            expect(unlabelled.getEdge(1, 2)).toBeUndefined();
        });
    });

    describe("degrees and neighbours", () => {
        test("should report successors and predecessors", () => {
            const graph = sample();
            expect(graph.neighbours("b").toArray()).toEqual(["c", "d"]);
            expect(graph.predecessors("d").toArray()).toEqual(["c", "b"]);
            expect(graph.outDegree("a")).toBe(2);
            expect(graph.inDegree("c")).toBe(2);
            expect(graph.inDegree("missing")).toBe(0);
            expect(graph.predecessors("missing").toArray()).toEqual([]);
        });
        test("should be live views", () => {
            const graph = sample();
            const successors = graph.neighbours("c");
            graph.addEdge("c", "a");
            expect(successors.toArray()).toEqual(["d", "a"]);
        });
    });

    describe("#edges()", () => {
        test("should yield every edge with its value", () => {
            expect(sample().edges().select(e => `${e.source}${e.target}${e.value}`).toArray())
                .toEqual(["ab1", "ac4", "bc2", "bd7", "cd1"]);
        });
    });

    describe("#removeEdge()", () => {
        test("should remove only that direction", () => {
            const graph = new DirectedGraph<number>([[1, 2], [2, 1]]);
            expect(graph.removeEdge(1, 2)).toBe(true);
            expect(graph.removeEdge(1, 2)).toBe(false);
            expect(graph.containsEdge(2, 1)).toBe(true);
            expect(graph.inDegree(2)).toBe(0);
            expect(graph.edgeCount()).toBe(1);
            expect(graph.nodeCount()).toBe(2);
        });
    });

    describe("#removeNode()", () => {
        test("should remove the node and every edge touching it", () => {
            const graph = sample();
            graph.addEdge("c", "c");
            expect(graph.removeNode("c")).toBe(true);
            expect(graph.removeNode("c")).toBe(false);
            expect(graph.nodes().toArray()).toEqual(["a", "b", "d"]);
            expect(graph.edgeCount()).toBe(2);
            expect(graph.edges().count()).toBe(2);
            expect(graph.inDegree("d")).toBe(1);
            expect(graph.outDegree("a")).toBe(1);
        });
    });

    describe("#clear()", () => {
        test("should remove everything", () => {
            const graph = sample();
            graph.clear();
            expect(graph.nodeCount()).toBe(0);
            expect(graph.edgeCount()).toBe(0);
            graph.addEdge("a", "b");
            expect(graph.inDegree("b")).toBe(1);
        });
    });

    describe("enumeration", () => {
        test("should enumerate nodes in insertion order and support LINQ", () => {
            const graph = sample();
            expect(graph.toArray()).toEqual(["a", "b", "c", "d"]);
            expect(graph.where(n => graph.inDegree(n) === 0).toArray()).toEqual(["a"]);
        });
    });

    describe("traversal", () => {
        test("should traverse breadth- and depth-first", () => {
            const graph = sample();
            expect(graph.breadthFirst("a").toArray()).toEqual(["a", "b", "c", "d"]);
            expect(graph.depthFirst("b").toArray()).toEqual(["b", "c", "d"]);
        });
        test("should find shortest paths by edges or by weight", () => {
            const graph = sample();
            expect(graph.shortestPath("a", "d")).toEqual({ distance: 2, path: ["a", "b", "d"] });
            expect(graph.shortestPath("a", "d", w => w)).toEqual({ distance: 4, path: ["a", "b", "c", "d"] });
            expect(graph.shortestPath("d", "a")).toBeNull();
            expect(() => graph.shortestPath("a", "d", () => -1)).toThrow(InvalidArgumentException);
        });
    });

    describe("ordering and cycles", () => {
        test("should sort topologically", () => {
            const graph = new DirectedGraph<string>([["shirt", "tie"], ["tie", "jacket"], ["trousers", "shoes"], ["trousers", "belt"], ["belt", "jacket"]]);
            graph.addNode("watch");
            const order = graph.topologicalSort().toArray();
            expect(order).toHaveLength(7);
            for (const edge of graph.edges()) {
                expect(order.indexOf(edge.source)).toBeLessThan(order.indexOf(edge.target));
            }
            expect(graph.hasCycle()).toBe(false);
            expect(graph.findCycle()).toBeNull();
        });
        test("should find a cycle following its edges", () => {
            const graph = new DirectedGraph<number>([[1, 2], [2, 3], [3, 4], [4, 2]]);
            expect(graph.hasCycle()).toBe(true);
            const cycle = graph.findCycle() as number[];
            expect(cycle[0]).toBe(cycle[cycle.length - 1]);
            for (let i = 0; i + 1 < cycle.length; ++i) {
                expect(graph.containsEdge(cycle[i], cycle[i + 1])).toBe(true);
            }
            expect(() => graph.topologicalSort().toArray()).toThrow();
        });
        test("should find strongly connected components", () => {
            const graph = new DirectedGraph<number>([[1, 2], [2, 1], [2, 3], [3, 4], [4, 3]]);
            expect(graph.stronglyConnectedComponents().toArray()).toEqual([[3, 4], [1, 2]]);
        });
    });
});
