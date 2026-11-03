import { describe, expect, test } from "vitest";
import { UndirectedGraph } from "../../src/graph/UndirectedGraph";

describe("UndirectedGraph", () => {
    describe("#addEdge()", () => {
        test("should connect both ends with one edge", () => {
            const graph = new UndirectedGraph<number, string>();
            expect(graph.addEdge(1, 2, "x")).toBe(true);
            expect(graph.addEdge(2, 1, "y")).toBe(false);
            expect(graph.edgeCount()).toBe(1);
            expect(graph.getEdge(1, 2)).toBe("y");
            expect(graph.getEdge(2, 1)).toBe("y");
            expect(graph.containsEdge(2, 1)).toBe(true);
        });
    });

    describe("#edges()", () => {
        test("should yield each edge once, including self-loops", () => {
            const graph = new UndirectedGraph<number>([[1, 2], [2, 3], [3, 1], [3, 3]]);
            const edges = graph.edges().select(e => [e.source, e.target]).toArray();
            expect(edges).toHaveLength(4);
            expect(graph.edgeCount()).toBe(4);
            expect(edges).toContainEqual([3, 3]);
        });
    });

    describe("#degree()", () => {
        test("should count the edges touching a node", () => {
            const graph = new UndirectedGraph<number>([[1, 2], [1, 3], [1, 1]]);
            expect(graph.degree(1)).toBe(3);
            expect(graph.degree(2)).toBe(1);
            expect(graph.degree(9)).toBe(0);
        });
    });

    describe("#removeEdge()", () => {
        test("should remove the edge from either end", () => {
            const graph = new UndirectedGraph<number>([[1, 2], [2, 3]]);
            expect(graph.removeEdge(2, 1)).toBe(true);
            expect(graph.containsEdge(1, 2)).toBe(false);
            expect(graph.removeEdge(1, 2)).toBe(false);
            expect(graph.edgeCount()).toBe(1);
        });
    });

    describe("#removeNode()", () => {
        test("should remove the node and its edges, including a self-loop", () => {
            const graph = new UndirectedGraph<number>([[1, 2], [1, 3], [1, 1], [2, 3]]);
            expect(graph.removeNode(1)).toBe(true);
            expect(graph.edgeCount()).toBe(1);
            expect(graph.edges().count()).toBe(1);
            expect(graph.degree(2)).toBe(1);
            expect(graph.toArray()).toEqual([2, 3]);
        });
    });

    describe("#connectedComponents()", () => {
        test("should group connected nodes", () => {
            const graph = new UndirectedGraph<string>([["a", "b"], ["c", "d"], ["b", "e"]]);
            graph.addNode("f");
            expect(graph.connectedComponents().toArray()).toEqual([["a", "b", "e"], ["c", "d"], ["f"]]);
        });
    });

    describe("traversal", () => {
        test("should follow edges in both directions", () => {
            const graph = new UndirectedGraph<number, number>([[1, 2, 5], [2, 3, 1], [3, 4, 1], [1, 4, 9]]);
            expect(graph.breadthFirst(3).toArray()).toEqual([3, 2, 4, 1]);
            expect(graph.shortestPath(4, 1)).toEqual({ distance: 1, path: [4, 1] });
            expect(graph.shortestPath(4, 1, w => w)).toEqual({ distance: 7, path: [4, 3, 2, 1] });
        });
    });
});
